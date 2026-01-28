<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900">SEO & Site Settings</h1>
      <p class="text-slate-500">Configure global metadata and site identity.</p>
    </div>

    <div v-if="pending" class="space-y-6">
      <div v-for="i in 3" :key="i" class="h-48 bg-white rounded-3xl animate-pulse"></div>
    </div>

    <form v-else @submit.prevent="saveSettings" class="space-y-8 pb-20">
      <!-- General Settings -->
      <div class="admin-card">
        <h3 class="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Icon name="ph:identification-card-bold" class="text-brand-600" />
          Site Identity
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Site Title</label>
            <input v-model="form.site_title" type="text" class="input-field" placeholder="My Awesome CMS" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Tagline</label>
            <input v-model="form.site_tagline" type="text" class="input-field" placeholder="Thoughts and ideas" />
          </div>
        </div>
      </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Site Logo</label>
            <div class="flex flex-col gap-4">
              <div v-if="form.site_logo" class="w-full aspect-video bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center p-4">
                <img :src="form.site_logo" class="max-w-full max-h-full object-contain" />
              </div>
              <div class="flex gap-2">
                <input v-model="form.site_logo" type="text" class="input-field" placeholder="URL to logo" />
                <button type="button" @click="openPicker('site_logo')" class="btn-primary whitespace-nowrap px-6">Select</button>
              </div>
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Favicon</label>
            <div class="flex flex-col gap-4">
              <div v-if="form.site_favicon" class="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center p-2">
                <img :src="form.site_favicon" class="w-full h-full object-contain" />
              </div>
              <div class="flex gap-2">
                <input v-model="form.site_favicon" type="text" class="input-field" placeholder="URL to favicon" />
                <button type="button" @click="openPicker('site_favicon')" class="btn-primary whitespace-nowrap px-6">Select</button>
              </div>
            </div>
          </div>
        </div>

      <!-- SEO Settings -->
      <div class="admin-card">
        <h3 class="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Icon name="ph:google-logo-bold" class="text-brand-600" />
          Search & Social (SEO)
        </h3>
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Default Meta Description</label>
            <textarea v-model="form.seo_description" class="input-field h-24" placeholder="Brief summary of your site..."></textarea>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Default Social Share Image (URL)</label>
            <div class="flex gap-4">
              <input v-model="form.seo_image" type="text" class="input-field" placeholder="/uploads/default-og.jpg" />
              <button type="button" @click="openPicker('seo_image')" class="btn-primary whitespace-nowrap px-6">Select</button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end p-6 bg-white border border-slate-100 rounded-3xl sticky bottom-8 shadow-2xl shadow-slate-200">
        <button 
          type="submit" 
          :disabled="loading"
          class="btn-primary px-12 py-3 flex items-center gap-2"
        >
          <span v-if="loading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          {{ loading ? 'Saving...' : 'Save All Settings' }}
        </button>
      </div>
    </form>

    <MediaPicker v-model="showMediaPicker" @select="handleMediaSelect" />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

useHead({
  title: 'Settings'
})

const { data: session } = useAuth()
if (!['ADMIN', 'SUPER_ADMIN'].includes(session.value?.user?.role)) {
  navigateTo('/admin')
}

const { data: settings, pending } = await useFetch('/api/settings')
const loading = ref(false)
const showMediaPicker = ref(false)
const activePickerField = ref('')

const form = reactive({
  site_title: '',
  site_tagline: '',
  site_logo: '',
  site_favicon: '',
  seo_description: '',
  seo_image: ''
})

watchEffect(() => {
  if (settings.value) {
    form.site_title = settings.value.site_title || ''
    form.site_tagline = settings.value.site_tagline || ''
    form.site_logo = settings.value.site_logo || ''
    form.site_favicon = settings.value.site_favicon || ''
    form.seo_description = settings.value.seo_description || ''
    form.seo_image = settings.value.seo_image || ''
  }
})

const openPicker = (field) => {
  activePickerField.value = field
  showMediaPicker.value = true
}

const handleMediaSelect = (media) => {
  if (activePickerField.value) {
    form[activePickerField.value] = media.url
  }
}

const saveSettings = async () => {
  loading.value = true
  try {
    await $fetch('/api/settings', {
      method: 'POST',
      body: form
    })
    alert('Settings saved successfully')
  } catch (e) {
    alert('Failed to save settings')
  } finally {
    loading.value = false
  }
}
</script>
