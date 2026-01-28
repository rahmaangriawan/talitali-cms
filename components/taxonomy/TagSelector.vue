<template>
  <div class="space-y-2">
    <label class="block text-xs font-bold text-slate-500 mb-2">Tags</label>
    <div class="flex flex-wrap gap-2 mb-3">
      <div 
        v-for="tag in selectedTags" 
        :key="tag.id"
        class="flex items-center gap-1.5 px-2.5 py-1 bg-brand-50 text-brand-700 rounded-lg text-xs font-bold border border-brand-100"
      >
        {{ tag.name }}
        <button @click="removeTag(tag.id)" class="hover:text-red-600">
          <Icon name="ph:x-bold" class="w-3 h-3" />
        </button>
      </div>
    </div>
    
    <div class="relative">
      <input 
        v-model="search"
        type="text" 
        class="input-field text-sm"
        placeholder="Search or add tags..."
        @focus="showDropdown = true"
        @keydown.enter.prevent="selectHighlighted"
      />
      
      <div v-if="showDropdown && filteredTags.length > 0" class="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
        <div 
          v-for="tag in filteredTags" 
          :key="tag.id"
          @click="addTag(tag)"
          class="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm text-slate-700 flex items-center justify-between"
        >
          {{ tag.name }}
          <Icon v-if="modelValue.includes(tag.id)" name="ph:check-bold" class="w-4 h-4 text-brand-600" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  availableTags: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const search = ref('')
const showDropdown = ref(false)

const selectedTags = computed(() => {
  return props.availableTags.filter(tag => props.modelValue.includes(tag.id))
})

const filteredTags = computed(() => {
  if (!search.value) return props.availableTags
  return props.availableTags.filter(tag => 
    tag.name.toLowerCase().includes(search.value.toLowerCase())
  )
})

const addTag = (tag) => {
  if (!props.modelValue.includes(tag.id)) {
    emit('update:modelValue', [...props.modelValue, tag.id])
  } else {
    removeTag(tag.id)
  }
  search.value = ''
}

const removeTag = (id) => {
  emit('update:modelValue', props.modelValue.filter(tId => tId !== id))
}

const selectHighlighted = () => {
  if (filteredTags.value.length > 0) {
    addTag(filteredTags.value[0])
  }
}

// Close dropdown on click outside
if (process.client) {
  window.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      showDropdown.value = false
    }
  })
}
</script>
