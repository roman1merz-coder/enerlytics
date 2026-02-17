import { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { useCompare } from '../context/CompareContext';
import { useFavorites } from '../context/FavoritesContext';
import { getBrandColors, getBrandInitials } from '../lib/carImage';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { Search, ChevronDown, BarChart2, Grid3x3, Square, CheckSquare, Heart } from 'lucide-react';
import './EVDatabase.css';
const PlotlyChart = lazy(() => import('./PlotlyChart'));

export default function EVDatabase() {
  const navigate = useNavigate();
  const { selectedCars, addCar, removeCar } = useCompare();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [searchParams, setSearchParams] = useSearchParams();
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
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Initialize filters from URL params on mount
  useEffect(() => {
    const params = Object.fromEntries(searchParams);
    if (params.q) setSearchTerm(params.q);
    if (params.segment) setSegmentFilter(params.segment.split(','));
    if (params.brand) setBrandFilter(params.brand.split(','));
    if (params.sort) setSortBy(params.sort);
    if (params.dt) setDrivetrainFilter(params.dt.split(','));
    if (params.favs === '1') setShowFavoritesOnly(true);
  }, []);

  // Sync filters to URL
  useEffect(() => {
    const params = {};
    if (searchTerm) params.q = searchTerm;
    if (segmentFilter.length) params.segment = segmentFilter.join(',');
    if (brandFilter.length) params.brand = brandFilter.join(',');
    if (sortBy !== 'name') params.sort = sortBy;
    if (drivetrainFilter.length) params.dt = drivetrainFilter.join(',');
    if (showFavoritesOnly) params.favs = '1';
    setSearchParams(params, { replace: true });
  }, [searchTerm, segmentFilter, brandFilter, sortBy, drivetrainFilter, showFavoritesOnly, setSearchParams]);

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
    const matchesFavorites = !showFavoritesOnly || isFavorite(car.id);

    return matchesSearch && matchesSegment && matchesBrand && matchesPrice && matchesRange && matchesBattery && matchesDrivetrain && matchesPower && matchesFavorites;
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
      <Helmet>
        <title>EV Database — Enerlytics</title>
        <meta name="description" content="Compare 331 EV variants with real-world range, charging speeds, and battery chemistry data for DACH market." />
      </Helmet>
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
                <button
                  className={`favorites-toggle ${showFavoritesOnly ? 'active' : ''}`}
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  title={`Show Favorites Only (${favorites.length})`}
                >
                  <Heart size={16} fill={showFavoritesOnly ? 'currentColor' : 'none'} />
                  <span className="favorites-count">{favorites.length}</span>
                </button>
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
                    <div className="card-image" style={{ background: getBrandColors(car.brand).bg }}>
                      <span className="brand-badge" style={{ color: getBrandColors(car.brand).text }}>
                        {getBrandInitials(car.brand)}
                      </span>
                      <button
                        className="card-favorite-btn"
                        onClick={() => toggleFavorite(car.id)}
                        title={isFavorite(car.id) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart size={18} fill={isFavorite(car.id) ? 'currentColor' : 'none'} />
                      </button>
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

            {viewMode === 'chart' && (
              <Suspense fallback={<div className="loading">Loading chart...</div>}>
                <PlotlyChart cars={sortedCars} onSelectCar={(car) => { navigate(`/evs/${car.slug}`); }} />
              </Suspense>
            )}

            {sortedCars.length === 0 && <div className="empty-state"><p>No vehicles match your filters. Try adjusting your search.</p></div>}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
