import { getQueryParam } from './getUrlParam';

type FormatUrlType = (href: string, params?: string[]) => string;

/** 要透传的参数 */
const PARAMS_LIST = ['__version', 'hideMenu'];

const handleUrlParam = (paramName = '', href = window.location.href) => {
  const paramVal = getQueryParam(paramName);
  if (!paramVal || href.includes(`${paramName}=${paramVal}`)) return href;
  return href.includes('?')
    ? `${href}&${paramName}=${paramVal}`
    : `${href}?${paramName}=${paramVal}`;
};

/**
 * @description 透传query参数
 */
const formatUrl: FormatUrlType = (href, params = PARAMS_LIST) =>
  params.reduce((link, param) => handleUrlParam(param, link), href ?? '');

export default formatUrl;
