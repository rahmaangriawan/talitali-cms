<template>
  <div class="max-w-7xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Tags</h1>
        <p class="text-slate-500">Add descriptive tags to your posts.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Add Tag Form -->
      <div class="lg:col-span-1">
        <div class="admin-card sticky top-24">
          <h3 class="text-lg font-bold text-slate-900 mb-6">{{ editingId ? 'Edit Tag' : 'Add New Tag' }}</h3>
          <form @submit.prevent="saveTag" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Name</label>
              <input 
                v-model="form.name"
                type="text" 
                class="input-field"
                placeholder="Tag name"
                required
                @input="updateSlug"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Slug</label>
              <input 
                v-model="form.slug"
                type="text" 
                class="input-field"
                placeholder="tag-slug"
              />
            </div>
            <div class="flex gap-2 pt-2">
              <button 
                type="submit" 
                :disabled="loading"
                class="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2"
              >
                <span v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                {{ editingId ? 'Update' : 'Add Tag' }}
              </button>
              <button 
                v-if="editingId"
                type="button"
                @click="resetForm"
                class="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Tags Table -->
      <div class="lg:col-span-2">
        <div class="admin-card !p-0 overflow-hidden">
          <table class="w-full text-left border-collapse">
            <thead class="bg-slate-50 border-b border-slate-100">
              <tr>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Slug</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Posts</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-if="pending" class="animate-pulse">
                <td colspan="4" class="px-6 py-10 text-center text-slate-400">Loading...</td>
              </tr>
              <tr v-else-if="tags.length === 0">
                <td colspan="4" class="px-6 py-10 text-center text-slate-400">No tags found.</td>
              </tr>
              <tr v-for="tag in tags" :key="tag.id" class="hover:bg-slate-50 transition-colors group">
                <td class="px-6 py-4 font-bold text-slate-900">{{ tag.name }}</td>
                <td class="px-6 py-4 text-sm text-slate-500">{{ tag.slug }}</td>
                <td class="px-6 py-4 text-center">
                  <span class="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                    {{ tag._count.posts }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="editTag(tag)" class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      <Icon name="ph:pencil-simple-bold" class="w-5 h-5" />
                    </button>
                    <button @click="confirmDelete(tag.id)" class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Icon name="ph:trash-bold" class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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

const { data: tags, pending, refresh } = await useFetch('/api/tags')
const loading = ref(false)
const editingId = ref(null)

const form = reactive({
  name: '',
  slug: ''
})

const updateSlug = () => {
  if (!editingId.value) {
    form.slug = form.name.toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')
  }
}

const editTag = (tag) => {
  editingId.value = tag.id
  form.name = tag.name
  form.slug = tag.slug
}

const resetForm = () => {
  editingId.value = null
  form.name = ''
  form.slug = ''
}

const saveTag = async () => {
  loading.value = true
  try {
    if (editingId.value) {
      await $fetch(`/api/tags/${editingId.value}`, {
        method: 'PUT',
        body: form
      })
    } else {
      await $fetch('/api/tags', {
        method: 'POST',
        body: form
      })
    }
    resetForm()
    refresh()
  } catch (e) {
    alert('Failed to save tag')
  } finally {
    loading.value = false
  }
}

const confirmDelete = async (id) => {
  if (confirm('Are you sure you want to delete this tag?')) {
    await $fetch(`/api/tags/${id}`, { method: 'DELETE' })
    refresh()
  }
}
</script>
