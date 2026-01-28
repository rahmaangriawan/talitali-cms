import fs from 'node:fs/promises'
import path from 'node:path'

const CACHE_DIR = path.join(process.cwd(), '.cache')

export const useCache = () => {
    const get = async (key: string) => {
        try {
            const filePath = path.join(CACHE_DIR, `${key}.json`)
            const stats = await fs.stat(filePath)

            // If older than 1 hour, ignore (simple TTL)
            if (Date.now() - stats.mtimeMs > 3600000) {
                return null
            }

            const data = await fs.readFile(filePath, 'utf-8')
            return JSON.parse(data)
        } catch {
            return null
        }
    }

    const set = async (key: string, data: any) => {
        try {
            await fs.mkdir(CACHE_DIR, { recursive: true })
            const filePath = path.join(CACHE_DIR, `${key}.json`)
            await fs.writeFile(filePath, JSON.stringify(data))
        } catch (e) {
            console.error('Cache set failed', e)
        }
    }

    const invalidate = async (key: string) => {
        try {
            const filePath = path.join(CACHE_DIR, `${key}.json`)
            await fs.unlink(filePath)
        } catch { }
    }

    return { get, set, invalidate }
}
