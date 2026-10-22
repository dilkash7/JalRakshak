interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory token bucket for development / fallback
const memoryStore = new Map<string, RateLimitRecord>();

/**
 * Clean up expired rate limit records periodically
 */
setInterval(() => {
  const now = Date.now();
  memoryStore.forEach((record, key) => {
    if (now > record.resetAt) {
      memoryStore.delete(key);
    }
  });
}, 60000);

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Rate limit a key (e.g. client IP or IP + endpoint)
 * @param key Unique identifier for rate limiter
 * @param limit Maximum requests in the window
 * @param windowSeconds Window duration in seconds
 */
export async function rateLimit(
  key: string,
  limit: number = 30,
  windowSeconds: number = 60
): Promise<RateLimitResult> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // If Upstash Redis is configured in production, use Upstash REST API
  if (redisUrl && redisToken) {
    try {
      const url = `${redisUrl}/pipeline`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${redisToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["INCR", key],
          ["EXPIRE", key, windowSeconds],
        ]),
      });

      if (res.ok) {
        const data = await res.json();
        const current = data[0]?.result || 1;
        const remaining = Math.max(0, limit - current);
        return {
          success: current <= limit,
          limit,
          remaining,
          reset: Date.now() + windowSeconds * 1000,
        };
      }
    } catch (err) {
      console.warn("[RateLimit] Upstash Redis request failed, falling back to local memory:", err);
    }
  }

  // In-memory fallback
  const now = Date.now();
  const existing = memoryStore.get(key);

  if (!existing || now > existing.resetAt) {
    memoryStore.set(key, {
      count: 1,
      resetAt: now + windowSeconds * 1000,
    });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: now + windowSeconds * 1000,
    };
  }

  existing.count += 1;
  const remaining = Math.max(0, limit - existing.count);

  return {
    success: existing.count <= limit,
    limit,
    remaining,
    reset: existing.resetAt,
  };
}
