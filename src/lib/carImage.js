// Car image URL resolver with Supabase Storage + imagin.studio fallback
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const STORAGE_BUCKET = 'car-images';

// Brand slug overrides for unicode/special characters
const BRAND_SLUG_MAP = {
  'Alfa Romeo': 'alfa-romeo',
  'Citroën': 'citroen',
  'Rolls-Royce': 'rolls-royce',
  'Škoda': 'skoda',
};

// Explicit model → image slug overrides (DB model name → Supabase folder name)
// Used when the model name doesn't slugify to our image folder convention
const MODEL_IMAGE_MAP = {
  // Alfa Romeo
  'Junior Elettrica': 'junior',
  // Audi — variant names share the base model image
  'RS e-tron GT': 'e-tron-gt',
  'Q4 Sportback e-tron': 'q4-e-tron',
  'Q6 Sportback e-tron': 'q6-e-tron',
  'Q8 Sportback e-tron': 'q8-e-tron',
  'SQ6 e-tron': 'q6-e-tron',
  'SQ8 e-tron': 'q8-e-tron',
  'SQ8 Sportback e-tron': 'q8-e-tron',
  'S6 e-tron': 'a6-e-tron',
  'A6 Avant e-tron': 'a6-e-tron',
  // BMW — Touring variants share the base model image
  'i5 Touring': 'i5',
  // BYD — Seal U shares Seal images
  'Seal U': 'seal',
  // Citroën — strip the ë- prefix to match folder names
  'ë-Berlingo': 'berlingo',
  'ë-C3': 'c3',
  'ë-C3 Aircross': 'c3-aircross',
  'ë-C4': 'c4',
  'ë-C4 X': 'c4-x',
  // DS — normalize E-Tense suffix
  'DS 3 E-Tense': 'ds-3',
  'DS 7 E-Tense': 'ds-3',
  // Lancia
  'Ypsilon Electric': 'ypsilon',
  // Mercedes — AMG variants share the base model image
  'AMG EQE': 'eqe',
  'AMG EQS': 'eqs',
  'EQE SUV': 'eqe-suv',
  'EQS SUV': 'eqs-suv',
  // MINI — normalize casing
  'Cooper Electric': 'cooper-electric',
  'Countryman Electric': 'countryman-electric',
  // NIO — ET5 Touring has its own gallery
  'ET5 Touring': 'et5-touring',
  // Peugeot — normalize e- prefix and wagon variants
  'E-208': 'e-208',
  'E-3008': 'e-3008',
  'E-5008': 'e-5008',
  'e-308 SW': 'e-308',
  // Polestar — model names include brand prefix in DB
  'Polestar 2': 'polestar-2',
  'Polestar 3': 'polestar-3',
  'Polestar 4': 'polestar-4',
  'Polestar 5': 'polestar-4',
  // Porsche — map SUV/Turismo variants
  'Taycan Cross Turismo': 'taycan-cross-turismo',
  'Taycan Sport Turismo': 'taycan-sport-turismo',
  'Macan Electric': 'macan-electric',
  'Cayenne Electric': 'cayenne-electric',
  // Renault — normalize number model names
  '4 E-Tech': '4-e-tech',
  '5 E-Tech': '5-e-tech',
  'Megane E-Tech': 'megane-e-tech',
  'Scenic E-Tech': 'scenic-e-tech',
  'Twingo E-Tech': '5-e-tech',
  // Škoda — Coupé accent
  'Enyaq Coupé': 'enyaq-coup',
  // Smart — hash prefix
  '#1': '1',
  '#3': '3',
  '#5': '3',
  // Volkswagen — ID. prefix normalization
  'ID.3': 'id-3',
  'ID.4': 'id-4',
  'ID.5': 'id-5',
  'ID.7': 'id-7',
  'ID.7 Tourer': 'id-7-tourer',
  'ID.Buzz': 'id-buzz',
  'ID. Buzz': 'id-buzz',
  'ID.2 (ID.Polo)': 'id-3',
  // Volvo
  'EC40': 'ec40',
  'EX30': 'ex30',
  'EX40': 'ex40',
  'EX60': 'ex60',
  'EX90': 'ex90',
  'ES90': 'ex90',
};

function toBrandSlug(brand) {
  if (BRAND_SLUG_MAP[brand]) return BRAND_SLUG_MAP[brand];
  return brand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function toModelSlug(model) {
  // Check explicit override first
  if (MODEL_IMAGE_MAP[model]) return MODEL_IMAGE_MAP[model];
  // Default: slugify the model name
  return model.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Primary: Supabase Storage (press-quality images)
export function getCarImageUrl(brand, model, options = {}) {
  const { type = 'hero', imageUrl = null } = options;

  // 1. If the DB has a direct image_url override, use it
  if (imageUrl) return imageUrl;

  // 2. Supabase Storage (convention-based path)
  const brandSlug = toBrandSlug(brand);
  const modelSlug = toModelSlug(model);
  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${brandSlug}/${modelSlug}/${type}.webp`;
}

// Gallery: Generate URLs for numbered gallery images (02.webp through 24.webp)
export function getGalleryImageUrls(brand, model, maxImages = 24) {
  const brandSlug = toBrandSlug(brand);
  const modelSlug = toModelSlug(model);
  const base = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${brandSlug}/${modelSlug}`;
  const urls = [];
  for (let i = 2; i <= maxImages; i++) {
    const nn = String(i).padStart(2, '0');
    urls.push(`${base}/${nn}.webp`);
  }
  return urls;
}

// Fallback: imagin.studio CDN (used when Supabase image fails to load)
export function getImaginFallbackUrl(brand, model, options = {}) {
  const { angle = 1, width = 600 } = options;
  const make = encodeURIComponent(brand.toLowerCase().replace(/\s+/g, '-'));
  const modelFamily = encodeURIComponent(model.split(' ')[0].toLowerCase());
  return `https://cdn.imagin.studio/getimage?customer=img&make=${make}&modelFamily=${modelFamily}&angle=${angle}&width=${width}`;
}
