import { FullConfig } from '@playwright/test'

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Cleaning up E2E test environment...')
  
  try {
    // Any cleanup operations can go here
    // For now, we'll just log that tests are complete
    console.log('✅ E2E tests completed successfully!')
    
  } catch (error) {
    console.error('❌ Global teardown failed:', error)
  }
}

export default globalTeardown 