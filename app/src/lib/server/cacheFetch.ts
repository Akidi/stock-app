import { cache } from './redis';

export async function cached<T>(key: string, ttl: number, fetcher: () => Promise<T>): Promise<T> {
  const cached = await cache.get<T>(key);
  if (cached) return cached;

  const data = await fetcher();
  await cache.set(key, data, ttl);
  return data;
}
