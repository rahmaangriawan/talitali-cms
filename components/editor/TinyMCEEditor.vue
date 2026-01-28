<template>
  <div class="tinymce-container relative">
    <Editor
      :key="'n00i07hxrgrbfq30mynxpnw4tsx6kwi2j2o5kwan2z228koq'"
      v-model="content"
      :init="editorConfig"
      api-key="n00i07hxrgrbfq30mynxpnw4tsx6kwi2j2o5kwan2z228koq"
    />
    
    <MediaPicker 
      v-model="showMediaPicker" 
      @select="insertMedia"
    />
  </div>
</template>

<script setup>
import Editor from '@tinymce/tinymce-vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const apiKey = 'n00i07hxrgrbfq30mynxpnw4tsx6kwi2j2o5kwan2z228koq'
const showMediaPicker = ref(false)
const activeEditor = ref(null)

const content = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const insertMedia = (media) => {
  if (activeEditor.value) {
    const html = `<img src="${media.url}" alt="${media.filename}" style="max-width: 100%; height: auto;" />`
    activeEditor.value.insertContent(html)
  }
}

const editorConfig = {
  height: 500,
  menubar: false, // Cleaner
  plugins: [
    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'media', 'table', 'help', 'wordcount'
  ],
  toolbar: 'undo redo | blocks | ' +
    'bold italic backcolor | alignleft aligncenter ' +
    'alignright alignjustify | bullist numlist | ' +
    'table link customImage | removeformat | code help',
  content_style: 'body { font-family:Inter,Helvetica,Arial,sans-serif; font-size:16px; color: #1e293b; line-height: 1.6; }',
  skin: 'oxide',
  content_css: 'default',
  setup: (editor) => {
    activeEditor.value = editor
    
    editor.ui.registry.addButton('customImage', {
      icon: 'image',
      tooltip: 'Insert from Media Library',
      onAction: () => {
        showMediaPicker.value = true
      }
    })
  }
}
</script>

<style>
.tinymce-container .tox-tinymce {
  @apply rounded-xl border-slate-200 shadow-sm !important;
}
.tinymce-container .tox-editor-header {
  @apply border-b border-slate-100 bg-slate-50/50 !important;
}
</style>
