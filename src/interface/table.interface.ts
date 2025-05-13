import { PaginationState } from '@tanstack/react-table';

export type PaginatedData<T> = {
  result: T[];
  rowCount: number;
};

export type PaginationParams = PaginationState;
export type SortParams = { sort_by: string; order: 'asc' | 'desc' | '' };
export type Filters<T> = Partial<
  T & PaginationParams & SortParams & { offset?: number; limit?: number }
>;
