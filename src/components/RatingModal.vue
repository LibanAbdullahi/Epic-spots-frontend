<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-xl max-w-md w-full p-6">
      <!-- Modal Header -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-gray-900">Rate & Review</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <!-- Spot Info -->
      <div v-if="booking" class="mb-6">
        <h3 class="font-semibold text-gray-900 mb-1">{{ booking.spot?.title }}</h3>
        <p class="text-gray-600 text-sm">{{ booking.spot?.location }}</p>
      </div>
      
      <!-- Rating Stars -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-3">Your Rating</label>
        <div class="flex space-x-1">
          <button
            v-for="n in 5"
            :key="n"
            @click="rating = n"
            class="focus:outline-none"
          >
            <svg 
              :class="[
                'w-8 h-8 transition-colors duration-150',
                n <= rating 
                  ? 'text-yellow-400 fill-current hover:text-yellow-500' 
                  : 'text-gray-300 hover:text-yellow-300'
              ]" 
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </button>
        </div>
        <p v-if="rating > 0" class="text-sm text-gray-600 mt-2">
          {{ rating }} star{{ rating > 1 ? 's' : '' }}
        </p>
      </div>
      
      <!-- Comment -->
      <div class="mb-6">
        <label for="comment" class="block text-sm font-medium text-gray-700 mb-2">
          Review (Optional)
        </label>
        <textarea
          id="comment"
          v-model="comment"
          rows="4"
          class="input"
          placeholder="Share your experience with this camping spot..."
        ></textarea>
      </div>
      
      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-700 text-sm">{{ error }}</p>
      </div>
      
      <!-- Modal Footer -->
      <div class="flex space-x-3">
        <button @click="$emit('close')" class="btn btn-secondary flex-1">
          Cancel
        </button>
        <button 
          @click="submitRating" 
          :disabled="rating === 0 || loading"
          class="btn btn-primary flex-1"
          :class="rating === 0 || loading ? 'opacity-50 cursor-not-allowed' : ''"
        >
          <div v-if="loading" class="flex items-center justify-center">
            <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
            Submitting...
          </div>
          <span v-else>Submit Rating</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ratingsAPI } from '@/services/api'

interface Spot {
  id?: string
  title: string
  location: string
  price: number
  images?: string[]
}

interface Booking {
  id: number
  dateFrom: string
  dateTo: string
  spot?: Spot
}

interface Props {
  show: boolean
  booking: Booking | null
}

interface Emits {
  close: []
  success: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const rating = ref(0)
const comment = ref('')
const loading = ref(false)
const error = ref('')

// Reset form when modal is opened
watch(() => props.show, (newValue) => {
  if (newValue) {
    rating.value = 0
    comment.value = ''
    error.value = ''
    loading.value = false
  }
})

const submitRating = async () => {
  if (!props.booking || !props.booking.spot?.id || rating.value === 0) {
    error.value = 'Please select a rating'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await ratingsAPI.createOrUpdate({
      spotId: props.booking.spot.id,
      rating: rating.value,
      comment: comment.value || undefined
    })
    
    emit('success')
  } catch (err: any) {
    console.error('Error submitting rating:', err)
    error.value = err.response?.data?.error || 'Failed to submit rating'
  } finally {
    loading.value = false
  }
}
</script> 