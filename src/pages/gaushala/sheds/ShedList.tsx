/**
 * Shed List - Main shed management page with capacity tracking
 * 100% API-driven, NO hardcoded data
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Home, Users, AlertCircle } from 'lucide-react';
import { shedApi, type Shed, type PagedResponse } from '../../../services/gaushala/api';

export default function ShedList() {
  const navigate = useNavigate();
  const [sheds, setSheds] = useState<Shed[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    loadSheds();
  }, [currentPage]);

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
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Shed Management</h1>
        <button onClick={() => navigate('/gaushala/sheds/add')} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          <Plus size={20} />Add Shed
        </button>
      </div>

      {sheds.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Home className="mx-auto text-gray-400" size={48} />
          <p className="mt-4 text-gray-600">No sheds found</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sheds.map((shed) => {
            const occupancyPercent = getOccupancyPercentage(shed);
            return (
              <div key={shed.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-blue-100 p-2">
                      <Home className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{shed.shedName}</h3>
                      <p className="text-sm text-gray-500">{shed.shedNumber}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${shed.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {shed.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-medium">{shed.capacity}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Occupancy:</span>
                    <span className="font-medium">{shed.currentOccupancy}</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Utilization:</span>
                      <span className={`font-medium px-2 py-0.5 rounded ${getOccupancyColor(occupancyPercent)}`}>
                        {occupancyPercent.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${occupancyPercent >= 90 ? 'bg-red-600' : occupancyPercent >= 70 ? 'bg-yellow-600' : 'bg-green-600'}`} style={{ width: `${Math.min(occupancyPercent, 100)}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button onClick={() => navigate(`/gaushala/sheds/edit/${shed.id}`)} className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200">
                    <Edit size={16} />Edit
                  </button>
                  <button onClick={() => shed.id && handleDelete(shed.id)} className="flex items-center justify-center rounded-lg bg-red-100 px-3 py-2 text-red-600 hover:bg-red-200">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => setCurrentPage(Math.max(0, currentPage - 1))} disabled={currentPage === 0} className="px-4 py-2 border rounded disabled:opacity-50">Previous</button>
          <span className="px-4 py-2">Page {currentPage + 1} of {totalPages}</span>
          <button onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))} disabled={currentPage >= totalPages - 1} className="px-4 py-2 border rounded disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
}
