import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { useCompare } from '../context/CompareContext';
import { useFavorites } from '../context/FavoritesContext';
import { getBrandColors, getBrandInitials } from '../lib/carImage';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { ArrowLeft, Plus, Heart } from 'lucide-react';
import ChargeCurve from './ChargeCurve';
import './EVDetail.css';

export default function EVDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { selectedCars, addCar, removeCar } = useCompare();
  const { isFavorite, toggleFavorite } = useFavorites();
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
      category: 'Winter & Thermal',
      items: [
        { label: 'Heat Pump', value: car.has_heat_pump ? 'Yes' : 'No' },
        { label: 'Battery Preconditioning', value: car.has_battery_preconditioning ? 'Yes' : 'No' },
        { label: 'Winter Range', value: car.winter_range_km ? `${car.winter_range_km} km` : 'N/A' },
        { label: 'Winter Range Loss', value: car.winter_range_pct ? `${(100 - car.winter_range_pct).toFixed(0)}%` : 'N/A' },
        { label: 'Platform Voltage', value: car.platform_voltage ? `${car.platform_voltage}V` : 'N/A' },
      ],
    },
    {
      category: 'Battery Technology',
      items: [
        { label: 'Chemistry', value: car.battery_chemistry || 'N/A' },
        { label: 'Warranty', value: car.battery_warranty_years ? `${car.battery_warranty_years} yrs / ${(car.battery_warranty_km/1000).toFixed(0)}k km` : 'N/A' },
        { label: '10-80% Charge Time', value: car.charge_time_10_80_min ? `${car.charge_time_10_80_min} min` : 'N/A' },
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
      <Helmet>
        <title>{car.brand} {car.model} — Enerlytics</title>
        <meta name="description" content={`${car.brand} ${car.model} ${car.variant_trim}: ${car.real_range_km}km real range, ${car.battery_kwh}kWh battery, €${(car.price_eur || 0).toLocaleString()}. Compare specs with engineering data.`} />
      </Helmet>
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
            <div className="hero-image-placeholder" style={{ background: getBrandColors(car.brand).bg }}>
              <span className="detail-brand-badge" style={{ color: getBrandColors(car.brand).text }}>
                {getBrandInitials(car.brand)}
              </span>
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

              <div className="detail-actions">
                <button className={`add-compare-btn ${isSelected ? 'selected' : ''}`} onClick={handleAddToCompare}>
                  <Plus size={18} />
                  {isSelected ? 'Remove from Compare' : 'Add to Compare'}
                </button>
                <button
                  className={`favorite-btn ${isFavorite(car.id) ? 'favorited' : ''}`}
                  onClick={() => toggleFavorite(car.id)}
                  title={isFavorite(car.id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart size={18} fill={isFavorite(car.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
          </div>

          <ChargeCurve car={car} />

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
