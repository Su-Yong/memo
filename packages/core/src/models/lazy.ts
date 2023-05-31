export type Lazy<T> = T | Promise<T>;

export const toLazy = <T>(data: T): Lazy<T> => Promise.resolve(data);
export const fromLazy = async <T>(data: Lazy<T>): Promise<T> => {
  if (data instanceof Promise) return await data;
  return data;
};
