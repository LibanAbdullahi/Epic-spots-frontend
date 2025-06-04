<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6">
            Discover Belgian Camping Gems
          </h1>
          <p class="text-xl md:text-2xl mb-8 text-primary-100">
            From the Ardennes forests to the North Sea coast - find your perfect Belgian camping adventure
          </p>
          <div class="max-w-md mx-auto">
            <div class="flex">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search locations..."
                class="flex-1 px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
              <button
                @click="searchSpots"
                class="px-6 py-3 bg-accent-600 hover:bg-accent-700 rounded-r-lg font-medium transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Spots Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900">Available Spots</h2>
        <div v-if="authStore.isOwner" class="flex space-x-4">
          <button
            @click="showCreateSpot = true"
            class="btn btn-primary"
          >
            Add New Spot
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading spots...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button @click="fetchSpots" class="btn btn-primary">Try Again</button>
      </div>

      <!-- Spots Grid -->
      <div v-else-if="filteredSpots.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <div v-else class="text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No camping spots found</h3>
        <p class="text-gray-600">Try adjusting your search criteria or check back later.</p>
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
import { useAuthStore } from '@/stores/auth'
import { spotsAPI } from '@/services/api'
import CampingCard from '@/components/CampingCard.vue'
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

const authStore = useAuthStore()

// State
const spots = ref<Spot[]>([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
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

// Initialize
onMounted(() => {
  fetchSpots()
  authStore.initializeAuth()
})
</script> 