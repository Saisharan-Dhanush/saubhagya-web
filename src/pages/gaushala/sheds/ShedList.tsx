/**
 * Shed List - Main shed management page with capacity tracking
 * 100% API-driven, NO hardcoded data
 * Enhanced with modern UI, search, filters, and improved UX
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Home, Users, AlertCircle, Search, Filter, Eye, BarChart3, RefreshCw } from 'lucide-react';
import { shedApi, type Shed, type PagedResponse } from '../../../services/gaushala/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';

export default function ShedList() {
  const navigate = useNavigate();
  const [sheds, setSheds] = useState<Shed[]>([]);
  const [filteredSheds, setFilteredSheds] = useState<Shed[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [occupancyFilter, setOccupancyFilter] = useState<string>('ALL');

  useEffect(() => {
    loadSheds();
  }, [currentPage]);

  useEffect(() => {
    applyFilters();
  }, [sheds, searchQuery, statusFilter, occupancyFilter]);

  const loadSheds = async () => {
    setLoading(true);
    try {
      const response = await shedApi.getAllSheds(currentPage, 20);
      if (response.success && response.data) {
        setSheds(response.data.content);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Error loading sheds:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...sheds];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(shed =>
        shed.shedName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shed.shedNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(shed => shed.status === statusFilter);
    }

    // Occupancy filter
    if (occupancyFilter !== 'ALL') {
      filtered = filtered.filter(shed => {
        const percentage = getOccupancyPercentage(shed);
        switch (occupancyFilter) {
          case 'CRITICAL':
            return percentage >= 90;
          case 'HIGH':
            return percentage >= 70 && percentage < 90;
          case 'MODERATE':
            return percentage >= 50 && percentage < 70;
          case 'LOW':
            return percentage < 50;
          default:
            return true;
        }
      });
    }

    setFilteredSheds(filtered);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this shed?')) return;
    try {
      const response = await shedApi.deleteShed(id);
      if (response.success) loadSheds();
    } catch (error) {
      console.error('Error deleting shed:', error);
    }
  };

  const getOccupancyPercentage = (shed: Shed): number => {
    if (shed.capacity === 0) return 0;
    return (shed.currentOccupancy / shed.capacity) * 100;
  };

  const getOccupancyColor = (percentage: number): string => {
    if (percentage >= 90) return 'text-red-600 bg-red-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sheds...</p>
        </div>
      </div>
    );
  }

  const displayedSheds = filteredSheds;
  const totalOccupancy = sheds.reduce((sum, shed) => sum + shed.currentOccupancy, 0);
  const totalCapacity = sheds.reduce((sum, shed) => sum + shed.capacity, 0);
  const overallUtilization = totalCapacity > 0 ? (totalOccupancy / totalCapacity) * 100 : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shed Management</h1>
          <p className="text-gray-600 mt-1">Manage and monitor shed capacity and status</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/gaushala/sheds/capacity')}
            className="flex items-center gap-2"
          >
            <BarChart3 size={18} />
            Analytics
          </Button>
          <Button
            size="sm"
            onClick={() => navigate('/gaushala/sheds/add')}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            Add Shed
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Sheds</CardDescription>
            <CardTitle className="text-3xl">{sheds.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Capacity</CardDescription>
            <CardTitle className="text-3xl">{totalCapacity}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Current Occupancy</CardDescription>
            <CardTitle className="text-3xl">{totalOccupancy}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Overall Utilization</CardDescription>
            <CardTitle className="text-3xl">{overallUtilization.toFixed(1)}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search and Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by shed name or number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={occupancyFilter} onValueChange={setOccupancyFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Occupancy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Occupancy</SelectItem>
                <SelectItem value="CRITICAL">Critical (90%+)</SelectItem>
                <SelectItem value="HIGH">High (70-90%)</SelectItem>
                <SelectItem value="MODERATE">Moderate (50-70%)</SelectItem>
                <SelectItem value="LOW">Low (&lt;50%)</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={loadSheds}
              title="Refresh"
            >
              <RefreshCw size={18} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sheds Grid */}
      {displayedSheds.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Home className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg font-medium">
              {searchQuery || statusFilter !== 'ALL' || occupancyFilter !== 'ALL'
                ? 'No sheds match your filters'
                : 'No sheds found'}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {searchQuery || statusFilter !== 'ALL' || occupancyFilter !== 'ALL'
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first shed'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {displayedSheds.map((shed) => {
            const occupancyPercent = getOccupancyPercentage(shed);
            const availableSpace = shed.capacity - shed.currentOccupancy;

            return (
              <Card
                key={shed.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-blue-300"
                onClick={() => navigate(`/gaushala/sheds/detail/${shed.shedNumber}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-blue-100 p-2.5">
                        <Home className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{shed.shedName}</CardTitle>
                        <CardDescription>{shed.shedNumber}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={shed.status === 'ACTIVE' ? 'default' : 'secondary'}>
                      {shed.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Capacity Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Capacity</p>
                      <p className="text-2xl font-bold text-gray-900">{shed.capacity}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Occupied</p>
                      <p className="text-2xl font-bold text-gray-900">{shed.currentOccupancy}</p>
                    </div>
                  </div>

                  {/* Utilization Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Utilization</span>
                      <Badge
                        variant="outline"
                        className={
                          occupancyPercent >= 90
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : occupancyPercent >= 70
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            : 'bg-green-50 text-green-700 border-green-200'
                        }
                      >
                        {occupancyPercent.toFixed(1)}%
                      </Badge>
                    </div>
                    <Progress
                      value={occupancyPercent}
                      className={
                        occupancyPercent >= 90
                          ? '[&>div]:bg-red-600'
                          : occupancyPercent >= 70
                          ? '[&>div]:bg-yellow-600'
                          : '[&>div]:bg-green-600'
                      }
                    />
                    <p className="text-xs text-gray-500">
                      {availableSpace} {availableSpace === 1 ? 'space' : 'spaces'} available
                    </p>
                  </div>

                  {/* Additional Info */}
                  {(shed.shedType || shed.areaSqFt) && (
                    <div className="pt-3 border-t grid grid-cols-2 gap-2 text-xs">
                      {shed.shedType && (
                        <div>
                          <span className="text-gray-500">Type:</span>{' '}
                          <span className="font-medium">{shed.shedType}</span>
                        </div>
                      )}
                      {shed.areaSqFt && (
                        <div>
                          <span className="text-gray-500">Area:</span>{' '}
                          <span className="font-medium">{shed.areaSqFt} sq ft</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/gaushala/sheds/detail/${shed.shedNumber}`);
                      }}
                    >
                      <Eye size={16} className="mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/gaushala/sheds/edit/${shed.id}`);
                      }}
                    >
                      <Edit size={16} className="mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        shed.id && handleDelete(shed.id);
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {displayedSheds.length} of {sheds.length} sheds
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            <span className="flex items-center px-4 text-sm">
              Page {currentPage + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage >= totalPages - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
