<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Forgot your password?
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>
      
      <form @submit.prevent="handleForgotPassword" class="mt-8 space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="input mt-1"
            placeholder="Enter your email address"
            :disabled="loading || emailSent"
          />
        </div>
        
        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>
        
        <div v-if="emailSent" class="bg-green-50 border border-green-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">
                Email sent successfully!
              </h3>
              <div class="mt-2 text-sm text-green-700">
                <p>If an account with that email exists, we have sent a password reset link. Please check your email.</p>
              </div>
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          :disabled="loading || emailSent"
          class="btn btn-primary w-full"
        >
          <span v-if="loading">Sending...</span>
          <span v-else-if="emailSent">Email Sent</span>
          <span v-else>Send Reset Link</span>
        </button>
        
        <div class="text-center">
          <router-link to="/login" class="text-sm text-primary-600 hover:text-primary-500">
            Back to Sign In
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { authAPI } from '@/services/api'

const email = ref('')
const loading = ref(false)
const error = ref('')
const emailSent = ref(false)

const handleForgotPassword = async () => {
  loading.value = true
  error.value = ''
  
  try {
    await authAPI.forgotPassword(email.value)
    emailSent.value = true
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to send reset email'
  } finally {
    loading.value = false
  }
}
</script> 