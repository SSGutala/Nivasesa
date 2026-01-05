import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './auth'

// Launch mode: controls pre-launch (survey/waitlist) vs full platform
const LAUNCHED = process.env.LAUNCHED === 'true'

export async function middleware(request: NextRequest) {
  const session = await auth()
  const { pathname } = request.nextUrl

  // SEO pages that should ALWAYS be public (even before launch)
  const seoRoutes = [
    '/roommates/', // City-specific roommate pages like /roommates/frisco-tx
    '/realtors/',  // City-specific realtor pages like /realtors/frisco-tx
    '/find-roommates',
  ]

  const isSeoRoute = seoRoutes.some(route => pathname.startsWith(route))

  // Survey/waitlist pages for pre-launch mode
  const surveyRoutes = [
    '/survey',
  ]

  const isSurveyRoute = surveyRoutes.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  )

  // If NOT launched yet, only allow SEO pages, survey pages, and basic public routes
  if (!LAUNCHED) {
    const preLaunchPublicRoutes = [
      '/',
      '/login',
      '/about',
      '/find-a-realtor',
      '/join-the-network',
      '/join',
      '/explore',
      '/onboarding',
      '/listing',
      '/host',
      '/dashboard',
      '/api/auth',
      '/api/health',
    ]

    const isPreLaunchPublic = preLaunchPublicRoutes.some(route =>
      pathname === route || pathname.startsWith(route + '/')
    )

    // Allow SEO routes, survey routes, pre-launch public routes, and static assets
    if (isSeoRoute || isSurveyRoute || isPreLaunchPublic) {
      return NextResponse.next()
    }

    // Redirect all other routes to homepage (or survey if you prefer)
    return NextResponse.redirect(new URL('/', request.url))
  }

  // LAUNCHED MODE: Full platform routing below

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/about',
    '/find-a-realtor',
    '/join-the-network',
    '/join',
    '/find-roommates',
    '/survey',
    '/rooms',
    '/roommates',
    '/groups',
    '/explore',
    '/onboarding',
    '/listing',
    '/api/auth',
    '/api/health',
  ]

  // Check if current path is public
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  ) || isSeoRoute

  // If not logged in and trying to access protected route
  if (!session?.user && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Role-based route protection
  if (session?.user) {
    const userRole = session.user.role

    // Realtor-only routes
    const realtorRoutes = ['/dashboard', '/realtor/dashboard']
    const isRealtorRoute = realtorRoutes.some(route =>
      pathname === route || pathname.startsWith(route + '/')
    )

    if (isRealtorRoute && userRole !== 'REALTOR') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Buyer-only routes (for future buyer dashboard)
    const buyerRoutes = ['/buyer/dashboard']
    const isBuyerRoute = buyerRoutes.some(route =>
      pathname === route || pathname.startsWith(route + '/')
    )

    if (isBuyerRoute && userRole !== 'BUYER') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Admin-only routes (for future admin panel)
    const adminRoutes = ['/admin']
    const isAdminRoute = adminRoutes.some(route =>
      pathname === route || pathname.startsWith(route + '/')
    )

    if (isAdminRoute && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Host-only routes
    const hostRoutes = ['/host']
    const isHostRoute = hostRoutes.some(route =>
      pathname === route || pathname.startsWith(route + '/')
    )

    if (isHostRoute) {
      // TEMPORARY: Allow all logged in users to access host dashboard to prevent redirect loop
      // caused by session role propagation latency.
      // if (userRole !== 'HOST' && userRole !== 'LANDLORD' && userRole !== 'SUBLEASER') {
      //  return NextResponse.redirect(new URL('/', request.url))
      // }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
