export interface FeasibilityInputs {
  cattleCount: number;
  avgDungPerCattle: number;
  methanePotential: number;
  plantEfficiency: number;
  sellingPrice: number;
  carbonCreditPrice: number;
  constructionCost: number;
  operatingCostRatio: number;
  subsidyPercentage: number;
  discountRate: number;
}

export interface FeasibilityResults {
  production: {
    dailyDung: number;
    dailyBiogas: number;
    annualBiogas: number;
  };
  revenue: {
    biogas: number;
    carbonCredits: number;
    total: number;
  };
  costs: {
    operating: number;
    netCashFlow: number;
  };
  investment: {
    total: number;
    subsidy: number;
    net: number;
  };
  metrics: {
    paybackPeriod: number;
    npv: number;
    irr: number;
    profitability: string;
  };
}

export interface ScenarioResult {
  name: string;
  npv: number;
  irr: number;
  payback: number;
  revenue: number;
}

/**
 * Validates input parameters for feasibility analysis
 */
export function validateInputs(inputs: FeasibilityInputs): string[] {
  const errors: string[] = [];

  if (inputs.cattleCount <= 0) {
    errors.push('Cattle count must be greater than 0');
  }
  if (inputs.avgDungPerCattle <= 0) {
    errors.push('Average dung per cattle must be greater than 0');
  }
  if (inputs.methanePotential <= 0) {
    errors.push('Methane potential must be greater than 0');
  }
  if (inputs.plantEfficiency <= 0 || inputs.plantEfficiency > 1) {
    errors.push('Plant efficiency must be between 0 and 1');
  }
  if (inputs.sellingPrice <= 0) {
    errors.push('Selling price must be greater than 0');
  }
  if (inputs.carbonCreditPrice < 0) {
    errors.push('Carbon credit price cannot be negative');
  }
  if (inputs.constructionCost <= 0) {
    errors.push('Construction cost must be greater than 0');
  }
  if (inputs.operatingCostRatio < 0 || inputs.operatingCostRatio > 1) {
    errors.push('Operating cost ratio must be between 0 and 1');
  }
  if (inputs.subsidyPercentage < 0 || inputs.subsidyPercentage > 100) {
    errors.push('Subsidy percentage must be between 0 and 100');
  }
  if (inputs.discountRate <= 0) {
    errors.push('Discount rate must be greater than 0');
  }

  return errors;
}

/**
 * Calculates NPV (Net Present Value) for a given cash flow
 */
export function calculateNPV(
  cashFlow: number,
  investment: number,
  discountRate: number,
  years: number
): number {
  if (years <= 0) return -investment;
  if (discountRate <= 0) throw new Error('Discount rate must be positive');

  let npv = -investment;
  const rate = discountRate / 100;

  for (let year = 1; year <= years; year++) {
    npv += cashFlow / Math.pow(1 + rate, year);
  }

  return npv;
}

/**
 * Calculates IRR (Internal Rate of Return) using Newton-Raphson method
 */
export function calculateIRR(
  cashFlow: number,
  investment: number,
  years: number
): number {
  if (years <= 0) return 0;
  if (investment <= 0) throw new Error('Investment must be positive');
  if (cashFlow <= 0) return 0; // No positive cash flow means no IRR

  let irr = 0.1; // Initial guess (10%)
  const maxIterations = 100;
  const tolerance = 0.01;

  for (let i = 0; i < maxIterations; i++) {
    let npv = -investment;
    let dnpv = 0; // Derivative of NPV

    for (let year = 1; year <= years; year++) {
      const factor = Math.pow(1 + irr, year);
      npv += cashFlow / factor;
      dnpv -= year * cashFlow / (factor * (1 + irr));
    }

    if (Math.abs(npv) < tolerance) break;

    // Avoid division by zero
    if (Math.abs(dnpv) < 1e-10) break;

    const newIrr = irr - npv / dnpv;

    // Keep IRR reasonable bounds
    if (newIrr < -0.99) {
      irr = -0.99;
    } else if (newIrr > 10) {
      irr = 10;
    } else {
      irr = newIrr;
    }
  }

  return irr * 100;
}

/**
 * Calculates production metrics from inputs
 */
export function calculateProduction(inputs: FeasibilityInputs) {
  const dailyDung = inputs.cattleCount * inputs.avgDungPerCattle;
  const theoreticalBiogas = dailyDung * inputs.methanePotential;
  const dailyBiogas = theoreticalBiogas * inputs.plantEfficiency;
  const annualBiogas = dailyBiogas * 365;

  return {
    dailyDung,
    dailyBiogas,
    annualBiogas
  };
}

