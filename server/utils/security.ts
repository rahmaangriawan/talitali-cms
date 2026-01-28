/**
 * Simple HTML Sanitizer for XSS prevention.
 * In production, it is recommended to use the 'sanitize-html' package.
 */
export const sanitizeContent = (html: string): string => {
    if (!html) return html

    return html
        // 1. Remove <script> tags and their content
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

        // 2. Remove inline event handlers (onerror, onclick, etc.)
        .replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '')

        // 3. Remove javascript: pseudo-protocol
        .replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"')

        // 4. Remove <iframe> tags (optional, but safer for blogs)
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')

        // 5. Remove <object> and <embed>
        .replace(/<(object|embed)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi, '')
}
