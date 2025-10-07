import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf } from 'lucide-react';

const CarbonDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Carbon & ESG Dashboard</h1>
        <p className="text-muted-foreground">
          Carbon credits, CO2 offset calculations, and ESG metrics
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            Carbon Impact
          </CardTitle>
          <CardDescription>Environmental impact and carbon credit tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Leaf className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Carbon Dashboard Coming Soon</p>
            <Badge className="mt-2">Under Development</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarbonDashboard;
export { CarbonDashboard };