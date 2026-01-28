<template>
  <div class="max-w-6xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Custom Fields</h1>
        <p class="text-slate-500">Define additional data fields for your content.</p>
      </div>
      <button @click="openModal()" class="btn-primary px-6 py-2.5 flex items-center gap-2">
        <Icon name="ph:plus-bold" class="w-5 h-5" />
        Create Field
      </button>
    </div>

    <div class="admin-card overflow-hidden">
      <div v-if="pending" class="p-8 space-y-4">
        <div v-for="i in 5" :key="i" class="h-12 bg-slate-50 animate-pulse rounded-lg"></div>
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Field Name</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Slug</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Type</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Target</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="field in fields" :key="field.id" class="hover:bg-slate-50/50 transition-colors group">
              <td class="px-6 py-4">
                <span class="text-sm font-bold text-slate-900">{{ field.name }}</span>
              </td>
              <td class="px-6 py-4">
                <code class="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">{{ field.slug }}</code>
              </td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 bg-brand-50 text-brand-600 text-[10px] font-black rounded uppercase tracking-tighter">
                  {{ field.type }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="text-xs font-medium text-slate-500">{{ field.target }}</span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="openModal(field)" class="p-2 text-slate-400 hover:text-brand-600 hover:bg-white rounded-lg transition-all shadow-sm">
                    <Icon name="ph:pencil-simple-bold" class="w-4 h-4" />
                  </button>
                  <button @click="deleteField(field.id)" class="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-all shadow-sm">
                    <Icon name="ph:trash-bold" class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="fields.length === 0">
              <td colspan="5" class="px-6 py-20 text-center">
                <Icon name="ph:stack-bold" class="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p class="text-slate-400 font-medium">No custom fields defined yet.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Field Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm shadow-inner" @click="showModal = false"></div>
      <div class="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-modalin">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 class="text-xl font-bold text-slate-900">{{ editingId ? 'Edit' : 'Create' }} Custom Field</h3>
          <button @click="showModal = false" class="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
            <Icon name="ph:x-bold" class="w-6 h-6" />
          </button>
        </div>
        
        <form @submit.prevent="saveField" class="p-8 space-y-6">
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Field Name</label>
            <input v-model="form.name" type="text" class="input-field" placeholder="e.g., Subtitle, Price" required />
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Field Slug</label>
            <input v-model="form.slug" type="text" class="input-field" placeholder="e.g., subtitle, item_price" required />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Field Type</label>
              <select v-model="form.type" class="input-field">
                <option value="TEXT">Short Text</option>
                <option value="TEXTAREA">Long Text</option>
                <option value="NUMBER">Number</option>
                <option value="DATE">Date</option>
                <option value="SELECT">Dropdown Select</option>
                <option value="IMAGE">Image Picker</option>
                <option value="BOOLEAN">Toggle (Switch)</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Target</label>
              <select v-model="form.target" class="input-field">
                <option value="POST">Blog Posts</option>
                <option value="PAGE">Static Pages</option>
              </select>
            </div>
          </div>
          
          <div class="flex justify-end gap-3 pt-6">
            <button type="button" @click="showModal = false" class="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">Cancel</button>
            <button type="submit" :disabled="loading" class="btn-primary px-8 py-2.5 flex items-center gap-2">
              <span v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              {{ editingId ? 'Update Field' : 'Create Field' }}
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
  title: 'Custom Fields'
})

const { data: session } = useAuth()
if (!['ADMIN', 'SUPER_ADMIN'].includes(session.value?.user?.role)) {
  navigateTo('/admin')
}

const { data: fields, pending, refresh } = await useFetch('/api/custom-fields')
const showModal = ref(false)
const editingId = ref(null)
const loading = ref(false)

const form = reactive({
  name: '',
  slug: '',
  type: 'TEXT',
  target: 'POST',
  options: []
})

const openModal = (field = null) => {
  if (field) {
    editingId.value = field.id
    form.name = field.name
    form.slug = field.slug
    form.type = field.type
    form.target = field.target
  } else {
    editingId.value = null
    form.name = ''
    form.slug = ''
    form.type = 'TEXT'
    form.target = 'POST'
  }
  showModal.value = true
}

const saveField = async () => {
  loading.value = true
  try {
    const url = editingId.value ? `/api/custom-fields/${editingId.value}` : '/api/custom-fields'
    const method = editingId.value ? 'PUT' : 'POST'
    
    await $fetch(url, {
      method,
      body: form
    })
    
    showModal.value = false
    refresh()
  } catch (e) {
    alert('Failed to save field')
  } finally {
    loading.value = false
  }
}

const deleteField = async (id) => {
  if (!confirm('Are you sure you want to delete this field? All data associated with it will be lost.')) return
  
  try {
    await $fetch(`/api/custom-fields/${id}`, { method: 'DELETE' })
    refresh()
  } catch (e) {
    alert('Failed to delete field')
  }
}
</script>
