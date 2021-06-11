import axios, { AxiosInstance, Method, AxiosResponse } from 'axios';

const apiInstance: AxiosInstance = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export function setApiTimeout(timeout: number): void {
  apiInstance.defaults.timeout = timeout;
}

export function ApiRequest<T>(
  url: string,
  method: Method = 'get',
  { params, data, headers }: { params?: any; data?: any; headers?: any } = {},
): Promise<AxiosResponse<T>> {
  return apiInstance.request({ url, method, params, data, headers });
}
