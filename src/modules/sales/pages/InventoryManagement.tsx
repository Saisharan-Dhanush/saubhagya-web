import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Package, Search, Filter, Plus, Edit, MapPin, Calendar, AlertTriangle,
  CheckCircle, Clock, BarChart3, TrendingUp, Shield
} from 'lucide-react';
import { salesService } from '../services/salesService';
import { InventoryItem, InventoryFilters } from '../types';

const InventoryCard: React.FC<{ item: InventoryItem }> = ({ item }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const availabilityPercentage = (item.availableQuantity / item.quantity) * 100;
  const isLowStock = availabilityPercentage < 20;
  const isPesoExpiring = new Date(item.pesoCompliance.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{item.batchNumber}</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
              <Badge variant="outline">{item.gasType}</Badge>
              {isPesoExpiring && <Badge className="bg-orange-100 text-orange-800">PESO Expiring</Badge>}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Available</div>
            <div className="font-semibold">{item.availableQuantity.toLocaleString()} {item.unit}</div>
          </div>
          <div>
            <div className="text-gray-600">Total</div>
            <div className="font-semibold">{item.quantity.toLocaleString()} {item.unit}</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Availability</span>
            <span className={isLowStock ? 'text-red-600' : 'text-green-600'}>
              {availabilityPercentage.toFixed(1)}%
            </span>
          </div>
          <Progress value={availabilityPercentage} className="h-2" />
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-600">
            <Shield className="w-4 h-4 mr-2" />
            PESO: {item.pesoCompliance.status} (Exp: {new Date(item.pesoCompliance.expiryDate).toLocaleDateString()})
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            {item.location.plantId} - {item.location.tankId}
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            Produced: {new Date(item.productionDate).toLocaleDateString()}
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Value</span>
            <span className="font-semibold">₹{(item.availableQuantity * item.pricePerUnit).toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const InventoryManagement: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<InventoryFilters>({});

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const response = await salesService.getInventory(filters);
        if (response.success) {
          setInventory(response.data);
          setFilteredInventory(response.data);
        }
      } catch (error) {
        console.error('Error loading inventory:', error);
      } finally {
        setLoading(false);
      }
    };
    loadInventory();
  }, [filters]);

  useEffect(() => {
    const filtered = inventory.filter(item =>
      item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.gasType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.plantId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInventory(filtered);
  }, [inventory, searchTerm]);

  const getInventoryStats = () => {
    const totalItems = inventory.length;
    const totalValue = inventory.reduce((sum, item) => sum + (item.availableQuantity * item.pricePerUnit), 0);
    const lowStockItems = inventory.filter(item => (item.availableQuantity / item.quantity) < 0.2).length;
    const pesoExpiringItems = inventory.filter(item =>
      new Date(item.pesoCompliance.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    ).length;

    return { totalItems, totalValue, lowStockItems, pesoExpiringItems };
  };

  const stats = getInventoryStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-gray-600">Monitor gas inventory, batches, and PESO compliance</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Batch
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold">{stats.totalItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inventory Value</p>
                <p className="text-2xl font-bold">₹{(stats.totalValue / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold">{stats.lowStockItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">PESO Expiring</p>
                <p className="text-2xl font-bold">{stats.pesoExpiringItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by batch number, gas type, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Grid */}
      <Tabs defaultValue="grid" className="w-full">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-6">
          {loading ? (
            <div className="text-center py-8">Loading inventory...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInventory.map((item) => (
                <InventoryCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Table</CardTitle>
              <CardDescription>Detailed inventory listing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Table view will be implemented here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                  Critical Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {inventory.filter(item => (item.availableQuantity / item.quantity) < 0.1).map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded bg-red-50">
                      <div>
                        <div className="font-medium">{item.batchNumber}</div>
                        <div className="text-sm text-gray-600">Critical low stock: {item.availableQuantity} {item.unit} remaining</div>
                      </div>
                      <Badge className="bg-red-100 text-red-800">Critical</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryManagement;