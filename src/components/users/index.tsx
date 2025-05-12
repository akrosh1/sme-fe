'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { CalendarIcon, DownloadIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DataTable } from '../common/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

// Example data type
interface Payment {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
  createdAt: string;
}

// Example data
const data: Payment[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `INV-${1000 + i}`,
  amount: Math.floor(Math.random() * 1000) + 100,
  status: ['pending', 'processing', 'success', 'failed'][
    Math.floor(Math.random() * 4)
  ] as Payment['status'],
  email: `user${i}@example.com`,
  createdAt: new Date(
    Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
  ).toISOString(),
}));

export default function UersTable() {
  // Pagination state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Sorting state
  const [sorting, setSorting] = useState([
    {
      id: 'createdAt',
      desc: true,
    },
  ]);

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState({});

  // Filters state
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Define columns
  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: 'id',
      header: 'Invoice',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('id')}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      meta: {
        filterKey: 'status',
      },
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge
            variant={
              status === 'success'
                ? 'success'
                : status === 'processing'
                  ? 'default'
                  : status === 'pending'
                    ? 'secondary'
                    : 'destructive'
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
      meta: {
        filterKey: 'email',
      },
    },
    {
      accessorKey: 'amount',
      header: () => <div className="text-right">Amount</div>,
      meta: {
        filterKey: 'amount',
        filterVariant: 'number',
      },
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue('amount'));
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(amount);

        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => {
        return new Date(row.getValue('createdAt')).toLocaleDateString();
      },
    },
  ];

  // Handle filter changes
  const handleFilterChange = (newFilters: Record<string, any>) => {
    // Check if filters have actually changed
    const hasChanged =
      Object.keys(newFilters).some((key) => filters[key] !== newFilters[key]) ||
      Object.keys(filters).some((key) => !newFilters.hasOwnProperty(key));

    if (hasChanged) {
      setFilters(newFilters);
      // Only reset pagination if filters changed
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
  };

  // Memoize filtered and sorted data to prevent recalculations on every render
  const { paginatedData, filteredDataLength } = useMemo(() => {
    // Apply filters
    const filteredData = data.filter((item) => {
      // Apply filters
      for (const [key, value] of Object.entries(filters)) {
        if (!value) continue;

        if (key === 'global') {
          const searchTerm = String(value).toLowerCase();
          if (
            !Object.values(item).some((val) =>
              String(val).toLowerCase().includes(searchTerm),
            )
          ) {
            return false;
          }
        } else if (key === 'status' && value) {
          if (!item.status.includes(String(value).toLowerCase())) {
            return false;
          }
        } else if (key === 'email' && value) {
          if (!item.email.toLowerCase().includes(String(value).toLowerCase())) {
            return false;
          }
        } else if (key === 'amount' && value) {
          if (item.amount < Number(value)) {
            return false;
          }
        }
      }
      return true;
    });

    // Apply sorting
    const sortedData = [...filteredData].sort((a, b) => {
      for (const sort of sorting) {
        const key = sort.id as keyof Payment;
        if (sort.desc) {
          if (a[key] < b[key]) return 1;
          if (a[key] > b[key]) return -1;
        } else {
          if (a[key] < b[key]) return -1;
          if (a[key] > b[key]) return 1;
        }
      }
      return 0;
    });

    // Apply pagination
    const paginatedData = sortedData.slice(
      pagination.pageIndex * pagination.pageSize,
      (pagination.pageIndex + 1) * pagination.pageSize,
    );

    return { paginatedData, filteredDataLength: filteredData.length };
  }, [data, filters, sorting, pagination.pageIndex, pagination.pageSize]);

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Payments</h1>
      <DataTable
        data={paginatedData}
        columns={columns}
        pagination={{
          state: pagination,
          onPaginationChange: setPagination,
          rowCount: filteredDataLength,
        }}
        sorting={{
          state: sorting,
          onSortingChange: setSorting,
        }}
        columnVisibility={{
          state: columnVisibility,
          onColumnVisibilityChange: setColumnVisibility,
        }}
        filters={filters}
        onFilterChange={handleFilterChange}
        headerControls={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Filter by date
            </Button>
            <Button variant="outline" size="sm">
              <DownloadIcon className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        }
      />
    </div>
  );
}
