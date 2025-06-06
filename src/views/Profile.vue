<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8 animate-fade-in">
        <h1 class="text-4xl font-bold text-gray-900 mb-2 text-shadow">My Profile</h1>
        <p class="text-gray-600 text-lg">Manage your account and view your bookings</p>
      </div>
      
      <!-- User Info Card -->
      <div class="card mb-8 animate-slide-up">
        <div class="flex items-center space-x-4 mb-6">
          <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center">
            <span class="text-white text-2xl font-bold">
              {{ authStore.user?.name?.charAt(0).toUpperCase() }}
            </span>
          </div>
          <div>
            <h2 class="text-2xl font-semibold text-gray-900">Account Information</h2>
            <p class="text-gray-600">Your personal details and account settings</p>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div class="bg-gray-50 rounded-lg p-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <p class="text-lg font-semibold text-gray-900">{{ authStore.user?.name }}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <p class="text-lg font-semibold text-gray-900">{{ authStore.user?.email }}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
            <span 
              class="badge"
              :class="authStore.user?.role === 'OWNER' ? 'badge-success' : 'badge-info'"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="authStore.user?.role === 'OWNER'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              {{ authStore.user?.role === 'OWNER' ? 'Spot Owner' : 'User' }}
            </span>
          </div>
        </div>
        
        <div class="flex flex-wrap gap-3">
          <router-link 
            v-if="authStore.user?.role === 'OWNER'" 
            to="/owner/dashboard" 
            class="btn btn-primary"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            Owner Dashboard
          </router-link>
          <button @click="showEditProfile = true" class="btn btn-secondary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            Edit Profile
          </button>
          <button @click="showChangePassword = true" class="btn btn-secondary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-6 6c-3 0-5.5-1.5-5.5-4a3.5 3.5 0 117 0A6 6 0 0112 15a6 6 0 01-6-6 2 2 0 012-2m6 0V4a2 2 0 00-2-2 2 2 0 00-2 2v1a2 2 0 00-2 2"></path>
            </svg>
            Change Password
          </button>
          <button @click="authStore.logout" class="btn btn-danger">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Sign Out
          </button>
        </div>
      </div>
      
      <!-- Bookings Section -->
      <div class="card animate-slide-up">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-2xl font-semibold text-gray-900">My Bookings</h2>
            <p class="text-gray-600">Track and manage your camping reservations</p>
          </div>
          <button 
            @click="fetchBookings" 
            class="btn btn-sm btn-secondary hover-lift"
            title="Refresh bookings"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Refresh
          </button>
        </div>
        
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto"></div>
          <p class="mt-4 text-gray-600 font-medium">Loading your bookings...</p>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <div class="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
            <svg class="w-8 h-8 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-red-700 font-medium">{{ error }}</p>
          </div>
          <button @click="fetchBookings" class="btn btn-primary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Try Again
          </button>
        </div>
        
        <!-- Bookings List -->
        <div v-else-if="bookings.length > 0" class="space-y-4">
          <div 
            v-for="booking in bookings" 
            :key="booking.id"
            class="booking-card group cursor-pointer"
            @click="viewSpotDetails(booking.spot?.id)"
          >
            <div class="flex items-start space-x-4">
              <!-- Spot Image -->
              <div class="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-md group-hover:shadow-lg transition-all duration-300">
                <img 
                  v-if="booking.spot?.images && booking.spot?.images[0]"
                  :src="getImageUrl(booking.spot.images[0])" 
                  :alt="booking.spot?.title"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div v-else class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path>
                  </svg>
                </div>
              </div>
              
              <!-- Booking Details -->
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start">
                  <div class="flex-1 min-w-0">
                    <h3 class="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-200 truncate">
                      {{ booking.spot?.title }}
                    </h3>
                    <div class="flex items-center text-gray-600 mb-2">
                      <svg class="w-4 h-4 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <span class="text-sm truncate">{{ booking.spot?.location }}</span>
                    </div>
                    <div class="flex items-center text-gray-700 bg-gray-100 rounded-lg px-3 py-2 w-fit mb-2">
                      <svg class="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span class="font-medium text-sm">{{ formatDate(booking.dateFrom) }} - {{ formatDate(booking.dateTo) }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <div class="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                        <div class="text-lg font-bold text-green-700">
                          €{{ calculateTotal(booking).toFixed(2) }}
                        </div>
                        <div class="text-xs text-green-600">
                          {{ calculateNights(booking) }} night{{ calculateNights(booking) > 1 ? 's' : '' }}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Action Buttons -->
                  <div class="ml-4 flex flex-col space-y-2">
                    <button
                      @click.stop="viewSpotDetails(booking.spot?.id)"
                      class="btn btn-sm btn-secondary hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      View
                    </button>
                    <button
                      @click.stop="cancelBooking(booking.id)"
                      :disabled="isPastBooking(booking.dateFrom)"
                      class="btn btn-sm btn-danger transition-all duration-200"
                      :class="isPastBooking(booking.dateFrom) ? 'opacity-50 cursor-not-allowed' : ''"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                      {{ isPastBooking(booking.dateFrom) ? 'Past' : 'Cancel' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 max-w-md mx-auto">
            <div class="text-gray-400 mb-6">
              <svg class="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">No bookings yet</h3>
            <p class="text-gray-600 mb-6">Start exploring amazing camping spots and create your first booking!</p>
            <router-link to="/" class="btn btn-primary">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              Browse Spots
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { bookingsAPI } from '@/services/api'

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

const authStore = useAuthStore()
const router = useRouter()

const bookings = ref<Booking[]>([])
const loading = ref(false)
const error = ref('')
const showEditProfile = ref(false)
const showChangePassword = ref(false)

const fetchBookings = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await bookingsAPI.getMyBookings()
    bookings.value = response.data.bookings
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to fetch bookings'
  } finally {
    loading.value = false
  }
}

const cancelBooking = async (bookingId: number) => {
  if (!confirm('Are you sure you want to cancel this booking?')) return
  
  try {
    await bookingsAPI.cancel(bookingId.toString())
    bookings.value = bookings.value.filter((b: Booking) => b.id !== bookingId)
  } catch (err: any) {
    alert(err.response?.data?.error || 'Failed to cancel booking')
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const calculateNights = (booking: Booking) => {
  const start = new Date(booking.dateFrom)
  const end = new Date(booking.dateTo)
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

const calculateTotal = (booking: Booking) => {
  const nights = calculateNights(booking)
  return nights * (booking.spot?.price || 0)
}

const isPastBooking = (dateFrom: string) => {
  return new Date(dateFrom) < new Date()
}

const viewSpotDetails = (spotId?: string) => {
  if (spotId) {
    router.push(`/spots/${spotId}`)
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
  fetchBookings()
})
</script>

<style scoped>
.booking-card {
  @apply border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-gray-50 hover:from-blue-50 hover:to-white;
}

.booking-card:hover {
  @apply border-blue-200 transform hover:scale-[1.02];
}

.animate-slide-up {
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hover-lift:hover {
  @apply transform -translate-y-1;
}
</style> 