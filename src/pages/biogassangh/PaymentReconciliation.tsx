import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { DollarSign, Receipt, Shield, Hash, CheckCircle, AlertCircle } from 'lucide-react';

// Mock types for PaymentReconciliation
interface Payment {
  id: string;
  farmerId: string;
  amount: number;
  type: string;
  status: string;
  createdAt: string;
  transactionId?: string;
  auditHash: string;
  batchIds: string[];
}

interface Farmer {
  id: string;
  name: string;
}

// Mock data
const payments: Payment[] = [
  {
    id: 'PAY-001',
    farmerId: 'FARM-001',
    amount: 412.25,
    type: 'CASH',
    status: 'COMPLETED',
    createdAt: new Date().toISOString(),
    transactionId: 'TXN-001',
    auditHash: 'sha256:a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
    batchIds: ['BATCH-001']
  },
  {
    id: 'PAY-002',
    farmerId: 'FARM-002',
    amount: 325.80,
    type: 'UPI',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    auditHash: 'sha256:b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567',
    batchIds: ['BATCH-002']
  }
];

const farmers: Farmer[] = [
  { id: 'FARM-001', name: 'राम कुमार' },
  { id: 'FARM-002', name: 'श्याम यादव' }
];

const loading = {
  payments: false
};

const PaymentReconciliation: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const getStatusColor = (status: string) => {
    const colors = {
      'PENDING': 'secondary',
      'PROCESSING': 'outline',
      'COMPLETED': 'default',
      'FAILED': 'destructive'
    };
    return colors[status as keyof typeof colors] || 'outline';
  };

  const getPaymentTypeIcon = (type: string) => {
    switch (type) {
      case 'CASH': return '💵';
      case 'UPI': return '📱';
      case 'BANK_TRANSFER': return '🏦';
      case 'CHEQUE': return '📝';
      default: return '💳';
    }
  };

  const getFarmerName = (farmerId: string) => {
    const farmer = farmers.find(f => f.id === farmerId);
    return farmer?.name || `Farmer ${farmerId}`;
  };

  if (loading.payments) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <DollarSign className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="-mt-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment Reconciliation</h1>
        <p className="text-gray-600 mt-1">
          Track and reconcile farmer payments with immutable audit log
        </p>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Receipt className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Payments</p>
                <p className="text-xl font-bold">{payments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-xl font-bold">
                  {payments.filter(p => p.status === 'COMPLETED').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-xl font-bold">
                  {payments.filter(p => p.status === 'PENDING').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-xl font-bold">
                  ₹{payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments List & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Payments List */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedPayment?.id === payment.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedPayment(payment)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{getFarmerName(payment.farmerId)}</h3>
                      <p className="text-sm text-gray-600">₹{payment.amount.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={getStatusColor(payment.status) as any}>
                        {payment.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {getPaymentTypeIcon(payment.type)} {payment.type}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>#{payment.id}</span>
                    <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
                  </div>

                  {payment.transactionId && (
                    <div className="mt-2 text-xs font-mono bg-gray-100 p-1 rounded">
                      TXN: {payment.transactionId}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Details & Audit */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Details & Audit Trail</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPayment ? (
              <div className="space-y-4">
                {/* Payment Information */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold mb-3">Payment Information</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Payment ID:</span>
                      <p className="font-medium">{selectedPayment.id}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Amount:</span>
                      <p className="font-medium">₹{selectedPayment.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Farmer:</span>
                      <p className="font-medium">{getFarmerName(selectedPayment.farmerId)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <p className="font-medium">
                        {getPaymentTypeIcon(selectedPayment.type)} {selectedPayment.type}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <Badge variant={getStatusColor(selectedPayment.status) as any}>
                        {selectedPayment.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-gray-600">Created:</span>
                      <p className="font-medium">
                        {new Date(selectedPayment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {selectedPayment.transactionId && (
                    <div className="mt-3">
                      <span className="text-gray-600">Transaction ID:</span>
                      <p className="font-mono text-sm bg-white p-2 rounded border">
                        {selectedPayment.transactionId}
                      </p>
                    </div>
                  )}
                </div>

                {/* Audit Hash */}
                <div className="border rounded-lg p-4 bg-green-50">
                  <h3 className="font-semibold mb-3 flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Audit Hash (Immutable)</span>
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Hash className="h-4 w-4 text-gray-500" />
                    <p className="font-mono text-xs bg-white p-2 rounded border flex-1">
                      {selectedPayment.auditHash}
                    </p>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    This cryptographic hash ensures payment record integrity and prevents tampering.
                  </p>
                </div>

                {/* Related Batches */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Related Batches</h3>
                  <div className="space-y-2">
                    {selectedPayment.batchIds.map((batchId) => (
                      <div key={batchId} className="flex items-center justify-between text-sm">
                        <span>Batch {batchId}</span>
                        <Badge variant="outline">Linked</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                {selectedPayment.status === 'PENDING' && (
                  <div className="space-y-2">
                    <Button className="w-full">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Completed
                    </Button>
                    <Button variant="outline" className="w-full">
                      Process Payment
                    </Button>
                  </div>
                )}

                {selectedPayment.status === 'FAILED' && (
                  <Button variant="outline" className="w-full">
                    Retry Payment
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a payment to view details and audit trail</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentReconciliation;