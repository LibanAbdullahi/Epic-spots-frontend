<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center" @click.self="cancel">
    <div class="relative bg-white rounded-lg shadow-xl max-w-md mx-auto p-6" data-testid="confirmation-modal">
      <div class="mb-4">
        <div class="flex items-center mb-3">
          <div class="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 class="ml-3 text-lg font-medium text-gray-900">{{ title || 'Confirm Action' }}</h3>
        </div>
        <p class="text-sm text-gray-500">{{ message }}</p>
      </div>
      
      <div class="flex justify-end space-x-3">
        <button
          @click="cancel"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors"
          data-testid="cancel-button"
        >
          {{ cancelText || 'Cancel' }}
        </button>
        <button
          @click="confirm"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
          data-testid="confirm-button"
        >
          {{ confirmText || 'Confirm' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
}

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const confirm = () => {
  emit('confirm')
}

const cancel = () => {
  emit('cancel')
}
</script> 