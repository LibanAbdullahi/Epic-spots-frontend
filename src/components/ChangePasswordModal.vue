<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4 animate-scale-in">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-semibold text-gray-900">Change Password</h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleChangePassword" class="space-y-4">
        <div>
          <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <input
            id="currentPassword"
            v-model="form.currentPassword"
            type="password"
            required
            class="input"
            placeholder="Enter your current password"
          />
        </div>

        <div>
          <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            id="newPassword"
            v-model="form.newPassword"
            type="password"
            required
            minlength="6"
            class="input"
            placeholder="Enter your new password (min 6 characters)"
          />
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            required
            class="input"
            placeholder="Confirm your new password"
          />
        </div>

        <div v-if="error" class="text-red-600 text-sm">
          {{ error }}
        </div>

        <div class="flex space-x-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 btn btn-primary"
          >
            <span v-if="loading">Changing...</span>
            <span v-else>Change Password</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { authService } from '@/services/authService'

interface Props {
  show: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  success: [message: string]
  error: [message: string]
}>()

const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')

// Reset form when modal is closed
watch(() => props.show, (newShow) => {
  if (!newShow) {
    form.currentPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
    error.value = ''
  }
})

const handleChangePassword = async () => {
  error.value = ''

  // Validation
  if (form.newPassword !== form.confirmPassword) {
    error.value = 'New passwords do not match'
    return
  }

  if (form.newPassword.length < 6) {
    error.value = 'New password must be at least 6 characters long'
    return
  }

  if (form.newPassword === form.currentPassword) {
    error.value = 'New password must be different from current password'
    return
  }

  loading.value = true

  try {
    await authService.changePassword(form.currentPassword, form.newPassword)
    emit('success', 'Password changed successfully!')
    emit('close')
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to change password'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.animate-scale-in {
  animation: scaleIn 0.2s ease-out;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style> 