import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL!;
const token = process.env.UPSTASH_REDIS_REST_TOKEN!;

export const redis = new Redis({
  url,
  token,
});


export async function pingRedis() {
  try {
    await redis.set("redis:healthcheck", "ok", { ex: 30 });
    const value = await redis.get<string>("redis:healthcheck");
    return value === "ok";
  } catch (error) {
    console.error("Redis ping failed:", error);
    return false;
  }
}