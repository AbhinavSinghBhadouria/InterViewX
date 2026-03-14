//it is the redis utility file

import { redis } from "./client";

export type CacheSource = "cache" | "origin";


export async function getJSON<T>(key: string): Promise<T | null> {
  try {
    const value = await redis.get<T>(key);
    return value ?? null;
  } catch (error) {
    console.error(`Redis get failed for key: ${key}`, error);
    return null;
  }
}


export async function setJSON<T>(
  key: string,
  value: T,
  ttlSeconds?: number
): Promise<boolean> {
  try {
    if (ttlSeconds && ttlSeconds > 0) {
      await redis.set(key, value, { ex: ttlSeconds });
    } else {
      await redis.set(key, value);
    }
    return true;
  } catch (error) {
    console.error(`Redis set failed for key: ${key}`, error);
    return false;
  }
}


export async function deleteKey(key: string): Promise<boolean> {
  try {
    await redis.del(key);
    return true;
  } catch (error) {
    console.error(`Redis delete failed for key: ${key}`, error);
    return false;
  }
}


export async function deleteKeys(keys: string[]): Promise<boolean> {
  try {
    if (!keys.length) return true;
    await redis.del(...keys);
    return true;
  } catch (error) {
    console.error("Redis bulk delete failed", error);
    return false;
  }
}


export async function withCache<T>(
  key: string,
  producer: () => Promise<T>,
  ttlSeconds?: number
): Promise<{ data: T; source: CacheSource }> {

  const cached = await getJSON<T>(key);
  if (cached !== null) {
    return { data: cached, source: "cache" };
  }

  const fresh = await producer();  //getting the data from postgres
  await setJSON(key, fresh, ttlSeconds);

  return { data: fresh, source: "origin" };
}