import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"

// Auth config for middleware (Edge-compatible, no Prisma)
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ], // Additional providers added in auth.ts
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const pathname = nextUrl.pathname

      // SEO pages that should ALWAYS be public
      const seoRoutes = ['/roommates/', '/realtors/', '/find-roommates']
      const isSeoRoute = seoRoutes.some(route => pathname.startsWith(route))
      if (isSeoRoute) return true

      // Public routes
      const publicRoutes = [
        '/', '/login', '/about', '/find-a-realtor', '/join-the-network',
        '/find-roommates', '/survey', '/rooms', '/roommates', '/groups',
        '/explore', '/onboarding', '/listing', '/api/auth', '/api/health',
        '/forgot-password', '/reset-password', '/verify-email', '/auth',
        '/host/onboarding', '/tenant/onboarding', // New user onboarding flows
      ]

      const isPublicRoute = publicRoutes.some(route =>
        pathname === route || pathname.startsWith(route + '/')
      )

      if (isPublicRoute) return true

      // Protected routes require login
      if (!isLoggedIn) return false

      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role ?? 'USER'
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
        ;(session.user as { role?: string }).role = token.role as string
        session.user.email = token.email as string
        session.user.name = token.name as string
      }
      return session
    },
  },
}
