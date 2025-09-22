import { useState, useEffect, useRef } from 'react'
import { Users, Database, BarChart3, TrendingUp, Activity, Zap, Truck, AlertTriangle, Clock, Thermometer, Gauge, Calendar, Download, Volume2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { usePlatform } from '../contexts/PlatformContext'

// Backend API endpoints
const IOT_API = import.meta.env.VITE_IOT_API || 'http://localhost:8080';
const BIOGAS_API = import.meta.env.VITE_BIOGAS_API || 'http://localhost:8080';
const SALES_API = import.meta.env.VITE_SALES_API || 'http://localhost:8083';

interface IoTData {
  ch4: number;
  pressure: number;
  temperature: number;
  timestamp: Date;
}

interface PickupSchedule {
  id: string;
  clusterId: string;
  scheduledTime: Date;
  truckId: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  estimatedVolume: number;
}

interface ClusterMetrics {
  totalBiogas: number;
  dailyProduction: number;
  efficiency: number;
  activePlants: number;
  alerts: number;
}

export default function Dashboard() {
  const { user } = useAuth()
  const { trackModuleUsage, updateBreadcrumbs } = usePlatform()
  const [iotData, setIotData] = useState<IoTData[]>([]);
  const [pickupSchedules, setPickupSchedules] = useState<PickupSchedule[]>([]);
  const [clusterMetrics, setClusterMetrics] = useState<ClusterMetrics>({
    totalBiogas: 0,
    dailyProduction: 0,
    efficiency: 0,
    activePlants: 0,
    alerts: 0
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const translations = {
    en: {
      title: 'Biogas Cluster Management Dashboard',
      subtitle: 'Real-time monitoring and management of biogas operations',
      clusterOverview: 'Cluster Overview',
      totalGaushalas: 'Total Gaushalas',
      activeDigesters: 'Active Digesters',
      totalBiogas: 'Total Biogas (m³)',
      todayCollection: 'Today\'s Collection',
      pickupSchedule: 'Pickup Schedule',
      alerts: 'Alerts',
      alertManagement: 'Alert Management',
      voiceSummary: 'Voice Summary',
      speaking: 'Speaking...',
      speakCommand: 'Speak a command',
      startListening: 'Start Listening',
      stopListening: 'Stop Listening',
      exportData: 'Export Data',
      exportPDF: 'Export PDF',
      exportExcel: 'Export Excel',
      recentActivity: 'Recent Activity',
      systemHealth: 'System Health',
      performance: 'Performance',
      revenue: 'Revenue',
      carbonCredits: 'Carbon Credits',
      totalBiogasLabel: 'Total Biogas',
      dailyProduction: 'Daily Production',
      efficiency: 'Efficiency',
      activePlants: 'Active Plants',
      alertsLabel: 'Alerts',
      ch4Level: 'CH4 Level (Methane)',
      pressure: 'Pressure',
      temperature: 'Temperature',
      pickupScheduleLabel: 'Pickup Schedule',
      cluster: 'Cluster',
      time: 'Time',
      truck: 'Truck',
      quantity: 'Quantity',
      status: 'Status',
      action: 'Action',
      scheduled: 'Scheduled',
      edit: 'Edit',
      newSchedule: 'New Schedule',
      quickActions: 'Quick Actions',
      pickupScheduleAction: 'Pickup Schedule',
      clusterAnalysis: 'Cluster Analysis',
      alertManagementLabel: 'Alert Management',
      maintenance: 'Maintenance'
    },
    hi: {
      title: 'बायोगैस क्लस्टर प्रबंधन डैशबोर्ड',
      subtitle: 'बायोगैस संचालन का रीयल-टाइम निगरानी और प्रबंधन',
      clusterOverview: 'क्लस्टर अवलोकन',
      totalGaushalas: 'कुल गौशालाएं',
      activeDigesters: 'सक्रिय डाइजेस्टर',
      totalBiogas: 'कुल बायोगैस (m³)',
      todayCollection: 'आज का संग्रह',
      pickupSchedule: 'पिकअप अनुसूची',
      alerts: 'अलर्ट',
      alertManagement: 'अलर्ट प्रबंधन',
      voiceSummary: 'आवाज सारांश',
      speaking: 'बोल रहा है...',
      speakCommand: 'एक कमांड बोलें',
      startListening: 'सुनना शुरू करें',
      stopListening: 'सुनना बंद करें',
      exportData: 'डेटा निर्यात करें',
      exportPDF: 'PDF निर्यात करें',
      exportExcel: 'Excel निर्यात करें',
      recentActivity: 'हाल की गतिविधि',
      systemHealth: 'सिस्टम स्वास्थ्य',
      performance: 'प्रदर्शन',
      revenue: 'राजस्व',
      carbonCredits: 'कार्बन क्रेडिट',
      totalBiogasLabel: 'कुल बायोगैस',
      dailyProduction: 'दैनिक उत्पादन',
      efficiency: 'दक्षता',
      activePlants: 'सक्रिय प्लांट',
      alertsLabel: 'अलर्ट',
      ch4Level: 'CH4 स्तर (मीथेन)',
      pressure: 'दबाव',
      temperature: 'तापमान',
      pickupScheduleLabel: 'पिकअप शेड्यूल',
      cluster: 'क्लस्टर',
      time: 'समय',
      truck: 'ट्रक',
      quantity: 'मात्रा',
      status: 'स्थिति',
      action: 'कार्य',
      scheduled: 'निर्धारित',
      edit: 'संपादित करें',
      newSchedule: 'नया शेड्यूल',
      quickActions: 'त्वरित कार्य',
      pickupScheduleAction: 'पिकअप शेड्यूल',
      clusterAnalysis: 'क्लस्टर विश्लेषण',
      alertManagementLabel: 'अलर्ट प्रबंधन',
      maintenance: 'रखरखाव'
    }
  };

  const t = translations[language]

  // Track module usage and update breadcrumbs for platform integration
  useEffect(() => {
    trackModuleUsage('urjasanyojak')
    updateBreadcrumbs([
      { label: 'UrjaSanyojak', url: '/', module: 'urjasanyojak' },
      { label: 'Dashboard', url: '/', module: 'urjasanyojak' }
    ])
  }, [])

  // Fetch real IoT data from backend
  const fetchIoTData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${IOT_API}/api/iot/devices?type=biogas_digester&gaushalaId=${user?.id}&status=ONLINE`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const devices = await response.json();
        if (devices.length > 0) {
          const device = devices[0];
          const newData: IoTData = {
            ch4: device.ch4Concentration || 0,
            pressure: device.pressure || 0,
            temperature: device.temperature || 0,
            timestamp: new Date(device.lastUpdate || Date.now())
          };
          setIotData(prev => [newData, ...prev.slice(0, 19)]); // Keep last 20 readings
        }
      }
    } catch (error) {
      console.error('Error fetching IoT data:', error);
    }
  };

  useEffect(() => {
    fetchIoTData(); // Initial fetch
    const interval = setInterval(fetchIoTData, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [user]);

  // Fetch pickup schedules from sales service
  const fetchPickupSchedules = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${SALES_API}/sales/schedules?gaushalaId=${user?.id}&type=pickup`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const schedules = await response.json();
        const pickupSchedules: PickupSchedule[] = schedules.map((schedule: any) => ({
          id: schedule.id,
          clusterId: schedule.clusterId || user?.clusterId,
          scheduledTime: new Date(schedule.scheduledTime),
          truckId: schedule.vehicleId || schedule.truckId,
          status: schedule.status?.toLowerCase() || 'scheduled',
          estimatedVolume: schedule.estimatedVolume || schedule.quantity
        }));
        setPickupSchedules(pickupSchedules);
      }
    } catch (error) {
      console.error('Error fetching pickup schedules:', error);
      setPickupSchedules([]);
    }
  };

  useEffect(() => {
    fetchPickupSchedules();
  }, [user]);

  // Fetch cluster metrics from production service
  const fetchClusterMetrics = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${BIOGAS_API}/production/metrics?gaushalaId=${user?.id}&timeframe=daily`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const metrics = await response.json();
        setClusterMetrics({
          totalBiogas: metrics.totalBiogas || 0,
          dailyProduction: metrics.dailyProduction || 0,
          efficiency: metrics.efficiency || (iotData[0]?.ch4 || 0),
          activePlants: metrics.activePlants || 0,
          alerts: metrics.alerts || 0
        });
      }
    } catch (error) {
      console.error('Error fetching cluster metrics:', error);
      // Fallback to IoT data if available
      if (iotData.length > 0) {
        const latest = iotData[0];
        setClusterMetrics(prev => ({
          ...prev,
          efficiency: latest.ch4,
          alerts: latest.pressure > 2.5 || latest.temperature > 40 ? 2 : 0
        }));
      }
    }
  };

  useEffect(() => {
    fetchClusterMetrics();
    const interval = setInterval(fetchClusterMetrics, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [user, iotData]);

  const speakSummary = () => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(
        `क्लस्टर सारांश: कुल बायोगैस ${Math.round(clusterMetrics.totalBiogas)} घन मीटर, दैनिक उत्पादन ${Math.round(clusterMetrics.dailyProduction)} घन मीटर, दक्षता ${Math.round(clusterMetrics.efficiency)} प्रतिशत, सक्रिय प्लांट ${clusterMetrics.activePlants}, अलर्ट ${clusterMetrics.alerts}`
      );
      utterance.lang = 'hi-IN';
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  const exportData = (format: 'pdf' | 'excel') => {
    // Export cluster data
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = fetch(`${BIOGAS_API}/production/export?gaushalaId=${user?.id}&format=${format}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      alert(`${format.toUpperCase()} export initiated for cluster data`);
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    }
  };

  const getStatusColor = (status: PickupSchedule['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: PickupSchedule['status']) => {
    switch (status) {
      case 'scheduled': return 'निर्धारित';
      case 'in-progress': return 'प्रगति में';
      case 'completed': return 'पूर्ण';
      case 'cancelled': return 'रद्द';
      default: return 'अज्ञात';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
      <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
          <p className="text-gray-600">BiogasSangh Cluster Manager Dashboard</p>
        </div>
        
        {/* Language Toggle */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          className="px-3 py-1 text-sm bg-white rounded-md shadow-sm border border-gray-200 hover:bg-gray-50"
        >
          {language === 'en' ? 'हिंदी' : 'English'}
        </button>
        <div className="flex gap-3">
          <button
            onClick={speakSummary}
            disabled={isSpeaking}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            <Volume2 className="h-4 w-4" />
            {isSpeaking ? t.speaking : t.voiceSummary}
          </button>
          <button
            onClick={() => exportData('pdf')}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Download className="h-4 w-4" />
            PDF
          </button>
          <button
            onClick={() => exportData('excel')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="h-4 w-4" />
            Excel
          </button>
        </div>
      </div>

      {/* Cluster Performance Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Zap className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{t.totalBiogasLabel}</dt>
                  <dd className="text-lg font-medium text-gray-900">{Math.round(clusterMetrics.totalBiogas)} m³</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{t.dailyProduction}</dt>
                  <dd className="text-lg font-medium text-gray-900">{Math.round(clusterMetrics.dailyProduction)} m³</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                <BarChart3 className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{t.efficiency}</dt>
                  <dd className="text-lg font-medium text-gray-900">{Math.round(clusterMetrics.efficiency)}%</dd>
                  </dl>
                </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Database className="h-6 w-6 text-orange-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{t.activePlants}</dt>
                  <dd className="text-lg font-medium text-gray-900">{clusterMetrics.activePlants}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{t.alertsLabel}</dt>
                  <dd className="text-lg font-medium text-gray-900">{clusterMetrics.alerts}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* IoT Real-time Data Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CH4 Levels Chart */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">{t.ch4Level}</h3>
            <div className="space-y-3">
              {iotData.slice(0, 10).map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-gray-600">
                      {data.timestamp.toLocaleTimeString('hi-IN')}
                        </span>
                      </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{data.ch4.toFixed(1)}%</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${data.ch4}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pressure and Temperature */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">{t.pressure} और {t.temperature}</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Gauge className="h-5 w-5 text-red-500" />
                  <span className="text-sm text-gray-600">{t.pressure}</span>
                </div>
                <span className="text-lg font-medium">{iotData[0]?.pressure.toFixed(2)} bar</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Thermometer className="h-5 w-5 text-orange-500" />
                  <span className="text-sm text-gray-600">{t.temperature}</span>
                </div>
                <span className="text-lg font-medium">{iotData[0]?.temperature.toFixed(1)}°C</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pickup Scheduling System */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">{t.pickupScheduleLabel}</h3>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {t.newSchedule}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.cluster}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.time}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.truck}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.quantity}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.status}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.action}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pickupSchedules.map((schedule) => (
                  <tr key={schedule.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {schedule.clusterId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.scheduledTime.toLocaleString('hi-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.truckId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.estimatedVolume} m³
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(schedule.status)}`}>
                        {getStatusText(schedule.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900">{t.edit}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">{t.quickActions}</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                  <Truck className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {t.pickupScheduleAction}
                </h3>
                <p className="mt-2 text-sm text-gray-500">नया पिकअप शेड्यूल बनाएं</p>
              </div>
            </button>

            <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                  <BarChart3 className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {t.clusterAnalysis}
                </h3>
                <p className="mt-2 text-sm text-gray-500">विस्तृत प्रदर्शन विश्लेषण</p>
              </div>
            </button>

            <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                  <AlertTriangle className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {t.alertManagementLabel}
                </h3>
                <p className="mt-2 text-sm text-gray-500">अलर्ट और सूचनाएं देखें</p>
              </div>
            </button>

            <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-orange-50 text-orange-700 ring-4 ring-white">
                  <Calendar className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {t.maintenance}
                </h3>
                <p className="mt-2 text-sm text-gray-500">रखरखाव शेड्यूल देखें</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
