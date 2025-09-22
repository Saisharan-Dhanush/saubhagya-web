import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Users, UserPlus, Edit, Trash2, Search, Filter } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdDate: string;
}

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      email: 'rajesh@gaushala.com',
      role: 'Gaushala Admin',
      status: 'active',
      lastLogin: '2 hours ago',
      createdDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Priya Sharma',
      email: 'priya@biogas.com',
      role: 'Biogas Sangh',
      status: 'active',
      lastLogin: '1 day ago',
      createdDate: '2024-02-10'
    },
    {
      id: '3',
      name: 'Amit Patel',
      email: 'amit@sales.com',
      role: 'Sales Representative',
      status: 'inactive',
      lastLogin: '1 week ago',
      createdDate: '2024-01-20'
    },
    {
      id: '4',
      name: 'Sunita Devi',
      email: 'sunita@purification.com',
      role: 'Purification Operator',
      status: 'active',
      lastLogin: '3 hours ago',
      createdDate: '2024-03-05'
    },
    {
      id: '5',
      name: 'Dr. Suresh Verma',
      email: 'suresh@admin.com',
      role: 'Super Admin',
      status: 'active',
      lastLogin: '30 minutes ago',
      createdDate: '2023-12-01'
    }
  ];

  const getStatusBadge = (status: User['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500">Inactive</Badge>;
      case 'suspended':
        return <Badge className="bg-red-500">Suspended</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, string> = {
      'Super Admin': 'bg-purple-500',
      'Gaushala Admin': 'bg-blue-500',
      'Biogas Sangh': 'bg-green-500',
      'Sales Representative': 'bg-orange-500',
      'Purification Operator': 'bg-cyan-500',
      'Viewer': 'bg-gray-500'
    };
    return <Badge className={roleColors[role] || 'bg-gray-500'}>{role}</Badge>;
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage users, roles, and permissions across the platform
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Directory
          </CardTitle>
          <CardDescription>
            Total {mockUsers.length} users across all roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
              >
                <option value="all">All Roles</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Gaushala Admin">Gaushala Admin</option>
                <option value="Biogas Sangh">Biogas Sangh</option>
                <option value="Sales Representative">Sales Representative</option>
                <option value="Purification Operator">Purification Operator</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">User</th>
                  <th className="text-left p-4 font-medium">Role</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Last Login</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/30">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm">{user.lastLogin}</p>
                        <p className="text-xs text-muted-foreground">
                          Created: {new Date(user.createdDate).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No users found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Role Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Gaushala Admin</span>
                <Badge variant="secondary">1</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Biogas Sangh</span>
                <Badge variant="secondary">1</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Sales Rep</span>
                <Badge variant="secondary">1</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Purification Op</span>
                <Badge variant="secondary">1</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Super Admin</span>
                <Badge variant="secondary">1</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Users</span>
                <Badge className="bg-green-500">4</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Inactive Users</span>
                <Badge className="bg-gray-500">1</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Recent Logins</span>
                <Badge variant="secondary">3</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Export User List
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Bulk Import Users
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Role Permissions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserManagement;
export { UserManagement };