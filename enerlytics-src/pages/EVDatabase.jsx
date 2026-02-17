import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCompare } from '../context/CompareContext';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { Search, ChevronDown, BarChart2, Grid3x3, Square, CheckSquare } from 'lucide-react';
import './EVDatabase.css';
import PlotlyChart from './PlotlyChart';

export default function EVDatabase() {
  const navigate = useNavigate();
  const { selectedCars, addCar, removeCar } = useCompare();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('cards');
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedBrandFilter, setExpandedBrandFilter] = useState(true);
  const [segmentFilter, setSegmentFilter] = useState([]);
  const [brandFilter, setBrandFilter] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [realRangeRange, setRealRangeRange] = useState([0, 800]);
  const [batteryRange, setBatteryRange] = useState([0, 200]);
  const [powerRange, setPowerRange] = useState([0, 1000]);
  const [drivetrainFilter, setDrivetrainFilter] = useState([]);
  const [brands, setBrands] = useState([]);
  const [segments, setSegments] = useState([]);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase.from('ev_variants').select('*');
      if (error) throw error;
      setCars(data || []);

      const uniqueBrands = [...new Set(data?.map((c) => c.brand) || [])].sort();
      const uniqueSegments = [...new Set(data?.map((c) => c.segment) || [])].sort();
      setBrands(uniqueBrands);
      setSegments(uniqueSegments);

      if (data && data.length > 0) {
        const prices = data.map((c) => c.price_eur).filter(Boolean);
        const ranges = data.map((c) => c.real_range_km).filter(Boolean);
        const batteries = data.map((c) => c.battery_kwh).filter(Boolean);
        const powers = data.map((c) => c.power_kw).filter(Boolean);

        if (prices.length > 0) {
          setPriceRange([Math.min(...prices), Math.max(...prices)]);
        }
        if (ranges.length > 0) {
          setRealRangeRange([Math.min(...ranges), Math.max(...ranges)]);
        }
        if (batteries.length > 0) {
          setBatteryRange([Math.min(...batteries), Math.max(...batteries)]);
        }
        if (powers.length > 0) {
          setPowerRange([Math.min(...powers), Math.max(...powers)]);
        }
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      !searchTerm ||
      `${car.brand} ${car.model} ${car.variant_trim}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSegment = segmentFilter.length === 0 || segmentFilter.includes(car.segment);
    const matchesBrand = brandFilter.length === 0 || brandFilter.includes(car.brand);
    const matchesPrice = car.price_eur >= priceRange[0] && car.price_eur <= priceRange[1];
    const matchesRange = car.real_range_km >= realRangeRange[0] && car.real_range_km <= realRangeRange[1];
    const matchesBattery = car.battery_kwh >= batteryRange[0] && car.battery_kwh <= batteryRange[1];
    const matchesDrivetrain = drivetrainFilter.length === 0 || drivetrainFilter.some((dt) => car.motor_config?.toLowerCase().includes(dt.toLowerCase()));
    const matchesPower = car.power_kw >= powerRange[0] && car.power_kw <= powerRange[1];

    return matchesSearch && matchesSegment && matchesBrand && matchesPrice && matchesRange && matchesBattery && matchesDrivetrain && matchesPower;
  });

  const sortedCars = [...filteredCars].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.price_eur || 0) - (b.price_eur || 0);
      case 'price-high':
        return (b.price_eur || 0) - (a.price_eur || 0);
      case 'range':
        return (b.real_range_km || 0) - (a.real_range_km || 0);
      case 'power':
        return (b.power_kw || 0) - (a.power_kw || 0);
      case 'battery':
        return (b.battery_kwh || 0) - (a.battery_kwh || 0);
      case 'name':
      default:
        return `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`);
    }
  });

  const toggleSegment = (segment) => {
    setSegmentFilter((prev) => (prev.includes(segment) ? prev.filter((s) => s !== segment) : [...prev, segment]));
  };

  const toggleBrand = (brand) => {
    setBrandFilter((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]));
  };

  const toggleDrivetrain = (dt) => {
    setDrivetrainFilter((prev) => (prev.includes(dt) ? prev.filter((d) => d !== dt) : [...prev, dt]));
  };

  const isCarSelected = (carId) => selectedCars.some((c) => c.id === carId);

  const handleCarSelect = (car) => {
    if (isCarSelected(car.id)) {
      removeCar(car.id);
    } else {
      addCar(car);
    }
  };

  if (loading) {
    return (
      <>
        <Nav />
        <div className="ev-database">
          <div className="loading">Loading vehicles...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />

      <div className="ev-database">
        <div className="ev-container">
          <div className="ev-sidebar">
            <div className="filter-group">
              <label className="filter-label">Search</label>
              <input type="text" className="search-input" placeholder="Brand, model, or variant..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <div className="filter-group">
              <label className="filter-label">Segment</label>
              <div className="filter-chips">
                {segments.map((segment) => (
                  <button key={segment} className={`chip ${segmentFilter.includes(segment) ? 'active' : ''}`} onClick={() => toggleSegment(segment)}>
                    {segment}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <button className="filter-label expand-btn" onClick={() => setExpandedBrandFilter(!expandedBrandFilter)}>
                Brand
                <ChevronDown size={16} style={{ transform: expandedBrandFilter ? 'rotate(180deg)' : '' }} />
              </button>
              {expandedBrandFilter && (
                <div className="filter-checkboxes scrollable">
                  {brands.map((brand) => (
                    <label key={brand} className="checkbox-label">
                      <input type="checkbox" checked={brandFilter.includes(brand)} onChange={() => toggleBrand(brand)} />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="filter-group">
              <label className="filter-label">Price Range: €{priceRange[0].toLocaleString()} - €{priceRange[1].toLocaleString()}</label>
              <input type="range" min="0" max="200000" step="10000" value={priceRange[0]} onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])} className="slider" />
              <input type="range" min="0" max="200000" step="10000" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])} className="slider" />
            </div>

            <div className="filter-group">
              <label className="filter-label">Real Range: {realRangeRange[0]} - {realRangeRange[1]} km</label>
              <input type="range" min="0" max="800" step="10" value={realRangeRange[0]} onChange={(e) => setRealRangeRange([parseInt(e.target.value), realRangeRange[1]])} className="slider" />
              <input type="range" min="0" max="800" step="10" value={realRangeRange[1]} onChange={(e) => setRealRangeRange([realRangeRange[0], parseInt(e.target.value)])} className="slider" />
            </div>

            <div className="filter-group">
              <label className="filter-label">Battery: {batteryRange[0]} - {batteryRange[1]} kWh</label>
              <input type="range" min="0" max="200" step="5" value={batteryRange[0]} onChange={(e) => setBatteryRange([parseInt(e.target.value), batteryRange[1]])} className="slider" />
              <input type="range" min="0" max="200" step="5" value={batteryRange[1]} onChange={(e) => setBatteryRange([batteryRange[0], parseInt(e.target.value)])} className="slider" />
            </div>

            <div className="filter-group">
              <label className="filter-label">Drivetrain</label>
              <div className="filter-chips">
                {['RWD', 'AWD', 'FWD'].map((dt) => (
                  <button key={dt} className={`chip ${drivetrainFilter.includes(dt) ? 'active' : ''}`} onClick={() => toggleDrivetrain(dt)}>
                    {dt}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Power: {powerRange[0]} - {powerRange[1]} kW</label>
              <input type="range" min="0" max="1000" step="50" value={powerRange[0]} onChange={(e) => setPowerRange([parseInt(e.target.value), powerRange[1]])} className="slider" />
              <input type="range" min="0" max="1000" step="50" value={powerRange[1]} onChange={(e) => setPowerRange([powerRange[0], parseInt(e.target.value)])} className="slider" />
            </div>
          </div>

          <div className="ev-main">
            <div className="ev-topbar">
              <div className="ev-count">
                {sortedCars.length} EV{sortedCars.length !== 1 ? 's' : ''}
                {selectedCars.length > 0 && ` · ${selectedCars.length} selected`}
              </div>
              <div className="ev-controls">
                <div className="view-toggle">
                  <button className={`toggle-btn ${viewMode === 'cards' ? 'active' : ''}`} onClick={() => setViewMode('cards')}>
                    <Grid3x3 size={16} />
                  </button>
                  <button className={`toggle-btn ${viewMode === 'chart' ? 'active' : ''}`} onClick={() => setViewMode('chart')}>
                    <BarChart2 size={16} />
                  </button>
                </div>

                <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="name">Sort: Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="range">Range: Highest</option>
                  <option value="power">Power: Highest</option>
                  <option value="battery">Battery: Largest</option>
                </select>

                {selectedCars.length > 0 && (
                  <button className="compare-btn" onClick={() => navigate('/compare')}>
                    Compare ({selectedCars.length})
                  </button>
                )}
              </div>
            </div>

            {viewMode === 'cards' && (
              <div className="ev-grid">
                {sortedCars.map((car) => (
                  <div key={car.id} className="ev-card">
                    <div className="card-image">
                      <div className="image-placeholder">
                        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 60H80M35 60V50C35 48 36 46 38 46H62C64 46 65 48 65 50V60M25 60H75C76 60 77 61 77 62V70C77 71 76 72 75 72H25C24 72 23 71 23 70V62C23 61 24 60 25 60ZM32 68C32 70 31 72 29 72C27 72 26 70 26 68C26 66 27 64 29 64C31 64 32 66 32 68ZM71 68C71 70 72 72 74 72C76 72 77 70 77 68C77 66 76 64 74 64C72 64 71 66 71 68Z" fill="#e2e8f0" />
                        </svg>
                      </div>
                      <label className="card-checkbox">
                        {isCarSelected(car.id) ? <CheckSquare size={20} /> : <Square size={20} />}
                        <input type="checkbox" checked={isCarSelected(car.id)} onChange={() => handleCarSelect(car)} style={{ display: 'none' }} />
                      </label>
                    </div>

                    <div className="card-content">
                      <div className="card-header">
                        <span className="card-brand">{car.brand}</span>
                        <span className="card-segment">{car.segment}</span>
                      </div>
                      <h3 className="card-model">{car.model}</h3>
                      <p className="card-variant">{car.variant_trim}</p>

                      <div className="card-specs">
                        <div className="spec">
                          <span className="spec-label">Battery</span>
                          <span className="spec-value">{car.battery_kwh} kWh</span>
                        </div>
                        <div className="spec">
                          <span className="spec-label">Range</span>
                          <span className="spec-value">{car.real_range_km} km</span>
                        </div>
                        <div className="spec">
                          <span className="spec-label">Power</span>
                          <span className="spec-value">{car.power_kw} kW</span>
                        </div>
                        <div className="spec">
                          <span className="spec-label">DC Charge</span>
                          <span className="spec-value">{car.dc_fast_charge_kw} kW</span>
                        </div>
                      </div>

                      <div className="card-footer">
                        <div className="card-price">€{(car.price_eur || 0).toLocaleString()}</div>
                        <button className="card-link-btn" onClick={() => navigate(`/evs/${car.slug}`)}>
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {viewMode === 'chart' && <PlotlyChart cars={sortedCars} onSelectCar={(car) => { navigate(`/evs/${car.slug}`); }} />}

            {sortedCars.length === 0 && <div className="empty-state"><p>No vehicles match your filters. Try adjusting your search.</p></div>}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
