<template>
  <form @submit.prevent="savePage" class="max-w-full px-6">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">New Page</h1>
        <p class="text-slate-500">Create a new static page for your site.</p>
      </div>
      <div class="flex gap-3">
        <NuxtLink to="/admin/pages" class="btn-secondary px-6 py-2.5">Cancel</NuxtLink>
        <button type="submit" :disabled="loading" class="btn-primary px-8 py-2.5 flex items-center gap-2">
          <span v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          Create Page
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-20">
      <div class="lg:col-span-3 space-y-8">
        <!-- Content Editor -->
        <div class="admin-card">
          <div class="space-y-6">
            <input v-model="form.title" type="text" class="text-4xl font-black w-full outline-none placeholder:text-slate-200" placeholder="Page Title..." required @input="updateSlug" />
            
            <div v-if="form.slug" class="flex items-center gap-2 text-sm text-slate-400 bg-slate-50 px-4 py-2 rounded-xl w-fit">
              <Icon name="ph:link-bold" />
              <span class="text-slate-500">Permalink:</span>
              <a 
                :href="`/${form.slug}${form.status === 'DRAFT' ? '?preview=true' : ''}`" 
                target="_blank"
                class="text-brand-600 hover:text-brand-700 hover:underline font-mono flex items-center gap-1"
              >
                /{{ form.slug }}
                <Icon name="ph:arrow-square-out-bold" class="w-3.5 h-3.5" />
              </a>
            </div>

            <div class="border-t border-slate-100 pt-6">
              <EditorTinyMCEEditor v-model="form.content" />
            </div>
          </div>
        </div>

        <!-- Custom Fields -->
        <CustomFieldsEditor v-model="form.customFields" target="PAGE" />
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <div class="admin-card !p-0 overflow-hidden">
          <div class="flex border-b border-slate-100">
            <button 
              type="button" 
              @click="activeTab = 'general'"
              :class="[
                'flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all',
                activeTab === 'general' ? 'bg-white text-brand-600 border-b-2 border-brand-600' : 'bg-slate-50 text-slate-400 hover:text-slate-600'
              ]"
            >
              General
            </button>
            <button 
              type="button" 
              @click="activeTab = 'seo'"
              :class="[
                'flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all',
                activeTab === 'seo' ? 'bg-white text-brand-600 border-b-2 border-brand-600' : 'bg-slate-50 text-slate-400 hover:text-slate-600'
              ]"
            >
              SEO <span v-if="seoScore > 0" :class="[
                'ml-1 px-1.5 py-0.5 rounded-md text-[10px]',
                seoScore > 80 ? 'bg-emerald-100 text-emerald-600' : seoScore > 50 ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
              ]">{{ seoScore }}</span>
            </button>
          </div>

          <div v-show="activeTab === 'general'" class="p-6 space-y-6">
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">Status</label>
              <select v-model="form.status" class="input-field">
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">Published Date</label>
              <input v-model="form.publishedAt" type="datetime-local" class="input-field text-sm" />
            </div>

            <div class="border-t border-slate-100 pt-6">
              <label class="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-tight">Featured Image</label>
              <div v-if="form.featuredImage" class="relative group aspect-video bg-slate-100 rounded-2xl overflow-hidden mb-4 border border-slate-100">
                <img :src="form.featuredImage" class="w-full h-full object-cover transition-transform group-hover:scale-105" />
                <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button @click="showMediaPicker = true" type="button" class="p-2 bg-white text-slate-900 rounded-lg shadow-xl hover:bg-slate-50">
                    <Icon name="ph:pencil-simple-bold" class="w-5 h-5" />
                  </button>
                  <button @click="form.featuredImage = ''" type="button" class="p-2 bg-white text-red-600 rounded-lg shadow-xl hover:bg-red-50">
                    <Icon name="ph:trash-bold" class="w-5 h-5" />
                  </button>
                </div>
              </div>
              <button v-else @click="showMediaPicker = true" type="button" class="w-full aspect-video border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-brand-400 hover:text-brand-500 hover:bg-brand-50/30 transition-all gap-2 group">
                <Icon name="ph:image-square-bold" class="w-8 h-8 group-hover:scale-110 transition-transform" />
                <span class="text-[10px] font-bold uppercase tracking-wider">Select Image</span>
              </button>
            </div>
            
            <button type="submit" :disabled="loading" class="w-full btn-primary py-3 flex items-center justify-center gap-2 shadow-lg shadow-brand-100">
              <span v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Create Page
            </button>
          </div>

          <div v-show="activeTab === 'seo'" class="p-6 space-y-6">
            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-xs font-black text-slate-900 uppercase">SEO Score</h4>
                <div :class="[
                  'text-lg font-black',
                  seoScore > 80 ? 'text-emerald-500' : seoScore > 50 ? 'text-amber-500' : 'text-red-500'
                ]">{{ seoScore }}/100</div>
              </div>
              <div class="w-full bg-slate-200 rounded-full h-1.5 mb-4">
                <div 
                  :class="[
                    'h-1.5 rounded-full transition-all duration-500',
                    seoScore > 80 ? 'bg-emerald-500' : seoScore > 50 ? 'bg-amber-500' : 'bg-red-500'
                  ]"
                  :style="{ width: `${seoScore}%` }"
                ></div>
              </div>
              <ul class="space-y-2">
                <li v-for="check in seoChecklist" :key="check.id" class="flex items-start gap-2 text-[11px]">
                  <Icon 
                    :name="check.passed ? 'ph:check-circle-fill' : 'ph:x-circle-fill'" 
                    :class="check.passed ? 'text-emerald-500' : 'text-slate-300'"
                    class="w-3.5 h-3.5 mt-0.5"
                  />
                  <span :class="check.passed ? 'text-slate-600' : 'text-slate-400'">{{ check.label }}</span>
                </li>
              </ul>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">Meta Title</label>
              <input v-model="form.metaTitle" type="text" class="input-field text-sm" placeholder="SEO Title" />
              <div class="mt-1 flex justify-end">
                <span class="text-[10px] text-slate-400 font-mono">{{ form.metaTitle.length }}/60</span>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">Meta Description</label>
              <textarea v-model="form.metaDescription" class="input-field h-24 text-sm resize-none" placeholder="Brief summary for search engine results..."></textarea>
              <div class="mt-1 flex justify-end">
                <span class="text-[10px] text-slate-400 font-mono">{{ form.metaDescription.length }}/160</span>
              </div>
            </div>

            <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span class="block text-xs font-bold text-slate-900">No Index</span>
                <span class="text-[10px] text-slate-400">Hide from search engines</span>
              </div>
              <button 
                type="button"
                @click="form.noIndex = !form.noIndex"
                :class="[
                  'w-10 h-5 rounded-full transition-all relative',
                  form.noIndex ? 'bg-brand-600' : 'bg-slate-200'
                ]"
              >
                <div :class="[
                  'absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-all',
                  form.noIndex ? 'translate-x-5' : ''
                ]"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <MediaPicker v-model="showMediaPicker" @select="(m) => form.featuredImage = m.url" />
  </form>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

