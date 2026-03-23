import { redis } from "./redis/client";

const MAX_REQUESTS_PER_MINUTE = 10;

export async function checkRateLimit(userId: string) {
  const key = `ratelimit:${userId}`;

  const requests = await redis.incr(key);

  // first request → set expiry
  if (requests === 1) {
    await redis.expire(key, 60); // 60 seconds
  }

  if (requests > MAX_REQUESTS_PER_MINUTE) {
    throw new Error("Too many requests. Please wait a moment before sending another message.");
  }
}