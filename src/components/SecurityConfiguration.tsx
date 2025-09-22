import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Lock, 
  Globe, 
  Zap, 
  AlertTriangle, 
  CheckCircle,
  Save,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';

interface SecurityPolicy {
  id: string;
  name: string;
  type: 'cors' | 'csp' | 'hsts' | 'rate-limit' | 'ip-filter';
  enabled: boolean;
  configuration: Record<string, any>;
  priority: number;
}

interface JWTConfig {
  secretKey: string;
  algorithm: string;
  expirationMinutes: number;
  refreshTokenEnabled: boolean;
  issuer: string;
  audience: string;
  forwardToServices: boolean;
}

interface SecurityConfigurationProps {
  onSave: (config: any) => void;
}

const SecurityConfiguration: React.FC<SecurityConfigurationProps> = ({ onSave }) => {
  const [showSecret, setShowSecret] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [jwtConfig, setJwtConfig] = useState<JWTConfig>({
    secretKey: 'your-super-secret-jwt-key-here',
    algorithm: 'HS256',
    expirationMinutes: 60,
    refreshTokenEnabled: true,
    issuer: 'saubhagya-gateway',
    audience: 'saubhagya-services',
    forwardToServices: true
  });

  const [securityPolicies, setSecurityPolicies] = useState<SecurityPolicy[]>([
    {
      id: 'cors-policy',
      name: 'CORS Policy',
      type: 'cors',
      enabled: true,
      priority: 1,
      configuration: {
        allowedOrigins: ['*'],
        allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['*'],
        allowCredentials: true,
        maxAge: 3600
      }
    },
    {
      id: 'csp-policy',
      name: 'Content Security Policy',
      type: 'csp',
      enabled: true,
      priority: 2,
      configuration: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"]
      }
    },
    {
      id: 'hsts-policy',
      name: 'HTTP Strict Transport Security',
      type: 'hsts',
      enabled: true,
      priority: 3,
      configuration: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: false
      }
    },
    {
      id: 'rate-limit-policy',
      name: 'Rate Limiting',
      type: 'rate-limit',
      enabled: true,
      priority: 4,
      configuration: {
        globalLimit: 1000,
        burstCapacity: 2000,
        perUserLimit: 100,
        perIPLimit: 200,
        windowSize: 60
      }
    },
    {
      id: 'ip-filter-policy',
      name: 'IP Filtering',
      type: 'ip-filter',
      enabled: false,
      priority: 5,
      configuration: {
        whitelist: ['127.0.0.1', '10.0.0.0/8', '172.16.0.0/12'],
        blacklist: [],
        blockMode: 'whitelist'
      }
    }
  ]);

  const handleJWTChange = (field: keyof JWTConfig, value: any) => {
    setJwtConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePolicyChange = (policyId: string, field: string, value: any) => {
    setSecurityPolicies(prev => prev.map(policy => 
      policy.id === policyId 
        ? { ...policy, [field]: value }
        : policy
    ));
  };

  const handlePolicyConfigChange = (policyId: string, key: string, value: any) => {
    setSecurityPolicies(prev => prev.map(policy => 
      policy.id === policyId 
        ? { 
            ...policy, 
            configuration: { ...policy.configuration, [key]: value }
          }
        : policy
    ));
  };

  const togglePolicy = (policyId: string) => {
    setSecurityPolicies(prev => prev.map(policy => 
      policy.id === policyId 
        ? { ...policy, enabled: !policy.enabled }
        : policy
    ));
  };

  const generateSecurityHeaders = () => {
    const headers: Record<string, string> = {};
    
    securityPolicies.forEach(policy => {
      if (!policy.enabled) return;
      
      switch (policy.type) {
        case 'cors':
          headers['Access-Control-Allow-Origin'] = policy.configuration.allowedOrigins.join(', ');
          headers['Access-Control-Allow-Methods'] = policy.configuration.allowedMethods.join(', ');
          headers['Access-Control-Allow-Headers'] = policy.configuration.allowedHeaders.join(', ');
          headers['Access-Control-Allow-Credentials'] = policy.configuration.allowCredentials.toString();
          headers['Access-Control-Max-Age'] = policy.configuration.maxAge.toString();
          break;
        case 'csp':
          const cspParts = Object.entries(policy.configuration).map(([key, values]) => 
            `${key} ${Array.isArray(values) ? values.join(' ') : values}`
          );
          headers['Content-Security-Policy'] = cspParts.join('; ');
          break;
        case 'hsts':
          let hstsValue = `max-age=${policy.configuration.maxAge}`;
          if (policy.configuration.includeSubDomains) hstsValue += '; includeSubDomains';
          if (policy.configuration.preload) hstsValue += '; preload';
          headers['Strict-Transport-Security'] = hstsValue;
          break;
      }
    });
    
    return headers;
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const config = {
        jwt: jwtConfig,
        policies: securityPolicies,
        headers: generateSecurityHeaders()
      };
      await onSave(config);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Failed to save security configuration:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getPolicyIcon = (type: string) => {
    switch (type) {
      case 'cors':
        return <Globe className="h-4 w-4" />;
      case 'csp':
        return <Shield className="h-4 w-4" />;
      case 'hsts':
        return <Lock className="h-4 w-4" />;
      case 'rate-limit':
        return <Zap className="h-4 w-4" />;
      case 'ip-filter':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getPolicyStatus = (policy: SecurityPolicy) => {
    if (!policy.enabled) {
      return <Badge variant="outline">Disabled</Badge>;
    }
    
    // Check if policy has valid configuration
    const hasConfig = Object.keys(policy.configuration).length > 0;
    return hasConfig ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Misconfigured
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Security Configuration</h2>
          <p className="text-muted-foreground">
            Configure JWT authentication, security policies, and headers
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Configuration'}
        </Button>
      </div>

      {/* JWT Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="h-5 w-5 mr-2" />
            JWT Authentication Configuration
          </CardTitle>
          <CardDescription>
            Configure JWT token validation, signing, and forwarding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="jwt-secret">Secret Key</Label>
              <div className="relative">
                <Input
                  id="jwt-secret"
                  type={showSecret ? 'text' : 'password'}
                  value={jwtConfig.secretKey}
                  onChange={(e) => handleJWTChange('secretKey', e.target.value)}
                  placeholder="Enter JWT secret key"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowSecret(!showSecret)}
                >
                  {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="jwt-algorithm">Algorithm</Label>
              <Select
                value={jwtConfig.algorithm}
                onValueChange={(value) => handleJWTChange('algorithm', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HS256">HS256 (HMAC SHA256)</SelectItem>
                  <SelectItem value="HS384">HS384 (HMAC SHA384)</SelectItem>
                  <SelectItem value="HS512">HS512 (HMAC SHA512)</SelectItem>
                  <SelectItem value="RS256">RS256 (RSA SHA256)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="jwt-expiration">Token Expiration (minutes)</Label>
              <Input
                id="jwt-expiration"
                type="number"
                value={jwtConfig.expirationMinutes}
                onChange={(e) => handleJWTChange('expirationMinutes', parseInt(e.target.value))}
                min="1"
                max="1440"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jwt-issuer">Issuer</Label>
              <Input
                id="jwt-issuer"
                value={jwtConfig.issuer}
                onChange={(e) => handleJWTChange('issuer', e.target.value)}
                placeholder="Gateway issuer name"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="jwt-audience">Audience</Label>
              <Input
                id="jwt-audience"
                value={jwtConfig.audience}
                onChange={(e) => handleJWTChange('audience', e.target.value)}
                placeholder="Target audience"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jwt-refresh">Refresh Token</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="jwt-refresh"
                  checked={jwtConfig.refreshTokenEnabled}
                  onCheckedChange={(checked) => handleJWTChange('refreshTokenEnabled', checked)}
                />
                <Label htmlFor="jwt-refresh">Enable refresh tokens</Label>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="jwt-forward"
              checked={jwtConfig.forwardToServices}
              onCheckedChange={(checked) => handleJWTChange('forwardToServices', checked)}
            />
            <Label htmlFor="jwt-forward">Forward JWT tokens to microservices</Label>
          </div>
        </CardContent>
      </Card>

      {/* Security Policies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Security Policies
          </CardTitle>
          <CardDescription>
            Configure CORS, CSP, HSTS, rate limiting, and IP filtering policies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {securityPolicies.map((policy) => (
            <div key={policy.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getPolicyIcon(policy.type)}
                  <div>
                    <h4 className="font-medium">{policy.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Priority: {policy.priority}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getPolicyStatus(policy)}
                  <Switch
                    checked={policy.enabled}
                    onCheckedChange={() => togglePolicy(policy.id)}
                  />
                </div>
              </div>

              {policy.enabled && (
                <div className="space-y-4">
                  {policy.type === 'cors' && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Allowed Origins</Label>
                        <Textarea
                          value={policy.configuration.allowedOrigins.join('\n')}
                          onChange={(e) => handlePolicyConfigChange(
                            policy.id, 
                            'allowedOrigins', 
                            e.target.value.split('\n').filter(v => v.trim())
                          )}
                          placeholder="Enter allowed origins (one per line)"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Allowed Methods</Label>
                        <Textarea
                          value={policy.configuration.allowedMethods.join(', ')}
                          onChange={(e) => handlePolicyConfigChange(
                            policy.id, 
                            'allowedMethods', 
                            e.target.value.split(',').map(v => v.trim()).filter(v => v)
                          )}
                          placeholder="GET, POST, PUT, DELETE"
                        />
                      </div>
                    </div>
                  )}

                  {policy.type === 'csp' && (
                    <div className="space-y-2">
                      <Label>Content Security Policy</Label>
                      <Textarea
                        value={Object.entries(policy.configuration)
                          .map(([key, values]) => `${key} ${Array.isArray(values) ? values.join(' ') : values}`)
                          .join('; ')}
                        onChange={(e) => {
                          // Parse CSP string back to configuration
                          try {
                            const cspParts = e.target.value.split(';').map(part => part.trim());
                            const config: Record<string, any> = {};
                            cspParts.forEach(part => {
                              const [key, ...values] = part.split(' ');
                              if (key && values.length > 0) {
                                config[key] = values;
                              }
                            });
                            handlePolicyConfigChange(policy.id, 'configuration', config);
                          } catch (error) {
                            // Invalid CSP format, ignore
                          }
                        }}
                        placeholder="default-src 'self'; script-src 'self' 'unsafe-inline'"
                        rows={4}
                      />
                    </div>
                  )}

                  {policy.type === 'hsts' && (
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Max Age (seconds)</Label>
                        <Input
                          type="number"
                          value={policy.configuration.maxAge}
                          onChange={(e) => handlePolicyConfigChange(
                            policy.id, 
                            'maxAge', 
                            parseInt(e.target.value)
                          )}
                          min="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Include Subdomains</Label>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={policy.configuration.includeSubDomains}
                            onCheckedChange={(checked) => handlePolicyConfigChange(
                              policy.id, 
                              'includeSubDomains', 
                              checked
                            )}
                          />
                          <Label>Include subdomains</Label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Preload</Label>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={policy.configuration.preload}
                            onCheckedChange={(checked) => handlePolicyConfigChange(
                              policy.id, 
                              'preload', 
                              checked
                            )}
                          />
                          <Label>Include preload directive</Label>
                        </div>
                      </div>
                    </div>
                  )}

                  {policy.type === 'rate-limit' && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Global Limit (req/min)</Label>
                        <Input
                          type="number"
                          value={policy.configuration.globalLimit}
                          onChange={(e) => handlePolicyConfigChange(
                            policy.id, 
                            'globalLimit', 
                            parseInt(e.target.value)
                          )}
                          min="1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Burst Capacity</Label>
                        <Input
                          type="number"
                          value={policy.configuration.burstCapacity}
                          onChange={(e) => handlePolicyConfigChange(
                            policy.id, 
                            'burstCapacity', 
                            parseInt(e.target.value)
                          )}
                          min="1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Per User Limit (req/min)</Label>
                        <Input
                          type="number"
                          value={policy.configuration.perUserLimit}
                          onChange={(e) => handlePolicyConfigChange(
                            policy.id, 
                            'perUserLimit', 
                            parseInt(e.target.value)
                          )}
                          min="1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Per IP Limit (req/min)</Label>
                        <Input
                          type="number"
                          value={policy.configuration.perIPLimit}
                          onChange={(e) => handlePolicyConfigChange(
                            policy.id, 
                            'perIPLimit', 
                            parseInt(e.target.value)
                          )}
                          min="1"
                        />
                      </div>
                    </div>
                  )}

                  {policy.type === 'ip-filter' && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Block Mode</Label>
                        <Select
                          value={policy.configuration.blockMode}
                          onValueChange={(value) => handlePolicyConfigChange(
                            policy.id, 
                            'blockMode', 
                            value
                          )}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="whitelist">Whitelist (Allow listed only)</SelectItem>
                            <SelectItem value="blacklist">Blacklist (Block listed only)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>IP Addresses</Label>
                        <Textarea
                          value={policy.configuration.blockMode === 'whitelist' 
                            ? policy.configuration.whitelist.join('\n')
                            : policy.configuration.blacklist.join('\n')
                          }
                          onChange={(e) => {
                            const ips = e.target.value.split('\n').filter(v => v.trim());
                            const key = policy.configuration.blockMode === 'whitelist' ? 'whitelist' : 'blacklist';
                            handlePolicyConfigChange(policy.id, key, ips);
                          }}
                          placeholder="Enter IP addresses (one per line)"
                          rows={3}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Generated Headers Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Security Headers</CardTitle>
          <CardDescription>
            Preview of security headers that will be applied to all responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg">
            <pre className="text-sm overflow-x-auto">
              {Object.entries(generateSecurityHeaders())
                .map(([key, value]) => `${key}: ${value}`)
                .join('\n')}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Security Recommendations:</strong> Ensure your JWT secret is at least 32 characters long, 
          use HTTPS in production, and regularly rotate your security keys. Consider implementing 
          additional security measures like request signing for sensitive operations.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default SecurityConfiguration;
