import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React from 'react';

interface DataTableSkeletonProps {
  columns: number;
  rows: number;
}

export const DataTableSkeleton: React.FC<DataTableSkeletonProps> = ({
  columns = 5,
  rows = 5,
}) => {
  return (
    <div className="w-full">
      <Table className="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <TableHeader className="bg-grey-50">
          <TableRow>
            {Array.from({ length: columns }).map((_, index) => (
              <TableHead key={index} className="h-10">
                <Skeleton className="h-4 w-full" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={colIndex} className="h-12">
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex gap-3 items-center">
          <Skeleton className="h-8 w-14 bg-gray-300 dark:bg-gray-700" />
          <Skeleton className="h-6 w-20 bg-gray-300 dark:bg-gray-700" />
          <Skeleton className="h-8 w-14 bg-gray-300 dark:bg-gray-700" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-5 rounded-lg bg-gray-300 dark:bg-gray-700" />
          {Array.from({ length: 2 }).map((_, pageIndex) => (
            <Skeleton
              key={pageIndex}
              className="h-8 w-8 rounded-lg bg-gray-300 dark:bg-gray-700"
            />
          ))}
          <Skeleton className="h-5 w-5 rounded-lg bg-gray-300 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );
};
