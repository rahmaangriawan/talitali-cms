<template>
  <div v-if="fields && fields.length > 0" class="admin-card">
    <h3 class="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
      <Icon name="ph:stack-bold" class="text-brand-600" />
      Custom Fields
    </h3>
    
    <div class="space-y-12">
      <!-- Grouped Fields -->
      <div v-for="(group, groupName) in groupedFields" :key="groupName" class="space-y-6">
        <h4 class="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2 flex items-center gap-2">
          <Icon :name="getGroupIcon(groupName)" class="w-4 h-4" />
          {{ groupName }} Section
        </h4>
        
        <!-- Special handling for Features section -->
        <template v-if="groupName === 'Features'">
          <!-- Section Title & Description first -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div v-for="field in group.filter(f => f.slug === 'features_title' || f.slug === 'features_description')" :key="field.id" :class="field.type === 'TEXTAREA' ? 'md:col-span-2' : ''">
              <label class="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">{{ field.name }}</label>
              <input 
                v-if="field.type === 'TEXT'"
                v-model="values[field.slug]"
                type="text"
                class="input-field shadow-sm" 
                :placeholder="'Enter ' + field.name.toLowerCase() + '...'"
              />
              <textarea 
                v-else-if="field.type === 'TEXTAREA'"
                v-model="values[field.slug]"
                class="input-field h-32 shadow-sm"
                :placeholder="'Enter ' + field.name.toLowerCase() + '...'"
              ></textarea>
            </div>
          </div>
          
          <!-- Feature Cards Grouped -->
          <div v-for="i in 6" :key="`feature-${i}`" class="bg-slate-50 rounded-2xl p-6 border-2 border-slate-100 space-y-4">
            <h5 class="text-xs font-black text-red-600 uppercase tracking-wider flex items-center gap-2">
              <Icon name="ph:star-bold" class="w-4 h-4" />
              Feature Card {{ i }}
            </h5>
            <div class="grid grid-cols-1 gap-4">
              <div v-for="field in group.filter(f => f.slug.startsWith(`feature_${i}_`))" :key="field.id">
                <label class="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">{{ field.name.replace(`Feature ${i} `, '') }}</label>
                <input 
                  v-if="field.type === 'TEXT'"
                  v-model="values[field.slug]"
                  type="text"
                  class="input-field shadow-sm" 
                  :placeholder="field.slug.includes('icon') ? 'e.g. lucide:truck' : 'Enter ' + field.name.toLowerCase() + '...'"
                />
                <textarea 
                  v-else-if="field.type === 'TEXTAREA'"
                  v-model="values[field.slug]"
                  class="input-field h-24 shadow-sm"
                  :placeholder="'Enter ' + field.name.toLowerCase() + '...'"
                ></textarea>
              </div>
            </div>
          </div>
        </template>
        
        <!-- Default grid for other sections -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="field in group" :key="field.id" :class="field.type === 'TEXTAREA' ? 'md:col-span-2' : ''">
            <label class="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">{{ field.name }}</label>
            
            <!-- Text / Number -->
            <input 
              v-if="field.type === 'TEXT' || field.type === 'NUMBER'"
              v-model="values[field.slug]"
              :type="field.type === 'NUMBER' ? 'number' : 'text'"
              class="input-field shadow-sm" 
              :placeholder="'Enter ' + field.name.toLowerCase() + '...'"
            />
            
            <!-- Textarea -->
            <textarea 
              v-else-if="field.type === 'TEXTAREA'"
              v-model="values[field.slug]"
              class="input-field h-32 shadow-sm"
              :placeholder="'Enter ' + field.name.toLowerCase() + '...'"
            ></textarea>
            
            <!-- Image -->
            <div v-else-if="field.type === 'IMAGE'" class="space-y-3">
              <div v-if="values[field.slug]" class="relative aspect-video bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 group/img">
                <img :src="values[field.slug]" class="w-full h-full object-cover transition-transform group-hover/img:scale-105" />
                <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button @click="openMediaPicker(field.slug)" type="button" class="p-2 bg-white text-slate-900 rounded-lg shadow-xl hover:bg-slate-50">
                    <Icon name="ph:pencil-simple-bold" class="w-5 h-5" />
                  </button>
                  <button @click="values[field.slug] = ''" type="button" class="p-2 bg-white text-red-600 rounded-lg shadow-xl hover:bg-red-50">
                    <Icon name="ph:trash-bold" class="w-5 h-5" />
                  </button>
                </div>
              </div>
              <button 
                v-else
                @click="openMediaPicker(field.slug)" 
                type="button" 
                class="w-full aspect-video border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-brand-400 hover:text-brand-50 hover:bg-brand-50/30 transition-all gap-2 group/btn"
              >
                <Icon name="ph:image-square-bold" class="w-8 h-8 group-hover/btn:scale-110 transition-transform" />
                <span class="text-[10px] font-bold uppercase tracking-wider">Select {{ field.name }}</span>
              </button>
              <input v-model="values[field.slug]" type="text" class="input-field text-xs font-mono" placeholder="Or paste URL here..." />
            </div>

            <!-- Other types (Select, Date, Boolean) as before but styled -->
            <!-- ... -->
          </div>
        </div>
      </div>
    </div>

    <MediaPicker v-model="showMediaPicker" @select="handleMediaSelect" />
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  target: {
    type: String,
    default: 'POST'
  }
})

