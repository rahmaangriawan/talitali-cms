export default defineNuxtRouteMiddleware((to) => {
    // Only track on the client-side to get accurate referrer and avoid double-counting on SSR
    if (process.server) return

    // Do not track admin or auth pages
    if (to.path.startsWith('/admin') || to.path.startsWith('/auth') || to.path.startsWith('/api')) return

    // Ping tracking API
    // We use useRequestFetch or $fetch directly. In Nuxt 3 middleware, $fetch is available.
    $fetch('/api/analytics/track', {
        method: 'POST',
        body: {
            path: to.fullPath,
            referrer: document.referrer
        }
    }).catch(() => {
        // Fail silently to not disturb user
    })
})
