/**
 * Shed Detail Page - Enhanced with shadcn Data Table
 * Displays comprehensive shed information and cattle list with advanced features
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Home, AlertCircle, Activity, Search, Eye, ArrowUpDown } from 'lucide-react';
import { gauShalaApi, type Shed, type Cattle } from '../../../services/gaushala/api';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function ShedDetail() {
  const { shedNumber } = useParams<{ shedNumber: string }>();
  const navigate = useNavigate();

  const [shed, setShed] = useState<Shed | null>(null);
  const [cattle, setCattle] = useState<Cattle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCattle, setTotalCattle] = useState(0);

  useEffect(() => {
    if (shedNumber) {
      loadData();
    }
  }, [shedNumber, currentPage]);

  const loadData = async () => {
    if (!shedNumber) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch cattle in this shed
      const cattleResponse = await gauShalaApi.sheds.getCattleByShed(shedNumber, currentPage, 20);

      if (cattleResponse.success && cattleResponse.data) {
        setCattle(cattleResponse.data.content);
        setTotalPages(cattleResponse.data.totalPages);
        setTotalCattle(cattleResponse.data.totalElements);
      }

      // Fetch shed details
      const shedsResponse = await gauShalaApi.sheds.getAllSheds(0, 100);
      if (shedsResponse.success && shedsResponse.data) {
        const foundShed = shedsResponse.data.content.find((s: Shed) => s.shedNumber === shedNumber);
        if (foundShed) {
          setShed(foundShed);
        }
      }
    } catch (err) {
      console.error('Failed to load shed data:', err);
      setError('Failed to load shed details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCattleClick = (cattleId: number) => {
    navigate(`/gaushala/cattle/view/${cattleId}`);
  };

  const handleBack = () => {
    navigate('/gaushala/sheds');
  };

  // Define columns for the data table
  const columns: ColumnDef<Cattle>[] = [
    {
      accessorKey: 'uniqueAnimalId',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="hover:bg-transparent p-0"
          >
            Animal ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">
          {row.getValue('uniqueAnimalId')}
        </div>
      ),
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="hover:bg-transparent p-0"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-gray-900">
          {row.getValue('name') || <span className="text-gray-400">-</span>}
        </div>
      ),
    },
    {
      accessorKey: 'rfidTagNo',
      header: 'RFID Tag',
      cell: ({ row }) => (
        <div className="font-mono text-sm text-gray-600">
          {row.getValue('rfidTagNo') || <span className="text-gray-400">-</span>}
        </div>
      ),
    },
    {
      accessorKey: 'vaccinationStatus',
      header: 'Vaccination Status',
      cell: ({ row }) => {
        const status = row.getValue('vaccinationStatus') as string;
        return (
          <Badge
            variant={status === 'Completed' ? 'default' : 'secondary'}
            className={
              status === 'Completed'
                ? 'bg-green-100 text-green-800 hover:bg-green-100'
                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
            }
          >
            {status || 'Unknown'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'weight',
      header: () => <div className="text-right">Weight (kg)</div>,
      cell: ({ row }) => {
        const weight = row.getValue('weight') as number;
        return (
          <div className="text-right text-gray-900">
            {weight ? weight.toFixed(1) : <span className="text-gray-400">-</span>}
          </div>
        );
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const cattle = row.original;
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleCattleClick(cattle.id!);
            }}
            className="text-blue-600 hover:text-blue-900 hover:bg-blue-50"
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data: cattle,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shed details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const occupancyPercentage = shed ? ((shed.currentOccupancy / shed.capacity) * 100).toFixed(1) : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Sheds</span>
          </Button>

          <div className="h-8 w-px bg-gray-300"></div>

          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Home className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{shed?.shedName || `Shed ${shedNumber}`}</h2>
              <p className="text-gray-600">Shed Number: {shedNumber}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Shed Stats */}
      {shed && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Capacity</p>
                <p className="text-2xl font-bold text-gray-900">{shed.capacity}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Occupancy</p>
                <p className="text-2xl font-bold text-gray-900">{shed.currentOccupancy || 0}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Available Space</p>
                <p className="text-2xl font-bold text-gray-900">{shed.capacity - (shed.currentOccupancy || 0)}</p>
              </div>
              <Home className="h-8 w-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Occupancy Rate</p>
                <p className="text-2xl font-bold text-gray-900">{occupancyPercentage}%</p>
              </div>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                Number(occupancyPercentage) >= 90 ? 'bg-red-100 text-red-600' :
                Number(occupancyPercentage) >= 70 ? 'bg-yellow-100 text-yellow-600' :
                'bg-green-100 text-green-600'
              }`}>
                <span className="text-sm font-bold">%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cattle Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Cattle in this Shed</h3>
              <p className="text-sm text-gray-600 mt-1">{totalCattle} total animals</p>
            </div>
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by ID, name, or RFID tag..."
                value={(table.getColumn('uniqueAnimalId')?.getFilterValue() as string) ?? ''}
                onChange={(event) =>
                  table.getColumn('uniqueAnimalId')?.setFilterValue(event.target.value)
                }
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {cattle.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No cattle assigned to this shed yet</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleCattleClick(row.original.id!)}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing page {currentPage + 1} of {totalPages}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                      disabled={currentPage === 0}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                      disabled={currentPage >= totalPages - 1}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
