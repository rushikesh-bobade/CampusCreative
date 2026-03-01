import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

    // For development: Disable authentication enforcement
    // const { data: { user } } = await supabase.auth.getUser()
    const user = null; // Mock user or just allow all

    const isLoginPage = request.nextUrl.pathname.startsWith('/login')
    const isAuthCallback = request.nextUrl.pathname.startsWith('/auth/callback')
    const isLandingPage = request.nextUrl.pathname === '/'

    // If there is no user and the user is not on the login page or callback or landing page, redirect to login
    // if (!user && !isLoginPage && !isAuthCallback && !isLandingPage) {
    //   const redirectUrl = request.nextUrl.clone()
    //   redirectUrl.pathname = '/login'
    //   return NextResponse.redirect(redirectUrl)
    // }

    // If there is a user and the user is on the login page or landing page, redirect to dashboard
    // if (user && (isLoginPage || isLandingPage)) {
    //   const redirectUrl = request.nextUrl.clone()
    //   redirectUrl.pathname = '/dashboard'
    //   return NextResponse.redirect(redirectUrl)
    // }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth/callback (auth callback route)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth/callback).*)',
  ],
}
