import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { useStorageCompare } from '../context/StorageCompareContext';
import { useStorageFavorites } from '../context/StorageFavoritesContext';
import { getStorageImageUrl, getStorageFallbackUrl } from '../lib/storageImage';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import PaybackCalculator from '../components/PaybackCalculator';
import {
  Heart,
  Plus,
  Minus,
  Battery,
  Zap,
  DollarSign,
  Package,
  Layers,
  Shield,
  Home,
  Cloud,
  Award,
  ArrowLeft,
} from 'lucide-react';
import './StorageDetail.css';

export default function StorageDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { selectedStorage, addStorage, removeStorage } = useStorageCompare();
  const { toggleFavorite, isFavorite } = useStorageFavorites();

  const [storage, setStorage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStorage();
  }, [slug]);

  const fetchStorage = async () => {
    try {
      const { data, error } = await supabase
        .from('battery_storage')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      setStorage(data);
    } catch (error) {
      console.error('Error fetching storage:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="ev-detail">
        <Nav />
        <div className="loading">Loading...</div>
        <Footer />
      </div>
    );
  }

  if (!storage) {
    return (
      <div className="ev-detail">
        <Nav />
        <div className="not-found">
          <h1>Storage System Not Found</h1>
          <button onClick={() => navigate('/storage')}>← Back to Storage Database</button>
        </div>
        <Footer />
      </div>
    );
  }

  const isInCompare = !!selectedStorage.find((s) => s.id === storage.id);
  const isInFavorites = isFavorite(storage.id);

  const imageUrl = getStorageImageUrl(storage.brand, storage.model);
  const fallbackUrl = getStorageFallbackUrl(storage.brand);

  return (
    <div className="ev-detail storage-detail">
      <Helmet>
        <title>{`${storage.brand} ${storage.model} — Battery Storage | Enerlytics`}</title>
        <meta
          name="description"
          content={`${storage.brand} ${storage.model}: ${storage.module_capacity_kwh} kWh module, ${storage.cell_technology || 'advanced'} cells, €${storage.price_per_module_eur?.toLocaleString()} per module. View full specs and calculate payback period.`}
        />
      </Helmet>

      <Nav />

      <div className="detail-container">
        {/* Back Button */}
        <button className="back-btn" onClick={() => navigate('/storage')}>
          <ArrowLeft size={18} /> Back to Storage Database
        </button>

        {/* Hero Section */}
        <div className="detail-hero">
          <div className="hero-image">
            <img
              src={imageUrl}
              alt={`${storage.brand} ${storage.model}`}
              onError={(e) => {
                e.target.src = fallbackUrl;
              }}
            />
          </div>

          <div className="hero-info">
            <div className="hero-header">
              <div>
                <h1>{storage.brand}</h1>
                <h2>{storage.model} {storage.variant || ''}</h2>
              </div>
              <button
                className={`favorite-btn-large ${isInFavorites ? 'active' : ''}`}
                onClick={() => toggleFavorite(storage.id)}
              >
                <Heart size={24} fill={isInFavorites ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="badges-row">
              {storage.cell_technology && <span className="badge">{storage.cell_technology}</span>}
              {storage.production_location && <span className="badge">{storage.production_location}</span>}
              {storage.backup_capable && <span className="badge backup">Backup</span>}
              {storage.status && <span className="badge status">{storage.status}</span>}
            </div>

            <div className="hero-highlights">
              <div className="highlight">
                <Battery size={24} />
                <div>
                  <span className="value">{storage.module_capacity_kwh} kWh</span>
                  <span className="label">Per Module</span>
                </div>
              </div>

              {storage.total_capacity_max_kwh && (
                <div className="highlight">
                  <Layers size={24} />
                  <div>
                    <span className="value">{storage.total_capacity_max_kwh.toFixed(1)} kWh</span>
                    <span className="label">Max Capacity ({storage.max_modules} modules)</span>
                  </div>
                </div>
              )}

              {storage.continuous_power_kw && (
                <div className="highlight">
                  <Zap size={24} />
                  <div>
                    <span className="value">{storage.continuous_power_kw} kW</span>
                    <span className="label">Continuous Power</span>
                  </div>
                </div>
              )}

              {storage.price_per_module_eur && (
                <div className="highlight price">
                  <DollarSign size={24} />
                  <div>
                    <span className="value">€{storage.price_per_module_eur.toLocaleString()}</span>
                    <span className="label">Per Module</span>
                  </div>
                </div>
              )}
            </div>

            <div className="hero-actions">
              <button
                className={`compare-btn-large ${isInCompare ? 'active' : ''}`}
                onClick={() => {
                  if (isInCompare) {
                    removeStorage(storage.id);
                  } else {
                    addStorage(storage);
                  }
                }}
              >
                {isInCompare ? <Minus size={20} /> : <Plus size={20} />}
                {isInCompare ? 'Remove from Compare' : 'Add to Compare'}
              </button>

              {storage.manufacturer_url && (
                <a
                  href={storage.manufacturer_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="manufacturer-link"
                >
                  Visit Manufacturer →
                </a>
              )}
            </div>

            {storage.description && (
              <p className="storage-description">{storage.description}</p>
            )}
          </div>
        </div>

        {/* Specifications */}
        <div className="specs-container">
          <h2>Technical Specifications</h2>

          {/* Capacity & Modules */}
          <div className="spec-category">
            <h3>
              <Layers /> Capacity & Modules
            </h3>
            <div className="spec-grid">
              <div className="spec-item">
                <span className="spec-label">Module Capacity</span>
                <span className="spec-value">{storage.module_capacity_kwh} kWh</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Min Modules</span>
                <span className="spec-value">{storage.min_modules || 1}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Max Modules</span>
                <span className="spec-value">{storage.max_modules}</span>
              </div>
              {storage.total_capacity_min_kwh && (
                <div className="spec-item">
                  <span className="spec-label">Min System Capacity</span>
                  <span className="spec-value">{storage.total_capacity_min_kwh.toFixed(1)} kWh</span>
                </div>
              )}
              {storage.total_capacity_max_kwh && (
                <div className="spec-item">
                  <span className="spec-label">Max System Capacity</span>
                  <span className="spec-value">{storage.total_capacity_max_kwh.toFixed(1)} kWh</span>
                </div>
              )}
            </div>
          </div>

          {/* Battery Technology */}
          <div className="spec-category">
            <h3>
              <Battery /> Battery Technology
            </h3>
            <div className="spec-grid">
              {storage.cell_technology && (
                <div className="spec-item">
                  <span className="spec-label">Cell Technology</span>
                  <span className="spec-value">{storage.cell_technology}</span>
                </div>
              )}
              {storage.cycle_life && (
                <div className="spec-item">
                  <span className="spec-label">Cycle Life</span>
                  <span className="spec-value">{storage.cycle_life.toLocaleString()} cycles</span>
                </div>
              )}
              {storage.depth_of_discharge_pct && (
                <div className="spec-item">
                  <span className="spec-label">Depth of Discharge</span>
                  <span className="spec-value">{storage.depth_of_discharge_pct}%</span>
                </div>
              )}
            </div>
          </div>

          {/* Performance */}
          <div className="spec-category">
            <h3>
              <Zap /> Performance
            </h3>
            <div className="spec-grid">
              {storage.efficiency_pct && (
                <div className="spec-item">
                  <span className="spec-label">Round-Trip Efficiency</span>
                  <span className="spec-value">{storage.efficiency_pct}%</span>
                </div>
              )}
              {storage.charge_power_kw && (
                <div className="spec-item">
                  <span className="spec-label">Max Charge Power</span>
                  <span className="spec-value">{storage.charge_power_kw} kW</span>
                </div>
              )}
              {storage.discharge_power_kw && (
                <div className="spec-item">
                  <span className="spec-label">Max Discharge Power</span>
                  <span className="spec-value">{storage.discharge_power_kw} kW</span>
                </div>
              )}
              {storage.continuous_power_kw && (
                <div className="spec-item">
                  <span className="spec-label">Continuous Power</span>
                  <span className="spec-value">{storage.continuous_power_kw} kW</span>
                </div>
              )}
              {storage.peak_power_kw && (
                <div className="spec-item">
                  <span className="spec-label">Peak Power</span>
                  <span className="spec-value">{storage.peak_power_kw} kW</span>
                </div>
              )}
            </div>
          </div>

          {/* Inverter Compatibility */}
          {storage.compatible_inverters && storage.compatible_inverters.length > 0 && (
            <div className="spec-category">
              <h3>
                <Package /> Inverter Compatibility
              </h3>
              <div className="spec-grid">
                <div className="spec-item full-width">
                  <span className="spec-label">Compatible Inverters</span>
                  <span className="spec-value">{storage.compatible_inverters.join(', ')}</span>
                </div>
                {storage.inverter_type && (
                  <div className="spec-item">
                    <span className="spec-label">Inverter Type</span>
                    <span className="spec-value">{storage.inverter_type}</span>
                  </div>
                )}
                <div className="spec-item">
                  <span className="spec-label">Backup Capable</span>
                  <span className="spec-value">{storage.backup_capable ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Installation */}
          <div className="spec-category">
            <h3>
              <Home /> Installation
            </h3>
            <div className="spec-grid">
              {storage.mounting_type && (
                <div className="spec-item">
                  <span className="spec-label">Mounting Type</span>
                  <span className="spec-value">{storage.mounting_type}</span>
                </div>
              )}
              {storage.dimensions_h_mm && (
                <div className="spec-item">
                  <span className="spec-label">Dimensions (H×W×D)</span>
                  <span className="spec-value">
                    {storage.dimensions_h_mm} × {storage.dimensions_w_mm} × {storage.dimensions_d_mm} mm
                  </span>
                </div>
              )}
              {storage.weight_kg && (
                <div className="spec-item">
                  <span className="spec-label">Weight</span>
                  <span className="spec-value">{storage.weight_kg} kg</span>
                </div>
              )}
              {storage.ip_rating && (
                <div className="spec-item">
                  <span className="spec-label">IP Rating</span>
                  <span className="spec-value">{storage.ip_rating}</span>
                </div>
              )}
              {storage.operating_temp_min_c !== null && (
                <div className="spec-item">
                  <span className="spec-label">Operating Temperature</span>
                  <span className="spec-value">
                    {storage.operating_temp_min_c}°C to {storage.operating_temp_max_c}°C
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Economics */}
          <div className="spec-category">
            <h3>
              <DollarSign /> Economics
            </h3>
            <div className="spec-grid">
              <div className="spec-item">
                <span className="spec-label">Price per Module</span>
                <span className="spec-value">€{storage.price_per_module_eur?.toLocaleString()}</span>
              </div>
              {storage.installation_cost_eur && (
                <div className="spec-item">
                  <span className="spec-label">Installation Cost (est.)</span>
                  <span className="spec-value">€{storage.installation_cost_eur.toLocaleString()}</span>
                </div>
              )}
              {storage.price_per_module_eur && storage.module_capacity_kwh && (
                <div className="spec-item">
                  <span className="spec-label">Price per kWh</span>
                  <span className="spec-value">
                    €{Math.round(storage.price_per_module_eur / storage.module_capacity_kwh).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Warranty */}
          {(storage.warranty_years || storage.warranty_cycles) && (
            <div className="spec-category">
              <h3>
                <Shield /> Warranty
              </h3>
              <div className="spec-grid">
                {storage.warranty_years && (
                  <div className="spec-item">
                    <span className="spec-label">Warranty Period</span>
                    <span className="spec-value">{storage.warranty_years} years</span>
                  </div>
                )}
                {storage.warranty_cycles && (
                  <div className="spec-item">
                    <span className="spec-label">Warranty Cycles</span>
                    <span className="spec-value">{storage.warranty_cycles.toLocaleString()} cycles</span>
                  </div>
                )}
                {storage.warranty_capacity_retention_pct && (
                  <div className="spec-item">
                    <span className="spec-label">Capacity Retention</span>
                    <span className="spec-value">{storage.warranty_capacity_retention_pct}%</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Smart Features */}
          <div className="spec-category">
            <h3>
              <Cloud /> Smart Features
            </h3>
            <div className="spec-grid">
              <div className="spec-item">
                <span className="spec-label">Mobile App</span>
                <span className="spec-value">{storage.has_app ? 'Yes' : 'No'}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Energy Management</span>
                <span className="spec-value">{storage.has_energy_management ? 'Yes' : 'No'}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Solar Compatible</span>
                <span className="spec-value">{storage.supports_solar ? 'Yes' : 'No'}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Grid Services</span>
                <span className="spec-value">{storage.supports_grid_services ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          {/* Certifications */}
          {storage.certifications && storage.certifications.length > 0 && (
            <div className="spec-category">
              <h3>
                <Award /> Certifications
              </h3>
              <div className="certification-badges">
                {storage.certifications.map((cert) => (
                  <span key={cert} className="certification-badge">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Payback Calculator */}
        <PaybackCalculator storage={storage} />
      </div>

      <Footer />
    </div>
  );
}
