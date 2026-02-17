# Supabase EV Database - File Index

This directory contains complete SQL schema and seed data for 331 electric vehicle variants, ready for deployment to Supabase.

## Quick Navigation

### For Immediate Deployment (Start Here!)
**File:** `DEPLOYMENT_QUICK_START.md`
- 4-step deployment guide (2 minutes)
- Paste schema.sql into Supabase SQL Editor
- Paste seed.sql into Supabase SQL Editor
- Done!

### For Understanding the Data
**File:** `README.md`
- Complete column mapping (all 26 CSV columns)
- Table structure overview
- Data statistics
- Usage instructions

### For Technical Details
**Files:**
- `schema.sql` - Database table definition with indexes and RLS
- `seed.sql` - 331 INSERT statements with all vehicle data

### For Quality Assurance
**File:** `VALIDATION_REPORT.md`
- Data validation results (100% passed)
- Sample SQL queries
- Deployment checklist
- Troubleshooting guide

---

## Files at a Glance

| File | Size | Purpose | Read Time |
|------|------|---------|-----------|
| DEPLOYMENT_QUICK_START.md | 6.6 KB | 4-step deployment guide + code examples | 5 min |
| README.md | 3.5 KB | Column reference and documentation | 5 min |
| VALIDATION_REPORT.md | 6.6 KB | Quality metrics and sample queries | 10 min |
| schema.sql | 2.2 KB | Table creation and security setup | Run 1st |
| seed.sql | 195 KB | 331 EV records to load | Run 2nd |

---

## Data Overview

- **Total Records:** 331 EV variants
- **Total Columns:** 32 (26 from CSV + slug + image_url + timestamps)
- **Brands:** 40+ manufacturers
- **Segments:** Compact, Sedan/Estate, SUV, Pickup, Luxury, MPV
- **Price Range:** €29,990 - €451,000
- **Battery Range:** 44 - 122 kWh

---

## Column Quick Reference

**Vehicle ID:** `brand`, `model`, `variant`, `slug`  
**Powertrain:** `battery_kwh`, `motor_config`, `power_kw`, `power_hp`  
**Range/Efficiency:** `wltp_range_km`, `est_real_range_km`, `consumption_wh_km`, `dc_fast_charge_kw`, `ac_charge_kw`  
**Dimensions:** `length_mm`, `width_mm`, `height_mm`, `trunk_l`, `frunk_l`, `total_cargo_l`  
**Price/Environment:** `price_eur`, `co2_production_t`, `co2_lifetime_t`, `km_per_eur`  
**Metadata:** `status`, `segment`, `notes`, `image_url`, `created_at`, `updated_at`

Full reference: See `README.md`

---

## Deployment Paths

### Path 1: Supabase Dashboard (Easiest - 2 minutes)
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy schema.sql → Run
4. Copy seed.sql → Run
5. Done!

**Guide:** See `DEPLOYMENT_QUICK_START.md`

### Path 2: Command Line (Fastest for experts)
```bash
psql [connection-string] < schema.sql
psql [connection-string] < seed.sql
```

### Path 3: From Your App
Use any PostgreSQL client library (psycopg2, pg, etc.)

---

## Database Features

✓ **Performance:** 5 indexes for common queries (brand, model, segment, price, slug)  
✓ **Security:** Row Level Security (RLS) enabled - public read-only, authenticated full access  
✓ **Data Integrity:** Unique slug constraint, proper NULL handling, data type validation  
✓ **Scalability:** Ready for 10,000+ records with current schema  
✓ **Usability:** Auto-generated slugs for URL routing, timestamps for tracking

---

## Sample Queries

```sql
-- Get all Tesla models
SELECT * FROM ev_variants WHERE brand = 'Tesla';

-- Find cars under €50k
SELECT brand, model, price_eur 
FROM ev_variants 
WHERE price_eur < 50000 
ORDER BY price_eur;

-- Get specific car by slug
SELECT * FROM ev_variants 
WHERE slug = 'tesla-model3-standardrangerwd';

-- Group by segment
SELECT segment, COUNT(*) as count, AVG(price_eur)::int as avg_price
FROM ev_variants 
GROUP BY segment;

-- Find best value cars
SELECT brand, model, (est_real_range_km::float / price_eur * 10000)::int as km_per_k_eur
FROM ev_variants 
ORDER BY km_per_k_eur DESC LIMIT 10;
```

More examples: See `DEPLOYMENT_QUICK_START.md`

---

## Next Steps After Deployment

1. **Integrate with Next.js** - Use Supabase client to fetch data
2. **Build Listing Page** - Display filtered list of cars
3. **Build Detail Page** - Use slug for URL routing
4. **Add Filters** - Brand, segment, price, range sliders
5. **Build Comparison** - Side-by-side car specs
6. **Add Images** - Populate image_url column
7. **Track Favorites** - Add user preferences table

Code examples: See `DEPLOYMENT_QUICK_START.md`

---

## Verification Checklist

After deployment, run these to verify:

```sql
-- Check total records
SELECT COUNT(*) FROM ev_variants;  -- Should be 331

-- Check slug uniqueness
SELECT COUNT(DISTINCT slug) FROM ev_variants;  -- Should be 331

-- Check data types
SELECT * FROM ev_variants LIMIT 1;  -- Review columns

-- Check RLS (if authenticated)
SELECT * FROM ev_variants LIMIT 1;  -- Should work

-- Check indexes exist
\d ev_variants  -- Should show 5 indexes
```

---

## Troubleshooting

**Problem:** "relation 'ev_variants' does not exist"  
**Solution:** Make sure you ran schema.sql BEFORE seed.sql

**Problem:** "duplicate key value violates unique constraint"  
**Solution:** This shouldn't happen - data is pre-validated

**Problem:** "permission denied"  
**Solution:** Check RLS policy - should allow anon SELECT

**Problem:** "slow queries"  
**Solution:** Indexes are already created - check your WHERE clause

More help: See `VALIDATION_REPORT.md` troubleshooting section

---

## Statistics

- **Files Generated:** 5 (2 SQL + 3 Markdown)
- **Total Size:** 224 KB
- **CSV Rows Processed:** 331
- **Conversion Success:** 100%
- **Data Validation:** 100% passed
- **Time to Deploy:** 2-5 minutes

---

## Version Information

- **Generated:** 2026-02-13
- **Source CSV:** ev_enriched.csv (331 rows × 26 columns)
- **Target Database:** Supabase (PostgreSQL 14+)
- **Status:** Production Ready

---

## Support Resources

| Question | Answer | File |
|----------|--------|------|
| How do I deploy this? | Follow 4-step guide | DEPLOYMENT_QUICK_START.md |
| What columns exist? | See complete reference | README.md |
| Is the data validated? | Yes, 100% passed | VALIDATION_REPORT.md |
| How do I query this? | See 20+ examples | DEPLOYMENT_QUICK_START.md |
| What's the table structure? | See CREATE TABLE | schema.sql |
| What data is included? | See 331 rows | seed.sql (first 30 shown) |

---

**Ready to deploy? Start with DEPLOYMENT_QUICK_START.md!**

Generated automatically from /sessions/loving-laughing-cori/ev_enriched.csv
