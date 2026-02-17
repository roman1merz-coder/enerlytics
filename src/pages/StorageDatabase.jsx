import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { useStorageCompare } from '../context/StorageCompareContext';
import { useStorageFavorites } from '../context/StorageFavoritesContext';
import { getStorageImageUrl, getStorageFallbackUrl } from '../lib/storageImage';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { Search, ChevronDown, Grid3x3, Square, CheckSquare, Heart, Battery, Zap, DollarSign, ArrowUpDown } from 'lucide-react';
import './StorageDatabase.css';

export default function StorageDatabase() {
  const navigate = useNavigate();
  const { selectedStorage, addStorage, removeStorage } = useStorageCompare();
  const { favorites, toggleFavorite, isFavorite } = useStorageFavorites();
  const [searchParams, setSearchParams] = useSearchParams();

  const [storage, setStorage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');

  // Filters
  const [productionLocationFilter, setProductionLocationFilter] = useState([]);
  const [brandFilter, setBrandFilter] = useState([]);
  const [cellTechFilter, setCellTechFilter] = useState([]);
  const [mountingTypeFilter, setMountingTypeFilter] = useState([]);
  const [backupFilter, setBackupFilter] = useState(false);
  const [capacityRange, setCapacityRange] = useState([0, 30]);
  const [priceRange, setPriceRange] = useState([0, 15000]);
  const [powerRange, setPowerRange] = useState([0, 15]);

  // Available filter options (populated from data)
  const [brands, setBrands] = useState([]);
  const [productionLocations, setProductionLocations] = useState([]);
  const [cellTechnologies, setCellTechnologies] = useState([]);
  const [mountingTypes, setMountingTypes] = useState([]);

  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [expandedBrandFilter, setExpandedBrandFilter] = useState(true);

  // Initialize filters from URL on mount
  useEffect(() => {
    const params = Object.fromEntries(searchParams);
    if (params.q) setSearchTerm(params.q);
    if (params.location) setProductionLocationFilter(params.location.split(','));
    if (params.brand) setBrandFilter(params.brand.split(','));
    if (params.tech) setCellTechFilter(params.tech.split(','));
    if (params.mount) setMountingTypeFilter(params.mount.split(','));
    if (params.backup === '1') setBackupFilter(true);
    if (params.sort) setSortBy(params.sort);
    if (params.favs === '1') setShowFavoritesOnly(true);
  }, []);

  // Sync filters to URL
  useEffect(() => {
    const params = {};
    if (searchTerm) params.q = searchTerm;
    if (productionLocationFilter.length) params.location = productionLocationFilter.join(',');
    if (brandFilter.length) params.brand = brandFilter.join(',');
    if (cellTechFilter.length) params.tech = cellTechFilter.join(',');
    if (mountingTypeFilter.length) params.mount = mountingTypeFilter.join(',');
    if (backupFilter) params.backup = '1';
    if (sortBy !== 'name') params.sort = sortBy;
    if (showFavoritesOnly) params.favs = '1';
    setSearchParams(params, { replace: true });
  }, [searchTerm, productionLocationFilter, brandFilter, cellTechFilter, mountingTypeFilter, backupFilter, sortBy, showFavoritesOnly, setSearchParams]);

  useEffect(() => {
    fetchStorage();
  }, []);

  const fetchStorage = async () => {
    try {
      const { data, error } = await supabase.from('battery_storage').select('*');
      if (error) throw error;
      setStorage(data || []);

      // Extract unique values for filters
      const uniqueBrands = [...new Set(data?.map((s) => s.brand) || [])].sort();
      const uniqueLocations = [...new Set(data?.map((s) => s.production_location).filter(Boolean) || [])].sort();
      const uniqueTech = [...new Set(data?.map((s) => s.cell_technology).filter(Boolean) || [])].sort();
      const uniqueMount = [...new Set(data?.map((s) => s.mounting_type).filter(Boolean) || [])].sort();

      setBrands(uniqueBrands);
      setProductionLocations(uniqueLocations);
      setCellTechnologies(uniqueTech);
      setMountingTypes(uniqueMount);

      // Set initial range filter bounds
      if (data && data.length > 0) {
        const capacities = data.map((s) => s.module_capacity_kwh).filter(Boolean);
        const prices = data.map((s) => s.price_per_module_eur).filter(Boolean);
        const powers = data.map((s) => s.continuous_power_kw).filter(Boolean);

        if (capacities.length > 0) {
          setCapacityRange([Math.floor(Math.min(...capacities)), Math.ceil(Math.max(...capacities))]);
        }
        if (prices.length > 0) {
          setPriceRange([Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))]);
        }
        if (powers.length > 0) {
          setPowerRange([Math.floor(Math.min(...powers)), Math.ceil(Math.max(...powers))]);
        }
      }
    } catch (error) {
      console.error('Error fetching storage:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  const filteredStorage = storage.filter((item) => {
    // Search
    const matchesSearch = !searchTerm ||
      `${item.brand} ${item.model} ${item.variant}`.toLowerCase().includes(searchTerm.toLowerCase());

    // Production location
    const matchesLocation = productionLocationFilter.length === 0 ||
      productionLocationFilter.includes(item.production_location);

    // Brand
    const matchesBrand = brandFilter.length === 0 || brandFilter.includes(item.brand);

    // Cell technology
    const matchesTech = cellTechFilter.length === 0 ||
      cellTechFilter.includes(item.cell_technology);

    // Mounting type
    const matchesMount = mountingTypeFilter.length === 0 ||
      mountingTypeFilter.includes(item.mounting_type);

    // Backup capable
    const matchesBackup = !backupFilter || item.backup_capable === true;

    // Capacity range
    const matchesCapacity = item.module_capacity_kwh >= capacityRange[0] &&
      item.module_capacity_kwh <= capacityRange[1];

    // Price range
    const matchesPrice = item.price_per_module_eur >= priceRange[0] &&
      item.price_per_module_eur <= priceRange[1];

    // Power range
    const matchesPower = (item.continuous_power_kw || 0) >= powerRange[0] &&
      (item.continuous_power_kw || 0) <= powerRange[1];

    // Favorites
    const matchesFavorites = !showFavoritesOnly || isFavorite(item.id);

    return matchesSearch && matchesLocation && matchesBrand && matchesTech &&
      matchesMount && matchesBackup && matchesCapacity && matchesPrice &&
      matchesPower && matchesFavorites;
  });

  // Sort logic
  const sortedStorage = [...filteredStorage].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`);
      case 'price-low':
        return (a.price_per_module_eur || 0) - (b.price_per_module_eur || 0);
      case 'price-high':
        return (b.price_per_module_eur || 0) - (a.price_per_module_eur || 0);
      case 'capacity':
        return (b.module_capacity_kwh || 0) - (a.module_capacity_kwh || 0);
      case 'power':
        return (b.continuous_power_kw || 0) - (a.continuous_power_kw || 0);
      case 'efficiency':
        return (b.efficiency_pct || 0) - (a.efficiency_pct || 0);
      default:
        return 0;
    }
  });

  const handleStorageSelect = (item) => {
    const isSelected = selectedStorage.find((s) => s.id === item.id);
    if (isSelected) {
      removeStorage(item.id);
    } else {
      addStorage(item);
    }
  };

  const toggleChipFilter = (value, filter, setFilter) => {
    setFilter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <div className="ev-database storage-database">
      <Helmet>
        <title>Battery Storage Systems for Home & Solar | Enerlytics</title>
        <meta
          name="description"
          content="Compare 50+ home battery storage systems available in Germany. Filter by capacity, price, cell technology, and production location. Find the perfect storage for your solar system."
        />
      </Helmet>

      <Nav />

      <div className="database-container">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar">
          <div className="filters-header">
            <h2>Filters</h2>
            <button
              className="clear-filters"
              onClick={() => {
                setSearchTerm('');
                setProductionLocationFilter([]);
                setBrandFilter([]);
                setCellTechFilter([]);
                setMountingTypeFilter([]);
                setBackupFilter(false);
                setShowFavoritesOnly(false);
              }}
            >
              Clear all
            </button>
          </div>

          {/* Search */}
          <div className="filter-group">
            <label>Search</label>
            <div className="search-input-wrapper">
              <Search size={18} />
              <input
                type="text"
                placeholder="Brand, model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Production Location */}
          <div className="filter-group">
            <label>Production Location</label>
            <div className="chip-filters">
              {productionLocations.map((loc) => (
                <button
                  key={loc}
                  className={`chip ${productionLocationFilter.includes(loc) ? 'active' : ''}`}
                  onClick={() => toggleChipFilter(loc, productionLocationFilter, setProductionLocationFilter)}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Brand */}
          <div className="filter-group">
            <button
              className="filter-group-header"
              onClick={() => setExpandedBrandFilter(!expandedBrandFilter)}
            >
              <label>Brand</label>
              <ChevronDown className={expandedBrandFilter ? 'rotated' : ''} size={18} />
            </button>
            {expandedBrandFilter && (
              <div className="checkbox-filters">
                {brands.slice(0, 15).map((brand) => (
                  <label key={brand} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={brandFilter.includes(brand)}
                      onChange={() => toggleChipFilter(brand, brandFilter, setBrandFilter)}
                    />
                    {brand}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Cell Technology */}
          <div className="filter-group">
            <label>Cell Technology</label>
            <div className="chip-filters">
              {cellTechnologies.map((tech) => (
                <button
                  key={tech}
                  className={`chip ${cellTechFilter.includes(tech) ? 'active' : ''}`}
                  onClick={() => toggleChipFilter(tech, cellTechFilter, setCellTechFilter)}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>

          {/* Mounting Type */}
          <div className="filter-group">
            <label>Mounting Type</label>
            <div className="chip-filters">
              {mountingTypes.map((type) => (
                <button
                  key={type}
                  className={`chip ${mountingTypeFilter.includes(type) ? 'active' : ''}`}
                  onClick={() => toggleChipFilter(type, mountingTypeFilter, setMountingTypeFilter)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Backup Capable */}
          <div className="filter-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={backupFilter}
                onChange={(e) => setBackupFilter(e.target.checked)}
              />
              Backup-capable only
            </label>
          </div>

          {/* Capacity Range */}
          <div className="filter-group">
            <label>
              Module Capacity: {capacityRange[0]}–{capacityRange[1]} kWh
            </label>
            <div className="dual-range">
              <input
                type="range"
                min="0"
                max="30"
                step="0.5"
                value={capacityRange[0]}
                onChange={(e) => setCapacityRange([Number(e.target.value), capacityRange[1]])}
              />
              <input
                type="range"
                min="0"
                max="30"
                step="0.5"
                value={capacityRange[1]}
                onChange={(e) => setCapacityRange([capacityRange[0], Number(e.target.value)])}
              />
            </div>
          </div>

          {/* Price Range */}
          <div className="filter-group">
            <label>
              Price per Module: €{priceRange[0].toLocaleString()}–€{priceRange[1].toLocaleString()}
            </label>
            <div className="dual-range">
              <input
                type="range"
                min="0"
                max="15000"
                step="100"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              />
              <input
                type="range"
                min="0"
                max="15000"
                step="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              />
            </div>
          </div>

          {/* Power Range */}
          <div className="filter-group">
            <label>
              Continuous Power: {powerRange[0]}–{powerRange[1]} kW
            </label>
            <div className="dual-range">
              <input
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={powerRange[0]}
                onChange={(e) => setPowerRange([Number(e.target.value), powerRange[1]])}
              />
              <input
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={powerRange[1]}
                onChange={(e) => setPowerRange([powerRange[0], Number(e.target.value)])}
              />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="database-main">
          {/* Topbar */}
          <div className="database-topbar">
            <div className="topbar-left">
              <h1>
                <Battery /> Battery Storage Systems
              </h1>
              <p className="results-count">
                {sortedStorage.length} {sortedStorage.length === 1 ? 'system' : 'systems'}
              </p>
            </div>

            <div className="topbar-right">
              {/* Favorites Toggle */}
              <button
                className={`favorites-toggle ${showFavoritesOnly ? 'active' : ''}`}
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                title="Show favorites only"
              >
                <Heart size={18} fill={showFavoritesOnly ? 'currentColor' : 'none'} />
                Favorites ({favorites.length})
              </button>

              {/* Sort */}
              <div className="sort-select">
                <ArrowUpDown size={16} />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="name">Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="capacity">Capacity</option>
                  <option value="power">Power</option>
                  <option value="efficiency">Efficiency</option>
                </select>
              </div>

              {/* Compare Button */}
              {selectedStorage.length > 0 && (
                <button className="compare-btn" onClick={() => navigate('/storage/compare')}>
                  Compare ({selectedStorage.length})
                </button>
              )}
            </div>
          </div>

          {/* Storage Grid */}
          {loading ? (
            <div className="loading">Loading storage systems...</div>
          ) : sortedStorage.length === 0 ? (
            <div className="no-results">
              <p>No storage systems match your filters.</p>
              <button onClick={() => {
                setSearchTerm('');
                setProductionLocationFilter([]);
                setBrandFilter([]);
                setCellTechFilter([]);
                setMountingTypeFilter([]);
                setBackupFilter(false);
                setShowFavoritesOnly(false);
              }}>
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="storage-grid">
              {sortedStorage.map((item) => {
                const isSelected = !!selectedStorage.find((s) => s.id === item.id);
                const imageUrl = getStorageImageUrl(item.brand, item.model);
                const fallbackUrl = getStorageFallbackUrl(item.brand);

                return (
                  <div key={item.id} className={`storage-card ${isSelected ? 'selected' : ''}`}>
                    <div className="card-header">
                      <button
                        className="favorite-btn"
                        onClick={() => toggleFavorite(item.id)}
                        title="Add to favorites"
                      >
                        <Heart size={20} fill={isFavorite(item.id) ? 'currentColor' : 'none'} />
                      </button>
                      <label className="compare-checkbox">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleStorageSelect(item)}
                        />
                        {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                      </label>
                    </div>

                    <div
                      className="card-image"
                      onClick={() => navigate(`/storage/${item.slug}`)}
                    >
                      <img
                        src={imageUrl}
                        alt={`${item.brand} ${item.model}`}
                        onError={(e) => {
                          e.target.src = fallbackUrl;
                        }}
                      />
                    </div>

                    <div className="card-content" onClick={() => navigate(`/storage/${item.slug}`)}>
                      <h3>{item.brand}</h3>
                      <p className="model">{item.model} {item.variant || ''}</p>

                      <div className="specs">
                        <div className="spec">
                          <Battery size={16} />
                          <span>
                            {item.module_capacity_kwh} kWh module
                            {item.max_modules > 1 && ` × ${item.max_modules}`}
                          </span>
                        </div>
                        {item.total_capacity_max_kwh && (
                          <div className="spec">
                            <span className="label">Max capacity:</span>
                            <span>{item.total_capacity_max_kwh.toFixed(1)} kWh</span>
                          </div>
                        )}
                        <div className="spec">
                          <Zap size={16} />
                          <span>{item.continuous_power_kw} kW continuous</span>
                        </div>
                        {item.efficiency_pct && (
                          <div className="spec">
                            <span className="label">Efficiency:</span>
                            <span>{item.efficiency_pct}%</span>
                          </div>
                        )}
                      </div>

                      <div className="badges">
                        {item.cell_technology && <span className="badge">{item.cell_technology}</span>}
                        {item.production_location && <span className="badge">{item.production_location}</span>}
                        {item.backup_capable && <span className="badge backup">Backup</span>}
                      </div>

                      <div className="card-footer">
                        <div className="price">
                          <DollarSign size={18} />
                          <span className="amount">€{item.price_per_module_eur?.toLocaleString()}</span>
                          <span className="unit">/module</span>
                        </div>
                        <button className="view-details-btn">View Details</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
