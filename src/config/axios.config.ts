import { AxiosRequestConfig } from 'axios';

const config: AxiosRequestConfig = {
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json; charset=utf-8'
  },
  responseType: 'json',
  validateStatus: () => {
    return true;
  }
};

export default config;
