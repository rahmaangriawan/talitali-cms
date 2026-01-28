<template>
  <div class="max-w-7xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Media Library</h1>
        <p class="text-slate-500">Manage your images, videos, and documents.</p>
      </div>
    </div>

    <!-- Drag & Drop Area -->
    <div 
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      :class="[
        'mb-10 border-2 border-dashed rounded-[2rem] p-12 transition-all flex flex-col items-center justify-center gap-4 relative group overflow-hidden',
        isDragging 
          ? 'border-brand-500 bg-brand-50/50 scale-[1.01] shadow-2xl shadow-brand-100' 
          : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50/50'
      ]"
    >
      <!-- Background Glow -->
      <div v-if="isDragging" class="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent animate-pulse"></div>

      <div :class="[
        'w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500 shadow-inner',
        isDragging ? 'bg-brand-600 text-white scale-110 rotate-12 shadow-brand-200' : 'bg-brand-50 text-brand-600 group-hover:scale-110 group-hover:-rotate-3'
      ]">
        <Icon :name="uploading ? 'ph:circle-notch-bold' : 'ph:cloud-arrow-up-bold'" :class="['w-10 h-10', uploading ? 'animate-spin' : '']" />
      </div>

      <div class="text-center relative z-10">
        <h3 class="text-xl font-black text-slate-900 tracking-tight">
          {{ uploading ? 'Uploading your files...' : 'Drag & drop files here' }}
        </h3>
        <p class="text-slate-500 mt-1">
          or 
          <button 
            @click="$refs.fileInput.click()" 
            class="text-brand-600 font-bold hover:text-brand-700 hover:underline transition-all"
            :disabled="uploading"
          >
            browse your files
          </button>
        </p>
      </div>

      <div class="flex gap-4 mt-2">
        <div class="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-200">
          <Icon name="ph:image-bold" class="w-3 h-3" /> Images
        </div>
        <div class="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-200">
          <Icon name="ph:video-bold" class="w-3 h-3" /> Video
        </div>
        <div class="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-200">
          <Icon name="ph:file-pdf-bold" class="w-3 h-3" /> PDF
        </div>
      </div>

      <input 
        type="file" 
        ref="fileInput" 
        class="hidden" 
        multiple 
        @change="handleFileInput"
        accept="image/*,video/*,.pdf,.doc,.docx"
      />
    </div>

    <!-- Media Grid -->
    <div v-if="pending && !media" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <div v-for="i in 12" :key="i" class="aspect-square bg-white rounded-xl animate-pulse border border-slate-100"></div>
    </div>
    
    <div v-else-if="media.length === 0" class="admin-card py-20 text-center">
      <Icon name="ph:image-square-bold" class="w-16 h-16 text-slate-200 mx-auto mb-4" />
      <h3 class="text-xl font-bold text-slate-900">No media found</h3>
      <p class="text-slate-500 max-w-xs mx-auto mt-2">Start by uploading some files to your library.</p>
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <div v-for="item in media" :key="item.id" class="group relative aspect-square bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
        <!-- Preview -->
        <div class="w-full h-full flex items-center justify-center p-2 bg-slate-50">
          <img v-if="isImage(item.mimeType)" :src="item.url" class="w-full h-full object-cover rounded-lg" />
          <Icon v-else :name="getFileIcon(item.mimeType)" class="w-12 h-12 text-slate-300" />
        </div>
        
        <!-- Actions Overlay -->
        <div class="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
          <div class="flex gap-2">
             <button @click="openEditModal(item)" class="p-2 bg-white text-slate-700 rounded-lg hover:bg-brand-600 hover:text-white transition-colors shadow-lg" title="Edit Details">
               <Icon name="ph:pencil-simple-bold" class="w-5 h-5" />
             </button>
             <button @click="copyUrl(item.url)" class="p-2 bg-white text-slate-700 rounded-lg hover:bg-brand-600 hover:text-white transition-colors shadow-lg" title="Copy URL">
               <Icon name="ph:link-bold" class="w-5 h-5" />
             </button>
          </div>
          <button @click="confirmDelete(item.id)" class="p-2 bg-white text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors shadow-lg mt-1" title="Delete">
            <Icon name="ph:trash-bold" class="w-5 h-5" />
          </button>
        </div>
        
        <!-- Filename -->
        <div class="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-slate-900/40 text-white text-[10px] truncate pointer-events-none">
          {{ item.filename }}
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showEditModal = false"></div>
      <div class="relative bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
        <div class="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 class="text-lg font-bold text-slate-900">Edit Media Details</h3>
          <button @click="showEditModal = false" class="text-slate-400 hover:text-slate-600">
             <Icon name="ph:x-bold" class="w-5 h-5" />
          </button>
        </div>
        <form @submit.prevent="saveMedia" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Filename</label>
            <input v-model="editForm.filename" type="text" class="input-field" required />
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Alt Text <span class="font-normal text-slate-400">(SEO)</span></label>
            <input v-model="editForm.altText" type="text" class="input-field" placeholder="Describe this image..." />
            <p class="text-xs text-slate-500 mt-1">Used for accessibility and SEO.</p>
          </div>
          
           <div class="bg-slate-50 p-3 rounded-lg flex items-center justify-between">
              <span class="text-xs font-mono text-slate-500 truncate max-w-[200px]">{{ editForm.url }}</span>
              <button type="button" @click="copyUrl(editForm.url)" class="text-xs font-bold text-brand-600 hover:text-brand-700">Copy Link</button>
           </div>

          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showEditModal = false" class="btn-secondary px-4">Cancel</button>
            <button type="submit" :disabled="saving" class="btn-primary px-6 flex items-center gap-2">
              <span v-if="saving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
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
  title: 'Media'
})

