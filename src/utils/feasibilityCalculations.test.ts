import { describe, it, expect } from 'vitest';
import {
  validateInputs,
  calculateNPV,
  calculateIRR,
  calculateProduction,
  calculateRevenue,
  calculateCostsAndInvestment,
  calculateFeasibility,
  generateScenarioAnalysis,
  type FeasibilityInputs
} from './feasibilityCalculations';

describe('Feasibility Calculations', () => {
  const validInputs: FeasibilityInputs = {
    cattleCount: 1000,
    avgDungPerCattle: 30,
    methanePotential: 0.35,
    plantEfficiency: 0.75,
    sellingPrice: 45,
    carbonCreditPrice: 1200,
    constructionCost: 50000000,
    operatingCostRatio: 0.35,
    subsidyPercentage: 60,
    discountRate: 12
  };

  describe('validateInputs', () => {
    it('should return no errors for valid inputs', () => {
      const errors = validateInputs(validInputs);
      expect(errors).toHaveLength(0);
    });

    it('should return error for zero cattle count', () => {
      const invalidInputs = { ...validInputs, cattleCount: 0 };
      const errors = validateInputs(invalidInputs);
      expect(errors).toContain('Cattle count must be greater than 0');
    });

    it('should return error for negative cattle count', () => {
      const invalidInputs = { ...validInputs, cattleCount: -100 };
      const errors = validateInputs(invalidInputs);
      expect(errors).toContain('Cattle count must be greater than 0');
    });

    it('should return error for invalid plant efficiency', () => {
      const invalidInputs = { ...validInputs, plantEfficiency: 1.5 };
      const errors = validateInputs(invalidInputs);
      expect(errors).toContain('Plant efficiency must be between 0 and 1');
    });

    it('should return error for negative plant efficiency', () => {
      const invalidInputs = { ...validInputs, plantEfficiency: -0.1 };
      const errors = validateInputs(invalidInputs);
      expect(errors).toContain('Plant efficiency must be between 0 and 1');
    });

    it('should return error for invalid subsidy percentage', () => {
      const invalidInputs = { ...validInputs, subsidyPercentage: 150 };
      const errors = validateInputs(invalidInputs);
      expect(errors).toContain('Subsidy percentage must be between 0 and 100');
    });

    it('should return multiple errors for multiple invalid inputs', () => {
      const invalidInputs = {
        ...validInputs,
        cattleCount: -100,
        plantEfficiency: 2.0,
        subsidyPercentage: -10
      };
      const errors = validateInputs(invalidInputs);
      expect(errors).toHaveLength(3);
    });
  });

  describe('calculateNPV', () => {
    it('should calculate correct NPV for positive cash flows', () => {
      const npv = calculateNPV(1000000, 5000000, 10, 10);
      expect(npv).toBeCloseTo(1144567, 0); // Expected NPV with 10% discount rate
    });

    it('should return negative investment for zero years', () => {
      const npv = calculateNPV(1000000, 5000000, 10, 0);
      expect(npv).toBe(-5000000);
    });

    it('should throw error for negative discount rate', () => {
      expect(() => calculateNPV(1000000, 5000000, -5, 10)).toThrow('Discount rate must be positive');
    });

    it('should handle very small discount rates', () => {
      const npv = calculateNPV(1000000, 5000000, 0.1, 10);
      expect(npv).toBeCloseTo(4945219, 0);
    });

    it('should handle large discount rates', () => {
      const npv = calculateNPV(1000000, 5000000, 50, 10);
      expect(npv).toBeLessThan(0); // Should be negative with high discount rate
    });
  });

  describe('calculateIRR', () => {
    it('should calculate reasonable IRR for profitable project', () => {
      const irr = calculateIRR(1500000, 5000000, 10);
      expect(irr).toBeGreaterThan(25); // Should be a high IRR
      expect(irr).toBeLessThan(35);
    });

    it('should return 0 for zero cash flow', () => {
      const irr = calculateIRR(0, 5000000, 10);
      expect(irr).toBe(0);
    });

    it('should return 0 for zero years', () => {
      const irr = calculateIRR(1000000, 5000000, 0);
      expect(irr).toBe(0);
    });

    it('should throw error for zero or negative investment', () => {
      expect(() => calculateIRR(1000000, 0, 10)).toThrow('Investment must be positive');
      expect(() => calculateIRR(1000000, -1000000, 10)).toThrow('Investment must be positive');
    });

    it('should handle break-even scenario', () => {
      const irr = calculateIRR(500000, 5000000, 10); // Exactly 10% IRR
      expect(irr).toBeCloseTo(0, 1); // This scenario actually results in near 0% IRR
    });
  });

  describe('calculateProduction', () => {
    it('should calculate correct production metrics', () => {
      const production = calculateProduction(validInputs);

      expect(production.dailyDung).toBe(30000); // 1000 * 30
      expect(production.dailyBiogas).toBe(7875); // 30000 * 0.35 * 0.75
      expect(production.annualBiogas).toBe(2874375); // 7875 * 365
    });

    it('should handle zero efficiency', () => {
      const inputs = { ...validInputs, plantEfficiency: 0 };
      const production = calculateProduction(inputs);

      expect(production.dailyBiogas).toBe(0);
      expect(production.annualBiogas).toBe(0);
    });

    it('should handle maximum efficiency', () => {
      const inputs = { ...validInputs, plantEfficiency: 1.0 };
      const production = calculateProduction(inputs);

      expect(production.dailyBiogas).toBe(10500); // 30000 * 0.35 * 1.0
    });
  });

  describe('calculateRevenue', () => {
    it('should calculate correct revenue breakdown', () => {
      const production = calculateProduction(validInputs);
      const revenue = calculateRevenue(production, validInputs);

      // Biogas revenue: 2874375 * 45
      expect(revenue.biogas).toBeCloseTo(129346875, 0);

      // Carbon credits should be positive
      expect(revenue.carbonCredits).toBeGreaterThan(0);

      // Total should be sum of both
      expect(revenue.total).toBe(revenue.biogas + revenue.carbonCredits);
    });

    it('should handle zero carbon credit price', () => {
      const inputs = { ...validInputs, carbonCreditPrice: 0 };
      const production = calculateProduction(inputs);
      const revenue = calculateRevenue(production, inputs);

      expect(revenue.carbonCredits).toBe(0);
      expect(revenue.total).toBe(revenue.biogas);
    });
  });

  describe('calculateCostsAndInvestment', () => {
    it('should calculate correct costs and investment', () => {
      const production = calculateProduction(validInputs);
      const revenue = calculateRevenue(production, validInputs);
      const { costs, investment } = calculateCostsAndInvestment(revenue, validInputs);

      // Operating costs: 35% of total revenue
      expect(costs.operating).toBe(revenue.total * 0.35);

      // Net cash flow: revenue - operating costs
      expect(costs.netCashFlow).toBe(revenue.total - costs.operating);

      // Investment calculations
      expect(investment.total).toBe(50000000);
      expect(investment.subsidy).toBe(30000000); // 60% of 50M
      expect(investment.net).toBe(20000000); // 50M - 30M
    });

    it('should handle zero subsidy', () => {
      const inputs = { ...validInputs, subsidyPercentage: 0 };
      const production = calculateProduction(inputs);
      const revenue = calculateRevenue(production, inputs);
      const { investment } = calculateCostsAndInvestment(revenue, inputs);

      expect(investment.subsidy).toBe(0);
      expect(investment.net).toBe(investment.total);
    });

    it('should handle 100% subsidy', () => {
      const inputs = { ...validInputs, subsidyPercentage: 100 };
      const production = calculateProduction(inputs);
      const revenue = calculateRevenue(production, inputs);
      const { investment } = calculateCostsAndInvestment(revenue, inputs);

      expect(investment.subsidy).toBe(investment.total);
      expect(investment.net).toBe(0);
    });
  });

  describe('calculateFeasibility', () => {
    it('should return complete feasibility analysis', () => {
      const results = calculateFeasibility(validInputs);

      // Check all sections are present
      expect(results.production).toBeDefined();
      expect(results.revenue).toBeDefined();
      expect(results.costs).toBeDefined();
      expect(results.investment).toBeDefined();
      expect(results.metrics).toBeDefined();

      // Check metrics calculations
      expect(results.metrics.paybackPeriod).toBeGreaterThan(0);
      expect(results.metrics.npv).toBeDefined();
      expect(results.metrics.irr).toBeDefined();
      expect(results.metrics.profitability).toMatch(/^(Profitable|Not Profitable)$/);
    });

    it('should throw error for invalid inputs', () => {
      const invalidInputs = { ...validInputs, cattleCount: -100 };
      expect(() => calculateFeasibility(invalidInputs)).toThrow('Invalid inputs');
    });

    it('should mark profitable projects correctly', () => {
      const profitableInputs = {
        ...validInputs,
        constructionCost: 10000000, // Lower cost = more profitable
        subsidyPercentage: 80
      };
      const results = calculateFeasibility(profitableInputs);

      expect(results.metrics.npv).toBeGreaterThan(0);
      expect(results.metrics.profitability).toBe('Profitable');
    });

    it('should mark unprofitable projects correctly', () => {
      const unprofitableInputs = {
        ...validInputs,
        constructionCost: 500000000, // Very high cost = unprofitable
        subsidyPercentage: 0,
        sellingPrice: 5, // Very low price
        operatingCostRatio: 0.9 // Very high operating costs
      };
      const results = calculateFeasibility(unprofitableInputs);

      expect(results.metrics.npv).toBeLessThan(0);
      expect(results.metrics.profitability).toBe('Not Profitable');
    });
  });

  describe('generateScenarioAnalysis', () => {
    it('should generate three scenarios', () => {
      const scenarios = generateScenarioAnalysis(validInputs);

      expect(scenarios).toHaveLength(3);
      expect(scenarios.map(s => s.name)).toEqual(['Conservative', 'Base Case', 'Optimistic']);
    });

    it('should have different values for each scenario', () => {
      const scenarios = generateScenarioAnalysis(validInputs);

      const conservative = scenarios.find(s => s.name === 'Conservative')!;
      const baseCase = scenarios.find(s => s.name === 'Base Case')!;
      const optimistic = scenarios.find(s => s.name === 'Optimistic')!;

      // Conservative should have lower values than base case
      expect(conservative.revenue).toBeLessThan(baseCase.revenue);
      expect(conservative.npv).toBeLessThan(baseCase.npv);

      // Optimistic should have higher values than base case
      expect(optimistic.revenue).toBeGreaterThan(baseCase.revenue);
      expect(optimistic.npv).toBeGreaterThan(baseCase.npv);
    });

    it('should maintain reasonable value ranges', () => {
      const scenarios = generateScenarioAnalysis(validInputs);

      scenarios.forEach(scenario => {
        expect(scenario.npv).toBeDefined();
        expect(scenario.irr).toBeGreaterThan(0);
        expect(scenario.payback).toBeGreaterThan(0);
        expect(scenario.revenue).toBeGreaterThan(0);
      });
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    it('should handle minimum viable inputs', () => {
      const minInputs: FeasibilityInputs = {
        cattleCount: 1,
        avgDungPerCattle: 1,
        methanePotential: 0.01,
        plantEfficiency: 0.01,
        sellingPrice: 1,
        carbonCreditPrice: 0,
        constructionCost: 1000,
        operatingCostRatio: 0.01,
        subsidyPercentage: 0,
        discountRate: 1
      };

      expect(() => calculateFeasibility(minInputs)).not.toThrow();
    });

    it('should handle maximum reasonable inputs', () => {
      const maxInputs: FeasibilityInputs = {
        cattleCount: 100000,
        avgDungPerCattle: 100,
        methanePotential: 1.0,
        plantEfficiency: 1.0,
        sellingPrice: 200,
        carbonCreditPrice: 5000,
        constructionCost: 1000000000,
        operatingCostRatio: 0.99,
        subsidyPercentage: 100, // 100% subsidy means net investment = 0
        discountRate: 50
      };

      const results = calculateFeasibility(maxInputs);
      // With 100% subsidy, net investment should be 0, making most metrics undefined or very high
      expect(results.investment.net).toBe(0);
    });

    it('should produce consistent results for same inputs', () => {
      const results1 = calculateFeasibility(validInputs);
      const results2 = calculateFeasibility(validInputs);

      expect(results1.metrics.npv).toBe(results2.metrics.npv);
      expect(results1.metrics.irr).toBe(results2.metrics.irr);
      expect(results1.metrics.paybackPeriod).toBe(results2.metrics.paybackPeriod);
    });
  });
});