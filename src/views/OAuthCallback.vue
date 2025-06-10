<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div v-if="loading" class="space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="text-gray-600">Completing authentication...</p>
      </div>
      
      <div v-else-if="error" class="space-y-4">
        <div class="text-red-600">
          <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h2 class="text-lg font-semibold">Authentication Failed</h2>
          <p class="text-sm text-gray-600 mt-2">{{ error }}</p>
        </div>
        <router-link to="/login" class="btn btn-primary">
          Try Again
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    const userParam = urlParams.get('user')
    const errorParam = urlParams.get('error')

    if (errorParam) {
      error.value = getErrorMessage(errorParam)
      loading.value = false
      return
    }

    if (!token || !userParam) {
      error.value = 'Missing authentication data'
      loading.value = false
      return
    }

    // Parse user data
    const userData = JSON.parse(decodeURIComponent(userParam))
    
    // Store auth data
    authStore.setAuthData(token, userData)
    
    // Redirect to home
    setTimeout(() => {
      router.push('/')
    }, 1000)
    
  } catch (err) {
    console.error('OAuth callback error:', err)
    error.value = 'Failed to process authentication'
  } finally {
    loading.value = false
  }
})

const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'oauth_failed':
      return 'Google authentication was cancelled or failed'
    case 'oauth_callback_failed':
      return 'Failed to complete authentication process'
    default:
      return 'An unknown error occurred during authentication'
  }
}
</script> 