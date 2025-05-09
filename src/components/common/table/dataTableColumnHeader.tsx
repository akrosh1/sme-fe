'use client';

import { flexRender, type Header, type Table } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface DataTableColumnHeaderProps<TData, TValue> {
  header: Header<TData, TValue>;
  table: Table<TData>;
  onFilterChange?: (filters: Record<string, any>) => void;
  filters?: Record<string, any>;
}

export function DataTableColumnHeader<TData, TValue>({
  header,
  table,
  onFilterChange,
  filters,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const [value, setValue] = useState<string>('');
  const debouncedValue = useDebounce<string>(value, 500);
  const isFilterable = header.column.getCanFilter();
  const filterKey =
    (header.column.columnDef.meta?.filterKey as string | undefined) ||
    undefined;

  const isSortable = header.column.getCanSort();
  const isSorted = header.column.getIsSorted();

  useEffect(() => {
    if (filterKey && onFilterChange && debouncedValue !== undefined) {
      // Only update if the filter value has actually changed
      if (filters?.[filterKey] !== debouncedValue) {
        onFilterChange({
          ...filters,
          [filterKey]: debouncedValue,
        });
      }
    }
  }, [debouncedValue, filterKey, onFilterChange]);

  return (
    <div className={cn('flex flex-col gap-1')}>
      <div
        className={cn(
          'flex items-center gap-1',
          isSortable && 'cursor-pointer select-none',
        )}
        onClick={
          isSortable ? header.column.getToggleSortingHandler() : undefined
        }
      >
        <span>
          {flexRender(header.column.columnDef.header, header.getContext())}
        </span>
        {isSortable && (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-1">
            {isSorted === 'desc' ? (
              <ArrowDown className="h-4 w-4" />
            ) : isSorted === 'asc' ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ChevronsUpDown className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      {isFilterable && filterKey && (
        <Input
          placeholder="Filter..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="h-8 w-full"
        />
      )}
    </div>
  );
}
