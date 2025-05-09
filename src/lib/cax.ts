import axios, { AxiosInstance } from 'axios';

interface Options {
  baseURL?: string;
}

const cax = (access?: string | null, options?: Options): AxiosInstance => {
  const instance = axios.create({
    baseURL: options?.baseURL ?? process.env.NEXT_PUBLIC_API_URL,
  });

  instance.interceptors.request.use((config) => {
    const token = access ? access : localStorage.getItem('access');
    if (token && token !== 'undefined' && access !== null) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
      }
      if (!error?.response?.data || error.response.status === 500)
        return Promise.reject({
          response: {
            data: {
              error: 'Server Error',
            },
          },
        });
      return Promise.reject(error);
    },
  );
  return instance;
};

export default cax;