const { data: media, pending, refresh } = await useFetch('/api/media')
const uploading = ref(false)
const showEditModal = ref(false)
const saving = ref(false)
const editingId = ref(null)
const isDragging = ref(false)

const editForm = reactive({
  filename: '',
  altText: '',
  url: ''
})

const isImage = (mime) => mime.startsWith('image/')

const getFileIcon = (mime) => {
  if (mime.includes('video')) return 'ph:video-bold'
  if (mime.includes('pdf')) return 'ph:file-pdf-bold'
  return 'ph:file-bold'
}

const handleFileInput = (e) => {
  uploadFiles(e.target.files)
  e.target.value = ''
}

const handleDrop = (e) => {
  isDragging.value = false
  uploadFiles(e.dataTransfer.files)
}

const uploadFiles = async (files) => {
  if (!files.length) return

  uploading.value = true
  const formData = new FormData()
  for (const file of files) {
    formData.append('file', file)
  }

  try {
    await $fetch('/api/media/upload', {
      method: 'POST',
      body: formData
    })
    refresh()
  } catch (err) {
    alert('Upload failed')
  } finally {
    uploading.value = false
  }
}

const copyUrl = (url) => {
  const fullUrl = window.location.origin + url
  navigator.clipboard.writeText(fullUrl)
  alert('Link copied to clipboard')
}

const openEditModal = (item) => {
  editingId.value = item.id
  editForm.filename = item.filename
  editForm.altText = item.altText || ''
  editForm.url = item.url
  showEditModal.value = true
}

const saveMedia = async () => {
  saving.value = true
  try {
     await $fetch(`/api/media/${editingId.value}`, {
       method: 'PUT',
       body: {
         filename: editForm.filename,
         altText: editForm.altText
       }
     })
     refresh()
     showEditModal.value = false
  } catch(e) {
    alert('Failed to update media')
  } finally {
    saving.value = false
  }
}

const confirmDelete = async (id) => {
  if (confirm('Are you sure you want to delete this file permanently?')) {
    await $fetch(`/api/media/${id}`, { method: 'DELETE' })
    refresh()
  }
}
</script>
