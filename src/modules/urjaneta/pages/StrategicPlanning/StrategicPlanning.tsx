import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const StrategicPlanning: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Strategic Planning</h1>
        <p className="text-muted-foreground">
          OKR tracking, initiative pipeline, and strategic project management
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active OKRs</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="mt-2">
              <Badge className="bg-green-500">On Track</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Goals</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <div className="mt-2">
              <Badge className="bg-green-500">+25%</Badge>
              <span className="text-xs text-muted-foreground ml-2">vs Q3</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <div className="mt-2">
              <Badge className="bg-yellow-500">Attention Needed</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <div className="mt-2">
              <Badge className="bg-purple-500">Excellent</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Strategic Initiatives Pipeline</CardTitle>
          <CardDescription>Current strategic projects and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Expand to 5 new clusters', progress: 75, status: 'on-track' },
              { name: 'Carbon credit certification', progress: 90, status: 'ahead' },
              { name: 'Digital transformation', progress: 45, status: 'at-risk' },
              { name: 'Supply chain optimization', progress: 60, status: 'on-track' }
            ].map((initiative, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">{initiative.name}</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full ${
                        initiative.status === 'ahead' ? 'bg-green-500' :
                        initiative.status === 'on-track' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${initiative.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className="font-bold">{initiative.progress}%</div>
                  <Badge className={`${
                    initiative.status === 'ahead' ? 'bg-green-500' :
                    initiative.status === 'on-track' ? 'bg-blue-500' : 'bg-yellow-500'
                  }`}>
                    {initiative.status === 'ahead' ? 'Ahead' :
                     initiative.status === 'on-track' ? 'On Track' : 'At Risk'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StrategicPlanning;
export { StrategicPlanning };