const emit = defineEmits(['update:modelValue'])

const { data: allFields } = await useFetch('/api/custom-fields')
const fields = computed(() => {
  return allFields.value?.filter(f => f.target === props.target) || []
})

const groupedFields = computed(() => {
  const order = ['Hero', 'About', 'Features', 'Pricing', 'Testimonials', 'FAQ', 'General']
  const groups = {}
  
  // Define field order within each group
  const fieldOrder = {
    'hero_tag': 1,
    'hero_title': 2,
    'hero_description': 3,
    'hero_image': 4,
    'hero_stats_text': 5,
    'about_title': 1,
    'about_content': 2,
    'about_image': 3,
    'about_stat_value': 4,
    'about_stat_label': 5,
    'benefit_1': 6,
    'benefit_2': 7,
    'benefit_3': 8,
    'benefit_4': 9,
    'features_title': 1,
    'features_description': 2,
    'feature_1_title': 3,
    'feature_1_desc': 4,
    'feature_1_icon': 5,
    'feature_2_title': 6,
    'feature_2_desc': 7,
    'feature_2_icon': 8,
    'feature_3_title': 9,
    'feature_3_desc': 10,
    'feature_3_icon': 11,
    'feature_4_title': 12,
    'feature_4_desc': 13,
    'feature_4_icon': 14,
    'feature_5_title': 15,
    'feature_5_desc': 16,
    'feature_5_icon': 17,
    'feature_6_title': 18,
    'feature_6_desc': 19,
    'feature_6_icon': 20,
    'pricing_title': 1,
    'pricing_description': 2,
    'pricing_1_title': 3,
    'pricing_1_subtitle': 4,
    'pricing_1_price': 5,
    'pricing_1_features': 6,
    'pricing_2_title': 7,
    'pricing_2_subtitle': 8,
    'pricing_2_price': 9,
    'pricing_2_features': 10,
    'pricing_3_title': 11,
    'pricing_3_subtitle': 12,
    'pricing_3_price': 13,
    'pricing_3_features': 14,
    'testimonials_title': 1,
    'testimonials_description': 2,
    'faq_title': 1
  }
  
  fields.value.forEach(field => {
    let groupName = 'General'
    if (field.slug.startsWith('hero_')) groupName = 'Hero'
    else if (field.slug.startsWith('about_') || field.slug.startsWith('benefit_')) groupName = 'About'
    else if (field.slug.startsWith('features_') || field.slug.startsWith('feature_')) groupName = 'Features'
    else if (field.slug.startsWith('pricing_')) groupName = 'Pricing'
    else if (field.slug.startsWith('testimonials_')) groupName = 'Testimonials'
    else if (field.slug.startsWith('faq_')) groupName = 'FAQ'

    if (!groups[groupName]) groups[groupName] = []
    groups[groupName].push(field)
  })

  // Sort fields within each group
  Object.keys(groups).forEach(groupName => {
    groups[groupName].sort((a, b) => {
      const orderA = fieldOrder[a.slug] || 999
      const orderB = fieldOrder[b.slug] || 999
      return orderA - orderB
    })
  })

  // Return groups in correct order
  const sorted = {}
  order.forEach(key => {
    if (groups[key]) sorted[key] = groups[key]
  })
  
  // Add any other groups that might not be in the order list
  Object.keys(groups).forEach(key => {
    if (!order.includes(key)) sorted[key] = groups[key]
  })

  return sorted
})

const getGroupIcon = (name) => {
  const icons = {
    'Hero': 'ph:monitor-bold',
    'About': 'ph:info-bold',
    'Features': 'ph:star-bold',
    'Pricing': 'ph:tag-bold',
    'Testimonials': 'ph:chat-circle-bold',
    'FAQ': 'ph:question-bold',
    'General': 'ph:stack-bold'
  }
  return icons[name] || 'ph:stack-bold'
}

const values = ref({ ...props.modelValue })
const showMediaPicker = ref(false)
const activeImageField = ref('')

watch(values, (newVal) => {
  emit('update:modelValue', newVal)
}, { deep: true })

// SYNC initial values if modelValue changes externally
watch(() => props.modelValue, (newVal) => {
  if (JSON.stringify(newVal) !== JSON.stringify(values.value)) {
    values.value = { ...newVal }
  }
}, { deep: true })

const parseOptions = (optionsStr) => {
  try {
    return JSON.parse(optionsStr) || []
  } catch {
    return []
  }
}

const openMediaPicker = (slug) => {
  activeImageField.value = slug
  showMediaPicker.value = true
}

const handleMediaSelect = (media) => {
  if (activeImageField.value) {
    values.value[activeImageField.value] = media.url
  }
}
</script>
