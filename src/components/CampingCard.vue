<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
    <!-- Spot Image Placeholder -->
    <div class="h-48 bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
      <svg class="w-16 h-16 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path>
      </svg>
    </div>
    
    <!-- Spot Content -->
    <div class="p-6">
      <div class="flex justify-between items-start mb-2">
        <h3 class="text-xl font-semibold text-gray-900 truncate">{{ spot.title }}</h3>
        <span class="text-lg font-bold text-primary-600">${{ spot.price }}/night</span>
      </div>
      
      <div class="flex items-center text-gray-600 mb-3">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        <span class="text-sm">{{ spot.location }}</span>
      </div>
      
      <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ spot.description }}</p>
      
      <div class="flex items-center justify-between">
        <div class="flex items-center text-sm text-gray-500">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          <span>Owner: {{ spot.owner?.name || 'Unknown' }}</span>
        </div>
        
        <button class="text-primary-600 hover:text-primary-800 font-medium text-sm">
          View Details →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Spot {
  id: string
  title: string
  description: string
  location: string
  price: number
  owner?: {
    name: string
  }
}

defineProps<{
  spot: Spot
}>()
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 