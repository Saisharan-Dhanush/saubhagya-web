import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  calculateFeasibility,
  generateScenarioAnalysis,
  validateInputs,
  type FeasibilityInputs,
  type FeasibilityResults,
  type ScenarioResult
} from '@/utils/feasibilityCalculations';
import { CalculationErrorBoundary } from '@/components/ErrorBoundary';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Leaf,
  MapPin,
  Download,
  Share,
  RefreshCw,
  AlertCircle
} from 'lucide-react';


function FeasibilityAnalysisPageContent() {
  const [inputs, setInputs] = useState<FeasibilityInputs>({
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
  });

  const [feasibilityResults, setFeasibilityResults] = useState<FeasibilityResults | null>(null);
  const [scenarioAnalysis, setScenarioAnalysis] = useState<ScenarioResult[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Only perform calculation if inputs are valid
      const errors = validateInputs(inputs);
      if (errors.length === 0) {
        performFeasibilityCalculation();
      } else {
        // Just validate without calculating
        setValidationErrors(errors);
        setFeasibilityResults(null);
        setScenarioAnalysis([]);
        setIsCalculating(false);
      }
    }, 800); // Increased debounce time for better performance

    return () => clearTimeout(timer);
  }, [inputs]);

  const performFeasibilityCalculation = () => {
    setIsCalculating(true);
    setValidationErrors([]);

    try {
      // Validate inputs first
      const errors = validateInputs(inputs);
      if (errors.length > 0) {
        setValidationErrors(errors);
        setFeasibilityResults(null);
        setScenarioAnalysis([]);
        setIsCalculating(false);
        return;
      }

      // Perform calculations using the utility functions
      const results = calculateFeasibility(inputs);
      const scenarios = generateScenarioAnalysis(inputs);

      setFeasibilityResults(results);
      setScenarioAnalysis(scenarios);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Calculation failed';
      setValidationErrors([errorMessage]);
      setFeasibilityResults(null);
      setScenarioAnalysis([]);
    }

    setIsCalculating(false);
  };

  const handleInputChange = (field: keyof FeasibilityInputs, value: number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getInputError = (field: keyof FeasibilityInputs): string | null => {
    const fieldErrors = validationErrors.filter(error => {
      const fieldName = field.replace(/([A-Z])/g, ' $1').toLowerCase();
      return error.toLowerCase().includes(fieldName);
    });
    return fieldErrors.length > 0 ? fieldErrors[0] : null;
  };

  const InputField = ({
    label,
    field,
    type = "number",
    step,
    value,
    onChange,
    isPercentage = false
  }: {
    label: string;
    field: keyof FeasibilityInputs;
    type?: string;
    step?: string;
    value: number;
    onChange: (value: number) => void;
    isPercentage?: boolean;
  }) => {
    const error = getInputError(field);
    const hasError = Boolean(error);

    return (
      <div>
        <label className="block text-sm font-medium mb-1">
          {label}
        </label>
        <Input
          type={type}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className={hasError ? "border-red-500 focus:border-red-500" : ""}
        />
        {hasError && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}
      </div>
    );
  };

  const resetToDefaults = () => {
    setInputs({
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
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Feasibility Analysis Calculator</h1>
          <p className="text-gray-600 mt-1">Comprehensive biogas plant feasibility assessment and ROI modeling</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetToDefaults}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Share className="h-4 w-4 mr-2" />
            Share Analysis
          </Button>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold mb-2">Please fix the following issues:</div>
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Parameters */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              Feasibility Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InputField
              label="Cattle Count"
              field="cattleCount"
              value={inputs.cattleCount}
              onChange={(value) => handleInputChange('cattleCount', value)}
            />

            <InputField
              label="Avg Dung per Cattle (kg/day)"
              field="avgDungPerCattle"
              step="0.1"
              value={inputs.avgDungPerCattle}
              onChange={(value) => handleInputChange('avgDungPerCattle', value)}
            />

            <InputField
              label="Methane Potential (m³ CH₄/kg)"
              field="methanePotential"
              step="0.01"
              value={inputs.methanePotential}
              onChange={(value) => handleInputChange('methanePotential', value)}
            />

            <InputField
              label="Plant Efficiency (%)"
              field="plantEfficiency"
              step="0.01"
              value={inputs.plantEfficiency * 100}
              onChange={(value) => handleInputChange('plantEfficiency', value / 100)}
              isPercentage={true}
            />

            <div>
              <label className="block text-sm font-medium mb-1">
                Biogas Selling Price (₹/m³)
              </label>
              <Input
                type="number"
                value={inputs.sellingPrice}
                onChange={(e) => handleInputChange('sellingPrice', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Carbon Credit Price (₹/tonne)
              </label>
              <Input
                type="number"
                value={inputs.carbonCreditPrice}
                onChange={(e) => handleInputChange('carbonCreditPrice', parseFloat(e.target.value) || 0)}
              />
            </div>

            <InputField
              label="Construction Cost (₹)"
              field="constructionCost"
              value={inputs.constructionCost}
              onChange={(value) => handleInputChange('constructionCost', value)}
            />

            <InputField
              label="Operating Cost Ratio (%)"
              field="operatingCostRatio"
              step="0.01"
              value={inputs.operatingCostRatio * 100}
              onChange={(value) => handleInputChange('operatingCostRatio', value / 100)}
              isPercentage={true}
            />

            <InputField
              label="Subsidy Percentage (%)"
              field="subsidyPercentage"
              value={inputs.subsidyPercentage}
              onChange={(value) => handleInputChange('subsidyPercentage', value)}
              isPercentage={true}
            />

            <InputField
              label="Discount Rate (%)"
              field="discountRate"
              step="0.1"
              value={inputs.discountRate}
              onChange={(value) => handleInputChange('discountRate', value)}
              isPercentage={true}
            />
          </CardContent>
        </Card>

        {/* Results Dashboard */}
        <div className="lg:col-span-2 space-y-6">
          {isCalculating && (
            <Alert>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Calculating feasibility metrics...
              </AlertDescription>
            </Alert>
          )}

          {feasibilityResults && (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {feasibilityResults.production.annualBiogas.toLocaleString()} m³
                    </div>
                    <p className="text-sm text-muted-foreground">Annual Biogas Production</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      ₹{(feasibilityResults.revenue.total / 10000000).toFixed(1)}Cr
                    </div>
                    <p className="text-sm text-muted-foreground">Annual Revenue</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {feasibilityResults.metrics.paybackPeriod.toFixed(1)} years
                    </div>
                    <p className="text-sm text-muted-foreground">Payback Period</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      <Badge variant={feasibilityResults.metrics.npv > 0 ? "default" : "destructive"}>
                        {feasibilityResults.metrics.profitability}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      NPV: ₹{(feasibilityResults.metrics.npv / 10000000).toFixed(1)}Cr
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
                  <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
                  <TabsTrigger value="sensitivity">Sensitivity</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Revenue Breakdown */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Revenue Breakdown</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Biogas Sales', value: feasibilityResults.revenue.biogas, color: '#4CAF50' },
                                { name: 'Carbon Credits', value: feasibilityResults.revenue.carbonCredits, color: '#2196F3' }
                              ]}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              <Cell fill="#4CAF50" />
                              <Cell fill="#2196F3" />
                            </Pie>
                            <Tooltip formatter={(value) => `₹${(value as number / 100000).toFixed(1)}L`} />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* Financial Metrics */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Financial Metrics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Total Investment</span>
                          <span className="font-medium">₹{(feasibilityResults.investment.total / 10000000).toFixed(1)}Cr</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Government Subsidy</span>
                          <span className="font-medium text-green-600">₹{(feasibilityResults.investment.subsidy / 10000000).toFixed(1)}Cr</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Net Investment</span>
                          <span className="font-medium">₹{(feasibilityResults.investment.net / 10000000).toFixed(1)}Cr</span>
                        </div>
                        <hr />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Annual Net Cash Flow</span>
                          <span className="font-medium text-green-600">₹{(feasibilityResults.costs.netCashFlow / 10000000).toFixed(1)}Cr</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Internal Rate of Return</span>
                          <span className="font-medium">{feasibilityResults.metrics.irr.toFixed(1)}%</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="scenarios" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Scenario Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={scenarioAnalysis}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="npv" fill="#4CAF50" name="NPV (₹Cr)" />
                          <Bar dataKey="irr" fill="#2196F3" name="IRR (%)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="breakdown" className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Detailed cost and revenue breakdown analysis coming soon.
                    </AlertDescription>
                  </Alert>
                </TabsContent>

                <TabsContent value="sensitivity" className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Sensitivity analysis for key variables coming soon.
                    </AlertDescription>
                  </Alert>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FeasibilityAnalysisPage() {
  return (
    <CalculationErrorBoundary>
      <FeasibilityAnalysisPageContent />
    </CalculationErrorBoundary>
  );
}