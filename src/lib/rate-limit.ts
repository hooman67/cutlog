/**
 * Simple sliding-window rate limiter (in-memory).
 *
 * Caveats:
 * - Resets on cold start (serverless function recycling).
 * - Not shared across multiple instances/regions.
 * - For production at scale, recommend Upstash Redis (@upstash/ratelimit)
 *   which provides distributed, persistent rate limiting with the same API.
 *
 * Usage:
 *   const limiter = createRateLimiter({ maxRequests: 30, windowMs: 60_000 })
 *   const result = limiter.check(ip)
 *   if (!result.success) return new Response('Too Many Requests', { status: 429 })
 */

interface RateLimitEntry {
  timestamps: number[]
}

interface RateLimiterOptions {
  /** Maximum number of requests allowed in the window */
  maxRequests: number
  /** Window duration in milliseconds */
  windowMs: number
}

interface RateLimitResult {
  /** Whether the request is allowed */
  success: boolean
  /** Number of requests remaining in the current window */
  remaining: number
  /** Unix timestamp (ms) when the window resets */
  reset: number
}

export function createRateLimiter(options: RateLimiterOptions) {
  const { maxRequests, windowMs } = options
  const store = new Map<string, RateLimitEntry>()

  // Periodic cleanup to prevent memory leaks (every 60s)
  let lastCleanup = Date.now()
  const CLEANUP_INTERVAL = 60_000

  function cleanup() {
    const now = Date.now()
    if (now - lastCleanup < CLEANUP_INTERVAL) return
    lastCleanup = now

    const keys = Array.from(store.keys())
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const entry = store.get(key)!
      const cutoff = now - windowMs
      entry.timestamps = entry.timestamps.filter(t => t > cutoff)
      if (entry.timestamps.length === 0) {
        store.delete(key)
      }
    }
  }

  function check(identifier: string): RateLimitResult {
    cleanup()

    const now = Date.now()
    const windowStart = now - windowMs

    let entry = store.get(identifier)
    if (!entry) {
      entry = { timestamps: [] }
      store.set(identifier, entry)
    }

    // Remove timestamps outside the current window
    entry.timestamps = entry.timestamps.filter(t => t > windowStart)

    // Calculate reset time based on oldest request in window
    const reset = entry.timestamps.length > 0
      ? entry.timestamps[0] + windowMs
      : now + windowMs

    if (entry.timestamps.length >= maxRequests) {
      return {
        success: false,
        remaining: 0,
        reset,
      }
    }

    // Allow the request
    entry.timestamps.push(now)
    const remaining = maxRequests - entry.timestamps.length

    return {
      success: true,
      remaining,
      reset,
    }
  }

  return { check }
}

// Pre-configured limiters for common use cases
export const authenticatedLimiter = createRateLimiter({
  maxRequests: 30,
  windowMs: 60_000, // 30 requests per minute
})

export const unauthenticatedLimiter = createRateLimiter({
  maxRequests: 5,
  windowMs: 60_000, // 5 requests per minute
})
