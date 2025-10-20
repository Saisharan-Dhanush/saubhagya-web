import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, XCircle, Shield, Trash2, Search } from 'lucide-react';
import { biogasService } from '@/services/biogasService';
import { api } from '@/services/gaushala/api'; // Force reload

// Module types
type ModuleType = 'gaushala' | 'biogas' | 'purification';

interface ModuleConfig {
  id: ModuleType;
  label: string;
  entityName: string; // "Gaushala", "Bio Sangh", "Purification Unit"
  entityIdLabel: string; // "Gaushala ID", "Cluster ID", etc.
}

const MODULES: ModuleConfig[] = [
  {
    id: 'gaushala',
    label: 'Gaushala',
    entityName: 'Gaushala',
    entityIdLabel: 'Gaushala ID'
  },
  {
    id: 'biogas',
    label: 'Bio Sangh (Cluster)',
    entityName: 'Bio Sangh',
    entityIdLabel: 'Cluster ID'
  },
  {
    id: 'purification',
    label: 'Purification Unit',
    entityName: 'Purification Unit',
    entityIdLabel: 'Unit ID'
  }
];

interface AccessRecord {
  id: number;
  userId: number;
  entityId: number; // clusterId or gaushalaId or unitId
  entityName?: string;
  entityCode?: string;
  grantedAt: string;
  grantedBy: number;
  // User details
  userName?: string;
  userPhone?: string;
  // Additional details
  location?: string;
  owner?: string;
}

interface UserOption {
  id: number;
  name: string;
  phone: string;
  email?: string;
  label: string; // Display format: "John (9999888777)"
}

interface EntityOption {
  id: number;
  name: string;
  code?: string;
  location?: string;
  label: string; // Display format: "Gaushala Name (ID: 1)"
}

