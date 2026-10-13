import { Injectable } from '@nestjs/common';
import { Redis } from '@upstash/redis';

@Injectable()
export class RedisService {
    private redis: Redis;
    constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }

  async set(
    key: string,
    value: string,
    ttlSeconds?: number,
  ): Promise<void> {
    if (ttlSeconds) {
      await this.redis.set(key, value, { ex: ttlSeconds });
    } else {
      await this.redis.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async expire(key: string, ttlSeconds: number): Promise<void> {
    await this.redis.expire(key, ttlSeconds);
  }

  async increment(key: string): Promise<number> {
    return this.redis.incr(key);
  }
}
