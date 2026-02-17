-- Winter Performance & Thermal Management columns
ALTER TABLE ev_variants ADD COLUMN IF NOT EXISTS has_heat_pump boolean DEFAULT false;
ALTER TABLE ev_variants ADD COLUMN IF NOT EXISTS has_battery_preconditioning boolean DEFAULT false;
ALTER TABLE ev_variants ADD COLUMN IF NOT EXISTS winter_range_km integer;
ALTER TABLE ev_variants ADD COLUMN IF NOT EXISTS winter_range_pct numeric(5,1);
ALTER TABLE ev_variants ADD COLUMN IF NOT EXISTS battery_chemistry text;
ALTER TABLE ev_variants ADD COLUMN IF NOT EXISTS battery_warranty_years integer;
ALTER TABLE ev_variants ADD COLUMN IF NOT EXISTS battery_warranty_km integer;
ALTER TABLE ev_variants ADD COLUMN IF NOT EXISTS charge_time_10_80_min integer;
ALTER TABLE ev_variants ADD COLUMN IF NOT EXISTS platform_voltage integer;

-- Populate with estimated data based on known EV specs
-- Heat pumps: Most modern EVs (2023+) have heat pumps
UPDATE ev_variants SET has_heat_pump = true WHERE brand IN ('Tesla', 'BMW', 'Hyundai', 'Kia', 'Mercedes-Benz', 'Audi', 'Porsche', 'Volkswagen', 'Polestar', 'Volvo', 'NIO', 'BYD', 'CUPRA', 'Rivian', 'Lucid');
UPDATE ev_variants SET has_heat_pump = false WHERE has_heat_pump IS NULL;

-- Battery preconditioning
UPDATE ev_variants SET has_battery_preconditioning = true WHERE brand IN ('Tesla', 'Porsche', 'Hyundai', 'Kia', 'BMW', 'Mercedes-Benz', 'Audi', 'Lucid', 'Rivian', 'NIO', 'BYD');
UPDATE ev_variants SET has_battery_preconditioning = false WHERE has_battery_preconditioning IS NULL;

-- Winter range: ~70-85% of real range depending on heat pump
UPDATE ev_variants SET winter_range_km = ROUND(real_range_km * 0.82) WHERE has_heat_pump = true;
UPDATE ev_variants SET winter_range_km = ROUND(real_range_km * 0.68) WHERE has_heat_pump = false;
UPDATE ev_variants SET winter_range_pct = ROUND((winter_range_km::numeric / NULLIF(real_range_km, 0)) * 100, 1);

-- Battery chemistry estimation
UPDATE ev_variants SET battery_chemistry = 'LFP' WHERE brand = 'Tesla' AND battery_kwh < 65;
UPDATE ev_variants SET battery_chemistry = 'LFP' WHERE brand = 'BYD';
UPDATE ev_variants SET battery_chemistry = 'NMC' WHERE battery_chemistry IS NULL;

-- Platform voltage estimation (800V systems)
UPDATE ev_variants SET platform_voltage = 800 WHERE brand IN ('Porsche', 'Lucid', 'Kia', 'Hyundai') AND dc_fast_charge_kw > 200;
UPDATE ev_variants SET platform_voltage = 800 WHERE brand = 'Audi' AND model LIKE '%e-tron GT%';
UPDATE ev_variants SET platform_voltage = 400 WHERE platform_voltage IS NULL;

-- Charge time 10-80% estimation based on battery size and DC charge rate
UPDATE ev_variants SET charge_time_10_80_min = ROUND((battery_kwh * 0.7) / NULLIF(dc_fast_charge_kw, 0) * 60 * 1.15);

-- Battery warranty
UPDATE ev_variants SET battery_warranty_years = 8, battery_warranty_km = 160000 WHERE brand IN ('Tesla', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Hyundai', 'Kia', 'Toyota', 'Lexus', 'Porsche', 'Volvo', 'Polestar', 'NIO', 'BYD', 'CUPRA', 'Rivian', 'Lucid');
UPDATE ev_variants SET battery_warranty_years = 8, battery_warranty_km = 160000 WHERE battery_warranty_years IS NULL;
