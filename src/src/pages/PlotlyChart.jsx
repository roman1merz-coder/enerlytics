import { useState, useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';

export default function PlotlyChart({ cars, onSelectCar }) {
  const [activeTab, setActiveTab] = useState('price-range');
  const chartRef = useRef(null);

  const segmentColors = {
    'City Car': '#4f6ef7',
    Compact: '#818cf8',
    'Sedan/Hatchback': '#a5b4fc',
    'SUV/Crossover': '#10b981',
    'Premium/Luxury': '#7c3aed',
    Estate: '#06b6d4',
    Other: '#94a3b8',
  };

  const getColor = (segment) => segmentColors[segment] || '#94a3b8';

  const chartConfigs = {
    'price-range': {
      xAxis: { data: cars, key: 'price_eur', label: 'Price (EUR)' },
      yAxis: { data: cars, key: 'real_range_km', label: 'Real Range (km)' },
      title: 'Price vs Range',
    },
    'co2-range': {
      xAxis: { data: cars, key: 'co2_lifetime_t', label: 'Lifetime CO2 (tonnes)' },
      yAxis: { data: cars, key: 'real_range_km', label: 'Real Range (km)' },
      title: 'CO2 Impact vs Range',
    },
    'cargo-range': {
      xAxis: { data: cars, key: 'total_cargo_l', label: 'Total Cargo (L)' },
      yAxis: { data: cars, key: 'real_range_km', label: 'Real Range (km)' },
      title: 'Cargo vs Range',
    },
    'power-range': {
      xAxis: { data: cars, key: 'power_kw', label: 'Power (kW)' },
      yAxis: { data: cars, key: 'real_range_km', label: 'Real Range (km)' },
      title: 'Power vs Range',
    },
  };

  useEffect(() => {
    const config = chartConfigs[activeTab];
    if (!config || !chartRef.current) return;

    const traces = [];
    const uniqueSegments = [...new Set(cars.map((c) => c.segment))];

    uniqueSegments.forEach((segment) => {
      const segmentCars = cars.filter((c) => c.segment === segment);
      const xData = segmentCars.map((c) => c[config.xAxis.key]).filter((v) => v);
      const yData = segmentCars.map((c) => c[config.yAxis.key]).filter((v) => v);
      const text = segmentCars.map((c) => `${c.brand} ${c.model} ${c.variant_trim}`);

      traces.push({
        x: xData,
        y: yData,
        mode: 'markers',
        type: 'scatter',
        name: segment,
        marker: {
          size: 10,
          color: getColor(segment),
          opacity: 0.7,
          line: { width: 1, color: '#fff' },
        },
        text: text,
        hovertemplate: '<b>%{text}</b><br>' + config.xAxis.label + ': %{x:.0f}<br>' + config.yAxis.label + ': %{y:.0f}<extra></extra>',
        customdata: segmentCars,
      });
    });

    const layout = {
      title: config.title,
      xaxis: { title: config.xAxis.label, gridcolor: '#e2e8f0' },
      yaxis: { title: config.yAxis.label, gridcolor: '#e2e8f0' },
      plot_bgcolor: '#fff',
      paper_bgcolor: '#fff',
      font: { family: 'Inter, sans-serif', color: '#0f172a' },
      hovermode: 'closest',
      margin: { l: 50, r: 20, t: 40, b: 50 },
      showlegend: true,
      legend: { x: 0.01, y: 0.99 },
    };

    Plotly.newPlot(chartRef.current, traces, layout, { responsive: true });

    chartRef.current.on('plotly_click', (data) => {
      const point = data.points[0];
      if (point.customdata && point.customdata.slug) {
        onSelectCar(point.customdata);
      }
    });

    return () => {
      if (chartRef.current) {
        Plotly.purge(chartRef.current);
      }
    };
  }, [activeTab, cars, onSelectCar]);

  return (
    <div className="chart-container">
      <div className="chart-tabs">
        {Object.keys(chartConfigs).map((tab) => (
          <button key={tab} className={`chart-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {chartConfigs[tab].title}
          </button>
        ))}
      </div>
      <div className="chart-wrapper">
        <div ref={chartRef} style={{ width: '100%', height: '500px' }}></div>
      </div>
    </div>
  );
}
