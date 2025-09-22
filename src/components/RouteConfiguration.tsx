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
import { 
  Plus, 
  Trash2, 
  Save, 
  X, 
  Route, 
  Filter,
  LoadBalancer,
  Shield,
  Zap
} from 'lucide-react';

interface RouteFilter {
  id: string;
  name: string;
  args: Record<string, any>;
}

interface ServiceRoute {
  id: string;
  name: string;
  path: string;
  uri: string;
  predicates: string[];
  filters: RouteFilter[];
  loadBalancing: 'round-robin' | 'least-connections' | 'weighted';
  circuitBreaker: boolean;
  rateLimiting: boolean;
  stripPrefix: boolean;
}

interface RouteConfigurationProps {
  route?: ServiceRoute;
  onSave: (route: ServiceRoute) => void;
  onCancel: () => void;
}

const RouteConfiguration: React.FC<RouteConfigurationProps> = ({ 
  route, 
  onSave, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<ServiceRoute>(route || {
    id: '',
    name: '',
    path: '',
    uri: '',
    predicates: ['Path'],
    filters: [],
    loadBalancing: 'round-robin',
    circuitBreaker: false,
    rateLimiting: false,
    stripPrefix: true
  });

  const [newFilter, setNewFilter] = useState<RouteFilter>({
    id: '',
    name: '',
    args: {}
  });

  const availableFilters = [
    { name: 'StripPrefix', description: 'Remove path prefix' },
    { name: 'RequestRateLimiter', description: 'Rate limiting' },
    { name: 'Retry', description: 'Retry failed requests' },
    { name: 'CircuitBreaker', description: 'Circuit breaker pattern' },
    { name: 'AddRequestHeader', description: 'Add request headers' },
    { name: 'AddResponseHeader', description: 'Add response headers' },
    { name: 'ModifyRequestBody', description: 'Modify request body' },
    { name: 'ModifyResponseBody', description: 'Modify response body' }
  ];

  const handleInputChange = (field: keyof ServiceRoute, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addFilter = () => {
    if (newFilter.name) {
      setFormData(prev => ({
        ...prev,
        filters: [...prev.filters, { ...newFilter, id: Date.now().toString() }]
      }));
      setNewFilter({ id: '', name: '', args: {} });
    }
  };

  const removeFilter = (filterId: string) => {
    setFormData(prev => ({
      ...prev,
      filters: prev.filters.filter(f => f.id !== filterId)
    }));
  };

  const updateFilterArgs = (filterId: string, args: Record<string, any>) => {
    setFormData(prev => ({
      ...prev,
      filters: prev.filters.map(f => 
        f.id === filterId ? { ...f, args } : f
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id && formData.name && formData.path && formData.uri) {
      onSave(formData);
    }
  };

  const generateYaml = () => {
    const yaml = `- id: ${formData.id}
  uri: ${formData.uri}
  predicates:
    - Path=${formData.path}
  filters:${formData.filters.map(f => `
    - ${f.name}${Object.keys(f.args).length > 0 ? `:
        ${Object.entries(f.args).map(([k, v]) => `${k}: ${v}`).join('\n        ')}` : ''}`).join('')}`;
    return yaml;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {route ? 'Edit Route' : 'Create New Route'}
          </h2>
          <p className="text-muted-foreground">
            Configure routing rules and filters for microservice
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="h-4 w-4 mr-2" />
            Save Route
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Route Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Route className="h-5 w-5 mr-2" />
              Basic Route Information
            </CardTitle>
            <CardDescription>
              Define the core routing parameters for the service
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="route-id">Route ID</Label>
                <Input
                  id="route-id"
                  value={formData.id}
                  onChange={(e) => handleInputChange('id', e.target.value)}
                  placeholder="e.g., auth-service"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="route-name">Service Name</Label>
                <Input
                  id="route-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Authentication Service"
                  required
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="route-path">Path Pattern</Label>
                <Input
                  id="route-path"
                  value={formData.path}
                  onChange={(e) => handleInputChange('path', e.target.value)}
                  placeholder="e.g., /api/auth/**"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Use ** for wildcard matching
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="route-uri">Service URI</Label>
                <Input
                  id="route-uri"
                  value={formData.uri}
                  onChange={(e) => handleInputChange('uri', e.target.value)}
                  placeholder="e.g., lb://auth-service"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Use lb:// for load balancing
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Load Balancing Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LoadBalancer className="h-5 w-5 mr-2" />
              Load Balancing & Resilience
            </CardTitle>
            <CardDescription>
              Configure load balancing strategy and circuit breaker settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="load-balancing">Load Balancing Strategy</Label>
                <Select
                  value={formData.loadBalancing}
                  onValueChange={(value: any) => handleInputChange('loadBalancing', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="round-robin">Round Robin</SelectItem>
                    <SelectItem value="least-connections">Least Connections</SelectItem>
                    <SelectItem value="weighted">Weighted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="circuit-breaker">Circuit Breaker</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="circuit-breaker"
                    checked={formData.circuitBreaker}
                    onCheckedChange={(checked) => handleInputChange('circuitBreaker', checked)}
                  />
                  <Label htmlFor="circuit-breaker">Enable circuit breaker pattern</Label>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="strip-prefix"
                checked={formData.stripPrefix}
                onCheckedChange={(checked) => handleInputChange('stripPrefix', checked)}
              />
              <Label htmlFor="strip-prefix">Strip path prefix before forwarding</Label>
            </div>
          </CardContent>
        </Card>

        {/* Route Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Route Filters
            </CardTitle>
            <CardDescription>
              Add filters to modify requests/responses and implement policies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add New Filter */}
            <div className="border rounded-lg p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Filter Type</Label>
                  <Select
                    value={newFilter.name}
                    onValueChange={(value) => setNewFilter(prev => ({ ...prev, name: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select filter type" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFilters.map(filter => (
                        <SelectItem key={filter.name} value={filter.name}>
                          {filter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Arguments (JSON)</Label>
                  <Textarea
                    placeholder='{"key": "value"}'
                    value={JSON.stringify(newFilter.args, null, 2)}
                    onChange={(e) => {
                      try {
                        const args = JSON.parse(e.target.value);
                        setNewFilter(prev => ({ ...prev, args }));
                      } catch (error) {
                        // Invalid JSON, ignore
                      }
                    }}
                    rows={3}
                  />
                </div>
              </div>
              <Button 
                type="button" 
                onClick={addFilter} 
                className="mt-4"
                disabled={!newFilter.name}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Filter
              </Button>
            </div>

            {/* Existing Filters */}
            {formData.filters.length > 0 && (
              <div className="space-y-3">
                <Label>Active Filters</Label>
                {formData.filters.map(filter => (
                  <div key={filter.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant="secondary">{filter.name}</Badge>
                      {Object.keys(filter.args).length > 0 && (
                        <span className="text-sm text-muted-foreground">
                          {Object.entries(filter.args).map(([k, v]) => `${k}: ${v}`).join(', ')}
                        </span>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFilter(filter.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security & Rate Limiting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security & Rate Limiting
            </CardTitle>
            <CardDescription>
              Configure security policies and request throttling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="rate-limiting"
                checked={formData.rateLimiting}
                onCheckedChange={(checked) => handleInputChange('rateLimiting', checked)}
              />
              <Label htmlFor="rate-limiting">Enable rate limiting</Label>
            </div>
            {formData.rateLimiting && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Requests per minute</Label>
                  <Input type="number" defaultValue="100" />
                </div>
                <div className="space-y-2">
                  <Label>Burst capacity</Label>
                  <Input type="number" defaultValue="200" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Generated Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Generated Configuration
            </CardTitle>
            <CardDescription>
              Preview the generated YAML configuration for this route
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto">
                {generateYaml()}
              </pre>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default RouteConfiguration;
