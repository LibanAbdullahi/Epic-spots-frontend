<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="max-w-4xl mx-auto px-4 py-8">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Spot Not Found</h2>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <router-link to="/" class="btn btn-primary">Back to Home</router-link>
      </div>
    </div>
    
    <!-- Spot Details -->
    <div v-else-if="spot" class="max-w-6xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <nav class="text-sm text-gray-600 mb-4">
          <router-link to="/" class="hover:text-primary-600">Home</router-link>
          <span class="mx-2">/</span>
          <span>{{ spot.title }}</span>
        </nav>
        
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ spot.title }}</h1>
            <div class="flex items-center text-gray-600">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>{{ spot.location }}</span>
            </div>
          </div>
          <div class="text-right">
            <div class="text-3xl font-bold text-primary-600">€{{ spot.price }}</div>
            <div class="text-gray-600">per night</div>
          </div>
        </div>
      </div>
      
      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Spot Image and Description -->
        <div class="lg:col-span-2">
          <!-- Image Gallery -->
          <div class="mb-6">
            <div v-if="spot.images && spot.images.length > 0" class="space-y-4">
              <!-- Main Image -->
              <div class="h-64 md:h-96 rounded-lg overflow-hidden">
                <img 
                  :src="getImageUrl(spot.images[currentImageIndex])" 
                  :alt="spot.title"
                  class="w-full h-full object-cover"
                />
              </div>
              
              <!-- Thumbnail Images -->
              <div v-if="spot.images.length > 1" class="grid grid-cols-4 gap-2">
                <button
                  v-for="(image, index) in spot.images"
                  :key="index"
                  @click="currentImageIndex = index"
                  :class="[
                    'h-20 rounded-lg overflow-hidden transition-all',
                    currentImageIndex === index 
                      ? 'ring-2 ring-primary-600 opacity-100' 
                      : 'opacity-70 hover:opacity-100'
                  ]"
                >
                  <img 
                    :src="getImageUrl(image)" 
                    :alt="`${spot.title} - Image ${index + 1}`"
                    class="w-full h-full object-cover"
                  />
                </button>
              </div>
            </div>
            
            <!-- Fallback placeholder -->
            <div v-else class="h-64 md:h-96 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
              <svg class="w-24 h-24 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path>
              </svg>
            </div>
          </div>
          
          <!-- Description -->
          <div class="card">
            <h2 class="text-xl font-semibold mb-4">About this spot</h2>
            <p class="text-gray-600 leading-relaxed">{{ spot.description }}</p>
            
            <div class="mt-6 pt-6 border-t">
              <h3 class="font-semibold mb-2">Hosted by {{ spot.owner?.name }}</h3>
              <p class="text-gray-600 text-sm">Owner since {{ new Date().getFullYear() }}</p>
            </div>
          </div>
        </div>
        
        <!-- Booking Card -->
        <div class="lg:col-span-1">
          <div class="card sticky top-6">
            <h3 class="text-lg font-semibold mb-4">Book this spot</h3>
            
            <div v-if="!authStore.isAuthenticated" class="text-center">
              <p class="text-gray-600 mb-4">Sign in to book this spot</p>
              <router-link to="/login" class="btn btn-primary w-full">Sign In</router-link>
            </div>
            
            <form v-else @submit.prevent="handleBooking" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Check-in Date
                </label>
                <input
                  v-model="bookingForm.dateFrom"
                  type="date"
                  required
                  :min="today"
                  class="input"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Check-out Date
                </label>
                <input
                  v-model="bookingForm.dateTo"
                  type="date"
                  required
                  :min="bookingForm.dateFrom || today"
                  class="input"
                />
              </div>
              
              <div v-if="totalPrice > 0" class="border-t pt-4">
                <div class="flex justify-between items-center">
                  <span>{{ nights }} night{{ nights > 1 ? 's' : '' }}</span>
                  <span>€{{ totalPrice.toFixed(2) }}</span>
                </div>
              </div>
              
              <div v-if="bookingError" class="text-red-600 text-sm">
                {{ bookingError }}
              </div>
              
              <button
                type="submit"
                :disabled="bookingLoading || !bookingForm.dateFrom || !bookingForm.dateTo"
                class="btn btn-primary w-full"
              >
                <span v-if="bookingLoading">Booking...</span>
                <span v-else>Book Now</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { spotsAPI, bookingsAPI } from '@/services/api'

interface Spot {
  id: string
  title: string
  description: string
  location: string
  price: number
  images?: string[]
  owner?: {
    name: string
  }
}

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const spot = ref<Spot | null>(null)
const loading = ref(false)
const error = ref('')

const bookingForm = reactive({
  dateFrom: '',
  dateTo: ''
})

const bookingLoading = ref(false)
const bookingError = ref('')

const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const nights = computed(() => {
  if (!bookingForm.dateFrom || !bookingForm.dateTo) return 0
  const start = new Date(bookingForm.dateFrom)
  const end = new Date(bookingForm.dateTo)
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
})

const totalPrice = computed(() => {
  if (!spot.value || nights.value <= 0) return 0
  return nights.value * spot.value.price
})

const currentImageIndex = ref(0)

const fetchSpot = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await spotsAPI.getById(route.params.id as string)
    spot.value = response.data.spot
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to fetch spot details'
  } finally {
    loading.value = false
  }
}

const handleBooking = async () => {
  bookingLoading.value = true
  bookingError.value = ''
  
  try {
    // More detailed debugging
    console.log('=== BOOKING DEBUG START ===')
    console.log('route.params:', route.params)
    console.log('route.params.id:', route.params.id)
    console.log('route.params.id type:', typeof route.params.id)
    
    const spotId = route.params.id as string
    console.log('Using spotId directly as string:', spotId)
    console.log('=== BOOKING DEBUG END ===')
    
    if (!spotId) {
      console.error('No spot ID found in route params')
      bookingError.value = 'No spot ID found'
      return
    }
    
    if (!bookingForm.dateFrom || !bookingForm.dateTo) {
      bookingError.value = 'Please select both check-in and check-out dates'
      return
    }
    
    const bookingData = {
      spotId,
      dateFrom: bookingForm.dateFrom,
      dateTo: bookingForm.dateTo
    }
    
    console.log('Sending booking data:', bookingData)
    
    const response = await bookingsAPI.create(bookingData)
    
    console.log('Booking response:', response.data)
    
    alert('Booking successful! Check your profile for booking details.')
    router.push('/profile')
  } catch (err: any) {
    console.error('Booking error:', err)
    bookingError.value = err.response?.data?.error || 'Booking failed'
  } finally {
    bookingLoading.value = false
  }
}

const getImageUrl = (imagePath: string) => {
  // If the path already starts with http, return as is
  if (imagePath.startsWith('http')) {
    return imagePath
  }
  // Otherwise, construct the full URL with the server base URL
  return `http://localhost:3001${imagePath}`
}

onMounted(() => {
  // Debug route information
  console.log('SpotDetails mounted')
  console.log('Route params:', route.params)
  console.log('Route params id:', route.params.id)
  console.log('Route params id type:', typeof route.params.id)
  console.log('Full route:', route)
  
  fetchSpot()
})
</script> 