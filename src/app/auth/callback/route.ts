import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

/**
 * Auth callback route handler.
 *
 * When a user clicks the email confirmation link, Supabase redirects them here
 * with a `code` query parameter. This route exchanges that code for a session.
 *
 * IMPORTANT: For this to work in production, you must configure the Supabase Dashboard:
 *   1. Go to: Supabase Dashboard -> Authentication -> URL Configuration
 *   2. Set "Site URL" to: https://cutlog-two.vercel.app
 *   3. Add to "Redirect URLs": https://cutlog-two.vercel.app/**
 *
 *   Without this, Supabase will redirect confirmation emails to localhost:3000
 *   instead of the production URL, causing ERR_CONNECTION_FAILED for users.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Ignored - may not be able to set cookies in some contexts
            }
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // If code exchange fails, redirect to auth page with error
  return NextResponse.redirect(`${origin}/auth?error=Could+not+verify+email`)
}
