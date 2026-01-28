import { prisma } from '~/server/utils/prisma'
import { getServerSession } from '#auth'
import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import sharp from 'sharp'

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    if (!session) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        })
    }

    const formData = await readMultipartFormData(event)
    if (!formData) {
        throw createError({
            statusCode: 400,
            statusMessage: 'No files uploaded'
        })
    }

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public/uploads')
    try {
        await fs.access(uploadDir)
    } catch {
        await fs.mkdir(uploadDir, { recursive: true })
    }

    const results = []

    for (const file of formData) {
        if (file.name !== 'file') continue

        let buffer = file.data
        let filename = file.filename || 'upload'
        let mimeType = file.type || 'application/octet-stream'
        let extension = path.extname(filename).toLowerCase()
        const id = crypto.randomUUID()

        // Auto convert images to WebP
        if (mimeType.startsWith('image/') && mimeType !== 'image/svg+xml') {
            try {
                buffer = await sharp(file.data)
                    .webp({ quality: 80 })
                    .toBuffer()

                extension = '.webp'
                mimeType = 'image/webp'
                filename = filename.replace(/\.[^/.]+$/, "") + '.webp'
            } catch (e) {
                console.error('Sharp conversion failed, saving original:', e)
            }
        }

        const finalFilename = `${id}${extension}`
        const uploadPath = path.join(uploadDir, finalFilename)
        const url = `/uploads/${finalFilename}`

        await fs.writeFile(uploadPath, buffer)

        const media = await prisma.media.create({
            data: {
                filename: filename,
                url: url,
                mimeType: mimeType,
                size: buffer.length
            }
        })

        results.push(media)
    }

    return results
})
