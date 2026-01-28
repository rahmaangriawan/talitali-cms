<template>
  <div class="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <div v-if="pending" class="space-y-12">
      <div class="h-96 bg-white rounded-3xl animate-pulse"></div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 6" :key="i" class="h-80 bg-white rounded-3xl animate-pulse"></div>
      </div>
    </div>
    
    <div v-else>
      <!-- Hero Section -->
      <section class="mb-20 text-center">
        <h1 class="text-6xl font-black text-slate-900 mb-6 tracking-tight">Our <span class="text-brand-600">Blog</span></h1>
        <p class="text-xl text-slate-500 max-w-2xl mx-auto">Discover stories, thoughts, and expertise from our talented authors.</p>
      </section>

      <!-- Posts Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article v-for="post in posts" :key="post.id" class="group bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/40 hover:-translate-y-2 transition-all duration-300">
          <!-- Featured Image -->
          <NuxtLink :to="'/' + post.slug" class="block aspect-video bg-slate-100 overflow-hidden">
            <img v-if="post.featuredImage" :src="post.featuredImage" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div v-else class="w-full h-full flex items-center justify-center text-slate-300">
              <Icon name="ph:image-square-bold" class="w-16 h-16" />
            </div>
          </NuxtLink>

          <div class="p-8">
            <div class="flex items-center gap-2 mb-4">
              <span v-if="post.category" class="px-3 py-1 bg-brand-50 text-brand-600 text-xs font-bold rounded-full uppercase tracking-wider">
                {{ post.category.name }}
              </span>
              <span class="text-slate-400 text-xs font-bold">{{ formatDate(post.createdAt) }}</span>
            </div>
            
            <h2 class="text-2xl font-bold text-slate-900 mb-4 group-hover:text-brand-600 transition-colors line-clamp-2">
              <NuxtLink :to="'/' + post.slug">{{ post.title }}</NuxtLink>
            </h2>
            
            <p v-if="post.excerpt" class="text-slate-500 line-clamp-3 mb-6 leading-relaxed">
              {{ post.excerpt }}
            </p>

            <div class="flex items-center gap-3 pt-6 border-t border-slate-50">
              <div class="w-8 h-8 rounded-full bg-slate-200"></div>
              <span class="text-sm font-bold text-slate-700">{{ post.author.name }}</span>
            </div>
          </div>
        </article>
      </div>
      
      <div v-if="posts.length === 0" class="text-center py-20 bg-white rounded-3xl border border-slate-100">
        <Icon name="ph:article-bold" class="w-16 h-16 text-slate-100 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-slate-400">No blog posts yet. Check back soon!</h3>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: settings } = await useAsyncData('settings', () => $fetch('/api/settings'))
const { data: posts, pending } = await useFetch('/api/public/posts')

useHead({
  title: 'Blog',
  meta: [
    { name: 'description', content: 'Read the latest stories and thoughts from our community.' },
    { property: 'og:title', content: () => `Blog - ${settings.value?.site_title || 'Talitali'}` },
    { property: 'og:description', content: 'Read the latest stories and thoughts from our community.' },
    { property: 'og:image', content: () => settings.value?.seo_image || '' }
  ]
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>
