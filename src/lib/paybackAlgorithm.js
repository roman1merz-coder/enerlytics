/**
 * Payback Period & ROI Calculator for Battery Storage Systems
 * Calculates savings, payback period, and lifetime value based on user's energy profile
 */

/**
 * Default values for Germany (2026)
 */
export const DEFAULT_PARAMS = {
  electricityPriceEur: 0.35,        // €/kWh (German household average)
  feedInTariffEur: 0.08,            // €/kWh (current German feed-in tariff)
  solarYieldKwhPerKwp: 1000,        // Annual yield per kWp in Germany
  batteryLifespanYears: 25,          // Typical battery warranty/lifespan
  degradationPercentPerYear: 0.5,    // 0.5% capacity loss per year
  electricityPriceIncreasePerYear: 0.03, // 3% annual increase assumption
};

/**
 * Calculate daily energy flows without battery storage
 *
 * @param {Object} params - Calculation parameters
 * @returns {Object} Energy flow breakdown
 */
function calculateWithoutStorage(params) {
  const {
    monthlyConsumptionKwh,
    solarSystemKwp = 0,
  } = params;

  const dailyConsumptionKwh = monthlyConsumptionKwh / 30;
  const dailySolarProductionKwh = solarSystemKwp > 0
    ? (solarSystemKwp * DEFAULT_PARAMS.solarYieldKwhPerKwp / 365)
    : 0;

  // Without storage: ~30% of solar is consumed directly (daytime overlap)
  // The rest is fed into the grid
  const directConsumptionRate = 0.30;
  const directSolarConsumptionKwh = Math.min(
    dailySolarProductionKwh * directConsumptionRate,
    dailyConsumptionKwh
  );

  const gridPurchaseKwh = dailyConsumptionKwh - directSolarConsumptionKwh;
  const feedInKwh = dailySolarProductionKwh - directSolarConsumptionKwh;

  return {
    dailyConsumptionKwh,
    dailySolarProductionKwh,
    directSolarConsumptionKwh,
    gridPurchaseKwh,
    feedInKwh,
    selfConsumptionRate: dailySolarProductionKwh > 0
      ? (directSolarConsumptionKwh / dailySolarProductionKwh)
      : 0,
  };
}

/**
 * Calculate daily energy flows with battery storage
 *
 * @param {Object} params - Calculation parameters
 * @returns {Object} Energy flow breakdown
 */
function calculateWithStorage(params) {
  const {
    monthlyConsumptionKwh,
    solarSystemKwp = 0,
    storageSizeKwh,
  } = params;

  const dailyConsumptionKwh = monthlyConsumptionKwh / 30;
  const dailySolarProductionKwh = solarSystemKwp > 0
    ? (solarSystemKwp * DEFAULT_PARAMS.solarYieldKwhPerKwp / 365)
    : 0;

  if (solarSystemKwp === 0 || dailySolarProductionKwh === 0) {
    // No solar = no benefit from storage
    return {
      dailyConsumptionKwh,
      dailySolarProductionKwh: 0,
      solarConsumptionKwh: 0,
      gridPurchaseKwh: dailyConsumptionKwh,
      feedInKwh: 0,
      selfConsumptionRate: 0,
    };
  }

  // With storage: Can increase self-consumption to 60-80% depending on battery size
  // Larger batteries relative to daily production = higher self-consumption
  const storageRatio = storageSizeKwh / dailySolarProductionKwh;
  let selfConsumptionRate;

  if (storageRatio >= 1.0) {
    // Large battery: can store most excess solar for evening use
    selfConsumptionRate = 0.80;
  } else if (storageRatio >= 0.5) {
    // Medium battery: good coverage
    selfConsumptionRate = 0.65 + (storageRatio - 0.5) * 0.30;
  } else {
    // Small battery: limited benefit
    selfConsumptionRate = 0.30 + storageRatio * 0.70;
  }

  const solarConsumptionKwh = Math.min(
    dailySolarProductionKwh * selfConsumptionRate,
    dailyConsumptionKwh
  );

  const gridPurchaseKwh = dailyConsumptionKwh - solarConsumptionKwh;
  const feedInKwh = dailySolarProductionKwh - solarConsumptionKwh;

  return {
    dailyConsumptionKwh,
    dailySolarProductionKwh,
    solarConsumptionKwh,
    gridPurchaseKwh,
    feedInKwh,
    selfConsumptionRate,
  };
}

