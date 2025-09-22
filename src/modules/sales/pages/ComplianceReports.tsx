import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, FileText, AlertTriangle, CheckCircle, Download, Calendar, BarChart3 } from 'lucide-react';

const ComplianceReports: React.FC = () => {
  const mockComplianceData = [
    { type: 'PESO', certificate: 'PESO-2024-001', status: 'valid', expiry: '2025-01-15', authority: 'PESO Delhi' },
    { type: 'GST', certificate: 'GST-REG-001', status: 'valid', expiry: '2025-03-31', authority: 'GST Department' },
    { type: 'Environmental', certificate: 'ENV-2024-001', status: 'pending_renewal', expiry: '2024-12-01', authority: 'Pollution Control Board' },
    { type: 'Safety', certificate: 'SAFETY-001', status: 'valid', expiry: '2025-06-15', authority: 'Factory Inspector' }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      valid: 'bg-green-100 text-green-800',
      pending_renewal: 'bg-yellow-100 text-yellow-800',
      expired: 'bg-red-100 text-red-800',
      suspended: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Compliance & Reports</h1>
          <p className="text-gray-600">PESO compliance, GST reports, and regulatory management</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card><CardContent className="p-6">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">PESO Valid</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-6">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold">1</p>
            </div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-6">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">GST Returns</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-6">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Compliance %</p>
              <p className="text-2xl font-bold">98%</p>
            </div>
          </div>
        </CardContent></Card>
      </div>

      <Tabs defaultValue="peso" className="w-full">
        <TabsList>
          <TabsTrigger value="peso">PESO Compliance</TabsTrigger>
          <TabsTrigger value="gst">GST Reports</TabsTrigger>
          <TabsTrigger value="environmental">Environmental</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
        </TabsList>

        <TabsContent value="peso" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                PESO Certificates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockComplianceData.filter(item => item.type === 'PESO').map((cert) => (
                  <div key={cert.certificate} className="flex items-center justify-between p-4 border rounded">
                    <div className="space-y-1">
                      <div className="font-medium">{cert.certificate}</div>
                      <div className="text-sm text-gray-600">Issued by: {cert.authority}</div>
                      <div className="text-sm text-gray-500">Expires: {cert.expiry}</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(cert.status)}>{cert.status}</Badge>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>PESO Inspection Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">Plant A - Tank Inspection</div>
                    <div className="text-sm text-gray-600">Next inspection due: 15 Nov 2024</div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">Plant B - Safety Audit</div>
                    <div className="text-sm text-gray-600">Next inspection due: 30 Dec 2024</div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gst" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>GST Returns & Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded">
                    <div className="text-center">
                      <div className="text-2xl font-bold">₹2.4M</div>
                      <div className="text-sm text-gray-600">Total GST Collected</div>
                    </div>
                  </div>
                  <div className="p-4 border rounded">
                    <div className="text-center">
                      <div className="text-2xl font-bold">₹450K</div>
                      <div className="text-sm text-gray-600">GST Paid</div>
                    </div>
                  </div>
                  <div className="p-4 border rounded">
                    <div className="text-center">
                      <div className="text-2xl font-bold">12</div>
                      <div className="text-sm text-gray-600">Returns Filed</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">GSTR-1 - September 2024</div>
                      <div className="text-sm text-gray-600">Filed on: 10 Oct 2024</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Filed</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">GSTR-3B - September 2024</div>
                      <div className="text-sm text-gray-600">Due: 20 Oct 2024</div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="environmental">
          <Card>
            <CardHeader>
              <CardTitle>Environmental Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Environmental compliance reports and certificates will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="safety">
          <Card>
            <CardHeader>
              <CardTitle>Safety Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Safety compliance reports and training records will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComplianceReports;