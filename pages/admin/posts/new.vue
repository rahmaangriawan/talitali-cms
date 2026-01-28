<template>
  <div class="max-w-full px-6 pb-20">
    <div class="flex items-center gap-4 mb-8">
      <NuxtLink to="/admin/posts" class="p-2 text-slate-400 hover:text-brand-600 hover:bg-white rounded-lg transition-colors">
        <Icon name="ph:arrow-left-bold" class="w-5 h-5" />
      </NuxtLink>
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Create New Post</h1>
        <p class="text-slate-500">Draft your next big story.</p>
      </div>
    </div>

    <form @submit.prevent="savePost" class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Main Editor -->
      <div class="lg:col-span-3 space-y-6">
        <div class="admin-card">
          <div class="mb-6">
            <label class="block text-sm font-bold text-slate-700 mb-2">Post Title</label>
            <input 
              v-model="form.title"
              type="text" 
              class="input-field text-xl font-bold py-3"
              placeholder="Enter title here..."
              required
              @input="updateSlug"
            />
            <div v-if="form.slug" class="mt-2 text-sm text-slate-500 flex items-center gap-2 px-1">
              <Icon name="ph:link-simple-bold" class="w-4 h-4" />
              <span>Permalink:</span>
              <a 
                :href="`/${form.slug}${form.status === 'DRAFT' ? '?preview=true' : ''}`" 
                target="_blank" 
                class="text-red-600 hover:underline flex items-center gap-1 font-medium"
              >
                <span>{{ `/${form.slug}` }}</span>
                <Icon name="ph:arrow-square-out-bold" class="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
          
          <div class="mb-2">
            <label class="block text-sm font-bold text-slate-700 mb-2">Content</label>
            <EditorTinyMCEEditor v-model="form.content" />
          </div>
        </div>

        <!-- Custom Fields -->
        <CustomFieldsEditor v-model="form.customFields" target="POST" />
      </div>

      <!-- Sidebar Controls -->
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
                <option value="SCHEDULED">Scheduled</option>
              </select>
            </div>
            
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">Published Date</label>
              <input v-model="form.publishedAt" type="datetime-local" class="input-field text-sm" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">Slug</label>
              <input v-model="form.slug" type="text" class="input-field text-sm font-mono" />
            </div>
            
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
              <label class="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-tight">Featured Image</label>
              <div @click="showMediaPicker = true" class="w-full aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-brand-600 hover:border-brand-300 transition-all cursor-pointer overflow-hidden group">
                <img v-if="form.featuredImage" :src="form.featuredImage" class="w-full h-full object-cover" />
                <template v-else>
                  <Icon name="ph:upload-simple-bold" class="w-8 h-8 mb-2 group-hover:-translate-y-1 transition-transform" />
                  <span class="text-[10px] font-bold uppercase">Click to upload</span>
                </template>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">Category</label>
              <select v-model="form.categoryId" class="input-field text-sm">
                <option value="">Uncategorized</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">Tags</label>
              <TaxonomyTagSelector v-model="form.tagIds" :available-tags="tags || []" />
            </div>

            <button 
              type="submit" 
              :disabled="loading"
              class="w-full btn-primary py-3 flex items-center justify-center gap-2 shadow-lg shadow-brand-100"
            >
              <span v-if="loading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              {{ loading ? 'Saving...' : 'Save Post' }}
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
    </form>
    
    <MediaPicker 
      v-model="showMediaPicker" 
      @select="handleMediaSelect"
    />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

useHead({
  title: 'New Post'
})

const loading = ref(false)
const showMediaPicker = ref(false)
const activeTab = ref('general')
const { data: categories } = await useFetch('/api/categories')
const { data: tags } = await useFetch('/api/tags')

const form = reactive({
  title: '',
  content: '',
  slug: '',
  status: 'DRAFT',
  publishedAt: new Date().toISOString().slice(0, 16),
  excerpt: '',
  featuredImage: '',
  categoryId: '',
  tagIds: [],
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

const handleMediaSelect = (media) => {
  form.featuredImage = media.url
}


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

const savePost = async () => {
  loading.value = true
  try {
    await $fetch('/api/posts', {
      method: 'POST',
      body: form
    })
    navigateTo('/admin/posts')
  } catch (e) {
    alert('Failed to save post')
  } finally {
    loading.value = false
  }
}
</script>
