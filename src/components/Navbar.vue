<template>
  <nav class="bg-white/98 backdrop-blur-lg shadow-sm border-b border-gray-100 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="flex justify-between h-20">
        <!-- Logo and brand -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-4 group">
            <div class="w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center transform group-hover:scale-105 transition-all duration-300 shadow-lg">
              <span class="text-white font-bold text-xl">🏕️</span>
            </div>
            <div class="flex flex-col">
              <span class="text-2xl font-bold text-slate-900 tracking-tight">
                Epic Spots
              </span>
              <span class="text-xs text-slate-500 font-medium tracking-wide">
                DISCOVER • EXPLORE • CAMP
              </span>
            </div>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-2">
          <router-link 
            to="/" 
            class="nav-link-clean"
          >
            Home
          </router-link>

          <!-- Authenticated user menu -->
          <div v-if="authStore.isAuthenticated" class="flex items-center space-x-2">
            <router-link 
              to="/profile" 
              class="nav-link-clean"
            >
              Profile
            </router-link>

            <!-- Owner-only links -->
            <router-link 
              v-if="authStore.isOwner"
              to="/owner/dashboard" 
              class="nav-link-clean"
            >
              Dashboard
            </router-link>
          </div>

          <!-- Guest menu -->
          <div v-else class="flex items-center space-x-3">
            <router-link 
              to="/login" 
              class="nav-link-clean"
            >
              Login
            </router-link>
            <router-link 
              to="/register" 
              class="btn-register"
            >
              Sign Up
            </router-link>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden flex items-center">
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="p-3 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all duration-200"
          >
            <svg v-if="!mobileMenuOpen" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div 
        v-if="mobileMenuOpen" 
        class="md:hidden animate-slide-up border-t border-gray-100 bg-white"
      >
        <div class="px-4 pt-4 pb-6 space-y-2">
          <router-link 
            to="/" 
            class="mobile-nav-link-clean"
            @click="mobileMenuOpen = false"
          >
            Home
          </router-link>

          <div v-if="authStore.isAuthenticated" class="space-y-2">
            <router-link 
              to="/profile" 
              class="mobile-nav-link-clean"
              @click="mobileMenuOpen = false"
            >
              Profile
            </router-link>

            <router-link 
              v-if="authStore.isOwner"
              to="/owner/dashboard" 
              class="mobile-nav-link-clean"
              @click="mobileMenuOpen = false"
            >
              Dashboard
            </router-link>
          </div>

          <div v-else class="space-y-3 pt-2 border-t border-gray-100">
            <router-link 
              to="/login" 
              class="mobile-nav-link-clean"
              @click="mobileMenuOpen = false"
            >
              Login
            </router-link>
            <router-link 
              to="/register" 
              class="btn-register w-full text-center block"
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

<style scoped>
.nav-link-clean {
  @apply px-6 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200 relative;
}

.nav-link-clean.router-link-active {
  @apply bg-slate-100 text-slate-900;
}

.mobile-nav-link-clean {
  @apply flex items-center px-4 py-4 rounded-xl text-base font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200;
}

.mobile-nav-link-clean.router-link-active {
  @apply bg-slate-100 text-slate-900;
}

.btn-register {
  @apply px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-blue-500/25;
}
</style> 