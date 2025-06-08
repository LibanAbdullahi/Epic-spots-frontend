<template>
  <footer class="bg-slate-900 text-white">
    <!-- Main Footer Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        <!-- Brand Section -->
        <div class="lg:col-span-1">
          <div class="flex items-center space-x-3 mb-6">
            <div class="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center">
              <span class="text-white font-bold text-xl">🏕️</span>
            </div>
            <div class="flex flex-col">
              <span class="text-xl font-bold text-white">Epic Spots</span>
              <span class="text-xs text-slate-400 font-medium tracking-wide">
                DISCOVER • EXPLORE • CAMP
              </span>
            </div>
          </div>
          <p class="text-slate-300 text-sm leading-relaxed mb-6">
            Your gateway to extraordinary camping experiences worldwide. Discover hidden gems, connect with verified hosts, and create unforgettable memories in nature's most beautiful locations.
          </p>
          
          <!-- Social Links -->
          <div class="flex space-x-4">
            <a href="#" class="social-link" aria-label="Facebook">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="Twitter">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="Instagram">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323C6.001 8.198 7.152 7.708 8.449 7.708s2.448.49 3.323 1.416c.875.876 1.365 2.027 1.365 3.324s-.49 2.448-1.365 3.323C10.897 16.498 9.746 16.988 8.449 16.988zm7.718 0c-1.297 0-2.448-.49-3.323-1.297c-.875-.875-1.365-2.026-1.365-3.323s.49-2.448 1.365-3.323c.875-.926 2.026-1.416 3.323-1.416s2.448.49 3.323 1.416c.875.875 1.365 2.026 1.365 3.323s-.49 2.448-1.365 3.323C18.615 16.498 17.464 16.988 16.167 16.988z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="YouTube">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold mb-6">Quick Links</h3>
          <ul class="space-y-3">
            <li>
              <router-link to="/" class="footer-link">Home</router-link>
            </li>
            <li>
              <a href="#" class="footer-link">Browse Spots</a>
            </li>
            <li>
              <router-link v-if="!authStore.isAuthenticated" to="/register" class="footer-link">Join Epic Spots</router-link>
              <router-link v-else to="/profile" class="footer-link">My Profile</router-link>
            </li>
            <li>
              <router-link v-if="authStore.isOwner" to="/owner/dashboard" class="footer-link">Host Dashboard</router-link>
              <a v-else href="#" class="footer-link">Become a Host</a>
            </li>
          </ul>
        </div>

        <!-- Categories -->
        <div>
          <h3 class="text-lg font-semibold mb-6">Explore</h3>
          <ul class="space-y-3">
            <li>
              <a href="#" class="footer-link">🏔️ Mountain Camping</a>
            </li>
            <li>
              <a href="#" class="footer-link">🏞️ Lake Retreats</a>
            </li>
            <li>
              <a href="#" class="footer-link">🌲 Forest Hideaways</a>
            </li>
            <li>
              <a href="#" class="footer-link">🏖️ Coastal Escapes</a>
            </li>
            <li>
              <a href="#" class="footer-link">🏜️ Desert Adventures</a>
            </li>
            <li>
              <a href="#" class="footer-link">🌋 Volcanic Landscapes</a>
            </li>
          </ul>
        </div>

        <!-- Support & Legal -->
        <div>
          <h3 class="text-lg font-semibold mb-6">Support</h3>
          <ul class="space-y-3">
            <li>
              <a href="#" class="footer-link">Help Center</a>
            </li>
            <li>
              <a href="#" class="footer-link">Safety Guidelines</a>
            </li>
            <li>
              <a href="#" class="footer-link">Cancellation Policy</a>
            </li>
            <li>
              <a href="#" class="footer-link">Community Guidelines</a>
            </li>
            <li>
              <a href="#" class="footer-link">Contact Us</a>
            </li>
            <li>
              <a href="#" class="footer-link">Report Issue</a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div class="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <p class="text-slate-400 text-sm">
              © {{ currentYear }} Epic Spots. All rights reserved.
            </p>
            <div class="flex space-x-6">
              <a href="#" class="text-slate-400 hover:text-white text-sm transition-colors duration-200">Privacy Policy</a>
              <a href="#" class="text-slate-400 hover:text-white text-sm transition-colors duration-200">Terms of Service</a>
              <a href="#" class="text-slate-400 hover:text-white text-sm transition-colors duration-200">Cookie Policy</a>
            </div>
          </div>
          
          <div class="flex items-center space-x-2 text-slate-400 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
            </svg>
            <span>Crafted with 💻 for Web Programming class</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.footer-link {
  @apply text-slate-300 hover:text-white transition-colors duration-200 text-sm;
}

.social-link {
  @apply w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 hover:scale-110;
}
</style> 