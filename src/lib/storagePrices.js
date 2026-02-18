/**
 * Storage system pricing data from German retailers
 * All prices verified February 2026
 * Prices in EUR, includes 0% MwSt where applicable (§12 Abs. 3 UStG)
 */

const storagePrices = {
  'byd-battery-box-premium-hvs': {
    msrp_eur: 4159,
    ref_capacity_kwh: 10.24,
    offers: [
      { shop: 'mg-solar-shop', price: 3048, url: 'https://www.mg-solar-shop.de/BYD-B-Box-Premium-HVS-10.2-Batteriespeicher-10-24-kWh', note: '10.24 kWh, -27%' },
    ],
  },
  'sonnen-batterie-10': {
    msrp_eur: 9500,
    ref_capacity_kwh: 11,
    offers: [
      { shop: 'sonnen.de', price: 9500, url: 'https://www.sonnen.de/stromspeicher/sonnenbatterie-10', note: 'Angebot via Fachpartner' },
    ],
  },
  'e3dc-s10-e-pro': {
    msrp_eur: 19000,
    ref_capacity_kwh: 10,
    offers: [
      { shop: 'energiespeicher-online', price: 10520, url: 'https://www.energiespeicher-online.shop/Energiespeicher/Speicher-Typ/3-phasig/e3-dc-s10-se-10', note: 'S10 SE Variante' },
    ],
  },
  'tesla-powerwall-2': {
    msrp_eur: 9600,
    ref_capacity_kwh: 13.5,
    offers: [
      { shop: 'Tesla.com', price: 9600, url: 'https://www.tesla.com/de_DE/powerwall', note: 'Offiziell + Gateway' },
    ],
  },
  'lg-resu-10h': {
    msrp_eur: 6800,
    ref_capacity_kwh: 9.6,
    offers: [
      { shop: 'Alma Solarshop', price: 4200, url: 'https://www.alma-solarshop.de/solarbatterien/1383-lg-chem-akku-resu-10h-prime-hochspannung.html', note: 'RESU 10H Prime' },
    ],
  },
  'senec-home-v3-hybrid': {
    msrp_eur: 10000,
    ref_capacity_kwh: 10,
    offers: [
      { shop: 'SENEC.com', price: 10000, url: 'https://senec.com/de/produkte/senec-home/v3', note: 'Über Fachpartner' },
    ],
  },
  'fenecon-home': {
    msrp_eur: 10520,
    ref_capacity_kwh: 19.6,
    offers: [
      { shop: 'energiespeicher-online', price: 9849, url: 'https://www.energiespeicher-online.shop/Energiespeicher/Speicher-Typ/3-phasig/fenecon-home-20-19.6', note: 'Home 20, 19.6 kWh, -6%' },
    ],
  },
  'huawei-luna2000': {
    msrp_eur: 4500,
    ref_capacity_kwh: 10,
    offers: [
      { shop: 'billiger.de', price: 3390, url: 'https://www.billiger.de/products/4184920736-huawei-luna2000-10-s0', note: '26 Angebote, ab' },
    ],
  },
  'solarwatt-battery-flex-ac': {
    msrp_eur: 9642,
    ref_capacity_kwh: 9.6,
    offers: [
      { shop: 'PV Solartechnik', price: 6887, url: 'https://www.pv-solartechnik.de/shop/photovoltaik/batteriespeicher-und-batteriemanager-z.b-nachruestung-bestehender-anlagen/846/solarwatt-battery-flex-ac-1-1.3-9-6-kwh-nutzbar', note: 'AC-1 1.3, 9.6 kWh, -29%' },
    ],
  },
  'pylontech-us5000': {
    msrp_eur: 950,
    ref_capacity_kwh: 4.8,
    offers: [
      { shop: 'Offgridtec', price: 725, url: 'https://www.offgridtec.com/pylontech-us5000-4-8kwh-lifepo4-batterie.html', note: '4.8 kWh, 0% MwSt' },
      { shop: 'greinSOLAR', price: 770, url: 'https://www.greinsolar.de/alle_anzeigen/energiespeicher/pylontech-us5000.aspx', note: 'Aktuell nicht verfügbar' },
    ],
  },
  'kostal-piko-iq-55': {
    msrp_eur: 1900,
    ref_capacity_kwh: null,
    offers: [],
  },
  'sma-sunny-boy-storage-5': {
    msrp_eur: 1849,
    ref_capacity_kwh: null,
    offers: [
      { shop: 'Photovoltaik4all', price: 1498, url: 'https://www.photovoltaik4all.de/speicherwechselrichter/sma-sunny-boy-storage-5-0', note: 'SBS5.0-10' },
      { shop: 'Solarfy', price: 1499, url: 'https://www.solarfy.de/SMA-Sunny-Boy-Storage-50', note: 'SBS5.0-10, statt 1.849 EUR' },
      { shop: 'Sonnenshop', price: 1799, url: 'https://www.sonnenshop.de/wechselrichter/sma-sunny-boy-storage-5.0', note: 'Batteriewechselrichter' },
    ],
  },
  'fronius-solar-battery': {
    msrp_eur: 8700,
    ref_capacity_kwh: 6.0,
    offers: [
      { shop: 'Europe Solar Store', price: 5598, url: 'https://www.europe-solarstore.com/fronius-solar-battery-6-0.html', note: '6.0 kWh, nicht verfügbar' },
      { shop: 'Sonnenshop', price: 6455, url: 'https://www.sonnenshop.de/speichersysteme/fronius/fronius-battery-6,0-kwh', note: '6.0 kWh, nicht verfügbar' },
    ],
  },
  'goodwe-lynx-home-f': {
    msrp_eur: 3500,
    ref_capacity_kwh: null,
    offers: [
      { shop: 'Selfio', price: 399, url: 'https://www.selfio.de/produkte/goodwe-power-control-unit-lynx-home-f-plus-plus-pcu-und-base', note: 'PCU + Base Steuereinheit' },
      { shop: 'Soltech Shop', price: 667, url: 'https://soltechshop.de/de_DE/p/GoodWe-Lynx-Home-F-Plus-PCU-mit-einer-Basis-Steuermodul/1727', note: 'Plus+ PCU Steuermodul' },
    ],
  },
  'varta-pulse-neo': {
    msrp_eur: 4300,
    ref_capacity_kwh: 6.5,
    offers: [
      { shop: 'billiger.de', price: 3299, url: 'https://www.billiger.de/products/4459586597-varta-pulse-neo-6-batteriespeicher-6-5-kwh', note: '9 Angebote, ab' },
    ],
  },
  'rct-power-storage-dc': {
    msrp_eur: 6200,
    ref_capacity_kwh: 11.5,
    offers: [
      { shop: 'dp-solar-shop', price: 4008, url: 'https://www.dp-solar-shop.de/RCT-Power-Storage-DC-100-mit-Battery-115-Set', note: 'Battery 11.5 Set' },
      { shop: 'dp-solar-shop', price: 5592, url: 'https://www.dp-solar-shop.de/RCT-Power-Storage-DC-100-mit-Battery-96-Set', note: 'DC 10.0 + Battery 9.6' },
    ],
  },
  'solaredge-energy-bank': {
    msrp_eur: 7200,
    ref_capacity_kwh: 10,
    offers: [
      { shop: 'Europe Solar Store', price: 6800, url: 'https://www.europe-solarstore.com/solaredge-energy-bank-10kwh-battery.html', note: '10 kWh' },
    ],
  },
  'alphaess-smile-g3': {
    msrp_eur: 6652,
    ref_capacity_kwh: 10.95,
    offers: [
      { shop: 'energiespeicher-online', price: 4371, url: 'https://www.energiespeicher-online.shop/Energiespeicher/Speicher-Typ/3-phasig/set-alphaess-smile-g3-t10-10-95-kwh-speicher', note: 'G3-T10 Set 10.95 kWh, -34%' },
    ],
  },
  'sonnen-eco-9': {
    msrp_eur: 8500,
    ref_capacity_kwh: 10,
    offers: [
      { shop: 'sonnen.de', price: 8500, url: 'https://www.sonnen.de/stromspeicher/sonnenbatterie-10', note: 'Über Fachpartner' },
    ],
  },
  'viessmann-vitocharge-vx3': {
    msrp_eur: 5200,
    ref_capacity_kwh: 4.6,
    offers: [
      { shop: 'badexo.de', price: 3004, url: 'https://www.badexo.de/heizung/stromspeichersysteme/vitocharge-vx3', note: 'Typ 4.6A0' },
      { shop: 'badexo.de', price: 3621, url: 'https://www.badexo.de/heizung/stromspeichersysteme/vitocharge-vx3', note: 'Typ 6.0A0' },
      { shop: 'badexo.de', price: 4713, url: 'https://www.badexo.de/heizung/stromspeichersysteme/vitocharge-vx3', note: 'Typ 4.6A5 (mit 5 kWh)' },
      { shop: 'badexo.de', price: 5187, url: 'https://www.badexo.de/heizung/stromspeichersysteme/vitocharge-vx3', note: 'Typ 6.0A5 (mit 5 kWh)' },
    ],
  },
  'sungrow-sbr128': {
    msrp_eur: 5000,
    ref_capacity_kwh: 12.8,
    offers: [
      { shop: 'Sonnenshop', price: 3900, url: 'https://www.sonnenshop.de/sungrow-sbr128-premium-batteriespeicher', note: 'SBR128 Premium, netto' },
      { shop: 'knauer24', price: 4014, url: 'https://knauer24.de/Sungrow-SBR128-128-kWh-4-x-320kWh-Batterie-V132', note: 'V13.2, 12.8 kWh' },
    ],
  },
  'enphase-iq-battery-5p': {
    msrp_eur: 3200,
    ref_capacity_kwh: 5,
    offers: [
      { shop: 'Alma Solarshop', price: 2799, url: 'https://www.alma-solarshop.de/enphase-batterien/3186-enphase-batterie-iq-5p-dreiphasig.html', note: '5 kWh, 0% MwSt' },
    ],
  },
  'varta-wall-15': {
    msrp_eur: 6949,
    ref_capacity_kwh: 15.4,
    offers: [],
  },
  'growatt-ark-hv': {
    msrp_eur: 2500,
    ref_capacity_kwh: 7.68,
    offers: [
      { shop: 'tepto.de', price: 1954, url: 'https://www.tepto.de/Growatt-ARK-HV-Speicherpaket-7-68-kWh-PV1186.7', note: '7.68 kWh Paket, 3 Module' },
    ],
  },
  'fox-ess-ecs2900': {
    msrp_eur: 3200,
    ref_capacity_kwh: 8.64,
    offers: [
      { shop: 'Selfio', price: 2179, url: 'https://www.selfio.de/produkte/fox-ess-batteriespeicher-ecs2900-h3-8-64-kwh', note: 'H3, 8.64 kWh' },
    ],
  },
  'qcells-qhome-core': {
    msrp_eur: 5500,
    ref_capacity_kwh: 6.84,
    offers: [
      { shop: 'Q CELLS Shop', price: 5500, url: 'https://shop.q-cells.com/qcells/de/EUR/c/Q.HOME%20CORE', note: 'Offizieller Shop' },
    ],
  },
  'dyness-tower-t10': {
    msrp_eur: 2800,
    ref_capacity_kwh: 10.66,
    offers: [
      { shop: 'mg-solar-shop', price: 1885, url: 'https://www.mg-solar-shop.de/Dyness-Tower-2.0-T10-Batteriespeicher-10-66-kWh', note: 'Tower 2.0, 10.66 kWh' },
      { shop: 'SolarScouts', price: 1977, url: 'https://solarscouts.de/Dyness-Tower-T10-1066-kWh-Battery-Storage-Your-Ideal-10-kWh-Photovoltaic-Storage-with-BDU-15G', note: '10.66 kWh' },
      { shop: 'Elektroland24', price: 1999, url: 'https://www.elektroland24.de/neue-energien/stromspeicher/dyness-tower-t10-version-1.5-solarspeicher-10kwh-kompatibel-mit-vielen-wechselrichter-herstellern.html', note: 'Version 1.5' },
      { shop: 'PlentiSolar', price: 2490, url: 'https://www.plentisolar.de/plenti-solar-dyness-tower-t10-10-6-kwh-batteriespeicher-288v-3-module-hochvolt/a-1051689', note: '288V 3 Module' },
    ],
  },
  'tesla-powerwall-3': {
    msrp_eur: 8950,
    ref_capacity_kwh: 13.5,
    offers: [
      { shop: 'Alma Solarshop', price: 6499, url: 'https://www.alma-solarshop.de/tesla-batterie/3390-tesla-batterie-powerwall-3.html', note: '13.5 kWh, nur NL-Lieferung' },
      { shop: 'Wallbox Discounter', price: 7450, url: 'https://www.wallboxdiscounter.com/de/tesla-powerwall-3-13-kwh-solarspeicher.html', note: '13.5 kWh, -17%' },
    ],
  },
  'pylontech-force-h2': {
    msrp_eur: 2500,
    ref_capacity_kwh: 3.55,
    offers: [
      { shop: 'Alma Solarshop', price: 659, url: 'https://www.alma-solarshop.de/pylontech-akku/1582-pylontech-force-h2-355kwh-batterie.html', note: '3.55 kWh Modul, Vorbestellung' },
    ],
  },
  'solax-triple-power-t58': {
    msrp_eur: 2200,
    ref_capacity_kwh: 23.0,
    offers: [
      { shop: 'Bau.Shop', price: 6889, url: 'https://bau.shop/Solax-Speicher-Triple-Power-Akku-T58-V2-230-kWh', note: '23.0 kWh (4 Module)' },
    ],
  },
};

