import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Table, Tooltip, Space, Select, DatePicker } from 'antd';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';
import { 
  TrophyOutlined, FireOutlined, DollarOutlined, TeamOutlined,
  LeafOutlined, ThunderboltOutlined, SafetyOutlined, GlobalOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface KPIData {
  // Production KPIs
  totalBiogasProduction: number;
  biogasProductionTrend: Array<{ date: string; volume: number; efficiency: number }>;
  averageEfficiency: number;
  qualityGrade: string;
  
  // Financial KPIs
  totalRevenue: number;
  farmerPayouts: number;
  carbonCreditRevenue: number;
  subsidyAmount: number;
  profitMargin: number;
  
  // Farmer Cooperative KPIs
  activeFarmers: number;
  totalContributions: number;
  averageContributionPerFarmer: number;
  topPerformers: Array<{
    farmerId: string;
    farmerName: string;
    contribution: number;
    efficiency: number;
    earnings: number;
  }>;
  
  // Environmental Impact
  co2Reduced: number;
  methaneRecovered: number;
  wasteProcessed: number;
  carbonCreditsGenerated: number;
  
  // Operational KPIs
  plantUtilization: number;
  downtimeHours: number;
  maintenanceScheduled: number;
  qualityChecks: number;
  
  // Government Compliance
  pesoCompliance: boolean;
  gstFiled: boolean;
  subsidyClaims: number;
  environmentalReports: number;
}

const BiogasKPIDashboard: React.FC = () => {
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedFarmerCluster, setSelectedFarmerCluster] = useState('all');
  const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment]>([
    moment().subtract(7, 'days'),
    moment()
  ]);

  useEffect(() => {
    fetchKPIData();
    const interval = setInterval(fetchKPIData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [timeRange, selectedFarmerCluster, dateRange]);

  const fetchKPIData = async () => {
    try {
      setLoading(true);
      // Mock API call - in real implementation, this would fetch from backend
      const mockData: KPIData = {
        // Production KPIs
        totalBiogasProduction: 15420, // m³
        biogasProductionTrend: generateMockTrendData(),
        averageEfficiency: 94.2, // %
        qualityGrade: 'Premium',
        
        // Financial KPIs  
        totalRevenue: 1250000, // ₹
        farmerPayouts: 875000, // ₹
        carbonCreditRevenue: 125000, // ₹
        subsidyAmount: 200000, // ₹
        profitMargin: 18.5, // %
        
        // Farmer Cooperative KPIs
        activeFarmers: 147,
        totalContributions: 89500, // kg of dung
        averageContributionPerFarmer: 608, // kg per farmer
        topPerformers: [
          { farmerId: 'F001', farmerName: 'राम कुमार', contribution: 2450, efficiency: 96.8, earnings: 18750 },
          { farmerId: 'F042', farmerName: 'सुरेश पटेल', contribution: 2280, efficiency: 95.2, earnings: 17400 },
          { farmerId: 'F078', farmerName: 'देवी प्रसाद', contribution: 2100, efficiency: 94.8, earnings: 16800 },
          { farmerId: 'F123', farmerName: 'गोपाल शर्मा', contribution: 1950, efficiency: 93.5, earnings: 15600 },
          { farmerId: 'F089', farmerName: 'मोहन गुप्ता', contribution: 1850, efficiency: 92.1, earnings: 14750 },
        ],
        
        // Environmental Impact
        co2Reduced: 45.8, // tonnes
        methaneRecovered: 18.2, // tonnes
        wasteProcessed: 125400, // kg
        carbonCreditsGenerated: 142,
        
        // Operational KPIs
        plantUtilization: 87.3, // %
        downtimeHours: 8.5,
        maintenanceScheduled: 3,
        qualityChecks: 28,
        
        // Government Compliance
        pesoCompliance: true,
        gstFiled: true,
        subsidyClaims: 5,
        environmentalReports: 2,
      };
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setKpiData(mockData);
    } catch (error) {
      console.error('Error fetching KPI data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockTrendData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      data.push({
        date: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        volume: Math.floor(Math.random() * 2000) + 1500,
        efficiency: Math.floor(Math.random() * 10) + 90,
      });
    }
    return data;
  };

  if (!kpiData) {
    return <div>Loading...</div>;
  }

  const topPerformersColumns = [
    {
      title: 'रैंक',
      key: 'rank',
      render: (_: any, __: any, index: number) => (
        <span style={{ fontWeight: 'bold', color: index < 3 ? '#faad14' : '#666' }}>
          #{index + 1}
        </span>
      ),
      width: 60,
    },
    {
      title: 'किसान का नाम',
      dataIndex: 'farmerName',
      key: 'farmerName',
      render: (name: string, record: any) => (
        <Space>
          {record.farmerId === 'F001' && <TrophyOutlined style={{ color: '#faad14' }} />}
          <span style={{ fontWeight: 'bold' }}>{name}</span>
        </Space>
      ),
    },
    {
      title: 'योगदान (kg)',
      dataIndex: 'contribution',
      key: 'contribution',
      render: (value: number) => (
        <span style={{ fontWeight: 'bold', color: '#52c41a' }}>
          {value.toLocaleString('hi-IN')}
        </span>
      ),
    },
    {
      title: 'दक्षता',
      dataIndex: 'efficiency',
      key: 'efficiency',
      render: (value: number) => (
        <Progress 
          percent={value} 
          size="small" 
          strokeColor={value > 95 ? '#52c41a' : value > 90 ? '#faad14' : '#ff7875'}
        />
      ),
    },
    {
      title: 'कमाई (₹)',
      dataIndex: 'earnings',
      key: 'earnings',
      render: (value: number) => (
        <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
          ₹{value.toLocaleString('hi-IN')}
        </span>
      ),
    },
  ];

  const pieChartData = [
    { name: 'किसान भुगतान', value: kpiData.farmerPayouts, color: '#52c41a' },
    { name: 'कार्बन क्रेडिट', value: kpiData.carbonCreditRevenue, color: '#1890ff' },
    { name: 'सब्सिडी', value: kpiData.subsidyAmount, color: '#faad14' },
    { name: 'अन्य आय', value: kpiData.totalRevenue - kpiData.farmerPayouts - kpiData.carbonCreditRevenue - kpiData.subsidyAmount, color: '#722ed1' },
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5' }}>
      {/* Header */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={12}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1890ff', margin: 0 }}>
            🐄 BioSangh सहकारी डैशबोर्ड
          </h1>
          <p style={{ color: '#666', fontSize: '16px', margin: '4px 0' }}>
            वास्तविक समय बायोगैस उत्पादन निगरानी
          </p>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <Space>
            <Select
              value={selectedFarmerCluster}
              onChange={setSelectedFarmerCluster}
              style={{ width: 150 }}
            >
              <Option value="all">सभी क्लस्टर</Option>
              <Option value="cluster1">क्लस्टर 1</Option>
              <Option value="cluster2">क्लस्टर 2</Option>
            </Select>
            <Select value={timeRange} onChange={setTimeRange} style={{ width: 120 }}>
              <Option value="1d">1 दिन</Option>
              <Option value="7d">7 दिन</Option>
              <Option value="30d">30 दिन</Option>
            </Select>
          </Space>
        </Col>
      </Row>

      {/* Key Production Metrics */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title={<span style={{ color: '#666', fontWeight: 'bold' }}>कुल बायोगैस उत्पादन</span>}
              value={kpiData.totalBiogasProduction}
              suffix="m³"
              valueStyle={{ color: '#52c41a', fontSize: '32px' }}
              prefix={<FireOutlined />}
            />
            <Progress 
              percent={Math.round((kpiData.totalBiogasProduction / 18000) * 100)} 
              strokeColor="#52c41a"
              showInfo={false}
              style={{ marginTop: '8px' }}
            />
            <div style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
              लक्ष्य: 18,000 m³
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={<span style={{ color: '#666', fontWeight: 'bold' }}>औसत दक्षता</span>}
              value={kpiData.averageEfficiency}
              suffix="%"
              valueStyle={{ color: '#1890ff', fontSize: '32px' }}
              prefix={<ThunderboltOutlined />}
            />
            <Progress 
              percent={kpiData.averageEfficiency} 
              strokeColor="#1890ff"
              showInfo={false}
              style={{ marginTop: '8px' }}
            />
            <div style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
              गुणवत्ता ग्रेड: {kpiData.qualityGrade}
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={<span style={{ color: '#666', fontWeight: 'bold' }}>सक्रिय किसान</span>}
              value={kpiData.activeFarmers}
              valueStyle={{ color: '#faad14', fontSize: '32px' }}
              prefix={<TeamOutlined />}
            />
            <div style={{ marginTop: '16px', color: '#666', fontSize: '12px' }}>
              औसत योगदान: {kpiData.averageContributionPerFarmer} kg/किसान
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={<span style={{ color: '#666', fontWeight: 'bold' }}>कुल राजस्व</span>}
              value={kpiData.totalRevenue}
              prefix="₹"
              valueStyle={{ color: '#722ed1', fontSize: '32px' }}
            />
            <div style={{ marginTop: '8px', color: '#52c41a', fontSize: '14px', fontWeight: 'bold' }}>
              लाभ मार्जिन: {kpiData.profitMargin}%
            </div>
          </Card>
        </Col>
      </Row>

      {/* Environmental Impact */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title={<span style={{ color: '#666', fontWeight: 'bold' }}>CO₂ कमी</span>}
              value={kpiData.co2Reduced}
              suffix="टन"
              valueStyle={{ color: '#52c41a', fontSize: '24px' }}
              prefix={<LeafOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={<span style={{ color: '#666', fontWeight: 'bold' }}>मीथेन रिकवरी</span>}
              value={kpiData.methaneRecovered}
              suffix="टन"
              valueStyle={{ color: '#1890ff', fontSize: '24px' }}
              prefix={<GlobalOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={<span style={{ color: '#666', fontWeight: 'bold' }}>कचरा प्रसंस्कृत</span>}
              value={kpiData.wasteProcessed / 1000}
              suffix="टन"
              valueStyle={{ color: '#faad14', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={<span style={{ color: '#666', fontWeight: 'bold' }}>कार्बन क्रेडिट</span>}
              value={kpiData.carbonCreditsGenerated}
              valueStyle={{ color: '#722ed1', fontSize: '24px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={16}>
          <Card title={<span style={{ fontWeight: 'bold' }}>बायोगैस उत्पादन प्रवृत्ति</span>}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={kpiData.biogasProductionTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => moment(value).format('DD/MM')}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => moment(value).format('DD MMMM YYYY')}
                  formatter={(value: number, name: string) => [
                    `${value} ${name === 'volume' ? 'm³' : '%'}`,
                    name === 'volume' ? 'उत्पादन' : 'दक्षता'
                  ]}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#52c41a" 
                  strokeWidth={3}
                  name="उत्पादन (m³)"
                />
                <Line 
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="#1890ff" 
                  strokeWidth={2}
                  name="दक्षता (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={8}>
          <Card title={<span style={{ fontWeight: 'bold' }}>राजस्व वितरण</span>}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`₹${value.toLocaleString('hi-IN')}`, 'राशि']}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Top Performers */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={16}>
          <Card title={<span style={{ fontWeight: 'bold' }}>🏆 शीर्ष प्रदर्शनकारी किसान</span>}>
            <Table
              dataSource={kpiData.topPerformers}
              columns={topPerformersColumns}
              pagination={false}
              size="small"
              rowKey="farmerId"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title={<span style={{ fontWeight: 'bold' }}>🛡️ अनुपालन स्थिति</span>}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>PESO अनुपालन</span>
                  <span style={{ color: kpiData.pesoCompliance ? '#52c41a' : '#ff4d4f' }}>
                    {kpiData.pesoCompliance ? '✅ पूर्ण' : '❌ लंबित'}
                  </span>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>GST फाइलिंग</span>
                  <span style={{ color: kpiData.gstFiled ? '#52c41a' : '#ff4d4f' }}>
                    {kpiData.gstFiled ? '✅ दाखिल' : '❌ लंबित'}
                  </span>
                </div>
              </div>
              <Statistic
                title="सब्सिडी दावे"
                value={kpiData.subsidyClaims}
                valueStyle={{ color: '#1890ff' }}
              />
              <Statistic
                title="पर्यावरण रिपोर्ट"
                value={kpiData.environmentalReports}
                valueStyle={{ color: '#52c41a' }}
              />
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Operational Status */}
      <Row gutter={16}>
        <Col span={24}>
          <Card title={<span style={{ fontWeight: 'bold' }}>⚙️ परिचालन स्थिति</span>}>
            <Row gutter={16}>
              <Col span={6}>
                <Statistic
                  title="प्लांट उपयोग"
                  value={kpiData.plantUtilization}
                  suffix="%"
                  valueStyle={{ color: '#1890ff' }}
                />
                <Progress 
                  percent={kpiData.plantUtilization} 
                  strokeColor="#1890ff"
                  style={{ marginTop: '8px' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="डाउनटाइम घंटे"
                  value={kpiData.downtimeHours}
                  suffix="hrs"
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="निर्धारित रखरखाव"
                  value={kpiData.maintenanceScheduled}
                  valueStyle={{ color: '#faad14' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="गुणवत्ता जांच"
                  value={kpiData.qualityChecks}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Real-time update indicator */}
      <div style={{ 
        position: 'fixed', 
        bottom: '24px', 
        right: '24px',
        background: '#52c41a',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 'bold'
      }}>
        🔄 वास्तविक समय अपडेट - अंतिम: {moment().format('HH:mm:ss')}
      </div>
    </div>
  );
};

export default BiogasKPIDashboard;