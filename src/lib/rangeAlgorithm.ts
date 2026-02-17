/**
 * Physics-Based EV Range Prediction Algorithm
 *
 * Longitudinal vehicle dynamics model with:
 * - Aerodynamic drag (Cd × A × v²)
 * - Rolling resistance (Crr × m × g)
 * - Stop-start kinetic energy cycles
 * - Thermal model (heat pump, chemistry-specific cold penalties)
 * - Calibrated against ev-database.org estimates (MAPE 6-10%)
 *
 * @author Enerlytics
 */

// ═══════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════
const RHO_AIR = 1.225;  // kg/m³ at 15°C, sea level
const G = 9.81;         // m/s²

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════
export interface VehicleParams {
  batteryNetKwh: number;
  curbWeightKg: number;
  cd: number;
  frontalAreaM2: number;
  crr: number;
  hasHeatPump: boolean;
  batteryChemistry: 'NMC' | 'LFP' | 'NCA' | 'LMFP' | string;
}

export interface ScenarioParams {
  speedKmh: number;
  auxPowerW: number;
  regenFactor: number;
  drivetrainEff: number;
  tempFactor: number;
  stopsPerKm: number;
}

export interface RangeResult {
  consumptionWhKm: number;
  rangeKm: number;
  rangeCalibratedKm: number;
}

export type ScenarioName =
  | 'wltp_combined'
  | 'real_combined_mild'
  | 'real_combined_cold'
  | 'city_mild'
  | 'city_cold'
  | 'highway_mild'
  | 'highway_cold'
  | 'autobahn_130'
  | 'autobahn_150';

// ═══════════════════════════════════════════════════════════
// SCENARIO DEFINITIONS
// ═══════════════════════════════════════════════════════════
export const SCENARIOS: Record<ScenarioName, ScenarioParams> = {
  wltp_combined: {
    speedKmh: 55,
    auxPowerW: 300,
    regenFactor: 0.25,
    drivetrainEff: 0.88,
    tempFactor: 1.0,
    stopsPerKm: 0.8,
  },
  real_combined_mild: {
    speedKmh: 55,
    auxPowerW: 400,
    regenFactor: 0.22,
    drivetrainEff: 0.86,
    tempFactor: 1.0,
    stopsPerKm: 1.0,
  },
  real_combined_cold: {
    speedKmh: 52,
    auxPowerW: 2500,
    regenFactor: 0.15,
    drivetrainEff: 0.82,
    tempFactor: 0.90,
    stopsPerKm: 1.0,
  },
  city_mild: {
    speedKmh: 25,
    auxPowerW: 400,
    regenFactor: 0.35,
    drivetrainEff: 0.84,
    tempFactor: 1.0,
    stopsPerKm: 3.0,
  },
  city_cold: {
    speedKmh: 23,
    auxPowerW: 3000,
    regenFactor: 0.20,
    drivetrainEff: 0.78,
    tempFactor: 0.87,
    stopsPerKm: 3.0,
  },
  highway_mild: {
    speedKmh: 110,
    auxPowerW: 400,
    regenFactor: 0.03,
    drivetrainEff: 0.90,
    tempFactor: 1.0,
    stopsPerKm: 0,
  },
  highway_cold: {
    speedKmh: 110,
    auxPowerW: 2200,
    regenFactor: 0.02,
    drivetrainEff: 0.86,
    tempFactor: 0.90,
    stopsPerKm: 0,
  },
  autobahn_130: {
    speedKmh: 130,
    auxPowerW: 500,
    regenFactor: 0.01,
    drivetrainEff: 0.90,
    tempFactor: 1.0,
    stopsPerKm: 0,
  },
  autobahn_150: {
    speedKmh: 150,
    auxPowerW: 500,
    regenFactor: 0.01,
    drivetrainEff: 0.89,
    tempFactor: 1.0,
    stopsPerKm: 0,
  },
};

// Calibration factors derived from validation against ev-database.org (n=60 cars)
const CALIBRATION: Partial<Record<ScenarioName, number>> = {
  real_combined_mild: 1.0776,
  real_combined_cold: 1.0324,
  highway_mild: 0.9365,
  highway_cold: 0.8949,
  city_mild: 0.9941,
  city_cold: 1.2766,
};

