# Enerlytics — Engineering Data for Clean-Tech Decisions

A premium EV comparison platform built for the DACH market. Uses real engineering data to help buyers find the electric vehicle that fits their reality — not just lab numbers.

**Live:** [enerlytics-sepia.vercel.app](https://enerlytics-sepia.vercel.app)

---

## 🔐 Supabase Credentials

**Project:** `mxboigeahudnbigxgefp` | **Region:** eu-central-1

```bash
# API Keys (in .env file)
VITE_SUPABASE_URL=https://mxboigeahudnbigxgefp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14Ym9pZ2VhaHVkbmJpZ3hnZWZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMTA1OTksImV4cCI6MjA4NjU4NjU5OX0.2jiVv0lThpeaa1pJZpWsmS5jtrylDpo-pjWQHm1AQ7s
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14Ym9pZ2VhaHVkbmJpZ3hnZWZwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTAxMDU5OSwiZXhwIjoyMDg2NTg2NTk5fQ.h9UfQD9Oq85m_LV0pLQvtqhrmOBhIuwlnsa02dIwKK0

# Database Password
DB_PASSWORD=RidbadW!1111
```

**📋 Important Notes:**
- **Supabase is the single source of truth** for all data
- When deploying new features, **Claude (AI assistant) should deploy migrations automatically** using the service role key
- All database changes must go through migrations in `/supabase/migrations/`
- Never modify data directly in production - always use migrations

**🔗 Quick Links:**
- [Supabase Dashboard](https://supabase.com/dashboard/project/mxboigeahudnbigxgefp)
- [SQL Editor](https://supabase.com/dashboard/project/mxboigeahudnbigxgefp/sql)
- [Table Editor](https://supabase.com/dashboard/project/mxboigeahudnbigxgefp/editor)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    Vercel (Hosting)                  │
│              CI/CD via GitHub integration            │
├─────────────────────────────────────────────────────┤
│               Vite + React 19 SPA                   │
│  ┌───────────┐ ┌──────────┐ ┌───────────────────┐  │
│  │  Landing   │ │EV Database│ │   EV Detail       │  │
│  │  /         │ │  /evs     │ │   /evs/:slug      │  │
│  ├───────────┤ ├──────────┤ ├───────────────────┤  │
│  │  Matcher   │ │ Compare  │ │   ChargeCurve     │  │
│  │  /match    │ │ /compare │ │   (SVG component) │  │
│  └───────────┘ └──────────┘ └───────────────────┘  │
│                                                     │
│  Context Providers: CompareContext, FavoritesContext │
│  Libs: supabase.js, carImage.js                     │
├─────────────────────────────────────────────────────┤
│            Supabase (PostgreSQL + REST)              │
│        ev_variants table — 331 variants, 39 brands  │
│            Public read via Row Level Security        │
└─────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | React 19 + Vite 7 | SPA with client-side routing |
| Routing | react-router-dom v7 | 5 routes, slug-based detail pages |
| Database | Supabase (PostgreSQL) | REST API, RLS public read policy |
| Charts | Plotly.js (code-split) | Lazy-loaded ~4.8 MB chunk via `React.lazy` |
| Car Images | imagin.studio CDN | Free, no API key, generates from make/model |
| SEO | react-helmet-async | Per-page title, description, Open Graph |
| Icons | lucide-react | Consistent icon system |
| Hosting | Vercel | Auto-deploy from GitHub `main` branch |
| Styling | Plain CSS + CSS Variables | Design tokens in App.css, no Tailwind |

## Project Structure

```
enerlytics/
├── index.html                  # Entry point with Inter font
├── vercel.json                 # SPA routing rewrites
├── vite.config.js              # Vite configuration
├── package.json
├── .env                        # VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY (not committed)
├── supabase/
│   └── migrations/
│       ├── 001_create_table.sql    # Base ev_variants schema
│       └── 002_winter_data.sql     # Winter/thermal columns + data enrichment
└── src/
    ├── main.jsx                # React root with HelmetProvider + BrowserRouter
    ├── App.jsx                 # Route definitions + context providers
    ├── App.css                 # Design system tokens (--bg, --blue, --text, etc.)
    ├── index.css               # Reset (intentionally minimal)
    ├── components/
    │   ├── Nav.jsx / Nav.css   # Sticky nav with mobile hamburger drawer
    │   └── Footer.jsx / Footer.css
    ├── context/
    │   ├── CompareContext.jsx   # Up to 4 cars, localStorage persisted
    │   └── FavoritesContext.jsx # Favorite car IDs, localStorage persisted
    ├── lib/
    │   ├── supabase.js         # Supabase client (env vars via import.meta.env)
    │   └── carImage.js         # imagin.studio CDN URL builder
    └── pages/
        ├── Landing.jsx / .css      # Hero, education section, interactive scatter chart
        ├── EVDatabase.jsx / .css   # Filterable grid: search, segment, brand, sort, favorites
        ├── EVDetail.jsx / .css     # Full specs, car image, charge curve, winter data
        ├── ChargeCurve.jsx         # SVG-based DC charging curve visualization
        ├── Compare.jsx / .css      # Side-by-side comparison (up to 4), best-value highlighting
        ├── Matcher.jsx / .css      # 4-step lifestyle questionnaire with match scoring
        └── PlotlyChart.jsx         # Interactive scatter plots (lazy-loaded)
```

## Key Features

### EV Database (`/evs`)
- 331 EV variants across 39 brands
- Multi-filter: search, segment, brand, sort order
- URL-persisted filter state via `useSearchParams` (shareable URLs)
- Favorites toggle with localStorage persistence
- Code-split Plotly scatter charts (Price vs Range, CO2 vs Range, etc.)

### EV Detail (`/evs/:slug`)
- Full technical specifications across 9 categories
- Car images from imagin.studio CDN
- SVG charging curve visualization (800V vs 400V profiles)
- Winter performance data: heat pump, preconditioning, winter range loss
- Battery technology: chemistry (LFP/NMC), warranty, 10-80% charge time

### Lifestyle Matcher (`/match`)
- 4-step questionnaire: Climate → Driving Style → Home Charging → Budget
- Scoring algorithm weights winter fit, driving profile, charging needs, budget
- Results grid with percentage match scores and contextual badges

### Compare (`/compare`)
- Side-by-side comparison of up to 4 vehicles
- Green highlighting on best values per spec
- Categories: Performance, Battery & Range, Charging, Winter & Thermal, Battery Tech, Dimensions, Cargo, Environmental, Economics

## Database Schema

The `ev_variants` table holds all vehicle data. Key columns:

**Core:** `id`, `brand`, `brand_group`, `model`, `variant_trim`, `slug`, `segment`, `status`

**Performance:** `power_kw`, `power_hp`, `motor_config`

**Battery & Range:** `battery_kwh`, `wltp_range_km`, `real_range_km`, `consumption_wh_km`

**Charging:** `dc_fast_charge_kw`, `ac_charge_kw`

**Winter (added via 002_winter_data.sql):** `has_heat_pump`, `has_battery_preconditioning`, `winter_range_km`, `winter_range_pct`, `platform_voltage`

**Battery Tech:** `battery_chemistry`, `battery_warranty_years`, `battery_warranty_km`, `charge_time_10_80_min`

**Dimensions:** `length_mm`, `width_mm`, `height_mm`, `trunk_l`, `frunk_l`, `total_cargo_l`

**Environmental:** `co2_production_t`, `co2_lifetime_t`

**Economics:** `price_eur`, `km_per_eur`

## Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project with the `ev_variants` table populated

### Setup

```bash
# Clone
git clone https://github.com/roman1merz-coder/enerlytics.git
cd enerlytics

# Install
npm install

# Environment variables
cp .env.example .env
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# Run migrations against your Supabase project (via SQL Editor)
# 1. supabase/migrations/001_create_table.sql
# 2. supabase/migrations/002_winter_data.sql

# Dev server
npm run dev

# Production build
npm run build
```

### Deployment

The project auto-deploys to Vercel on push to `main`. Environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) are configured in Vercel project settings.

Vercel config (`vercel.json`) handles SPA routing:
```json
{ "routes": [{ "handle": "filesystem" }, { "src": "/(.*)", "dest": "/index.html" }] }
```

## Infrastructure

| Service | Details |
|---------|---------|
| Supabase | Project: `mxboigeahudnbigxgefp`, Region: eu-central-1 |
| Vercel | Project: `enerlytics`, Auto-deploy from GitHub |
| GitHub | `roman1merz-coder/enerlytics`, branch: `main` |
| Car Images | imagin.studio CDN (customer: `hrjavascript-mastery`) |

## Design Decisions

- **Plain CSS over Tailwind**: Design tokens via CSS custom properties in `App.css` provide consistent theming without build tooling overhead.
- **Code-split Plotly**: At ~4.8 MB, Plotly is lazy-loaded only when users access chart views, keeping initial load at ~467 KB.
- **SVG ChargeCurve**: Custom SVG avoids adding another charting library; simulates realistic charge profiles based on platform voltage.
- **localStorage for state**: Compare list and favorites persist across sessions without requiring user authentication.
- **imagin.studio for images**: Free CDN that generates car images from make/model strings — no API key management needed.
- **Winter data estimation**: Heat pump/preconditioning data populated via brand-based heuristics in SQL migration; can be replaced with per-variant data as it becomes available.

## What's Next

- [ ] Populate real per-variant winter performance data (replace estimation heuristics)
- [ ] Add leasing/pricing partner integration (monetization)
- [ ] Implement user accounts for persistent favorites across devices
- [ ] Add more interactive education content (temperature ↔ range simulator)
- [ ] Expand to other clean-tech products (home batteries, solar, heat pumps)
- [ ] TypeScript migration for better DX and type safety
- [ ] Add E2E tests (Playwright)

## License

Private — All rights reserved.
