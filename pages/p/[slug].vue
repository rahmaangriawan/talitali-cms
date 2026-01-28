<template>
  <div v-if="page" class="py-20 animate-fade-in">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div v-if="page.featuredImage" class="aspect-[21/9] w-full bg-slate-100 rounded-[2.5rem] overflow-hidden mb-16 shadow-2xl shadow-indigo-100/50">
        <img :src="page.featuredImage" class="w-full h-full object-cover" />
      </div>

      <header class="mb-16">
        <h1 class="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8">
          {{ page.title }}
        </h1>
      </header>

      <div class="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-a:text-indigo-600 prose-img:rounded-3xl prose-pre:bg-slate-900 prose-pre:rounded-2xl shadow-sm" v-html="page.content"></div>
      
      <!-- Custom Fields Display (Optional) -->
      <div v-if="hasCustomContent" class="mt-20 pt-12 border-t border-slate-100">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div v-for="cv in page.customValues" :key="cv.id" class="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <span class="text-xs font-black text-indigo-600 uppercase tracking-widest block mb-2">{{ cv.field.name }}</span>
            <div class="text-slate-700 font-medium">
              <template v-if="cv.field.type === 'IMAGE'">
                <img :src="cv.value" class="rounded-xl max-h-48 object-contain" />
              </template>
              <template v-else-if="cv.field.type === 'BOOLEAN'">
                <span :class="cv.value === 'true' ? 'text-green-600' : 'text-slate-400'">{{ cv.value === 'true' ? 'Yes' : 'No' }}</span>
              </template>
              <template v-else>
                {{ cv.value }}
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const slug = route.params.slug

const { data: page } = await useFetch(`/api/public/pages/${slug}`)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const hasCustomContent = computed(() => page.value?.customValues?.length > 0)

useHead({
  title: page.value.metaTitle || page.value.title,
  meta: [
    { name: 'description', content: page.value.metaDescription || '' },
    { property: 'og:title', content: page.value.metaTitle || page.value.title },
    { property: 'og:description', content: page.value.metaDescription || '' },
    { property: 'og:image', content: page.value.featuredImage || '' }
  ]
})
</script>
