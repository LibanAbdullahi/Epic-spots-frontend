<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
        <p v-if="userInfo" class="mt-2 text-sm text-gray-600">
          Setting new password for {{ userInfo.email }}
        </p>
      </div>
      
      <!-- Loading state -->
      <div v-if="verifying" class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-2 text-gray-600">Verifying reset token...</p>
      </div>
      
      <!-- Invalid token -->
      <div v-else-if="!tokenValid" class="text-center space-y-4">
        <div class="text-red-600">
          <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-lg font-semibold">Invalid or Expired Link</h3>
          <p class="text-sm text-gray-600 mt-2">This password reset link is invalid or has expired.</p>
        </div>
        <router-link to="/forgot-password" class="btn btn-primary">
          Request New Reset Link
        </router-link>
      </div>
      
      <!-- Reset form -->
      <form v-else-if="!passwordReset" @submit.prevent="handleResetPassword" class="mt-8 space-y-6">
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            minlength="6"
            class="input mt-1"
            placeholder="Enter your new password (min 6 characters)"
          />
        </div>
        
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            required
            class="input mt-1"
            placeholder="Confirm your new password"
          />
        </div>
        
        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>
        
        <button
          type="submit"
          :disabled="loading"
          class="btn btn-primary w-full"
        >
          <span v-if="loading">Resetting...</span>
          <span v-else>Reset Password</span>
        </button>
      </form>
      
      <!-- Success message -->
      <div v-else class="text-center space-y-4">
        <div class="text-green-600">
          <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-lg font-semibold">Password Reset Successful!</h3>
          <p class="text-sm text-gray-600 mt-2">Your password has been successfully updated.</p>
        </div>
        <router-link to="/login" class="btn btn-primary">
          Sign In with New Password
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { authAPI } from '@/services/api'

const route = useRoute()

const form = reactive({
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const verifying = ref(true)
const error = ref('')
const tokenValid = ref(false)
const passwordReset = ref(false)
const userInfo = ref<{email: string, name: string} | null>(null)

onMounted(async () => {
  const token = route.query.token as string
  
  if (!token) {
    tokenValid.value = false
    verifying.value = false
    return
  }
  
  try {
    const response = await authAPI.verifyResetToken(token)
    tokenValid.value = true
    userInfo.value = response.data.user
  } catch (err) {
    tokenValid.value = false
  } finally {
    verifying.value = false
  }
})

const handleResetPassword = async () => {
  if (form.password !== form.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }
  
  if (form.password.length < 6) {
    error.value = 'Password must be at least 6 characters long'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    const token = route.query.token as string
    await authAPI.resetPassword(token, form.password)
    passwordReset.value = true
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to reset password'
  } finally {
    loading.value = false
  }
}
</script> 