import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, DollarSign, Leaf, Download, Calendar, FileText, PieChart } from 'lucide-react';

const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Revenue & Carbon Reports</h1>
          <p className="text-muted-foreground">
            Comprehensive financial and environmental impact reporting
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Create Custom Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹8.2L</div>
            <div className="mt-2">
              <Badge className="bg-green-500">+15.3%</Badge>
              <span className="text-xs text-muted-foreground ml-2">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Credits</CardTitle>
            <Leaf className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145.5 tCO2e</div>
            <div className="mt-2">
              <Badge className="bg-green-500">+12.8%</Badge>
              <span className="text-xs text-muted-foreground ml-2">this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CBG Production</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,450 m³</div>
            <div className="mt-2">
              <Badge className="bg-blue-500">+8.4%</Badge>
              <span className="text-xs text-muted-foreground ml-2">monthly avg</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cluster Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89.2%</div>
            <div className="mt-2">
              <Badge className="bg-purple-500">+2.1%</Badge>
              <span className="text-xs text-muted-foreground ml-2">improvement</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Revenue Breakdown
            </CardTitle>
            <CardDescription>
              Monthly revenue by source and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <p className="font-medium">CBG Sales</p>
                  <p className="text-sm text-muted-foreground">Direct biogas sales to customers</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">₹6.8L</p>
                  <Badge className="bg-green-500">83% of total</Badge>
                </div>
              </div>
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Carbon Credits</p>
                  <p className="text-sm text-muted-foreground">CO2 offset certificates sold</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">₹1.2L</p>
                  <Badge className="bg-blue-500">15% of total</Badge>
                </div>
              </div>
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Organic Fertilizer</p>
                  <p className="text-sm text-muted-foreground">Slurry and compost sales</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">₹0.2L</p>
                  <Badge className="bg-purple-500">2% of total</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              Carbon Impact Summary
            </CardTitle>
            <CardDescription>
              Environmental impact and carbon credit calculations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-800">CO2 Offset</p>
                  <p className="text-xl font-bold text-green-900">145.5 tCO2e</p>
                  <p className="text-xs text-green-600">This month</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Credits Generated</p>
                  <p className="text-xl font-bold text-blue-900">145</p>
                  <p className="text-xs text-blue-600">Verified credits</p>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="font-medium mb-2">Carbon Credit Pricing</p>
                <div className="flex justify-between text-sm">
                  <span>Current Market Rate:</span>
                  <span className="font-bold">₹850/tCO2e</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Our Rate:</span>
                  <span className="font-bold text-green-600">₹825/tCO2e</span>
                </div>
                <div className="flex justify-between text-sm mt-2 pt-2 border-t">
                  <span>Total Value:</span>
                  <span className="font-bold text-lg">₹1,19,888</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cluster Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Mathura Cluster</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{width: '95%'}}></div>
                  </div>
                  <span className="text-sm font-medium">95%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Vrindavan Cluster</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{width: '92%'}}></div>
                  </div>
                  <span className="text-sm font-medium">92%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Goverdhan Cluster</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-yellow-500 rounded-full" style={{width: '87%'}}></div>
                  </div>
                  <span className="text-sm font-medium">87%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Monthly Financial
                </span>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <Leaf className="h-4 w-4" />
                  Carbon Credits
                </span>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Production Summary
                </span>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <PieChart className="h-4 w-4" />
                  Efficiency Analysis
                </span>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <p className="text-sm font-medium">Government Quarterly</p>
                <p className="text-xs text-muted-foreground">Due: 31st Jan 2024</p>
                <Badge className="bg-green-500 mt-2">Ready</Badge>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-sm font-medium">Environmental Impact</p>
                <p className="text-xs text-muted-foreground">Due: 15th Feb 2024</p>
                <Badge className="bg-yellow-500 mt-2">In Progress</Badge>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-sm font-medium">Carbon Verification</p>
                <p className="text-xs text-muted-foreground">Due: 28th Feb 2024</p>
                <Badge className="bg-blue-500 mt-2">Scheduled</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
export { Reports };