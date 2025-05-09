export interface IListReponse<T> {
  code: number;
  data: {
    results: T[];
    next: string | null;
    previous: string | null;
    count: number;
  };
  message: string;
  error: IResponseError;
}

export interface IResponse<TD> {
  code: number;
  data: TD;
  message: string;
  error: IResponseError | null;
}

export interface IResponseError extends Record<string, unknown> {
  detail?: string;
  [key: string]: string | string[] | undefined;
}
