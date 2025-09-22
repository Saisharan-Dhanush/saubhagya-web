import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  Plus,
  Edit,
  Eye,
  Download,
  Upload,
  Calendar,
  DollarSign,
  Users,
  Package,
  Truck,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  MoreHorizontal,
  PenTool,
  History,
  Send
} from 'lucide-react';
import { salesService } from '../services/salesService';
import { Contract, Customer } from '../types';

interface ContractCardProps {
  contract: Contract;
  customer?: Customer;
  onEdit: (contract: Contract) => void;
  onView: (contract: Contract) => void;
  onSign: (contract: Contract) => void;
}

const ContractCard: React.FC<ContractCardProps> = ({ contract, customer, onEdit, onView, onSign }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'terminated': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'supply': return 'bg-blue-100 text-blue-800';
      case 'bulk': return 'bg-purple-100 text-purple-800';
      case 'subscription': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysRemaining = () => {
    const today = new Date();
    const endDate = new Date(contract.endDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();
  const contractProgress = (() => {
    const start = new Date(contract.startDate).getTime();
    const end = new Date(contract.endDate).getTime();
    const now = new Date().getTime();
    const total = end - start;
    const elapsed = now - start;
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  })();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{contract.contractNumber}</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(contract.status)}>{contract.status}</Badge>
              <Badge className={getTypeColor(contract.type)}>{contract.type}</Badge>
              {contract.version > 1 && (
                <Badge variant="outline">v{contract.version}</Badge>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Customer Information */}
        {customer && (
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            {customer.name}
          </div>
        )}

        {/* Contract Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center text-gray-600">
              <Package className="w-4 h-4 mr-1" />
              {contract.gasType}
            </div>
            <div className="flex items-center text-gray-600">
              <DollarSign className="w-4 h-4 mr-1" />
              ₹{contract.pricePerUnit}/unit
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center text-gray-600">
              <Truck className="w-4 h-4 mr-1" />
              {contract.deliveryTerms.frequency}
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-1" />
              {daysRemaining > 0 ? `${daysRemaining} days left` : 'Expired'}
            </div>
          </div>
        </div>

        {/* Contract Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Contract Progress</span>
            <span>{contractProgress.toFixed(0)}%</span>
          </div>
          <Progress value={contractProgress} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Start: {new Date(contract.startDate).toLocaleDateString()}</span>
            <span>End: {new Date(contract.endDate).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t text-center">
          <div>
            <div className="text-lg font-semibold">₹{(contract.totalValue / 1000000).toFixed(1)}M</div>
            <div className="text-xs text-gray-500">Total Value</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{contract.quantity.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Quantity/Month</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onView(contract)}>
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          {contract.status === 'draft' && (
            <Button variant="outline" size="sm" className="flex-1" onClick={() => onSign(contract)}>
              <PenTool className="w-4 h-4 mr-1" />
              Sign
            </Button>
          )}
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(contract)}>
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface ContractFormProps {
  contract?: Contract;
  customers: Customer[];
  onSave: (contract: Partial<Contract>) => void;
  onCancel: () => void;
}

const ContractForm: React.FC<ContractFormProps> = ({ contract, customers, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Contract>>(
    contract || {
      customerId: '',
      contractNumber: `SB-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
      type: 'supply',
      status: 'draft',
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      gasType: 'biogas',
      quantity: 0,
      pricePerUnit: 0,
      paymentTerms: {
        advancePercentage: 20,
        creditDays: 30,
        penaltyRate: 2
      },
      deliveryTerms: {
        location: '',
        frequency: 'monthly',
        transportMode: 'pipeline'
      },
      version: 1,
      documents: []
    }
  );

  const calculateTotalValue = () => {
    return (formData.quantity || 0) * (formData.pricePerUnit || 0) * 12; // Annual value
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const contractData = {
      ...formData,
      totalValue: calculateTotalValue()
    };
    onSave(contractData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contractNumber">Contract Number</Label>
            <Input
              id="contractNumber"
              value={formData.contractNumber}
              onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerId">Customer</Label>
            <Select value={formData.customerId} onValueChange={(value) => setFormData({ ...formData, customerId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Contract Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as any })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="supply">Supply Agreement</SelectItem>
                <SelectItem value="bulk">Bulk Purchase</SelectItem>
                <SelectItem value="subscription">Subscription</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gasType">Gas Type</Label>
            <Select value={formData.gasType} onValueChange={(value) => setFormData({ ...formData, gasType: value as any })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="biogas">Biogas</SelectItem>
                <SelectItem value="compressed">Compressed Gas</SelectItem>
                <SelectItem value="liquefied">Liquefied Gas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate?.toISOString().split('T')[0]}
              onChange={(e) => setFormData({ ...formData, startDate: new Date(e.target.value) })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate?.toISOString().split('T')[0]}
              onChange={(e) => setFormData({ ...formData, endDate: new Date(e.target.value) })}
              required
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Commercial Terms */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Commercial Terms</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Monthly Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pricePerUnit">Price per Unit (₹)</Label>
            <Input
              id="pricePerUnit"
              type="number"
              step="0.01"
              value={formData.pricePerUnit}
              onChange={(e) => setFormData({ ...formData, pricePerUnit: Number(e.target.value) })}
              required
            />
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">Total Annual Value</div>
          <div className="text-2xl font-bold">₹{calculateTotalValue().toLocaleString()}</div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="advancePercentage">Advance Percentage (%)</Label>
            <Input
              id="advancePercentage"
              type="number"
              value={formData.paymentTerms?.advancePercentage}
              onChange={(e) => setFormData({
                ...formData,
                paymentTerms: { ...formData.paymentTerms!, advancePercentage: Number(e.target.value) }
              })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="creditDays">Credit Days</Label>
            <Input
              id="creditDays"
              type="number"
              value={formData.paymentTerms?.creditDays}
              onChange={(e) => setFormData({
                ...formData,
                paymentTerms: { ...formData.paymentTerms!, creditDays: Number(e.target.value) }
              })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="penaltyRate">Penalty Rate (%)</Label>
            <Input
              id="penaltyRate"
              type="number"
              step="0.1"
              value={formData.paymentTerms?.penaltyRate}
              onChange={(e) => setFormData({
                ...formData,
                paymentTerms: { ...formData.paymentTerms!, penaltyRate: Number(e.target.value) }
              })}
              required
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Delivery Terms */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Delivery Terms</h3>
        <div className="space-y-2">
          <Label htmlFor="deliveryLocation">Delivery Location</Label>
          <Textarea
            id="deliveryLocation"
            value={formData.deliveryTerms?.location}
            onChange={(e) => setFormData({
              ...formData,
              deliveryTerms: { ...formData.deliveryTerms!, location: e.target.value }
            })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="frequency">Delivery Frequency</Label>
            <Select
              value={formData.deliveryTerms?.frequency}
              onValueChange={(value) => setFormData({
                ...formData,
                deliveryTerms: { ...formData.deliveryTerms!, frequency: value as any }
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="transportMode">Transport Mode</Label>
            <Select
              value={formData.deliveryTerms?.transportMode}
              onValueChange={(value) => setFormData({
                ...formData,
                deliveryTerms: { ...formData.deliveryTerms!, transportMode: value as any }
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pipeline">Pipeline</SelectItem>
                <SelectItem value="cylinder">Cylinder</SelectItem>
                <SelectItem value="tanker">Tanker</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {contract ? 'Update Contract' : 'Create Contract'}
        </Button>
      </DialogFooter>
    </form>
  );
};

const ContractManagement: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showContractForm, setShowContractForm] = useState(false);
  const [showContractDetails, setShowContractDetails] = useState(false);
  const [showSigningInterface, setShowSigningInterface] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [contractsResponse, customersResponse] = await Promise.all([
        salesService.getContracts(),
        salesService.getCustomers()
      ]);

      if (contractsResponse.success) {
        setContracts(contractsResponse.data);
      }

      if (customersResponse.success) {
        setCustomers(customersResponse.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateContract = () => {
    setSelectedContract(null);
    setShowContractForm(true);
  };

  const handleEditContract = (contract: Contract) => {
    setSelectedContract(contract);
    setShowContractForm(true);
  };

  const handleViewContract = (contract: Contract) => {
    setSelectedContract(contract);
    setShowContractDetails(true);
  };

  const handleSignContract = (contract: Contract) => {
    setSelectedContract(contract);
    setShowSigningInterface(true);
  };

  const handleSaveContract = async (contractData: Partial<Contract>) => {
    try {
      if (selectedContract) {
        // Update existing contract - create new version
        const newVersion: Contract = {
          ...selectedContract,
          ...contractData,
          version: selectedContract.version + 1,
          parentContractId: selectedContract.id,
          id: `cont_${Date.now()}`
        };
        await salesService.createContract(newVersion);
      } else {
        // Create new contract
        await salesService.createContract(contractData as Omit<Contract, 'id'>);
      }
      setShowContractForm(false);
      loadData();
    } catch (error) {
      console.error('Error saving contract:', error);
    }
  };

  const getCustomerById = (id: string) => {
    return customers.find(c => c.id === id);
  };

  const getContractStats = () => {
    const total = contracts.length;
    const active = contracts.filter(c => c.status === 'active').length;
    const draft = contracts.filter(c => c.status === 'draft').length;
    const expiringSoon = contracts.filter(c => {
      const daysToExpiry = Math.ceil((new Date(c.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return daysToExpiry <= 30 && daysToExpiry > 0;
    }).length;
    const totalValue = contracts
      .filter(c => c.status === 'active')
      .reduce((sum, c) => sum + c.totalValue, 0);

    return { total, active, draft, expiringSoon, totalValue };
  };

  const stats = getContractStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contract Management</h1>
          <p className="text-gray-600">
            Manage supply contracts, agreements, and e-signatures
          </p>
        </div>
        <Button onClick={handleCreateContract}>
          <Plus className="w-4 h-4 mr-2" />
          New Contract
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Contracts</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Edit className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Draft</p>
                <p className="text-2xl font-bold">{stats.draft}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold">{stats.expiringSoon}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold">₹{(stats.totalValue / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contracts Grid */}
      {loading ? (
        <div className="text-center py-8">Loading contracts...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contracts.map((contract) => (
            <ContractCard
              key={contract.id}
              contract={contract}
              customer={getCustomerById(contract.customerId)}
              onEdit={handleEditContract}
              onView={handleViewContract}
              onSign={handleSignContract}
            />
          ))}
        </div>
      )}

      {/* Contract Form Dialog */}
      <Dialog open={showContractForm} onOpenChange={setShowContractForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedContract ? 'Edit Contract (New Version)' : 'Create New Contract'}
            </DialogTitle>
            <DialogDescription>
              {selectedContract ? 'Creating a new version will preserve the original contract history.' : 'Create a new supply contract with detailed terms and conditions.'}
            </DialogDescription>
          </DialogHeader>
          <ContractForm
            contract={selectedContract || undefined}
            customers={customers}
            onSave={handleSaveContract}
            onCancel={() => setShowContractForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Contract Details Dialog */}
      <Dialog open={showContractDetails} onOpenChange={setShowContractDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedContract?.contractNumber}</DialogTitle>
            <DialogDescription>Complete contract details and documentation</DialogDescription>
          </DialogHeader>
          {selectedContract && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="terms">Terms</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Contract Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div><strong>Type:</strong> {selectedContract.type}</div>
                      <div><strong>Status:</strong> {selectedContract.status}</div>
                      <div><strong>Version:</strong> {selectedContract.version}</div>
                      <div><strong>Gas Type:</strong> {selectedContract.gasType}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Commercial Terms</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div><strong>Monthly Quantity:</strong> {selectedContract.quantity.toLocaleString()}</div>
                      <div><strong>Price per Unit:</strong> ₹{selectedContract.pricePerUnit}</div>
                      <div><strong>Total Value:</strong> ₹{selectedContract.totalValue.toLocaleString()}</div>
                      <div><strong>Payment Terms:</strong> {selectedContract.paymentTerms.creditDays} days</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="terms">
                <Card>
                  <CardHeader>
                    <CardTitle>Terms and Conditions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold">Payment Terms</h4>
                        <p>Advance: {selectedContract.paymentTerms.advancePercentage}%</p>
                        <p>Credit Period: {selectedContract.paymentTerms.creditDays} days</p>
                        <p>Penalty Rate: {selectedContract.paymentTerms.penaltyRate}% per month</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Delivery Terms</h4>
                        <p>Location: {selectedContract.deliveryTerms.location}</p>
                        <p>Frequency: {selectedContract.deliveryTerms.frequency}</p>
                        <p>Transport Mode: {selectedContract.deliveryTerms.transportMode}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle>Contract Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedContract.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <div className="font-medium">{doc.name}</div>
                            <div className="text-sm text-gray-500">Uploaded: {doc.uploadDate.toLocaleDateString()}</div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Document
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Contract History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 border-l-4 border-green-500 bg-green-50">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="font-medium">Contract Created</div>
                          <div className="text-sm text-gray-500">Version {selectedContract.version} • {selectedContract.startDate.toLocaleDateString()}</div>
                        </div>
                      </div>
                      {selectedContract.signedDate && (
                        <div className="flex items-center space-x-3 p-3 border-l-4 border-blue-500 bg-blue-50">
                          <PenTool className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="font-medium">Contract Signed</div>
                            <div className="text-sm text-gray-500">{selectedContract.signedDate.toLocaleDateString()}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* E-Signature Dialog */}
      <Dialog open={showSigningInterface} onOpenChange={setShowSigningInterface}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>E-Signature Interface</DialogTitle>
            <DialogDescription>
              Sign the contract electronically to activate the agreement
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <PenTool className="w-16 h-16 mx-auto text-blue-600" />
                  <h3 className="text-lg font-semibold">Digital Signature Required</h3>
                  <p className="text-gray-600">
                    This contract requires digital signatures from both parties to become active.
                  </p>
                  <div className="space-y-2">
                    <Button className="w-full">
                      <PenTool className="w-4 h-4 mr-2" />
                      Sign with Digital Certificate
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Send className="w-4 h-4 mr-2" />
                      Send for Customer Signature
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContractManagement;