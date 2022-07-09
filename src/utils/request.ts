import axios, { AxiosResponse } from 'axios';
import { message } from 'antd';
import { AxiosStatic, AxiosResponse as AxiosResponsePrivate } from '@/typings/axios';

import config from '../config/axios.config';

const request = axios.create(config);

request.interceptors.response.use((response: AxiosResponse<AxiosResponsePrivate<unknown>>) => {
  switch (String(response.status).slice(0, 1)) {
    case '4':
      message.error(
        `${response.data?.error ? JSON.stringify(response.data.error) : ''}  ${
          response.data?.message ?? '-'
        }`,
        6
      );
      break;
    case '5':
      message.error('服务异常,请联系管理员', 5);
      break;
    case '2':
      if (response.data?.code !== 0)
        message.error(response.data?.message ?? '未知异常,请联系管理员', 6);
      break;
    default:
      message.error('未知异常,请联系管理员', 5);
  }

  return response.data;
});

export default request as unknown as AxiosStatic;
