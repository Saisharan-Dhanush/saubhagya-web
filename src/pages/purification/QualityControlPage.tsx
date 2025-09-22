import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import {
  Beaker,
  FileCheck,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Download,
  Upload,
  Calendar,
  Clock,
  Award
} from 'lucide-react';

interface QualityStandards {
  bis16087: {
    methaneMin: number;
    h2sMax: number;
    moistureMax: number;
    calorificValueMin: number;
  };
  pesoSafety: {
    pressureMax: number;
    temperatureMax: number;
    leakageMax: number;
  };
}

interface TestResults {
  batchId: string;
  testDate: string;
  methane: number;
  h2s: number;
  moisture: number;
  calorificValue: number;
  pressure: number;
  temperature: number;
  leakage: number;
  overallGrade: 'A' | 'B' | 'C' | 'F';
}

interface ComplianceCheck {
  bis16087: {
    compliant: boolean;
    checks: {
      methaneContent: boolean;
      h2sContent: boolean;
      moistureContent: boolean;
      calorificValue: boolean;
    };
  };
  peso: {
    compliant: boolean;
    checks: {
      pressureSafety: boolean;
      temperatureSafety: boolean;
      leakageSafety: boolean;
    };
  };
  overallCompliant: boolean;
}

interface QualityCertificate {
  certificateId: string;
  batchId: string;
  testDate: string;
  testResults: TestResults;
  compliance: ComplianceCheck;
  certifiedBy: string;
  validUntil: string;
  standards: string[];
  laboratoryAccreditation: string;
  blockchainHash?: string;
  verificationUrl?: string;
}

