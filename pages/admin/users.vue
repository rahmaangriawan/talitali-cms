<template>
  <div class="px-6 pb-20">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Users</h1>
        <p class="text-slate-500">Manage system access and roles.</p>
      </div>
      <button @click="openCreateModal" class="btn-primary px-6 py-2.5 flex items-center gap-2">
        <Icon name="ph:plus-bold" />
        Add User
      </button>
    </div>

    <!-- User List -->
    <div class="admin-card !p-0 overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-slate-50 border-b border-slate-100">
          <tr>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Joined</th>
            <th class="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="user in users" :key="user.id" class="group hover:bg-slate-50/50 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-lg">
                  {{ user.name.charAt(0) }}
                </div>
                <div>
                  <div class="font-bold text-slate-900">{{ user.name }}</div>
                  <div class="text-xs text-slate-400">{{ user.email }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <span :class="[
                'px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide',
                user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-600' : 
                user.role === 'EDITOR' ? 'bg-blue-100 text-blue-600' : 
                'bg-slate-100 text-slate-500'
              ]">
                {{ user.role.replace('_', ' ') }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-slate-500">
              {{ new Date(user.createdAt).toLocaleDateString() }}
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="editUser(user)" class="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
                  <Icon name="ph:pencil-simple-bold" class="w-4 h-4" />
                </button>
                <button @click="deleteUser(user.id)" class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Icon name="ph:trash-bold" class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" @click="closeModal"></div>
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 p-6 animate-fade-in-up">
        <h3 class="text-xl font-bold text-slate-900 mb-6">{{ isEditing ? 'Edit User' : 'Add New User' }}</h3>
        
        <form @submit.prevent="saveUser" class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Name</label>
            <input v-model="form.name" type="text" class="input-field" required />
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Email</label>
            <input v-model="form.email" type="email" class="input-field" required />
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Role</label>
            <select v-model="form.role" class="input-field">
              <option value="AUTHOR">Author</option>
              <option value="EDITOR">Editor</option>
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Password {{ isEditing ? '(Leave blank to keep current)' : '' }}</label>
            <input v-model="form.password" type="password" class="input-field" :required="!isEditing" />
          </div>

          <div class="flex justify-end gap-3 mt-8">
            <button type="button" @click="closeModal" class="btn-secondary px-6">Cancel</button>
            <button type="submit" :disabled="saving" class="btn-primary px-6 flex items-center gap-2">
              <span v-if="saving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              {{ isEditing ? 'Update User' : 'Create User' }}
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
  title: 'Users'
})

const { data: session } = useAuth()
if (!['ADMIN', 'SUPER_ADMIN'].includes(session.value?.user?.role)) {
  navigateTo('/admin')
}

const { data: users, refresh } = await useFetch('/api/users')
const showModal = ref(false)
const saving = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const form = reactive({
  name: '',
  email: '',
  role: 'AUTHOR',
  password: ''
})

const openCreateModal = () => {
  isEditing.value = false
  editingId.value = null
  form.name = ''
  form.email = ''
  form.role = 'AUTHOR'
  form.password = ''
  showModal.value = true
}

const editUser = (user) => {
  isEditing.value = true
  editingId.value = user.id
  form.name = user.name
  form.email = user.email
  form.role = user.role
  form.password = ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveUser = async () => {
  saving.value = true
  try {
    const url = isEditing.value ? `/api/users/${editingId.value}` : '/api/users'
    const method = isEditing.value ? 'PUT' : 'POST'
    
    await $fetch(url, {
      method,
      body: form
    })
    
    await refresh()
    closeModal()
  } catch (e) {
    alert(e.data?.statusMessage || 'Failed to save user')
  } finally {
    saving.value = false
  }
}

const deleteUser = async (id) => {
  if (!confirm('Are you sure you want to delete this user?')) return
  
  try {
    await $fetch(`/api/users/${id}`, { method: 'DELETE' })
    await refresh()
  } catch (e) {
    alert(e.data?.statusMessage || 'Failed to delete user')
  }
}
</script>
