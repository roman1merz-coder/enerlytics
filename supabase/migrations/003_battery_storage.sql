-- Battery Storage Table Migration
-- Created: 2026-02-17
-- Purpose: Store home battery storage system specifications and pricing

-- Create battery_storage table
CREATE TABLE IF NOT EXISTS battery_storage (
  -- Identity
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  variant TEXT,

  -- Production & Origin
  production_location TEXT, -- 'Germany', 'Europe', 'China', 'Other'
  production_country TEXT,

  -- Capacity & Modules
  module_capacity_kwh DECIMAL(5,2) NOT NULL, -- e.g., 5.12 kWh per module
  min_modules INTEGER DEFAULT 1,
  max_modules INTEGER NOT NULL, -- max modules per inverter
  total_capacity_min_kwh DECIMAL(6,2), -- calculated: module_capacity * min_modules
  total_capacity_max_kwh DECIMAL(6,2), -- calculated: module_capacity * max_modules

  -- Battery Technology
  cell_technology TEXT, -- 'LFP', 'NMC', 'NCA', 'LTO', 'LMFP'
  cycle_life INTEGER, -- e.g., 6000 cycles
  depth_of_discharge_pct INTEGER DEFAULT 90, -- DoD %

  -- Performance
  efficiency_pct DECIMAL(4,2), -- round-trip efficiency (e.g., 94.5%)
  charge_power_kw DECIMAL(5,2), -- max charge power
  discharge_power_kw DECIMAL(5,2), -- max discharge power
  continuous_power_kw DECIMAL(5,2), -- continuous output
  peak_power_kw DECIMAL(5,2), -- peak output for short bursts

  -- Inverter Compatibility
  compatible_inverters TEXT[], -- array of inverter brand/model strings
  inverter_type TEXT, -- 'Hybrid', 'AC-coupled', 'DC-coupled', 'All-in-one'
  backup_capable BOOLEAN DEFAULT false,

  -- Installation & Physical
  mounting_type TEXT, -- 'Wall', 'Floor', 'Both'
  wall_mount_additional_cost_eur DECIMAL(7,2),
  dimensions_h_mm INTEGER,
  dimensions_w_mm INTEGER,
  dimensions_d_mm INTEGER,
  weight_kg DECIMAL(6,2),
  ip_rating TEXT, -- e.g., 'IP65'
  operating_temp_min_c INTEGER,
  operating_temp_max_c INTEGER,

  -- Economics
  price_per_module_eur DECIMAL(8,2) NOT NULL,
  installation_cost_eur DECIMAL(8,2),
  total_system_cost_eur DECIMAL(9,2), -- calculated based on config

  -- Warranty
  warranty_years INTEGER,
  warranty_cycles INTEGER,
  warranty_capacity_retention_pct INTEGER, -- e.g., 80% after 10 years

  -- Smart Features
  has_app BOOLEAN DEFAULT false,
  has_energy_management BOOLEAN DEFAULT false,
  supports_solar BOOLEAN DEFAULT true,
  supports_grid_services BOOLEAN DEFAULT false,

  -- Metadata
  status TEXT DEFAULT 'Available', -- 'Available', 'Coming Soon', 'Discontinued'
  release_year INTEGER,
  certifications TEXT[], -- ['VDE', 'CE', 'IEC 62619']

  -- SEO & Images
  description TEXT,
  image_url TEXT,
  manufacturer_url TEXT,
  datasheet_url TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_storage_brand ON battery_storage(brand);
CREATE INDEX IF NOT EXISTS idx_storage_price ON battery_storage(price_per_module_eur);
CREATE INDEX IF NOT EXISTS idx_storage_capacity ON battery_storage(module_capacity_kwh);
CREATE INDEX IF NOT EXISTS idx_storage_production ON battery_storage(production_location);
CREATE INDEX IF NOT EXISTS idx_storage_cell_tech ON battery_storage(cell_technology);
CREATE INDEX IF NOT EXISTS idx_storage_status ON battery_storage(status);
CREATE INDEX IF NOT EXISTS idx_storage_slug ON battery_storage(slug);

-- Enable Row Level Security
ALTER TABLE battery_storage ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
DROP POLICY IF EXISTS "Public read access" ON battery_storage;
CREATE POLICY "Public read access" ON battery_storage
  FOR SELECT
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_battery_storage_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS battery_storage_updated_at ON battery_storage;
CREATE TRIGGER battery_storage_updated_at
  BEFORE UPDATE ON battery_storage
  FOR EACH ROW
  EXECUTE FUNCTION update_battery_storage_updated_at();

-- Insert sample data for top 20 German home storage systems
-- Note: Prices and specs are examples and should be verified with current market data

INSERT INTO battery_storage (slug, brand, model, variant, production_location, production_country, module_capacity_kwh, min_modules, max_modules, total_capacity_min_kwh, total_capacity_max_kwh, cell_technology, cycle_life, depth_of_discharge_pct, efficiency_pct, charge_power_kw, discharge_power_kw, continuous_power_kw, peak_power_kw, compatible_inverters, inverter_type, backup_capable, mounting_type, dimensions_h_mm, dimensions_w_mm, dimensions_d_mm, weight_kg, ip_rating, operating_temp_min_c, operating_temp_max_c, price_per_module_eur, installation_cost_eur, warranty_years, warranty_cycles, warranty_capacity_retention_pct, has_app, has_energy_management, supports_solar, supports_grid_services, status, release_year, certifications, description, manufacturer_url) VALUES

-- 1. BYD Battery-Box Premium HVS
('byd-battery-box-premium-hvs', 'BYD', 'Battery-Box Premium', 'HVS', 'China', 'China', 2.56, 2, 5, 5.12, 12.80, 'LFP', 6000, 90, 96.0, 3.5, 3.5, 3.5, 5.0, ARRAY['Fronius', 'SMA', 'Kostal', 'Goodwe'], 'DC-coupled', true, 'Wall', 713, 600, 220, 36, 'IP55', -10, 50, 2490, 1200, 10, 6000, 80, true, true, true, false, 'Available', 2020, ARRAY['CE', 'VDE', 'IEC 62619'], 'High-quality LFP storage system with excellent scalability and proven reliability.', 'https://www.byd.com'),

-- 2. sonnenBatterie 10
('sonnenbatterie-10', 'sonnen', 'sonnenBatterie', '10', 'Germany', 'Germany', 5.5, 2, 6, 11.0, 33.0, 'LFP', 10000, 100, 93.0, 4.6, 4.6, 4.6, 8.0, ARRAY['sonnen inverter (integrated)'], 'All-in-one', true, 'Floor', 1670, 660, 280, 120, 'IP20', 0, 35, 6500, 2500, 10, 10000, 70, true, true, true, true, 'Available', 2021, ARRAY['CE', 'VDE'], 'Premium German-made all-in-one system with virtual power plant capabilities.', 'https://sonnen.de'),

-- 3. E3/DC S10 E PRO
('e3dc-s10-e-pro', 'E3/DC', 'S10 E', 'PRO', 'Germany', 'Germany', 6.5, 1, 4, 6.5, 26.0, 'NMC', 7000, 95, 94.5, 9.2, 9.2, 9.2, 13.8, ARRAY['E3/DC (integrated)'], 'All-in-one', true, 'Floor', 1655, 680, 295, 140, 'IP20', 0, 40, 7800, 3000, 10, 7000, 80, true, true, true, true, 'Available', 2019, ARRAY['CE', 'VDE', 'IEC 62619'], 'Premium all-in-one system with AI-based energy management and emergency power function.', 'https://www.e3dc.com'),

-- 4. RCT Power Battery
('rct-power-battery', 'RCT Power', 'Power Battery', NULL, 'Germany', 'Germany', 5.12, 1, 6, 5.12, 30.72, 'LFP', 6000, 90, 95.0, 5.0, 5.0, 5.0, 7.5, ARRAY['RCT Power inverters'], 'DC-coupled', true, 'Floor', 900, 600, 230, 65, 'IP20', -10, 50, 3200, 1500, 10, 6000, 80, true, true, true, false, 'Available', 2020, ARRAY['CE', 'VDE'], 'German-engineered LFP system with high efficiency and flexible scalability.', 'https://www.rct-power.com'),

-- 5. SENEC Home V3 hybrid
('senec-home-v3-hybrid', 'SENEC', 'Home V3', 'hybrid', 'Germany', 'Germany', 5.0, 1, 4, 5.0, 20.0, 'LFP', 10000, 100, 94.0, 5.0, 5.0, 5.0, 7.5, ARRAY['SENEC (integrated)'], 'All-in-one', true, 'Floor', 1260, 650, 300, 110, 'IP20', 0, 40, 5500, 2200, 10, 10000, 70, true, true, true, true, 'Available', 2020, ARRAY['CE', 'VDE'], 'All-in-one system with cloud integration and virtual power plant participation.', 'https://senec.com'),

-- 6. Tesla Powerwall 3
('tesla-powerwall-3', 'Tesla', 'Powerwall', '3', 'China', 'China', 13.5, 1, 3, 13.5, 40.5, 'LFP', 3750, 100, 90.0, 11.5, 11.5, 11.5, 17.5, ARRAY['Tesla (integrated)'], 'All-in-one', true, 'Wall', 1098, 609, 193, 130, 'IP67', -20, 50, 9500, 3000, 10, 3750, 70, true, true, true, false, 'Available', 2024, ARRAY['CE', 'IEC 62619'], 'High-capacity all-in-one system with integrated solar inverter and exceptional power output.', 'https://www.tesla.com/powerwall'),

-- 7. LG Chem RESU 10H
('lg-chem-resu-10h', 'LG Chem', 'RESU', '10H', 'Europe', 'Poland', 9.8, 1, 1, 9.8, 9.8, 'NMC', 6000, 90, 95.0, 5.0, 5.0, 5.0, 7.0, ARRAY['SMA', 'Fronius', 'SolarEdge', 'Kostal'], 'DC-coupled', false, 'Wall', 693, 452, 226, 78, 'IP55', -10, 45, 5800, 1500, 10, 6000, 60, false, false, true, false, 'Available', 2017, ARRAY['CE', 'IEC 62619'], 'Compact high-voltage battery with wide inverter compatibility.', 'https://www.lg.com'),

-- 8. VARTA pulse neo
('varta-pulse-neo', 'VARTA', 'pulse', 'neo', 'Germany', 'Germany', 6.5, 1, 4, 6.5, 26.0, 'LFP', 6000, 90, 93.0, 7.0, 7.0, 7.0, 10.5, ARRAY['VARTA element (integrated)'], 'All-in-one', true, 'Floor', 1455, 550, 280, 115, 'IP20', 0, 40, 6200, 2000, 10, 6000, 80, true, true, true, false, 'Available', 2022, ARRAY['CE', 'VDE'], 'German quality all-in-one system with AI-based optimization and emergency power.', 'https://www.varta-ag.com'),

-- 9. Huawei LUNA2000
('huawei-luna2000', 'Huawei', 'LUNA2000', NULL, 'China', 'China', 5.0, 1, 6, 5.0, 30.0, 'LFP', 6000, 100, 96.5, 5.0, 5.0, 5.0, 6.5, ARRAY['Huawei SUN2000'], 'DC-coupled', true, 'Floor', 670, 600, 150, 70, 'IP66', -20, 60, 2800, 1000, 10, 6000, 70, true, true, true, false, 'Available', 2021, ARRAY['CE', 'IEC 62619'], 'High-efficiency modular system with excellent thermal management and IP66 rating.', 'https://solar.huawei.com'),

-- 10. Pylontech Force L2
('pylontech-force-l2', 'Pylontech', 'Force L2', NULL, 'China', 'China', 3.55, 1, 8, 3.55, 28.40, 'LFP', 6000, 95, 95.0, 3.7, 3.7, 3.7, 5.0, ARRAY['Victron', 'Goodwe', 'Deye', 'Growatt'], 'DC-coupled', false, 'Floor', 440, 420, 130, 37, 'IP20', -10, 50, 1850, 800, 10, 6000, 80, false, false, true, false, 'Available', 2020, ARRAY['CE', 'IEC 62619'], 'Cost-effective modular LFP system with wide inverter compatibility.', 'https://www.pylontech.com.cn'),

-- 11. SolarEdge Energy Bank
('solaredge-energy-bank', 'SolarEdge', 'Energy Bank', NULL, 'China', 'China', 9.7, 1, 3, 9.7, 29.1, 'NMC', 5000, 90, 94.5, 5.0, 5.0, 5.0, 7.5, ARRAY['SolarEdge inverters'], 'DC-coupled', true, 'Floor', 1135, 656, 214, 120, 'IP55', -10, 50, 6500, 1800, 10, 5000, 70, true, true, true, false, 'Available', 2023, ARRAY['CE', 'UL 9540'], 'Integrated battery solution optimized for SolarEdge solar systems with backup capability.', 'https://www.solaredge.com'),

-- 12. Alpha ESS SMILE-B3
('alpha-ess-smile-b3', 'Alpha ESS', 'SMILE-B3', NULL, 'China', 'China', 2.9, 2, 10, 5.8, 29.0, 'LFP', 6000, 90, 95.0, 3.0, 3.0, 3.0, 4.5, ARRAY['Alpha ESS inverters'], 'DC-coupled', true, 'Wall', 490, 420, 130, 30, 'IP65', -10, 55, 1650, 900, 10, 6000, 70, true, true, true, false, 'Available', 2021, ARRAY['CE', 'IEC 62619'], 'Compact modular system with IP65 rating suitable for outdoor installation.', 'https://www.alpha-ess.com'),

-- 13. Sungrow SBR HV
('sungrow-sbr-hv', 'Sungrow', 'SBR', 'HV', 'China', 'China', 3.2, 2, 8, 6.4, 25.6, 'LFP', 6000, 90, 96.0, 3.3, 3.3, 3.3, 5.0, ARRAY['Sungrow SH-Series'], 'DC-coupled', true, 'Floor', 460, 445, 130, 35, 'IP65', -10, 55, 1950, 850, 10, 6000, 80, true, true, true, false, 'Available', 2020, ARRAY['CE', 'IEC 62619'], 'High-efficiency modular LFP system with IP65 protection for flexible installation.', 'https://www.sungrowpower.com'),

-- 14. Goodwe Lynx Home U
('goodwe-lynx-home-u', 'Goodwe', 'Lynx Home', 'U', 'China', 'China', 3.1, 1, 6, 3.1, 18.6, 'LFP', 6000, 90, 95.5, 3.2, 3.2, 3.2, 4.8, ARRAY['Goodwe inverters'], 'DC-coupled', true, 'Floor', 440, 420, 150, 36, 'IP65', -10, 55, 1700, 750, 10, 6000, 70, true, true, true, false, 'Available', 2021, ARRAY['CE', 'IEC 62619'], 'Compact modular battery with high efficiency and outdoor-capable IP65 rating.', 'https://www.goodwe.com'),

-- 15. Fronius Solar Battery
('fronius-solar-battery', 'Fronius', 'Solar Battery', NULL, 'Europe', 'Austria', 4.5, 1, 6, 4.5, 27.0, 'LFP', 6000, 90, 94.0, 4.5, 4.5, 4.5, 6.5, ARRAY['Fronius GEN24', 'Fronius Symo Hybrid'], 'DC-coupled', true, 'Wall', 730, 520, 225, 60, 'IP55', -10, 50, 3400, 1400, 10, 6000, 80, true, true, true, false, 'Available', 2022, ARRAY['CE', 'VDE'], 'Austrian-made battery optimized for Fronius hybrid inverters with emergency power.', 'https://www.fronius.com'),

-- 16. Kostal PIKO Battery Li
('kostal-piko-battery-li', 'Kostal', 'PIKO Battery', 'Li', 'Germany', 'Germany', 5.5, 1, 4, 5.5, 22.0, 'NMC', 6000, 90, 93.5, 5.5, 5.5, 5.5, 8.0, ARRAY['Kostal PLENTICORE'], 'DC-coupled', true, 'Floor', 1230, 540, 230, 95, 'IP20', 0, 40, 4200, 1600, 10, 6000, 80, true, true, true, false, 'Available', 2019, ARRAY['CE', 'VDE'], 'German-engineered battery system with integrated emergency power functionality.', 'https://www.kostal-solar-electric.com'),

-- 17. Fenecon Home
('fenecon-home', 'Fenecon', 'Home', NULL, 'Germany', 'Germany', 5.5, 1, 6, 5.5, 33.0, 'LFP', 6000, 95, 94.0, 10.0, 10.0, 10.0, 15.0, ARRAY['Fenecon (integrated)'], 'All-in-one', true, 'Floor', 1680, 600, 300, 180, 'IP20', 0, 40, 6800, 2400, 10, 6000, 80, true, true, true, true, 'Available', 2020, ARRAY['CE', 'VDE'], 'German all-in-one system with high power output and virtual power plant capabilities.', 'https://fenecon.de'),

-- 18. Q.HOME+ ESS HYB-G3
('qhome-ess-hyb-g3', 'Q.HOME', 'ESS HYB-G3', NULL, 'Europe', 'France', 4.8, 1, 6, 4.8, 28.8, 'LFP', 6000, 90, 95.0, 4.6, 4.6, 4.6, 7.0, ARRAY['Q.HOME+ inverter'], 'All-in-one', true, 'Floor', 1350, 580, 290, 110, 'IP20', 0, 40, 4500, 1700, 10, 6000, 70, true, true, true, false, 'Available', 2021, ARRAY['CE', 'VDE'], 'European-made all-in-one system with integrated hybrid inverter and backup.', 'https://www.q-cells.eu'),

-- 19. Solarwatt Battery flex
('solarwatt-battery-flex', 'Solarwatt', 'Battery', 'flex', 'Germany', 'Germany', 4.8, 1, 5, 4.8, 24.0, 'NMC', 5500, 90, 93.0, 4.6, 4.6, 4.6, 6.9, ARRAY['KACO', 'SMA', 'Fronius'], 'DC-coupled', false, 'Wall', 770, 545, 220, 68, 'IP20', 0, 40, 4100, 1500, 10, 5500, 80, true, false, true, false, 'Available', 2020, ARRAY['CE', 'VDE', 'IEC 62619'], 'German-made modular battery with BMW battery cells and wide inverter compatibility.', 'https://www.solarwatt.de'),

-- 20. Viessmann Vitocharge VX3
('viessmann-vitocharge-vx3', 'Viessmann', 'Vitocharge', 'VX3', 'Germany', 'Germany', 7.6, 1, 4, 7.6, 30.4, 'LFP', 6000, 90, 94.5, 11.0, 11.0, 11.0, 16.5, ARRAY['Viessmann Vitocharge (integrated)'], 'All-in-one', true, 'Floor', 1640, 600, 285, 165, 'IP20', 0, 40, 8200, 2800, 10, 6000, 80, true, true, true, false, 'Available', 2023, ARRAY['CE', 'VDE'], 'Premium German all-in-one system with high power output and smart home integration.', 'https://www.viessmann.de');

-- Create view for easy querying with calculated fields
CREATE OR REPLACE VIEW battery_storage_enriched AS
SELECT
  *,
  ROUND(price_per_module_eur / module_capacity_kwh, 0) AS price_per_kwh_eur,
  ROUND((total_capacity_min_kwh + total_capacity_max_kwh) / 2, 1) AS avg_capacity_kwh
FROM battery_storage;

COMMENT ON TABLE battery_storage IS 'Home battery storage systems available in the German market';
COMMENT ON VIEW battery_storage_enriched IS 'Battery storage with calculated price per kWh and average capacity';
