'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import useFilter, { IUseFilterOptions } from '@/hooks/useFilter';
import { SortParams } from '@/interface/table.interface';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ClipboardIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import SelectComponent from '../form/selectComponent';
import { DataTableColumnHeader } from './dataTableColumnHeader';

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  filterOptions?: IUseFilterOptions<SortParams>;
  itemsPerPage?: number;
  isPagination?: boolean;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  totalRows?: number;
}

export function DataTable<TData>({
  columns,
  data,
  filterOptions,
  itemsPerPage = 10,
  currentPage = 1,
  isPagination = true,
  onPageChange,
  onPageSizeChange,
  totalRows = 0,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: currentPage - 1,
    pageSize: itemsPerPage,
  });

  const { setFilters } = useFilter<
    TData & PaginationState & SortParams & { offset?: number; limit?: number }
  >(filterOptions as IUseFilterOptions<TData & PaginationState & SortParams>);

  useEffect(() => {
    setPagination({ pageIndex: currentPage - 1, pageSize: itemsPerPage });
  }, [currentPage, itemsPerPage]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === 'function' ? updater(pagination) : updater;

      setPagination(newPagination);
      onPageChange?.(newPagination.pageIndex + 1);
      if (newPagination.pageSize !== pagination.pageSize) {
        onPageSizeChange?.(newPagination.pageSize);
      }

      setFilters({
        ...filterOptions?.initialState,
        offset: newPagination.pageIndex * newPagination.pageSize,
        limit: newPagination.pageSize,
      });
    },
    state: { sorting, columnFilters, pagination },
    manualPagination: true,
    pageCount: Math.ceil(totalRows / pagination.pageSize) || 1,
  });

  const paginationRange = useMemo(() => {
    const totalPageCount = table.getPageCount();
    const current = pagination.pageIndex + 1;
    const siblingCount = 1;

    if (totalPageCount <= 5) {
      return Array.from({ length: totalPageCount }, (_, i) => i + 1);
    }

    const leftSibling = Math.max(current - siblingCount, 1);
    const rightSibling = Math.min(current + siblingCount, totalPageCount);
    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < totalPageCount - 1;

    if (!showLeftDots && showRightDots) {
      return [
        ...Array.from({ length: 3 }, (_, i) => i + 1),
        '...',
        totalPageCount,
      ];
    }

    if (showLeftDots && !showRightDots) {
      return [
        1,
        '...',
        ...Array.from({ length: 3 }, (_, i) => totalPageCount - 2 + i),
      ];
    }

    return [
      1,
      ...(showLeftDots ? ['...'] : []),
      ...Array.from(
        { length: rightSibling - leftSibling + 1 },
        (_, i) => leftSibling + i,
      ),
      ...(showRightDots ? ['...'] : []),
      totalPageCount,
    ];
  }, [pagination.pageIndex, pagination.pageSize, totalRows]);

  return (
    <div className="space-y-4 w-full">
      <div className="rounded-lg border border-accent overflow-hidden w-full">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {!header.isPlaceholder && (
                      <DataTableColumnHeader header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="border-y border-accent dark:border-gray-700"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap"
                      style={{
                        minWidth: cell.column.columnDef.minSize,
                        // @ts-expect-error: columnDef.minWidth might be undefined in certain cases
                        textAlign: cell.column.columnDef.meta?.align || 'left',
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-56 text-center"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full h-24 w-24 flex items-center justify-center">
                      <ClipboardIcon className="h-12 w-12" />
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 mt-2">
                      The list is currently empty
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {isPagination && (
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 font-semibold">
              <span className="text-sm text-gray-500">Total</span>
              <span className="text-base">{totalRows}</span>
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <span className="text-sm font-normal min-w-[100px] text-gray-500">
                Rows per page
              </span>
              <SelectComponent
                variant="standard"
                value={pagination.pageSize.toString()}
                onValueChange={(value) => table.setPageSize(Number(value))}
                options={[
                  { label: '5', value: '5' },
                  { label: '10', value: '10' },
                  { label: '15', value: '15' },
                ]}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {paginationRange.map((page, idx) =>
              page === '...' ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="text-gray-500 dark:text-gray-400"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={page}
                  variant={
                    page === pagination.pageIndex + 1 ? 'default' : 'outline'
                  }
                  size="sm"
                  onClick={() => table.setPageIndex(Number(page) - 1)}
                  aria-label={`Go to page ${page}`}
                >
                  {page}
                </Button>
              ),
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
