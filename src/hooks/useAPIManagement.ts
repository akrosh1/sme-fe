'use client';

import { IResponse } from '@/interface/api/api.interface';
import queryGenerator from '@/utils/queryGenerator';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useMemo } from 'react';
import { toast } from 'sonner';
import useFetch, { FetchOptions } from './useFetch';
import useFilter, { IUseFilterOptions } from './useFilter';

// Base API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Interface for paginated API responses
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Generic hook for fetching a list of resources
export const useResourceList = <T>(
  resource: string,
  filterOptions: IUseFilterOptions<{
    pageIndex?: number;
    pageSize?: number;
    sort?: string;
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
      enabled: true,
      // ts-expect-error will be fixed later
      onError: (error: IResponse<PaginatedResponse<T>>) => {
        toast.error(
          `Failed to fetch ${resource}: ${error?.error || 'Unknown error'}`,
        );
      },
    },
    searchParams,
  );

  return {
    ...query,
    data: query.data?.data,
    total: query.data?.total,
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
        console.log(`${resource} deleted successfully`);
        // Invalidate resource list queries
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
        console.log(`${resource} updated successfully`);
        // Invalidate resource list and single resource queries
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

// Generic hook for creating a resource (POST)
export const useCreateResource = <T>(
  resource: string,
  options?: FetchOptions<'post', Partial<T>, T>,
) => {
  const queryClient = useQueryClient();

  return useFetch<'post', Partial<T>, T>(
    `${API_BASE_URL}/${resource}`,
    'post',
    {
      ...options,
      onSuccess: (data, variables, context) => {
        console.log(`${resource} created successfully`);
        // Invalidate resource list queries
        queryClient.invalidateQueries({ queryKey: [resource] });
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
