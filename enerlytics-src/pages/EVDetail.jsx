import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCompare } from '../context/CompareContext';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { ArrowLeft, Plus } from 'lucide-react';
import './EVDetail.css';

export default function EVDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { selectedCars, addCar, removeCar } = useCompare();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCar();
  }, [slug]);

  const fetchCar = async () => {
    try {
      const { data, error } = await supabase.from('ev_variants').select('*').eq('slug', slug).single();
      if (error) throw error;
      setCar(data);
    } catch (error) {
      console.error('Error fetching car:', error);
      navigate('/evs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Nav />
        <div className="ev-detail">
          <div className="loading">Loading vehicle details...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!car) {
    return (
      <>
        <Nav />
        <div className="ev-detail">
          <div className="empty-state">Vehicle not found</div>
        </div>
        <Footer />
      </>
    );
  }

  const isSelected = selectedCars.some((c) => c.id === car.id);

  const handleAddToCompare = () => {
    if (isSelected) {
      removeCar(car.id);
    } else {
      addCar(car);
    }
  };

  const specs = [
    {
      category: 'Performance',
      items: [
        { label: 'Power', value: `${car.power_kw} kW` },
        { label: 'Power (HP)', value: `${car.power_hp} HP` },
        { label: 'Motor Config', value: car.motor_config || 'N/A' },
      ],
    },
    {
      category: 'Battery & Range',
      items: [
        { label: 'Battery Capacity', value: `${car.battery_kwh} kWh` },
        { label: 'WLTP Range', value: `${car.wltp_range_km} km` },
        { label: 'Real Range', value: `${car.real_range_km} km` },
        { label: 'Consumption', value: `${car.consumption_wh_km} Wh/km` },
      ],
    },
    {
      category: 'Charging',
      items: [
        { label: 'DC Fast Charge', value: `${car.dc_fast_charge_kw} kW` },
        { label: 'AC Charge', value: `${car.ac_charge_kw} kW` },
      ],
    },
    {
      category: 'Dimensions',
      items: [
        { label: 'Length', value: `${car.length_mm} mm` },
        { label: 'Width', value: `${car.width_mm} mm` },
        { label: 'Height', value: `${car.height_mm} mm` },
      ],
    },
    {
      category: 'Cargo',
      items: [
        { label: 'Trunk', value: `${car.trunk_l} L` },
        { label: 'Frunk', value: `${car.frunk_l} L` },
        { label: 'Total Cargo', value: `${car.total_cargo_l} L` },
      ],
    },
    {
      category: 'Environmental',
      items: [
        { label: 'CO2 Production', value: `${car.co2_production_t} tonnes` },
        { label: 'Lifetime CO2', value: `${car.co2_lifetime_t} tonnes` },
      ],
    },
    {
      category: 'Economics',
      items: [
        { label: 'Price', value: `€${(car.price_eur || 0).toLocaleString()}` },
        { label: 'km per EUR', value: `${car.km_per_eur?.toFixed(2)} km/€` },
      ],
    },
  ];

  return (
    <>
      <Nav />

      <div className="ev-detail">
        <div className="detail-container">
          <div className="detail-header">
            <button className="back-link" onClick={() => navigate('/evs')}>
              <ArrowLeft size={16} /> Back to EV Database
            </button>
            <h1 className="detail-title">{car.brand} {car.model}</h1>
            <p className="detail-subtitle">{car.variant_trim}</p>
          </div>

          <div className="detail-hero">
            <div className="hero-image-placeholder">
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 60H80M35 60V50C35 48 36 46 38 46H62C64 46 65 48 65 50V60M25 60H75C76 60 77 61 77 62V70C77 71 76 72 75 72H25C24 72 23 71 23 70V62C23 61 24 60 25 60ZM32 68C32 70 31 72 29 72C27 72 26 70 26 68C26 66 27 64 29 64C31 64 32 66 32 68ZM71 68C71 70 72 72 74 72C76 72 77 70 77 68C77 66 76 64 74 64C72 64 71 66 71 68Z" fill="#e2e8f0" />
              </svg>
            </div>

            <div className="hero-info">
              <div className="info-badges">
                <span className="badge segment">{car.segment}</span>
                <span className="badge status">{car.status}</span>
              </div>

              <div className="info-highlights">
                <div className="highlight">
                  <div className="highlight-label">Real Range</div>
                  <div className="highlight-value">{car.real_range_km} km</div>
                </div>
                <div className="highlight">
                  <div className="highlight-label">Price</div>
                  <div className="highlight-value">€{(car.price_eur || 0).toLocaleString()}</div>
                </div>
                <div className="highlight">
                  <div className="highlight-label">Power</div>
                  <div className="highlight-value">{car.power_kw} kW</div>
                </div>
              </div>

              <button className={`add-compare-btn ${isSelected ? 'selected' : ''}`} onClick={handleAddToCompare}>
                <Plus size={18} />
                {isSelected ? 'Remove from Compare' : 'Add to Compare'}
              </button>
            </div>
          </div>

          <div className="detail-specs">
            {specs.map((section, idx) => (
              <div key={idx} className="spec-section">
                <h2 className="spec-section-title">{section.category}</h2>
                <div className="spec-grid">
                  {section.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="spec-item">
                      <span className="spec-item-label">{item.label}</span>
                      <span className="spec-item-value">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {car.notes && (
            <div className="detail-notes">
              <h2>Notes</h2>
              <p>{car.notes}</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
