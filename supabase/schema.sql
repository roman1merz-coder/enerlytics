-- Create ev_variants table with proper structure and indexes
CREATE TABLE IF NOT EXISTS public.ev_variants (
    id BIGSERIAL PRIMARY KEY,
    brand_group TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    variant_trim TEXT,
    battery_kwh NUMERIC,
    motor_config TEXT,
    power_kw NUMERIC,
    power_hp NUMERIC,
    wltp_range_km NUMERIC,
    real_range_km NUMERIC,
    dc_fast_charge_kw NUMERIC,
    ac_charge_kw NUMERIC,
    consumption_wh_km NUMERIC,
    length_mm NUMERIC,
    width_mm NUMERIC,
    height_mm NUMERIC,
    trunk_l NUMERIC,
    frunk_l NUMERIC,
    status TEXT,
    notes TEXT,
    segment TEXT,
    price_eur NUMERIC,
    co2_production_t NUMERIC,
    co2_lifetime_t NUMERIC,
    total_cargo_l NUMERIC,
    km_per_eur NUMERIC,
    slug TEXT UNIQUE NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_ev_variants_brand ON public.ev_variants(brand);
CREATE INDEX IF NOT EXISTS idx_ev_variants_model ON public.ev_variants(model);
CREATE INDEX IF NOT EXISTS idx_ev_variants_segment ON public.ev_variants(segment);
CREATE INDEX IF NOT EXISTS idx_ev_variants_price ON public.ev_variants(price_eur);
CREATE INDEX IF NOT EXISTS idx_ev_variants_slug ON public.ev_variants(slug);

-- Enable Row Level Security
ALTER TABLE public.ev_variants ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" ON public.ev_variants
    FOR SELECT
    USING (true);

-- Create policy for authenticated users to update
CREATE POLICY "Allow authenticated users to update" ON public.ev_variants
    FOR UPDATE
    TO authenticated
    USING (true);

-- Create policy for authenticated users to insert
CREATE POLICY "Allow authenticated users to insert" ON public.ev_variants
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create policy for authenticated users to delete
CREATE POLICY "Allow authenticated users to delete" ON public.ev_variants
    FOR DELETE
    TO authenticated
    USING (true);
