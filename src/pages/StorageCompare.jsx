import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useStorageCompare } from '../context/StorageCompareContext';
import { getStorageImageUrl, getStorageFallbackUrl } from '../lib/storageImage';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { Plus, X } from 'lucide-react';
import './Compare.css';

export default function StorageCompare() {
  const navigate = useNavigate();
  const { selectedStorage, removeStorage, clearAll } = useStorageCompare();

  if (selectedStorage.length === 0) {
    return (
      <>
        <Helmet>
          <title>Compare Battery Storage — Enerlytics</title>
          <meta name="description" content="Compare up to 4 home battery storage systems side-by-side with detailed specifications." />
        </Helmet>
        <Nav />
        <div className="compare-page">
          <div className="compare-container">
            <div className="empty-state">
              <h2>No storage systems selected</h2>
              <p>Select up to 4 storage systems to compare side-by-side.</p>
              <button className="cta-btn" onClick={() => navigate('/storage')}>
                Go to Storage Database
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const specs = [
    { category: 'Basic Info', items: ['brand', 'model', 'variant', 'production_location', 'cell_technology'] },
    { category: 'Capacity & Modules', items: ['module_capacity_kwh', 'min_modules', 'max_modules', 'total_capacity_min_kwh', 'total_capacity_max_kwh'] },
    { category: 'Performance', items: ['efficiency_pct', 'charge_power_kw', 'discharge_power_kw', 'continuous_power_kw', 'peak_power_kw'] },
    { category: 'Battery Technology', items: ['cycle_life', 'depth_of_discharge_pct'] },
    { category: 'Installation', items: ['mounting_type', 'weight_kg', 'ip_rating'] },
    { category: 'Inverter & Backup', items: ['inverter_type', 'backup_capable', 'compatible_inverters'] },
    { category: 'Warranty', items: ['warranty_years', 'warranty_cycles', 'warranty_capacity_retention_pct'] },
    { category: 'Smart Features', items: ['has_app', 'has_energy_management', 'supports_solar', 'supports_grid_services'] },
    { category: 'Economics', items: ['price_per_module_eur', 'price_per_kwh'] },
  ];

  const specLabels = {
    brand: 'Brand', model: 'Model', variant: 'Variant', production_location: 'Production', cell_technology: 'Cell Technology',
    module_capacity_kwh: 'Module Capacity (kWh)', min_modules: 'Min Modules', max_modules: 'Max Modules',
    total_capacity_min_kwh: 'Min System Capacity (kWh)', total_capacity_max_kwh: 'Max System Capacity (kWh)',
    efficiency_pct: 'Efficiency (%)', charge_power_kw: 'Charge Power (kW)', discharge_power_kw: 'Discharge Power (kW)',
    continuous_power_kw: 'Continuous Power (kW)', peak_power_kw: 'Peak Power (kW)',
    cycle_life: 'Cycle Life', depth_of_discharge_pct: 'Depth of Discharge (%)',
    mounting_type: 'Mounting Type', weight_kg: 'Weight (kg)', ip_rating: 'IP Rating',
    inverter_type: 'Inverter Type', backup_capable: 'Backup Capable', compatible_inverters: 'Compatible Inverters',
    warranty_years: 'Warranty (years)', warranty_cycles: 'Warranty (cycles)', warranty_capacity_retention_pct: 'Capacity Retention (%)',
    has_app: 'Mobile App', has_energy_management: 'Energy Management', supports_solar: 'Solar Compatible', supports_grid_services: 'Grid Services',
    price_per_module_eur: 'Price per Module (EUR)', price_per_kwh: 'Price per kWh (EUR)',
  };

  const getValue = (storage, spec) => {
    // Computed field
    if (spec === 'price_per_kwh') {
      if (storage.price_per_module_eur && storage.module_capacity_kwh) {
        return `€${Math.round(storage.price_per_module_eur / storage.module_capacity_kwh).toLocaleString()}`;
      }
      return '—';
    }

    const value = storage[spec];
    if (value === null || value === undefined) return '—';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (Array.isArray(value)) return value.join(', ') || '—';
    if (spec === 'price_per_module_eur' && typeof value === 'number') return `€${value.toLocaleString()}`;
    if (typeof value === 'number' && spec.includes('kwh')) return value.toFixed(1);
    if (typeof value === 'number') return value.toLocaleString();
    return value;
  };

  const findBestValue = (spec) => {
    let bestId = null;
    let bestValue = -Infinity;
    const maximize = ['module_capacity_kwh', 'total_capacity_max_kwh', 'efficiency_pct', 'charge_power_kw', 'discharge_power_kw', 'continuous_power_kw', 'peak_power_kw', 'cycle_life', 'depth_of_discharge_pct', 'max_modules', 'warranty_years', 'warranty_cycles', 'warranty_capacity_retention_pct'];
    const minimize = ['price_per_module_eur', 'weight_kg'];

    selectedStorage.forEach((s) => {
      let value;
      if (spec === 'price_per_kwh') {
        value = s.price_per_module_eur && s.module_capacity_kwh
          ? s.price_per_module_eur / s.module_capacity_kwh
          : null;
      } else {
        value = s[spec];
      }

      if (value === null || value === undefined || typeof value !== 'number') return;

      if (maximize.includes(spec)) {
        if (value > bestValue) { bestValue = value; bestId = s.id; }
      } else if (minimize.includes(spec) || spec === 'price_per_kwh') {
        if (bestValue === -Infinity || value < bestValue) { bestValue = value; bestId = s.id; }
      }
    });
    return bestId;
  };

  return (
    <>
      <Helmet>
        <title>Compare Battery Storage — Enerlytics</title>
        <meta name="description" content="Compare up to 4 home battery storage systems side-by-side with detailed specifications." />
      </Helmet>
      <Nav />
      <div className="compare-page">
        <div className="compare-container">
          <div className="compare-header">
            <h1>Compare Storage</h1>
            <div className="compare-actions">
              <button className="add-more-btn" onClick={() => navigate('/storage')}>
                <Plus size={16} /> Add More
              </button>
              {selectedStorage.length > 1 && (
                <button className="clear-btn" onClick={clearAll}>
                  Clear All
                </button>
              )}
            </div>
          </div>

          <div className="compare-table-wrapper">
            <table className="compare-table">
              <tbody>
                <tr className="header-row">
                  <td className="spec-col"></td>
                  {selectedStorage.map((s) => (
                    <td key={s.id} className="car-col">
                      <div className="car-header">
                        <div className="car-header-text">
                          <div className="car-brand">{s.brand}</div>
                          <div className="car-name">{s.model}</div>
                          <div className="car-variant">{s.variant || ''}</div>
                        </div>
                        <button className="remove-btn" onClick={() => removeStorage(s.id)} title="Remove from comparison">
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
              <tbody>
                {specs.flatMap((section) =>
                  [
                    <tr key={`cat-${section.category}`} className="category-row">
                      <td colSpan={selectedStorage.length + 1} className="category-header">
                        {section.category}
                      </td>
                    </tr>,
                    ...section.items.map((spec) => {
                      const bestId = findBestValue(spec);
                      return (
                        <tr key={spec} className="spec-row">
                          <td className="spec-col">{specLabels[spec]}</td>
                          {selectedStorage.map((s) => (
                            <td key={s.id} className={`value-col ${bestId === s.id ? 'best' : ''}`}>
                              {getValue(s, spec)}
                            </td>
                          ))}
                        </tr>
                      );
                    }),
                  ]
                )}
              </tbody>
            </table>
          </div>

          <div className="compare-footer">
            <button className="secondary-btn" onClick={() => navigate('/storage')}>
              Back to Storage Database
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
