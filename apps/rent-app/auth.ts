import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import { prisma } from "@/lib/prisma"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
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
    callbacks: {
        ...authConfig.callbacks,
        async signIn({ user, account, profile }) {
            // For OAuth providers
            if (account?.provider === "google" || account?.provider === "github") {
                try {
                    // Check if user exists
                    const existingUser = await prisma.user.findUnique({
                        where: { email: user.email! },
                    })

                    if (!existingUser) {
                        // Create new user with BUYER role
                        await prisma.user.create({
                            data: {
                                email: user.email!,
                                name: user.name,
                                image: user.image,
                                role: "BUYER",
                                emailVerified: new Date(),
                            },
                        })
                    } else {
                        // Update existing user's image and name if provided
                        if (user.image || user.name) {
                            await prisma.user.update({
                                where: { email: user.email! },
                                data: {
                                    ...(user.image && { image: user.image }),
                                    ...(user.name && { name: user.name }),
                                    emailVerified: new Date(),
                                },
                            })
                        }
                    }
                } catch (error) {
                    console.error("OAuth sign-in error:", error)
                    return false
                }
            }
            return true
        },
    },
})
