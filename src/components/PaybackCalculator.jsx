import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Zap, Home } from 'lucide-react';
import { calculatePayback, generateSavingsChartData, DEFAULT_PARAMS } from '../lib/paybackAlgorithm';
import './PaybackCalculator.css';

export default function PaybackCalculator({ storage }) {
  // Input states with sensible defaults
  const [monthlyConsumption, setMonthlyConsumption] = useState(350); // kWh
  const [electricityPrice, setElectricityPrice] = useState(DEFAULT_PARAMS.electricityPriceEur);
  const [solarSystemSize, setSolarSystemSize] = useState(0); // kWp (0 = no solar)
  const [feedInTariff, setFeedInTariff] = useState(DEFAULT_PARAMS.feedInTariffEur);
  const [moduleCount, setModuleCount] = useState(storage.min_modules || 1);

  // Calculated results
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Calculate total system cost based on module count
  const systemCost = (storage.price_per_module_eur || 0) * moduleCount;
  const installationCost = storage.installation_cost_eur || 1500; // Default installation cost
  const totalStorageSize = (storage.module_capacity_kwh || 0) * moduleCount;

  // Recalculate on input change
  useEffect(() => {
    try {
      const paybackResults = calculatePayback({
        monthlyConsumptionKwh: monthlyConsumption,
        solarSystemKwp: solarSystemSize,
        storageSizeKwh: totalStorageSize,
        systemCostEur: systemCost,
        installationCostEur: installationCost,
        electricityPriceEur: electricityPrice,
        feedInTariffEur: feedInTariff,
      });

      setResults(paybackResults);
      setError(null);
    } catch (err) {
      setError(err.message);
      setResults(null);
    }
  }, [
    monthlyConsumption,
    solarSystemSize,
    totalStorageSize,
    systemCost,
    installationCost,
    electricityPrice,
    feedInTariff,
  ]);

  // Generate simple SVG chart
  const renderSavingsChart = () => {
    if (!results) return null;

    const chartData = generateSavingsChartData(results);
    const { years, cumulativeSavings } = chartData;

    const width = 600;
    const height = 300;
    const padding = 40;

    const maxYear = Math.max(...years);
    const maxSavings = Math.max(...cumulativeSavings);
    const minSavings = Math.min(...cumulativeSavings);

    const xScale = (year) => padding + (year / maxYear) * (width - 2 * padding);
    const yScale = (savings) => {
      const range = maxSavings - minSavings;
      return height - padding - ((savings - minSavings) / range) * (height - 2 * padding);
    };

    // Generate path
    const pathData = years
      .map((year, i) => {
        const x = xScale(year);
        const y = yScale(cumulativeSavings[i]);
        return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
      })
      .join(' ');

    // Find break-even point for marker
    const breakEvenIndex = cumulativeSavings.findIndex((s) => s >= 0);
    const breakEvenX = breakEvenIndex >= 0 ? xScale(years[breakEvenIndex]) : null;
    const breakEvenY = breakEvenIndex >= 0 ? yScale(0) : null;

    return (
      <svg className="savings-chart" viewBox={`0 0 ${width} ${height}`}>
        {/* Grid lines */}
        <line x1={padding} y1={yScale(0)} x2={width - padding} y2={yScale(0)} stroke="#94a3b8" strokeWidth="2" />
        {[5, 10, 15, 20, 25].map((year) => (
          <line
            key={year}
            x1={xScale(year)}
            y1={padding}
            x2={xScale(year)}
            y2={height - padding}
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        ))}

        {/* Gradient fill */}
        <defs>
          <linearGradient id="savingsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Area under curve */}
        <path
          d={`${pathData} L ${xScale(maxYear)} ${height - padding} L ${padding} ${height - padding} Z`}
          fill="url(#savingsGradient)"
        />

        {/* Line */}
        <path d={pathData} fill="none" stroke="#10b981" strokeWidth="3" />

        {/* Break-even marker */}
        {breakEvenX && breakEvenY && (
          <>
            <circle cx={breakEvenX} cy={breakEvenY} r="6" fill="#f97316" />
            <text x={breakEvenX} y={breakEvenY - 15} fontSize="12" fill="#f97316" textAnchor="middle" fontWeight="600">
              Break-even: Year {results.breakEvenYear}
            </text>
          </>
        )}

        {/* Axes labels */}
        <text x={width / 2} y={height - 5} fontSize="14" fill="#64748b" textAnchor="middle">
          Years
        </text>
        <text x={10} y={height / 2} fontSize="14" fill="#64748b" textAnchor="middle" transform={`rotate(-90 10 ${height / 2})`}>
          Cumulative Savings (€)
        </text>

        {/* Year labels */}
        {[0, 5, 10, 15, 20, 25].map((year) => (
          <text key={year} x={xScale(year)} y={height - padding + 20} fontSize="12" fill="#64748b" textAnchor="middle">
            {year}
          </text>
        ))}
      </svg>
    );
  };

  return (
    <div className="payback-calculator">
      <h2>
        <TrendingUp /> Payback & Savings Calculator
      </h2>
      <p className="calc-intro">
        Calculate how long it takes for this battery storage system to pay for itself based on your energy usage.
      </p>

      <div className="calc-grid">
        {/* Inputs Section */}
        <div className="calc-inputs">
          <h3>Your Energy Profile</h3>

          <div className="input-group">
            <label>
              <Home /> Monthly Electricity Consumption
            </label>
            <div className="slider-with-value">
              <input
                type="range"
                min="100"
                max="1500"
                step="50"
                value={monthlyConsumption}
                onChange={(e) => setMonthlyConsumption(Number(e.target.value))}
              />
              <span className="value">{monthlyConsumption} kWh/month</span>
            </div>
          </div>

          <div className="input-group">
            <label>
              <Zap /> Solar PV System Size
            </label>
            <div className="slider-with-value">
              <input
                type="range"
                min="0"
                max="20"
                step="0.5"
                value={solarSystemSize}
                onChange={(e) => setSolarSystemSize(Number(e.target.value))}
              />
              <span className="value">{solarSystemSize === 0 ? 'No solar' : `${solarSystemSize} kWp`}</span>
            </div>
            {solarSystemSize === 0 && (
              <p className="input-hint">⚠️ Battery storage requires solar panels to be economical</p>
            )}
          </div>

          <div className="input-group">
            <label>Number of Battery Modules</label>
            <div className="slider-with-value">
              <input
                type="range"
                min={storage.min_modules || 1}
                max={storage.max_modules || 6}
                step="1"
                value={moduleCount}
                onChange={(e) => setModuleCount(Number(e.target.value))}
              />
              <span className="value">
                {moduleCount} × {storage.module_capacity_kwh} kWh = {totalStorageSize.toFixed(1)} kWh total
              </span>
            </div>
          </div>

          <div className="input-group">
            <label>
              <DollarSign /> Electricity Price
            </label>
            <div className="slider-with-value">
              <input
                type="range"
                min="0.20"
                max="0.60"
                step="0.01"
                value={electricityPrice}
                onChange={(e) => setElectricityPrice(Number(e.target.value))}
              />
              <span className="value">€{electricityPrice.toFixed(2)}/kWh</span>
            </div>
          </div>

          <div className="input-group">
            <label>Feed-in Tariff (what grid pays you)</label>
            <div className="slider-with-value">
              <input
                type="range"
                min="0.05"
                max="0.15"
                step="0.01"
                value={feedInTariff}
                onChange={(e) => setFeedInTariff(Number(e.target.value))}
              />
              <span className="value">€{feedInTariff.toFixed(2)}/kWh</span>
            </div>
          </div>

          <div className="cost-summary">
            <div className="cost-row">
              <span>System Cost:</span>
              <span className="cost-value">€{systemCost.toLocaleString()}</span>
            </div>
            <div className="cost-row">
              <span>Installation:</span>
              <span className="cost-value">€{installationCost.toLocaleString()}</span>
            </div>
            <div className="cost-row total">
              <span>Total Investment:</span>
              <span className="cost-value">€{(systemCost + installationCost).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="calc-results">
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          {results && solarSystemSize > 0 && (
            <>
              <div className="results-summary">
                <div className={`result-card ${results.isProfitable ? 'profitable' : 'not-profitable'}`}>
                  <div className="result-label">Payback Period</div>
                  <div className="result-value">
                    {results.simplePaybackYears < 30
                      ? `${results.simplePaybackYears} years`
                      : '30+ years'}
                  </div>
                  <div className="result-rating">{results.profitabilityRating}</div>
                </div>

                <div className="result-card">
                  <div className="result-label">Annual Savings</div>
                  <div className="result-value">€{results.annualSavingsEur.toLocaleString()}</div>
                  <div className="result-detail">
                    €{results.gridSavingsEur.toLocaleString()} saved - €{results.feedInLossEur.toLocaleString()} lost
                  </div>
                </div>

                <div className="result-card">
                  <div className="result-label">25-Year Savings</div>
                  <div className="result-value">€{results.lifetimeSavingsEur.toLocaleString()}</div>
                  <div className="result-detail">After paying off investment</div>
                </div>

                <div className="result-card">
                  <div className="result-label">Self-Consumption</div>
                  <div className="result-value">{results.selfConsumptionRateAfter}%</div>
                  <div className="result-detail">
                    ↑ {results.selfConsumptionImprovement}% from {results.selfConsumptionRateBefore}%
                  </div>
                </div>
              </div>

              <div className="chart-container">
                <h4>Cumulative Savings Over 25 Years</h4>
                {renderSavingsChart()}
                <p className="chart-note">
                  Accounts for 0.5% annual battery degradation and 3% annual electricity price increase.
                </p>
              </div>
            </>
          )}

          {solarSystemSize === 0 && (
            <div className="no-solar-message">
              <Zap size={48} />
              <h3>Solar Panels Required</h3>
              <p>
                Battery storage systems are designed to store excess solar energy for use during evening hours.
                Without solar panels, there's no excess energy to store, making the investment uneconomical.
              </p>
              <p>
                <strong>Consider installing solar panels first, then adding battery storage.</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
