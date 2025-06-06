'use client';

import queryGenerator from '@/utils/queryGenerator';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useMemo } from 'react';
import { toast } from 'sonner';
import useFetch, { FetchOptions } from './useFetch';
import useFilter, { IUseFilterOptions } from './useFilter';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
interface PaginatedResponse<T> {
  data: T;
  count: number;
  page: number;
  pageSize: number;
}

export const useResourceList = <T>(
  resource: string | null,

  filterOptions: IUseFilterOptions<{
    pageIndex?: number;
    pageSize?: number;
    sort?: string;
    enabled?: boolean;
    [key: string]: any;
  }> = { defaultQuery: {} },
) => {
  const { filters, setFilters, resetFilters, pageIndex, pageSize } =
    useFilter(filterOptions);

  // Generate query string from filters
  const searchParams = useMemo(() => queryGenerator(filters), [filters]);

  // Dynamic query key based on resource
  const queryKey = [resource, searchParams] as const;

  // Fetch resource list using useFetch
  const query = useFetch<
    'get',
    {
      page?: number;
      pageSize?: number;
      sort?: string;
      filters?: Record<string, any>;
    },
    PaginatedResponse<T>
  >(
    `${API_BASE_URL}/${resource}`,
    'get',
    {
      enabled: !!resource && true,
      // ts-expect-error will be fixed later
      onError: (error: AxiosError) => {
        toast.error(
          `Failed to fetch ${resource}: ${error?.message || 'Unknown error'}`,
        );
      },
    },
    searchParams,
  );

  return {
    ...query,
    data: query.data?.data,
    total: query.data?.data?.count,
    page: query.data?.page,
    pageSize: query.data?.pageSize,
    filters,
    setFilters,
    resetFilters,
    pageIndex,
    queryKey,
  };
};

// Generic hook for deleting a resource
export const useDeleteResource = <T>(
  resource: string,
  options?: FetchOptions<'delete', { id: string }, void>,
) => {
  const queryClient = useQueryClient();

  return useFetch<'delete', { id: string }, void>(
    `${API_BASE_URL}/${resource}`,
    'delete',
    {
      ...options,
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({ queryKey: [resource] });
        options?.onSuccess?.(data, variables, context);
      },
      onError: (error, variables, context) => {
        console.error(`Failed to delete ${resource}:`, error.message);
        options?.onError?.(error, variables, context);
      },
    },
  );
};

// Generic hook for updating a resource
export const useUpdateResource = <T>(
  resource: string,
  options?: FetchOptions<'patch', Partial<T>, T>,
) => {
  const queryClient = useQueryClient();

  return useFetch<'put', Partial<T>, T>(
    `${API_BASE_URL}/${resource}`,
    'patch',
    {
      ...options,
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({ queryKey: [resource] });
        queryClient.invalidateQueries({ queryKey: [resource, variables.id] });
        options?.onSuccess?.(data, variables, context);
      },
      onError: (error, variables, context) => {
        console.error(`Failed to update ${resource}:`, error.message);
        options?.onError?.(error, variables, context);
      },
    },
  );
};

// // Generic hook for creating a resource (POST)
export const useCreateResource = <T>(
  resource: string,
  options?: FetchOptions<'post', Partial<T>, T> & { queryKey?: readonly any[] },
) => {
  const queryClient = useQueryClient();

  return useFetch<'post', Partial<T>, T>(
    `${API_BASE_URL}/${resource}`,
    'post',
    {
      ...options,
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({
          queryKey: options?.queryKey ?? [resource],
        });
        options?.onSuccess?.(data, variables, context);
      },
      onError: (error, variables, context) => {
        console.error(`Failed to create ${resource}:`, error.message);
        options?.onError?.(error, variables, context);
      },
    },
  );
};

// Generic hook for fetching a single resource by ID
export const useResource = <T>(
  resource: string,
  id: string,
  options?: FetchOptions<'get', { id: string }, T>,
) => {
  const queryKey = [resource, id] as const;

  const query = useFetch<'get', { id: string }, T>(
    `${API_BASE_URL}/${resource}/${id}`,
    'get',
    {
      enabled: !!id,
      // @ts-expect-error will be fixed later
      onError: (error: AxiosError) => {
        console.error(
          `Failed to fetch ${resource} with ID ${id}:`,
          error?.message,
        );
      },
      ...options,
    },
  );

  return {
    ...query,
    data: query.data,
    queryKey,
  };
};
