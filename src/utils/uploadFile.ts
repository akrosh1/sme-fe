import { IResponse, IResponseError } from '@/interface/api/api.interface';
import cax from '@/lib/cax';
import { AxiosError, AxiosResponse } from 'axios';

interface ID {
  id: string;
}

export interface UploadResponse {
  id: ID;
  title: string;
  file: string;
  created_at?: string | Date;
  updated_at?: string | Date;
  created_by?: null;
}

export interface UploadOptions {
  onChange?: (
    file: UploadResponse | UploadResponse[] | null,
    err?: IResponseError | null,
  ) => void;
  multiple?: boolean;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  isProtected?: boolean;
}

async function upload(
  files: File[],
  { onChange, multiple = false, setLoading, isProtected = true }: UploadOptions,
) {
  try {
    setLoading?.(true);
    if (files.length > 0) {
      if (multiple && files.length > 1) {
        const uploadPromises = files.map((file) => {
          const formData = new FormData();
          formData.append('title', file.name);
          formData.append('file', file);
          return cax()
            .post(`/uploads/`, formData)
            .then((res) => res?.data?.data);
        });
        const response: UploadResponse[] = await Promise.all(uploadPromises);
        onChange?.(response, null);
        return [response, null];
      } else {
        const formData = new FormData();
        formData.append('title', files[0].name);
        formData.append('file', files[0]);
        formData.append('protected', isProtected.toString());
        const response: AxiosResponse<IResponse<UploadResponse>> =
          await cax().post(`/uploads/`, formData);
        onChange?.(response?.data?.data);
        return response?.data?.data;
      }
    }
  } catch (err: unknown) {
    onChange?.(
      null,
      (err as AxiosError<IResponse<null>>)?.response?.data?.error,
    );
    return [null, (err as AxiosError<IResponse<null>>)?.response?.data?.error];
  } finally {
    setLoading?.(false);
  }
}

export default upload;
