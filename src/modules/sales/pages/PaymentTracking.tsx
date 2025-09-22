import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, CreditCard, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { salesService } from '../services/salesService';
import { Payment } from '../types';

const PaymentTracking: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const response = await salesService.getPayments();
        if (response.success) {
          setPayments(response.data);
        }
      } catch (error) {
        console.error('Error loading payments:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPayments();
  }, []);

  const mockPayments = [
    { id: '1', amount: 50445, status: 'confirmed', method: 'bank_transfer', date: new Date(), customer: 'Green Energy Industries' },
    { id: '2', amount: 25000, status: 'pending', method: 'cheque', date: new Date(), customer: 'Sunrise Hotels' },
    { id: '3', amount: 75000, status: 'failed', method: 'upi', date: new Date(), customer: 'Emerald Heights' }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payment Tracking</h1>
          <p className="text-gray-600">Monitor payments and reconciliation</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card><CardContent className="p-6">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Received</p>
              <p className="text-2xl font-bold">₹2.4M</p>
            </div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold">₹150K</p>
            </div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-6">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold">₹75K</p>
            </div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Collection Rate</p>
              <p className="text-2xl font-bold">94%</p>
            </div>
          </div>
        </CardContent></Card>
      </div>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded">
                <div className="space-y-1">
                  <div className="font-medium">{payment.customer}</div>
                  <div className="text-sm text-gray-600">
                    {payment.method} • {payment.date.toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="font-semibold">₹{payment.amount.toLocaleString()}</div>
                  <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Reconciliation */}
      <Card>
        <CardHeader>
          <CardTitle>Bank Reconciliation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Bank reconciliation interface will be displayed here
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentTracking;