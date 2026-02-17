/**
 * Storage Image URL Builder
 * Handles image URLs for battery storage products with fallback strategies
 */

const SUPABASE_STORAGE_URL = 'https://mxboigeahudnbigxgefp.supabase.co/storage/v1/object/public/storage-images';

/**
 * Normalize brand names to consistent slugs
 */
const BRAND_SLUG_MAP = {
  'BYD': 'byd',
  'sonnen': 'sonnen',
  'E3/DC': 'e3dc',
  'RCT Power': 'rct-power',
  'SENEC': 'senec',
  'Tesla': 'tesla',
  'LG': 'lg',
  'LG Chem': 'lg-chem',
  'VARTA': 'varta',
  'Huawei': 'huawei',
  'Pylontech': 'pylontech',
  'SolarEdge': 'solaredge',
  'AlphaESS': 'alphaess',
  'Alpha ESS': 'alpha-ess',
  'Sungrow': 'sungrow',
  'GoodWe': 'goodwe',
  'Goodwe': 'goodwe',
  'Fronius': 'fronius',
  'KOSTAL': 'kostal',
  'Kostal': 'kostal',
  'FENECON': 'fenecon',
  'Fenecon': 'fenecon',
  'Q.HOME': 'qhome',
  'SMA': 'sma',
  'SOLARWATT': 'solarwatt',
  'Solarwatt': 'solarwatt',
  'Viessmann': 'viessmann',
};

/**
 * Model-specific image overrides
 */
const MODEL_IMAGE_MAP = {
  // Fix: DB model "Battery-Box Premium" slugifies to "battery-box-premium" but Supabase has "battery-box-premium-hvs"
  'byd-battery-box-premium': 'battery-box-premium-hvs',
  // Fix: DB model "sonnenBatterie 10" slugifies to "sonnenbatterie-10" but Supabase has "batterie-10"
  'sonnen-sonnenbatterie-10': 'batterie-10',
  // Fix: DB model "sonnenBatterie eco 9" slugifies to "sonnenbatterie-eco-9" but Supabase has "eco-9"
  'sonnen-sonnenbatterie-eco-9': 'eco-9',
  // Fix: DB model "Sunny Boy Storage 5.0" slugifies to "sunny-boy-storage-50" but Supabase has "sunny-boy-storage-5"
  'sma-sunny-boy-storage-50': 'sunny-boy-storage-5',
  // Fix: DB model "PIKO IQ 5.5" slugifies to "piko-iq-55" but Supabase has "piko-iq-55" (matches!)
  'kostal-piko-iq-55': 'piko-iq-55',
};

/**
 * Slugify a string for URL usage
 */
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Get the primary storage image URL from Supabase Storage
 *
 * @param {string} brand - Storage brand name
 * @param {string} model - Storage model name
 * @param {Object} options - Optional parameters
 * @param {string} options.angle - Image angle ('front', 'side', 'detail')
 * @param {string} options.size - Image size preset (not used for now)
 * @returns {string} Image URL
 */
export function getStorageImageUrl(brand, model, options = {}) {
  const { angle = 'front' } = options;

  const brandSlug = BRAND_SLUG_MAP[brand] || slugify(brand);
  const modelSlug = slugify(model);

  // Check for model-specific override
  const fullSlug = `${brandSlug}-${modelSlug}`;
  const modelOverride = MODEL_IMAGE_MAP[fullSlug];

  const imagePath = modelOverride
    ? `${brandSlug}/${modelOverride}/${angle}.webp`
    : `${brandSlug}/${modelSlug}/${angle}.webp`;

  return `${SUPABASE_STORAGE_URL}/${imagePath}`;
}

/**
 * Get fallback placeholder image for storage products
 *
 * @param {string} brand - Storage brand name (for branded placeholder if available)
 * @returns {string} Placeholder image URL
 */
export function getStorageFallbackUrl(brand) {
  // For now, return a generic SVG placeholder
  // Could be enhanced with brand-specific placeholders
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23f1f5f9' width='400' height='300'/%3E%3Cg fill='%2394a3b8' %3E%3Cpath d='M180 100h40v120h-40z'/%3E%3Cpath d='M160 110h80v10h-80z'/%3E%3Cpath d='M160 140h80v10h-80z'/%3E%3Cpath d='M160 170h80v10h-80z'/%3E%3Cpath d='M160 200h80v10h-80z'/%3E%3Ccircle cx='200' cy='80' r='8'/%3E%3C/g%3E%3Ctext x='200' y='260' font-family='Inter, sans-serif' font-size='14' fill='%2394a3b8' text-anchor='middle'%3E${encodeURIComponent(brand)}%3C/text%3E%3C/svg%3E`;
}

/**
 * Get gallery image URLs for a storage product
 *
 * @param {string} brand - Storage brand name
 * @param {string} model - Storage model name
 * @param {number} maxImages - Maximum number of images to return
 * @returns {Promise<string[]>} Array of image URLs (filters out 404s)
 */
export async function getGalleryImageUrls(brand, model, maxImages = 6) {
  const brandSlug = BRAND_SLUG_MAP[brand] || slugify(brand);
  const modelSlug = slugify(model);

  const angles = ['front', 'side', 'detail', 'installation', 'app', 'diagram'];
  const urls = [];

  for (let i = 0; i < Math.min(maxImages, angles.length); i++) {
    const url = `${SUPABASE_STORAGE_URL}/${brandSlug}/${modelSlug}/${angles[i]}.webp`;

    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        urls.push(url);
      }
    } catch (error) {
      // Image doesn't exist, skip
      continue;
    }
  }

  return urls;
}

/**
 * Get a small thumbnail-sized image URL
 * (For future use with image transformations)
 */
export function getStorageThumbnailUrl(brand, model) {
  return getStorageImageUrl(brand, model, { angle: 'front' });
}
