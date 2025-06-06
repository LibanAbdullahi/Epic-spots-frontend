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
          <p class="text-xs text-gray-500 mb-4">
            Note: Image editing is not supported yet. To change images, please delete and recreate the spot.
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

const submitForm = async () => {
  loading.value = true
  error.value = ''
  
  try {
    await spotsAPI.update(props.spot.id, form)
    emit('updated')
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to update spot'
  } finally {
    loading.value = false
  }
}
</script> 