<template>
  <div class="font-sans text-slate-800 bg-white min-h-screen flex flex-col selection:bg-red-100 selection:text-red-700">
    <!-- Navigation -->
    <nav class="fixed w-full z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <NuxtLink to="/" class="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <template v-if="settings?.site_logo">
              <img :src="settings.site_logo" class="h-10 w-auto" alt="Logo" />
            </template>
            <template v-else>
              <div class="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-red-100">T</div>
            </template>
          </NuxtLink>
          
          <!-- Desktop Menu -->
          <div class="hidden md:flex space-x-10 items-center">
            <template v-if="isHomePage">
              <a href="#about" class="text-slate-600 hover:text-red-600 font-bold text-sm uppercase tracking-wider transition">Tentang</a>
              <a href="#features" class="text-slate-600 hover:text-red-600 font-bold text-sm uppercase tracking-wider transition">Keunggulan</a>
              <a href="#pricing" class="text-slate-600 hover:text-red-600 font-bold text-sm uppercase tracking-wider transition">Harga</a>
              <a href="#testimonials" class="text-slate-600 hover:text-red-600 font-bold text-sm uppercase tracking-wider transition">Testimoni</a>
            </template>
            <template v-else>
              <NuxtLink to="/" class="text-slate-600 hover:text-red-600 font-bold text-sm uppercase tracking-wider transition">Home</NuxtLink>
              <NuxtLink to="/blog" class="text-slate-600 hover:text-red-600 font-bold text-sm uppercase tracking-wider transition">Blog</NuxtLink>
            </template>
            <a :href="`https://wa.me/${cleanPhone(settings?.site_phone || '6281317772022')}`" class="bg-red-600 hover:bg-slate-900 text-white px-7 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-red-100 hover:shadow-slate-200 flex items-center gap-2 transform hover:-translate-y-0.5 active:scale-95">
              <Icon name="lucide:phone" class="w-4 h-4" />
              Hubungi Kami
            </a>
          </div>

          <!-- Mobile Menu Button -->
          <div class="md:hidden flex items-center">
            <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-slate-600 p-2 hover:bg-slate-50 rounded-lg transition-colors">
              <Icon v-if="!mobileMenuOpen" name="lucide:menu" class="w-7 h-7" />
              <Icon v-else name="lucide:x" class="w-7 h-7" />
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Dropdown -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t border-slate-100 p-6 shadow-2xl absolute w-full top-full left-0">
          <div class="flex flex-col space-y-5 text-center">
            <template v-if="isHomePage">
              <a v-for="link in navLinks" :key="link.href" :href="link.href" @click="mobileMenuOpen = false" class="text-slate-900 font-black text-lg uppercase tracking-wider hover:text-red-600">
                {{ link.label }}
              </a>
            </template>
            <template v-else>
              <NuxtLink to="/" @click="mobileMenuOpen = false" class="text-slate-900 font-black text-lg uppercase tracking-wider hover:text-red-600">Home</NuxtLink>
              <NuxtLink to="/blog" @click="mobileMenuOpen = false" class="text-slate-900 font-black text-lg uppercase tracking-wider hover:text-red-600">Blog</NuxtLink>
            </template>
            <a :href="`https://wa.me/${cleanPhone(settings?.site_phone || '6281317772022')}`" class="bg-red-600 text-white px-6 py-4 rounded-2xl font-black text-center uppercase tracking-widest shadow-xl shadow-red-100">
              Hubungi Kami
            </a>
          </div>
        </div>
      </Transition>
    </nav>

    <main class="flex-grow pt-20">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-slate-50 text-slate-900 pt-24 pb-12 border-t border-slate-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 gap-16 mb-20">
          <div class="col-span-1 md:col-span-2">
            <NuxtLink to="/" class="flex items-center mb-8">
              <template v-if="settings?.site_logo">
                <img :src="settings.site_logo" class="h-12 w-auto" alt="Logo" />
              </template>
              <template v-else>
                <div class="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-red-600/20 group-hover:rotate-12 transition text-white">T</div>
              </template>
            </NuxtLink>
            <p class="text-slate-500 max-w-sm mb-10 leading-relaxed text-lg font-medium">
              Jasa pembuatan tali lanyard custom dan percetakan tali lanyard yang fokus pada kebutuhan lanyard satuan hingga partai besar dengan kualitas terbaik di Indonesia.
            </p>
            <div class="flex gap-4">
              <a v-for="soc in socials" :key="soc.label" :href="soc.url" class="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center hover:bg-red-600 active:scale-95 transition-all duration-300 group">
                <Icon :name="soc.icon" class="w-6 h-6 text-slate-400 group-hover:text-white group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 class="font-black text-sm uppercase tracking-[0.2em] mb-10 text-red-600">Layanan</h4>
            <ul class="space-y-5 text-slate-600 font-bold uppercase text-[11px] tracking-widest">
              <li v-for="s in services" :key="s"><a href="#" class="hover:text-red-600 transition-colors flex items-center gap-2 group"><div class="w-1.5 h-1.5 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div> {{ s }}</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-black text-sm uppercase tracking-[0.2em] mb-10 text-red-600">Kontak Kami</h4>
            <ul class="space-y-8">
              <li class="flex items-start gap-4">
                <div class="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-red-600 shrink-0">
                  <Icon name="lucide:phone" class="w-5 h-5" />
                </div>
                <span>
                  <span class="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">WhatsApp / Telepon</span>
                  <span class="text-slate-900 font-black text-lg">{{ settings?.site_phone || '0813-1777-2022' }}</span>
                </span>
              </li>
              <li class="flex items-start gap-4">
                <div class="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-red-600 shrink-0">
                  <Icon name="lucide:clock" class="w-5 h-5" />
                </div>
                <span>
                  <span class="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Jam Operasional</span>
                  <span class="text-slate-900 font-bold uppercase tracking-tight">Senin - Sabtu<br/>08.00 - 17.00 WIB</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div class="border-t border-slate-200 pt-12 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.5em]">
          <p>&copy; {{ new Date().getFullYear() }} {{ settings?.site_title || 'TALITALI.CO.ID' }}. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>

    <!-- Floating WA Button -->
    <a 
      :href="`https://wa.me/${cleanPhone(settings?.site_phone || '6281317772022')}`" 
      target="_blank" 
      rel="noopener noreferrer"
      class="fixed bottom-10 right-10 bg-green-500 hover:bg-slate-900 text-white h-16 rounded-full shadow-2xl z-[100] transition-all duration-500 flex items-center group overflow-hidden min-w-[64px] max-w-[64px] hover:max-w-[220px]"
    >
      <div class="w-16 h-16 flex-shrink-0 flex items-center justify-center">
        <Icon name="lucide:message-circle" class="w-8 h-8" />
      </div>
      <span class="font-black uppercase tracking-widest text-[10px] pr-8 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">Chat Admin</span>
    </a>
  </div>
