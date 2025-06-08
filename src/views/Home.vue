<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="relative gradient-bg text-white overflow-hidden">
      <!-- Background pattern -->
      <div class="absolute inset-0 opacity-10">
        <svg class="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M20 20m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" stroke="currentColor" stroke-width="0.5" fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-pattern)" />
        </svg>
      </div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div class="text-center animate-fade-in">
          <div class="mb-8">
            <span class="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Explore the World's Best Camping
            </span>
          </div>
          
          <h1 class="text-5xl md:text-7xl font-bold mb-8 text-shadow leading-tight">
            Epic Camping
            <span class="block bg-gradient-to-r from-accent-300 to-accent-100 bg-clip-text text-transparent">
              Adventures
            </span>
          </h1>
          
          <p class="text-xl md:text-2xl mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed">
            From pristine mountain peaks to serene lakeshores and enchanting forests - discover extraordinary camping experiences around the world
          </p>
          
          <!-- Enhanced Search Bar -->
          <div class="max-w-2xl mx-auto mb-8">
            <div class="relative">
              <div class="glass-effect rounded-2xl p-2 shadow-2xl">
                <div class="flex items-center">
                  <div class="flex-1 relative">
                    <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <input
                      v-model="searchQuery"
                      type="text"
                      placeholder="Search by location, name, or description..."
                      class="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-300 border-0 text-lg placeholder-gray-500"
                      @keypress.enter="searchSpots"
                    />
                  </div>
                  <button
                    @click="searchSpots"
                    class="ml-2 px-8 py-4 bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Hero Stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div class="glass-effect rounded-xl p-6 text-center">
              <div class="text-3xl font-bold mb-2">{{ spots.length }}+</div>
              <div class="text-white/80">Global Destinations</div>
            </div>
            <div class="glass-effect rounded-xl p-6 text-center">
              <div class="text-3xl font-bold mb-2">100%</div>
              <div class="text-white/80">Verified Hosts</div>
            </div>
            <div class="glass-effect rounded-xl p-6 text-center">
              <div class="text-3xl font-bold mb-2">24/7</div>
              <div class="text-white/80">Support</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Decorative elements -->
      <div class="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
      <div class="absolute bottom-10 right-10 w-32 h-32 bg-accent-300/20 rounded-full blur-2xl"></div>
    </div>

    <!-- Spots Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <!-- Section Header -->
      <div class="text-center mb-12 animate-slide-up">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">
          {{ searchQuery ? 'Search Results' : 'Featured Camping Spots' }}
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          {{ searchQuery 
            ? `Found ${filteredSpots.length} spot${filteredSpots.length !== 1 ? 's' : ''} matching "${searchQuery}"`
            : 'Discover extraordinary camping destinations worldwide, each offering unique experiences and breathtaking natural beauty'
          }}
        </p>
        
        <!-- Filter and Actions Section -->
        <div class="flex flex-col md:flex-row justify-center items-center mt-8 space-y-4 md:space-y-0 md:space-x-6">
          <!-- Filter buttons -->
          <div class="flex items-center space-x-1 bg-white rounded-xl p-1 shadow-sm border border-gray-200">
            <button 
              @click="searchQuery = ''"
              :class="[
                'px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200',
                !searchQuery ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              ]"
            >
              All Spots
            </button>
            <button 
              @click="searchQuery = 'Mountain'"
              :class="[
                'px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200',
                searchQuery === 'Mountain' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              ]"
            >
              Mountains
            </button>
            <button 
              @click="searchQuery = 'Lake'"
              :class="[
                'px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200',
                searchQuery === 'Lake' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              ]"
            >
              Lakes
            </button>
            <button 
              @click="searchQuery = 'Forest'"
              :class="[
                'px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200',
                searchQuery === 'Forest' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              ]"
            >
              Forests
            </button>
          </div>
          
          <!-- Add Spot Button for owners -->
          <div v-if="authStore.isOwner">
            <button
              @click="showCreateSpot = true"
              class="inline-flex items-center px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all duration-200 shadow-sm hover:shadow-md group"
            >
              <div class="w-5 h-5 mr-2 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-200 transition-colors duration-200">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              Add Spot
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <div class="relative">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent mx-auto"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path>
            </svg>
          </div>
        </div>
        <p class="mt-6 text-gray-600 font-medium text-lg">Discovering extraordinary destinations worldwide...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-16">
        <div class="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
          <svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-lg font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <button @click="fetchSpots" class="btn btn-primary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Try Again
          </button>
        </div>
      </div>

      <!-- Map and Spots Toggle -->
      <div v-if="filteredSpots.length > 0" class="mb-8">
        <div class="flex justify-center space-x-1 bg-white rounded-xl p-1 shadow-sm border border-gray-200 max-w-xs mx-auto">
          <button 
            @click="viewMode = 'grid'"
            :class="[
              'px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200',
              viewMode === 'grid' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            ]"
          >
            Grid View
          </button>
          <button 
            @click="viewMode = 'map'"
            :class="[
              'px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200',
              viewMode === 'map' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            ]"
          >
            Map View
          </button>
        </div>
      </div>

      <!-- Map View -->
      <div v-if="filteredSpots.length > 0 && viewMode === 'map'" class="animate-fade-in">
        <MapComponent 
          :spots="filteredSpots" 
          height="600px"
          @spot-click="handleMapSpotClick"
        />
      </div>

      <!-- Spots Grid -->
      <div v-else-if="filteredSpots.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
        <CampingCard
          v-for="spot in filteredSpots"
          :key="spot.id"
          :spot="spot"
          @click="$router.push(`/spots/${spot.id}`)"
          @edit="handleEditSpot"
          @delete="handleDeleteSpot"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 max-w-lg mx-auto">
          <div class="text-gray-400 mb-6">
            <svg class="mx-auto h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 class="text-2xl font-semibold text-gray-900 mb-4">
            {{ searchQuery ? 'No spots found' : 'No camping spots available' }}
          </h3>
          <p class="text-gray-600 mb-8">
            {{ searchQuery 
              ? 'Try adjusting your search terms or browse all spots' 
              : 'Be the first to add an amazing camping spot!'
            }}
          </p>
          <div class="space-y-3">
            <button v-if="searchQuery" @click="searchQuery = ''" class="btn btn-secondary mr-3">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Clear Search
            </button>
            <button v-if="authStore.isOwner" @click="showCreateSpot = true" class="inline-flex items-center px-6 py-3 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
              <div class="w-5 h-5 mr-2 bg-white/20 rounded-lg flex items-center justify-center">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              Add Your Spot
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="bg-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Why Choose Epic Spots?</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of adventurers discovering unique camping experiences across the globe
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Global Reach -->
          <div class="text-center group">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Worldwide Destinations</h3>
            <p class="text-gray-600">From remote mountain peaks to tropical beaches, discover camping spots in every corner of the world</p>
          </div>
          
          <!-- Verified Quality -->
          <div class="text-center group">
            <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Verified Quality</h3>
            <p class="text-gray-600">Every spot is carefully vetted and reviewed by our community to ensure exceptional experiences</p>
          </div>
          
          <!-- Easy Booking -->
          <div class="text-center group">
            <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Instant Booking</h3>
            <p class="text-gray-600">Book your perfect camping spot in seconds with our streamlined, secure booking process</p>
          </div>
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
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { spotsAPI } from '@/services/api'
import CampingCard from '@/components/CampingCard.vue'
import CreateSpotModal from '@/components/CreateSpotModal.vue'
import EditSpotModal from '@/components/EditSpotModal.vue'
import MapComponent from '@/components/MapComponent.vue'
import type { Spot } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

// State
const spots = ref<Spot[]>([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const viewMode = ref<'grid' | 'map'>('grid')
const showCreateSpot = ref(false)
const showEditSpot = ref(false)
const editingSpot = ref<Spot | null>(null)

// Computed
const filteredSpots = computed(() => {
  if (!searchQuery.value) return spots.value
  
  return spots.value.filter((spot: Spot) =>
    spot.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    spot.location.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    spot.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Methods
const fetchSpots = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await spotsAPI.getAll()
    spots.value = response.data.spots
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to fetch spots'
  } finally {
    loading.value = false
  }
}

const searchSpots = () => {
  // Search is handled by computed property
  // This function can be extended for more complex search logic
}

const handleSpotCreated = () => {
  showCreateSpot.value = false
  fetchSpots() // Refresh the list
}

const handleEditSpot = (spot: Spot) => {
  editingSpot.value = spot
  showEditSpot.value = true
}

const handleSpotUpdated = () => {
  showEditSpot.value = false
  editingSpot.value = null
  fetchSpots() // Refresh the list
}

const handleDeleteSpot = async (spotId: string) => {
  if (!confirm('Are you sure you want to delete this camping spot? This action cannot be undone.')) {
    return
  }
  
  try {
    await spotsAPI.delete(spotId)
    spots.value = spots.value.filter(spot => spot.id !== spotId)
  } catch (err: any) {
    alert(err.response?.data?.error || 'Failed to delete spot')
  }
}

const handleMapSpotClick = (spot: Spot) => {
  router.push(`/spots/${spot.id}`)
}

// Initialize
onMounted(() => {
  fetchSpots()
  authStore.initializeAuth()
})
</script> 