<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
      <!-- Modal Header -->
      <div class="flex justify-between items-center p-6 border-b">
        <h2 class="text-xl font-semibold text-gray-900">Add New Camping Spot</h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <!-- Modal Body -->
      <form @submit.prevent="submitForm" class="p-6 space-y-4" enctype="multipart/form-data">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
            Spot Title *
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            class="input"
            placeholder="Enter spot title"
          />
        </div>
        
        <div>
          <label for="location" class="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <input
            id="location"
            v-model="form.location"
            type="text"
            required
            class="input"
            placeholder="Enter location"
          />
        </div>
        
        <div>
          <label for="price" class="block text-sm font-medium text-gray-700 mb-2">
            Price per night (€) *
          </label>
          <input
            id="price"
            v-model.number="form.price"
            type="number"
            min="0"
            step="0.01"
            required
            class="input"
            placeholder="Enter price"
          />
        </div>
        
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            v-model="form.description"
            required
            rows="4"
            class="input resize-none"
            placeholder="Describe your camping spot..."
          ></textarea>
        </div>
        
        <!-- Image Upload Section -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Images (Optional)
          </label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <input
              ref="fileInput"
              type="file"
              multiple
              accept="image/*"
              @change="handleFileSelect"
              class="hidden"
            />
            <div class="text-center">
              <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <button
                type="button"
                @click="triggerFileInput"
                class="text-primary-600 hover:text-primary-800 font-medium"
              >
                Choose images
              </button>
              <p class="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF up to 5MB each (max 5 images)
              </p>
            </div>
          </div>
          
          <!-- Image Previews -->
          <div v-if="imagePreviews.length > 0" class="mt-4 grid grid-cols-2 gap-2">
            <div v-for="(preview, index) in imagePreviews" :key="index" class="relative">
              <img :src="preview" alt="Preview" class="w-full h-20 object-cover rounded-lg">
              <button
                type="button"
                @click="removeImage(index)"
                class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
          </div>
        </div>
        
        <!-- Error Message -->
        <div v-if="error" class="text-red-600 text-sm">
          {{ error }}
        </div>
        
        <!-- Modal Footer -->
        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="btn btn-primary"
          >
            <span v-if="loading">Creating...</span>
            <span v-else>Create Spot</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { spotsAPI } from '@/services/api'

const emit = defineEmits<{
  close: []
  created: []
}>()

// Form state
const form = reactive({
  title: '',
  location: '',
  price: 0,
  description: ''
})

const loading = ref(false)
const error = ref('')
const fileInput = ref<HTMLInputElement>()
const selectedFiles = ref<File[]>([])
const imagePreviews = ref<string[]>([])

const resetForm = () => {
  form.title = ''
  form.location = ''
  form.price = 0
  form.description = ''
  selectedFiles.value = []
  imagePreviews.value = []
  error.value = ''
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  
  // Validate file count
  if (files.length > 5) {
    error.value = 'Maximum 5 images allowed'
    return
  }
  
  // Validate file sizes and types
  for (const file of files) {
    if (file.size > 5 * 1024 * 1024) {
      error.value = `File "${file.name}" is too large. Maximum size is 5MB.`
      return
    }
    if (!file.type.startsWith('image/')) {
      error.value = `File "${file.name}" is not an image.`
      return
    }
  }
  
  selectedFiles.value = files
  error.value = ''
  
  // Create previews
  imagePreviews.value = []
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreviews.value.push(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  })
}

const removeImage = (index: number) => {
  selectedFiles.value.splice(index, 1)
  imagePreviews.value.splice(index, 1)
}

const submitForm = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const formData = new FormData()
    
    // Append form fields
    formData.append('title', form.title)
    formData.append('location', form.location)
    formData.append('price', form.price.toString())
    formData.append('description', form.description)
    
    // Append image files
    selectedFiles.value.forEach(file => {
      formData.append('images', file)
    })
    
    await spotsAPI.create(formData)
    emit('created')
    resetForm()
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to create spot'
  } finally {
    loading.value = false
  }
}
</script> 