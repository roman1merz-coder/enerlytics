import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Zap,
  ArrowRight,
  Thermometer,
  Shield,
  BarChart3,
  Lightbulb,
  Globe,
  Car,
  PlugZap,
  Sun,
  Flame,
  Bike,
  Battery,
  BatteryCharging,
  BookOpen,
  TrendingUp,
} from 'lucide-react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const observerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('vis');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const productCards = [
    {
      title: 'EV Selector',
      description: 'Compare every EV sold in the DACH region by real-world range, charging speed, and total cost.',
      icon: <Car size={22} />,
      live: true,
      meta: '331 variants',
      route: '/evs',
    },
    {
      title: 'Wallbox Finder',
      description: 'Find the right home charger for your EV, electrical panel, and solar setup.',
      icon: <PlugZap size={22} />,
      live: false,
    },
    {
      title: 'Solar & PV',
      description: 'Optimize panel layout, inverter sizing, and battery storage for your roof.',
      icon: <Sun size={22} />,
      live: false,
    },
    {
      title: 'Heat Pump',
      description: 'Right-size heating systems with real climate data and building physics.',
      icon: <Flame size={22} />,
      live: false,
    },
    {
      title: 'E-Bike',
      description: 'Motor, battery, and range — tested on real commutes, not lab rollers.',
      icon: <Bike size={22} />,
      live: false,
    },
    {
      title: 'Battery Storage Selector',
      description: 'Compare 50+ home storage systems by capacity, efficiency, payback period, and production location.',
      icon: <Battery size={22} />,
      live: true,
      meta: '20 systems',
      route: '/storage',
    },
    {
      title: 'Energy Provider',
      description: 'Compare tariffs, green energy share, and grid flexibility options.',
      icon: <Lightbulb size={22} />,
      live: false,
    },
    {
      title: 'Insights',
      description: 'Technical deep-dives into battery chemistry, efficiency ratings, and real-world performance testing.',
      icon: <BookOpen size={22} />,
      live: false,
    },
    {
      title: 'News',
      description: 'Upcoming products, industry developments, and engineering breakthroughs in clean-tech.',
      icon: <TrendingUp size={22} />,
      live: false,
    },
  ];

  const insightCards = [
    {
      tag: 'EV Selector',
      tagClass: 'ev',
      date: 'Feb 10, 2026',
      title: 'LFP vs NMC Batteries: What Actually Matters for Daily Driving',
      description: 'We break down charge curves, degradation data, and cold-weather performance across 12 models to help you pick the right chemistry.',
    },
    {
      tag: 'Heat Pumps',
      tagClass: 'hp',
      date: 'Feb 3, 2026',
      title: 'COP Ratings Are Misleading — Here\'s What to Look At Instead',
      description: 'Manufacturer COP values are measured at 7°C. We tested 8 units at -5°C and found performance gaps of up to 40%.',
    },
    {
      tag: 'Solar & PV',
      tagClass: 'solar',
      date: 'Jan 28, 2026',
      title: 'East-West vs South-Facing Panels: A DACH Cost Analysis',
      description: 'Conventional wisdom says south. Our simulation across 14 Austrian postcodes tells a different story for self-consumption.',
    },
  ];

  const newsCards = [
    {
      tag: 'EVs',
      tagClass: 'ev',
      date: 'Feb 12, 2026',
      title: 'Xiaomi SU7 Ultra: 1,548 HP and a Nürburgring Record',
      description: 'The Chinese automaker just set the fastest production EV lap. We look at the specs that matter beyond the headline.',
    },
    {
      tag: 'Solar',
      tagClass: 'solar',
      date: 'Feb 8, 2026',
      title: 'Perovskite-Silicon Tandem Cells Hit 33.9% Efficiency',
      description: 'Oxford PV\'s latest cells are nearing commercialization. Here\'s what this means for residential rooftop economics.',
    },
    {
      tag: 'Heat Pumps',
      tagClass: 'hp',
      date: 'Feb 5, 2026',
      title: 'Bosch Announces CO₂-Based Heat Pump for Retrofits',
      description: 'A natural refrigerant unit designed for pre-1990 buildings. We break down the published specs and what\'s missing.',
    },
    {
      tag: 'E-Bikes',
      tagClass: 'ebike',
      date: 'Jan 30, 2026',
      title: 'Shimano EP801 Motor: First Independent Torque Tests',
      description: 'Lab-tested peak torque and efficiency curves at various cadences — compared to Bosch CX and Brose S Mag.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Enerlytics - Find the EV that fits your reality</title>
        <meta name="description" content="Engineering data to calculate real-world range, charging speeds, and winter performance for EV buyers in the DACH region." />
        <meta property="og:title" content="Enerlytics - Find the EV that fits your reality" />
        <meta property="og:description" content="Engineering data to calculate real-world range, charging speeds, and winter performance for EV buyers in the DACH region." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://enerlytics.com" />
      </Helmet>
      <Nav />

      <section className="hero">
        <div className="wrap">
          <div className="hero-pill">
            <span className="hero-dot"></span>Engineering data, not marketing
          </div>
          <h1>
            Find the EV that fits<br />
            <em>your reality.</em>
          </h1>
          <p className="hero-sub">
            Engineering data to calculate real-world range, charging speeds,<br />
            and winter performance — so you choose with confidence.
          </p>
          <div className="hero-ctas">
            <button className="btn-cta" onClick={() => navigate('/match')}>
              Start Your Match <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <section className="section" id="products">
        <div className="wrap">
          <div className="prod-head reveal">
            <h2>One platform. Every clean-tech decision.</h2>
          </div>
          <div className="prod-grid">
            {productCards.map((card, idx) => (
              <div
                key={idx}
                className={`prod-card ${card.live ? 'live' : 'soon'} reveal d${(idx % 8) + 1}`}
                onClick={card.live && card.route ? () => navigate(card.route) : undefined}
                style={card.live ? { cursor: 'pointer' } : undefined}
              >
                <span className="prod-badge">{card.live ? 'Live' : 'Coming soon'}</span>
                <div className="prod-ic">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                {card.meta && (
                  <div className="prod-meta">
                    <BarChart3 size={14} />
                    {card.meta}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ctx" id="context">
        <div className="wrap">
          <div className="ctx-grid">
            <div className="ctx-left reveal">
              <div className="ctx-pill">
                <span className="pill-tag">EV Selector — Featured</span>
              </div>
              <h2>Context is everything.</h2>
              <p>
                Lab range is measured at 23°C with no HVAC, no passengers, and perfect roads.
                Your reality is different. We model real-world conditions so you know what to
                expect — before you buy.
              </p>

              <div className="feat">
                <div className="feat-ic">
                  <Thermometer size={18} />
                </div>
                <div>
                  <div className="feat-t">Winter-Proof Ratings</div>
                  <div className="feat-d">
                    We factor heat pump efficiency, cabin preconditioning, and battery thermal
                    management.
                  </div>
                </div>
              </div>

              <div className="feat">
                <div className="feat-ic">
                  <Zap size={18} />
                </div>
                <div>
                  <div className="feat-t">True Charging Time</div>
                  <div className="feat-d">
                    Time to add 200 km of real highway range — not misleading 10-80% lab curves.
                  </div>
                </div>
              </div>

              <div className="feat">
                <div className="feat-ic">
                  <Shield size={18} />
                </div>
                <div>
                  <div className="feat-t">Battery Health Check</div>
                  <div className="feat-d">
                    LFP vs NMC chemistry breakdown with cycle-life projections and warranty
                    analysis.
                  </div>
                </div>
              </div>
            </div>

            <div className="chart-card reveal d2">
              <div className="chart-head">
                <span>Cargo Volume vs. Range</span>
                <span>12 EVs compared</span>
              </div>
              <div className="chart-area">
                {[
                  {x:42,y:75,c:'blue'},{x:55,y:62,c:'blue'},{x:48,y:58,c:'teal'},{x:62,y:70,c:'blue'},
                  {x:38,y:45,c:'dim'},{x:70,y:68,c:'blue'},{x:52,y:55,c:'teal'},{x:65,y:80,c:'blue'},
                  {x:30,y:35,c:'dim'},{x:75,y:60,c:'teal'},{x:58,y:72,c:'blue'},{x:45,y:50,c:'dim'},
                ].map((p, i) => (
                  <div key={i} className={`chart-dot ${p.c}`} style={{left:`${p.x}%`,bottom:`${p.y}%`}} />
                ))}
                {['280 L','480 L','680 L','900 L'].map((label, i) => (
                  <div key={`y-${i}`} className="chart-y-label" style={{bottom:`${i*30+10}%`}}>{label}</div>
                ))}
                {['400 km','455 km','510 km','565 km','620 km'].map((label, i) => (
                  <div key={`x-${i}`} className="chart-x-label" style={{left:`${i*22+5}%`}}>{label}</div>
                ))}
              </div>
              <div className="chart-axis-label">Range (km)</div>
            </div>
          </div>
        </div>
      </section>

      <section className="tagline">
        <h2>No marketing. Just physics.</h2>
      </section>

      <section className="articles" id="insights">
        <div className="wrap">
          <div className="art-head reveal">
            <div className="art-pill">
              <Lightbulb size={14} />
              Deep dives & comparisons
            </div>
            <h2>Clean-Tech Insights</h2>
            <p>In-depth analysis and comparisons across the products we track — backed by engineering data.</p>
          </div>
          <div className="art-grid">
            {insightCards.map((card, idx) => (
              <div key={idx} className={`art-card reveal d${idx + 1}`}>
                <div className="art-meta">
                  <span className={`art-tag ${card.tagClass}`}>{card.tag}</span>
                  <span className="art-date">{card.date}</span>
                </div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="articles" id="news">
        <div className="wrap">
          <div className="art-head reveal">
            <div className="art-pill">
              <Globe size={14} />
              What's coming next
            </div>
            <h2>Clean-Tech News</h2>
            <p>Exciting upcoming products and breakthroughs — covered with an engineering lens, not press releases.</p>
          </div>
          <div className="art-grid two-col">
            {newsCards.map((card, idx) => (
              <div key={idx} className={`art-card reveal d${idx + 1}`}>
                <div className="art-meta">
                  <span className={`art-tag ${card.tagClass}`}>{card.tag}</span>
                  <span className="art-date">{card.date}</span>
                </div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="cta">
        <div className="cta-inner reveal">
          <div className="cta-content">
            <h2>Find the EV that fits your reality.</h2>
            <p>331 variants. 39 brands. Real-world data from DACH driving conditions.</p>
            <button className="btn-cta" onClick={() => navigate('/evs')}>
              Start Your Match <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <Footer />

    </>
  );
}
