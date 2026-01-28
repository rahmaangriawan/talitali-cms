import CredentialsProvider from 'next-auth/providers/credentials'
import { NuxtAuthHandler } from '#auth'
import { prisma } from '~/server/utils/prisma'
import bcrypt from 'bcrypt'

export default NuxtAuthHandler({
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        // @ts-expect-error You need to use .default here for it to work during SSR. See L5 in https://github.com/sidebase/nuxt-auth/blob/main/playground/server/api/auth/%5B...%5D.ts
        CredentialsProvider.default({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                })

                if (!user) {
                    return null
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

                if (!isPasswordValid) {
                    await prisma.loginLog.create({
                        data: {
                            userId: user.id,
                            status: 'FAILED',
                            ip: 'unknown',
                            userAgent: 'unknown'
                        }
                    })
                    return null
                }

                await prisma.loginLog.create({
                    data: {
                        userId: user.id,
                        status: 'SUCCESS',
                        ip: 'unknown',
                        userAgent: 'unknown'
                    }
                })

                return {
                    id: user.id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        })
    ],
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.id = user.id
                token.role = (user as any).role
            }
            return token
        },
        session: async ({ session, token }) => {
            if (token && session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
            }
            return session
        }
    }
})
