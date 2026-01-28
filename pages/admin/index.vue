<template>
  <div class="max-w-7xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900">Dashboard</h1>
      <p class="text-slate-500">Welcome to your CMS overview.</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div v-for="stat in stats" :key="stat.name" class="admin-card">
        <div class="flex items-center gap-4">
          <div :class="`w-12 h-12 rounded-xl flex items-center justify-center text-white ${stat.color}`">
            <Icon :name="stat.icon" class="w-6 h-6" />
          </div>
          <div>
            <p class="text-sm text-slate-500 font-medium">{{ stat.name }}</p>
            <p class="text-2xl font-bold text-slate-900">{{ stat.value }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Recent Posts -->
      <div class="lg:col-span-2 admin-card">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold text-slate-900">Recent Content</h3>
          <NuxtLink to="/admin/posts" class="text-brand-600 text-sm font-medium hover:underline">View all</NuxtLink>
        </div>
        <div class="space-y-4">
          <div v-if="recentPosts.length === 0" class="text-center py-8 text-slate-400">
            No posts found. Start by creating your first post!
          </div>
          <div v-else v-for="post in recentPosts" :key="post.id" class="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                <Icon name="ph:image-square-bold" class="w-6 h-6" />
              </div>
              <div>
                <h4 class="font-medium text-slate-900">{{ post.title }}</h4>
                <p class="text-xs text-slate-500">{{ formatDate(post.createdAt) }} • By {{ post.author.name }}</p>
              </div>
            </div>
            <span :class="`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${post.status === 'PUBLISHED' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`">
              {{ post.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Quick Actions / Activity -->
      <div class="admin-card">
        <h3 class="text-lg font-bold text-slate-900 mb-6">Quick Actions</h3>
        <div class="grid grid-cols-1 gap-3">
          <NuxtLink to="/admin/posts/new" class="flex items-center gap-3 p-3 bg-brand-50 text-brand-700 rounded-lg hover:bg-brand-100 transition-colors">
            <Icon name="ph:plus-bold" class="w-5 h-5" />
            <span class="font-medium">New Post</span>
          </NuxtLink>
          <NuxtLink to="/admin/pages/new" class="flex items-center gap-3 p-3 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors">
            <Icon name="ph:browser-bold" class="w-5 h-5" />
            <span class="font-medium">New Page</span>
          </NuxtLink>
          <NuxtLink to="/admin/media" class="flex items-center gap-3 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
            <Icon name="ph:upload-bold" class="w-5 h-5" />
            <span class="font-medium">Upload Media</span>
          </NuxtLink>
        </div>
        
        <div class="mt-8">
          <h4 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Storage Usage</h4>
          <div class="w-full bg-slate-100 rounded-full h-2 mb-2">
            <div class="bg-brand-600 h-2 rounded-full" style="width: 15%"></div>
          </div>
          <p class="text-xs text-slate-500">1.2 GB of 10 GB (15%)</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

useHead({
  title: 'Dashboard'
})

const stats = [
  { name: 'Total Posts', value: '0', icon: 'ph:article-bold', color: 'bg-brand-500' },
  { name: 'Total Pages', value: '0', icon: 'ph:browser-bold', color: 'bg-emerald-500' },
  { name: 'Categories', value: '0', icon: 'ph:bookmarks-bold', color: 'bg-amber-500' },
  { name: 'Total Users', value: '1', icon: 'ph:users-three-bold', color: 'bg-purple-500' },
]

const recentPosts = [] // Will be fetched from API later

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}
</script>
