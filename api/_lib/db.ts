// Cached-connection pattern for Mongoose in a serverless environment. Each
// Vercel function invocation can land on a fresh container (cold start) or
// reuse a warm one from a recent request; without caching, every cold start
// would open a brand-new connection pool against Atlas, and concurrent warm
// invocations racing to connect would each start their own pool too —
// Atlas's free/shared tiers have a real, fairly low total-connection cap.
//
// Stashing the connection promise on `globalThis` (not just a module-level
// variable) survives module re-evaluation edge cases some bundlers/dev
// servers introduce; a plain module-level variable is enough in production
// but the extra safety costs nothing.
import mongoose from "mongoose";
import { env } from "./env.js";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var _mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = globalThis._mongooseCache ?? { conn: null, promise: null };
globalThis._mongooseCache = cache;

export async function connectDB(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;
  if (!cache.promise) {
    cache.promise = mongoose.connect(env.MONGODB_URI, {
      bufferCommands: false,
      // Small on purpose — each concurrent Lambda instance holds its own
      // pool, and Atlas's lower tiers cap total connections across all of
      // them combined, not per-pool.
      maxPoolSize: 5,
    });
  }
  cache.conn = await cache.promise;
  return cache.conn;
}
