<template>
  <div class="selection:bg-red-100 selection:text-red-700">
    <!-- Hero Section -->
    <section class="pt-24 pb-24 bg-gradient-to-br from-slate-50 via-white to-red-50 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-1/2 h-full bg-red-600/5 -skew-x-12 translate-x-1/4"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center lg:text-left">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span class="inline-block py-1.5 px-4 rounded-full bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-red-200 shadow-sm animate-bounce">
              {{ getCF('hero_tag') || 'Jasa Cetak Lanyard #1 di Indonesia' }}
            </span>
            <h1 class="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight">
              {{ getCF('hero_title', 'title') || 'Buat Lanyard Custom Unik' }}
            </h1>
            <p class="text-xl text-slate-500 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {{ getCF('hero_description', 'metaDescription') || 'Solusi cetak tali lanyard satuan untuk perusahaan, event, dan komunitas. Gratis ongkir ke seluruh Indonesia dengan kualitas premium.' }}
            </p>
            <div class="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <a href="#pricing" class="bg-red-600 hover:bg-slate-900 text-white text-lg px-10 py-5 rounded-[2rem] font-bold shadow-2xl shadow-red-200 transition transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2">
                Pesan Sekarang
                <Icon name="lucide:arrow-right" class="w-5 h-5" />
              </a>
              <a :href="`https://wa.me/${cleanPhone(settings?.site_phone || '6281317772022')}`" class="bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-100 text-lg px-10 py-5 rounded-[2rem] font-bold shadow-sm transition flex items-center justify-center gap-2 transform hover:-translate-y-1 active:scale-95">
                <Icon name="lucide:message-circle" class="w-6 h-6 text-green-500" />
                Konsultasi WA
              </a>
            </div>
            
            <div class="mt-12 flex items-center justify-center lg:justify-start gap-3">
              <div class="flex text-yellow-500 scale-125 mr-2">
                <Icon v-for="i in 5" :key="i" name="lucide:star" class="w-4 h-4 fill-current" />
              </div>
              <span class="text-sm text-slate-400 font-bold uppercase tracking-wider">
                {{ getCF('hero_stats_text') || 'Dipercaya oleh 1389+ Klien Puas' }}
              </span>
            </div>
          </div>
          
          <div class="relative hidden lg:block">
            <div class="relative z-10 aspect-square bg-slate-100 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group">
              <img v-if="getCF('hero_image') || homePage?.featuredImage" :src="getCF('hero_image') || homePage.featuredImage" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div v-else class="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                <Icon name="lucide:image" class="w-24 h-24 opacity-20" />
              </div>
            </div>
            <!-- Decorative Elements -->
            <div class="absolute -top-10 -right-10 w-48 h-48 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
            <div class="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-32 bg-white relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-2 gap-20 items-center">
          <div class="relative order-2 md:order-1">
            <div class="aspect-[4/3] bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl relative group">
              <img v-if="getCF('about_image')" :src="getCF('about_image')" class="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
              <div v-else class="w-full h-full bg-slate-800 flex items-center justify-center text-white/20">
                <Icon name="lucide:printer" class="w-24 h-24" />
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
            </div>
            <div class="absolute -bottom-10 -right-10 bg-red-600 p-10 rounded-[2.5rem] shadow-2xl shadow-red-200 border-8 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <p class="text-6xl font-black text-white mb-1">{{ getCF('about_stat_value') || '99%' }}</p>
              <p class="text-red-100 font-bold text-xs uppercase tracking-widest">{{ getCF('about_stat_label') || 'Akurasi Warna (Epson F6270)' }}</p>
            </div>
          </div>
          <div class="order-1 md:order-2">
            <h2 class="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight tracking-tight">
              {{ getCF('about_title') || 'Tentang' }} <span class="text-red-600">Talitali.co.id</span>
            </h2>
            <div class="text-slate-600 mb-10 leading-relaxed font-medium text-lg about-content" v-html="homeContent"></div>
            
            <div class="space-y-4">
              <div v-for="benefit in benefits" :key="benefit" class="flex items-center gap-3">
                <Icon name="lucide:check-circle" class="w-6 h-6 text-red-600 flex-shrink-0" />
                <span class="text-slate-700 font-medium text-base">{{ benefit }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section id="features" class="py-32 bg-slate-50 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-20">
          <span class="text-red-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Our Excellence</span>
          <h2 class="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">{{ getCF('features_title') || 'Mengapa Memilih Kami?' }}</h2>
          <div class="w-20 h-1.5 bg-red-600 mx-auto rounded-full mb-8"></div>
          <p class="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">{{ getCF('features_description') || 'Kami memberikan standar pelayanan terbaik untuk kepuasan Anda dalam membuat lanyard impian.' }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <div v-for="feature in features" :key="feature.title" class="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-brand-100 transition-all duration-500 border border-slate-100 group relative overflow-hidden">
            <div class="absolute -top-10 -right-10 w-32 h-32 bg-red-50 rounded-full group-hover:scale-[3] transition-transform duration-700 ease-out z-0"></div>
            <div class="relative z-10">
              <div class="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-8 group-hover:bg-red-600 group-hover:text-white transition duration-500 shadow-sm">
                <Icon :name="feature.icon" class="w-8 h-8" />
              </div>
              <h3 class="text-xl font-black text-slate-900 mb-4 group-hover:text-red-700 transition">{{ feature.title }}</h3>
              <p class="text-slate-500 font-medium leading-relaxed group-hover:text-slate-900 transition">{{ feature.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="py-32 bg-white relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-20">
          <h2 class="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">{{ getCF('pricing_title') || 'Daftar Harga Tali Lanyard' }}</h2>
          <p class="text-lg text-slate-500">{{ getCF('pricing_description') || 'Harga terjangkau dan lebih murah dari tempat lain.' }}</p>
        </div>

        <div class="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto items-center">
          <div v-for="(plan, idx) in pricing" :key="plan.title" 
            class="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm transition-all duration-500 relative group"
            :class="idx === 1 ? 'border-4 border-red-600 shadow-2xl shadow-red-100 lg:scale-110 z-10' : 'hover:shadow-xl hover:shadow-slate-100'"
          >
            <div v-if="idx === 1" class="absolute -top-5 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-black px-6 py-2 rounded-full tracking-widest shadow-lg">FAVORIT</div>
            <h3 class="text-2xl font-black text-slate-900 mb-2 tracking-tight">{{ plan.title }}</h3>
            <p class="text-sm text-slate-400 font-bold uppercase tracking-wider mb-8">{{ plan.subtitle }}</p>
            <div class="mb-10 flex items-baseline gap-1">
              <span class="text-4xl font-black text-red-600 tracking-tighter">{{ plan.price }}</span>
              <span class="text-slate-400 font-bold text-sm">/pcs</span>
            </div>
            <ul class="space-y-4 mb-12">
              <li v-for="feature in plan.features" :key="feature" class="flex gap-3 text-sm font-bold text-slate-600">
                <Icon name="lucide:check-circle" class="w-5 h-5 text-emerald-500 flex-shrink-0" />
                {{ feature }}
              </li>
            </ul>
            <a :href="`https://wa.me/${cleanPhone(settings?.site_phone || '6281317772022')}?text=Halo Talitali, saya ingin pesan ${plan.title}`" 
              class="w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all text-center block"
              :class="idx === 1 ? 'bg-red-600 text-white shadow-xl shadow-red-200 hover:bg-slate-900' : 'border-2 border-red-600 text-red-600 hover:bg-red-50'"
            >
              Pesan Sekarang
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Latest Posts / Dynamic Blog -->
    <section class="py-32 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span class="text-red-600 font-black text-xs uppercase tracking-widest mb-4 block">Blog & News</span>
            <h2 class="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Cek Artikel <span class="text-red-600">Terbaru</span></h2>
          </div>
          <NuxtLink to="/blog" class="flex items-center gap-2 text-slate-900 font-black uppercase text-xs tracking-widest hover:text-red-600 group transition">
            Lihat Semua Artikel
            <Icon name="lucide:arrow-right" class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </NuxtLink>
        </div>

        <div v-if="posts && posts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <NuxtLink 
            v-for="post in posts.slice(0, 3)" 
            :key="post.id" 
            :to="`/${post.slug}`"
            class="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group border border-slate-100 flex flex-col"
          >
            <div class="aspect-[16/10] bg-slate-100 relative overflow-hidden">
              <img v-if="post.featuredImage" :src="post.featuredImage" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" :alt="post.title" />
              <div v-else class="w-full h-full bg-slate-200 flex items-center justify-center text-slate-300">
                <Icon name="lucide:image" class="w-16 h-16" />
              </div>
              <div v-if="post.category" class="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-slate-900 uppercase tracking-widest shadow-sm">
                {{ post.category.name }}
              </div>
            </div>
            <div class="p-10 flex-1 flex flex-col">
              <h4 class="text-xl font-black text-slate-900 mb-4 group-hover:text-red-600 transition tracking-tight leading-tight">
                {{ post.title }}
              </h4>
              <p class="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-8 flex-1">
                {{ post.excerpt || 'Temukan informasi menarik seputar lanyard custom dan produk berkualitas kami.' }}
              </p>
              <div class="pt-6 border-t border-slate-50 flex items-center justify-between">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ new Date(post.createdAt).toLocaleDateString('id-ID', { month: 'long', day: 'numeric', year: 'numeric' }) }}</span>
                <span class="text-xs font-black text-red-600 uppercase tracking-widest">Baca Selengkapnya</span>
              </div>
            </div>
          </NuxtLink>
        </div>
        
        <div v-else class="p-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
          <Icon name="lucide:loader" class="w-12 h-12 text-slate-100 mx-auto mb-4 animate-spin" />
          <p class="text-slate-400 font-bold uppercase tracking-widest text-sm">Menyiapkan artikel menarik untuk Anda...</p>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section id="testimonials" class="py-32 bg-white relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center mb-24">
          <h2 class="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">{{ getCF('testimonials_title') || 'Dengarkan Kata Mereka' }}</h2>
          <p class="text-lg text-slate-500 max-w-2xl mx-auto">{{ getCF('testimonials_description') || 'Bergabunglah dengan ribuan klien puas lainnya.' }}</p>
        </div>

        <div class="grid md:grid-cols-2 gap-10">
          <div v-for="t in testimonials" :key="t.author" class="bg-slate-50 p-12 rounded-[3.5rem] relative group border border-slate-100 hover:bg-slate-900 transition-all duration-700">
            <Icon name="lucide:quote" class="absolute right-10 top-10 w-16 h-16 text-slate-200 opacity-20 group-hover:text-red-600 group-hover:opacity-40 transition" />
            <div class="flex text-yellow-500 mb-8 scale-110">
              <Icon v-for="i in 5" :key="i" name="lucide:star" class="w-4 h-4 fill-current" />
            </div>
            <p class="text-xl md:text-2xl font-medium text-slate-700 italic mb-10 leading-relaxed group-hover:text-slate-300 transition duration-500">"{{ t.quote }}"</p>
            <div class="flex items-center gap-6">
              <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-red-600 font-black text-xl shadow-lg border border-slate-100">
                {{ t.initial }}
              </div>
              <div>
                <h4 class="font-black text-slate-900 text-lg group-hover:text-white transition">{{ t.author }}</h4>
                <p class="text-sm font-bold text-slate-400 uppercase tracking-widest group-hover:text-red-500 transition">{{ t.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-32 bg-slate-900 text-white relative overflow-hidden">
      <div class="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12"></div>
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center mb-20">
          <h2 class="text-4xl md:text-5xl font-black mb-6 tracking-tight">{{ getCF('faq_title') || 'Pertanyaan Umum' }}</h2>
          <div class="w-20 h-1.5 bg-red-600 mx-auto rounded-full"></div>
        </div>
        
        <div class="space-y-6">
          <div v-for="(item, idx) in faqs" :key="idx" class="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-lg">
            <button @click="activeFaq = activeFaq === idx ? null : idx" class="w-full flex justify-between items-center p-8 text-left transition hover:bg-white/5">
              <span class="font-black text-lg tracking-tight pr-4">{{ item.q }}</span>
              <Icon :name="activeFaq === idx ? 'lucide:minus' : 'lucide:plus'" class="w-6 h-6 text-red-500 flex-shrink-0 transition-transform duration-300" />
            </button>
            <Transition
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="max-h-0 opacity-0"
              enter-to-class="max-h-[500px] opacity-100"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="max-h-[500px] opacity-100"
              leave-to-class="max-h-0 opacity-0"
            >
              <div v-show="activeFaq === idx" class="px-8 pb-8 text-slate-400 font-medium leading-relaxed">
                <div class="pt-0 border-t border-white/5 mt-0">
                  {{ item.a }}
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const { data: settings } = await useAsyncData('settings', () => $fetch('/api/settings'))
const { data: homePage } = await useFetch('/api/public/pages/home')
const { data: posts } = await useFetch('/api/public/posts')

const activeFaq = ref(null)

const cleanPhone = (phone) => phone?.replace(/[^0-9]/g, '') || '6281317772022'

const getCF = (slug, fallbackField) => {
  if (!homePage.value) return ''
  const val = homePage.value.customValues?.find(v => v.field.slug === slug)?.value
  return val || homePage.value[fallbackField] || ''
}

const homeContent = computed(() => {
  const rawContent = getCF('about_content', 'content') || 'Jasa pembuatan tali lanyard custom dan percetakan tali lanyard yang fokus pada kebutuhan lanyard satuan hingga partai besar.'
  
  // Safety check
  if (!rawContent || typeof rawContent !== 'string') {
    return '<p>Jasa pembuatan tali lanyard custom dan percetakan tali lanyard yang fokus pada kebutuhan lanyard satuan hingga partai besar.</p>'
  }
  
  // If content doesn't have HTML tags, convert single newlines to paragraphs
  if (!rawContent.includes('<p>') && !rawContent.includes('<div>')) {
    return rawContent
      .split('\n')
      .filter(p => p && p.trim())
      .map(p => `<p>${p.trim()}</p>`)
      .join('')
  }
  
  return rawContent
})

useHead({
  title: () => homePage.value?.metaTitle || settings.value?.site_tagline 
    ? `${settings.value.site_title} - ${settings.value.site_tagline}`
    : settings.value?.site_title || 'Talitali CMS',
  titleTemplate: null,
  meta: [
    { name: 'description', content: () => homePage.value?.metaDescription || settings.value?.seo_description || '' },
    { property: 'og:title', content: () => settings.value?.site_title || '' },
    { property: 'og:description', content: () => settings.value?.seo_description || '' },
    { property: 'og:image', content: () => homePage.value?.featuredImage || settings.value?.seo_image || '' }
  ]
})

const benefits = computed(() => {
  return [
    getCF('benefit_1'),
    getCF('benefit_2'),
    getCF('benefit_3'),
    getCF('benefit_4')
  ].filter(b => b && b.trim())
})

const features = computed(() => {
  const items = []
  for (let i = 1; i <= 6; i++) {
    const title = getCF(`feature_${i}_title`)
    const desc = getCF(`feature_${i}_desc`)
    const icon = getCF(`feature_${i}_icon`) || 'lucide:star'
    
    if (title && desc) {
      items.push({ title, desc, icon })
    }
  }
  
  // Fallback to defaults if no custom fields
  if (items.length === 0) {
    return [
      { title: 'Minimal Order Rendah', desc: 'Spesialisasi cetak custom mulai dari 10 pcs saja.', icon: 'lucide:mouse-pointer' },
      { title: 'Pengiriman Cepat', desc: 'Terintegrasi JNE, Tiki & Indah Cargo ke seluruh Indonesia.', icon: 'lucide:truck' },
      { title: 'Bergaransi 100%', desc: 'Jaminan ganti baru jika ada produk rusak atau cacat.', icon: 'lucide:shield-check' },
      { title: 'Harga Terjangkau', desc: 'Lanyard berkualitas tinggi dengan harga yang sangat kompetitif.', icon: 'lucide:credit-card' },
      { title: 'Warna Akurat', desc: 'Dicetak detail dengan mesin Epson Sure Colour F6270.', icon: 'lucide:palette' },
      { title: 'Pemesanan Online', desc: 'Desain custom sendiri dengan proses pemesanan praktis.', icon: 'lucide:clock' }
    ]
  }
  
  return items
})

const pricing = computed(() => {
  const items = []
  for (let i = 1; i <= 3; i++) {
    const title = getCF(`pricing_${i}_title`)
    const subtitle = getCF(`pricing_${i}_subtitle`)
    const price = getCF(`pricing_${i}_price`)
    const featuresRaw = getCF(`pricing_${i}_features`)
    
    if (title && price) {
      const features = featuresRaw ? featuresRaw.split('\n').filter(f => f.trim()) : []
      items.push({ title, subtitle: subtitle || '', price, features })
    }
  }
  
  // Fallback to defaults if no custom fields
  if (items.length === 0) {
    return [
      { title: 'Lanyard 1.5 CM', subtitle: 'Event ringan', price: 'Rp 7.000', features: ['Polyester Tissue', '90cm x 1.5cm', 'Hook & Stopper Inc.', 'Print 2 Sisi Full Color'] },
      { title: 'Lanyard 2 CM', subtitle: 'Paling Diminati', price: 'Rp 8.000', features: ['Polyester Tissue Premium', '90cm x 2cm', 'Hook & Stopper Inc.', 'Print 2 Sisi Full Color'] },
      { title: 'Lanyard 2.5 CM', subtitle: 'Eksklusif', price: 'Rp 10.000', features: ['Polyester Tissue', '90cm x 2.5cm', 'Hook & Stopper Inc.', 'Print 2 Sisi Full Color'] }
    ]
  }
  
  return items
})

const testimonials = [
  { quote: 'Kualitas tali dan ID card-nya yang kuat dan tahan lama sangat penting untuk menunjang kegiatan kami di lapangan.', author: 'M. Husni Mubaroq', role: 'Logistics PT Pertamina', initial: 'M' },
  { quote: 'Sangat suka hasilnya, cepet dalam pengerjaan nya sesuai dengan apa yang di contohkan. Pelayanannya ramah.', author: 'Hasan Sodikin', role: 'Karyawan Bank Mega', initial: 'H' }
]

const faqs = [
  { q: 'Apa Keunggulan Talitali?', a: 'Kami menawarkan pemesanan satuan (mulai 10pcs), gratis ongkir seluruh Indonesia, garansi produk cacat, dan kualitas cetak premium menggunakan mesin Epson Sure Colour F6270.' },
  { q: 'Apakah Talitali Melayani Pemesanan dari Seluruh Indonesia?', a: 'Ya, kami melayani pemesanan dari seluruh Indonesia dan terintegrasi dengan ekspedisi JNE, Tiki, Pos Indonesia, dan Indah Cargo.' },
  { q: 'Bagaimana Cara Memesan Lanyard di Talitali?', a: 'Cukup hubungi CS kami melalui WhatsApp atau formulir kontak, tentukan spesifikasi, dan pesanan akan segera diproses.' }
]
</script>

<style scoped>
.about-content :deep(p) {
  margin-bottom: 1rem;
}

.about-content :deep(p:last-child) {
  margin-bottom: 0;
}

.font-black { font-weight: 900; }

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out forwards;
}
</style>
