<template>
  <div class="max-w-6xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Static Pages</h1>
        <p class="text-slate-500">Manage individual pages like About, Contact, or Services.</p>
      </div>
      <NuxtLink to="/admin/pages/new" class="btn-primary px-6 py-2.5 flex items-center gap-2">
        <Icon name="ph:plus-bold" class="w-5 h-5" />
        New Page
      </NuxtLink>
    </div>

    <!-- Homepage Quick Access -->
    <div class="mb-10">
      <div 
        @click="goToHomepage"
        class="bg-white rounded-[2rem] border border-slate-100 p-6 flex items-center justify-between cursor-pointer hover:shadow-xl hover:shadow-brand-100 transition-all border-l-4 border-l-brand-600 group"
      >
        <div class="flex items-center gap-6">
          <div class="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center">
            <Icon name="ph:house-line-bold" class="w-8 h-8" />
          </div>
          <div>
            <h3 class="text-lg font-black text-slate-900">Homepage Configuration</h3>
            <p class="text-slate-500 text-sm">Manage hero sections, features, and layout of your main landing page.</p>
          </div>
        </div>
        <div class="flex items-center gap-2 text-brand-600 font-bold text-sm">
          <span>Configure Now</span>
          <Icon name="ph:arrow-right-bold" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>

    <div class="admin-card overflow-hidden">
      <div v-if="pending" class="p-8 space-y-4">
        <div v-for="i in 5" :key="i" class="h-12 bg-slate-50 animate-pulse rounded-lg"></div>
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Page Title</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Slug</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Updated</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr 
              v-for="page in pages" 
              :key="page.id" 
              class="hover:bg-slate-50/50 transition-colors group cursor-pointer"
              @click="navigateTo('/admin/pages/' + page.id + '/edit')"
            >
              <td class="px-6 py-4">
                <span class="text-sm font-bold text-slate-900">{{ page.title }}</span>
              </td>
              <td class="px-6 py-4">
                <code class="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">/{{ page.slug }}</code>
              </td>
              <td class="px-6 py-4">
                <span 
                  class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                  :class="page.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'"
                >
                  {{ page.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-xs text-slate-500 font-medium">
                {{ new Date(page.updatedAt).toLocaleDateString() }}
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <NuxtLink :to="'/admin/pages/' + page.id + '/edit'" class="p-2 text-slate-400 hover:text-brand-600 hover:bg-white rounded-lg transition-all shadow-sm">
                    <Icon name="ph:pencil-simple-bold" class="w-4 h-4" />
                  </NuxtLink>
                  <button @click.stop="deletePage(page.id)" class="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-all shadow-sm">
                    <Icon name="ph:trash-bold" class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="pages.length === 0">
              <td colspan="5" class="px-6 py-20 text-center">
                <Icon name="ph:browser-bold" class="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p class="text-slate-400 font-medium">No pages created yet.</p>
              </td>
            </tr>
          </tbody>
        </table>
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
  title: 'Pages'
})

const { data: pages, pending, refresh } = await useFetch('/api/pages')

const goToHomepage = async () => {
  const homePage = pages.value.find(p => p.slug === 'home')
  if (homePage) {
    navigateTo(`/admin/pages/${homePage.id}/edit`)
  } else {
    // If not exists, offer to create it or just go to new page with "home" slug
    if (confirm('Homepage (slug: home) not found. Create it now?')) {
      const newHome = await $fetch('/api/pages', {
        method: 'POST',
        body: {
          title: 'Homepage',
          slug: 'home',
          content: '<h1>Welcome to our home</h1>',
          status: 'PUBLISHED'
        }
      })
      navigateTo(`/admin/pages/${newHome.id}/edit`)
    }
  }
}

const deletePage = async (id) => {
  if (!confirm('Are you sure you want to delete this page?')) return
  await $fetch(`/api/pages/${id}`, { method: 'DELETE' })
  refresh()
}
</script>