// ═══════════════════════════════════════════════════════════
// KNOWN Cd VALUES (published OEM specs)
// ═══════════════════════════════════════════════════════════
const KNOWN_CD: Record<string, number> = {
  'Tesla Model 3': 0.23, 'Tesla Model Y': 0.26, 'Tesla Model S': 0.208,
  'Mercedes EQS': 0.20, 'Mercedes EQE': 0.22, 'Mercedes EQA': 0.28,
  'Mercedes EQS SUV': 0.26, 'Mercedes EQE SUV': 0.25,
  'BMW iX': 0.25, 'BMW i4': 0.24, 'BMW i5': 0.22, 'BMW i7': 0.24,
  'BMW iX1': 0.26, 'BMW iX2': 0.26,
  'Audi Q4 e-tron': 0.28, 'Audi Q6 e-tron': 0.28, 'Audi A6 e-tron': 0.21,
  'Audi e-tron GT': 0.24,
  'Volkswagen ID.3': 0.267, 'Volkswagen ID.4': 0.28, 'Volkswagen ID.5': 0.26,
  'Volkswagen ID.7': 0.23, 'Volkswagen ID. Buzz': 0.285,
  'Hyundai Ioniq 5': 0.288, 'Hyundai Ioniq 6': 0.21, 'Hyundai Kona': 0.27,
  'Kia EV6': 0.267, 'Kia EV9': 0.28,
  'Volvo EX30': 0.27, 'Volvo EX90': 0.29,
  'Polestar 2': 0.278, 'Polestar 3': 0.29, 'Polestar 4': 0.269,
  'Porsche Taycan': 0.22, 'Porsche Macan': 0.25,
  'BYD SEAL': 0.219, 'BYD ATTO 3': 0.29,
  'Lucid Air': 0.197, 'NIO ET7': 0.208,
  'Renault 5': 0.28, 'Skoda Enyaq': 0.257, 'CUPRA Born': 0.267,
  'Fiat 500e': 0.311, 'Ford Mustang Mach-E': 0.27,
  'Smart #1': 0.29, 'Smart #3': 0.27,
};

const CD_BY_BODY: Record<string, number> = {
  sedan: 0.24, liftback: 0.24, fastback: 0.23,
  hatchback: 0.28, suv: 0.29, crossover: 0.28,
  mpv: 0.30, van: 0.32, coupe: 0.25,
  convertible: 0.31, wagon: 0.27, estate: 0.27,
};

// ═══════════════════════════════════════════════════════════
// ESTIMATION FUNCTIONS
// ═══════════════════════════════════════════════════════════

/**
 * Estimate frontal area from vehicle dimensions.
 * A = width × height × shape_factor
 */
export function estimateFrontalArea(
  widthMm: number,
  heightMm: number,
  bodyType?: string
): number {
  const w = widthMm / 1000;
  const h = heightMm / 1000;
  let sf = 0.84;
  if (bodyType) {
    const bt = bodyType.toLowerCase();
    if (bt.includes('sedan') || bt.includes('liftback')) sf = 0.82;
    else if (bt.includes('suv')) sf = 0.86;
    else if (bt.includes('van') || bt.includes('mpv')) sf = 0.88;
    else if (bt.includes('coupe') || bt.includes('roadster')) sf = 0.80;
  }
  return w * h * sf;
}

/**
 * Estimate rolling resistance coefficient from vehicle characteristics.
 */
export function estimateCrr(
  powerKw?: number,
  segment?: string,
  bodyType?: string
): number {
  if (powerKw && powerKw > 350) return 0.0095;
  if (segment && /luxury|sport|f -|e -/i.test(segment)) return 0.0085;
  if (bodyType && /suv|van/i.test(bodyType)) {
    return powerKw && powerKw > 200 ? 0.0085 : 0.0075;
  }
  if (segment && /a -|b -/i.test(segment)) return 0.0065;
  return 0.0075;
}

/**
 * Find Cd for a car by name, falling back to body type estimate.
 */
export function findCd(
  carName: string,
  bodyType?: string
): { cd: number; source: 'published' | 'matched' | 'estimated' | 'default' } {
  const nameLower = carName.toLowerCase().replace(/-/g, ' ').replace(/\./g, '');

  // Direct match
  for (const [name, cd] of Object.entries(KNOWN_CD)) {
    if (nameLower.includes(name.toLowerCase().replace(/-/g, ' ').replace(/\./g, ''))) {
      return { cd, source: 'published' };
    }
  }

  // Fuzzy match (brand + first model word)
  for (const [name, cd] of Object.entries(KNOWN_CD)) {
    const parts = name.toLowerCase().split(' ');
    if (parts.length >= 2 && nameLower.includes(parts[0]) && nameLower.includes(parts[1])) {
      return { cd, source: 'matched' };
    }
  }

  // Body type estimate
  if (bodyType) {
    const bt = bodyType.toLowerCase();
    for (const [key, cd] of Object.entries(CD_BY_BODY)) {
      if (bt.includes(key)) return { cd, source: 'estimated' };
    }
  }

  return { cd: 0.28, source: 'default' };
}

// ═══════════════════════════════════════════════════════════
// CORE PHYSICS MODEL
// ═══════════════════════════════════════════════════════════

/**
 * Calculate energy consumption for a given driving scenario.
 *
 * Physics model:
 * - Steady-state: rolling resistance + aero drag + gradient
 * - Transient: stop-start kinetic energy cycles with regen recovery
 * - Auxiliary: HVAC, electronics, pumps
 *
 * @returns Consumption in Wh/km
 */
