// Brand color palette for card headers
const BRAND_COLORS = {
  'Alfa Romeo': { bg: '#8B0000', text: '#fff' },
  'Alpine': { bg: '#0055A4', text: '#fff' },
  'Audi': { bg: '#000000', text: '#fff' },
  'BMW': { bg: '#0066B1', text: '#fff' },
  'BYD': { bg: '#C00000', text: '#fff' },
  'Bentley': { bg: '#333333', text: '#D4AF37' },
  'Citroën': { bg: '#AC1F24', text: '#fff' },
  'CUPRA': { bg: '#95623C', text: '#fff' },
  'DS': { bg: '#1A1A2E', text: '#D4AF37' },
  'Dacia': { bg: '#006341', text: '#fff' },
  'Ferrari': { bg: '#FF2800', text: '#fff' },
  'Fiat': { bg: '#B2001A', text: '#fff' },
  'Ford': { bg: '#003399', text: '#fff' },
  'Genesis': { bg: '#1B1B1B', text: '#D4AF37' },
  'Honda': { bg: '#CC0000', text: '#fff' },
  'Hyundai': { bg: '#002C5F', text: '#fff' },
  'Jaguar': { bg: '#1A1A2E', text: '#D4AF37' },
  'Jeep': { bg: '#004225', text: '#fff' },
  'Kia': { bg: '#05141F', text: '#fff' },
  'Lexus': { bg: '#1A1A2E', text: '#fff' },
  'Lucid': { bg: '#1A1A2E', text: '#B8860B' },
  'Maserati': { bg: '#0C2340', text: '#fff' },
  'Mazda': { bg: '#B5122F', text: '#fff' },
  'Mercedes-Benz': { bg: '#1A1A2E', text: '#C0C0C0' },
  'MG': { bg: '#C00000', text: '#fff' },
  'MINI': { bg: '#000000', text: '#fff' },
  'NIO': { bg: '#0066FF', text: '#fff' },
  'Nissan': { bg: '#C3002F', text: '#fff' },
  'Opel': { bg: '#FFD700', text: '#000' },
  'Peugeot': { bg: '#1B3C71', text: '#fff' },
  'Polestar': { bg: '#1A1A2E', text: '#D4AF37' },
  'Porsche': { bg: '#000000', text: '#fff' },
  'Renault': { bg: '#FFD700', text: '#000' },
  'Rivian': { bg: '#1B3C24', text: '#FFD700' },
  'Rolls-Royce': { bg: '#1A1A2E', text: '#D4AF37' },
  'SEAT': { bg: '#D90028', text: '#fff' },
  'Škoda': { bg: '#4BA82E', text: '#fff' },
  'smart': { bg: '#FF6600', text: '#fff' },
  'Stellantis': { bg: '#1A1A2E', text: '#fff' },
  'Subaru': { bg: '#013B82', text: '#fff' },
  'Tesla': { bg: '#171A20', text: '#E82127' },
  'Toyota': { bg: '#EB0A1E', text: '#fff' },
  'Volkswagen': { bg: '#001E50', text: '#fff' },
  'Volvo': { bg: '#003057', text: '#C0C0C0' },
  'XPeng': { bg: '#00B4D8', text: '#fff' },
};

// Segment icons (SVG path data for a simple representative icon)
const SEGMENT_ICONS = {
  'City Car': 'M8 18h1.5a1.5 1.5 0 003-0h9a1.5 1.5 0 003 0H26V14l-3-5H11l-3 5v4zm5-7h8l2 3H11l2-3z',
  'Compact': 'M6 18h2a2 2 0 004 0h8a2 2 0 004 0h2V13l-4-5H10l-4 5v5zm6-7h8l2.5 3.5H9.5L12 11z',
  'Sedan/Hatch': 'M5 18h2.5a2 2 0 004 0h9a2 2 0 004 0H27V13l-3-4h-5l-2-2H13l-2 2H8l-3 4v5zm7-7h8l3 4H9l3-4z',
  'Sedan/Estate': 'M5 18h2.5a2 2 0 004 0h9a2 2 0 004 0H27V13l-2-4H9l-4 4v5zm6-6h10l2 3H9l2-3z',
  'SUV/Crossover': 'M5 19h2.5a2 2 0 004 0h9a2 2 0 004 0H27V13l-2-4H9l-4 4v6zm4-7h14l2 3H7l2-3zM9 7h14v2H9z',
  'Large SUV': 'M4 19h2.5a2.5 2.5 0 005 0h9a2.5 2.5 0 005 0H28V12l-3-4H9l-5 4v7zm5-8h14l3 4H6l3-4zM9 6h14v2H9z',
  'Pickup': 'M4 19h2.5a2 2 0 004 0h5V13H4v6zm18-6v6h2.5a2 2 0 004 0H28V13h-6zm-8-4h12l2 4H14v-4zM5 13l3-4h6v4H5z',
  'Luxury': 'M4 18h2.5a2 2 0 004 0h11a2 2 0 004 0H28V12l-3-4H9l-5 4v6zm5-7h14l2.5 3.5H6.5L9 11z',
};

export function getBrandColors(brand) {
  return BRAND_COLORS[brand] || { bg: '#475569', text: '#fff' };
}

export function getBrandInitials(brand) {
  if (brand === 'Mercedes-Benz') return 'MB';
  if (brand === 'Rolls-Royce') return 'RR';
  if (brand === 'Alfa Romeo') return 'AR';
  const words = brand.split(/[\s-]+/);
  if (words.length === 1) return brand.substring(0, 2).toUpperCase();
  return words.map(w => w[0]).join('').toUpperCase().substring(0, 2);
}

export function getSegmentIcon(segment) {
  return SEGMENT_ICONS[segment] || SEGMENT_ICONS['Compact'];
}
