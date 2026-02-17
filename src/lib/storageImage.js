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
  'LG Chem': 'lg-chem',
  'VARTA': 'varta',
  'Huawei': 'huawei',
  'Pylontech': 'pylontech',
  'SolarEdge': 'solaredge',
  'Alpha ESS': 'alpha-ess',
  'Sungrow': 'sungrow',
  'Goodwe': 'goodwe',
  'Fronius': 'fronius',
  'Kostal': 'kostal',
  'Fenecon': 'fenecon',
  'Q.HOME': 'qhome',
  'Solarwatt': 'solarwatt',
  'Viessmann': 'viessmann',
};

/**
 * Model-specific image overrides
 */
const MODEL_IMAGE_MAP = {
  'byd-battery-box-premium-hvs': 'battery-box-premium-hvs',
  'sonnenbatterie-10': 'sonnenbatterie-10',
  'e3dc-s10-e-pro': 's10-e-pro',
  'rct-power-battery': 'power-battery',
  'senec-home-v3-hybrid': 'home-v3-hybrid',
  'tesla-powerwall-3': 'powerwall-3',
  'lg-chem-resu-10h': 'resu-10h',
  'varta-pulse-neo': 'pulse-neo',
  'huawei-luna2000': 'luna2000',
  'pylontech-force-l2': 'force-l2',
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
