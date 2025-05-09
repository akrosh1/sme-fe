'use client';

import type React from 'react';

import type { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { useEffect, useState } from 'react';
import { DataTableViewOptions } from './dataTableViewOptions';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filters?: Record<string, any>;
  onFilterChange?: (filters: Record<string, any>) => void;
  showColumnToggle?: boolean;
  children?: React.ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  filters,
  onFilterChange,
  showColumnToggle = true,
  children,
}: DataTableToolbarProps<TData>) {
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const debouncedGlobalFilter = useDebounce<string>(globalFilter, 500);

  useEffect(() => {
    if (onFilterChange && debouncedGlobalFilter !== undefined) {
      // Only update if the global filter has actually changed
      if (filters?.global !== debouncedGlobalFilter) {
        onFilterChange({
          ...filters,
          global: debouncedGlobalFilter,
        });
      }
    }
  }, [debouncedGlobalFilter, onFilterChange]);

  const isFiltered =
    table.getState().columnFilters.length > 0 || !!debouncedGlobalFilter;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="h-9 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              setGlobalFilter('');
              if (onFilterChange) {
                onFilterChange({});
              }
            }}
            className="h-9 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
        {children}
      </div>
      {showColumnToggle && <DataTableViewOptions table={table} />}
    </div>
  );
}
