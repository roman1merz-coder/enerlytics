# Supabase Database Setup

This directory contains the database schema and seed data for the EV Database.

## Files

### schema.sql
Creates the `ev_variants` table with:
- Auto-incrementing `id` primary key
- All 28 EV specification columns with appropriate data types
- Unique `slug` column for URL-friendly identifiers
- Nullable `image_url` column for vehicle images
- Timestamps for creation and updates
- 5 indexes on common query fields (brand, model, segment, price, slug)
- Row Level Security (RLS) enabled
- Policies for public read access and authenticated user modifications

**Indexes created:**
- `idx_ev_variants_brand` - for filtering by brand
- `idx_ev_variants_model` - for filtering by model
- `idx_ev_variants_segment` - for segment filtering
- `idx_ev_variants_price` - for price-based queries
- `idx_ev_variants_slug` - for URL slug lookups

**RLS Policies:**
- Public users: SELECT access only
- Authenticated users: SELECT, INSERT, UPDATE, DELETE access

### seed.sql
Contains 331 INSERT statements, one for each EV variant in the enriched dataset.

**Data features:**
- All CSV columns properly mapped to snake_case column names
- Proper SQL escaping (single quotes doubled)
- Numeric values correctly typed
- NULL values for empty/null fields
- Generated slugs from brand-model-variant combinations
- Special characters (×, €, etc.) properly handled

## Column Mapping

| CSV Column | SQL Column | Type |
|---|---|---|
| Brand Group | brand_group | TEXT |
| Brand | brand | TEXT |
| Model | model | TEXT |
| Variant/Trim | variant | TEXT |
| Battery (kWh net) | battery_kwh | NUMERIC |
| Motor Config | motor_config | TEXT |
| Power (kW) | power_kw | NUMERIC |
| Power (hp) | power_hp | NUMERIC |
| WLTP Range (km) | wltp_range_km | NUMERIC |
| Est. Real Range (km) | est_real_range_km | NUMERIC |
| DC Fast Charge (kW) | dc_fast_charge_kw | NUMERIC |
| AC Charge (kW) | ac_charge_kw | NUMERIC |
| Consumption (Wh/km) | consumption_wh_km | NUMERIC |
| Length (mm) | length_mm | NUMERIC |
| Width (mm) | width_mm | NUMERIC |
| Height (mm) | height_mm | NUMERIC |
| Trunk (L) | trunk_l | NUMERIC |
| Frunk (L) | frunk_l | NUMERIC |
| Status | status | TEXT |
| Notes | notes | TEXT |
| Segment | segment | TEXT |
| Price (EUR) | price_eur | NUMERIC |
| CO₂ Production (t) | co2_production_t | NUMERIC |
| CO₂ Lifetime 200k km (t) | co2_lifetime_t | NUMERIC |
| Total Cargo (L) | total_cargo_l | NUMERIC |
| km per EUR (×100) | km_per_eur | NUMERIC |

## Usage

1. First run `schema.sql` to create the table and indexes:
   ```bash
   psql -h your-supabase-host -U postgres -d postgres -f schema.sql
   ```

2. Then run `seed.sql` to populate the data:
   ```bash
   psql -h your-supabase-host -U postgres -d postgres -f seed.sql
   ```

Or in Supabase dashboard:
1. Open SQL Editor
2. Copy and paste content of `schema.sql`, run it
3. Copy and paste content of `seed.sql`, run it

## Data Statistics

- Total EV variants: 331
- Brands included: 40+
- Segments: Compact, Sedan/Estate, SUV/Crossover, Pickup, Luxury, MPV
- Price range: €29,990 - €451,000 (Ferrari Elettrica estimated)
- Battery capacity range: 44 - 122 kWh net

## Notes

- The `image_url` column is NULL by default - these can be populated later
- The `slug` column is UNIQUE and required - useful for URL routing
- Timestamps are set to current time on insertion - can be updated later
- All numeric values from the CSV are preserved exactly as provided
- Text fields with single quotes are properly escaped ('' instead of ')
