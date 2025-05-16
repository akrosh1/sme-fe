// 'use client';

// import type { Table } from '@tanstack/react-table';
// import {
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
// } from 'lucide-react';

// import { Button } from '@/components/ui/button';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';

// interface DataTablePaginationProps<TData> {
//   table: Table<TData>;
// }

// export function DataTablePagination<TData>({
//   table,
// }: DataTablePaginationProps<TData>) {
//   return (
//     <div className="flex items-center justify-between px-2 py-4">
//       <div className="flex-1 text-sm text-muted-foreground">
//         {table.getFilteredRowModel().rows.length} row(s)
//       </div>
//       <div className="flex items-center space-x-6 lg:space-x-8">
//         <div className="flex items-center space-x-2">
//           <p className="text-sm font-medium">Rows per page</p>
//           <Select
//             value={`${table.getState().pagination.pageSize}`}
//             onValueChange={(value) => {
//               table.setPageSize(Number(value));
//             }}
//           >
//             <SelectTrigger className="h-8 w-[70px]">
//               <SelectValue placeholder={table.getState().pagination.pageSize} />
//             </SelectTrigger>
//             <SelectContent side="top">
//               {[10, 20, 30, 40, 50].map((pageSize) => (
//                 <SelectItem key={pageSize} value={`${pageSize}`}>
//                   {pageSize}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//         <div className="flex w-[100px] items-center justify-center text-sm font-medium">
//           Page {table.getState().pagination.pageIndex + 1} of{' '}
//           {table.getPageCount()}
//         </div>
//         <div className="flex items-center space-x-2">
//           <Button
//             variant="outline"
//             className="hidden h-8 w-8 p-0 lg:flex"
//             onClick={() => table.setPageIndex(0)}
//             disabled={!table.getCanPreviousPage()}
//           >
//             <span className="sr-only">Go to first page</span>
//             <ChevronsLeft className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="outline"
//             className="h-8 w-8 p-0"
//             onClick={() => table.previousPage()}
//             disabled={!table.getCanPreviousPage()}
//           >
//             <span className="sr-only">Go to previous page</span>
//             <ChevronLeft className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="outline"
//             className="h-8 w-8 p-0"
//             onClick={() => table.nextPage()}
//             disabled={!table.getCanNextPage()}
//           >
//             <span className="sr-only">Go to next page</span>
//             <ChevronRight className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="outline"
//             className="hidden h-8 w-8 p-0 lg:flex"
//             onClick={() => table.setPageIndex(table.getPageCount() - 1)}
//             disabled={!table.getCanNextPage()}
//           >
//             <span className="sr-only">Go to last page</span>
//             <ChevronsRight className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';
import SelectComponent from '../SelectComponent';

interface PaginationProps {
  totalRows: number;
  rowsPerPage: number;
  onRowsPerPageChange: (value: number | string) => void;
  currentPage: number;
  onPageChange: (pageIndex: number) => void;
  canPreviousPage?: boolean;
  canNextPage?: boolean;
}

const TablePagination: React.FC<PaginationProps> = ({
  totalRows,
  rowsPerPage,
  currentPage,
  canPreviousPage = currentPage > 1,
  canNextPage = currentPage < totalRows / rowsPerPage && totalRows > 0,
  onRowsPerPageChange,
  onPageChange,
}) => {
  const paginationRange = () => {
    const totalPageCount = Math.ceil(totalRows / rowsPerPage);
    const siblingCount = 1;
    const range = (start: number, end: number) => {
      return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
    };

    if (totalPageCount <= 5) {
      return range(1, totalPageCount);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount,
    );

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    if (currentPage <= 2) {
      return [1, 2, 3, '...', lastPageIndex];
    }

    if (currentPage >= totalPageCount - 1) {
      return [
        firstPageIndex,
        '...',
        totalPageCount - 2,
        totalPageCount - 1,
        lastPageIndex,
      ];
    }

    return [
      firstPageIndex,
      '...',
      leftSiblingIndex,
      currentPage,
      rightSiblingIndex,
      '...',
      lastPageIndex,
    ];
  };
  return (
    <div className="flex items-center justify-between p-sm">
      {/* Rows Info */}
      <div className="flex items-center gap-xl">
        <div className="flex font-semibold items-center gap-md">
          <span className="text-sm text-grey-400">Total</span>
          <span className="text-md text-grey-900 dark:text-grey-0 font-semibold">
            {totalRows}
          </span>
        </div>
        <div className="flex font-semibold items-center gap-md">
          <span className="text-sm text-grey-400">Lines per page</span>
          <span className="text-md text-grey-900 font-semibold">
            <SelectComponent
              variant="standard"
              defaultValue={rowsPerPage.toString()}
              onValueChange={onRowsPerPageChange}
              options={[
                { label: '5', value: '5' },
                { label: '10', value: '10' },
                { label: '15', value: '15' },
              ]}
              placeholder={rowsPerPage.toString()}
            />
          </span>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="dark:text-grey-0 dark:bg-gray-900 dark:hover:bg-cyprus-800 h-10 border-0 no-decoration disabled:border-0 hover:bg-green-0 hover:text-green-500"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canPreviousPage}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {paginationRange().map((page, idx) =>
          page === '...' ? (
            <span key={idx} className="text-gray-500">
              ...
            </span>
          ) : (
            <div
              key={idx}
              className={`cursor-pointer text-body16 h-[28px] w-[28px] rounded-sm flex items-center justify-center ${
                page === currentPage
                  ? 'text-green-600 bg-green-0 dark:bg-cyprus-800 dark:text-grey-0'
                  : 'text-grey-500'
              }`}
              onClick={() => onPageChange(Number(page))}
            >
              <span>{page}</span>
            </div>
          ),
        )}

        <Button
          variant="outline"
          size="sm"
          className="dark:text-grey-0 dark:bg-gray-900 dark:hover:bg-cyprus-800 h-10 border-0 no-decoration disabled:border-0 hover:bg-green-0 hover:text-green-500"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canNextPage}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TablePagination;
