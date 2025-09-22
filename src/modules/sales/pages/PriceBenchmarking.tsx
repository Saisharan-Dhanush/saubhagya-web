import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, BarChart3, DollarSign, Target, Zap } from 'lucide-react';

const PriceBenchmarking: React.FC = () => {
  const mockPriceData = [
    { gasType: 'Biogas', ourPrice: 45, marketAvg: 48, change: -6.25, competitive: 'advantage' },
    { gasType: 'Compressed', ourPrice: 65, marketAvg: 62, change: 4.84, competitive: 'premium' },
    { gasType: 'Liquefied', ourPrice: 85, marketAvg: 83, change: 2.41, competitive: 'premium' }
  ];

  const getCompetitiveColor = (status: string) => {
    const colors = {
      advantage: 'bg-green-100 text-green-800',
      premium: 'bg-blue-100 text-blue-800',
      disadvantage: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Price Benchmarking</h1>
          <p className="text-gray-600">Market price analysis and dynamic pricing engine</p>
        </div>
        <Button>
          <Zap className="w-4 h-4 mr-2" />
          Update Prices
        </Button>
      </div>

      {/* Price Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockPriceData.map((item) => (
          <Card key={item.gasType}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{item.gasType}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Our Price</div>
                  <div className="text-xl font-bold">₹{item.ourPrice}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Market Avg</div>
                  <div className="text-xl font-bold">₹{item.marketAvg}</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  {item.change > 0 ? (
                    <TrendingUp className="w-4 h-4 text-red-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-green-600" />
                  )}
                  <span className={`text-sm ${item.change > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {Math.abs(item.change)}%
                  </span>
                </div>
                <Badge className={getCompetitiveColor(item.competitive)}>
                  {item.competitive}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Market Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Market Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Market price trends and competitor analysis will be displayed here
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Pricing Engine */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Dynamic Pricing Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Pricing Factors</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Raw Material Cost</span>
                  <span className="font-medium">₹15/unit</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Production Cost</span>
                  <span className="font-medium">₹8/unit</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Transport Cost</span>
                  <span className="font-medium">₹5/unit</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Margin (30%)</span>
                  <span className="font-medium">₹12/unit</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Taxes</span>
                  <span className="font-medium">₹5/unit</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Recommended Prices</h4>
              <div className="space-y-2">
                <div className="p-3 border rounded">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Biogas</span>
                    <span className="text-lg font-bold text-green-600">₹45/unit</span>
                  </div>
                  <div className="text-sm text-gray-600">Competitive advantage maintained</div>
                </div>
                <div className="p-3 border rounded">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Compressed</span>
                    <span className="text-lg font-bold text-blue-600">₹63/unit</span>
                  </div>
                  <div className="text-sm text-gray-600">Slight price reduction recommended</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PriceBenchmarking;