'use client';

import {
  type ColumnDef,
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type Row,
  type SortingState,
  type TableState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { DataTableColumnHeader } from './dataTableColumnHeader';
import { DataTableNoResults } from './dataTableNoResults';
import TablePagination from './dataTablePagination';
import { DataTableToolbar } from './dataTableToolbar';

export interface DataTableFilterOption<TData> {
  id: keyof TData | string;
  label: string;
  value: unknown;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  pagination?: {
    state: PaginationState;
    onPaginationChange?: OnChangeFn<PaginationState>;
    rowCount?: number;
  };
  sorting?: {
    state: SortingState;
    onSortingChange?: OnChangeFn<SortingState>;
  };
  columnVisibility?: {
    state?: Record<string, boolean>;
    onColumnVisibilityChange?: OnChangeFn<Record<string, boolean>>;
  };
  filters?: Record<string, any>;
  onFilterChange?: (filters: Record<string, any>) => void;
  loading?: boolean;
  headerControls?: React.ReactNode;
  rowProps?: (row: Row<TData>) => React.HTMLAttributes<HTMLTableRowElement>;
  noResults?: React.ReactNode;
  showColumnToggle?: boolean;
  className?: string;
}

export function DataTable<TData>({
  data,
  columns,
  pagination,
  sorting,
  columnVisibility,
  filters,
  onFilterChange,
  loading = false,
  headerControls,
  rowProps,
  noResults,
  showColumnToggle = true,
  className,
}: DataTableProps<TData>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      ...(pagination ? { pagination: pagination.state } : {}),
      ...(sorting ? { sorting: sorting.state } : {}),
      ...(columnVisibility ? { columnVisibility: columnVisibility.state } : {}),
      columnFilters,
    } as Partial<TableState>,
    ...(pagination
      ? {
          onPaginationChange: pagination.onPaginationChange,
          manualPagination: true,
          pageCount: pagination.rowCount
            ? Math.ceil(pagination.rowCount / pagination.state.pageSize)
            : -1,
        }
      : {}),
    ...(sorting
      ? {
          onSortingChange: sorting.onSortingChange,
          manualSorting: true,
        }
      : {}),
    ...(columnVisibility
      ? {
          onColumnVisibilityChange: columnVisibility.onColumnVisibilityChange,
        }
      : {}),
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
  });

  return (
    <div className={cn('space-y-4 w-full', className)}>
      <DataTableToolbar
        table={table}
        filters={filters}
        onFilterChange={onFilterChange}
        showColumnToggle={showColumnToggle}
      >
        {headerControls}
      </DataTableToolbar>
      <ScrollArea className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <DataTableColumnHeader header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {Array.from({ length: columns.length }).map(
                    (_, cellIndex) => (
                      <TableCell key={`skeleton-cell-${cellIndex}`}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ),
                  )}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-96 text-center"
                >
                  <DataTableNoResults>{noResults}</DataTableNoResults>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  {...(rowProps ? rowProps(row) : {})}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>
      {pagination && table.getPageCount() > 1 && (
        <TablePagination
          currentPage={table.getState().pagination.pageIndex + 1}
          onPageChange={table.setPageIndex}
          rowsPerPage={table.getState().pagination.pageSize}
          totalRows={table.getRowCount()}
          canPreviousPage={table.getCanPreviousPage()}
          canNextPage={table.getCanNextPage()}
          onRowsPerPageChange={table.setPageSize as any}
          key={table.getState().pagination.pageIndex}
        />
      )}
    </div>
  );
}
