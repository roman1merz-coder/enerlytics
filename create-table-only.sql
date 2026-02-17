-- Quick table creation (run this first in Supabase SQL Editor)
CREATE TABLE IF NOT EXISTS battery_storage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  variant TEXT,
  production_location TEXT,
  production_country TEXT,
  module_capacity_kwh DECIMAL(5,2) NOT NULL,
  min_modules INTEGER DEFAULT 1,
  max_modules INTEGER NOT NULL,
  total_capacity_min_kwh DECIMAL(6,2),
  total_capacity_max_kwh DECIMAL(6,2),
  cell_technology TEXT,
  cycle_life INTEGER,
  depth_of_discharge_pct INTEGER DEFAULT 90,
  efficiency_pct DECIMAL(4,2),
  charge_power_kw DECIMAL(5,2),
  discharge_power_kw DECIMAL(5,2),
  continuous_power_kw DECIMAL(5,2),
  peak_power_kw DECIMAL(5,2),
  compatible_inverters TEXT[],
  inverter_type TEXT,
  backup_capable BOOLEAN DEFAULT false,
  mounting_type TEXT,
  wall_mount_additional_cost_eur DECIMAL(7,2),
  dimensions_h_mm INTEGER,
  dimensions_w_mm INTEGER,
  dimensions_d_mm INTEGER,
  weight_kg DECIMAL(6,2),
  ip_rating TEXT,
  operating_temp_min_c INTEGER,
  operating_temp_max_c INTEGER,
  price_per_module_eur DECIMAL(8,2) NOT NULL,
  installation_cost_eur DECIMAL(8,2),
  total_system_cost_eur DECIMAL(9,2),
  warranty_years INTEGER,
  warranty_cycles INTEGER,
  warranty_capacity_retention_pct INTEGER,
  has_app BOOLEAN DEFAULT false,
  has_energy_management BOOLEAN DEFAULT false,
  supports_solar BOOLEAN DEFAULT true,
  supports_grid_services BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'Available',
  release_year INTEGER,
  certifications TEXT[],
  description TEXT,
  image_url TEXT,
  manufacturer_url TEXT,
  datasheet_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_storage_brand ON battery_storage(brand);
CREATE INDEX IF NOT EXISTS idx_storage_price ON battery_storage(price_per_module_eur);
CREATE INDEX IF NOT EXISTS idx_storage_capacity ON battery_storage(module_capacity_kwh);
CREATE INDEX IF NOT EXISTS idx_storage_slug ON battery_storage(slug);

ALTER TABLE battery_storage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access" ON battery_storage;
CREATE POLICY "Public read access" ON battery_storage FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow inserts" ON battery_storage;
CREATE POLICY "Allow inserts" ON battery_storage FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow deletes" ON battery_storage;
CREATE POLICY "Allow deletes" ON battery_storage FOR DELETE USING (true);
