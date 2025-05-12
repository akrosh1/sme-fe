'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { flexRender, type Header } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';

interface DataTableColumnHeaderProps<TData, TValue> {
  header: Header<TData, TValue>;
}

export function DataTableColumnHeader<TData, TValue>({
  header,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const isSortable = header.column.getCanSort();
  const isSorted = header.column.getIsSorted();

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
    </div>
  );
}
