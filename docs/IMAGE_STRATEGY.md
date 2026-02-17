# EV Database — Image Strategy

## Current State
- **331 variants** across **39 brands**
- All images served via `imagin.studio` CDN (free tier, shared `hrjavascript-mastery` key)
- No local image assets — everything generated on-the-fly
- DB has an unused `image_url` column ready for overrides
- Fallback: generic SVG car silhouette on load error

### Problems with Current Approach
1. **Shared API key** — could be rate-limited or revoked anytime
2. **Generic renders** — imagin.studio often returns the same generic silhouette for lesser-known brands (BYD, NIO, Leapmotor, Zeekr, Xpeng)
3. **No interiors** — only exterior studio shots available
4. **No transparent backgrounds** — images come with baked-in studio backdrop
5. **Model matching is fuzzy** — uses only `modelFamily` (first word of model name), so "ID.4" and "ID.5" may return the same image

---

## Strategy: Tiered Image System

### Tier 1 — Hero Images (1 per variant)
**Purpose:** Primary image on car cards + detail page hero
**Spec:** 1200×675px, 16:9, transparent or clean white background, ¾ front angle
**Format:** WebP (with PNG fallback)
**Target size:** <80KB per image

### Tier 2 — Gallery Images (3–5 per model, not per variant)
**Purpose:** Detail page gallery (interior, rear, side, cockpit, trunk)
**Spec:** 1200×800px, mixed angles, clean backgrounds preferred
**Format:** WebP
**Target size:** <120KB per image

### Tier 3 — Fallback (automatic)
**Purpose:** Any car without Tier 1/2 images
**Source:** Keep `imagin.studio` CDN as fallback
**No action needed** — already implemented

---

## A) Sourcing — Where to Get Images

### Primary: Manufacturer Press Portals (Free, High Quality)

| Brand | Press Portal | Registration |
|-------|-------------|-------------|
| Tesla | tesla.com/tesla-gallery | None |
| VW | volkswagen-newsroom.com | Free |
| BMW | press.bmwgroup.com | Free |
| Audi | audi-mediacenter.com | Free |
| Mercedes | media.mercedes-benz.com | Free |
| Porsche | newsroom.porsche.com | Free |
| Hyundai | hyundai.com/worldwide/en/newsroom | Free |
| Kia | press.kia.com/eu/en | Free |
| Polestar | media.polestar.com | Free |
| Volvo | media.volvocars.com | Free |
| BYD | byd.com/eu/image-bank | Free |
| NIO | nio.com/newsroom | Free |
| Rivian | rivian.com/newsroom/media | Free |
| Lucid | media.lucidmotors.com | Free |
| Škoda | skoda-storyboard.com | Free |
| CUPRA | cupraofficial.com/press | Free |

**Licensing:** Editorial use. For a non-commercial, engineering-focused comparison tool this is acceptable. Add attribution in footer: "Vehicle images courtesy of respective manufacturers." If the site monetizes (leasing links), consider requesting explicit commercial licenses from top 10 brands.

### Secondary: imagin.studio (Current, Keep as Fallback)
- Already integrated via `src/lib/carImage.js`
- Good for brands where press images aren't available
- Angles 1–24 available

### Tertiary: Manual Curation
- For missing models, use official configurator screenshots
- Process through background removal (remove.bg API or rembg Python lib)

---

## B) Storage — Supabase Storage + CDN

### Recommended: Supabase Storage Bucket `car-images` (public)

```
car-images/                          ← Supabase Storage bucket (public)
├── tesla/
│   ├── model-3/
│   │   ├── hero.webp                ← Tier 1
│   │   ├── interior.webp            ← Tier 2
│   │   ├── rear.webp                ← Tier 2
│   │   ├── cockpit.webp             ← Tier 2
│   │   └── trunk.webp               ← Tier 2
│   ├── model-y/
│   │   ├── hero.webp
│   │   └── ...
│   └── model-s/
│       └── ...
├── bmw/
│   ├── ix/
│   └── i4/
└── ...
```

**Why Supabase Storage:**
1. **No git bloat** — images stay out of the repo; 331 variants × 5 images × ~100KB = 150MB+ that would permanently inflate `.git` history
2. **Already in the stack** — Supabase client already configured, one bucket to create
3. **Dynamic management** — add/replace/delete images via dashboard or API, no redeploy needed
4. **Built-in CDN** — Supabase serves via global CDN with edge caching
5. **Image transforms** — resize, format conversion on-the-fly via URL params
6. **DB-native** — store the CDN URL in the existing `image_url` column → one query gets data + images
7. **Free tier: 1GB** — more than enough for 300+ hero images (~25MB) + gallery (~100MB)
8. **Scales cleanly** — if you expand to 500+ variants with full galleries, no repo impact

**URL pattern:**
```
https://<project>.supabase.co/storage/v1/object/public/car-images/{brand-slug}/{model-slug}/hero.webp
```

### Naming Convention
```
car-images/{brand-slug}/{model-slug}/hero.webp
car-images/{brand-slug}/{model-slug}/interior.webp
car-images/{brand-slug}/{model-slug}/rear.webp
car-images/{brand-slug}/{model-slug}/cockpit.webp
car-images/{brand-slug}/{model-slug}/trunk.webp
```