const QualityControlPage: React.FC = () => {
  const [currentBatch, setCurrentBatch] = useState<string>('BATCH-2024-001');
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [compliance, setCompliance] = useState<ComplianceCheck | null>(null);
  const [certificate, setCertificate] = useState<QualityCertificate | null>(null);
  const [isTestingInProgress, setIsTestingInProgress] = useState(false);
  const [qualityTrends, setQualityTrends] = useState<TestResults[]>([]);

  const qualityStandards: QualityStandards = {
    bis16087: {
      methaneMin: 90, // % CH₄
      h2sMax: 10,     // ppm
      moistureMax: 0.1, // %
      calorificValueMin: 8500 // kcal/m³
    },
    pesoSafety: {
      pressureMax: 2.5,    // bar
      temperatureMax: 60,   // °C
      leakageMax: 0.1      // % volume
    }
  };

  // Generate mock data for demonstration
  useEffect(() => {
    const mockTestResults: TestResults = {
      batchId: currentBatch,
      testDate: new Date().toISOString(),
      methane: 92.5 + Math.random() * 3,
      h2s: 3 + Math.random() * 5,
      moisture: 0.05 + Math.random() * 0.08,
      calorificValue: 8600 + Math.random() * 200,
      pressure: 1.8 + Math.random() * 0.4,
      temperature: 45 + Math.random() * 10,
      leakage: 0.02 + Math.random() * 0.05,
      overallGrade: 'A'
    };

    setTestResults(mockTestResults);

    const mockCompliance = validateCompliance(mockTestResults);
    setCompliance(mockCompliance);

    // Generate quality trends
    const trends = Array.from({ length: 30 }, (_, i) => ({
      batchId: `BATCH-2024-${String(i + 1).padStart(3, '0')}`,
      testDate: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
      methane: 91 + Math.random() * 4,
      h2s: 2 + Math.random() * 6,
      moisture: 0.03 + Math.random() * 0.1,
      calorificValue: 8500 + Math.random() * 300,
      pressure: 1.5 + Math.random() * 0.8,
      temperature: 40 + Math.random() * 15,
      leakage: 0.01 + Math.random() * 0.08,
      overallGrade: Math.random() > 0.2 ? 'A' : Math.random() > 0.5 ? 'B' : 'C'
    } as TestResults));

    setQualityTrends(trends);
  }, [currentBatch]);

  const validateCompliance = (results: TestResults): ComplianceCheck => {
    const bisCompliance = {
      methaneContent: results.methane >= qualityStandards.bis16087.methaneMin,
      h2sContent: results.h2s <= qualityStandards.bis16087.h2sMax,
      moistureContent: results.moisture <= qualityStandards.bis16087.moistureMax,
      calorificValue: results.calorificValue >= qualityStandards.bis16087.calorificValueMin
    };

    const pesoCompliance = {
      pressureSafety: results.pressure <= qualityStandards.pesoSafety.pressureMax,
      temperatureSafety: results.temperature <= qualityStandards.pesoSafety.temperatureMax,
      leakageSafety: results.leakage <= qualityStandards.pesoSafety.leakageMax
    };

    return {
      bis16087: {
        compliant: Object.values(bisCompliance).every(check => check),
        checks: bisCompliance
      },
      peso: {
        compliant: Object.values(pesoCompliance).every(check => check),
        checks: pesoCompliance
      },
      overallCompliant: Object.values(bisCompliance).every(check => check) &&
                       Object.values(pesoCompliance).every(check => check)
    };
  };

  const runQualityTest = async () => {
    setIsTestingInProgress(true);

    // Simulate testing process
    setTimeout(() => {
      const newTestResults: TestResults = {
        batchId: currentBatch,
        testDate: new Date().toISOString(),
        methane: 91 + Math.random() * 5,
        h2s: 2 + Math.random() * 8,
        moisture: 0.03 + Math.random() * 0.1,
        calorificValue: 8500 + Math.random() * 400,
        pressure: 1.5 + Math.random() * 1,
        temperature: 40 + Math.random() * 20,
        leakage: 0.01 + Math.random() * 0.1,
        overallGrade: Math.random() > 0.3 ? 'A' : Math.random() > 0.6 ? 'B' : 'C'
      };

      setTestResults(newTestResults);
      setCompliance(validateCompliance(newTestResults));
      setIsTestingInProgress(false);
    }, 3000);
  };

  const generateCertificate = () => {
    if (!testResults || !compliance) return;

    const cert: QualityCertificate = {
      certificateId: `QC-${currentBatch}-${Date.now()}`,
      batchId: currentBatch,
      testDate: testResults.testDate,
      testResults,
      compliance,
      certifiedBy: 'SAUBHAGYA Quality Control',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      standards: ['BIS 16087:2011', 'PESO Safety Requirements'],
      laboratoryAccreditation: 'NABL-123456',
      blockchainHash: `0x${Math.random().toString(16).substr(2, 8)}`,
      verificationUrl: `https://verify.saubhagya.com/${currentBatch}`
    };

    setCertificate(cert);
  };

  const ComplianceOverview: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileCheck className="h-5 w-5 mr-2" />
            BIS 16087:2011 Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Overall Status</span>
              <Badge variant={compliance?.bis16087.compliant ? "default" : "destructive"}>
                {compliance?.bis16087.compliant ? "COMPLIANT" : "NON-COMPLIANT"}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Methane Content (≥90%)</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{testResults?.methane.toFixed(1)}%</span>
                  {compliance?.bis16087.checks.methaneContent ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">H₂S Content (≤10 ppm)</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{testResults?.h2s.toFixed(1)} ppm</span>
                  {compliance?.bis16087.checks.h2sContent ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Moisture Content (≤0.1%)</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{(testResults?.moisture || 0).toFixed(3)}%</span>
                  {compliance?.bis16087.checks.moistureContent ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Calorific Value (≥8500 kcal/m³)</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{testResults?.calorificValue.toFixed(0)} kcal/m³</span>
                  {compliance?.bis16087.checks.calorificValue ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            PESO Safety Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Overall Status</span>
              <Badge variant={compliance?.peso.compliant ? "default" : "destructive"}>
                {compliance?.peso.compliant ? "COMPLIANT" : "NON-COMPLIANT"}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Pressure Safety (≤2.5 bar)</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{testResults?.pressure.toFixed(1)} bar</span>
                  {compliance?.peso.checks.pressureSafety ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Temperature Safety (≤60°C)</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{testResults?.temperature.toFixed(1)}°C</span>
                  {compliance?.peso.checks.temperatureSafety ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Leakage Safety (≤0.1%)</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{(testResults?.leakage || 0).toFixed(3)}%</span>
                  {compliance?.peso.checks.leakageSafety ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const QualityTrends: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Quality Trends (Last 30 Batches)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={qualityTrends.map(trend => ({
            batch: trend.batchId.split('-')[2],
            methane: trend.methane,
            h2s: trend.h2s,
            calorificValue: trend.calorificValue / 100, // Scale for visualization
            grade: trend.overallGrade === 'A' ? 100 : trend.overallGrade === 'B' ? 85 : trend.overallGrade === 'C' ? 70 : 50
          }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="batch" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="methane"
              stroke="#4CAF50"
              name="CH₄ (%)"
              strokeWidth={2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="h2s"
              stroke="#FF5722"
              name="H₂S (ppm)"
              strokeWidth={2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="calorificValue"
              stroke="#2196F3"
              name="Calorific Value (×100)"
              strokeWidth={2}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="grade"
              stroke="#9C27B0"
              name="Quality Grade"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const TestingPanel: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Beaker className="h-5 w-5 mr-2" />
          Quality Testing
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Batch ID</label>
              <Input
                value={currentBatch}
                onChange={(e) => setCurrentBatch(e.target.value)}
                placeholder="Enter batch ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Test Date</label>
              <Input
                type="datetime-local"
                defaultValue={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={runQualityTest}
                disabled={isTestingInProgress}
                className="w-full"
              >
                {isTestingInProgress ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Beaker className="h-4 w-4 mr-2" />
                    Run Quality Test
                  </>
                )}
              </Button>
            </div>
          </div>

          {testResults && (
            <div className="mt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {testResults.overallGrade}
                  </div>
                  <div className="text-sm text-gray-500">Overall Grade</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {testResults.methane.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-500">CH₄ Content</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {testResults.h2s.toFixed(1)} ppm
                  </div>
                  <div className="text-sm text-gray-500">H₂S Content</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {testResults.calorificValue.toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-500">kcal/m³</div>
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                <Button onClick={generateCertificate} variant="outline">
                  <Award className="h-4 w-4 mr-2" />
                  Generate Certificate
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Results
                </Button>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload to Blockchain
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const CertificatePanel: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Award className="h-5 w-5 mr-2" />
          Quality Certificate
        </CardTitle>
      </CardHeader>
      <CardContent>
        {certificate ? (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Certificate ID:</strong> {certificate.certificateId}
                </div>
                <div>
                  <strong>Batch ID:</strong> {certificate.batchId}
                </div>
                <div>
                  <strong>Test Date:</strong> {new Date(certificate.testDate).toLocaleString()}
                </div>
                <div>
                  <strong>Valid Until:</strong> {new Date(certificate.validUntil).toLocaleDateString()}
                </div>
                <div>
                  <strong>Certified By:</strong> {certificate.certifiedBy}
                </div>
                <div>
                  <strong>Accreditation:</strong> {certificate.laboratoryAccreditation}
                </div>
              </div>

              <div className="mt-4">
                <strong>Standards Compliance:</strong>
                <div className="flex space-x-2 mt-1">
                  {certificate.standards.map(standard => (
                    <Badge key={standard} variant="default">
                      {standard}
                    </Badge>
                  ))}
                </div>
              </div>

              {certificate.blockchainHash && (
                <div className="mt-4">
                  <strong>Blockchain Hash:</strong>
                  <code className="block mt-1 text-xs bg-gray-100 p-2 rounded">
                    {certificate.blockchainHash}
                  </code>
                </div>
              )}

              <div className="mt-4 flex space-x-2">
                <Button size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button size="sm" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Renewal
                </Button>
              </div>
            </div>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Certificate generated successfully. Blockchain verification available at:{' '}
                <a href={certificate.verificationUrl} className="text-blue-600 underline">
                  {certificate.verificationUrl}
                </a>
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="text-center py-8">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No certificate generated yet</p>
            <p className="text-sm text-gray-400">Run quality tests and generate certificate</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Quality Control & Compliance</h2>
        <Badge variant={compliance?.overallCompliant ? "default" : "destructive"}>
          {compliance?.overallCompliant ? "COMPLIANT" : "NON-COMPLIANT"}
        </Badge>
      </div>

      <Tabs defaultValue="testing" className="space-y-4">
        <TabsList>
          <TabsTrigger value="testing">Testing</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="trends">Quality Trends</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="testing" className="space-y-6">
          <TestingPanel />
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <ComplianceOverview />
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <QualityTrends />
        </TabsContent>

        <TabsContent value="certificates" className="space-y-6">
          <CertificatePanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QualityControlPage;