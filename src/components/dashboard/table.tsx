'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../common/table';
import { Badge } from '../ui/badge';

// Example data type
interface Payment {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
  createdAt: string;
}

// Example data
const data: Payment[] = Array.from({ length: 10 }).map((_, i) => ({
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

export default function DataTableDemo() {
  // Define columns
  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: 's.n.',
      header: 'S.N.',
      enableSorting: false,
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
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

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Payments</h1>
      <DataTable
        data={data}
        columns={columns}
        filterOptions={{}}
        // pagination={{
        //   state: pagination,
        //   onPaginationChange: setPagination,
        //   rowCount: filteredDataLength,
        // }}
        // sorting={{
        //   state: sorting,
        //   onSortingChange: setSorting,
        // }}
        // columnVisibility={{
        //   state: columnVisibility,
        //   onColumnVisibilityChange: setColumnVisibility,
        // }}
        // filters={filters}
        // onFilterChange={handleFilterChange}
        // headerControls={
        //   <div className="flex items-center gap-2">
        //     <Button variant="outline" size="sm">
        //       <CalendarIcon className="mr-2 h-4 w-4" />
        //       Filter by date
        //     </Button>
        //     <Button variant="outline" size="sm">
        //       <DownloadIcon className="mr-2 h-4 w-4" />
        //       Export
        //     </Button>
        //   </div>
        // }
      />
    </div>
  );
}
