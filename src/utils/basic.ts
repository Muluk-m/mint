export type Numeric = number | string;

export function get(object: any, path: string): any {
  const keys = path.split('.');
  let result = object;

  for (const key of keys) {
    result = result[key] ?? '';
  }

  return result;
}

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export function pick<T, U extends keyof T>(
  obj: T,
  keys: ReadonlyArray<U>,
  ignoreUndefined?: boolean
) {
  return keys.reduce((ret, key) => {
    if (!ignoreUndefined || obj[key] !== undefined) {
      // eslint-disable-next-line no-param-reassign
      ret[key] = obj[key];
    }
    return ret;
  }, {} as Writeable<Pick<T, U>>);
}
