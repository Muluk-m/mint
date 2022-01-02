import qs from 'qs';
import { merge } from 'lodash';
import { getQueryParams } from '@/utils/getUrlParam';

/**
 * 获取数据类型
 * @param val
 * @returns 返回类型字符串
 */
export const getValueType = (val: any): string => Object.prototype.toString.call(val).slice(8, -1);

/**
 * @description 合并query参数并序列化
 */
export const handleMergeQS = (url: string): string => {
  if (!url) return url;
  const curPageQS = getQueryParams();
  const carryQS = getQueryParams(url);
  const mergedParams = merge(curPageQS, carryQS);

  return `?${qs.stringify(mergedParams)}`;
};
