/**
 * Quality Control Page - SAUB-FE-003
 * Quality testing, PESO compliance, and certification management
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Award,
  AlertTriangle,
  FlaskConical,
  Gauge,
  Shield,
  Search,
  Download,
  Upload,
  Star,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { QualityTest, PurificationCycle } from '../../Purification.types';
import { QUALITY_GRADES, PESO_COMPLIANCE_LEVELS, DEFAULT_QUALITY_THRESHOLDS } from '../../Purification.config';
import { apiService } from '@/services/api';

interface QualityFormData {
  batchId: string;
  cycleId: string;
  testType: 'pre_treatment' | 'post_treatment' | 'final_quality';
  parameters: {
    ch4: number;
    co2: number;
    h2s: number;
    moisture: number;
    calificValue: number;
    density: number;
  };
  technician: string;
  labResults?: string;
}

export const QualityControl: React.FC = () => {
  const [qualityTests, setQualityTests] = useState<QualityTest[]>([]);
  const [pendingTests, setPendingTests] = useState<QualityTest[]>([]);
  const [selectedTest, setSelectedTest] = useState<QualityTest | null>(null);
  const [newTestForm, setNewTestForm] = useState<QualityFormData>({
    batchId: '',
    cycleId: '',
    testType: 'final_quality',
    parameters: {
      ch4: 0,
      co2: 0,
      h2s: 0,
      moisture: 0,
      calificValue: 0,
      density: 0
    },
    technician: 'CURRENT_USER'
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch quality tests from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiService.getQualityTests({ page: 0, size: 50 });
        if (response.success && response.data?.content) {
          const tests = response.data.content.map((test: any) => ({
            ...test,
            testDate: new Date(test.testDate || test.createdAt),
            parameters: {
              ch4: test.ch4Percentage || 0,
              co2: test.co2Percentage || 0,
              h2s: test.h2sLevel || 0,
              moisture: test.moistureContent || 0,
              calificValue: test.calorificValue || 0,
              density: test.density || 0
            },
            complianceStatus: test.passed ? 'pass' : (test.passed === false ? 'fail' : 'pending'),
            pesoRating: test.pesoGrade || 'Pending'
          }));

          setQualityTests(tests.filter((t: any) => t.complianceStatus !== 'pending'));
          setPendingTests(tests.filter((t: any) => t.complianceStatus === 'pending'));
        }
      } catch (error) {
        console.error('Failed to fetch quality tests:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const getComplianceLevel = (ch4Percentage: number) => {
    for (const level of PESO_COMPLIANCE_LEVELS) {
      if (ch4Percentage >= level.minCH4) {
        return level;
      }
    }
    return { level: 'Failed', minCH4: 0, requirements: [] };
  };

  const getGradeFromCH4 = (ch4: number): keyof typeof QUALITY_GRADES => {
    if (ch4 >= QUALITY_GRADES.A.minCH4) return 'A';
    if (ch4 >= QUALITY_GRADES.B.minCH4) return 'B';
    if (ch4 >= QUALITY_GRADES.C.minCH4) return 'C';
    return 'FAILED';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-100 text-green-800';
      case 'fail': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPesoColor = (rating: string) => {
    switch (rating) {
      case 'A+': return 'bg-purple-100 text-purple-800';
      case 'A': return 'bg-green-100 text-green-800';
      case 'B+': return 'bg-blue-100 text-blue-800';
      case 'B': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmitTest = async () => {
    try {
      // Match backend QualityTestRequest DTO structure
      const testData = {
        cycleId: newTestForm.cycleId, // String UUID, not integer
        ch4Percentage: newTestForm.parameters.ch4,
        co2Percentage: newTestForm.parameters.co2,
        h2sContentPpm: newTestForm.parameters.h2s,
        // Backend expects these optional fields:
        o2Percentage: 0, // Default value
        n2Percentage: 0, // Default value
        waterVaporPpm: newTestForm.parameters.moisture * 10000, // Convert moisture % to ppm approximation
        pressureBar: 0, // Not captured in form
        temperatureCelsius: 0, // Not captured in form
        technicianId: newTestForm.technician,
        notes: newTestForm.labResults
      };

      const response = await apiService.submitQualityTest(testData);
      if (response.success && response.data) {
        const compliance = getComplianceLevel(newTestForm.parameters.ch4);
        const newTest: QualityTest = {
          ...response.data,
          testDate: new Date(response.data.testDate || response.data.createdAt),
          parameters: newTestForm.parameters,
          complianceStatus: response.data.passed ? 'pass' : 'fail',
          pesoRating: compliance.level,
          certificationNumber: compliance.level !== 'Failed' ? `PESO-2024-${compliance.level}-${Date.now().toString().slice(-3)}` : undefined,
          labResults: newTestForm.labResults
        };

        setQualityTests(prev => [newTest, ...prev]);
        setPendingTests(prev => prev.filter(t => t.batchId !== newTestForm.batchId));

        // Reset form
        setNewTestForm({
          batchId: '',
          cycleId: '',
          testType: 'final_quality',
          parameters: {
            ch4: 0,
            co2: 0,
            h2s: 0,
            moisture: 0,
            calificValue: 0,
            density: 0
          },
          technician: 'CURRENT_USER'
        });
      }
    } catch (error) {
      console.error('Failed to submit quality test:', error);
    }
  };

  const filteredTests = qualityTests.filter(test =>
    test.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.pesoRating.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.technician.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getQualityTrend = () => {
    const recent = qualityTests.slice(0, 5);
    const avgCH4 = recent.reduce((sum, test) => sum + test.parameters.ch4, 0) / recent.length;
    const passRate = (recent.filter(test => test.complianceStatus === 'pass').length / recent.length) * 100;
    return { avgCH4: avgCH4.toFixed(1), passRate: passRate.toFixed(1) };
  };

  const trend = getQualityTrend();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quality Control</h1>
          <p className="text-gray-600 mt-1">Testing, compliance, and certification management</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Reports
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <FlaskConical className="w-4 h-4 mr-2" />
            New Test
          </Button>
        </div>
      </div>

      {/* Quality Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg CH₄ Quality</p>
                <p className="text-2xl font-bold text-green-600">{trend.avgCH4}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pass Rate</p>
                <p className="text-2xl font-bold text-blue-600">{trend.passRate}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Tests</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingTests.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Certificates</p>
                <p className="text-2xl font-bold text-purple-600">
                  {qualityTests.filter(t => t.certificationNumber).length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tests" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tests">Test Results ({qualityTests.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingTests.length})</TabsTrigger>
          <TabsTrigger value="new">New Test</TabsTrigger>
          <TabsTrigger value="compliance">PESO Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by batch ID, rating, or technician..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Filter by Date
            </Button>
          </div>

          {/* Test Results */}
          <div className="space-y-4">
            {filteredTests.map((test) => (
              <Card key={test.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{test.batchId}</h3>
                      <p className="text-sm text-gray-600">
                        Tested on {test.testDate.toLocaleDateString()} by {test.technician}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(test.complianceStatus)}>
                        {test.complianceStatus}
                      </Badge>
                      <Badge className={getPesoColor(test.pesoRating)}>
                        PESO {test.pesoRating}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-600">CH₄</span>
                      <p className="text-lg font-bold text-green-600">{test.parameters.ch4}%</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">CO₂</span>
                      <p className="text-lg font-bold">{test.parameters.co2}%</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">H₂S</span>
                      <p className="text-lg font-bold">{test.parameters.h2s} ppm</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Moisture</span>
                      <p className="text-lg font-bold">{test.parameters.moisture}%</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Calorific</span>
                      <p className="text-lg font-bold">{test.parameters.calificValue} kJ/m³</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Density</span>
                      <p className="text-lg font-bold">{test.parameters.density} kg/m³</p>
                    </div>
                  </div>

                  {test.certificationNumber && (
                    <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center">
                        <Shield className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-green-800">
                          Certificate: {test.certificationNumber}
                        </span>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  )}

                  {test.labResults && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        <strong>Lab Results:</strong> {test.labResults}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-yellow-600" />
                Pending Quality Tests
              </CardTitle>
              <CardDescription>
                Tests awaiting completion or results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingTests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between border rounded-lg p-4">
                    <div>
                      <h4 className="font-medium">{test.batchId}</h4>
                      <p className="text-sm text-gray-600">
                        {test.testType.replace('_', ' ')} - Assigned to {test.technician}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Pending
                      </Badge>
                      <Button size="sm" variant="outline">
                        Start Test
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FlaskConical className="w-5 h-5 mr-2 text-blue-600" />
                New Quality Test
              </CardTitle>
              <CardDescription>
                Perform quality testing and compliance verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Test Information */}
                <div className="space-y-4">
                  <h3 className="font-medium">Test Information</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="batchId">Batch ID</Label>
                      <Input
                        id="batchId"
                        value={newTestForm.batchId}
                        onChange={(e) => setNewTestForm(prev => ({
                          ...prev,
                          batchId: e.target.value
                        }))}
                        placeholder="Enter batch ID"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cycleId">Cycle ID</Label>
                      <Input
                        id="cycleId"
                        value={newTestForm.cycleId}
                        onChange={(e) => setNewTestForm(prev => ({
                          ...prev,
                          cycleId: e.target.value
                        }))}
                        placeholder="Enter cycle ID"
                      />
                    </div>
                    <div>
                      <Label htmlFor="testType">Test Type</Label>
                      <select
                        id="testType"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={newTestForm.testType}
                        onChange={(e) => setNewTestForm(prev => ({
                          ...prev,
                          testType: e.target.value as any
                        }))}
                      >
                        <option value="pre_treatment">Pre-Treatment</option>
                        <option value="post_treatment">Post-Treatment</option>
                        <option value="final_quality">Final Quality</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="technician">Technician</Label>
                      <Input
                        id="technician"
                        value={newTestForm.technician}
                        onChange={(e) => setNewTestForm(prev => ({
                          ...prev,
                          technician: e.target.value
                        }))}
                        placeholder="Technician ID"
                      />
                    </div>
                  </div>
                </div>

                {/* Test Parameters */}
                <div className="space-y-4">
                  <h3 className="font-medium">Test Parameters</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="ch4">CH₄ Percentage (%)</Label>
                      <Input
                        id="ch4"
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={newTestForm.parameters.ch4}
                        onChange={(e) => setNewTestForm(prev => ({
                          ...prev,
                          parameters: {
                            ...prev.parameters,
                            ch4: parseFloat(e.target.value) || 0
                          }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="co2">CO₂ Percentage (%)</Label>
                      <Input
                        id="co2"
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={newTestForm.parameters.co2}
                        onChange={(e) => setNewTestForm(prev => ({
                          ...prev,
                          parameters: {
                            ...prev.parameters,
                            co2: parseFloat(e.target.value) || 0
                          }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="h2s">H₂S Level (ppm)</Label>
                      <Input
                        id="h2s"
                        type="number"
                        step="0.1"
                        min="0"
                        value={newTestForm.parameters.h2s}
                        onChange={(e) => setNewTestForm(prev => ({
                          ...prev,
                          parameters: {
                            ...prev.parameters,
                            h2s: parseFloat(e.target.value) || 0
                          }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="moisture">Moisture Content (%)</Label>
                      <Input
                        id="moisture"
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={newTestForm.parameters.moisture}
                        onChange={(e) => setNewTestForm(prev => ({
                          ...prev,
                          parameters: {
                            ...prev.parameters,
                            moisture: parseFloat(e.target.value) || 0
                          }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="calorific">Calorific Value (kJ/m³)</Label>
                      <Input
                        id="calorific"
                        type="number"
                        step="10"
                        min="0"
                        value={newTestForm.parameters.calificValue}
                        onChange={(e) => setNewTestForm(prev => ({
                          ...prev,
                          parameters: {
                            ...prev.parameters,
                            calificValue: parseFloat(e.target.value) || 0
                          }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="density">Density (kg/m³)</Label>
                      <Input
                        id="density"
                        type="number"
                        step="0.01"
                        min="0"
                        value={newTestForm.parameters.density}
                        onChange={(e) => setNewTestForm(prev => ({
                          ...prev,
                          parameters: {
                            ...prev.parameters,
                            density: parseFloat(e.target.value) || 0
                          }
                        }))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Predicted Compliance */}
              {newTestForm.parameters.ch4 > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Award className="w-4 h-4 mr-2 text-blue-600" />
                    Predicted PESO Compliance
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Expected Grade:</p>
                      <Badge className={`bg-${QUALITY_GRADES[getGradeFromCH4(newTestForm.parameters.ch4)]?.color}-100 text-${QUALITY_GRADES[getGradeFromCH4(newTestForm.parameters.ch4)]?.color}-800`}>
                        Grade {getGradeFromCH4(newTestForm.parameters.ch4)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">PESO Level:</p>
                      <Badge className={getPesoColor(getComplianceLevel(newTestForm.parameters.ch4).level)}>
                        {getComplianceLevel(newTestForm.parameters.ch4).level}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="labResults">Lab Results (Optional)</Label>
                <Textarea
                  id="labResults"
                  placeholder="Enter detailed lab results and observations..."
                  value={newTestForm.labResults || ''}
                  onChange={(e) => setNewTestForm(prev => ({
                    ...prev,
                    labResults: e.target.value
                  }))}
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline">
                  Save as Draft
                </Button>
                <Button
                  onClick={handleSubmitTest}
                  disabled={!newTestForm.batchId || !newTestForm.parameters.ch4}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Submit Test
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2 text-purple-600" />
                PESO Compliance Standards
              </CardTitle>
              <CardDescription>
                Current compliance levels and requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {PESO_COMPLIANCE_LEVELS.map((level) => (
                  <div key={level.level} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge className={getPesoColor(level.level)}>
                          PESO {level.level}
                        </Badge>
                        <Star className="w-4 h-4 text-yellow-500" />
                      </div>
                      <span className="text-sm text-gray-600">
                        Min CH₄: {level.minCH4}%
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Requirements:</p>
                      <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                        {level.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};