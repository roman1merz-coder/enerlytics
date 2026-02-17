export default function ChargeCurve({ car }) {
  if (!car.dc_fast_charge_kw) return null;

  const peak = car.dc_fast_charge_kw;
  const is800v = car.platform_voltage === 800;

  // Simulated charge curve points: [soc%, power_kw]
  // 800V cars maintain peak longer
  const curve = is800v ? [
    [0, peak * 0.6], [5, peak * 0.85], [10, peak * 0.95], [20, peak],
    [30, peak], [40, peak * 0.98], [50, peak * 0.92], [60, peak * 0.82],
    [70, peak * 0.65], [80, peak * 0.45], [90, peak * 0.25], [100, peak * 0.08]
  ] : [
    [0, peak * 0.5], [5, peak * 0.75], [10, peak * 0.9], [20, peak],
    [30, peak * 0.95], [40, peak * 0.85], [50, peak * 0.7], [60, peak * 0.55],
    [70, peak * 0.4], [80, peak * 0.3], [90, peak * 0.18], [100, peak * 0.06]
  ];

  const w = 500, h = 220, pad = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  const toX = (soc) => pad.left + (soc / 100) * chartW;
  const toY = (kw) => pad.top + chartH - (kw / (peak * 1.1)) * chartH;

  const pathD = curve.map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(p[0]).toFixed(1)},${toY(p[1]).toFixed(1)}`).join(' ');
  const areaD = pathD + ` L${toX(100).toFixed(1)},${toY(0).toFixed(1)} L${toX(0).toFixed(1)},${toY(0).toFixed(1)} Z`;

  return (
    <div className="charge-curve-card">
      <h2 className="spec-section-title">DC Charging Curve (Simulated)</h2>
      <svg viewBox={`0 0 ${w} ${h}`} className="charge-curve-svg">
        <defs>
          <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--blue)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--blue)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(soc => (
          <line key={`g${soc}`} x1={toX(soc)} y1={pad.top} x2={toX(soc)} y2={pad.top + chartH} stroke="var(--card-border)" strokeWidth="0.5" />
        ))}
        {[0, peak * 0.25, peak * 0.5, peak * 0.75, peak].map((kw, i) => (
          <line key={`h${i}`} x1={pad.left} y1={toY(kw)} x2={pad.left + chartW} y2={toY(kw)} stroke="var(--card-border)" strokeWidth="0.5" />
        ))}
        {/* Area fill */}
        <path d={areaD} fill="url(#curveGrad)" />
        {/* Curve line */}
        <path d={pathD} fill="none" stroke="var(--blue)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* 10-80% highlight zone */}
        <rect x={toX(10)} y={pad.top} width={toX(80) - toX(10)} height={chartH} fill="var(--teal)" opacity="0.06" rx="2" />
        <text x={(toX(10) + toX(80)) / 2} y={pad.top + 14} textAnchor="middle" fill="var(--teal2)" fontSize="9" fontWeight="600" fontFamily="var(--mono)">10-80%{car.charge_time_10_80_min ? ` ≈ ${car.charge_time_10_80_min} min` : ''}</text>
        {/* X axis labels */}
        {[0, 25, 50, 75, 100].map(soc => (
          <text key={`x${soc}`} x={toX(soc)} y={h - 8} textAnchor="middle" fill="var(--text3)" fontSize="10" fontFamily="var(--mono)">{soc}%</text>
        ))}
        <text x={pad.left + chartW / 2} y={h} textAnchor="middle" fill="var(--text2)" fontSize="10" fontWeight="600">State of Charge</text>
        {/* Y axis labels */}
        {[0, peak * 0.5, peak].map((kw, i) => (
          <text key={`y${i}`} x={pad.left - 6} y={toY(kw) + 3} textAnchor="end" fill="var(--text3)" fontSize="10" fontFamily="var(--mono)">{Math.round(kw)}</text>
        ))}
        <text x={12} y={pad.top + chartH / 2} textAnchor="middle" fill="var(--text2)" fontSize="10" fontWeight="600" transform={`rotate(-90, 12, ${pad.top + chartH / 2})`}>kW</text>
        {/* Peak dot */}
        <circle cx={toX(curve.find(p => p[1] === peak)?.[0] || 20)} cy={toY(peak)} r="4" fill="var(--blue)" />
        <text x={toX(curve.find(p => p[1] === peak)?.[0] || 20) + 8} y={toY(peak) + 3} fill="var(--blue)" fontSize="10" fontWeight="700" fontFamily="var(--mono)">{peak} kW</text>
      </svg>
    </div>
  );
}