export default function UserAccessManagement() {
  const [selectedModule, setSelectedModule] = useState<ModuleType>('gaushala');
  const [accessRecords, setAccessRecords] = useState<AccessRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [grantUserId, setGrantUserId] = useState('');
  const [grantEntityId, setGrantEntityId] = useState('');
  const [searchUserId, setSearchUserId] = useState('');
  const [searchEntityId, setSearchEntityId] = useState('');

  // Search features
  const [userOptions, setUserOptions] = useState<UserOption[]>([]);
  const [entityOptions, setEntityOptions] = useState<EntityOption[]>([]);
  const [userSearchInput, setUserSearchInput] = useState('');
  const [entitySearchInput, setEntitySearchInput] = useState('');
  const [filteredAccessRecords, setFilteredAccessRecords] = useState<AccessRecord[]>([]);
  const [searchRecordsInput, setSearchRecordsInput] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingEntities, setLoadingEntities] = useState(false);

  const currentModule = MODULES.find(m => m.id === selectedModule) || MODULES[0];

  // Module-specific API calls
  const moduleApis = {
    gaushala: {
      getAll: api.gaushalaAccess.getAllUserGaushalaAccess,
      grant: api.gaushalaAccess.grantGaushalaAccess,
      revoke: api.gaushalaAccess.revokeGaushalaAccess,
      check: api.gaushalaAccess.checkGaushalaAccess,
      getUser: api.gaushalaAccess.getUserById,
      getEntity: api.gaushalaAccess.getGaushalaById,
      entityIdField: 'gaushalaId' as const,
      entityNameField: 'gaushalaName' as const
    },
    biogas: {
      getAll: biogasService.getAllUserClusterAccess,
      grant: biogasService.grantClusterAccess,
      revoke: biogasService.revokeClusterAccess,
      check: biogasService.checkClusterAccess,
      getUser: biogasService.getUserById,
      getEntity: biogasService.getClusterById,
      entityIdField: 'clusterId' as const,
      entityNameField: 'clusterName' as const
    },
    purification: {
      getAll: async () => ({ success: false, error: 'Purification module not yet implemented' }),
      grant: async () => ({ success: false, error: 'Purification module not yet implemented' }),
      revoke: async () => ({ success: false, error: 'Purification module not yet implemented' }),
      check: async () => ({ success: false, error: 'Purification module not yet implemented' }),
      getUser: async () => ({ success: false, error: 'Not implemented' }),
      getEntity: async () => ({ success: false, error: 'Not implemented' }),
      entityIdField: 'unitId' as const,
      entityNameField: 'unitName' as const
    }
  };

  // Search users by name, phone, or ID
  const searchUsers = async (query: string) => {
    if (!query || query.length < 2) {
      setUserOptions([]);
      return;
    }
    setLoadingUsers(true);
    try {
      // Fetch all users from auth service
      const AUTH_API_BASE = `${import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:8081/auth-service'}/api/auth`;
      const token = localStorage.getItem('saubhagya_jwt_token');

      const response = await fetch(`${AUTH_API_BASE}/users`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const users = data.users || [];

      // Map to UserOption format and filter by query
      const userOptions: UserOption[] = users
        .filter((user: any) =>
          user.name?.toLowerCase().includes(query.toLowerCase()) ||
          user.phone?.includes(query) ||
          user.id.toString() === query
        )
        .map((user: any) => ({
          id: user.id,
          name: user.name || 'Unknown',
          phone: user.phone || '',
          email: user.email,
          label: `${user.name || 'Unknown'} (${user.phone || user.id})`
        }));

      setUserOptions(userOptions);
    } catch (err) {
      console.error('Failed to search users:', err);
      setUserOptions([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Search entities (gaushalas/clusters) by name, ID, or location
  const searchEntities = async (query: string) => {
    if (!query || query.length < 1) {
      setEntityOptions([]);
      return;
    }
    setLoadingEntities(true);
    try {
      const moduleApi = moduleApis[selectedModule];
      const entities: EntityOption[] = [];

      if (selectedModule === 'gaushala') {
        // Fetch all gaushalas directly from the gaushala list endpoint
        const response = await api.gaushalaAccess.getAllGaushalas();
        if (response.success && response.data) {
          const gaushalas = response.data;
          for (const gaushala of gaushalas) {
            const name = gaushala.gaushalaName || '';
            const location = gaushala.registeredAddress || gaushala.location || '';
            entities.push({
              id: gaushala.id,
              name,
              code: gaushala.registrationNumber || '',
              location,
              label: `${name} (ID: ${gaushala.id}${location ? ` - ${location}` : ''})`
            });
          }
        }
      } else {
        // For other modules, use the existing approach
        // First load all existing access records to get entity IDs
        const allResponse = await moduleApi.getAll();
        const records = allResponse.data || [];

        const entitySet = new Set<number>();

        // Fetch details for each unique entity
        for (const record of records) {
          const entityId = record[moduleApi.entityIdField];
          if (!entitySet.has(entityId)) {
            entitySet.add(entityId);
            try {
              const entityResponse = await moduleApi.getEntity(entityId);
              if (entityResponse.success && entityResponse.data) {
                const data = entityResponse.data;
                const name = data.name || data.gaushalaName || data.clusterName || data.unitName || '';
                const code = data.code || data.registrationNumber || data.clusterCode || '';
                const location = data.location || data.address || '';

                entities.push({
                  id: entityId,
                  name,
                  code,
                  location,
                  label: `${name} (ID: ${entityId}${location ? ` - ${location}` : ''})`
                });
              }
            } catch (err) {
              console.error(`Failed to fetch entity ${entityId}:`, err);
            }
          }
        }
      }

      const filtered = entities.filter(entity =>
        entity.name.toLowerCase().includes(query.toLowerCase()) ||
        entity.location.toLowerCase().includes(query.toLowerCase()) ||
        entity.id.toString() === query
      );
      setEntityOptions(filtered);
    } catch (err) {
      console.error('Failed to search entities:', err);
      setEntityOptions([]);
    } finally {
      setLoadingEntities(false);
    }
  };

  // Filter access records by search input
  useEffect(() => {
    if (!searchRecordsInput.trim()) {
      setFilteredAccessRecords(accessRecords);
    } else {
      const query = searchRecordsInput.toLowerCase();
      const filtered = accessRecords.filter(record =>
        record.userName?.toLowerCase().includes(query) ||
        record.userPhone?.includes(query) ||
        record.entityName?.toLowerCase().includes(query) ||
        record.location?.toLowerCase().includes(query) ||
        record.userId.toString() === query ||
        record.entityId.toString() === query
      );
      setFilteredAccessRecords(filtered);
    }
  }, [accessRecords, searchRecordsInput]);

  // Load all access records for current module
  const loadAccessRecords = async () => {
    try {
      setLoading(true);
      const moduleApi = moduleApis[selectedModule];

      // Fetch all access records
      const response = await moduleApi.getAll();

      if (!response.success) {
        throw new Error(response.error || 'Failed to load access records');
      }

      const records = response.data || [];

      // Fetch user and entity details for each record
      const enrichedRecords = await Promise.all(
        records.map(async (record: any) => {
          let enrichedRecord: AccessRecord = {
            id: record.id,
            userId: record.userId,
            entityId: record[moduleApi.entityIdField],
            grantedAt: record.grantedAt,
            grantedBy: record.grantedBy
          };

          // Fetch user details
          try {
            const userResponse = await moduleApi.getUser(record.userId);
            if (userResponse.success && userResponse.data) {
              enrichedRecord.userName = userResponse.data.name;
              enrichedRecord.userPhone = userResponse.data.phone;
            }
          } catch (err) {
            console.error(`Failed to fetch user ${record.userId}:`, err);
          }

          // Fetch entity details
          try {
            const entityResponse = await moduleApi.getEntity(enrichedRecord.entityId);
            if (entityResponse.success && entityResponse.data) {
              const data = entityResponse.data;
              enrichedRecord.entityName = data.name || data.gaushalaName || data.clusterName || data.unitName;
              enrichedRecord.entityCode = data.code || data.registrationNumber || data.clusterCode;
              enrichedRecord.location = data.location || data.address;
              enrichedRecord.owner = data.owner || data.ownerName;
            }
          } catch (err) {
            console.error(`Failed to fetch entity ${enrichedRecord.entityId}:`, err);
          }

          return enrichedRecord;
        })
      );

      setAccessRecords(enrichedRecords);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load access records');
    } finally {
      setLoading(false);
    }
  };

  // Grant access
  const handleGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const moduleApi = moduleApis[selectedModule];
      const response = await moduleApi.grant(
        parseInt(grantUserId),
        parseInt(grantEntityId)
      );

      if (!response.success) {
        throw new Error(response.error || 'Failed to grant access');
      }

      setSuccess(response.message || 'Access granted successfully!');
      setGrantUserId('');
      setGrantEntityId('');
      loadAccessRecords();
    } catch (err: any) {
      setError(err.message || 'Failed to grant access');
    } finally {
      setLoading(false);
    }
  };

  // Revoke access
  const handleRevokeAccess = async (userId: number, entityId: number) => {
    if (!confirm(`Revoke access for User ${userId} from ${currentModule.entityName} ${entityId}?`)) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      const moduleApi = moduleApis[selectedModule];
      const response = await moduleApi.revoke(userId, entityId);

      if (!response.success) {
        throw new Error(response.error || 'Failed to revoke access');
      }

      setSuccess(response.message || 'Access revoked successfully!');
      loadAccessRecords();
    } catch (err: any) {
      setError(err.message || 'Failed to revoke access');
    } finally {
      setLoading(false);
    }
  };

  // Check access
  const handleCheckAccess = async () => {
    if (!searchUserId || !searchEntityId) {
      setError(`Please enter both User ID and ${currentModule.entityIdLabel}`);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const moduleApi = moduleApis[selectedModule];
      const response = await moduleApi.check(
        parseInt(searchUserId),
        parseInt(searchEntityId)
      );

      if (!response.success) {
        throw new Error(response.error || 'Failed to check access');
      }

      if (response.data?.hasAccess) {
        setSuccess(`User ${searchUserId} HAS access to ${currentModule.entityName} ${searchEntityId}`);
      } else {
        setError(`User ${searchUserId} does NOT have access to ${currentModule.entityName} ${searchEntityId}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to check access');
    } finally {
      setLoading(false);
    }
  };

  // Reload when module changes
  useEffect(() => {
    loadAccessRecords();
    setError('');
    setSuccess('');
    setGrantUserId('');
    setGrantEntityId('');
    setSearchUserId('');
    setSearchEntityId('');
  }, [selectedModule]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">User Access Management</h1>
            <p className="text-gray-600">Control which users can access which modules</p>
          </div>
        </div>

        {/* Module Selector */}
        <div className="w-64">
          <Label>Select Module</Label>
          <Select value={selectedModule} onValueChange={(value) => setSelectedModule(value as ModuleType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select module" />
            </SelectTrigger>
            <SelectContent>
              {MODULES.map((module) => (
                <SelectItem key={module.id} value={module.id}>
                  {module.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-500 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="grant" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="grant">Grant Access</TabsTrigger>
          <TabsTrigger value="view">View All Access</TabsTrigger>
          <TabsTrigger value="check">Check Access</TabsTrigger>
        </TabsList>

        {/* Grant Access Tab */}
        <TabsContent value="grant">
          <Card>
            <CardHeader>
              <CardTitle>Grant User Access to {currentModule.entityName}</CardTitle>
              <CardDescription>
                Assign a user to a {currentModule.entityName.toLowerCase()}. They will be able to manage and view data for that {currentModule.entityName.toLowerCase()}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGrantAccess} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* User Search */}
                  <div className="space-y-2">
                    <Label htmlFor="userSearch">Search User (Phone/Name/ID)</Label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="userSearch"
                        type="text"
                        placeholder="e.g., 9999888777 or Admin User"
                        value={userSearchInput}
                        onChange={(e) => {
                          setUserSearchInput(e.target.value);
                          searchUsers(e.target.value);
                        }}
                        className="pl-8"
                      />
                    </div>
                    {loadingUsers && <p className="text-sm text-gray-500">Searching users...</p>}
                    {userSearchInput && userOptions.length > 0 && (
                      <div className="border rounded-md bg-white z-10 max-h-40 overflow-y-auto">
                        {userOptions.map((user) => (
                          <button
                            key={user.id}
                            type="button"
                            className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm"
                            onClick={() => {
                              setGrantUserId(user.id.toString());
                              setUserSearchInput('');
                              setUserOptions([]);
                            }}
                          >
                            {user.label}
                          </button>
                        ))}
                      </div>
                    )}
                    {grantUserId && (
                      <p className="text-sm text-green-600">✓ Selected User ID: {grantUserId}</p>
                    )}
                  </div>

                  {/* Entity Search */}
                  <div className="space-y-2">
                    <Label htmlFor="entitySearch">Search {currentModule.entityName} (Name/Location/ID)</Label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="entitySearch"
                        type="text"
                        placeholder={`e.g., Gaushala Name or Location`}
                        value={entitySearchInput}
                        onChange={(e) => {
                          setEntitySearchInput(e.target.value);
                          searchEntities(e.target.value);
                        }}
                        className="pl-8"
                      />
                    </div>
                    {loadingEntities && <p className="text-sm text-gray-500">Searching {currentModule.entityName.toLowerCase()}s...</p>}
                    {entitySearchInput && entityOptions.length > 0 && (
                      <div className="border rounded-md bg-white z-10 max-h-40 overflow-y-auto">
                        {entityOptions.map((entity) => (
                          <button
                            key={entity.id}
                            type="button"
                            className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm"
                            onClick={() => {
                              setGrantEntityId(entity.id.toString());
                              setEntitySearchInput('');
                              setEntityOptions([]);
                            }}
                          >
                            {entity.label}
                          </button>
                        ))}
                      </div>
                    )}
                    {grantEntityId && (
                      <p className="text-sm text-green-600">✓ Selected {currentModule.entityName} ID: {grantEntityId}</p>
                    )}
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Granting Access...' : 'Grant Access'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* View All Access Tab */}
        <TabsContent value="view">
          <Card>
            <CardHeader>
              <CardTitle>All {currentModule.entityName} Access Records ({accessRecords.length})</CardTitle>
              <CardDescription>
                View and manage all user-{currentModule.entityName.toLowerCase()} access assignments
              </CardDescription>
              <div className="flex gap-2 mt-4">
                <Button onClick={loadAccessRecords} variant="outline" disabled={loading}>
                  {loading ? 'Loading...' : 'Refresh'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Records */}
              {accessRecords.length > 0 && (
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by user name, phone, location, ID..."
                    value={searchRecordsInput}
                    onChange={(e) => setSearchRecordsInput(e.target.value)}
                    className="pl-10"
                  />
                </div>
              )}

              {loading ? (
                <div className="text-center py-8">Loading access records...</div>
              ) : accessRecords.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No access records found. Grant access to users above.
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  {filteredAccessRecords.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No records match your search criteria.
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>{currentModule.entityName}</TableHead>
                          <TableHead>Granted At</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAccessRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.id}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{record.userName || 'Unknown User'}</span>
                              <span className="text-sm text-gray-500">{record.userPhone || `ID: ${record.userId}`}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{record.entityName || `Unknown ${currentModule.entityName}`}</span>
                              <span className="text-sm text-gray-500">
                                {record.entityCode || `ID: ${record.entityId}`}
                                {record.location && ` • ${record.location}`}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(record.grantedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRevokeAccess(record.userId, record.entityId)}
                              disabled={loading}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Revoke
                            </Button>
                          </TableCell>
                        </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Check Access Tab */}
        <TabsContent value="check">
          <Card>
            <CardHeader>
              <CardTitle>Check User Access</CardTitle>
              <CardDescription>
                Verify if a specific user has access to a specific {currentModule.entityName.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* User Search for Check Access */}
                  <div className="space-y-2">
                    <Label htmlFor="checkUserSearch">Search User (Phone/Name/ID)</Label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="checkUserSearch"
                        type="text"
                        placeholder="e.g., 9999888777 or Admin User"
                        value={userSearchInput}
                        onChange={(e) => {
                          setUserSearchInput(e.target.value);
                          searchUsers(e.target.value);
                        }}
                        className="pl-8"
                      />
                    </div>
                    {loadingUsers && <p className="text-sm text-gray-500">Searching users...</p>}
                    {userSearchInput && userOptions.length > 0 && (
                      <div className="border rounded-md bg-white z-10 max-h-40 overflow-y-auto">
                        {userOptions.map((user) => (
                          <button
                            key={user.id}
                            type="button"
                            className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm"
                            onClick={() => {
                              setSearchUserId(user.id.toString());
                              setUserSearchInput('');
                              setUserOptions([]);
                            }}
                          >
                            {user.label}
                          </button>
                        ))}
                      </div>
                    )}
                    {searchUserId && (
                      <p className="text-sm text-green-600">✓ Selected User ID: {searchUserId}</p>
                    )}
                  </div>

                  {/* Entity Search for Check Access */}
                  <div className="space-y-2">
                    <Label htmlFor="checkEntitySearch">Search {currentModule.entityName} (Name/Location/ID)</Label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="checkEntitySearch"
                        type="text"
                        placeholder={`e.g., ${currentModule.entityName} Name or Location`}
                        value={entitySearchInput}
                        onChange={(e) => {
                          setEntitySearchInput(e.target.value);
                          searchEntities(e.target.value);
                        }}
                        className="pl-8"
                      />
                    </div>
                    {loadingEntities && <p className="text-sm text-gray-500">Searching {currentModule.entityName.toLowerCase()}s...</p>}
                    {entitySearchInput && entityOptions.length > 0 && (
                      <div className="border rounded-md bg-white z-10 max-h-40 overflow-y-auto">
                        {entityOptions.map((entity) => (
                          <button
                            key={entity.id}
                            type="button"
                            className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm"
                            onClick={() => {
                              setSearchEntityId(entity.id.toString());
                              setEntitySearchInput('');
                              setEntityOptions([]);
                            }}
                          >
                            {entity.label}
                          </button>
                        ))}
                      </div>
                    )}
                    {searchEntityId && (
                      <p className="text-sm text-green-600">✓ Selected {currentModule.entityName} ID: {searchEntityId}</p>
                    )}
                  </div>
                </div>

                <Button onClick={handleCheckAccess} disabled={loading} className="w-full">
                  {loading ? 'Checking...' : 'Check Access'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Access Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{accessRecords.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Unique Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {new Set(accessRecords.map(r => r.userId)).size}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Unique {currentModule.entityName}s</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {new Set(accessRecords.map(r => r.entityId)).size}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
