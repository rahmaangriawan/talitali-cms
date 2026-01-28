import { prisma } from '~/server/utils/prisma'
import fs from 'fs'
import { getHeader, getRequestIP } from 'h3'

const log404 = async (event: any, userAgent: string | undefined, ip: string | undefined) => {
    const path = event.path
    if (path.startsWith('/_nuxt') || path.startsWith('/api/log-404')) return

    try {
        fs.appendFileSync('404-debug.log', `[${new Date().toISOString()}] Logging 404 for: ${path}\n`)
        const existing = await prisma.log404.findFirst({
            where: { path }
        })

        if (existing) {
            await prisma.log404.update({
                where: { id: existing.id },
                data: {
                    count: { increment: 1 },
                    lastSeen: new Date(),
                    userAgent,
                    ip
                }
            })
        } else {
            await prisma.log404.create({
                data: {
                    path,
                    userAgent,
                    ip
                }
            })
        }
    } catch (err: any) {
        fs.appendFileSync('404-debug.log', `[${new Date().toISOString()}] ERROR: ${err.message}\n`)
    }
}

export default defineNitroPlugin((nitroApp) => {
    fs.appendFileSync('404-debug.log', `[${new Date().toISOString()}] Nitro Plugin Initialized\n`)

    nitroApp.hooks.hook('error', async (error: any, { event }) => {
        if (!event) return
        if (error.statusCode === 404 || error.status === 404) {
            await log404(event, getHeader(event, 'user-agent'), getRequestIP(event))
        }
    })

    nitroApp.hooks.hook('render:response', async (response, { event }) => {
        if (response.statusCode === 404) {
            await log404(event, getHeader(event, 'user-agent'), getRequestIP(event))
        }
    })
})
