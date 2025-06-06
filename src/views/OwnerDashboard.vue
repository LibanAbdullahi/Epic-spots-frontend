<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Owner Dashboard</h1>
        <p class="text-gray-600">Manage your camping spots and bookings</p>
      </div>
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="card text-center">
          <div class="text-3xl font-bold text-primary-600 mb-2">{{ mySpots.length }}</div>
          <div class="text-gray-600">Total Spots</div>
        </div>
        <div class="card text-center">
          <div class="text-3xl font-bold text-accent-600 mb-2">{{ totalBookings }}</div>
          <div class="text-gray-600">Total Bookings</div>
        </div>
        <div class="card text-center">
          <div class="text-3xl font-bold text-green-600 mb-2">€{{ totalRevenue }}</div>
          <div class="text-gray-600">Total Revenue</div>
        </div>
      </div>
      
      <!-- Tabs -->
      <div class="mb-6">
        <nav class="flex space-x-8">
          <button
            @click="activeTab = 'spots'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'spots' 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            My Spots
          </button>
          <button
            @click="activeTab = 'bookings'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'bookings' 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Bookings
          </button>
        </nav>
      </div>
      
      <!-- My Spots Tab -->
      <div v-if="activeTab === 'spots'" class="space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">My Camping Spots</h2>
          <button @click="showCreateSpot = true" class="btn btn-primary">
            Add New Spot
          </button>
        </div>
        
        <!-- Loading State -->
        <div v-if="spotsLoading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p class="mt-2 text-gray-600">Loading spots...</p>
        </div>
        
        <!-- Spots Grid -->
        <div v-else-if="mySpots.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="spot in mySpots" :key="spot.id" class="card">
            <div class="h-32 relative rounded-lg mb-4 overflow-hidden">
              <img 
                v-if="spot.images && spot.images.length > 0" 
                :src="getImageUrl(spot.images[0])" 
                :alt="spot.title"
                class="w-full h-full object-cover"
              />
              <div v-else class="h-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                <svg class="w-12 h-12 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path>
                </svg>
              </div>
              
              <!-- Image count indicator -->
              <div v-if="spot.images && spot.images.length > 1" class="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs">
                {{ spot.images.length }} photos
              </div>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">{{ spot.title }}</h3>
            <p class="text-gray-600 text-sm mb-2">{{ spot.location }}</p>
            <div class="flex justify-between items-center mb-4">
              <span class="text-lg font-bold text-primary-600">€{{ spot.price }}/night</span>
              <span class="text-sm text-gray-500">{{ getSpotBookingsCount(spot.id) }} bookings</span>
            </div>
            <div class="flex space-x-2">
              <button 
                @click="editSpot(spot)" 
                class="flex-1 text-sm px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Edit
              </button>
              <button 
                @click="deleteSpot(spot.id)" 
                class="flex-1 text-sm px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No spots yet</h3>
          <p class="text-gray-600 mb-4">Create your first camping spot to get started!</p>
          <button @click="showCreateSpot = true" class="btn btn-primary">Add New Spot</button>
        </div>
      </div>
      
      <!-- Bookings Tab -->
      <div v-if="activeTab === 'bookings'" class="space-y-6">
        <h2 class="text-xl font-semibold">Bookings for My Spots</h2>
        
        <!-- Loading State -->
        <div v-if="bookingsLoading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p class="mt-2 text-gray-600">Loading bookings...</p>
        </div>
        
        <!-- Bookings List -->
        <div v-else-if="spotBookings.length > 0" class="space-y-4">
          <div v-for="booking in spotBookings" :key="booking.id" class="card">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900">{{ booking.spot?.title }}</h3>
                <p class="text-gray-600 text-sm mb-2">Booked by: {{ booking.user?.name }}</p>
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span>{{ formatDate(booking.dateFrom) }} - {{ formatDate(booking.dateTo) }}</span>
                </div>
              </div>
              <div class="text-right">
                <div class="font-semibold text-green-600">
                  €{{ calculateBookingTotal(booking) }}
                </div>
                <div class="text-sm text-gray-600">
                  {{ calculateBookingNights(booking) }} night(s)
                </div>
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
          <p class="text-gray-600">Your spots haven't been booked yet.</p>
        </div>
      </div>
    </div>
    
    <!-- Create Spot Modal -->
    <CreateSpotModal
      v-if="showCreateSpot"
      @close="showCreateSpot = false"
      @created="handleSpotCreated"
    />
    
    <!-- Edit Spot Modal -->
    <EditSpotModal
      v-if="showEditSpot && editingSpot"
      :spot="editingSpot"
      @close="showEditSpot = false"
      @updated="handleSpotUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { spotsAPI, usersAPI } from '@/services/api'
import CreateSpotModal from '@/components/CreateSpotModal.vue'
import EditSpotModal from '@/components/EditSpotModal.vue'

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

interface Booking {
  id: string
  dateFrom: string
  dateTo: string
  spotId: string
  user?: {
    name: string
  }
  spot?: {
    title: string
    price: number
  }
}

const activeTab = ref('spots')
const showCreateSpot = ref(false)
const showEditSpot = ref(false)
const editingSpot = ref<Spot | null>(null)

// Data
const mySpots = ref<Spot[]>([])
const spotBookings = ref<Booking[]>([])
const spotsLoading = ref(false)
const bookingsLoading = ref(false)

// Computed
const totalBookings = computed(() => spotBookings.value?.length || 0)
const totalRevenue = computed(() => {
  if (!spotBookings.value) return 0
  return spotBookings.value.reduce((sum: number, booking: Booking) => {
    return sum + calculateBookingTotal(booking)
  }, 0)
})

const getSpotBookingsCount = (spotId: string) => {
  if (!spotBookings.value) return 0
  return spotBookings.value.filter((b: Booking) => b.spotId === spotId).length
}

// Methods
const fetchMySpots = async () => {
  spotsLoading.value = true
  try {
    const response = await usersAPI.getOwnerSpots()
    mySpots.value = response.data.spots
  } catch (error) {
    console.error('Failed to fetch spots:', error)
  } finally {
    spotsLoading.value = false
  }
}

const fetchSpotBookings = async () => {
  bookingsLoading.value = true
  try {
    const response = await usersAPI.getOwnerDashboard()
    spotBookings.value = response.data.bookings
  } catch (error) {
    console.error('Failed to fetch bookings:', error)
  } finally {
    bookingsLoading.value = false
  }
}

const handleSpotCreated = () => {
  showCreateSpot.value = false
  fetchMySpots()
}

const editSpot = (spot: Spot) => {
  editingSpot.value = spot
  showEditSpot.value = true
}

const handleSpotUpdated = () => {
  showEditSpot.value = false
  editingSpot.value = null
  fetchMySpots()
}

const deleteSpot = async (spotId: string) => {
  if (!confirm('Are you sure you want to delete this spot?')) return
  
  try {
    await spotsAPI.delete(spotId)
    mySpots.value = mySpots.value.filter((s: Spot) => s.id !== spotId)
  } catch (error: any) {
    alert(error.response?.data?.error || 'Failed to delete spot')
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const calculateBookingNights = (booking: Booking) => {
  const start = new Date(booking.dateFrom)
  const end = new Date(booking.dateTo)
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

const calculateBookingTotal = (booking: Booking) => {
  const nights = calculateBookingNights(booking)
  return nights * (booking.spot?.price || 0)
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
  fetchMySpots()
  fetchSpotBookings()
})
</script> 