<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-10">
        <div class="inline-flex w-16 h-16 bg-brand-600 rounded-2xl items-center justify-center text-white text-2xl font-bold shadow-lg mb-4">
          CMS
        </div>
        <h1 class="text-3xl font-extrabold text-slate-900">Welcome Back</h1>
        <p class="text-slate-500 mt-2">Sign in to manage your content</p>
      </div>
      
      <div class="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
            {{ error }}
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
            <input 
              v-model="form.email"
              type="email" 
              required
              class="input-field"
              placeholder="admin@example.com"
            />
          </div>
          
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-sm font-semibold text-slate-700">Password</label>
              <NuxtLink to="/auth/forgot-password" class="text-xs text-brand-600 hover:underline">Forgot password?</NuxtLink>
            </div>
            <input 
              v-model="form.password"
              type="password" 
              required
              class="input-field"
              placeholder="••••••••"
            />
          </div>
          
          <div class="flex items-center">
            <input id="remember" type="checkbox" class="w-4 h-4 text-brand-600 border-slate-300 rounded focus:ring-brand-500" />
            <label for="remember" class="ml-2 block text-sm text-slate-600">Remember me</label>
          </div>
          
          <button 
            type="submit" 
            :disabled="loading"
            class="w-full btn-primary py-3 flex items-center justify-center gap-2"
          >
            <span v-if="loading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
      </div>
      
      <p class="text-center mt-8 text-sm text-slate-500">
        &copy; 2026 Talitali CMS. Built with Nuxt 3.
      </p>
    </div>
  </div>
</template>

<script setup>
const { signIn } = useAuth()
const loading = ref(false)
const error = ref(null)

const form = reactive({
  email: '',
  password: ''
})

const handleLogin = async () => {
  loading.value = true
  error.value = null
  
  try {
    const { error: signInError, url } = await signIn('credentials', {
      ...form,
      redirect: false,
    })
    
    if (signInError) {
      error.value = 'Invalid email or password'
    } else {
      navigateTo('/admin')
    }
  } catch (e) {
    error.value = 'An unexpected error occurred'
  } finally {
    loading.value = false
  }
}
</script>