</template>

<script setup>
const { data: settings } = await useAsyncData('settings', () => $fetch('/api/settings'))
const route = useRoute()
const mobileMenuOpen = ref(false)

const isHomePage = computed(() => route.path === '/')
const cleanPhone = (phone) => phone?.replace(/[^0-9]/g, '') || '6281317772022'

const navLinks = [
  { label: 'Tentang', href: '#about' },
  { label: 'Keunggulan', href: '#features' },
  { label: 'Harga', href: '#pricing' },
  { label: 'Testimoni', href: '#testimonials' }
]

const services = ['Lanyard 1.5 cm', 'Lanyard 2 cm', 'Lanyard 2.5 cm', 'Wristband', 'Kartu ID Card']
const socials = [
  { label: 'Instagram', icon: 'lucide:instagram', url: '#' },
  { label: 'TikTok', icon: 'lucide:video', url: '#' },
  { label: 'Youtube', icon: 'lucide:youtube', url: '#' }
]

useHead({
  titleTemplate: (titleChunk) => {
    const siteTitle = settings.value?.site_title || 'Talitali'
    return titleChunk && titleChunk !== siteTitle 
      ? `${titleChunk} - ${siteTitle}` 
      : siteTitle
  },
  link: [
    { 
      key: 'favicon',
      rel: 'icon', 
      href: () => settings.value?.site_favicon || '/favicon.ico' 
    }
  ],
  meta: [
    { name: 'description', content: () => settings.value?.seo_description || 'Modern CMS powered by Nuxt 3' },
    { property: 'og:title', content: () => settings.value?.site_title || '' },
    { property: 'og:description', content: () => settings.value?.seo_description || '' },
    { property: 'og:image', content: () => settings.value?.seo_image || '' },
    { name: 'twitter:card', content: 'summary_large_image' }
  ]
})
</script>

<style>
html {
  scroll-behavior: smooth;
}
.font-black { font-weight: 900; }
</style>
