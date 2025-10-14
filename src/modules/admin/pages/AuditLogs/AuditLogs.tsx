import React, { useEffect, useState } from 'react';
import { Shield, Download, Search, Filter, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { auditService, AuditLog, PaginatedAuditLogsResponse } from '@/services/admin/audit.service';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(50);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState<string>('');
  const [actionFilter, setActionFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [exporting, setExporting] = useState(false);

  const modules = ['AUTH', 'IOT', 'REPORTING', 'BIOGAS', 'COMMERCE', 'GOVERNMENT', 'GAUSHALA', 'PURIFICATION'];
  const actions = ['LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'EXPORT', 'VIEW', 'APPROVE', 'REJECT'];
  const statuses = ['SUCCESS', 'FAILED', 'WARNING'];

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const response: PaginatedAuditLogsResponse = await auditService.getAuditLogs(
        currentPage,
        pageSize,
        moduleFilter || undefined,
        actionFilter || undefined,
        statusFilter || undefined,
        searchTerm || undefined,
        startDate || undefined,
        endDate || undefined
      );

      setLogs(response.logs || []);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      toast.error('Failed to load audit logs. Please ensure the Reporting Service is running.');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [currentPage, moduleFilter, actionFilter, statusFilter, searchTerm, startDate, endDate]);

  const handleExport = async () => {
    try {
      setExporting(true);
      toast.info('Preparing CSV export...');

      const result = await auditService.exportAuditLogs({
        module: moduleFilter || undefined,
        action: actionFilter || undefined,
        status: statusFilter || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined
      });

      toast.success(`Successfully exported ${result.filename}`);
    } catch (error) {
      console.error('Failed to export audit logs:', error);
      toast.error('Failed to export audit logs.');
    } finally {
      setExporting(false);
    }
  };

  const clearFilters = () => {
    setModuleFilter('');
    setActionFilter('');
    setStatusFilter('');
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(0);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      SUCCESS: 'default',
      FAILED: 'destructive',
      WARNING: 'secondary'
    };
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status}
      </Badge>
    );
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const hasActiveFilters = moduleFilter || actionFilter || statusFilter || searchTerm || startDate || endDate;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">
            Comprehensive audit trail of all system activities
          </p>
        </div>
        <Button
          onClick={handleExport}
          disabled={exporting || logs.length === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          {exporting ? 'Exporting...' : 'Export CSV'}
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Search & Filter
              </CardTitle>
              <CardDescription>
                {totalElements} total audit log{totalElements !== 1 ? 's' : ''}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by username or details..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(0);
              }}
              className="pl-10"
            />
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 pt-4 border-t">
              <Select value={moduleFilter} onValueChange={(value) => {
                setModuleFilter(value === 'all' ? '' : value);
                setCurrentPage(0);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Module" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modules</SelectItem>
                  {modules.map((module) => (
                    <SelectItem key={module} value={module}>{module}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={actionFilter} onValueChange={(value) => {
                setActionFilter(value === 'all' ? '' : value);
                setCurrentPage(0);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {actions.map((action) => (
                    <SelectItem key={action} value={action}>{action}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={(value) => {
                setStatusFilter(value === 'all' ? '' : value);
                setCurrentPage(0);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setCurrentPage(0);
                }}
                placeholder="Start Date"
              />

              <Input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCurrentPage(0);
                }}
                placeholder="End Date"
              />

              {hasActiveFilters && (
                <div className="md:col-span-2 lg:col-span-5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Log Entries</CardTitle>
          <CardDescription>
            Showing {logs.length} of {totalElements} entries (Page {currentPage + 1} of {totalPages || 1})
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No audit logs found. Try adjusting your filters.
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-xs">
                          {formatTimestamp(log.timestamp)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.module}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{log.action}</TableCell>
                        <TableCell>{log.username}</TableCell>
                        <TableCell>{getStatusBadge(log.status)}</TableCell>
                        <TableCell className="text-xs">{log.ipAddress}</TableCell>
                        <TableCell className="text-xs max-w-xs truncate" title={log.details}>
                          {log.details}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} entries
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 0}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + Math.max(0, currentPage - 2);
                      if (page >= totalPages) return null;
                      return (
                        <Button
                          key={page}
                          variant={page === currentPage ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page + 1}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogs;
export { AuditLogs };
