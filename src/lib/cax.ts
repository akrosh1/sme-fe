// import axios, { AxiosInstance } from 'axios';

// interface Options {
//   baseURL?: string;
// }

// const cax = (access?: string | null, options?: Options): AxiosInstance => {
//   const instance = axios.create({
//     baseURL: options?.baseURL ?? process.env.NEXT_PUBLIC_API_URL,
//   });
//   console.log('🚀 ~ cax ~ instance:', instance);

//   // instance.interceptors.request.use((config) => {
//   //   const token = access ? access : localStorage.getItem('token');
//   //   console.log('🚀 ~ instance.interceptors.request.use ~ token:', token);

//   //   if (token && token !== 'undefined' && access !== null) {
//   //     config.headers.Authorization = `Bearer ${token}`;
//   //   }
//   //   return config;
//   // });

//   instance.interceptors.request.use((config) => {
//     const token = access ? access : localStorage.getItem('token');
//     console.log('🚀 ~ instance.interceptors.request.use ~ token:', token);

//     if (token && token !== 'undefined' && access !== null) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   });

//   instance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//       if (error.response.status === 401) {
//         localStorage.removeItem('token');
//         localStorage.removeItem('refresh');
//       }
//       if (!error?.response?.data || error.response.status === 500)
//         return Promise.reject({
//           response: {
//             data: {
//               error: 'Server Error',
//             },
//           },
//         });
//       return Promise.reject(error);
//     },
//   );
//   return instance;
// };

// export default cax;

import axios, { AxiosInstance } from 'axios';

interface Options {
  baseURL?: string;
}

const cax = (access?: string | null, options?: Options): AxiosInstance => {
  const instance = axios.create({
    baseURL: options?.baseURL ?? process.env.NEXT_PUBLIC_API_URL,
  });

  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (err: any) => void;
  }> = [];

  const processQueue = (error: any, token?: string) => {
    failedQueue.forEach((prom) => {
      if (error) prom.reject(error);
      else prom.resolve(token!);
    });
    failedQueue = [];
  };

  instance.interceptors.request.use((config) => {
    const token = access ?? localStorage.getItem('token');
    console.log('🚀 ~ cax ~ request interceptor ~ token:', token);

    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(
        '🚀 ~ cax ~ setting Authorization header:',
        `Bearer ${token}`,
      );
    } else {
      console.warn('🚀 ~ cax ~ no valid token found');
      delete config.headers.Authorization;
    }

    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return instance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = localStorage.getItem('refresh');
          if (!refreshToken) throw new Error('No refresh token available');

          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            { refreshToken },
          );
          const newToken = response.data.accessToken;
          localStorage.setItem('token', newToken);
          instance.defaults.headers.common['Authorization'] =
            `Bearer ${newToken}`;
          processQueue(null, newToken);
          return instance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, undefined);
          localStorage.removeItem('token');
          localStorage.removeItem('refresh');
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      if (!error?.response?.data || error.response.status === 500) {
        return Promise.reject({
          response: {
            data: {
              error: 'Server Error',
            },
          },
        });
      }
      return Promise.reject(error);
    },
  );

  return instance;
};

export default cax;
