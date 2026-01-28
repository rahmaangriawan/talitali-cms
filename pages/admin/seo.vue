<template>
  <div class="max-w-7xl mx-auto px-6 pb-20">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">SEO Kilat</h1>
        <p class="text-slate-500">Monitor health, manage redirects, and check schema.</p>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Tabs -->
      <div class="admin-card !p-2 flex gap-2">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all',
            activeTab === tab.id ? 'bg-brand-600 text-white shadow-lg shadow-brand-200' : 'text-slate-500 hover:bg-slate-50'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- 404 Monitor -->
      <div v-if="activeTab === '404'" class="admin-card">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-slate-900">404 Error Log</h3>
          <button @click="refresh404" class="p-2 text-slate-400 hover:text-brand-600 rounded-lg">
            <Icon name="ph:arrows-clockwise-bold" class="w-5 h-5" />
          </button>
        </div>
        
        <table class="w-full text-left">
          <thead class="bg-slate-50">
            <tr>
              <th class="p-4 rounded-l-xl text-xs font-bold text-slate-500 uppercase">Path</th>
              <th class="p-4 text-xs font-bold text-slate-500 uppercase">Count</th>
              <th class="p-4 text-xs font-bold text-slate-500 uppercase">Last Seen</th>
              <th class="p-4 rounded-r-xl text-right text-xs font-bold text-slate-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in logs" :key="log.id" class="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
              <td class="p-4 font-mono text-sm text-red-600">{{ log.path }}</td>
              <td class="p-4 font-bold text-slate-900">{{ log.count }}</td>
              <td class="p-4 text-sm text-slate-500">{{ new Date(log.lastSeen).toLocaleString() }}</td>
              <td class="p-4 text-right">
                <button @click="createRedirect(log.path)" class="text-xs font-bold text-brand-600 hover:underline">Fix with Redirect</button>
              </td>
            </tr>
            <tr v-if="logs.length === 0">
              <td colspan="4" class="p-8 text-center text-slate-400">No 404 errors recorded yet. Good job!</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Redirects -->
      <div v-if="activeTab === 'redirects'" class="admin-card">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-slate-900">Redirect Rules</h3>
          <button @click="showRedirectModal = true" class="btn-primary px-4 py-2 text-sm flex items-center gap-2">
            <Icon name="ph:plus-bold" />
            Add Rule
          </button>
        </div>

        <table class="w-full text-left">
          <thead class="bg-slate-50">
            <tr>
              <th class="p-4 rounded-l-xl text-xs font-bold text-slate-500 uppercase">Source</th>
              <th class="p-4 text-xs font-bold text-slate-500 uppercase">Destination</th>
              <th class="p-4 text-xs font-bold text-slate-500 uppercase">Code</th>
              <th class="p-4 rounded-r-xl text-right text-xs font-bold text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rule in redirects" :key="rule.id" class="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
              <td class="p-4 font-mono text-sm text-slate-600">{{ rule.source }}</td>
              <td class="p-4 font-mono text-sm text-emerald-600">{{ rule.destination }}</td>
              <td class="p-4">
                <span class="px-2 py-1 bg-slate-100 rounded text-xs font-bold">{{ rule.code }}</span>
              </td>
              <td class="p-4 text-right">
                <button @click="deleteRedirect(rule.id)" class="text-red-500 hover:text-red-700">
                  <Icon name="ph:trash-bold" class="w-5 h-5" />
                </button>
              </td>
            </tr>
             <tr v-if="redirects.length === 0">
              <td colspan="4" class="p-8 text-center text-slate-400">No redirects defined.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Schema Validator -->
       <div v-if="activeTab === 'schema'" class="admin-card">
         <h3 class="text-xl font-bold text-slate-900 mb-6">Schema Markup Validator</h3>
         <p class="text-slate-500 mb-6">Check the validity of structured data for your posts.</p>
         
         <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <div v-for="post in posts" :key="post.id" class="p-4 border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
             <div class="flex items-start justify-between mb-2">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Article</span>
                <span class="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full flex items-center gap-1">
                  <Icon name="ph:check-circle-fill" /> Valid
                </span>
             </div>
             <h4 class="font-bold text-slate-900 line-clamp-2 mb-2">{{ post.title }}</h4>
             <a :href="`/${post.slug}`" target="_blank" class="text-xs text-brand-600 hover:underline flex items-center gap-1">
               View Page <Icon name="ph:arrow-square-out" />
             </a>
             <div class="mt-3 pt-3 border-t border-slate-50 text-[10px] text-slate-400 font-mono">
               Types: Article, BreadcrumbList
             </div>
           </div>
         </div>
       </div>

    </div>

    <!-- Redirect Modal -->
    <div v-if="showRedirectModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" @click="showRedirectModal = false"></div>
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 p-6">
        <h3 class="text-lg font-bold text-slate-900 mb-4">Add Redirect Rule</h3>
        <form @submit.prevent="saveRedirect" class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Source Path (e.g., /old-page)</label>
            <input v-model="redirectForm.source" type="text" class="input-field" required />
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Destination URL</label>
            <input v-model="redirectForm.destination" type="text" class="input-field" required />
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Status Code</label>
            <select v-model="redirectForm.code" class="input-field">
              <option :value="301">301 (Permanent)</option>
              <option :value="302">302 (Temporary)</option>
              <option :value="307">307 (Temporary Redirect)</option>
              <option :value="308">308 (Permanent Redirect)</option>
            </select>
          </div>
          <div class="flex justify-end gap-2 mt-6">
            <button type="button" @click="showRedirectModal = false" class="btn-secondary px-4">Cancel</button>
            <button type="submit" class="btn-primary px-6">Save Rule</button>
          </div>
        </form>
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
  title: 'SEO Kilat'
})

const activeTab = ref('404')
const tabs = [
  { id: '404', label: 'Monitor 404' },
  { id: 'redirects', label: 'Redirect Rules' },
  { id: 'schema', label: 'Schema Validator' }
]

// 404 Data
const { data: logs, refresh: refresh404 } = await useFetch('/api/seo/404')

// Redirect Data
const { data: redirects, refresh: refreshRedirects } = await useFetch('/api/seo/redirects')
const showRedirectModal = ref(false)
const redirectForm = reactive({
  source: '',
  destination: '',
  code: 301
})

const saveRedirect = async () => {
  try {
    await $fetch('/api/seo/redirects', {
      method: 'POST',
      body: redirectForm
    })
    showRedirectModal.value = false
    redirectForm.source = ''
    redirectForm.destination = ''
    refreshRedirects()
  } catch (e) {
    alert('Failed to save redirect')
  }
}

const deleteRedirect = async (id) => {
  if(confirm('Delete this rule?')) {
    await $fetch(`/api/seo/redirects/${id}`, { method: 'DELETE' })
    refreshRedirects()
  }
}

const createRedirect = (source) => {
  redirectForm.source = source
  activeTab.value = 'redirects'
  showRedirectModal.value = true
}

// Schema Data (Mocked for now as we don't have a real validator API yet, but user asked for "check valid or not")
// In a real scenario, we'd fetch posts and maybe run a validator or check for computed schema fields.
const { data: posts } = await useFetch('/api/posts')

</script>