export function calcConsumptionWhKm(
  vehicle: VehicleParams,
  scenario: ScenarioParams,
  isColdScenario: boolean = false,
): number {
  const mass = vehicle.curbWeightKg + 75; // + driver
  const v = scenario.speedKmh / 3.6; // m/s

  // Adjust aux power for heat pump in cold
  let auxPower = scenario.auxPowerW;
  if (isColdScenario && vehicle.hasHeatPump) {
    auxPower *= 0.60; // heat pump COP ~2.5-3.5 reduces heating load by ~40%
  }

  // 1. Rolling resistance: F = Crr × m × g
  const F_roll = vehicle.crr * mass * G;

  // 2. Aerodynamic drag: F = 0.5 × ρ × Cd × A × v²
  const F_aero = 0.5 * RHO_AIR * vehicle.cd * vehicle.frontalAreaM2 * v * v;

  // 3. Total steady-state force
  const F_total = F_roll + F_aero;

  // 4. Steady-state consumption (Wh/km)
  const steadyConsumption = (F_total / scenario.drivetrainEff) / v / 3.6;

  // 5. Auxiliary consumption (Wh/km)
  const auxConsumption = auxPower / v / 3.6;

  // 6. Stop-start acceleration energy (Wh/km)
  let accelConsumption = 0;
  if (scenario.stopsPerKm > 0) {
    const kePerStop = 0.5 * mass * v * v; // Joules
    const keNet = kePerStop * (1 - scenario.regenFactor * 0.85);
    accelConsumption = (keNet * scenario.stopsPerKm / 3600) / scenario.drivetrainEff;
  }

  return Math.max(steadyConsumption + auxConsumption + accelConsumption, 50);
}

/**
 * Calculate range from battery capacity and consumption.
 */
export function calcRangeKm(
  batteryNetKwh: number,
  consumptionWhKm: number,
  tempFactor: number = 1.0,
  chemistry: string = 'NMC',
  isCold: boolean = false,
  usableSocPct: number = 0.95,
): number {
  // LFP loses ~7% more than NMC in cold
  let effectiveTempFactor = tempFactor;
  if (isCold && chemistry.toUpperCase().includes('LFP')) {
    effectiveTempFactor *= 0.93;
  }

  const usableEnergyWh = batteryNetKwh * 1000 * effectiveTempFactor * usableSocPct;
  return usableEnergyWh / consumptionWhKm;
}

// ═══════════════════════════════════════════════════════════
// HIGH-LEVEL API
// ═══════════════════════════════════════════════════════════

export interface AllRangeResults {
  wltp_combined: RangeResult;
  real_combined_mild: RangeResult;
  real_combined_cold: RangeResult;
  city_mild: RangeResult;
  city_cold: RangeResult;
  highway_mild: RangeResult;
  highway_cold: RangeResult;
  autobahn_130: RangeResult;
  autobahn_150: RangeResult;
}

/**
 * Calculate range for all 9 scenarios given a vehicle's properties.
 * Returns raw, calibrated consumption and range for each scenario.
 */
export function calculateAllRanges(vehicle: VehicleParams): AllRangeResults {
  const results: Partial<AllRangeResults> = {};

  for (const [name, scenario] of Object.entries(SCENARIOS)) {
    const scenarioName = name as ScenarioName;
    const isCold = name.includes('cold');

    const consumption = calcConsumptionWhKm(vehicle, scenario, isCold);
    const range = calcRangeKm(
      vehicle.batteryNetKwh,
      consumption,
      scenario.tempFactor,
      vehicle.batteryChemistry,
      isCold,
    );

    const calibFactor = CALIBRATION[scenarioName] ?? 1.0;

    results[scenarioName] = {
      consumptionWhKm: Math.round(consumption * 10) / 10,
      rangeKm: Math.round(range),
      rangeCalibratedKm: Math.round(range * calibFactor),
    };
  }

  return results as AllRangeResults;
}

/**
 * Quick helper: get the "headline" range numbers for a car card.
 * Returns the numbers your Match Card UI needs.
 */
export function getCardRanges(vehicle: VehicleParams) {
  const all = calculateAllRanges(vehicle);
  return {
    realRange: all.real_combined_mild.rangeCalibratedKm,
    winterRange: all.real_combined_cold.rangeCalibratedKm,
    autobahnRange: all.autobahn_130.rangeCalibratedKm,
    cityRange: all.city_mild.rangeCalibratedKm,
    highwayRange: all.highway_mild.rangeCalibratedKm,
    // For "Coffee Break Charge" metric
    consumptionHighway: all.highway_mild.consumptionWhKm,
    consumptionCity: all.city_mild.consumptionWhKm,
  };
}
