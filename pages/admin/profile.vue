<template>
  <div class="max-w-xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900">Your Profile</h1>
      <p class="text-slate-500">Manage your account settings.</p>
    </div>

    <div v-if="pending" class="h-64 bg-slate-50 animate-pulse rounded-xl"></div>

    <div v-else class="admin-card">
      <form @submit.prevent="saveProfile" class="space-y-6">
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
          <input v-model="form.name" type="text" class="input-field" required />
        </div>
        
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
          <input v-model="form.email" type="email" class="input-field" required />
        </div>

        <div class="pt-4 border-t border-slate-100 mt-4">
          <h4 class="text-sm font-bold text-slate-900 mb-4">Change Password</h4>
          <label class="block text-sm font-semibold text-slate-500 mb-2">New Password (leave blank to keep current)</label>
          <input v-model="form.password" type="password" class="input-field" />
        </div>

        <div class="flex items-center justify-between pt-6">
          <div class="text-xs text-slate-400 font-mono">
            Role: <span class="bg-slate-100 px-2 py-1 rounded text-slate-600 font-bold uppercase">{{ user?.role?.replace('_', ' ') }}</span>
          </div>
          <button 
            type="submit" 
            :disabled="saving"
            class="btn-primary px-8 py-2.5 flex items-center gap-2"
          >
            <span v-if="saving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            {{ saving ? 'Saving...' : 'Update Profile' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const { data: user, pending, refresh } = await useFetch('/api/profile')
const saving = ref(false)

const form = reactive({
  name: '',
  email: '',
  password: ''
})

watchEffect(() => {
  if (user.value) {
    form.name = user.value.name
    form.email = user.value.email
  }
})

const saveProfile = async () => {
  saving.value = true
  try {
    await $fetch('/api/profile', {
      method: 'PUT',
      body: form
    })
    
    await refresh() // Refresh data
    form.password = '' // Clear password field
    alert('Profile updated successfully')
  } catch (e) {
    alert(e.data?.statusMessage || 'Failed to update profile')
  } finally {
    saving.value = false
  }
}
</script>
