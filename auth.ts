import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const email = credentials.email as string

                // Demo Mode: Allow any password if email exists in our DB
                const user = await prisma.user.findUnique({
                    where: { email },
                })

                if (!user) {
                    return null
                }

                return user
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            return session;
        },
    },
})
