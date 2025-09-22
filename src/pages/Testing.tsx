import { useState, useEffect } from 'react'
import { Play, Pause, CheckCircle, XCircle, AlertTriangle, Download, BookOpen, Code, Users, Settings, Database, Shield, Globe } from 'lucide-react'

interface TestResult {
  id: string;
  name: string;
  category: 'unit' | 'integration' | 'e2e' | 'performance' | 'security';
  status: 'passed' | 'failed' | 'running' | 'pending';
  duration: number;
  timestamp: Date;
  details: string;
  error?: string;
}

interface TestSuite {
  name: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  status: 'running' | 'completed' | 'failed';
  lastRun: Date;
}

interface Deployment {
  id: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  timestamp: Date;
  deployedBy: string;
  rollbackVersion?: string;
}

interface APIDoc {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  parameters: string[];
  response: string;
  status: 'stable' | 'beta' | 'deprecated';
}

export default function Testing() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [coverage, setCoverage] = useState<Coverage>({
    lines: 0,
    functions: 0,
    branches: 0,
    statements: 0
  });
  const [selectedTestSuite, setSelectedTestSuite] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const translations = {
    en: {
      title: 'QA Testing Dashboard',
      subtitle: 'Test execution, coverage analysis, and quality assurance',
      testOverview: 'Test Overview',
      totalTests: 'Total Tests',
      passedTests: 'Passed Tests',
      failedTests: 'Failed Tests',
      testCoverage: 'Test Coverage',
      lines: 'Lines',
      functions: 'Functions',
      branches: 'Branches',
      statements: 'Statements',
      testSuites: 'Test Suites',
      searchTests: 'Search tests...',
      filterByStatus: 'Filter by status',
      all: 'All',
      passed: 'Passed',
      failed: 'Failed',
      running: 'Running',
      skipped: 'Skipped',
      runAllTests: 'Run All Tests',
      exportResults: 'Export Results',
      exportPDF: 'Export PDF',
      exportExcel: 'Export Excel',
      recentResults: 'Recent Results',
      testName: 'Test Name',
      suite: 'Suite',
      status: 'Status',
      duration: 'Duration',
      timestamp: 'Timestamp',
      actions: 'Actions',
      view: 'View',
      rerun: 'Rerun',
      debug: 'Debug',
      testExecution: 'Test Execution',
      coverageReport: 'Coverage Report',
      qualityMetrics: 'Quality Metrics',
      quickActions: 'Quick Actions',
      runTests: 'Run Tests',
      runTestsDescription: 'Execute test suite',
      stopTests: 'Stop Tests',
      coverageAnalysis: 'Coverage Analysis',
      coverageAnalysisDescription: 'Analyze code coverage',
      bugReport: 'Bug Report',
      bugReportDescription: 'Create bug report',
      performanceTest: 'Performance Test',
      performanceTestDescription: 'Run performance tests'
    },
    hi: {
      title: 'QA टेस्टिंग डैशबोर्ड',
      subtitle: 'टेस्ट निष्पादन, कवरेज विश्लेषण और गुणवत्ता आश्वासन',
      testOverview: 'टेस्ट अवलोकन',
      totalTests: 'कुल टेस्ट',
      passedTests: 'पास किए गए टेस्ट',
      failedTests: 'फेल किए गए टेस्ट',
      testCoverage: 'टेस्ट कवरेज',
      lines: 'लाइनें',
      functions: 'फंक्शन',
      branches: 'ब्रांच',
      statements: 'स्टेटमेंट',
      testSuites: 'टेस्ट सूट',
      searchTests: 'टेस्ट खोजें...',
      filterByStatus: 'स्थिति के अनुसार फ़िल्टर करें',
      all: 'सभी',
      passed: 'पास',
      failed: 'फेल',
      running: 'चल रहा है',
      skipped: 'छोड़ा गया',
      runAllTests: 'सभी टेस्ट चलाएं',
      exportResults: 'परिणाम निर्यात करें',
      exportPDF: 'PDF निर्यात करें',
      exportExcel: 'Excel निर्यात करें',
      recentResults: 'हाल के परिणाम',
      testName: 'टेस्ट नाम',
      suite: 'सूट',
      status: 'स्थिति',
      duration: 'अवधि',
      timestamp: 'समयांक',
      actions: 'कार्य',
      view: 'देखें',
      rerun: 'फिर से चलाएं',
      debug: 'डीबग करें',
      testExecution: 'टेस्ट निष्पादन',
      coverageReport: 'कवरेज रिपोर्ट',
      qualityMetrics: 'गुणवत्ता मेट्रिक्स',
      quickActions: 'त्वरित कार्य',
      runTests: 'टेस्ट चलाएं',
      runTestsDescription: 'टेस्ट सूट निष्पादित करें',
      stopTests: 'टेस्ट रोकें',
      coverageAnalysis: 'कवरेज विश्लेषण',
      coverageAnalysisDescription: 'कोड कवरेज का विश्लेषण करें',
      bugReport: 'बग रिपोर्ट',
      bugReportDescription: 'बग रिपोर्ट बनाएं',
      performanceTest: 'प्रदर्शन टेस्ट',
      performanceTestDescription: 'प्रदर्शन टेस्ट चलाएं'
    }
  };

  const t = translations[language];

  // Mock test results
  useEffect(() => {
    const mockResults: TestResult[] = [
      {
        id: '1',
        name: 'User Authentication Test',
        category: 'unit',
        status: 'passed',
        duration: 150,
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        details: 'User login, logout, and session management working correctly'
      },
      {
        id: '2',
        name: 'Cattle Management API Test',
        category: 'integration',
        status: 'passed',
        duration: 320,
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
        details: 'CRUD operations for cattle data working with database'
      },
      {
        id: '3',
        name: 'IoT Data Ingestion Test',
        category: 'integration',
        status: 'failed',
        duration: 180,
        timestamp: new Date(Date.now() - 12 * 60 * 1000),
        details: 'Data validation and storage working',
        error: 'Timeout on large dataset processing'
      },
      {
        id: '4',
        name: 'Mobile App Performance Test',
        category: 'performance',
        status: 'passed',
        duration: 450,
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        details: 'App loads within 2 seconds, smooth navigation'
      },
      {
        id: '5',
        name: 'Security Vulnerability Scan',
        category: 'security',
        status: 'passed',
        duration: 600,
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
        details: 'No critical vulnerabilities found, authentication secure'
      }
    ];
    setTestResults(mockResults);
  }, []);

  // Mock test suites
  useEffect(() => {
    const mockSuites: TestSuite[] = [
      {
        name: 'Unit Tests',
        totalTests: 45,
        passedTests: 43,
        failedTests: 2,
        status: 'completed',
        lastRun: new Date(Date.now() - 10 * 60 * 1000)
      },
      {
        name: 'Integration Tests',
        totalTests: 28,
        passedTests: 26,
        failedTests: 2,
        status: 'completed',
        lastRun: new Date(Date.now() - 15 * 60 * 1000)
      },
      {
        name: 'End-to-End Tests',
        totalTests: 15,
        passedTests: 15,
        failedTests: 0,
        status: 'completed',
        lastRun: new Date(Date.now() - 25 * 60 * 1000)
      },
      {
        name: 'Performance Tests',
        totalTests: 8,
        passedTests: 8,
        failedTests: 0,
        status: 'completed',
        lastRun: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        name: 'Security Tests',
        totalTests: 12,
        passedTests: 12,
        failedTests: 0,
        status: 'completed',
        lastRun: new Date(Date.now() - 35 * 60 * 1000)
      }
    ];
    setTestSuites(mockSuites);
  }, []);

  // Mock deployments
  useEffect(() => {
    const mockDeployments: Deployment[] = [
      {
        id: '1',
        version: 'v1.2.0',
        environment: 'production',
        status: 'completed',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        deployedBy: 'DevOps Team'
      },
      {
        id: '2',
        version: 'v1.1.5',
        environment: 'staging',
        status: 'completed',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        deployedBy: 'QA Team'
      },
      {
        id: '3',
        version: 'v1.2.1',
        environment: 'development',
        status: 'in-progress',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        deployedBy: 'Development Team'
      }
    ];
    setDeployments(mockDeployments);
  }, []);

  // Mock API documentation
  useEffect(() => {
    const mockAPIs: APIDoc[] = [
      {
        endpoint: '/api/auth/login',
        method: 'POST',
        description: 'User authentication endpoint',
        parameters: ['email', 'password'],
        response: '{ "token": "jwt_token", "user": {...} }',
        status: 'stable'
      },
      {
        endpoint: '/api/cattle',
        method: 'GET',
        description: 'Retrieve cattle information',
        parameters: ['limit', 'offset', 'search'],
        response: '{ "cattle": [...], "total": 100 }',
        status: 'stable'
      },
      {
        endpoint: '/api/iot/weight',
        method: 'POST',
        description: 'IoT weight data ingestion',
        parameters: ['tagId', 'weight', 'timestamp'],
        response: '{ "status": "success", "id": "..." }',
        status: 'beta'
      },
      {
        endpoint: '/api/cluster/metrics',
        method: 'GET',
        description: 'Get cluster performance metrics',
        parameters: ['clusterId', 'dateRange'],
        response: '{ "metrics": {...}, "trends": [...] }',
        status: 'stable'
      }
    ];
    setApiDocs(mockAPIs);
  }, []);

  const runTests = () => {
    setIsRunningTests(true);
    // Simulate test execution
    setTimeout(() => {
      setIsRunningTests(false);
      // Update test results
      const updatedResults = testResults.map(result => ({
        ...result,
        status: Math.random() > 0.1 ? 'passed' : 'failed',
        timestamp: new Date()
      }));
      setTestResults(updatedResults);
    }, 5000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      case 'running': return <Play className="h-4 w-4" />;
      case 'pending': return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'unit': return 'bg-blue-100 text-blue-800';
      case 'integration': return 'bg-green-100 text-green-800';
      case 'e2e': return 'bg-purple-100 text-purple-800';
      case 'performance': return 'bg-orange-100 text-orange-800';
      case 'security': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeploymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAPIStatusColor = (status: string) => {
    switch (status) {
      case 'stable': return 'bg-green-100 text-green-800';
      case 'beta': return 'bg-yellow-100 text-yellow-800';
      case 'deprecated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTestResults = testResults.filter(result => 
    selectedCategory === 'all' || result.category === selectedCategory
  );

  const totalTests = testSuites.reduce((sum, suite) => sum + suite.totalTests, 0);
  const totalPassed = testSuites.reduce((sum, suite) => sum + suite.passedTests, 0);
  const totalFailed = testSuites.reduce((sum, suite) => sum + suite.failedTests, 0);
  const successRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="px-3 py-1 text-sm bg-white rounded-md shadow-sm border border-gray-200 hover:bg-gray-50"
          >
            {language === 'en' ? 'हिंदी' : 'English'}
          </button>
          <button
            onClick={runTests}
            disabled={isRunningTests}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isRunningTests ? <Pause className="h-4 w-4 inline mr-2" /> : <Play className="h-4 w-4 inline mr-2" />}
            {isRunningTests ? t.stopTests : t.runTests}
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="h-4 w-4 inline mr-2" />
            {t.exportResults}
          </button>
        </div>
      </div>

      {/* Test Summary */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">कुल परीक्षण</dt>
                  <dd className="text-lg font-medium text-gray-900">{totalTests}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">सफल परीक्षण</dt>
                  <dd className="text-lg font-medium text-gray-900">{totalPassed}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">विफल परीक्षण</dt>
                  <dd className="text-lg font-medium text-gray-900">{totalFailed}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">सफलता दर</dt>
                  <dd className="text-lg font-medium text-gray-900">{successRate}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">परीक्षण परिणाम</h3>
            <div className="flex gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">सभी श्रेणियां</option>
                <option value="unit">Unit Tests</option>
                <option value="integration">Integration Tests</option>
                <option value="e2e">End-to-End Tests</option>
                <option value="performance">Performance Tests</option>
                <option value="security">Security Tests</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">परीक्षण नाम</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">श्रेणी</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">स्थिति</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">अवधि</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">समय</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">कार्य</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTestResults.map((result) => (
                  <tr key={result.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{result.name}</div>
                      <div className="text-sm text-gray-500">{result.details}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(result.category)}`}>
                        {result.category.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(result.status)}`}>
                        {getStatusIcon(result.status)}
                        <span className="ml-1">{result.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.duration}ms
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.timestamp.toLocaleString('hi-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">देखें</button>
                      <button className="text-green-600 hover:text-green-900">पुनः चलाएं</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Test Suites and Deployments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Suites */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">परीक्षण सूट</h3>
            <div className="space-y-4">
              {testSuites.map((suite, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{suite.name}</h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      suite.status === 'completed' ? 'bg-green-100 text-green-800' :
                      suite.status === 'running' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {suite.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span>Total: {suite.totalTests}</span>
                    <span>Passed: {suite.passedTests}</span>
                    <span>Failed: {suite.failedTests}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Last run: {suite.lastRun.toLocaleString('hi-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Deployments */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">परिनियोजन इतिहास</h3>
            <div className="space-y-4">
              {deployments.map((deployment) => (
                <div key={deployment.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">v{deployment.version}</h4>
                      <p className="text-xs text-gray-500">{deployment.environment}</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDeploymentStatusColor(deployment.status)}`}>
                      {deployment.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Deployed by: {deployment.deployedBy}<br />
                    Time: {deployment.timestamp.toLocaleString('hi-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* API Documentation */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">API दस्तावेज़ीकरण</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">एंडपॉइंट</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">विधि</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">विवरण</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">स्थिति</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">कार्य</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {apiDocs.map((api, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {api.endpoint}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        api.method === 'GET' ? 'bg-green-100 text-green-800' :
                        api.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                        api.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {api.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {api.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAPIStatusColor(api.status)}`}>
                        {api.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">देखें</button>
                      <button className="text-green-600 hover:text-green-900">टेस्ट</button>
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
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">त्वरित कार्य</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                  <Play className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  परीक्षण चलाएं
                </h3>
                <p className="mt-2 text-sm text-gray-500">सभी परीक्षण सूट चलाएं</p>
              </div>
            </button>

            <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                  <BookOpen className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  दस्तावेज़
                
                </h3>
                <p className="mt-2 text-sm text-gray-500">API दस्तावेज़ देखें</p>
              </div>
            </button>

            <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                  <Globe className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  परिनियोजन
                
                </h3>
                <p className="mt-2 text-sm text-gray-500">नया परिनियोजन शुरू करें</p>
              </div>
            </button>

            <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-orange-50 text-orange-700 ring-4 ring-white">
                  <Users className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  प्रशिक्षण
                
                </h3>
                <p className="mt-2 text-sm text-gray-500">प्रशिक्षण सामग्री</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
