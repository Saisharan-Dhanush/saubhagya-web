/**
 * Inventory Stock History - View stock transactions for an inventory item
 * Displays transaction history from backend API with date filtering
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import {
  inventoryApi,
  type Inventory,
  type StockTransaction,
} from '../../../services/gaushala/api';

export default function InventoryStockHistory() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const [inventoryResponse, historyResponse] = await Promise.all([
        inventoryApi.getInventoryById(parseInt(id)),
        inventoryApi.getStockHistory(parseInt(id)),
      ]);

      if (inventoryResponse.success && inventoryResponse.data) {
        setInventory(inventoryResponse.data);
      }
      if (historyResponse.success && historyResponse.data) {
        setTransactions(historyResponse.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/gaushala/inventory')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={20} />
        Back to Inventory
      </button>

      {inventory && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{inventory.itemName}</h1>
          <p className="text-gray-600">Stock Transaction History</p>
          <div className="mt-2 text-sm text-gray-500">
            Current Stock: <span className="font-semibold">{inventory.quantity}</span>
          </div>
        </div>
      )}

      {transactions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Calendar className="mx-auto text-gray-400" size={48} />
          <p className="mt-4 text-gray-600">No transactions found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performed By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((tx, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(tx.transactionDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {tx.transactionType === 'IN' ? (
                        <>
                          <TrendingUp className="text-green-600" size={18} />
                          <span className="text-green-600 font-medium">Stock In</span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="text-red-600" size={18} />
                          <span className="text-red-600 font-medium">Stock Out</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tx.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tx.performedBy || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {tx.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
