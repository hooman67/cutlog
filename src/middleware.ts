import { NextRequest, NextResponse } from 'next/server'

/**
 * Edge middleware for rate limiting all /api/* routes.
 *
 * Uses a simple Map-based sliding window approach compatible with Edge Runtime.
 * Note: This resets on cold start and is not shared across regions/instances.
 *
 * For production at scale, recommend Upstash Redis (@upstash/ratelimit)
 * which works in Edge Runtime and provides distributed rate limiting.
 */

interface RateLimitEntry {
  timestamps: number[]
}

// In-memory stores (Edge Runtime compatible — no Node.js imports needed)
const authenticatedStore = new Map<string, RateLimitEntry>()
const unauthenticatedStore = new Map<string, RateLimitEntry>()

const AUTHENTICATED_LIMIT = 30 // requests per minute
const UNAUTHENTICATED_LIMIT = 5 // requests per minute
const WINDOW_MS = 60_000

function getClientIp(request: NextRequest): string {
  // Vercel provides the real IP via x-forwarded-for or x-real-ip
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }
  return '127.0.0.1'
}

function checkRateLimit(
  store: Map<string, RateLimitEntry>,
  identifier: string,
  maxRequests: number
): { success: boolean; remaining: number; reset: number } {
  const now = Date.now()
  const windowStart = now - WINDOW_MS

  let entry = store.get(identifier)
  if (!entry) {
    entry = { timestamps: [] }
    store.set(identifier, entry)
  }

  // Remove timestamps outside the current window
  entry.timestamps = entry.timestamps.filter(t => t > windowStart)

  const reset = entry.timestamps.length > 0
    ? entry.timestamps[0] + WINDOW_MS
    : now + WINDOW_MS

  if (entry.timestamps.length >= maxRequests) {
    return { success: false, remaining: 0, reset }
  }

  entry.timestamps.push(now)
  const remaining = maxRequests - entry.timestamps.length

  return { success: true, remaining, reset }
}

// Periodic cleanup to prevent unbounded memory growth
let lastCleanup = 0
const CLEANUP_INTERVAL = 60_000

function cleanupStores() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now

  const cutoff = now - WINDOW_MS
  const stores = [authenticatedStore, unauthenticatedStore]
  for (let s = 0; s < stores.length; s++) {
    const store = stores[s]
    const keys = Array.from(store.keys())
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const entry = store.get(key)!
      entry.timestamps = entry.timestamps.filter(t => t > cutoff)
      if (entry.timestamps.length === 0) {
        store.delete(key)
      }
    }
  }
}

export function middleware(request: NextRequest) {
  // Only apply rate limiting to API routes
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  cleanupStores()

  const ip = getClientIp(request)

  // Check if the request has a Supabase auth cookie (sb-*-auth-token)
  const cookies = request.cookies.getAll()
  const hasAuthCookie = cookies.some(c =>
    c.name.includes('-auth-token') || c.name.includes('sb-')
  )

  // Apply appropriate rate limit
  const store = hasAuthCookie ? authenticatedStore : unauthenticatedStore
  const limit = hasAuthCookie ? AUTHENTICATED_LIMIT : UNAUTHENTICATED_LIMIT
  const result = checkRateLimit(store, ip, limit)

  if (!result.success) {
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests. Please try again later.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': result.reset.toString(),
          'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
        },
      }
    )
  }

  // Add rate limit headers to successful responses
  const response = NextResponse.next()
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
  response.headers.set('X-RateLimit-Reset', result.reset.toString())

  return response
}

export const config = {
  matcher: '/api/:path*',
}
