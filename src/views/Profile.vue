<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p class="text-gray-600">Manage your account and view your bookings</p>
      </div>
      
      <!-- User Info Card -->
      <div class="card mb-8">
        <h2 class="text-xl font-semibold mb-4">Account Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <p class="text-gray-900">{{ authStore.user?.name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <p class="text-gray-900">{{ authStore.user?.email }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Account Type</label>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="authStore.user?.role === 'OWNER' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'">
              {{ authStore.user?.role === 'OWNER' ? 'Spot Owner' : 'User' }}
            </span>
          </div>
        </div>
        
        <div class="mt-6 flex space-x-4">
          <router-link 
            v-if="authStore.user?.role === 'OWNER'" 
            to="/owner/dashboard" 
            class="btn btn-primary"
          >
            Owner Dashboard
          </router-link>
          <button @click="authStore.logout" class="btn btn-secondary">
            Sign Out
          </button>
        </div>
      </div>
      
      <!-- Bookings Section -->
      <div class="card">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">My Bookings</h2>
          <button @click="fetchBookings" class="text-primary-600 hover:text-primary-800">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </button>
        </div>
        
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p class="mt-2 text-gray-600">Loading bookings...</p>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="text-center py-8">
          <p class="text-red-600 mb-4">{{ error }}</p>
          <button @click="fetchBookings" class="btn btn-primary">Try Again</button>
        </div>
        
        <!-- Bookings List -->
        <div v-else-if="bookings.length > 0" class="space-y-4">
          <div 
            v-for="booking in bookings" 
            :key="booking.id"
            class="border rounded-lg p-4 hover:bg-gray-50"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900">{{ booking.spot?.title }}</h3>
                <p class="text-gray-600 text-sm mb-2">{{ booking.spot?.location }}</p>
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span>{{ formatDate(booking.dateFrom) }} - {{ formatDate(booking.dateTo) }}</span>
                </div>
              </div>
              
              <div class="text-right">
                <div class="font-semibold text-primary-600">
                  ${{ calculateTotal(booking) }}
                </div>
                <div class="text-sm text-gray-600">
                  {{ calculateNights(booking) }} night{{ calculateNights(booking) > 1 ? 's' : '' }}
                </div>
                <button
                  @click="cancelBooking(booking.id)"
                  :disabled="isPastBooking(booking.dateFrom)"
                  class="text-red-600 hover:text-red-800 text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
          <p class="text-gray-600 mb-4">Start exploring amazing camping spots!</p>
          <router-link to="/" class="btn btn-primary">Browse Spots</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { bookingsAPI } from '@/services/api'

const authStore = useAuthStore()

const bookings = ref([])
const loading = ref(false)
const error = ref('')

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
    await bookingsAPI.delete(bookingId)
    bookings.value = bookings.value.filter((b: any) => b.id !== bookingId)
  } catch (err: any) {
    alert(err.response?.data?.error || 'Failed to cancel booking')
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const calculateNights = (booking: any) => {
  const start = new Date(booking.dateFrom)
  const end = new Date(booking.dateTo)
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

const calculateTotal = (booking: any) => {
  const nights = calculateNights(booking)
  return nights * (booking.spot?.price || 0)
}

const isPastBooking = (dateFrom: string) => {
  return new Date(dateFrom) < new Date()
}

onMounted(() => {
  fetchBookings()
})
</script> 