/**
 * Calculate annual savings from battery storage
 *
 * @param {Object} params - Calculation parameters
 * @returns {Object} Savings breakdown
 */
function calculateAnnualSavings(params) {
  const { electricityPriceEur, feedInTariffEur } = {
    ...DEFAULT_PARAMS,
    ...params,
  };

  const without = calculateWithoutStorage(params);
  const withStorage = calculateWithStorage(params);

  // Annual grid purchase savings (buying less electricity)
  const gridSavingsEur =
    (without.gridPurchaseKwh - withStorage.gridPurchaseKwh) * 365 * electricityPriceEur;

  // Annual feed-in loss (selling less electricity back to grid)
  const feedInLossEur =
    (without.feedInKwh - withStorage.feedInKwh) * 365 * feedInTariffEur;

  // Net annual savings
  const annualSavingsEur = gridSavingsEur - feedInLossEur;

  return {
    gridSavingsEur,
    feedInLossEur,
    annualSavingsEur,
    selfConsumptionImprovement: withStorage.selfConsumptionRate - without.selfConsumptionRate,
    withoutStorage: without,
    withStorage,
  };
}

/**
 * Calculate payback period for battery storage investment
 *
 * @param {Object} params - All calculation parameters
 * @param {number} params.monthlyConsumptionKwh - Monthly electricity consumption
 * @param {number} params.solarSystemKwp - Solar PV system size (0 if no solar)
 * @param {number} params.storageSizeKwh - Battery storage capacity
 * @param {number} params.systemCostEur - Total system cost (battery + inverter)
 * @param {number} params.installationCostEur - Installation cost
 * @param {number} params.electricityPriceEur - Current electricity price (€/kWh)
 * @param {number} params.feedInTariffEur - Feed-in tariff (€/kWh)
 * @returns {Object} Comprehensive payback analysis
 */
export function calculatePayback(params) {
  const {
    systemCostEur,
    installationCostEur = 0,
    electricityPriceEur = DEFAULT_PARAMS.electricityPriceEur,
    feedInTariffEur = DEFAULT_PARAMS.feedInTariffEur,
  } = params;

  // Validate inputs
  if (!params.monthlyConsumptionKwh || params.monthlyConsumptionKwh <= 0) {
    throw new Error('Monthly consumption must be greater than 0');
  }

  if (!params.storageSizeKwh || params.storageSizeKwh <= 0) {
    throw new Error('Storage size must be greater than 0');
  }

  const totalInvestmentEur = systemCostEur + installationCostEur;

  // Calculate annual savings
  const savingsAnalysis = calculateAnnualSavings({
    ...params,
    electricityPriceEur,
    feedInTariffEur,
  });

  const { annualSavingsEur, withoutStorage, withStorage } = savingsAnalysis;

  // Simple payback period (without considering price increases)
  const simplePaybackYears = annualSavingsEur > 0
    ? totalInvestmentEur / annualSavingsEur
    : Infinity;

  // Lifetime savings (25 years, accounting for battery degradation and electricity price increases)
  let cumulativeSavingsEur = -totalInvestmentEur;
  let breakEvenYear = null;
  const savingsTimeline = [];

  for (let year = 1; year <= DEFAULT_PARAMS.batteryLifespanYears; year++) {
    // Account for battery degradation (reduces savings slightly each year)
    const degradationFactor = 1 - (DEFAULT_PARAMS.degradationPercentPerYear / 100) * year;

    // Account for electricity price increases (increases savings each year)
    const priceIncreaseFactor = Math.pow(
      1 + DEFAULT_PARAMS.electricityPriceIncreasePerYear,
      year - 1
    );

    const yearSavingsEur = annualSavingsEur * degradationFactor * priceIncreaseFactor;
    cumulativeSavingsEur += yearSavingsEur;

    savingsTimeline.push({
      year,
      annualSavings: Math.round(yearSavingsEur),
      cumulativeSavings: Math.round(cumulativeSavingsEur),
    });

    if (breakEvenYear === null && cumulativeSavingsEur >= 0) {
      breakEvenYear = year;
    }
  }

  const lifetimeSavingsEur = cumulativeSavingsEur;

  return {
    // Investment
    systemCostEur,
    installationCostEur,
    totalInvestmentEur,

    // Savings
    annualSavingsEur: Math.round(annualSavingsEur),
    gridSavingsEur: Math.round(savingsAnalysis.gridSavingsEur),
    feedInLossEur: Math.round(savingsAnalysis.feedInLossEur),

    // Payback
    simplePaybackYears: Math.round(simplePaybackYears * 10) / 10,
    breakEvenYear,
    lifetimeSavingsEur: Math.round(lifetimeSavingsEur),

    // Self-consumption
    selfConsumptionRateBefore: Math.round(withoutStorage.selfConsumptionRate * 100),
    selfConsumptionRateAfter: Math.round(withStorage.selfConsumptionRate * 100),
    selfConsumptionImprovement: Math.round(savingsAnalysis.selfConsumptionImprovement * 100),

    // Energy flows (daily averages)
    dailyConsumptionKwh: Math.round(withStorage.dailyConsumptionKwh * 10) / 10,
    dailySolarProductionKwh: Math.round(withStorage.dailySolarProductionKwh * 10) / 10,
    gridPurchaseBefore: Math.round(withoutStorage.gridPurchaseKwh * 365),
    gridPurchaseAfter: Math.round(withStorage.gridPurchaseKwh * 365),

    // Timeline for charting
    savingsTimeline,

    // Profitability assessment
    isProfitable: lifetimeSavingsEur > 0,
    profitabilityRating: lifetimeSavingsEur > totalInvestmentEur
      ? 'Excellent'
      : lifetimeSavingsEur > 0
      ? 'Good'
      : 'Not Recommended',
  };
}

