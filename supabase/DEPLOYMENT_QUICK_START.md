# Deployment Quick Start Guide

## What You Have

Four complete files ready for Supabase deployment:

1. **schema.sql** - Database structure (67 lines, 2.2 KB)
2. **seed.sql** - 331 EV records (333 lines, 195 KB)
3. **README.md** - Documentation and reference
4. **VALIDATION_REPORT.md** - Quality assurance details

## Quick Deployment (2 minutes)

### Step 1: Open Supabase Dashboard
Go to your Supabase project → **SQL Editor**

### Step 2: Create the Table
- Copy entire content of `schema.sql`
- Paste into SQL Editor
- Click **Run**
- Expected result: "CREATE TABLE", "CREATE INDEX" messages ✓

### Step 3: Load the Data
- Copy entire content of `seed.sql`
- Paste into SQL Editor
- Click **Run**
- Expected result: "331 rows inserted" ✓

### Step 4: Verify
Run this verification query:
```sql
SELECT COUNT(*) as total_records FROM ev_variants;
```
**Expected result:** 331 rows

## Done!

Your EV database is now live with:
- 331 electric vehicle variants
- 32 columns (specs, pricing, efficiency data)
- 5 performance indexes
- Row-level security (public can read, authenticated can modify)
- Auto-generated URL slugs for each vehicle

## Next: Connect from Your App

### In Next.js with Supabase Client:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Fetch all EVs
const { data: cars } = await supabase
  .from('ev_variants')
  .select('*')

// Filter by brand
const { data: teslas } = await supabase
  .from('ev_variants')
  .select('*')
  .eq('brand', 'Tesla')

// Get specific car by slug
const { data: car } = await supabase
  .from('ev_variants')
  .select('*')
  .eq('slug', 'tesla-model3-standardrangerwd')
  .single()

// Filter by price range
const { data: affordable } = await supabase
  .from('ev_variants')
  .select('*')
  .lte('price_eur', 50000)
  .order('price_eur', { ascending: true })
```

## Column Reference

**Vehicle Identification:**
- `brand` - Manufacturer (Tesla, BYD, Volkswagen, etc.)
- `model` - Model name (Model 3, Dolphin, ID.4, etc.)
- `variant` - Trim/variant (Standard Range, Long Range, etc.)
- `slug` - URL-friendly ID (tesla-model3-standardrangerwd)

**Performance & Power:**
- `battery_kwh` - Battery capacity in kWh
- `motor_config` - Motor type (1× Rear RWD, 2× Dual AWD, etc.)
- `power_kw` - Peak power in kilowatts
- `power_hp` - Peak power in horsepower

**Range & Efficiency:**
- `wltp_range_km` - WLTP test range
- `est_real_range_km` - Real-world estimated range
- `consumption_wh_km` - Energy consumption
- `dc_fast_charge_kw` - DC charging speed
- `ac_charge_kw` - AC charging speed

**Vehicle Dimensions:**
- `length_mm`, `width_mm`, `height_mm` - Body dimensions
- `trunk_l` - Trunk volume
- `frunk_l` - Front trunk volume
- `total_cargo_l` - Total cargo capacity

**Pricing & Environment:**
- `price_eur` - Price in euros
- `co2_production_t` - CO2 emissions from production
- `co2_lifetime_t` - Total CO2 from production + 200k km driving
- `km_per_eur` - Value metric (km of range per €100)

**Metadata:**
- `status` - "On sale", "Coming soon", etc.
- `segment` - Category (Sedan, SUV, Pickup, etc.)
- `notes` - Special information
- `image_url` - Vehicle image (currently NULL, add later)
- `created_at` - Record creation timestamp
- `updated_at` - Last update timestamp

## Sample Queries

### Find all vehicles in a price range
```sql
SELECT brand, model, price_eur
FROM ev_variants
WHERE price_eur BETWEEN 40000 AND 60000
ORDER BY price_eur;
```

### Find the best value cars
```sql
SELECT brand, model, price_eur, est_real_range_km, (est_real_range_km::float / price_eur * 10000) as km_per_k_eur
FROM ev_variants
ORDER BY km_per_k_eur DESC
LIMIT 10;
```

### Group by segment
```sql
SELECT 
  segment,
  COUNT(*) as count,
  AVG(price_eur)::int as avg_price,
  MAX(est_real_range_km) as best_range
FROM ev_variants
WHERE status = 'On sale'
GROUP BY segment
ORDER BY count DESC;
```

### Find cars with specific features
```sql
SELECT brand, model, battery_kwh, power_kw, est_real_range_km, price_eur
FROM ev_variants
WHERE battery_kwh >= 75
  AND power_kw >= 300
  AND est_real_range_km >= 400
ORDER BY price_eur;
```

## Common Use Cases

### 1. Car Recommendation System
```sql
-- Find cars matching user preferences:
-- Budget: under €55k, Range: at least 400km, Segment: SUV
SELECT * FROM ev_variants
WHERE segment = 'SUV/Crossover'
  AND price_eur < 55000
  AND est_real_range_km >= 400
ORDER BY (est_real_range_km::float / price_eur) DESC;
```

### 2. Comparison Tool
```sql
SELECT brand, model, battery_kwh, power_kw, est_real_range_km, 
       dc_fast_charge_kw, price_eur
FROM ev_variants
WHERE brand IN ('Tesla', 'Volkswagen', 'Hyundai')
ORDER BY price_eur;
```

### 3. Efficiency Analysis
```sql
SELECT brand, model, consumption_wh_km, 
       (est_real_range_km::float / consumption_wh_km * 100)::int as efficiency_rating
FROM ev_variants
WHERE status = 'On sale'
ORDER BY efficiency_rating DESC;
```

### 4. Environmental Impact
```sql
SELECT brand, model, co2_production_t, co2_lifetime_t,
       battery_kwh, est_real_range_km
FROM ev_variants
WHERE co2_lifetime_t < 25
ORDER BY co2_lifetime_t;
```

## Troubleshooting

### Issue: "relation 'ev_variants' does not exist"
**Solution:** Make sure you ran schema.sql BEFORE seed.sql

### Issue: "duplicate key value violates unique constraint 'ev_variants_slug_key'"
**Solution:** This shouldn't happen, but if it does, delete seed.sql rows and re-run

### Issue: "permission denied"
**Solution:** Make sure RLS policies are created - check schema.sql ran successfully

### Issue: "Anonymous user can't query"
**Solution:** By design! You need the anon key in your `.env.local`. Check Supabase RLS policy is "Allow public read access"

## Support

For detailed information:
- See README.md for column mappings
- See VALIDATION_REPORT.md for data quality assurance
- Check your Supabase logs for SQL errors

## Statistics

- **Total Records:** 331 EV variants
- **Brands:** 40+
- **Segments:** 6 (Compact, Sedan, SUV, Pickup, Luxury, MPV)
- **Price Range:** €29,990 - €451,000
- **Battery Range:** 44 - 122 kWh
- **Power Range:** 70 - 1,020 kW
- **Real Range:** 245 - 520 km

## What's Next?

1. Create your Next.js pages to display the data
2. Build filters by brand, segment, price, range
3. Create a detail page using the slug for URL routing
4. Add image URLs to the image_url column
5. Build comparison tools
6. Add user reviews/ratings (new table)
7. Track which EVs users "like" (auth table)

---

**Status:** Ready for production  
**Last Updated:** 2026-02-13  
**Generated from:** /sessions/loving-laughing-cori/ev_enriched.csv
