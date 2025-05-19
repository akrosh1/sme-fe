// import SelectComponent from '@/components/common/form/selectComponent';
// import { Button } from '@/components/ui/button';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import React from 'react';

// interface PaginationProps {
//   totalRows: number;
//   rowsPerPage: number;
//   onRowsPerPageChange: (value: number | string) => void;
//   currentPage: number;
//   onPageChange: (pageIndex: number) => void;
//   canPreviousPage?: boolean;
//   canNextPage?: boolean;
// }

// const TablePagination: React.FC<PaginationProps> = ({
//   totalRows,
//   rowsPerPage,
//   currentPage,
//   canPreviousPage = currentPage > 1,
//   canNextPage = currentPage < totalRows / rowsPerPage && totalRows > 0,
//   onRowsPerPageChange,
//   onPageChange,
// }) => {
//   const paginationRange = () => {
//     const totalPageCount = Math.ceil(totalRows / rowsPerPage);
//     const siblingCount = 1;
//     const range = (start: number, end: number) => {
//       return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
//     };

//     if (totalPageCount <= 5) {
//       return range(1, totalPageCount);
//     }

//     const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
//     const rightSiblingIndex = Math.min(
//       currentPage + siblingCount,
//       totalPageCount,
//     );

//     const firstPageIndex = 1;
//     const lastPageIndex = totalPageCount;

//     if (currentPage <= 2) {
//       return [1, 2, 3, '...', lastPageIndex];
//     }

//     if (currentPage >= totalPageCount - 1) {
//       return [
//         firstPageIndex,
//         '...',
//         totalPageCount - 2,
//         totalPageCount - 1,
//         lastPageIndex,
//       ];
//     }

//     return [
//       firstPageIndex,
//       '...',
//       leftSiblingIndex,
//       currentPage,
//       rightSiblingIndex,
//       '...',
//       lastPageIndex,
//     ];
//   };
//   return (
//     <div className="flex items-center justify-between p-sm">
//       {/* Rows Info */}
//       <div className="flex items-center gap-xl">
//         <div className="flex font-semibold items-center gap-md">
//           <span className="text-sm text-grey-400">Total</span>
//           <span className="text-md text-grey-900 dark:text-grey-0 font-semibold">
//             {totalRows}
//           </span>
//         </div>
//         <div className="flex font-semibold items-center gap-md">
//           <span className="text-sm text-grey-400">Lines per page</span>
//           <span className="text-md text-grey-900 font-semibold">
//             <SelectComponent
//               variant="standard"
//               defaultValue={rowsPerPage.toString()}
//               onValueChange={onRowsPerPageChange}
//               options={[
//                 { label: '5', value: '5' },
//                 { label: '10', value: '10' },
//                 { label: '15', value: '15' },
//               ]}
//               placeholder={rowsPerPage.toString()}
//             />
//           </span>
//         </div>
//       </div>

//       {/* Pagination Controls */}
//       <div className="flex items-center space-x-2">
//         <Button
//           variant="outline"
//           size="sm"
//           className="dark:text-grey-0 dark:bg-gray-900 dark:hover:bg-cyprus-800 h-10 border-0 no-decoration disabled:border-0 hover:bg-green-0 hover:text-green-500"
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={!canPreviousPage}
//         >
//           <ChevronLeft className="h-4 w-4" />
//         </Button>

//         {paginationRange().map((page, idx) =>
//           page === '...' ? (
//             <span key={idx} className="text-gray-500">
//               ...
//             </span>
//           ) : (
//             <div
//               key={idx}
//               className={`cursor-pointer text-body16 h-[28px] w-[28px] rounded-sm flex items-center justify-center ${
//                 page === currentPage
//                   ? 'text-primary bg-green-0 dark:bg-cyprus-800 dark:text-grey-0'
//                   : 'text-grey-500'
//               }`}
//               onClick={() => onPageChange(Number(page))}
//             >
//               <span>{page}</span>
//             </div>
//           ),
//         )}

//         <Button
//           variant="outline"
//           size="sm"
//           className="dark:text-grey-0 dark:bg-gray-900 dark:hover:bg-cyprus-800 h-10 border-0 no-decoration disabled:border-0 hover:bg-green-0 hover:text-green-500"
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={!canNextPage}
//         >
//           <ChevronRight className="h-4 w-4" />
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default TablePagination;

'use client';

import SelectComponent from '@/components/common/form/selectComponent';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

interface PaginationProps {
  totalRows: number;
  rowsPerPage: number;
  onRowsPerPageChange: (value: number | string) => void;
  currentPage: number;
  onPageChange: (pageIndex: number) => void;
  canPreviousPage?: boolean;
  canNextPage?: boolean;
}

const TablePagination: React.FC<PaginationProps> = React.memo(
  ({
    totalRows,
    rowsPerPage,
    currentPage,
    canPreviousPage = currentPage > 1,
    canNextPage,
    onRowsPerPageChange,
    onPageChange,
  }) => {
    const rowsPerPageOptions = React.useMemo(
      () => [
        { label: '5', value: '5' },
        { label: '10', value: '10' },
        { label: '15', value: '15' },
        { label: '20', value: '20' },
      ],
      [],
    );

    const totalPageCount = React.useMemo(
      () => Math.ceil(totalRows / rowsPerPage),
      [totalRows, rowsPerPage],
    );

    const memoizedCanNextPage = React.useMemo(
      () => canNextPage ?? (currentPage < totalPageCount && totalRows > 0),
      [canNextPage, currentPage, totalPageCount, totalRows],
    );

    const handleRowsPerPageChange = React.useCallback(
      (value: string) => {
        onRowsPerPageChange(Number(value));
      },
      [onRowsPerPageChange],
    );

    const handlePageChange = React.useCallback(
      (page: number) => {
        if (page >= 1 && page <= totalPageCount) {
          onPageChange(page);
        }
      },
      [onPageChange, totalPageCount],
    );

    const paginationRange = React.useCallback(() => {
      const delta = 2; // Number of pages to show around current page
      const range = [];

      for (
        let i = Math.max(2, currentPage - delta);
        i <= Math.min(totalPageCount - 1, currentPage + delta);
        i++
      ) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        range.unshift('...');
      }
      if (currentPage + delta < totalPageCount - 1) {
        range.push('...');
      }

      range.unshift(1);
      if (totalPageCount > 1) {
        range.push(totalPageCount);
      }

      return range;
    }, [currentPage, totalPageCount]);

    const memoizedPaginationRange = React.useMemo(
      () => paginationRange(),
      [paginationRange],
    );

    return (
      <div className="flex items-center justify-between p-sm">
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
                onValueChange={handleRowsPerPageChange}
                options={rowsPerPageOptions}
                placeholder={rowsPerPage.toString()}
              />
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="dark:text-grey-0 dark:bg-gray-900 dark:hover:bg-cyprus-800 h-10 border-0 no-decoration disabled:border-0 hover:bg-green-0 hover:text-green-500"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!canPreviousPage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {memoizedPaginationRange.map((page, idx) =>
            page === '...' ? (
              <span key={idx} className="text-gray-500">
                ...
              </span>
            ) : (
              <div
                key={idx}
                className={`cursor-pointer text-body16 h-[28px] w-[28px] rounded-sm flex items-center justify-center ${
                  page === currentPage
                    ? 'text-primary bg-green-0 dark:bg-cyprus-800 dark:text-grey-0'
                    : 'text-grey-500'
                }`}
                onClick={() => handlePageChange(Number(page))}
              >
                <span>{page}</span>
              </div>
            ),
          )}

          <Button
            variant="outline"
            size="sm"
            className="dark:text-grey-0 dark:bg-gray-900 dark:hover:bg-cyprus-800 h-10 border-0 no-decoration disabled:border-0 hover:bg-green-0 hover:text-green-500"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!memoizedCanNextPage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  },
);

TablePagination.displayName = 'TablePagination';

export default TablePagination;
