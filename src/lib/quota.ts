import { redis } from "./redis/client";

const DAILY_MESSAGE_LIMIT = 100;

export async function checkDailyQuota(userId: string) {
  const key = `dailyquota:${userId}`;

  const messages = await redis.incr(key);

  // first message → set expiry
  if (messages === 1) {
    await redis.expire(key, 86400); // 24 hours
  }

  if (messages > DAILY_MESSAGE_LIMIT) {
    throw new Error(
      "You have reached the daily limit of 100 messages. Please try again tomorrow."
    );
  }
}