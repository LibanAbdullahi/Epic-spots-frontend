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
          
          <!-- Ratings Section -->
          <div class="card mt-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold">Reviews & Ratings</h2>
              
              <!-- Average Rating Display -->
              <div v-if="spot.totalRatings && spot.totalRatings > 0" class="flex items-center space-x-2">
                <div class="flex space-x-1">
                  <svg 
                    v-for="n in 5" 
                    :key="n" 
                    :class="[
                      'w-5 h-5',
                      n <= Math.round(spot.averageRating || 0) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300 fill-current'
                    ]" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
                <span class="text-lg font-semibold">{{ spot.averageRating?.toFixed(1) }}</span>
                <span class="text-gray-600">({{ spot.totalRatings }} review{{ spot.totalRatings > 1 ? 's' : '' }})</span>
              </div>
            </div>
            
            <!-- Loading Reviews -->
            <div v-if="ratingsLoading" class="text-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p class="mt-2 text-gray-600">Loading reviews...</p>
            </div>
            
            <!-- No Reviews State -->
            <div v-else-if="!ratings.length" class="text-center py-8">
              <div class="text-gray-400 mb-4">
                <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
              <p class="text-gray-600">Be the first to share your experience at this spot!</p>
            </div>
            
            <!-- Reviews List -->
            <div v-else class="space-y-6">
              <div 
                v-for="rating in ratings" 
                :key="rating.id"
                class="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0"
              >
                <div class="flex items-start space-x-4">
                  <!-- User Avatar -->
                  <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="text-white font-semibold text-sm">
                      {{ rating.user?.name?.charAt(0).toUpperCase() || '?' }}
                    </span>
                  </div>
                  
                  <!-- Review Content -->
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <div>
                        <h4 class="font-semibold text-gray-900">{{ rating.user?.name || 'Anonymous' }}</h4>
                        <div class="flex items-center space-x-1 mt-1">
                          <div class="flex space-x-1">
                            <svg 
                              v-for="n in 5" 
                              :key="n" 
                              :class="[
                                'w-4 h-4',
                                n <= rating.rating 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300 fill-current'
                              ]" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <span class="text-sm text-gray-500">
                        {{ formatDate(rating.createdAt) }}
                      </span>
                    </div>
                    
                    <p v-if="rating.comment" class="text-gray-700 leading-relaxed">
                      {{ rating.comment }}
                    </p>
                    <p v-else class="text-gray-500 italic">
                      No comment provided
                    </p>
                  </div>
                </div>
              </div>
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
                <label for="check-in-date" class="block text-sm font-medium text-gray-700 mb-2">
                  Check-in Date
                </label>
                <input
                  id="check-in-date"
                  aria-label="Check-in Date"
                  v-model="bookingForm.dateFrom"
                  type="date"
                  required
                  :min="today"
                  class="input"
                />
              </div>
              <div>
                <label for="check-out-date" class="block text-sm font-medium text-gray-700 mb-2">
                  Check-out Date
                </label>
                <input
                  id="check-out-date"
                  aria-label="Check-out Date"
                  v-model="bookingForm.dateTo"
                  type="date"
                  required
                  :min="bookingForm.dateFrom || today"
                  class="input"
                />
              </div>
              <div>
                <label for="number-of-guests" class="block text-sm font-medium text-gray-700 mb-2">
                  Number of Guests
                </label>
                <input
                  id="number-of-guests"
                  aria-label="Number of Guests"
                  v-model.number="bookingForm.guests"
                  type="number"
                  min="1"
                  required
                  class="input"
                  placeholder="Enter number of guests"
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
              
              <div v-if="dateValidationError" class="text-red-600 text-sm">
                {{ dateValidationError }}
              </div>
              
              <button
                type="submit"
                :disabled="bookingLoading || !bookingForm.dateFrom || !bookingForm.dateTo || !isDateValid"
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
    
    <!-- Notification Toast -->
    <NotificationToast
      :show="showNotification"
      :type="notification.type"
      :title="notification.title"
      :message="notification.message"
      @close="closeNotification"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { spotsAPI, bookingsAPI, ratingsAPI } from '@/services/api'
import NotificationToast from '@/components/NotificationToast.vue'

interface Rating {
  id: string
  rating: number
  comment?: string
  createdAt: string
  user?: {
    id: string
    name: string
  }
}

interface Spot {
  id: string
  title: string
  description: string
  location: string
  price: number
  images?: string[]
  averageRating?: number
  totalRatings?: number
  ratings?: Rating[]
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

const ratings = ref<Rating[]>([])
const ratingsLoading = ref(false)

const bookingForm = reactive({
  dateFrom: '',
  dateTo: '',
  guests: 1
})

const bookingLoading = ref(false)
const bookingError = ref('')

// Notification state
const showNotification = ref(false)
const notification = ref({
  type: 'info' as 'success' | 'error' | 'info',
  title: '',
  message: ''
})

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

// Add date validation computed property
const isDateValid = computed(() => {
  if (!bookingForm.dateFrom || !bookingForm.dateTo) return true // Allow empty dates
  const checkIn = new Date(bookingForm.dateFrom)
  const checkOut = new Date(bookingForm.dateTo)
  return checkOut > checkIn
})

// Add validation error message computed property
const dateValidationError = computed(() => {
  if (!bookingForm.dateFrom || !bookingForm.dateTo) return ''
  if (!isDateValid.value) {
    return 'Check-out date must be after check-in date'
  }
  return ''
})

const currentImageIndex = ref(0)

const fetchSpot = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await spotsAPI.getById(route.params.id as string)
    spot.value = response.data.spot
    // Fetch ratings after spot is loaded
    await fetchRatings()
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to fetch spot details'
  } finally {
    loading.value = false
  }
}

const fetchRatings = async () => {
  if (!route.params.id) return
  
  ratingsLoading.value = true
  try {
    const response = await ratingsAPI.getSpotRatings(route.params.id as string)
    ratings.value = response.data.ratings
  } catch (err: any) {
    console.error('Failed to fetch ratings:', err)
    // Don't show error for ratings, just log it
  } finally {
    ratingsLoading.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
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
    
    // Show success notification
    showSuccess('Booking successful!', 'Check your profile for booking details.')
    
    // Navigate to profile after a short delay
    setTimeout(() => {
      router.push('/profile')
    }, 2000)
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

const showSuccess = (title: string, message: string) => {
  notification.value = { type: 'success', title, message }
  showNotification.value = true
}

const showError = (title: string, message: string) => {
  notification.value = { type: 'error', title, message }
  showNotification.value = true
}

const closeNotification = () => {
  showNotification.value = false
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