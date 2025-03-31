import { createClient } from 'redis';
import { env } from '$env/dynamic/private';

const redis = createClient({ url: env.REDIS_URL });

let isConnected = false;

redis.on('error', (err) => console.error('❌ Redis error:', err));
redis.on('connect', () => console.log('🔌 Redis connecting...'));
redis.on('ready', () => console.log('✅ Redis connected'));

async function ensureConnected() {
  if (!isConnected) {
    await redis.connect();
    isConnected = true;
  }
}

function serialize(obj: any): any {
  return JSON.parse(JSON.stringify(obj, (_, val) =>
    typeof val === 'bigint' ? val.toString() : val
  ));
}

export const cache = {
  get: async <T = unknown>(key: string): Promise<T | null> => {
    await ensureConnected();
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  },

  set: async (key: string, data: unknown, ttl = 3600) => {
    await ensureConnected();
    if (data === undefined || data === null) {
      throw new Error(`Redis: tried to set null/undefined for ${key}`);
    }
    const safe = serialize(data);
    await redis.setEx(key, ttl, JSON.stringify(safe));
  },

  del: async (key: string) => {
    await ensureConnected();
    await redis.del(key);
  },

  exists: async (key: string) => {
    await ensureConnected();
    return await redis.exists(key);
  },

  incr: async (key: string) => {
    await ensureConnected();
    return await redis.incr(key);
  },

  raw: redis
};
