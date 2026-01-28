<template>
  <div class="py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div v-if="pending" class="animate-pulse space-y-8">
        <div class="h-10 bg-slate-200 rounded-lg w-3/4"></div>
        <div class="h-4 bg-slate-100 rounded-lg w-1/4"></div>
        <div class="h-[400px] bg-slate-50 rounded-3xl w-full"></div>
        <div class="space-y-4">
          <div class="h-4 bg-slate-100 rounded-lg w-full"></div>
          <div class="h-4 bg-slate-100 rounded-lg w-full"></div>
          <div class="h-4 bg-slate-100 rounded-lg w-2/3"></div>
        </div>
      </div>
      
      <div v-else-if="content" class="grid grid-cols-1 lg:grid-cols-10 gap-12">
        <!-- Main Content -->
        <div class="lg:col-span-7">
          <!-- Article Header -->
          <header class="mb-12">
            <div v-if="content._type === 'post'" class="flex items-center gap-3 mb-6">
              <span v-if="content.category" class="px-3 py-1 bg-brand-50 text-brand-600 text-xs font-bold rounded-full uppercase tracking-wider">
                {{ content.category.name }}
              </span>
              <span class="text-slate-400 text-sm font-medium">{{ formatDate(content.createdAt) }}</span>
            </div>
            
            <h1 class="text-5xl font-black text-slate-900 leading-tight mb-8">{{ content.title }}</h1>
            
            <div v-if="content._type === 'post'" class="flex items-center gap-4 py-6 border-y border-slate-100">
              <div class="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-lg">
                {{ content.author?.name?.charAt(0) || 'A' }}
              </div>
              <div>
                <p class="text-sm text-slate-400 font-medium">Written by</p>
                <p class="text-base font-bold text-slate-900">{{ content.author?.name || 'Admin' }}</p>
              </div>
            </div>
          </header>

          <!-- Featured Image -->
          <div v-if="content.featuredImage" class="mb-12 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50">
            <img :src="content.featuredImage" class="w-full h-auto object-cover" />
          </div>

          <!-- Content -->
          <div class="prose prose-slate prose-lg max-w-none prose-img:rounded-3xl prose-headings:font-black prose-headings:tracking-tight prose-a:text-brand-600" v-html="content.content"></div>

          <!-- Tags -->
          <div v-if="content.tags && content.tags.length > 0" class="mt-20 pt-10 border-t border-slate-100">
            <h4 class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 px-1">Tagged with</h4>
            <div class="flex flex-wrap gap-2">
              <NuxtLink 
                v-for="tag in content.tags" 
                :key="tag.id"
                :to="'/tag/' + tag.slug"
                class="px-4 py-2 bg-white border border-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:border-brand-600 hover:text-brand-600 transition-all shadow-sm"
              >
                #{{ tag.name }}
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <aside class="lg:col-span-3">
          <div class="sticky top-24 space-y-8">
            <!-- Random Posts -->
            <div class="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
              <h3 class="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                <Icon name="ph:sparkle-bold" class="w-5 h-5 text-red-600" />
                Baca Juga
              </h3>
              
              <div v-if="randomPosts && randomPosts.length > 0" class="space-y-6">
                <NuxtLink 
                  v-for="post in randomPosts" 
                  :key="post.id"
                  :to="`/${post.slug}`"
                  class="block group"
                >
                  <div class="flex gap-4">
                    <div class="w-20 h-20 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0">
                      <img v-if="post.featuredImage" :src="post.featuredImage" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" :alt="post.title" />
                      <div v-else class="w-full h-full flex items-center justify-center">
                        <Icon name="lucide:image" class="w-8 h-8 text-slate-300" />
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <h4 class="font-bold text-sm text-slate-900 group-hover:text-red-600 transition line-clamp-2 mb-2 leading-tight">
                        {{ post.title }}
                      </h4>
                      <div class="flex items-center gap-2 text-xs text-slate-400">
                        <Icon name="lucide:calendar" class="w-3 h-3" />
                        <span>{{ formatDate(post.createdAt) }}</span>
                      </div>
                    </div>
                  </div>
                </NuxtLink>
              </div>
              
              <div v-else class="text-center py-8 text-slate-400 text-sm">
                No related posts found
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const slug = route.params.slug

const { data: content, pending } = await useAsyncData(`content-${slug}`, async () => {
  // Try post first
  try {
    const post = await $fetch(`/api/public/posts/${slug}`, { query: route.query })
    if (post) return { ...post, _type: 'post' }
  } catch (e) { /* ignore and try page */ }

  // Try page
  try {
    const page = await $fetch(`/api/public/pages/${slug}`, { query: route.query })
    if (page) return { ...page, _type: 'page' }
  } catch (e) { /* ignore */ }

  return null
})

// Fetch random posts for sidebar (only for post pages)
const { data: randomPosts } = await useAsyncData(`random-posts-${slug}`, async () => {
  if (content.value?._type !== 'post') return []
  
  try {
    const posts = await $fetch('/api/public/posts', {
      query: { 
        limit: 4,
        excludeSlug: slug 
      }
    })
    
    // Randomize the posts
    return posts.sort(() => Math.random() - 0.5).slice(0, 4)
  } catch (e) {
    return []
  }
})

if (!pending.value && !content.value) {
  throw createError({ statusCode: 404, statusMessage: 'Content not found', fatal: true })
}

// SEO & Meta Tags
useSeoMeta({
  title: () => content.value?.metaTitle || content.value?.title || 'Loading...',
  description: () => content.value?.metaDescription || content.value?.excerpt || '',
  // Open Graph
  ogTitle: () => content.value?.metaTitle || content.value?.title || '',
  ogDescription: () => content.value?.metaDescription || content.value?.excerpt || '',
  ogImage: () => content.value?.featuredImage || '',
  ogType: () => content.value?._type === 'post' ? 'article' : 'website',
  // Twitter
  twitterTitle: () => content.value?.metaTitle || content.value?.title || '',
  twitterDescription: () => content.value?.metaDescription || content.value?.excerpt || '',
  twitterImage: () => content.value?.featuredImage || '',
  twitterCard: 'summary_large_image',
})

useHead({
  link: [
    { 
      rel: 'canonical', 
      href: () => `https://talitali.co.id/${content.value?.slug || ''}` 
    }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: () => {
        if (!content.value) return ''
        return JSON.stringify({
          '@context': 'https://schema.org',
          '@type': content.value._type === 'post' ? 'NewsArticle' : 'WebPage',
          headline: content.value.metaTitle || content.value.title,
          image: content.value.featuredImage ? [content.value.featuredImage] : [],
          datePublished: content.value.createdAt,
          dateModified: content.value.updatedAt,
          author: content.value._type === 'post' ? [{
              '@type': 'Person',
              name: content.value.author?.name || 'Admin',
              url: `https://talitali.co.id/author/${content.value.author?.name || 'admin'}`
          }] : undefined
        })
      }
    }
  ]
})

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>
