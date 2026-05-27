import Redis from 'ioredis';
import { env } from './env';

let redisClient: Redis | null = null;

export function getRedis(): Redis {
  if (!redisClient) {
    redisClient = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
    });
    redisClient.on('error', (err) => console.error('Redis error:', err));
    redisClient.on('connect', () => console.log('Redis connected'));
  }
  return redisClient;
}

export function getRedisConnection(): Redis {
  return new Redis(env.REDIS_URL, { maxRetriesPerRequest: null });
}
