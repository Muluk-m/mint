/**
 * 获取全部query参数
 */
export function getQueryParams(url = window.location.href) {
  if (!url) return {};

  const paramsMap: { [x in string]: string } = {};
  for (const [key, val] of new URL(url, window.location.origin).searchParams.entries())
    paramsMap[key as string] = val;
  return paramsMap;
}

/**
 * 获取指定query参数
 */
export function getQueryParam(name: string, url = window.location.href) {
  if (!url || !name) return null;

  return new URL(url, window.location.origin).searchParams.get(name);
}