useHead({
  title: 'New Page'
})

const loading = ref(false)
const showMediaPicker = ref(false)
const activeTab = ref('general')

const form = reactive({
  title: '',
  slug: '',
  content: '',
  featuredImage: '',
  status: 'DRAFT',
  publishedAt: new Date().toISOString().slice(0, 16),
  customFields: {},
  metaTitle: '',
  metaDescription: '',
  noIndex: false
})

// SEO Calculation Logic
const seoScore = computed(() => {
  let score = 0
  if (form.metaTitle.length >= 30 && form.metaTitle.length <= 60) score += 20
  if (form.metaDescription.length >= 120 && form.metaDescription.length <= 160) score += 20
  if (form.content.split(' ').length > 300) score += 20
  if (form.featuredImage) score += 10
  if (form.title.length > 10) score += 10
  if (form.content.includes('<img')) score += 10
  if (form.content.includes('<a href')) score += 10
  return score
})

const seoChecklist = computed(() => [
  { id: 1, label: 'Title length (30-60 chars)', passed: form.metaTitle.length >= 30 && form.metaTitle.length <= 60 },
  { id: 2, label: 'Description length (120-160 chars)', passed: form.metaDescription.length >= 120 && form.metaDescription.length <= 160 },
  { id: 3, label: 'Content length (> 300 words)', passed: form.content.split(' ').length > 300 },
  { id: 4, label: 'Has featured image', passed: !!form.featuredImage },
  { id: 5, label: 'Content has images', passed: form.content.includes('<img') },
  { id: 6, label: 'Content has links', passed: form.content.includes('<a href') }
])

const updateSlug = () => {
  if (form.title) {
    if (!form.metaTitle) {
      form.metaTitle = form.title
    }
    form.slug = form.title.toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')
  }
}

const savePage = async () => {
  loading.value = true
  try {
    const page = await $fetch('/api/pages', {
      method: 'POST',
      body: form
    })
    navigateTo('/admin/pages')
  } catch (e) {
    alert('Failed to save page')
  } finally {
    loading.value = false
  }
}
</script>
