<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
      <!-- Modal Header -->
      <div class="flex justify-between items-center p-6 border-b">
        <h2 class="text-xl font-semibold text-gray-900">Edit Camping Spot</h2>
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
      <form @submit.prevent="submitForm" class="p-6 space-y-4">
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
        
        <!-- Current Images -->
        <div v-if="spot.images && spot.images.length > 0">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Current Images
          </label>
          <div class="grid grid-cols-2 gap-2 mb-4">
            <div v-for="(image, index) in spot.images" :key="index" class="relative">
              <img :src="getImageUrl(image)" alt="Current image" class="w-full h-20 object-cover rounded-lg">
            </div>
          </div>
        </div>
        
        <!-- Add New Images -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Add New Images
          </label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              multiple
              @change="handleFileSelect"
              class="hidden"
            />
            
            <!-- Upload Area -->
            <div v-if="selectedFiles.length === 0">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="mt-4">
                <button type="button" @click="fileInput?.click()" class="btn btn-secondary">
                  Choose Images
                </button>
                <p class="mt-2 text-sm text-gray-500">
                  PNG, JPG, GIF up to 10MB each
                </p>
              </div>
            </div>
            
            <!-- Selected Files Preview -->
            <div v-else>
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div v-for="(file, index) in selectedFiles" :key="index" class="relative">
                  <img :src="file.preview" alt="Preview" class="w-full h-20 object-cover rounded-lg">
                  <button
                    type="button"
                    @click="removeFile(index)"
                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div class="flex justify-center space-x-2">
                <button type="button" @click="fileInput?.click()" class="btn btn-secondary btn-sm">
                  Add More
                </button>
                <button type="button" @click="clearFiles" class="btn btn-outline btn-sm">
                  Clear All
                </button>
              </div>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">
            Note: Adding new images will supplement your existing images, not replace them.
          </p>
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
            <span v-if="loading">Updating...</span>
            <span v-else>Update Spot</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { spotsAPI } from '@/services/api'

interface Spot {
  id: string
  title: string
  description: string
  location: string
  price: number
  images?: string[]
  owner?: {
    id?: string
    name: string
  }
}

const props = defineProps<{
  spot: Spot
}>()

const emit = defineEmits<{
  close: []
  updated: []
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
const selectedFiles = ref<Array<{ file: File; preview: string }>>([])
const fileInput = ref<HTMLInputElement>()

// Initialize form with spot data
onMounted(() => {
  form.title = props.spot.title
  form.location = props.spot.location
  form.price = props.spot.price
  form.description = props.spot.description
})

const getImageUrl = (imagePath: string) => {
  if (imagePath.startsWith('http')) {
    return imagePath
  }
  return `http://localhost:3001${imagePath}`
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (!files) return
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      error.value = 'Please select only image files'
      continue
    }
    
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      error.value = 'File size must be less than 10MB'
      continue
    }
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      selectedFiles.value.push({
        file,
        preview: e.target?.result as string
      })
    }
    reader.readAsDataURL(file)
  }
  
  // Clear the input
  target.value = ''
}

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
}

const clearFiles = () => {
  selectedFiles.value = []
}

const submitForm = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // If there are new files, create FormData, otherwise use regular update
    if (selectedFiles.value.length > 0) {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('location', form.location)
      formData.append('price', form.price.toString())
      formData.append('description', form.description)
      
      // Add images
      selectedFiles.value.forEach(fileObj => {
        formData.append('images', fileObj.file)
      })
      
      // Use the same endpoint but with FormData for file uploads
      await spotsAPI.update(props.spot.id, formData)
    } else {
      // Regular update without images
      await spotsAPI.update(props.spot.id, form)
    }
    
    emit('updated')
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to update spot'
  } finally {
    loading.value = false
  }
}
</script> 