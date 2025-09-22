import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Database, 
  Server, 
  Shield, 
  Network, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Settings,
  Play,
  Pause,
  RotateCcw,
  Download,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';

interface DatabaseConfig {
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
  maxConnections: number;
  sharedBuffers: string;
  effectiveCacheSize: string;
  workMemory: string;
  maintenanceWorkMemory: string;
  checkpointSegments: number;
  walBuffers: string;
}

interface SchemaConfig {
  name: string;
  status: 'pending' | 'creating' | 'completed' | 'error';
  permissions: string[];
  isolationLevel: string;
  userAccounts: string[];
}

interface EntityModel {
  schema: string;
  table: string;
  columns: string[];
  status: 'pending' | 'created' | 'error';
}

const DatabaseSetup: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [activeTab, setActiveTab] = useState('overview');
  const [setupProgress, setSetupProgress] = useState(0);
  const [isSetupRunning, setIsSetupRunning] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [dbConfig, setDbConfig] = useState<DatabaseConfig>({
    host: 'localhost',
    port: '5432',
    database: 'saubhagya_db',
    username: 'postgres',
    password: '',
    maxConnections: 200,
    sharedBuffers: '25%',
    effectiveCacheSize: '75%',
    workMemory: '4MB',
    maintenanceWorkMemory: '64MB',
    checkpointSegments: 32,
    walBuffers: '16MB'
  });

  const [schemas, setSchemas] = useState<SchemaConfig[]>([
    { name: 'auth_schema', status: 'pending', permissions: ['SELECT', 'INSERT', 'UPDATE'], isolationLevel: 'READ_COMMITTED', userAccounts: ['auth_service'] },
    { name: 'iot_schema', status: 'pending', permissions: ['SELECT', 'INSERT', 'UPDATE'], isolationLevel: 'READ_COMMITTED', userAccounts: ['iot_service'] },
    { name: 'transaction_schema', status: 'pending', permissions: ['SELECT', 'INSERT', 'UPDATE'], isolationLevel: 'READ_COMMITTED', userAccounts: ['transaction_service'] },
    { name: 'sales_schema', status: 'pending', permissions: ['SELECT', 'INSERT', 'UPDATE'], isolationLevel: 'READ_COMMITTED', userAccounts: ['sales_service'] },
    { name: 'reporting_schema', status: 'pending', permissions: ['SELECT', 'INSERT'], isolationLevel: 'READ_COMMITTED', userAccounts: ['reporting_service'] }
  ]);

  const [entityModels, setEntityModels] = useState<EntityModel[]>([
    { schema: 'auth_schema', table: 'users', columns: ['id', 'phone', 'name', 'locale', 'created_at', 'updated_at', 'aadhaar_hash'], status: 'pending' },
    { schema: 'auth_schema', table: 'roles', columns: ['id', 'name', 'description', 'permissions', 'government_access_level'], status: 'pending' },
    { schema: 'iot_schema', table: 'devices', columns: ['id', 'type', 'serial_number', 'gaushala_id', 'protocol', 'firmware_version'], status: 'pending' },
    { schema: 'transaction_schema', table: 'farmers', columns: ['id', 'user_id', 'gaushala_id', 'bank_details', 'payout_preferences'], status: 'pending' },
    { schema: 'sales_schema', table: 'buyers', columns: ['id', 'name', 'company', 'gst_number', 'contact_person'], status: 'pending' },
    { schema: 'reporting_schema', table: 'daily_reports', columns: ['id', 'date', 'gaushala_id', 'total_contributions', 'total_weight'], status: 'pending' }
  ]);

  const translations = {
    en: {
      title: 'PostgreSQL Database Setup & Schemas',
      subtitle: 'Configure database infrastructure for microservices architecture',
      overview: 'Overview',
      configuration: 'Configuration',
      schemas: 'Schemas',
      entities: 'Entities',
      monitoring: 'Monitoring',
      startSetup: 'Start Setup',
      pauseSetup: 'Pause Setup',
      resetSetup: 'Reset Setup',
      databaseConfig: 'Database Configuration',
      connectionPooling: 'Connection Pooling',
      securitySettings: 'Security Settings',
      schemaCreation: 'Schema Creation',
      entityModels: 'Entity Models',
      migrationSetup: 'Migration Setup',
      performanceMetrics: 'Performance Metrics',
      connectionStatus: 'Connection Status',
      activeConnections: 'Active Connections',
      poolSize: 'Pool Size',
      responseTime: 'Response Time',
      migrationStatus: 'Migration Status',
      schemaStatus: 'Schema Status',
      entityStatus: 'Entity Status',
      completed: 'Completed',
      pending: 'Pending',
      error: 'Error',
      creating: 'Creating',
      testConnection: 'Test Connection',
      saveConfig: 'Save Configuration',
      applyChanges: 'Apply Changes',
      createSchemas: 'Create Schemas',
      createEntities: 'Create Entities',
      runMigrations: 'Run Migrations',
      backupDatabase: 'Backup Database',
      restoreDatabase: 'Restore Database',
      viewLogs: 'View Logs',
      connectionPool: 'Connection Pool',
      healthCheck: 'Health Check',
      leakDetection: 'Leak Detection',
      validationQueries: 'Validation Queries',
      rowLevelSecurity: 'Row Level Security',
      auditLogging: 'Audit Logging',
      crossSchemaAccess: 'Cross Schema Access',
      performanceOptimization: 'Performance Optimization',
      resourceAllocation: 'Resource Allocation',
      backupRecovery: 'Backup & Recovery',
      monitoringAlerts: 'Monitoring & Alerts'
    },
    hi: {
      title: 'PostgreSQL डेटाबेस सेटअप और स्कीमा',
      subtitle: 'माइक्रोसर्विसेज आर्किटेक्चर के लिए डेटाबेस इन्फ्रास्ट्रक्चर कॉन्फ़िगर करें',
      overview: 'अवलोकन',
      configuration: 'कॉन्फ़िगरेशन',
      schemas: 'स्कीमा',
      entities: 'एंटिटी',
      monitoring: 'मॉनिटरिंग',
      startSetup: 'सेटअप शुरू करें',
      pauseSetup: 'सेटअप रोकें',
      resetSetup: 'सेटअप रीसेट करें',
      databaseConfig: 'डेटाबेस कॉन्फ़िगरेशन',
      connectionPooling: 'कनेक्शन पूलिंग',
      securitySettings: 'सुरक्षा सेटिंग्स',
      schemaCreation: 'स्कीमा निर्माण',
      entityModels: 'एंटिटी मॉडल',
      migrationSetup: 'माइग्रेशन सेटअप',
      performanceMetrics: 'प्रदर्शन मेट्रिक्स',
      connectionStatus: 'कनेक्शन स्थिति',
      activeConnections: 'सक्रिय कनेक्शन',
      poolSize: 'पूल आकार',
      responseTime: 'प्रतिक्रिया समय',
      migrationStatus: 'माइग्रेशन स्थिति',
      schemaStatus: 'स्कीमा स्थिति',
      entityStatus: 'एंटिटी स्थिति',
      completed: 'पूर्ण',
      pending: 'लंबित',
      error: 'त्रुटि',
      creating: 'बन रहा है',
      testConnection: 'कनेक्शन टेस्ट करें',
      saveConfig: 'कॉन्फ़िगरेशन सहेजें',
      applyChanges: 'परिवर्तन लागू करें',
      createSchemas: 'स्कीमा बनाएं',
      createEntities: 'एंटिटी बनाएं',
      runMigrations: 'माइग्रेशन चलाएं',
      backupDatabase: 'डेटाबेस बैकअप',
      restoreDatabase: 'डेटाबेस पुनर्स्थापित करें',
      viewLogs: 'लॉग देखें',
      connectionPool: 'कनेक्शन पूल',
      healthCheck: 'स्वास्थ्य जांच',
      leakDetection: 'लीक डिटेक्शन',
      validationQueries: 'वैलिडेशन क्वेरी',
      rowLevelSecurity: 'पंक्ति स्तर सुरक्षा',
      auditLogging: 'ऑडिट लॉगिंग',
      crossSchemaAccess: 'क्रॉस स्कीमा एक्सेस',
      performanceOptimization: 'प्रदर्शन अनुकूलन',
      resourceAllocation: 'संसाधन आवंटन',
      backupRecovery: 'बैकअप और रिकवरी',
      monitoringAlerts: 'मॉनिटरिंग और अलर्ट'
    }
  };

  const t = translations[language];

  const handleConfigChange = (field: keyof DatabaseConfig, value: string | number) => {
    setDbConfig(prev => ({ ...prev, [field]: value }));
  };

  const startSetup = async () => {
    setIsSetupRunning(true);
    setSetupProgress(0);
    
    // Simulate setup process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSetupProgress(i);
      
      if (i === 30) {
        // Update schema status
        setSchemas(prev => prev.map(schema => ({ ...schema, status: 'creating' as const })));
      } else if (i === 60) {
        // Update entity status
        setEntityModels(prev => prev.map(entity => ({ ...entity, status: 'creating' as const })));
      } else if (i === 90) {
        // Mark as completed
        setSchemas(prev => prev.map(schema => ({ ...schema, status: 'completed' as const })));
        setEntityModels(prev => prev.map(entity => ({ ...entity, status: 'created' as const })));
      }
    }
    
    setIsSetupRunning(false);
  };

  const pauseSetup = () => {
    setIsSetupRunning(false);
  };

  const resetSetup = () => {
    setSetupProgress(0);
    setIsSetupRunning(false);
    setSchemas(prev => prev.map(schema => ({ ...schema, status: 'pending' as const })));
    setEntityModels(prev => prev.map(entity => ({ ...entity, status: 'pending' as const })));
  };

  const testConnection = async () => {
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert('Connection test completed successfully!');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.title}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t.subtitle}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          className="flex items-center gap-2"
        >
          {language === 'en' ? 'हिंदी' : 'English'}
        </Button>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            {t.migrationSetup}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{setupProgress}% Complete</span>
            <div className="flex gap-2">
              {!isSetupRunning ? (
                <Button onClick={startSetup} disabled={setupProgress === 100}>
                  <Play className="h-4 w-4 mr-2" />
                  {t.startSetup}
                </Button>
              ) : (
                <Button onClick={pauseSetup} variant="outline">
                  <Pause className="h-4 w-4 mr-2" />
                  {t.pauseSetup}
                </Button>
              )}
              <Button onClick={resetSetup} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                {t.resetSetup}
              </Button>
            </div>
          </div>
          <Progress value={setupProgress} className="w-full" />
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">{t.overview}</TabsTrigger>
          <TabsTrigger value="configuration">{t.configuration}</TabsTrigger>
          <TabsTrigger value="schemas">{t.schemas}</TabsTrigger>
          <TabsTrigger value="entities">{t.entities}</TabsTrigger>
          <TabsTrigger value="monitoring">{t.monitoring}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.connectionStatus}</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Connected</div>
                <p className="text-xs text-muted-foreground">PostgreSQL 15.4</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.activeConnections}</CardTitle>
                <Network className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">of 200 max</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.responseTime}</CardTitle>
                <Server className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45ms</div>
                <p className="text-xs text-muted-foreground">Average</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.schemaStatus}</CardTitle>
                <FileText className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5/5</div>
                <p className="text-xs text-muted-foreground">Schemas Ready</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t.performanceMetrics}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>CPU Usage</Label>
                  <Progress value={65} className="w-full" />
                  <span className="text-sm text-muted-foreground">65%</span>
                </div>
                <div className="space-y-2">
                  <Label>Memory Usage</Label>
                  <Progress value={78} className="w-full" />
                  <span className="text-sm text-muted-foreground">78%</span>
                </div>
                <div className="space-y-2">
                  <Label>Disk I/O</Label>
                  <Progress value={42} className="w-full" />
                  <span className="text-sm text-muted-foreground">42%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.databaseConfig}</CardTitle>
              <CardDescription>Configure PostgreSQL connection and performance parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="host">Host</Label>
                  <Input
                    id="host"
                    value={dbConfig.host}
                    onChange={(e) => handleConfigChange('host', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input
                    id="port"
                    value={dbConfig.port}
                    onChange={(e) => handleConfigChange('port', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="database">Database Name</Label>
                  <Input
                    id="database"
                    value={dbConfig.database}
                    onChange={(e) => handleConfigChange('database', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={dbConfig.username}
                    onChange={(e) => handleConfigChange('username', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={dbConfig.password}
                      onChange={(e) => handleConfigChange('password', e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxConnections">Max Connections</Label>
                  <Input
                    id="maxConnections"
                    type="number"
                    value={dbConfig.maxConnections}
                    onChange={(e) => handleConfigChange('maxConnections', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sharedBuffers">Shared Buffers</Label>
                  <Input
                    id="sharedBuffers"
                    value={dbConfig.sharedBuffers}
                    onChange={(e) => handleConfigChange('sharedBuffers', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="effectiveCacheSize">Effective Cache Size</Label>
                  <Input
                    id="effectiveCacheSize"
                    value={dbConfig.effectiveCacheSize}
                    onChange={(e) => handleConfigChange('effectiveCacheSize', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workMemory">Work Memory</Label>
                  <Input
                    id="workMemory"
                    value={dbConfig.workMemory}
                    onChange={(e) => handleConfigChange('workMemory', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maintenanceWorkMemory">Maintenance Work Memory</Label>
                  <Input
                    id="maintenanceWorkMemory"
                    value={dbConfig.maintenanceWorkMemory}
                    onChange={(e) => handleConfigChange('maintenanceWorkMemory', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={testConnection} variant="outline">
                  {t.testConnection}
                </Button>
                <Button onClick={() => alert('Configuration saved!')}>
                  {t.saveConfig}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t.connectionPooling}</CardTitle>
              <CardDescription>Configure HikariCP connection pooling settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Minimum Pool Size</Label>
                  <Input defaultValue="5" />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Pool Size</Label>
                  <Input defaultValue="20" />
                </div>
                <div className="space-y-2">
                  <Label>Connection Timeout</Label>
                  <Input defaultValue="30000" />
                </div>
                <div className="space-y-2">
                  <Label>Idle Timeout</Label>
                  <Input defaultValue="600000" />
                </div>
                <div className="space-y-2">
                  <Label>Max Lifetime</Label>
                  <Input defaultValue="1800000" />
                </div>
                <div className="space-y-2">
                  <Label>Validation Query</Label>
                  <Input defaultValue="SELECT 1" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="healthCheck" defaultChecked />
                <Label htmlFor="healthCheck">{t.healthCheck}</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="leakDetection" defaultChecked />
                <Label htmlFor="leakDetection">{t.leakDetection}</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="validationQueries" defaultChecked />
                <Label htmlFor="validationQueries">{t.validationQueries}</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schemas Tab */}
        <TabsContent value="schemas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.schemaCreation}</CardTitle>
              <CardDescription>Manage database schemas and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Schema Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Isolation Level</TableHead>
                    <TableHead>User Accounts</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schemas.map((schema) => (
                    <TableRow key={schema.name}>
                      <TableCell className="font-medium">{schema.name}</TableCell>
                      <TableCell>
                        <Badge variant={
                          schema.status === 'completed' ? 'default' :
                          schema.status === 'creating' ? 'secondary' :
                          schema.status === 'error' ? 'destructive' : 'outline'
                        }>
                          {schema.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {schema.permissions.map((perm) => (
                            <Badge key={perm} variant="secondary" className="text-xs">
                              {perm}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{schema.isolationLevel}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {schema.userAccounts.map((user) => (
                            <Badge key={user} variant="outline" className="text-xs">
                              {user}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t.securitySettings}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="rowLevelSecurity" defaultChecked />
                <Label htmlFor="rowLevelSecurity">{t.rowLevelSecurity}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="auditLogging" defaultChecked />
                <Label htmlFor="auditLogging">{t.auditLogging}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="crossSchemaAccess" defaultChecked />
                <Label htmlFor="crossSchemaAccess">{t.crossSchemaAccess}</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Entities Tab */}
        <TabsContent value="entities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.entityModels}</CardTitle>
              <CardDescription>Database tables and relationships</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Schema</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead>Columns</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entityModels.map((entity) => (
                    <TableRow key={`${entity.schema}.${entity.table}`}>
                      <TableCell className="font-medium">{entity.schema}</TableCell>
                      <TableCell>{entity.table}</TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <div className="flex flex-wrap gap-1">
                            {entity.columns.slice(0, 3).map((col) => (
                              <Badge key={col} variant="outline" className="text-xs">
                                {col}
                              </Badge>
                            ))}
                            {entity.columns.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{entity.columns.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          entity.status === 'created' ? 'default' :
                          entity.status === 'creating' ? 'secondary' :
                          entity.status === 'error' ? 'destructive' : 'outline'
                        }>
                          {entity.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.performanceMetrics}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Query Execution Time</Label>
                  <Progress value={75} className="w-full" />
                  <span className="text-sm text-muted-foreground">75% within SLA</span>
                </div>
                <div className="space-y-2">
                  <Label>Connection Pool Utilization</Label>
                  <Progress value={60} className="w-full" />
                  <span className="text-sm text-muted-foreground">60% utilized</span>
                </div>
                <div className="space-y-2">
                  <Label>Cache Hit Ratio</Label>
                  <Progress value={85} className="w-full" />
                  <span className="text-sm text-muted-foreground">85% hit rate</span>
                </div>
                <div className="space-y-2">
                  <Label>Index Usage</Label>
                  <Progress value={92} className="w-full" />
                  <span className="text-sm text-muted-foreground">92% efficient</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t.monitoringAlerts}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  High connection pool utilization detected. Consider increasing pool size.
                </AlertDescription>
              </Alert>
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  All schemas are healthy and responding within expected timeframes.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-6">
        <Button onClick={() => alert('Backup started!')} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          {t.backupDatabase}
        </Button>
        <Button onClick={() => alert('Restore dialog opened!')} variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          {t.restoreDatabase}
        </Button>
        <Button onClick={() => alert('Logs opened!')} variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          {t.viewLogs}
        </Button>
      </div>
    </div>
  );
};

export default DatabaseSetup;
