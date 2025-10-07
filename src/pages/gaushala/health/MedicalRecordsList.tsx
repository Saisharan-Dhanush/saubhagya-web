/**
 * Medical Records List - Display health records with pending vaccinations
 * 100% API-driven, NO hardcoded data
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Heart, AlertCircle, Calendar, Syringe } from 'lucide-react';
import { healthRecordsApi, type HealthRecord } from '../../../services/gaushala/api';

export default function MedicalRecordsList() {
  const { cattleId } = useParams<{ cattleId?: string }>();
  const navigate = useNavigate();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [pendingVaccinations, setPendingVaccinations] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecords();
    loadPendingVaccinations();
  }, [cattleId]);

  const loadRecords = async () => {
    setLoading(true);
    try {
      if (cattleId) {
        const response = await healthRecordsApi.getHealthRecordsByCattle(parseInt(cattleId));
        if (response.success && response.data) {
          setRecords(response.data);
        } else {
          setRecords([]);
        }
      } else {
        const response = await healthRecordsApi.getAllHealthRecords(0, 50);
        if (response.success && response.data) {
          setRecords(response.data.content);
        } else {
          setRecords([]);
        }
      }
    } catch (error) {
      console.error('Error loading records:', error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const loadPendingVaccinations = async () => {
    try {
      const response = await healthRecordsApi.getPendingVaccinations();
      if (response.success && response.data) {
        setPendingVaccinations(response.data);
      }
    } catch (error) {
      console.error('Error loading pending vaccinations:', error);
    }
  };

  const getRecordTypeBadge = (type: string): string => {
    switch (type.toUpperCase()) {
      case 'VACCINATION':
        return 'bg-blue-100 text-blue-800';
      case 'TREATMENT':
        return 'bg-green-100 text-green-800';
      case 'CHECKUP':
        return 'bg-purple-100 text-purple-800';
      case 'SURGERY':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN');
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Medical Records</h1>
          {cattleId && <p className="text-gray-600 mt-1">Cattle ID: #{cattleId}</p>}
        </div>
        <button
          onClick={() => navigate('/gaushala/health/add')}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Record
        </button>
      </div>

      {/* Pending Vaccinations Alert */}
      {pendingVaccinations.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="text-yellow-600" size={20} />
            <h3 className="font-semibold text-yellow-900">
              Pending Vaccinations ({pendingVaccinations.length})
            </h3>
          </div>
          <div className="space-y-2">
            {pendingVaccinations.slice(0, 5).map((vax) => (
              <div key={vax.id} className="flex items-center justify-between text-sm bg-white rounded p-2">
                <div className="flex items-center gap-2">
                  <Syringe className="text-yellow-600" size={16} />
                  <span className="font-medium">Cattle #{vax.cattleId}</span>
                  <span className="text-gray-600">- {vax.vaccineName}</span>
                </div>
                <span className="text-yellow-700">
                  Due: {vax.nextVaccinationDate ? formatDate(vax.nextVaccinationDate) : 'N/A'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Medical Records List */}
      {records.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Heart className="mx-auto text-gray-400" size={48} />
          <p className="mt-4 text-gray-600">No medical records found</p>
          <button
            onClick={() => navigate('/gaushala/health/add')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Add your first medical record
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Cattle ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Veterinarian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Next Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(record.recordDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{record.cattleId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getRecordTypeBadge(
                        record.recordType
                      )}`}
                    >
                      {record.recordType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {record.recordType === 'VACCINATION' && record.vaccineName ? (
                      <div>
                        <div className="font-medium">{record.vaccineName}</div>
                        {record.vaccineManufacturer && (
                          <div className="text-xs text-gray-500">{record.vaccineManufacturer}</div>
                        )}
                      </div>
                    ) : (
                      <div className="max-w-xs truncate">{record.diagnosis || record.treatment || '-'}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {record.veterinarianName || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.nextVaccinationDate ? (
                      <div className="flex items-center gap-1 text-blue-600">
                        <Calendar size={14} />
                        <span>{formatDate(record.nextVaccinationDate)}</span>
                      </div>
                    ) : record.nextCheckupDate ? (
                      <div className="flex items-center gap-1 text-purple-600">
                        <Calendar size={14} />
                        <span>{formatDate(record.nextCheckupDate)}</span>
                      </div>
                    ) : (
                      '-'
                    )}
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
