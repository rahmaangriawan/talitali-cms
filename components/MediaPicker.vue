<template>
  <div v-if="modelValue" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="$emit('update:modelValue', false)"></div>
    
    <!-- Modal Content -->
    <div class="relative bg-white w-full max-w-5xl h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100">
      <div class="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 class="text-xl font-bold text-slate-900">Select Media</h3>
          <p class="text-xs text-slate-500">Choose an existing file or upload a new one.</p>
        </div>
        <button @click="$emit('update:modelValue', false)" class="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
          <Icon name="ph:x-bold" class="w-6 h-6" />
        </button>
      </div>
      
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        <!-- Drag & Drop Area -->
        <div 
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
          :class="[
            'border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center gap-3 relative group',
            isDragging 
              ? 'border-brand-500 bg-brand-50/50 scale-[1.01] shadow-xl shadow-brand-100' 
              : 'border-slate-100 bg-slate-50/30 hover:border-brand-300 hover:bg-slate-50'
          ]"
        >
          <div :class="[
            'w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500',
            isDragging ? 'bg-brand-600 text-white scale-110 rotate-6' : 'bg-brand-50 text-brand-600 group-hover:scale-110'
          ]">
            <Icon :name="uploading ? 'ph:circle-notch-bold' : 'ph:cloud-arrow-up-bold'" :class="['w-6 h-6', uploading ? 'animate-spin' : '']" />
          </div>
          <div class="text-center">
            <p class="text-xs font-black text-slate-900 uppercase tracking-widest">
              {{ uploading ? 'Uploading...' : 'Drop files here' }}
            </p>
            <p v-if="!uploading" class="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">
              or <button @click="$refs.pickerInput.click()" class="text-brand-600 font-bold hover:underline">Select from computer</button>
            </p>
          </div>
        </div>

        <div v-if="pending" class="grid grid-cols-3 md:grid-cols-6 gap-4">
          <div v-for="i in 12" :key="i" class="aspect-square bg-slate-50 animate-pulse rounded-xl"></div>
        </div>
        
        <div v-else class="grid grid-cols-3 md:grid-cols-6 gap-4">
          <div 
            v-for="item in media" 
            :key="item.id" 
            @click="selectItem(item)"
            class="group relative aspect-square bg-slate-50 rounded-xl overflow-hidden cursor-pointer border-2 transition-all"
            :class="selectedId === item.id ? 'border-brand-600 scale-95 shadow-lg shadow-brand-100' : 'border-transparent hover:border-slate-200'"
          >
            <img v-if="item.mimeType.startsWith('image/')" :src="item.url" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center">
              <Icon name="ph:file-bold" class="w-10 h-10 text-slate-300" />
            </div>
            
            <div v-if="selectedId === item.id" class="absolute top-2 right-2 bg-brand-600 text-white rounded-full p-1 shadow-lg">
              <Icon name="ph:check-bold" class="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
      
      <div class="p-6 border-t border-slate-100 flex items-center justify-end bg-slate-50/50">
        <input 
          type="file" 
          ref="pickerInput" 
          class="hidden" 
          @change="handleFileUpload"
          accept="image/*"
        />
        
        <button 
          @click="confirmSelection"
          :disabled="!selectedItem"
          class="btn-primary px-8 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-100"
        >
          Insert Media
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'select'])

const { data: media, pending, refresh } = useFetch('/api/media')
const selectedId = ref(null)
const selectedItem = ref(null)
const isDragging = ref(false)
const uploading = ref(false)

const selectItem = (item) => {
  selectedId.value = item.id
  selectedItem.value = item
}

const confirmSelection = () => {
  if (selectedItem.value) {
    emit('select', selectedItem.value)
    emit('update:modelValue', false)
  }
}

const handleFileUpload = (e) => {
  if (e.target.files.length) {
    uploadFile(e.target.files[0])
    e.target.value = ''
  }
}

const handleDrop = (e) => {
  isDragging.value = false
  if (e.dataTransfer.files.length) {
    uploadFile(e.dataTransfer.files[0])
  }
}

const uploadFile = async (file) => {
  uploading.value = true
  const formData = new FormData()
  formData.append('file', file)

  try {
    const res = await $fetch('/api/media/upload', {
      method: 'POST',
      body: formData
    })
    
    // Refresh and auto-select the new image
    await refresh()
    if (res && res.length > 0) {
      selectItem(res[0])
    } else if (res && res.id) {
       selectItem(res)
    }
  } catch (err) {
    alert('Upload failed')
  } finally {
    uploading.value = false
  }
}
</script>