/**
 * Get price data for a storage system by slug
 * @param {string} slug - Storage system slug
 * @returns {object|null} Price data with msrp and offers
 */
export function getStoragePrices(slug) {
  const data = storagePrices[slug];
  if (!data || !data.offers.length) return null;
  return data;
}

/**
 * Get the cheapest offer price for a storage system
 * @param {string} slug - Storage system slug
 * @returns {number|null} Cheapest price in EUR
 */
export function getCheapestPrice(slug) {
  const data = storagePrices[slug];
  if (!data || !data.offers.length) return null;
  return Math.min(...data.offers.map((o) => o.price));
}

/**
 * Get discount percentage vs MSRP
 * @param {string} slug - Storage system slug
 * @returns {number|null} Discount percentage (0-100)
 */
export function getDiscountPercent(slug) {
  const data = storagePrices[slug];
  if (!data || !data.msrp_eur || !data.offers.length) return null;
  const cheapest = Math.min(...data.offers.map((o) => o.price));
  const discount = Math.round(((data.msrp_eur - cheapest) / data.msrp_eur) * 100);
  return discount > 0 ? discount : null;
}

/**
 * Get number of available offers
 * @param {string} slug - Storage system slug
 * @returns {number} Number of offers
 */
export function getOfferCount(slug) {
  const data = storagePrices[slug];
  return data && data.offers.length ? data.offers.length : 0;
}

/**
 * Get best price per kWh for a storage system
 * Uses ref_capacity_kwh from the price data (the capacity the cheapest offer covers)
 * @param {string} slug - Storage system slug
 * @returns {number|null} Price per kWh in EUR, rounded to nearest integer
 */
export function getPricePerKwh(slug) {
  const data = storagePrices[slug];
  if (!data || !data.offers.length || !data.ref_capacity_kwh) return null;
  const cheapest = Math.min(...data.offers.map((o) => o.price));
  return Math.round(cheapest / data.ref_capacity_kwh);
}

export default storagePrices;