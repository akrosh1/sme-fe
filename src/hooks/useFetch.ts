import { IResponse } from '@/interface/api/api.interface';
import cax from '@/lib/cax';
import {
  MutationOptions,
  QueryOptions,
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import useGlobalState from './useGlobalState';

type TMethod = 'get' | 'post' | 'patch' | 'delete' | 'put';

export type FetchOptions<T extends TMethod, TD, TR> = T extends 'get'
  ? Omit<
      QueryOptions<IResponse<TR>, IResponse<TR>, Partial<TD>>,
      'queryKey' | 'queryFn'
    >
  : Omit<
      MutationOptions<IResponse<TR>, IResponse<TR>, Partial<TD>>,
      'mutationKey' | 'mutationFn'
    >;

type FetchResult<T extends TMethod, TR> = T extends 'get'
  ? UseQueryResult<TR, TR>
  : UseMutationResult<IResponse<TR>, IResponse<TR>>;

export default function useFetch<T extends TMethod, TD, TR = TD>(
  Url: string,
  method: TMethod,
  options?: FetchOptions<T, TD, TR> & { noAuth?: boolean; enabled?: boolean },
  searchParams?: string,
): FetchResult<T, TR> {
  const { access } = useGlobalState();
  const url = Url.includes('?') ? Url : Url.endsWith('/') ? Url : `${Url}/`;
  if (method === 'get') {
    // @ts-expect-error ts(2339)
    return useQuery({
      queryKey: [url, searchParams],
      queryFn: (): Promise<TR> =>
        cax(options?.noAuth ? null : (access as string))
          .get(url + (searchParams ? `?${searchParams}` : ''))
          .then((res: AxiosResponse<TR>) => res.data)
          .catch((err: AxiosError<TR>) => {
            throw err.response?.data as TR;
          }),
      ...(options as Omit<QueryOptions<TR>, 'queryKey' | 'queryFn'>),
      enabled: options?.enabled === false ? false : true,
    }) as FetchResult<'get', TR>;
  } else {
    return useMutation<IResponse<TR>, IResponse<TR>, Partial<TD>>({
      mutationKey: [url],
      mutationFn: (data: Partial<TD>): Promise<IResponse<TR>> =>
        // prettier-ignore
        cax(options?.noAuth ? null : (access as string))[method](
            // @ts-expect-error ts(2339)
            url + (method === 'delete' ? `${data?.id as string}` : ''),
            data as TD & AxiosRequestConfig,
          )
          .then((res: AxiosResponse<IResponse<TR>>) => res.data)
          .catch((err: AxiosError<IResponse<TR>>) => {
            throw err.response?.data as IResponse<TR>;
          }),
      ...(options as Omit<
        MutationOptions<IResponse<TR>, IResponse<TR>, Partial<TD>>,
        'mutationKey' | 'mutationFn'
      >),
    }) as FetchResult<T, TR>;
  }
}
