import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/loading'

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
          setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch (error) {
              // Cookie setting failed — this is okay, session will be handled client-side
            }
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const redirectUrl = new URL(next, requestUrl.origin)
      const response = NextResponse.redirect(redirectUrl)
      
      // Copy all cookies from cookieStore to response
      const allCookies = cookieStore.getAll()
      allCookies.forEach(cookie => {
        response.cookies.set(cookie.name, cookie.value)
      })
      
      return response
    }
  }

  // If something went wrong, redirect to login with error
  return NextResponse.redirect(new URL('/login?error=auth_failed', requestUrl.origin))
}
