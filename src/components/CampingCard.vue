<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 hover:-translate-y-2 group" data-testid="camping-card">
    <!-- Spot Image -->
    <div class="h-52 relative overflow-hidden" @click="$emit('click')">
      <img 
        v-if="spot.images && spot.images.length > 0" 
        :src="getImageUrl(spot.images[0])" 
        :alt="spot.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div v-else class="h-full bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <svg class="w-20 h-20 text-white opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path>
        </svg>
      </div>
      
      <!-- Image overlay for better text visibility -->
      <div class="image-overlay"></div>
      
      <!-- Image count indicator -->
      <div v-if="spot.images && spot.images.length > 1" class="absolute top-4 right-4 glass-effect text-white px-3 py-1 rounded-full text-sm font-medium">
        <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        {{ spot.images.length }}
      </div>
      
      <!-- Favorite button (placeholder for future feature) -->
      <button class="absolute top-4 left-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
      </button>
    </div>
    
    <!-- Spot Content -->
    <div class="p-6">
      <div class="flex justify-between items-start mb-3">
        <h3 class="text-xl font-bold text-gray-900 truncate pr-2 group-hover:text-primary-600 transition-colors duration-200">{{ spot.title }}</h3>
        <div class="text-right flex-shrink-0">
          <div class="text-2xl font-bold text-primary-600">€{{ spot.price }}</div>
          <div class="text-sm text-gray-500">per night</div>
        </div>
      </div>
      
      <div class="flex items-center text-gray-600 mb-4">
        <div class="w-5 h-5 mr-2 text-primary-500">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </div>
        <span class="text-sm font-medium">{{ spot.location }}</span>
      </div>
      
      <p class="text-gray-600 text-sm mb-5 line-clamp-2 leading-relaxed">{{ spot.description }}</p>
      
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
            <span class="text-white text-xs font-semibold">
              {{ spot.owner?.name?.charAt(0).toUpperCase() || '?' }}
            </span>
          </div>
          <div>
            <div class="text-xs text-gray-500">Hosted by</div>
            <div class="text-sm font-medium text-gray-700">{{ spot.owner?.name || 'Unknown' }}</div>
          </div>
        </div>
        
        <div class="flex items-center space-x-1">
          <!-- Edit/Delete buttons for owned spots -->
          <div v-if="canManage" class="flex space-x-1">
            <button 
              @click.stop="$emit('edit', spot)"
              class="w-8 h-8 rounded-lg bg-gray-100 hover:bg-primary-100 text-gray-600 hover:text-primary-600 flex items-center justify-center transition-all duration-200 hover:scale-110"
              title="Edit spot"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
            <button 
              @click.stop="$emit('delete', spot.id)"
              class="w-8 h-8 rounded-lg bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 flex items-center justify-center transition-all duration-200 hover:scale-110"
              title="Delete spot"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
          
          <button 
            @click="$emit('click')"
            class="btn btn-sm btn-primary ml-2"
          >
            <span class="hidden sm:inline">View Details</span>
            <svg class="w-4 h-4 sm:ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Rating stars with real data -->
      <div class="mt-4 pt-4 border-t border-gray-100">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-1">
            <div class="flex space-x-1">
              <svg 
                v-for="n in 5" 
                :key="n" 
                :class="[
                  'w-4 h-4',
                  n <= Math.round(spot.averageRating || 0) 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300 fill-current'
                ]" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <span class="text-sm text-gray-600 ml-1">
              {{ spot.averageRating ? spot.averageRating.toFixed(1) : 'No reviews' }}
              <span v-if="spot.totalRatings && spot.totalRatings > 0" class="text-gray-400">
                ({{ spot.totalRatings }} review{{ spot.totalRatings > 1 ? 's' : '' }})
              </span>
            </span>
          </div>
          <span v-if="!spot.totalRatings || spot.totalRatings === 0" class="text-xs text-gray-400">Recently added</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

interface Spot {
  id: string
  title: string
  description: string
  location: string
  price: number
  images?: string[]
  averageRating?: number
  totalRatings?: number
  owner?: {
    id?: string
    name: string
  }
}

const props = defineProps<{
  spot: Spot
}>()

const authStore = useAuthStore()

const canManage = computed(() => {
  return authStore.user && authStore.user.id === props.spot.owner?.id
})

defineEmits<{
  click: []
  edit: [spot: Spot]
  delete: [spotId: string]
}>()

const getImageUrl = (imagePath: string) => {
  // If the path already starts with http, return as is
  if (imagePath.startsWith('http')) {
    return imagePath
  }
  // Otherwise, construct the full URL with the server base URL
  return `http://localhost:3001${imagePath}`
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}
</style>