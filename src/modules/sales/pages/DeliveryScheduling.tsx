import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Truck, MapPin, Clock, Route, Package } from 'lucide-react';

const DeliveryScheduling: React.FC = () => {
  const mockDeliveries = [
    { id: '1', order: 'ORD-2024-001', customer: 'Green Energy Industries', date: '2024-09-25', status: 'scheduled', driver: 'Rajesh Kumar' },
    { id: '2', order: 'ORD-2024-002', customer: 'Sunrise Hotels', date: '2024-09-26', status: 'in_transit', driver: 'Suresh Yadav' },
    { id: '3', order: 'ORD-2024-003', customer: 'Emerald Heights', date: '2024-09-27', status: 'delivered', driver: 'Amit Sharma' }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      in_transit: 'bg-yellow-100 text-yellow-800',
      delivered: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Delivery Scheduling</h1>
          <p className="text-gray-600">Schedule and track deliveries with route optimization</p>
        </div>
        <Button>
          <Truck className="w-4 h-4 mr-2" />
          Schedule Delivery
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card><CardContent className="p-6">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-6">
          <div className="flex items-center">
            <Truck className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Transit</p>
              <p className="text-2xl font-bold">5</p>
            </div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-6">
          <div className="flex items-center">
            <Route className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-2xl font-bold">28</p>
            </div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">On Time %</p>
              <p className="text-2xl font-bold">96%</p>
            </div>
          </div>
        </CardContent></Card>
      </div>

      {/* Delivery Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Delivery Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Interactive delivery calendar will be displayed here
          </div>
        </CardContent>
      </Card>

      {/* Active Deliveries */}
      <Card>
        <CardHeader>
          <CardTitle>Active Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockDeliveries.map((delivery) => (
              <div key={delivery.id} className="flex items-center justify-between p-4 border rounded">
                <div className="space-y-1">
                  <div className="font-medium">{delivery.order}</div>
                  <div className="text-sm text-gray-600">{delivery.customer}</div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Truck className="w-4 h-4 mr-1" />
                    {delivery.driver}
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-sm">{delivery.date}</div>
                  <Badge className={getStatusColor(delivery.status)}>{delivery.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Route Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Route className="w-5 h-5 mr-2" />
            Route Optimization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Route optimization and mapping interface will be displayed here
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryScheduling;