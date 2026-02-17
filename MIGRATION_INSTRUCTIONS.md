# 🚀 Battery Storage Migration Instructions

## Quick Start (5 minutes)

### Step 1: Open Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: `mxboigeahudnbigxgefp`
3. Click on **"SQL Editor"** in the left sidebar

### Step 2: Run the Migration

1. Click **"New Query"** button
2. Copy the **ENTIRE** contents of this file:
   ```
   /supabase/migrations/003_battery_storage.sql
   ```
3. Paste it into the SQL Editor
4. Click **"Run"** (or press `Ctrl/Cmd + Enter`)

### Step 3: Verify Success

After running the migration, you should see:

✅ Table `battery_storage` created
✅ Indexes created
✅ RLS policies enabled
✅ 20 storage systems inserted

To verify, run this query in the SQL Editor:

```sql
SELECT COUNT(*) as total_systems FROM battery_storage;
```

You should see: `total_systems: 20`

### Step 4: Test the Frontend

1. Start your dev server:
   ```bash
   cd "/sessions/zen-modest-volta/mnt/EV Database"
   npm run dev
   ```

2. Visit: `http://localhost:5173/storage`

3. You should see 20 battery storage systems!

---

## Alternative: Node.js Migration Script

If you prefer to run via command line (requires Node.js):

```bash
# Install dependencies (if not already installed)
npm install

# Run the migration script
node migrate-storage.mjs
```

**Note:** This script only inserts data. You still need to create the table structure via the Supabase dashboard first (run the CREATE TABLE statements).

---

## What Gets Created

### Table: `battery_storage`

**40+ fields** including:
- Identity (id, slug, brand, model, variant)
- Production (location, country)
- Capacity (module_capacity_kwh, min/max_modules, total capacity)
- Technology (cell_technology, cycle_life, DoD)
- Performance (efficiency, charge/discharge power)
- Compatibility (inverters, backup_capable)
- Installation (mounting, dimensions, weight, IP rating)
- Economics (price_per_module, installation_cost)
- Warranty (years, cycles, retention %)
- Smart features (app, energy management, grid services)
- Metadata (status, certifications, release_year)

### Data: 20 German Storage Systems

1. BYD Battery-Box Premium HVS
2. sonnenBatterie 10
3. E3/DC S10 E PRO
4. RCT Power Battery
5. SENEC Home V3 hybrid
6. Tesla Powerwall 3
7. LG Chem RESU 10H
8. VARTA pulse neo
9. Huawei LUNA2000
10. Pylontech Force L2
11. SolarEdge Energy Bank
12. Alpha ESS SMILE-B3
13. Sungrow SBR HV
14. Goodwe Lynx Home U
15. Fronius Solar Battery
16. Kostal PIKO Battery Li
17. Fenecon Home
18. Q.HOME+ ESS HYB-G3
19. Solarwatt Battery flex
20. Viessmann Vitocharge VX3

---

## Troubleshooting

### Error: "relation battery_storage does not exist"

**Solution:** The table hasn't been created yet. Make sure you:
1. Run the **entire** SQL migration file (not just the INSERT statements)
2. The CREATE TABLE statement comes before the INSERT statements

### Error: "duplicate key value violates unique constraint"

**Solution:** Data already exists! Options:
1. Skip (data is already there ✅)
2. Or delete and re-insert:
   ```sql
   DELETE FROM battery_storage;
   -- Then re-run the INSERT statements
   ```

### Error: "permission denied for table battery_storage"

**Solution:** RLS policies might be blocking. Run this:
```sql
ALTER TABLE battery_storage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access" ON battery_storage;
CREATE POLICY "Public read access" ON battery_storage
  FOR SELECT
  USING (true);
```

---

## Next Steps After Migration

1. **Test the database** directly:
   ```sql
   SELECT * FROM battery_storage ORDER BY brand;
   ```

2. **Start the app**:
   ```bash
   npm run dev
   ```

3. **Visit the pages**:
   - Landing: `http://localhost:5173/` (see "Battery Storage Selector" card)
   - Database: `http://localhost:5173/storage` (browse all systems)
   - Detail: `http://localhost:5173/storage/byd-battery-box-premium-hvs`

4. **Test the features**:
   - Use filters (production location, cell tech, price)
   - Mark favorites
   - Add to compare
   - Try the payback calculator on a detail page

---

## Production Deployment

When deploying to production:

1. Run the same migration in your **production Supabase** project
2. Ensure environment variables are set in Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy: `git push` (auto-deploys on Vercel)

---

**Questions?** The migration file includes detailed comments explaining each section.

**Need help?** Check the `STORAGE_FEATURE_SUMMARY.md` for complete documentation.

🎉 **You're ready to launch!**