/**
 * Calculates revenue metrics from production and pricing
 */
export function calculateRevenue(production: ReturnType<typeof calculateProduction>, inputs: FeasibilityInputs) {
  const biogasRevenue = production.annualBiogas * inputs.sellingPrice;

  // Carbon credits calculation: biogas to CO2 equivalent
  // Assuming 1 m³ biogas = 0.67 kg methane, and 1 kg methane = 25 kg CO2 eq
  const carbonCreditsAnnual = (production.dailyBiogas * 0.67 * 25 * 365) / 1000; // tonnes CO₂ eq
  const carbonCreditRevenue = carbonCreditsAnnual * inputs.carbonCreditPrice;

  const totalRevenue = biogasRevenue + carbonCreditRevenue;

  return {
    biogas: biogasRevenue,
    carbonCredits: carbonCreditRevenue,
    total: totalRevenue
  };
}

/**
 * Calculates cost and investment metrics
 */
export function calculateCostsAndInvestment(revenue: ReturnType<typeof calculateRevenue>, inputs: FeasibilityInputs) {
  const operatingCosts = revenue.total * inputs.operatingCostRatio;
  const netCashFlow = revenue.total - operatingCosts;

  const totalInvestment = inputs.constructionCost;
  const subsidyAmount = totalInvestment * (inputs.subsidyPercentage / 100);
  const netInvestment = totalInvestment - subsidyAmount;

  return {
    costs: {
      operating: operatingCosts,
      netCashFlow
    },
    investment: {
      total: totalInvestment,
      subsidy: subsidyAmount,
      net: netInvestment
    }
  };
}

/**
 * Calculates complete feasibility analysis
 */
export function calculateFeasibility(inputs: FeasibilityInputs): FeasibilityResults {
  const validationErrors = validateInputs(inputs);
  if (validationErrors.length > 0) {
    throw new Error(`Invalid inputs: ${validationErrors.join(', ')}`);
  }

  const production = calculateProduction(inputs);
  const revenue = calculateRevenue(production, inputs);
  const { costs, investment } = calculateCostsAndInvestment(revenue, inputs);

  // Financial metrics
  const paybackPeriod = investment.net > 0 && costs.netCashFlow > 0
    ? investment.net / costs.netCashFlow
    : investment.net === 0 ? 0 : Infinity;
  const npv = investment.net > 0
    ? calculateNPV(costs.netCashFlow, investment.net, inputs.discountRate, 20)
    : costs.netCashFlow * 20; // If no investment, NPV is just total cash flows
  const irr = investment.net > 0
    ? calculateIRR(costs.netCashFlow, investment.net, 20)
    : costs.netCashFlow > 0 ? 1000 : 0; // Very high IRR if no investment and positive cash flow

  return {
    production,
    revenue,
    costs,
    investment,
    metrics: {
      paybackPeriod,
      npv,
      irr,
      profitability: npv > 0 ? 'Profitable' : 'Not Profitable'
    }
  };
}

/**
 * Generates scenario analysis with different assumptions
 */
export function generateScenarioAnalysis(baseInputs: FeasibilityInputs): ScenarioResult[] {
  const scenarios = [
    {
      name: 'Conservative',
      cattleMultiplier: 0.8,
      priceMultiplier: 0.9,
      efficiencyMultiplier: 0.9
    },
    {
      name: 'Base Case',
      cattleMultiplier: 1.0,
      priceMultiplier: 1.0,
      efficiencyMultiplier: 1.0
    },
    {
      name: 'Optimistic',
      cattleMultiplier: 1.2,
      priceMultiplier: 1.1,
      efficiencyMultiplier: 1.1
    }
  ];

  return scenarios.map(scenario => {
    const scenarioInputs: FeasibilityInputs = {
      ...baseInputs,
      cattleCount: Math.round(baseInputs.cattleCount * scenario.cattleMultiplier),
      sellingPrice: baseInputs.sellingPrice * scenario.priceMultiplier,
      plantEfficiency: baseInputs.plantEfficiency * scenario.efficiencyMultiplier
    };

    const results = calculateFeasibility(scenarioInputs);

    return {
      name: scenario.name,
      npv: results.metrics.npv / 10000000, // Convert to crores
      irr: results.metrics.irr,
      payback: results.metrics.paybackPeriod,
      revenue: results.revenue.total / 10000000 // Convert to crores
    };
  });
}