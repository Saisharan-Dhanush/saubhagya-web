import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  Settings,
  Zap,
  Droplets,
  TrendingUp,
  Target,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  Lightbulb,
  Gauge,
  Thermometer,
  Wind
} from 'lucide-react';

interface OptimizationParameters {
  scrubberPressure: number;
  waterFlowRate: number;
  temperature: number;
  recirculationRate: number;
  pumpSpeed: number;
  ventilationRate: number;
}

interface PerformanceMetrics {
  efficiency: number;
  energyConsumption: number;
  waterConsumption: number;
  throughput: number;
  qualityScore: number;
  costPerUnit: number;
}

interface OptimizationRecommendation {
  parameter: keyof OptimizationParameters;
  currentValue: number;
  recommendedValue: number;
  expectedImprovement: number;
  confidence: number;
  reason: string;
}

const ProcessOptimizationPage: React.FC = () => {
  const [parameters, setParameters] = useState<OptimizationParameters>({
    scrubberPressure: 2.0,
    waterFlowRate: 150,
    temperature: 45,
    recirculationRate: 80,
    pumpSpeed: 75,
    ventilationRate: 60
  });

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    efficiency: 87,
    energyConsumption: 145,
    waterConsumption: 120,
    throughput: 950,
    qualityScore: 92,
    costPerUnit: 0.85
  });

  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationMode, setOptimizationMode] = useState<'manual' | 'auto'>('manual');
  const [historicalData, setHistoricalData] = useState<any[]>([]);

  // Generate historical performance data
  useEffect(() => {
    const historical = Array.from({ length: 24 }, (_, i) => ({
      hour: `${23 - i}h ago`,
      efficiency: 85 + Math.random() * 10,
      energy: 140 + Math.random() * 20,
      water: 115 + Math.random() * 15,
      throughput: 900 + Math.random() * 100,
      cost: 0.8 + Math.random() * 0.2
    }));
    setHistoricalData(historical.reverse());
  }, []);

  // Calculate metrics based on parameters
  useEffect(() => {
    const calculateMetrics = () => {
      // Simplified optimization algorithm
      const baseEfficiency = 85;
      const pressureEffect = (parameters.scrubberPressure - 1.5) * 5;
      const temperatureEffect = Math.max(0, 55 - parameters.temperature) * 0.3;
      const flowEffect = (parameters.waterFlowRate - 100) * 0.05;

      const efficiency = Math.min(95, Math.max(70,
        baseEfficiency + pressureEffect + temperatureEffect + flowEffect
      ));

      const energyBase = 150;
      const energyConsumption = energyBase * (parameters.pumpSpeed / 100) *
        (parameters.ventilationRate / 100) * 1.2;

      const waterConsumption = parameters.waterFlowRate *
        (1 - parameters.recirculationRate / 100) * 0.8;

      const throughput = efficiency * 10 + parameters.waterFlowRate * 2;

      const qualityScore = Math.min(100, efficiency +
        (parameters.temperature < 50 ? 5 : 0) +
        (parameters.scrubberPressure > 1.8 ? 3 : 0)
      );

      const costPerUnit = (energyConsumption * 0.1 + waterConsumption * 0.05) / throughput;

      setMetrics({
        efficiency: Math.round(efficiency * 10) / 10,
        energyConsumption: Math.round(energyConsumption),
        waterConsumption: Math.round(waterConsumption),
        throughput: Math.round(throughput),
        qualityScore: Math.round(qualityScore * 10) / 10,
        costPerUnit: Math.round(costPerUnit * 1000) / 1000
      });
    };

    calculateMetrics();
  }, [parameters]);

  // Generate optimization recommendations
  useEffect(() => {
    const generateRecommendations = () => {
      const recs: OptimizationRecommendation[] = [];

      // Pressure optimization
      if (parameters.scrubberPressure < 1.8) {
        recs.push({
          parameter: 'scrubberPressure',
          currentValue: parameters.scrubberPressure,
          recommendedValue: 2.1,
          expectedImprovement: 3.2,
          confidence: 92,
          reason: 'Increasing pressure will improve gas-water contact efficiency'
        });
      }

      // Temperature optimization
      if (parameters.temperature > 50) {
        recs.push({
          parameter: 'temperature',
          currentValue: parameters.temperature,
          recommendedValue: 47,
          expectedImprovement: 2.1,
          confidence: 88,
          reason: 'Lower temperature improves CO₂ absorption while reducing energy costs'
        });
      }

      // Water flow optimization
      if (parameters.waterFlowRate > 180) {
        recs.push({
          parameter: 'waterFlowRate',
          currentValue: parameters.waterFlowRate,
          recommendedValue: 165,
          expectedImprovement: 1.8,
          confidence: 85,
          reason: 'Reducing water flow will maintain efficiency while saving water'
        });
      }

      // Recirculation optimization
      if (parameters.recirculationRate < 85) {
        recs.push({
          parameter: 'recirculationRate',
          currentValue: parameters.recirculationRate,
          recommendedValue: 90,
          expectedImprovement: 2.5,
          confidence: 91,
          reason: 'Higher recirculation reduces fresh water consumption'
        });
      }

      setRecommendations(recs);
    };

    generateRecommendations();
  }, [parameters]);

  const applyOptimization = () => {
    setIsOptimizing(true);

    // Simulate optimization process
    setTimeout(() => {
      if (recommendations.length > 0) {
        const newParams = { ...parameters };
        recommendations.forEach(rec => {
          newParams[rec.parameter] = rec.recommendedValue;
        });
        setParameters(newParams);
      }
      setIsOptimizing(false);
    }, 2000);
  };

  const resetParameters = () => {
    setParameters({
      scrubberPressure: 2.0,
      waterFlowRate: 150,
      temperature: 45,
      recirculationRate: 80,
      pumpSpeed: 75,
      ventilationRate: 60
    });
  };

  const ParameterControls: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Process Parameters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <Gauge className="h-4 w-4 mr-2" />
              Scrubber Pressure: {parameters.scrubberPressure} bar
            </label>
            <Slider
              value={[parameters.scrubberPressure]}
              onValueChange={(value) => setParameters(prev => ({ ...prev, scrubberPressure: value[0] }))}
              min={1.0}
              max={2.5}
              step={0.1}
              className="w-full"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <Droplets className="h-4 w-4 mr-2" />
              Water Flow Rate: {parameters.waterFlowRate} L/min
            </label>
            <Slider
              value={[parameters.waterFlowRate]}
              onValueChange={(value) => setParameters(prev => ({ ...prev, waterFlowRate: value[0] }))}
              min={100}
              max={250}
              step={5}
              className="w-full"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <Thermometer className="h-4 w-4 mr-2" />
              Temperature: {parameters.temperature}°C
            </label>
            <Slider
              value={[parameters.temperature]}
              onValueChange={(value) => setParameters(prev => ({ ...prev, temperature: value[0] }))}
              min={30}
              max={70}
              step={1}
              className="w-full"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <RotateCcw className="h-4 w-4 mr-2" />
              Recirculation Rate: {parameters.recirculationRate}%
            </label>
            <Slider
              value={[parameters.recirculationRate]}
              onValueChange={(value) => setParameters(prev => ({ ...prev, recirculationRate: value[0] }))}
              min={50}
              max={95}
              step={5}
              className="w-full"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <Zap className="h-4 w-4 mr-2" />
              Pump Speed: {parameters.pumpSpeed}%
            </label>
            <Slider
              value={[parameters.pumpSpeed]}
              onValueChange={(value) => setParameters(prev => ({ ...prev, pumpSpeed: value[0] }))}
              min={50}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <Wind className="h-4 w-4 mr-2" />
              Ventilation Rate: {parameters.ventilationRate}%
            </label>
            <Slider
              value={[parameters.ventilationRate]}
              onValueChange={(value) => setParameters(prev => ({ ...prev, ventilationRate: value[0] }))}
              min={40}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          <div className="flex space-x-2">
            <Button onClick={applyOptimization} disabled={isOptimizing}>
              {isOptimizing ? (
                <PauseCircle className="h-4 w-4 mr-2" />
              ) : (
                <PlayCircle className="h-4 w-4 mr-2" />
              )}
              {isOptimizing ? 'Optimizing...' : 'Apply Optimization'}
            </Button>
            <Button variant="outline" onClick={resetParameters}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const PerformanceMetrics: React.FC = () => (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {metrics.efficiency}%
            </div>
            <p className="text-sm text-muted-foreground">Process Efficiency</p>
            <Badge variant={metrics.efficiency > 90 ? "default" : metrics.efficiency > 80 ? "secondary" : "destructive"}>
              {metrics.efficiency > 90 ? "Excellent" : metrics.efficiency > 80 ? "Good" : "Needs Improvement"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {metrics.energyConsumption} kW
            </div>
            <p className="text-sm text-muted-foreground">Energy Consumption</p>
            <Badge variant={metrics.energyConsumption < 150 ? "default" : "secondary"}>
              {metrics.energyConsumption < 150 ? "Efficient" : "High"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {metrics.waterConsumption} L/h
            </div>
            <p className="text-sm text-muted-foreground">Water Consumption</p>
            <Badge variant={metrics.waterConsumption < 130 ? "default" : "secondary"}>
              {metrics.waterConsumption < 130 ? "Efficient" : "High"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {metrics.throughput} m³/h
            </div>
            <p className="text-sm text-muted-foreground">Throughput</p>
            <Badge variant="default">Active</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">
              {metrics.qualityScore}
            </div>
            <p className="text-sm text-muted-foreground">Quality Score</p>
            <Badge variant={metrics.qualityScore > 90 ? "default" : "secondary"}>
              {metrics.qualityScore > 90 ? "Excellent" : "Good"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">
              ₹{metrics.costPerUnit}
            </div>
            <p className="text-sm text-muted-foreground">Cost per m³</p>
            <Badge variant={metrics.costPerUnit < 1.0 ? "default" : "secondary"}>
              {metrics.costPerUnit < 1.0 ? "Efficient" : "High"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const OptimizationRecommendations: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="h-5 w-5 mr-2" />
          Optimization Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <Alert key={index}>
                <Target className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex justify-between items-start">
                    <div>
                      <strong>{rec.parameter.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</strong>
                      <p className="text-sm mt-1">{rec.reason}</p>
                      <div className="text-xs text-gray-500 mt-2">
                        Current: {rec.currentValue} → Recommended: {rec.recommendedValue}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">
                        +{rec.expectedImprovement}% improvement
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1">
                        {rec.confidence}% confidence
                      </div>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-green-600 font-medium">System is optimally configured</p>
            <p className="text-sm text-gray-500">No recommendations at this time</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const PerformanceTrends: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Performance Trends (Last 24 Hours)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="efficiency"
              stroke="#4CAF50"
              name="Efficiency (%)"
              strokeWidth={2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="energy"
              stroke="#FF9800"
              name="Energy (kW)"
              strokeWidth={2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="water"
              stroke="#2196F3"
              name="Water (L/h)"
              strokeWidth={2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="throughput"
              stroke="#9C27B0"
              name="Throughput (m³/h)"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const EfficiencyRadar: React.FC = () => {
    const radarData = [
      { subject: 'Process Efficiency', current: metrics.efficiency, optimal: 95 },
      { subject: 'Energy Efficiency', current: 100 - (metrics.energyConsumption / 200 * 100), optimal: 90 },
      { subject: 'Water Efficiency', current: 100 - (metrics.waterConsumption / 200 * 100), optimal: 85 },
      { subject: 'Throughput', current: metrics.throughput / 12, optimal: 90 },
      { subject: 'Quality Score', current: metrics.qualityScore, optimal: 95 },
      { subject: 'Cost Efficiency', current: 100 - (metrics.costPerUnit * 100), optimal: 85 },
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Radar</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="Current"
                dataKey="current"
                stroke="#2196F3"
                fill="#2196F3"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Radar
                name="Optimal"
                dataKey="optimal"
                stroke="#4CAF50"
                fill="#4CAF50"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Process Optimization</h2>
        <div className="flex items-center space-x-2">
          <Badge variant={optimizationMode === 'auto' ? "default" : "outline"}>
            {optimizationMode === 'auto' ? 'Auto Mode' : 'Manual Mode'}
          </Badge>
          <Button
            variant="outline"
            onClick={() => setOptimizationMode(prev => prev === 'auto' ? 'manual' : 'auto')}
          >
            Switch to {optimizationMode === 'auto' ? 'Manual' : 'Auto'}
          </Button>
        </div>
      </div>

      <PerformanceMetrics />

      <Tabs defaultValue="parameters" className="space-y-4">
        <TabsList>
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="parameters" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ParameterControls />
            <EfficiencyRadar />
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <OptimizationRecommendations />
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <PerformanceTrends />
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Energy Consumption Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="energy"
                      stroke="#FF9800"
                      fill="#FF9800"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Water Usage Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="water"
                      stroke="#2196F3"
                      fill="#2196F3"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProcessOptimizationPage;