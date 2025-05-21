// 'use client';

// import { Filters } from '@/interface/table.interface';
// import { clearObject } from '@/utils/objectUtils';
// import queryGenerator from '@/utils/queryGenerator';
// import { usePathname, useRouter, useSearchParams } from 'next/navigation';
// import { useCallback, useEffect, useMemo } from 'react';

// export interface IUseFilterOptions<T> {
//   defaultQuery?: Partial<T>;
// }

// interface IUseFilterResult<T> {
//   filters: Filters<T>;
//   setFilters: (query: Partial<Filters<T>>) => void;
//   resetFilters: () => void;
//   pageIndex: number;
//   pageSize: number;
// }

// export default function useFilter<T>({
//   defaultQuery = {},
// }: IUseFilterOptions<T>): IUseFilterResult<T> {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const pathname = usePathname();

//   const filters = useMemo(() => {
//     const entries = Array.from(searchParams.entries()) as [string, string][];
//     return Object.fromEntries(entries) as Filters<T>;
//   }, [searchParams]);

//   const pageSize = useMemo(() => {
//     const limit = Number(filters.limit);
//     return isNaN(limit) || limit <= 0 ? 10 : limit;
//   }, [filters.limit]);

//   const pageIndex = useMemo(() => {
//     const offset = Number(filters.offset);
//     return isNaN(offset) || offset < 0 ? 0 : Math.floor(offset / pageSize);
//   }, [filters.offset, pageSize]);

//   const setFilters = useCallback(
//     (query: Partial<Filters<T>>) => {
//       const currentParams = Object.fromEntries(searchParams.entries());
//       const updatedParams = clearObject({ ...currentParams, ...query });
//       const newSearchParams = new URLSearchParams();

//       for (const [key, value] of Object.entries(updatedParams)) {
//         if (value === null || value === undefined) continue;

//         switch (key) {
//           case 'pageIndex':
//             newSearchParams.set(
//               'offset',
//               ((value as number) * pageSize).toString(),
//             );
//             break;
//           case 'pageSize':
//             newSearchParams.set('limit', String(value));
//             break;
//           default:
//             newSearchParams.set(key, String(value));
//         }
//       }

//       router.replace(`${pathname}?${newSearchParams.toString()}`, {
//         scroll: false,
//       });
//     },
//     [pathname, router, pageSize, searchParams],
//   );

//   // Reset filters to defaultQuery
//   const resetFilters = useCallback(() => {
//     const queryString = queryGenerator<Filters<T>>(defaultQuery as Filters<T>);
//     router.replace(`${pathname}?${queryString}`, { scroll: false });
//   }, [pathname, router, defaultQuery]);

//   // Apply defaultQuery on mount
//   useEffect(() => {
//     if (Object.keys(defaultQuery).length > 0 && !searchParams.size) {
//       const newSearchParams = new URLSearchParams();
//       for (const [key, value] of Object.entries(defaultQuery)) {
//         if (value !== '' && value != null) {
//           switch (key) {
//             case 'pageIndex':
//               newSearchParams.set(
//                 'offset',
//                 ((value as number) * pageSize).toString(),
//               );
//               break;
//             case 'pageSize':
//               newSearchParams.set('limit', String(value));
//               break;
//             default:
//               newSearchParams.set(key, String(value));
//           }
//         }
//       }
//       router.replace(`${pathname}?${newSearchParams.toString()}`, {
//         scroll: false,
//       });
//     }
//   }, [defaultQuery, pageSize, pathname, router, searchParams.size]);

//   return {
//     filters,
//     setFilters,
//     resetFilters,
//     pageIndex,
//     pageSize,
//   };
// }

'use client';

import { Filters } from '@/interface/table.interface';
import { clearObject } from '@/utils/objectUtils';
import queryGenerator from '@/utils/queryGenerator';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';

export interface IUseFilterOptions<T> {
  defaultQuery?: Partial<T>;
}

interface IUseFilterResult<T> {
  filters: Filters<T>;
  setFilters: (query: Partial<Filters<T>>) => void;
  resetFilters: () => void;
  pageIndex: number;
  pageSize: number;
}

const DEFAULT_PAGE_SIZE = 10;

export default function useFilter<T>({
  defaultQuery = {},
}: IUseFilterOptions<T>): IUseFilterResult<T> {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filters = useMemo(() => {
    const params = Object.fromEntries(searchParams.entries()) as Filters<T>;
    return {
      ...defaultQuery,
      ...params,
    };
  }, [searchParams, defaultQuery]);

  const pageSize = useMemo(() => {
    const limit = Number(filters.limit);
    return isNaN(limit) || limit <= 0 ? DEFAULT_PAGE_SIZE : limit;
  }, [filters.limit]);

  const pageIndex = useMemo(() => {
    const offset = Number(filters.offset);
    return isNaN(offset) || offset < 0 ? 0 : Math.floor(offset / pageSize);
  }, [filters.offset, pageSize]);

  const setFilters = useCallback(
    (query: Partial<Filters<T>>) => {
      const currentParams = Object.fromEntries(searchParams.entries());
      const updatedParams = clearObject({ ...currentParams, ...query });
      const newSearchParams = new URLSearchParams();

      Object.entries(updatedParams).forEach(([key, value]) => {
        if (value != null && value !== '') {
          newSearchParams.set(key, String(value));
        }
      });

      router.replace(`${pathname}?${newSearchParams.toString()}`, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  const resetFilters = useCallback(() => {
    const queryString = queryGenerator<Filters<T>>(defaultQuery as Filters<T>);
    router.replace(`${pathname}?${queryString}`, { scroll: false });
  }, [pathname, router, defaultQuery]);

  useEffect(() => {
    if (Object.keys(defaultQuery).length > 0 && !searchParams.size) {
      resetFilters();
    }
  }, [defaultQuery, resetFilters, searchParams.size]);

  return {
    filters,
    setFilters,
    resetFilters,
    pageIndex,
    pageSize,
  };
}