/**
 * Generate data for savings chart (cumulative savings over time)
 *
 * @param {Object} paybackResult - Result from calculatePayback()
 * @returns {Object} Chart data { years: [], cumulativeSavings: [] }
 */
export function generateSavingsChartData(paybackResult) {
  const { savingsTimeline, totalInvestmentEur } = paybackResult;

  return {
    years: [0, ...savingsTimeline.map((d) => d.year)],
    cumulativeSavings: [-totalInvestmentEur, ...savingsTimeline.map((d) => d.cumulativeSavings)],
  };
}

/**
 * Calculate recommended storage size based on consumption and solar
 *
 * @param {number} monthlyConsumptionKwh - Monthly electricity consumption
 * @param {number} solarSystemKwp - Solar PV system size
 * @returns {Object} Recommended storage size and reasoning
 */
export function recommendStorageSize(monthlyConsumptionKwh, solarSystemKwp = 0) {
  const dailyConsumptionKwh = monthlyConsumptionKwh / 30;

  if (solarSystemKwp === 0) {
    return {
      recommendedSizeKwh: 0,
      reasoning: 'Battery storage is not economical without a solar PV system. Consider installing solar panels first.',
    };
  }

  const dailySolarProductionKwh = solarSystemKwp * DEFAULT_PARAMS.solarYieldKwhPerKwp / 365;

  // Recommended: 40-60% of daily solar production OR 60-80% of daily consumption
  const basedOnSolar = dailySolarProductionKwh * 0.5;
  const basedOnConsumption = dailyConsumptionKwh * 0.7;

  const recommendedSizeKwh = Math.round(Math.min(basedOnSolar, basedOnConsumption));

  let reasoning;
  if (recommendedSizeKwh < 5) {
    reasoning = 'Small battery (5 kWh) recommended for your setup. Covers evening consumption.';
  } else if (recommendedSizeKwh < 10) {
    reasoning = 'Medium battery (7-10 kWh) recommended. Balances cost and self-sufficiency.';
  } else if (recommendedSizeKwh < 15) {
    reasoning = 'Large battery (10-15 kWh) recommended for high self-consumption.';
  } else {
    reasoning = 'Extra-large battery (15+ kWh) recommended. Consider backup power needs.';
  }

  return {
    recommendedSizeKwh: Math.max(5, recommendedSizeKwh), // Minimum 5 kWh
    reasoning,
  };
}
