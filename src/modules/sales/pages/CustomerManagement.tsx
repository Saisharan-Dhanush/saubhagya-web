import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  MapPin,
  Phone,
  Mail,
  Building,
  CreditCard,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Calendar,
  FileText,
  MoreHorizontal
} from 'lucide-react';
import { salesService } from '../services/salesService';
import { Customer, CustomerFilters } from '../types';

interface CustomerCardProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onViewDetails: (customer: Customer) => void;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onEdit, onViewDetails }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'commercial': return 'bg-blue-100 text-blue-800';
      case 'industrial': return 'bg-purple-100 text-purple-800';
      case 'residential': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const creditUtilization = (customer.creditUsed / customer.creditLimit) * 100;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{customer.name}</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
              <Badge className={getTypeColor(customer.type)}>{customer.type}</Badge>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contact Information */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Building className="w-4 h-4 mr-2" />
            {customer.contactPerson}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2" />
            {customer.phone}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="w-4 h-4 mr-2" />
            {customer.email}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            {customer.address.city}, {customer.address.state}
          </div>
        </div>

        {/* Credit Information */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Credit Utilization</span>
            <span className={getRiskColor(customer.riskCategory)}>
              {creditUtilization.toFixed(1)}%
            </span>
          </div>
          <Progress value={creditUtilization} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Used: ₹{(customer.creditUsed / 1000).toFixed(0)}K</span>
            <span>Limit: ₹{(customer.creditLimit / 1000).toFixed(0)}K</span>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div className="text-center">
            <div className="text-lg font-semibold">{customer.totalOrders}</div>
            <div className="text-xs text-gray-500">Total Orders</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">₹{(customer.totalRevenue / 1000).toFixed(0)}K</div>
            <div className="text-xs text-gray-500">Revenue</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onViewDetails(customer)}>
            View Details
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(customer)}>
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface CustomerFormProps {
  customer?: Customer;
  onSave: (customer: Customer) => void;
  onCancel: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ customer, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Customer>>(
    customer || {
      name: '',
      type: 'commercial',
      contactPerson: '',
      phone: '',
      email: '',
      address: {
        street: '',
        city: '',
        state: '',
        pincode: ''
      },
      creditLimit: 0,
      paymentTerms: 30,
      gstNumber: '',
      panNumber: '',
      status: 'active'
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Customer);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Company/Customer Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Customer Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as any })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contactPerson">Contact Person</Label>
          <Input
            id="contactPerson"
            value={formData.contactPerson}
            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="street">Street Address</Label>
        <Textarea
          id="street"
          value={formData.address?.street}
          onChange={(e) => setFormData({
            ...formData,
            address: { ...formData.address!, street: e.target.value }
          })}
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.address?.city}
            onChange={(e) => setFormData({
              ...formData,
              address: { ...formData.address!, city: e.target.value }
            })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={formData.address?.state}
            onChange={(e) => setFormData({
              ...formData,
              address: { ...formData.address!, state: e.target.value }
            })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pincode">PIN Code</Label>
          <Input
            id="pincode"
            value={formData.address?.pincode}
            onChange={(e) => setFormData({
              ...formData,
              address: { ...formData.address!, pincode: e.target.value }
            })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="creditLimit">Credit Limit (₹)</Label>
          <Input
            id="creditLimit"
            type="number"
            value={formData.creditLimit}
            onChange={(e) => setFormData({ ...formData, creditLimit: Number(e.target.value) })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="paymentTerms">Payment Terms (Days)</Label>
          <Input
            id="paymentTerms"
            type="number"
            value={formData.paymentTerms}
            onChange={(e) => setFormData({ ...formData, paymentTerms: Number(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gstNumber">GST Number (Optional)</Label>
          <Input
            id="gstNumber"
            value={formData.gstNumber}
            onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="panNumber">PAN Number (Optional)</Label>
          <Input
            id="panNumber"
            value={formData.panNumber}
            onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {customer ? 'Update Customer' : 'Create Customer'}
        </Button>
      </DialogFooter>
    </form>
  );
};

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<CustomerFilters>({});
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const response = await salesService.getCustomers(filters);
      if (response.success) {
        setCustomers(response.data);
        setFilteredCustomers(response.data);
      }
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [filters]);

  useEffect(() => {
    const filtered = customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    );
    setFilteredCustomers(filtered);
  }, [customers, searchTerm]);

  const handleCreateCustomer = () => {
    setSelectedCustomer(null);
    setShowCustomerForm(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerForm(true);
  };

  const handleViewCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDetails(true);
  };

  const handleSaveCustomer = async (customerData: Customer) => {
    try {
      if (selectedCustomer) {
        // Update existing customer
        await salesService.updateCustomer(selectedCustomer.id, customerData);
      } else {
        // Create new customer
        await salesService.createCustomer(customerData);
      }
      setShowCustomerForm(false);
      loadCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const getCustomerStats = () => {
    const total = customers.length;
    const active = customers.filter(c => c.status === 'active').length;
    const highRisk = customers.filter(c => c.riskCategory === 'high').length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalRevenue, 0);

    return { total, active, highRisk, totalRevenue };
  };

  const stats = getCustomerStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="text-gray-600">
            Manage customer profiles, credit limits, and relationships
          </p>
        </div>
        <Button onClick={handleCreateCustomer}>
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">High Risk</p>
                <p className="text-2xl font-bold">{stats.highRisk}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CreditCard className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">₹{(stats.totalRevenue / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search customers by name, contact, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filters.status?.[0] || 'all'} onValueChange={(value) =>
                setFilters({ ...filters, status: value === 'all' ? undefined : [value] })
              }>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.type?.[0] || 'all'} onValueChange={(value) =>
                setFilters({ ...filters, type: value === 'all' ? undefined : [value] })
              }>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="residential">Residential</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Grid */}
      {loading ? (
        <div className="text-center py-8">Loading customers...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onEdit={handleEditCustomer}
              onViewDetails={handleViewCustomerDetails}
            />
          ))}
        </div>
      )}

      {/* Customer Form Dialog */}
      <Dialog open={showCustomerForm} onOpenChange={setShowCustomerForm}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedCustomer ? 'Edit Customer' : 'Add New Customer'}
            </DialogTitle>
            <DialogDescription>
              {selectedCustomer ? 'Update customer information and settings.' : 'Create a new customer profile with contact and credit information.'}
            </DialogDescription>
          </DialogHeader>
          <CustomerForm
            customer={selectedCustomer || undefined}
            onSave={handleSaveCustomer}
            onCancel={() => setShowCustomerForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Customer Details Dialog */}
      <Dialog open={showCustomerDetails} onOpenChange={setShowCustomerDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedCustomer?.name}</DialogTitle>
            <DialogDescription>Complete customer profile and history</DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <Tabs defaultValue="profile" className="w-full">
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              <TabsContent value="profile" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div><strong>Contact Person:</strong> {selectedCustomer.contactPerson}</div>
                      <div><strong>Phone:</strong> {selectedCustomer.phone}</div>
                      <div><strong>Email:</strong> {selectedCustomer.email}</div>
                      <div><strong>Address:</strong> {selectedCustomer.address.street}, {selectedCustomer.address.city}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Business Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div><strong>Type:</strong> {selectedCustomer.type}</div>
                      <div><strong>GST Number:</strong> {selectedCustomer.gstNumber || 'N/A'}</div>
                      <div><strong>PAN Number:</strong> {selectedCustomer.panNumber || 'N/A'}</div>
                      <div><strong>Registration Date:</strong> {selectedCustomer.registrationDate.toLocaleDateString()}</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      Order history will be displayed here
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="payments">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      Payment history will be displayed here
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      Customer analytics will be displayed here
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerManagement;