import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { useStorageCompare } from '../context/StorageCompareContext';
import { useStorageFavorites } from '../context/StorageFavoritesContext';
import { getStorageImageUrl, getStorageFallbackUrl } from '../lib/storageImage';
import { getCheapestPrice, getDiscountPercent, getOfferCount } from '../lib/storagePrices';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { Search, ChevronDown, Grid3x3, Square, CheckSquare, Heart, Tag, ExternalLink } from 'lucide-react';
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
    } catch (error) {
      console.error('Error fetching storage:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  const filteredStorage = storage.filter((item) => {
    const matchesSearch = !searchTerm ||
      `${item.brand} ${item.model} ${item.variant}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = productionLocationFilter.length === 0 ||
      productionLocationFilter.includes(item.production_location);
    const matchesBrand = brandFilter.length === 0 || brandFilter.includes(item.brand);
    const matchesTech = cellTechFilter.length === 0 ||
      cellTechFilter.includes(item.cell_technology);
    const matchesMount = mountingTypeFilter.length === 0 ||
      mountingTypeFilter.includes(item.mounting_type);
    const matchesBackup = !backupFilter || item.backup_capable === true;
    const matchesFavorites = !showFavoritesOnly || isFavorite(item.id);

    return matchesSearch && matchesLocation && matchesBrand && matchesTech &&
      matchesMount && matchesBackup && matchesFavorites;
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

  if (loading) {
    return (
      <>
        <Nav />
        <div className="ev-database">
          <div className="loading">Loading storage systems...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Battery Storage Systems for Home & Solar | Enerlytics</title>
        <meta
          name="description"
          content="Compare home battery storage systems available in Germany. Filter by capacity, price, cell technology, and production location. Find the perfect storage for your solar system."
        />
      </Helmet>

      <Nav />

      <div className="ev-database">
        <div className="ev-container">
          <div className="ev-sidebar">
            {/* Search */}
            <div className="filter-group">
              <label className="filter-label">Search</label>
              <input
                type="text"
                className="search-input"
                placeholder="Brand, model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Production Location */}
            <div className="filter-group">
              <label className="filter-label">Production Location</label>
              <div className="filter-chips">
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
                className="filter-label expand-btn"
                onClick={() => setExpandedBrandFilter(!expandedBrandFilter)}
              >
                Brand
                <ChevronDown size={16} style={{ transform: expandedBrandFilter ? 'rotate(180deg)' : '' }} />
              </button>
              {expandedBrandFilter && (
                <div className="filter-checkboxes scrollable">
                  {brands.map((brand) => (
                    <label key={brand} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={brandFilter.includes(brand)}
                        onChange={() => toggleChipFilter(brand, brandFilter, setBrandFilter)}
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Cell Technology */}
            <div className="filter-group">
              <label className="filter-label">Cell Technology</label>
              <div className="filter-chips">
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
              <label className="filter-label">Mounting Type</label>
              <div className="filter-chips">
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
                <span>Backup-capable only</span>
              </label>
            </div>
          </div>

          <div className="ev-main">
            <div className="ev-topbar">
              <div className="ev-count">
                {sortedStorage.length} system{sortedStorage.length !== 1 ? 's' : ''}
                {selectedStorage.length > 0 && ` · ${selectedStorage.length} selected`}
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

                <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="name">Sort: Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="capacity">Capacity</option>
                  <option value="power">Power</option>
                  <option value="efficiency">Efficiency</option>
                </select>

                {selectedStorage.length > 0 && (
                  <button className="compare-btn" onClick={() => navigate('/storage/compare')}>
                    Compare ({selectedStorage.length})
                  </button>
                )}
              </div>
            </div>

            <div className="ev-grid">
              {sortedStorage.map((item) => {
                const isSelected = !!selectedStorage.find((s) => s.id === item.id);
                const imageUrl = getStorageImageUrl(item.brand, item.model);
                const fallbackUrl = getStorageFallbackUrl(item.brand);
                const cheapest = getCheapestPrice(item.slug);
                const discount = getDiscountPercent(item.slug);
                const offerCount = getOfferCount(item.slug);

                return (
                  <div key={item.id} className="ev-card">
                    <div className="card-image">
                      <img
                        src={imageUrl}
                        alt={`${item.brand} ${item.model}`}
                        className="card-car-image"
                        loading="lazy"
                        onError={(e) => {
                          if (e.target.src !== fallbackUrl) {
                            e.target.src = fallbackUrl;
                          }
                        }}
                      />
                      {discount && (
                        <span className="card-discount-badge">-{discount}%</span>
                      )}
                      <button
                        className="card-favorite-btn"
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
                        title={isFavorite(item.id) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart size={18} fill={isFavorite(item.id) ? 'currentColor' : 'none'} />
                      </button>
                      <label className="card-checkbox" onClick={(e) => e.stopPropagation()}>
                        {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                        <input type="checkbox" checked={isSelected} onChange={() => handleStorageSelect(item)} style={{ display: 'none' }} />
                      </label>
                    </div>

                    <div className="card-content" onClick={() => navigate(`/storage/${item.slug}`)}>
                      <div className="card-header">
                        <span className="card-brand">{item.brand}</span>
                        <span className="card-segment">{item.cell_technology || 'Storage'}</span>
                      </div>
                      <h3 className="card-model">{item.model}</h3>
                      <p className="card-variant">{item.variant || ''}</p>

                      <div className="card-specs">
                        <div className="spec">
                          <span className="spec-label">Module</span>
                          <span className="spec-value">{item.module_capacity_kwh} kWh</span>
                        </div>
                        <div className="spec">
                          <span className="spec-label">Max Cap.</span>
                          <span className="spec-value">{item.total_capacity_max_kwh ? `${item.total_capacity_max_kwh.toFixed(1)} kWh` : 'N/A'}</span>
                        </div>
                        <div className="spec">
                          <span className="spec-label">Power</span>
                          <span className="spec-value">{item.continuous_power_kw} kW</span>
                        </div>
                        <div className="spec">
                          <span className="spec-label">Efficiency</span>
                          <span className="spec-value">{item.efficiency_pct ? `${item.efficiency_pct}%` : 'N/A'}</span>
                        </div>
                      </div>

                      <div className="card-footer">
                        <div className="card-price-section">
                          {cheapest ? (
                            <>
                              <div className="card-price card-price--best">ab €{cheapest.toLocaleString()}</div>
                              {offerCount > 0 && (
                                <div className="card-offers-count">
                                  <Tag size={12} /> {offerCount} Angebote
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="card-price">€{(item.price_per_module_eur || 0).toLocaleString()}</div>
                          )}
                        </div>
                        <button className="card-link-btn" onClick={(e) => { e.stopPropagation(); navigate(`/storage/${item.slug}`); }}>
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {sortedStorage.length === 0 && (
              <div className="empty-state">
                <p>No storage systems match your filters. Try adjusting your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
