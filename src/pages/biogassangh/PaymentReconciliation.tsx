import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { DollarSign, Receipt, Shield, Hash, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import biogasService, { ReconciliationResponse, ReconciliationReportResponse } from '../../services/biogasService';

const PaymentReconciliation: React.FC = () => {
  const [reconciliations, setReconciliations] = useState<ReconciliationResponse[]>([]);
  const [report, setReport] = useState<ReconciliationReportResponse | null>(null);
  const [selectedReconciliation, setSelectedReconciliation] = useState<ReconciliationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get cluster ID from user context (hardcoded for now)
  const clusterId = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch pending reconciliations
      const reconciliationsResponse = await biogasService.getPendingReconciliations(clusterId, 0, 100);
      if (reconciliationsResponse.success && reconciliationsResponse.data) {
        setReconciliations(reconciliationsResponse.data.content);
      } else {
        setError(reconciliationsResponse.error || 'Failed to load reconciliations');
      }

      // Fetch reconciliation report
      const reportResponse = await biogasService.getReconciliationReport(clusterId);
      if (reportResponse.success && reportResponse.data) {
        setReport(reportResponse.data);
      }
    } catch (err) {
      console.error('Error fetching reconciliation data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'PENDING': 'secondary',
      'MATCHED': 'default',
      'UNMATCHED': 'destructive',
      'REVIEWING': 'outline'
    };
    return colors[status as keyof typeof colors] || 'outline';
  };

  const handleAutoMatch = async () => {
    try {
      setLoading(true);
      const response = await biogasService.performAutoMatching(clusterId);
      if (response.success) {
        alert(`Auto-matching completed: ${response.data}`);
        await fetchData(); // Refresh data
      } else {
        alert(`Auto-matching failed: ${response.error}`);
      }
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Auto-matching failed'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !report) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <DollarSign className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading reconciliation data...</p>
        </div>
      </div>
    );
  }

  if (error && !report) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center text-red-600">
          <AlertCircle className="h-8 w-8 mx-auto mb-4" />
          <p>Error: {error}</p>
          <Button onClick={fetchData} className="mt-4">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="-mt-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment Reconciliation</h1>
        <p className="text-gray-600 mt-1">
          Track and reconcile bank transactions with dung collection records
        </p>
      </div>

      {/* Reconciliation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Receipt className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Entries</p>
                <p className="text-xl font-bold">{report?.totalEntries || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Matched</p>
                <p className="text-xl font-bold">{report?.matchedCount || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Unmatched</p>
                <p className="text-xl font-bold">{report?.unmatchedCount || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Reconciliation %</p>
                <p className="text-xl font-bold">
                  {report?.reconciliationPercentage?.toFixed(1) || 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button onClick={handleAutoMatch} disabled={loading}>
          <CheckCircle className="h-4 w-4 mr-2" />
          Auto-Match Transactions
        </Button>
        <Button variant="outline" disabled>
          <Upload className="h-4 w-4 mr-2" />
          Upload Bank Statement
        </Button>
      </div>

      {/* Reconciliation Entries & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pending Reconciliations List */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Reconciliations ({reconciliations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {reconciliations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No pending reconciliations</p>
                <p className="text-sm mt-2">All transactions have been matched!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {reconciliations.map((reconciliation) => (
                  <div
                    key={reconciliation.entryId}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedReconciliation?.entryId === reconciliation.entryId
                        ? 'border-blue-500 bg-blue-50'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedReconciliation(reconciliation)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">Entry #{reconciliation.entryId.slice(0, 8)}</h3>
                        <p className="text-sm text-gray-600">₹{reconciliation.amount.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={getStatusColor(reconciliation.matchStatus) as any}>
                          {reconciliation.matched ? 'MATCHED' : 'PENDING'}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(reconciliation.transactionDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Ref: {reconciliation.reference}</span>
                      {reconciliation.dungTransactionId && (
                        <span>TXN: {reconciliation.dungTransactionId.slice(0, 8)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reconciliation Details */}
        <Card>
          <CardHeader>
            <CardTitle>Reconciliation Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedReconciliation ? (
              <div className="space-y-4">
                {/* Entry Information */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold mb-3">Entry Information</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Entry ID:</span>
                      <p className="font-medium">{selectedReconciliation.entryId}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Amount:</span>
                      <p className="font-medium">₹{selectedReconciliation.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Reference:</span>
                      <p className="font-medium">{selectedReconciliation.reference}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Date:</span>
                      <p className="font-medium">
                        {new Date(selectedReconciliation.transactionDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <Badge variant={getStatusColor(selectedReconciliation.matchStatus) as any}>
                        {selectedReconciliation.matched ? 'MATCHED' : 'PENDING'}
                      </Badge>
                    </div>
                  </div>

                  {selectedReconciliation.dungTransactionId && (
                    <div className="mt-3">
                      <span className="text-gray-600">Matched Transaction:</span>
                      <p className="font-mono text-sm bg-white p-2 rounded border">
                        {selectedReconciliation.dungTransactionId}
                      </p>
                    </div>
                  )}

                  {selectedReconciliation.matchNotes && (
                    <div className="mt-3">
                      <span className="text-gray-600">Match Notes:</span>
                      <p className="text-sm bg-white p-2 rounded border">
                        {selectedReconciliation.matchNotes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {!selectedReconciliation.matched && (
                  <div className="space-y-2">
                    <Button className="w-full" variant="outline">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Manual Match
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a reconciliation entry to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentReconciliation;
