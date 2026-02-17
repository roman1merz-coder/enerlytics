import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { getBrandColors, getBrandInitials } from '../lib/carImage';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { Snowflake, Zap, Car, Home, ArrowRight, Star } from 'lucide-react';
import './Matcher.css';

export default function Matcher() {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);

  // Lifestyle sliders
  const [climate, setClimate] = useState(50); // 0=mild city, 100=alpine winter
  const [driving, setDriving] = useState(50); // 0=urban mix, 100=autobahn cruiser
  const [homeCharging, setHomeCharging] = useState(true);
  const [budget, setBudget] = useState(50000);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => { fetchCars(); }, []);

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase.from('ev_variants').select('*');
      if (error) throw error;
      setCars(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const calculateMatchScore = (car) => {
    let score = 100;

    // Winter climate fit (0-30 points)
    if (climate > 60) {
      if (!car.has_heat_pump) score -= 15;
      if (!car.has_battery_preconditioning) score -= 10;
      if (car.winter_range_km && car.winter_range_km < 200) score -= 10;
    }

    // Driving style fit (0-25 points)
    if (driving > 60) { // Autobahn cruiser
      if (car.real_range_km < 350) score -= 15;
      if (car.dc_fast_charge_kw < 150) score -= 10;
      if (car.platform_voltage === 800) score += 5;
    } else { // Urban
      if (car.consumption_wh_km > 200) score -= 10;
      if (car.length_mm > 4600) score -= 5;
    }

    // Home charging consideration
    if (!homeCharging) {
      if (car.dc_fast_charge_kw < 100) score -= 15;
      if (car.charge_time_10_80_min > 40) score -= 10;
    }

    // Budget fit (0-20 points)
    const priceDiff = Math.abs((car.price_eur || 0) - budget);
    if (priceDiff < 5000) score += 5;
    else if (priceDiff > 20000) score -= 15;
    else if (priceDiff > 10000) score -= 8;
    if ((car.price_eur || 0) > budget * 1.2) score -= 20;

    return Math.max(0, Math.min(100, score));
  };

  const rankedCars = [...cars]
    .map(car => ({ ...car, matchScore: calculateMatchScore(car) }))
    .filter(car => (car.price_eur || 0) <= budget * 1.5)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 12);

  const questions = [
    {
      icon: <Snowflake size={24} />,
      title: 'Where do you live?',
      subtitle: 'This affects winter range calculations',
      input: (
        <div className="slider-group">
          <input type="range" min="0" max="100" value={climate} onChange={e => setClimate(+e.target.value)} className="match-slider" />
          <div className="slider-labels"><span>Mild City</span><span>Alpine Winter</span></div>
        </div>
      )
    },
    {
      icon: <Car size={24} />,
      title: 'How do you drive?',
      subtitle: 'Determines range and charging needs',
      input: (
        <div className="slider-group">
          <input type="range" min="0" max="100" value={driving} onChange={e => setDriving(+e.target.value)} className="match-slider" />
          <div className="slider-labels"><span>Urban Mix</span><span>Autobahn Cruiser</span></div>
        </div>
      )
    },
    {
      icon: <Home size={24} />,
      title: 'Can you charge at home?',
      subtitle: 'Home charging changes what matters most',
      input: (
        <div className="toggle-group">
          <button className={`toggle-opt ${homeCharging ? 'active' : ''}`} onClick={() => setHomeCharging(true)}>Yes</button>
          <button className={`toggle-opt ${!homeCharging ? 'active' : ''}`} onClick={() => setHomeCharging(false)}>No</button>
        </div>
      )
    },
    {
      icon: <Zap size={24} />,
      title: 'What\'s your budget?',
      subtitle: 'Approximate total price',
      input: (
        <div className="slider-group">
          <div className="budget-display">€{budget.toLocaleString()}</div>
          <input type="range" min="20000" max="150000" step="5000" value={budget} onChange={e => setBudget(+e.target.value)} className="match-slider" />
          <div className="slider-labels"><span>€20k</span><span>€150k</span></div>
        </div>
      )
    }
  ];

  return (
    <>
      <Helmet>
        <title>Find Your Match — Enerlytics</title>
        <meta name="description" content="Answer 4 lifestyle questions and find the perfect EV for your reality." />
      </Helmet>
      <Nav />
      <div className="matcher-page">
        <div className="matcher-container">
          {!showResults ? (
            <div className="matcher-flow">
              <div className="matcher-header">
                <h1>Find Your Perfect EV</h1>
                <p>Answer a few questions about your life. We'll match you with the best options.</p>
                <div className="step-dots">
                  {questions.map((_, i) => (
                    <div key={i} className={`step-dot ${i === step ? 'active' : i < step ? 'done' : ''}`} />
                  ))}
                </div>
              </div>
              <div className="question-card">
                <div className="question-icon">{questions[step].icon}</div>
                <h2>{questions[step].title}</h2>
                <p>{questions[step].subtitle}</p>
                {questions[step].input}
              </div>
              <div className="matcher-nav">
                {step > 0 && <button className="match-btn secondary" onClick={() => setStep(step - 1)}>Back</button>}
                {step < questions.length - 1 ? (
                  <button className="match-btn primary" onClick={() => setStep(step + 1)}>Next <ArrowRight size={16} /></button>
                ) : (
                  <button className="match-btn primary" onClick={() => setShowResults(true)}>See My Matches <Star size={16} /></button>
                )}
              </div>
              <button className="skip-link" onClick={() => navigate('/evs')}>
                Skip — show me the full database →
              </button>
            </div>
          ) : (
            <div className="results-section">
              <div className="results-header">
                <h1>Your Top Matches</h1>
                <p>Based on your lifestyle: {climate > 60 ? 'Cold climate' : 'Mild climate'} · {driving > 60 ? 'Highway driver' : 'City driver'} · {homeCharging ? 'Home charging' : 'Public charging'} · €{budget.toLocaleString()} budget</p>
                <button className="match-btn secondary" onClick={() => { setShowResults(false); setStep(0); }}>Adjust Preferences</button>
              </div>
              <div className="results-grid">
                {rankedCars.map((car, idx) => (
                  <div key={car.id} className="result-card" onClick={() => navigate(`/evs/${car.slug}`)}>
                    <div className="result-rank">#{idx + 1}</div>
                    <div className="result-score">
                      <div className="score-circle" style={{ background: `conic-gradient(var(--blue) ${car.matchScore * 3.6}deg, var(--bg3) 0deg)` }}>
                        <span>{car.matchScore}%</span>
                      </div>
                    </div>
                    <div className="result-image" style={{ background: getBrandColors(car.brand).bg }}>
                      <span className="result-brand-badge" style={{ color: getBrandColors(car.brand).text }}>{getBrandInitials(car.brand)}</span>
                    </div>
                    <div className="result-info">
                      <span className="result-brand">{car.brand}</span>
                      <h3>{car.model}</h3>
                      <p>{car.variant_trim}</p>
                    </div>
                    <div className="result-highlights">
                      <span>{car.real_range_km} km range</span>
                      <span>€{(car.price_eur || 0).toLocaleString()}</span>
                      {car.has_heat_pump && <span className="badge-mini hp">Heat Pump</span>}
                      {car.platform_voltage === 800 && <span className="badge-mini v800">800V</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
