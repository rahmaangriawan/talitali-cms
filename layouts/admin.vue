<template>
  <div class="min-h-screen flex bg-slate-50">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
      <div class="p-6 border-b border-slate-100">
        <NuxtLink to="/admin" class="flex items-center gap-3">
          <div v-if="settings?.site_logo" class="h-8">
            <img :src="settings.site_logo" class="h-full w-auto object-contain" />
          </div>
          <template v-else>
            <div class="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-slate-200">
              CMS
            </div>
            <h1 class="text-xl font-bold text-slate-900">
              {{ settings?.site_title || 'Talitali' }}
            </h1>
          </template>
        </NuxtLink>
        <NuxtLink to="/" target="_blank" class="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-brand-600 transition-colors uppercase tracking-widest group">
          <Icon name="ph:arrow-square-out-bold" class="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          Visit Live Site
        </NuxtLink>
      </div>
      
      <nav class="flex-1 p-4 space-y-1">
        <NuxtLink to="/admin" class="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-brand-600 rounded-lg transition-colors" active-class="bg-brand-50 !text-brand-600 font-medium">
          <Icon name="ph:house-line-bold" class="w-5 h-5" />
          Dashboard
        </NuxtLink>
        <NuxtLink to="/admin/posts" class="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-brand-600 rounded-lg transition-colors" active-class="bg-brand-50 !text-brand-600 font-medium">
          <Icon name="ph:article-bold" class="w-5 h-5" />
          Posts
        </NuxtLink>
        <NuxtLink to="/admin/pages" class="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-brand-600 rounded-lg transition-colors" active-class="bg-brand-50 !text-brand-600 font-medium">
          <Icon name="ph:browser-bold" class="w-5 h-5" />
          Pages
        </NuxtLink>
        <div class="px-3 py-2">
          <button 
            @click="navToHome"
            class="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-brand-50 hover:text-brand-600 rounded-lg transition-colors border-l-2 border-transparent hover:border-brand-600"
          >
            <Icon name="ph:house-bold" class="w-5 h-5" />
            <span class="text-xs font-black uppercase tracking-widest">Homepage</span>
          </button>
        </div>
        <NuxtLink to="/admin/media" class="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-brand-600 rounded-lg transition-colors" active-class="bg-brand-50 !text-brand-600 font-medium">
          <Icon name="ph:image-bold" class="w-5 h-5" />
          Media
        </NuxtLink>
        <div v-if="isAdmin" class="pt-4 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider px-3">
          Manage
        </div>
        <NuxtLink v-if="isAdmin" to="/admin/categories" class="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-brand-600 rounded-lg transition-colors" active-class="bg-brand-50 !text-brand-600 font-medium">
          <Icon name="ph:bookmarks-bold" class="w-5 h-5" />
          Categories
        </NuxtLink>
        <NuxtLink v-if="isAdmin" to="/admin/users" class="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-brand-600 rounded-lg transition-colors" active-class="bg-brand-50 !text-brand-600 font-medium">
          <Icon name="ph:users-three-bold" class="w-5 h-5" />
          Users
        </NuxtLink>
        <NuxtLink v-if="isAdmin" to="/admin/custom-fields" class="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-brand-600 rounded-lg transition-colors" active-class="bg-brand-50 !text-brand-600 font-medium">
          <Icon name="ph:stack-bold" class="w-5 h-5" />
          Custom Fields
        </NuxtLink>
        <NuxtLink v-if="isAdmin" to="/admin/seo" class="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-brand-600 rounded-lg transition-colors" active-class="bg-brand-50 !text-brand-600 font-medium">
          <Icon name="ph:lightning-bold" class="w-5 h-5" />
          SEO Kilat
        </NuxtLink>
        <NuxtLink to="/admin/analytics" class="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-brand-600 rounded-lg transition-colors" active-class="bg-brand-50 !text-brand-600 font-medium">
          <Icon name="ph:chart-bar-bold" class="w-5 h-5" />
          Analytics
        </NuxtLink>
        <NuxtLink v-if="isAdmin" to="/admin/settings" class="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-brand-600 rounded-lg transition-colors" active-class="bg-brand-50 !text-brand-600 font-medium">
          <Icon name="ph:gear-bold" class="w-5 h-5" />
          Settings
        </NuxtLink>
      </nav>
      
      <div class="p-4 border-t border-slate-100">
        <button @click="logout" class="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors w-full text-left">
          <Icon name="ph:sign-out-bold" class="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col h-screen overflow-hidden">
      <header class="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
        <div class="flex items-center gap-4">
          <button class="lg:hidden text-slate-600">
            <Icon name="ph:list-bold" class="w-6 h-6" />
          </button>
          <h2 class="text-sm font-medium text-slate-500">
            Welcome back, <span class="text-slate-900 font-bold capitalize">{{ session?.user?.name || 'Admin' }}</span>
          </h2>
        </div>
        <div class="flex items-center gap-4">
          <button class="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors relative">
            <Icon name="ph:bell-bold" class="w-5 h-5" />
            <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div class="relative group">
            <button class="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
              <div class="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-xs border border-brand-200">
                A
              </div>
              <Icon name="ph:caret-down-bold" class="w-4 h-4 text-slate-400" />
            </button>

            <!-- Dropdown -->
            <div class="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden hidden group-hover:block animate-fade-in-up">
              <div class="p-1">
                <NuxtLink to="/admin/profile" class="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-600 rounded-lg transition-colors">
                  <Icon name="ph:user-circle-bold" class="w-4 h-4" />
                  Kunjungi Profil
                </NuxtLink>
                <button @click="logout" class="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-left">
                  <Icon name="ph:sign-out-bold" class="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div class="flex-1 overflow-y-auto p-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
const { signOut, data: session } = useAuth()
const { data: settings } = await useAsyncData('settings', () => $fetch('/api/settings'))

useHead({
  titleTemplate: (titleChunk) => {
    const siteTitle = settings.value?.site_title || 'Talitali'
    return titleChunk ? `${titleChunk} - ${siteTitle}` : siteTitle
  },
  link: [
    { 
      key: 'favicon',
      rel: 'icon', 
      href: settings.value?.site_favicon || '/favicon.ico' 
    }
  ]
})

const isAdmin = computed(() => {
  return ['ADMIN', 'SUPER_ADMIN'].includes(session.value?.user?.role)
})

const logout = async () => {
  await signOut()
  navigateTo('/auth/login')
}

const navToHome = async () => {
  try {
    const pages = await $fetch('/api/pages')
    const homePage = pages.find(p => p.slug === 'home')
    if (homePage) {
      navigateTo(`/admin/pages/${homePage.id}/edit`)
    } else {
      // Create default homepage if missing
      const newHome = await $fetch('/api/pages', {
        method: 'POST',
        body: {
          title: 'Homepage',
          slug: 'home',
          content: '<h1>Welcome to our home</h1>',
          status: 'PUBLISHED'
        }
      })
      navigateTo(`/admin/pages/${newHome.id}/edit`)
    }
  } catch (e) {
    console.error('Failed to navigate to homepage editor:', e)
  }
}
</script>