Where:
- `brand-slug` = `brand.toLowerCase().replace(/[^a-z0-9]/g, '-')` → `mercedes-benz`, `bmw`, `tesla`
- `model-slug` = `model.toLowerCase().replace(/[^a-z0-9]/g, '-')` → `model-3`, `id-4`, `ioniq-5`

### Supabase Bucket Setup
```sql
-- Create public bucket (run once in Supabase dashboard or via SQL)
INSERT INTO storage.buckets (id, name, public) VALUES ('car-images', 'car-images', true);

-- Allow public reads (anonymous access)
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'car-images');
```

---

## C) Embedding — How to Use in the App

### Updated `carImage.js` (Smart Resolver)

```javascript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const STORAGE_BUCKET = 'car-images';

// Priority: DB image_url → Supabase Storage → imagin.studio fallback
export function getCarImageUrl(brand, model, options = {}) {
  const { type = 'hero', width = 600, angle = 1, imageUrl = null } = options;

  // 1. If the DB has a direct image_url, use it
  if (imageUrl) return { src: imageUrl, fallback: getImaginUrl(brand, model, { width, angle }) };

  // 2. Try Supabase Storage (convention-based)
  const brandSlug = brand.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const modelSlug = model.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const supabasePath = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${brandSlug}/${modelSlug}/${type}.webp`;

  return {
    src: supabasePath,
    fallback: getImaginUrl(brand, model, { width, angle }),
  };
}

// Keep imagin.studio as fallback
function getImaginUrl(brand, model, { width, angle }) {
  const make = brand.toLowerCase().replace(/\s+/g, '-');
  const modelFamily = model.split(' ')[0].toLowerCase();
  return `https://cdn.imagin.studio/getimage?customer=hrjavascript-mastery&make=${make}&modelFamily=${modelFamily}&angle=${angle}&width=${width}`;
}
```

### Image Component with Smart Fallback

```jsx
function CarImage({ brand, model, type = 'hero', className, alt, imageUrl }) {
  const { src, fallback } = getCarImageUrl(brand, model, { type, imageUrl });

  return (
    <img
      src={src}
      alt={alt || `${brand} ${model}`}
      className={className}
      loading="lazy"
      onError={(e) => {
        if (e.target.src !== fallback) {
          e.target.src = fallback;
        }
      }}
    />
  );
}
```

### Fallback Chain
```
DB image_url (explicit override) → Supabase Storage (convention) → imagin.studio (CDN) → SVG silhouette
```

---

## D) Quality Rules — The Crawl Checklist

### Image Acceptance Criteria

| Rule | Hero (Tier 1) | Gallery (Tier 2) |
|------|--------------|------------------|
| **Resolution** | ≥1200px wide | ≥1200px wide |
| **Aspect Ratio** | 16:9 (±5%) | Free (prefer 3:2) |
| **Angle** | ¾ front-left preferred | Varies per shot type |
| **Background** | Transparent or solid white/light gray | Clean, minimal |
| **Format** | WebP (PNG source OK, convert) | WebP |
| **Max file size** | 80KB | 120KB |
| **Color accuracy** | Must match a real OEM color | N/A for interiors |
| **Watermarks** | ❌ Never | ❌ Never |
| **Branding overlays** | ❌ Never | ❌ Never |
| **Cropping** | Full car visible, no cutoff | Subject fully visible |
| **Model year** | Current or latest facelift | Current or latest facelift |

### Processing Pipeline

1. **Download** source image (PNG/JPEG from press portal)
2. **Remove background** if needed (rembg or remove.bg)
3. **Crop & resize** to target dimensions
4. **Convert to WebP** at quality 82 (good balance of size vs. quality)
5. **Verify** file size < target
6. **Name** according to convention
7. **Upload** to Supabase Storage bucket `car-images/`
8. **Update** `image_url` in DB if using explicit override

### Automation Script (Python)
```bash
# Convert + optimize in one step
cwebp -q 82 -resize 1200 0 input.png -o hero.webp
```

### Priority Order for Crawling

**Phase 1 — Top 20 Models (hero only)**
These are the most-viewed EVs in DACH:
1. Tesla Model 3, Model Y
2. VW ID.3, ID.4, ID.5, ID.7
3. BMW iX1, iX3, i4, i5
4. Mercedes EQA, EQB, EQE
5. Hyundai Ioniq 5, Ioniq 6
6. Kia EV6, EV9
7. Škoda Enyaq
8. Porsche Taycan
9. Polestar 2

**Phase 2 — Remaining brands (hero only)**
All other 39 brands, one model-level hero image each.

**Phase 3 — Gallery images for Top 20**
Interior, rear, cockpit, trunk for Phase 1 models.

---

## Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Source** | Manufacturer press portals | Free, highest quality, official |
| **Fallback** | imagin.studio CDN | Already integrated, covers gaps |
| **Storage** | Supabase Storage `car-images` bucket | No git bloat, already in stack, dynamic management |
| **Format** | WebP (82 quality) | Best size/quality ratio for web |
| **Naming** | `/{brand-slug}/{model-slug}/{type}.webp` | Predictable, scriptable |
| **Resolution** | 1200×675 (hero), 1200×800 (gallery) | Sharp on retina, fast to load |
| **Embedding** | 4-tier fallback: DB url → Supabase → imagin → SVG | Graceful degradation |
| **Priority** | Top 20 DACH models first | Maximum impact, minimum effort |
