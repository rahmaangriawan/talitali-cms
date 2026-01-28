<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50">
    <div class="text-center">
      <h1 class="text-9xl font-black text-brand-100">404</h1>
      <p class="text-2xl font-bold text-slate-900 mt-4">Page Not Found</p>
      <p class="text-slate-500 mt-2 mb-8">The page you are looking for doesn't exist or has been moved.</p>
      <a href="/" class="btn-primary inline-block px-8 py-3 rounded-full shadow-lg shadow-brand-100">Go Back Home</a>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  error: Object
})

const route = useRoute()

// Server-side logging
if (process.server && Number(props.error?.statusCode) === 404) {
  const event = useRequestEvent()
  if (event) {
    const path = event.path || route.path
    const userAgent = event.node.req.headers['user-agent']
    
    // Use dynamic imports but with proper error handling
    Promise.all([
      import('h3'),
      import('~/server/utils/prisma')
    ]).then(([{ getRequestIP }, { prisma }]) => {
      const ip = getRequestIP(event)
      prisma.log404.upsert({
        where: { path },
        update: {
          count: { increment: 1 },
          lastSeen: new Date(),
          userAgent,
          ip
        },
        create: {
          path,
          userAgent,
          ip
        }
      }).catch(err => console.error('Prisma 404 Log Error:', err))
    }).catch(err => console.error('Import Error in error.vue:', err))
  }
}

// Client-side logging
onMounted(() => {
  if (props.error?.statusCode == 404) {
    $fetch('/api/log-404', {
      method: 'POST',
      body: {
        path: route.path,
        userAgent: navigator.userAgent
      }
    }).catch(() => {})
  }
})
</script>
