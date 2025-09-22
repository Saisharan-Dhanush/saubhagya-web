import { describe, it, expect } from 'vitest';
import { validateInputs, calculateFeasibility } from '../../utils/feasibilityCalculations';

describe('FeasibilityAnalysisPage Integration Tests', () => {
  describe('Component Integration with Calculations', () => {
    it('should handle input validation correctly', () => {
      const invalidInputs = {
        cattleCount: -100,
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

      const errors = validateInputs(invalidInputs);
      expect(errors).toContain('Cattle count must be greater than 0');
    });

    it('should calculate feasibility with default values', () => {
      const defaultInputs = {
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

      const results = calculateFeasibility(defaultInputs);
      expect(results.production.dailyBiogas).toBeGreaterThan(0);
      expect(results.revenue.total).toBeGreaterThan(0);
      expect(results.metrics.npv).toBeDefined();
    });

    it('should handle percentage conversion correctly', () => {
      // Test that percentage inputs (shown as 75% in UI) are converted to decimals (0.75) internally
      const inputs = {
        cattleCount: 1000,
        avgDungPerCattle: 30,
        methanePotential: 0.35,
        plantEfficiency: 0.75, // Internal value
        sellingPrice: 45,
        carbonCreditPrice: 1200,
        constructionCost: 50000000,
        operatingCostRatio: 0.35, // Internal value
        subsidyPercentage: 60, // Percentage value
        discountRate: 12
      };

      const results = calculateFeasibility(inputs);
      expect(results.investment.subsidy).toBe(30000000); // 60% of 50M
    });

    it('should handle reset functionality', () => {
      const defaultInputs = {
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

      const modifiedInputs = {
        ...defaultInputs,
        cattleCount: 2000,
        sellingPrice: 60
      };

      // Both should produce valid results
      expect(() => calculateFeasibility(defaultInputs)).not.toThrow();
      expect(() => calculateFeasibility(modifiedInputs)).not.toThrow();

      const defaultResults = calculateFeasibility(defaultInputs);
      const modifiedResults = calculateFeasibility(modifiedInputs);

      // Modified results should be different
      expect(modifiedResults.production.dailyBiogas).toBeGreaterThan(defaultResults.production.dailyBiogas);
      expect(modifiedResults.revenue.total).toBeGreaterThan(defaultResults.revenue.total);
    });

    it('should handle edge cases in user input', () => {
      const edgeCaseInputs = {
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

      expect(() => calculateFeasibility(edgeCaseInputs)).not.toThrow();
    });

    it('should format currency values correctly', () => {
      const inputs = {
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

      const results = calculateFeasibility(inputs);

      // Revenue should be in reasonable range for display as crores
      const revenueCrores = results.revenue.total / 10000000;
      expect(revenueCrores).toBeGreaterThan(0);
      expect(revenueCrores).toBeLessThan(1000); // Reasonable upper bound
    });
  });

  describe('Calculation Robustness', () => {
    it('should handle very large inputs', () => {
      const largeInputs = {
        cattleCount: 50000,
        avgDungPerCattle: 50,
        methanePotential: 0.5,
        plantEfficiency: 0.9,
        sellingPrice: 100,
        carbonCreditPrice: 3000,
        constructionCost: 200000000,
        operatingCostRatio: 0.3,
        subsidyPercentage: 50,
        discountRate: 10
      };

      const results = calculateFeasibility(largeInputs);
      expect(results.production.annualBiogas).toBeGreaterThan(0);
      expect(results.metrics.npv).toBeDefined();
      expect(isFinite(results.metrics.irr)).toBe(true);
    });

    it('should handle boundary conditions', () => {
      const boundaryInputs = {
        cattleCount: 1,
        avgDungPerCattle: 0.1,
        methanePotential: 0.001,
        plantEfficiency: 0.001,
        sellingPrice: 0.1,
        carbonCreditPrice: 1,
        constructionCost: 100,
        operatingCostRatio: 0.001,
        subsidyPercentage: 1,
        discountRate: 0.1
      };

      const results = calculateFeasibility(boundaryInputs);
      expect(results.production.dailyBiogas).toBeGreaterThanOrEqual(0);
      expect(results.revenue.total).toBeGreaterThanOrEqual(0);
    });
  });
});