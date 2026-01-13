import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import { authConfig } from '@niv/auth';
import { prisma } from './lib/prisma';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Monorepo type compatibility: Different Next.js versions in workspace cause type conflicts
// The code works correctly at runtime - this assertion resolves the build-time type mismatch
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email },
          include: { realtorProfile: true },
        });

        if (!user || !user.password) return null;

        // Demo mode - accept any password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
} as unknown as NextAuthConfig);
