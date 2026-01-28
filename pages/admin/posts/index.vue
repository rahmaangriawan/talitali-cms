<template>
  <div class="max-w-7xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Posts</h1>
        <p class="text-slate-500">Manage your blog articles and stories.</p>
      </div>
      <div class="flex items-center gap-3">
        <input 
          type="file" 
          ref="importInput" 
          class="hidden" 
          accept=".json"
          @change="handleImport"
        />
        <button 
          @click="$refs.importInput.click()" 
          class="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 hover:text-brand-600 transition-all flex items-center gap-2"
          :disabled="importing"
        >
          <Icon v-if="importing" name="ph:circle-notch-bold" class="w-5 h-5 animate-spin" />
          <Icon v-else name="ph:download-simple-bold" class="w-5 h-5" />
          {{ importing ? 'Importing...' : 'Import Posts' }}
        </button>
        <NuxtLink to="/admin/posts/new" class="btn-primary flex items-center gap-2">
          <Icon name="ph:plus-bold" class="w-5 h-5" />
          Create New Post
        </NuxtLink>
      </div>
    </div>

    <!-- Filters -->
    <div class="admin-card mb-6 flex flex-wrap items-center gap-4">
      <div class="flex-1 min-w-[200px]">
        <input 
          v-model="search"
          type="text" 
          placeholder="Search posts..." 
          class="input-field"
        />
      </div>
      <select v-model="statusFilter" class="input-field w-auto min-w-[150px]">
        <option value="">All Status</option>
        <option value="DRAFT">Draft</option>
        <option value="PUBLISHED">Published</option>
        <option value="SCHEDULED">Scheduled</option>
      </select>
    </div>

    <!-- Posts Table -->
    <div class="admin-card overflow-hidden !p-0">
      <table class="w-full text-left border-collapse">
        <thead class="bg-slate-50 border-b border-slate-100">
          <tr>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Author</th>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-if="pending" class="animate-pulse">
            <td colspan="5" class="px-6 py-10 text-center text-slate-400">Loading posts...</td>
          </tr>
          <tr v-else-if="filteredPosts.length === 0">
            <td colspan="5" class="px-6 py-10 text-center text-slate-400">No posts found.</td>
          </tr>
          <tr 
            v-for="post in filteredPosts" 
            :key="post.id" 
            class="hover:bg-slate-50 transition-colors cursor-pointer"
            @click="navigateTo(`/admin/posts/${post.id}/edit`)"
          >
            <td class="px-6 py-4">
              <div class="font-bold text-slate-900">{{ post.title }}</div>
              <div class="text-xs text-slate-400">{{ post.slug }}</div>
            </td>
            <td class="px-6 py-4">
              <span :class="`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusClass(post.status)}`">
                {{ post.status }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-slate-600">{{ post.author.name }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-slate-600">{{ formatDate(post.createdAt) }}</div>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2">
                <NuxtLink :to="`/admin/posts/${post.id}/edit`" class="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
                  <Icon name="ph:pencil-simple-bold" class="w-5 h-5" />
                </NuxtLink>
                <button @click.stop="confirmDelete(post.id)" class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Icon name="ph:trash-bold" class="w-5 h-5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

useHead({
  title: 'Posts'
})

const { data: posts, pending, refresh } = await useFetch('/api/posts')
const search = ref('')
const statusFilter = ref('')
const importing = ref(false)

const handleImport = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  importing.value = true
  const reader = new FileReader()
  
  reader.onload = async (event) => {
    try {
      const data = JSON.parse(event.target.result)
      const res = await $fetch('/api/posts/import', {
        method: 'POST',
        body: data
      })
      
      alert(`Import complete! Successful: ${res.success}, Failed: ${res.failed}`)
      if (res.errors.length > 0) {
        console.error('Import errors:', res.errors)
      }
      refresh()
    } catch (err) {
      alert('Failed to parse JSON file')
    } finally {
      importing.value = false
      e.target.value = ''
    }
  }
  
  reader.readAsText(file)
}

const filteredPosts = computed(() => {
  if (!posts.value) return []
  return posts.value.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(search.value.toLowerCase())
    const matchesStatus = !statusFilter.value || post.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

const getStatusClass = (status) => {
  switch (status) {
    case 'PUBLISHED': return 'bg-green-100 text-green-600'
    case 'DRAFT': return 'bg-amber-100 text-amber-600'
    case 'SCHEDULED': return 'bg-blue-100 text-blue-600'
    default: return 'bg-slate-100 text-slate-600'
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const confirmDelete = async (id) => {
  if (confirm('Are you sure you want to delete this post?')) {
    await $fetch(`/api/posts/${id}`, { method: 'DELETE' })
    refresh()
  }
}
</script>
