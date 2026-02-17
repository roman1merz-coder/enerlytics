import { useNavigate } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { Plus, X } from 'lucide-react';
import './Compare.css';

export default function Compare() {
  const navigate = useNavigate();
  const { selectedCars, removeCar, clearAll } = useCompare();

  if (selectedCars.length === 0) {
    return (
      <>
        <Nav />
        <div className="compare-page">
          <div className="compare-container">
            <div className="empty-state">
              <h2>No vehicles selected</h2>
              <p>Select up to 4 vehicles to compare side-by-side.</p>
              <button className="cta-btn" onClick={() => navigate('/evs')}>
                Go to EV Database
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const specs = [
    { category: 'Basic Info', items: ['brand', 'model', 'variant_trim', 'segment', 'status'] },
    { category: 'Performance', items: ['power_kw', 'power_hp', 'motor_config'] },
    { category: 'Battery & Range', items: ['battery_kwh', 'wltp_range_km', 'real_range_km', 'consumption_wh_km'] },
    { category: 'Charging', items: ['dc_fast_charge_kw', 'ac_charge_kw'] },
    { category: 'Dimensions', items: ['length_mm', 'width_mm', 'height_mm'] },
    { category: 'Cargo', items: ['trunk_l', 'frunk_l', 'total_cargo_l'] },
    { category: 'Environmental', items: ['co2_production_t', 'co2_lifetime_t'] },
    { category: 'Economics', items: ['price_eur', 'km_per_eur'] },
  ];

  const specLabels = {
    brand: 'Brand', model: 'Model', variant_trim: 'Variant', segment: 'Segment', status: 'Status',
    power_kw: 'Power (kW)', power_hp: 'Power (HP)', motor_config: 'Motor Config',
    battery_kwh: 'Battery (kWh)', wltp_range_km: 'WLTP Range (km)', real_range_km: 'Real Range (km)', consumption_wh_km: 'Consumption (Wh/km)',
    dc_fast_charge_kw: 'DC Fast Charge (kW)', ac_charge_kw: 'AC Charge (kW)',
    length_mm: 'Length (mm)', width_mm: 'Width (mm)', height_mm: 'Height (mm)',
    trunk_l: 'Trunk (L)', frunk_l: 'Frunk (L)', total_cargo_l: 'Total Cargo (L)',
    co2_production_t: 'CO2 Production (t)', co2_lifetime_t: 'Lifetime CO2 (t)',
    price_eur: 'Price (EUR)', km_per_eur: 'km per EUR',
  };

  const getValue = (car, spec) => {
    const value = car[spec];
    if (value === null || value === undefined) return '—';
    if (spec === 'price_eur' && typeof value === 'number') return `€${value.toLocaleString()}`;
    if (spec === 'km_per_eur' && typeof value === 'number') return value.toFixed(2);
    return value;
  };

  const findBestValue = (spec) => {
    let bestCar = null;
    let bestValue = -Infinity;
    const maximize = ['power_kw', 'power_hp', 'wltp_range_km', 'real_range_km', 'battery_kwh', 'dc_fast_charge_kw', 'ac_charge_kw', 'total_cargo_l', 'km_per_eur'];
    const minimize = ['consumption_wh_km', 'price_eur', 'co2_production_t', 'co2_lifetime_t'];

    selectedCars.forEach((car) => {
      const value = car[spec];
      if (value === null || value === undefined) return;
      const numValue = typeof value === 'number' ? value : 0;
      if (maximize.includes(spec)) {
        if (numValue > bestValue) {
          bestValue = numValue;
          bestCar = car;
        }
      } else if (minimize.includes(spec)) {
        if (bestValue === -Infinity || numValue < bestValue) {
          bestValue = numValue;
          bestCar = car;
        }
      }
    });
    return bestCar?.id;
  };

  return (
    <>
      <Nav />
      <div className="compare-page">
        <div className="compare-container">
          <div className="compare-header">
            <h1>Compare EVs</h1>
            <div className="compare-actions">
              <button className="add-more-btn" onClick={() => navigate('/evs')}>
                <Plus size={16} /> Add More
              </button>
              {selectedCars.length > 1 && (
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
                  {selectedCars.map((car) => (
                    <td key={car.id} className="car-col">
                      <div className="car-header">
                        <div className="car-header-text">
                          <div className="car-brand">{car.brand}</div>
                          <div className="car-name">{car.model}</div>
                          <div className="car-variant">{car.variant_trim}</div>
                        </div>
                        <button className="remove-btn" onClick={() => removeCar(car.id)} title="Remove from comparison">
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
                      <td colSpan={selectedCars.length + 1} className="category-header">
                        {section.category}
                      </td>
                    </tr>,
                    ...section.items.map((spec) => {
                      const bestCarId = findBestValue(spec);
                      return (
                        <tr key={spec} className="spec-row">
                          <td className="spec-col">{specLabels[spec]}</td>
                          {selectedCars.map((car) => (
                            <td key={car.id} className={`value-col ${bestCarId === car.id ? 'best' : ''}`}>
                              {getValue(car, spec)}
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
            <button className="secondary-btn" onClick={() => navigate('/evs')}>
              Back to Database
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
