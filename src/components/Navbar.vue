<template>
  <nav class="bg-white shadow-lg border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and brand -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">🏕️</span>
            </div>
            <span class="text-xl font-bold text-gray-900">Epic Spots</span>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link 
            to="/" 
            class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Home
          </router-link>

          <!-- Authenticated user menu -->
          <div v-if="authStore.isAuthenticated" class="flex items-center space-x-4">
            <router-link 
              to="/profile" 
              class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Profile
            </router-link>

            <!-- Owner-only links -->
            <router-link 
              v-if="authStore.isOwner"
              to="/owner/dashboard" 
              class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Dashboard
            </router-link>

            <!-- User info and logout -->
            <div class="flex items-center space-x-3">
              <span class="text-sm text-gray-600">
                Hello, {{ authStore.user?.name }}
              </span>
              <button 
                @click="handleLogout"
                class="btn btn-secondary text-sm"
              >
                Logout
              </button>
            </div>
          </div>

          <!-- Guest menu -->
          <div v-else class="flex items-center space-x-4">
            <router-link 
              to="/login" 
              class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Login
            </router-link>
            <router-link 
              to="/register" 
              class="btn btn-primary text-sm"
            >
              Sign Up
            </router-link>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden flex items-center">
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
          <router-link 
            to="/" 
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
            @click="mobileMenuOpen = false"
          >
            Home
          </router-link>

          <div v-if="authStore.isAuthenticated">
            <router-link 
              to="/profile" 
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              @click="mobileMenuOpen = false"
            >
              Profile
            </router-link>

            <router-link 
              v-if="authStore.isOwner"
              to="/owner/dashboard" 
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              @click="mobileMenuOpen = false"
            >
              Dashboard
            </router-link>

            <div class="px-3 py-2">
              <p class="text-sm text-gray-600 mb-2">Hello, {{ authStore.user?.name }}</p>
              <button 
                @click="handleLogout"
                class="btn btn-secondary w-full text-sm"
              >
                Logout
              </button>
            </div>
          </div>

          <div v-else>
            <router-link 
              to="/login" 
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              @click="mobileMenuOpen = false"
            >
              Login
            </router-link>
            <router-link 
              to="/register" 
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              @click="mobileMenuOpen = false"
            >
              Sign Up
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const mobileMenuOpen = ref(false)

const handleLogout = () => {
  authStore.logout()
  mobileMenuOpen.value = false
  router.push('/')
}
</script> 