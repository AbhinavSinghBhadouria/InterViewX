import fs from "node:fs";
import path from "node:path";
import { performance } from "node:perf_hooks"; //high precision timer
import { PrismaClient } from "@prisma/client";
import { Redis } from "@upstash/redis";


//it is a scipt that measures how much faster redis caching is , as compared to database queries(Posgres) using a cache aside pattern


//this function loads env variables manually
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;  //checking if env exists

  const content = fs.readFileSync(filePath, "utf8"); //read files
  const lines = content.split(/\r?\n/);   //split into lines

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const firstEq = trimmed.indexOf("=");
    if (firstEq === -1) continue;

    const key = trimmed.slice(0, firstEq).trim();
    const rawValue = trimmed.slice(firstEq + 1).trim();

    if (!key || process.env[key]) continue;

    const unquoted =
      (rawValue.startsWith('"') && rawValue.endsWith('"')) ||
      (rawValue.startsWith("'") && rawValue.endsWith("'"))
        ? rawValue.slice(1, -1)
        : rawValue;

    process.env[key] = unquoted;
  }
}


//function for calculating the latency
function percentile(sorted, p) {

  if (sorted.length === 0) return 0;
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  const safeIndex = Math.min(Math.max(index, 0), sorted.length - 1);
  return sorted[safeIndex];

}


//this calculates statistics of benchmark runs
function stats(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const sum = values.reduce((acc, v) => acc + v, 0);

  return {
    runs: values.length,
    avgMs: Number((sum / Math.max(values.length, 1)).toFixed(2)),
    p50Ms: Number(percentile(sorted, 50).toFixed(2)),
    p95Ms: Number(percentile(sorted, 95).toFixed(2)),
    p99Ms: Number(percentile(sorted, 99).toFixed(2)),
    minMs: Number((sorted[0] ?? 0).toFixed(2)),
    maxMs: Number((sorted[sorted.length - 1] ?? 0).toFixed(2)),
  };
}

//this function calculates performance improvement
function reductionPercent(baselineMs, cachedMs) {
  if (baselineMs <= 0) return 0;
  return Number((((baselineMs - cachedMs) / baselineMs) * 100).toFixed(2));
}


//this function simulates cache aside pattern


// Client
//    |
// Redis Cache
//    |
// Database


async function benchmarkCacheAside({
  label,  //name of the bench mark
  key,  //redis key
  ttlSeconds,   //cache expiry
  producer,   //db query
  runs,   //number of tests
}) {
  const coldTimes = [];
  const warmTimes = [];


  //cold bench mark ie when redis is empty
  for (let i = 0; i < runs; i++) {
    await redis.del(key);  //delete the cache

    const coldStart = performance.now();  //timer starts
    const cached = await redis.get(key);  //check cache

    if (cached === null) {
      const fresh = await producer();  //cache miss so get the data form postgres
      await redis.set(key, fresh, { ex: ttlSeconds });  //set the key in redis
    }

    coldTimes.push(performance.now() - coldStart);  //record all time
  }  


  //warm cache benchmark

  const seed = await producer();
  await redis.set(key, seed, { ex: ttlSeconds });  //now cache has the data

  for (let i = 0; i < runs; i++) {
    const warmStart = performance.now();
    const cached = await redis.get(key);

    if (cached === null) {
      const fresh = await producer();
      await redis.set(key, fresh, { ex: ttlSeconds });
    }

    warmTimes.push(performance.now() - warmStart);
  }

  const cold = stats(coldTimes);
  const warm = stats(warmTimes);

  return {
    label,
    key,
    cold,
    warm,
    p50ReductionPercent: reductionPercent(cold.p50Ms, warm.p50Ms),
    p95ReductionPercent: reductionPercent(cold.p95Ms, warm.p95Ms),
    avgReductionPercent: reductionPercent(cold.avgMs, warm.avgMs),
  };
}



//redis + prisma setup
const root = process.cwd();
loadEnvFile(path.join(root, ".env.local"));
loadEnvFile(path.join(root, ".env"));

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error("Missing Upstash Redis env vars (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN)");
}

const prisma = new PrismaClient();
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});


async function main() {
  const runs = 30;
  const ttlSeconds = 60 * 60 * 24;

  const user = await prisma.user.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  if (!user) {
    throw new Error("No Prisma user found. Cannot run benchmark.");
  }

  const assessmentsKey = `interviewx:v1:assessments:${user.id}`;
  const roadmapsKey = `interviewx:v1:roadmaps:user:${user.id}`;

  //parallely running all the tests
  const [assessmentsBenchmark, roadmapsBenchmark] = await Promise.all([
    benchmarkCacheAside({
      label: "getAssessments",
      key: assessmentsKey,
      ttlSeconds,
      runs,
      producer: () =>
        prisma.assessment.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "asc" },
        }),
    }),
    benchmarkCacheAside({
      label: "getRoadmapHistory",
      key: roadmapsKey,
      ttlSeconds,
      runs,
      producer: () =>
        prisma.roadmap.findMany({
          where: { userId: user.id },
          orderBy: { updatedAt: "desc" },
        }),
    }),
  ]);


  //getting the overall average of all the results
  const combined = {
    p50ReductionPercent: Number(
      ((assessmentsBenchmark.p50ReductionPercent + roadmapsBenchmark.p50ReductionPercent) / 2).toFixed(2)
    ),
    p95ReductionPercent: Number(
      ((assessmentsBenchmark.p95ReductionPercent + roadmapsBenchmark.p95ReductionPercent) / 2).toFixed(2)
    ),
    avgReductionPercent: Number(
      ((assessmentsBenchmark.avgReductionPercent + roadmapsBenchmark.avgReductionPercent) / 2).toFixed(2)
    ),
  };

  const report = {
    generatedAt: new Date().toISOString(),
    runsPerMode: runs,
    userId: user.id,
    benchmarks: [assessmentsBenchmark, roadmapsBenchmark],
    combined,
  };

  console.log("BENCHMARK_REPORT", JSON.stringify(report));

  console.log("\nReadable summary:");
  for (const item of report.benchmarks) {
    console.log(
      `${item.label}: p50 ${item.cold.p50Ms}ms -> ${item.warm.p50Ms}ms (${item.p50ReductionPercent}% reduction), ` +
        `p95 ${item.cold.p95Ms}ms -> ${item.warm.p95Ms}ms (${item.p95ReductionPercent}% reduction)`
    );
  }
  console.log(
    `Combined: p50 reduction ${report.combined.p50ReductionPercent}%, p95 reduction ${report.combined.p95ReductionPercent}%`
  );
}

main()
  .catch((error) => {
    console.error("BENCHMARK_FAILED", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



//   Client Request
//       |
//       v
//   Redis Cache
//    |      |
// Hit      Miss
//  |        |
// Return   Database
//            |
//            v
//         Prisma ORM
//            |
//         PostgreSQL