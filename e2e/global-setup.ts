import { chromium, FullConfig } from '@playwright/test'
import { testConfig } from './test-config'

async function globalSetup(config: FullConfig) {
  console.log('🚀 Setting up E2E test environment...')
  
  try {
    // Create a test user for authentication tests
    const browser = await chromium.launch()
    const page = await browser.newPage()
    
    try {
      // First, try to register a test user (in case it doesn't exist)
      try {
        await page.goto(`${testConfig.baseUrl}/register`)
        
        // Register test user
        await page.getByLabel('Full Name').fill(testConfig.testUser.name)
        await page.getByLabel('Email').fill(testConfig.testUser.email)
        await page.getByLabel('Password', { exact: true }).fill(testConfig.testUser.password)
        await page.getByRole('button', { name: 'Create Account' }).click()
        
        // Wait for registration to complete
        await page.waitForURL('/')
        
        console.log('👤 Test user created successfully!')
        
      } catch (error) {
        console.log('ℹ️ Test user might already exist, proceeding with login...')
      }

      // Now authenticate and save the state
      await page.goto(`${testConfig.baseUrl}/login`)
      
      // Perform authentication steps
      await page.getByLabel('Email address').fill(testConfig.testUser.email)
      await page.getByLabel('Password').fill(testConfig.testUser.password)
      await page.getByRole('button', { name: 'Sign in' }).click()
      
      // Wait until the page receives the cookies and redirects
      await page.waitForURL(testConfig.baseUrl + '/')
      
      // Verify we're logged in by checking for Profile link
      await page.locator('nav a:has-text("Profile")').waitFor()
      
      console.log('🔐 Authentication successful!')
      
      // Save the authentication state
      await page.context().storageState({ path: testConfig.authFile })
      
      console.log('💾 Authentication state saved to:', testConfig.authFile)
      
    } catch (error) {
      console.error('❌ Authentication setup failed:', error)
      throw error
    }
    
    await browser.close()
    
  } catch (error) {
    console.error('❌ Global setup failed:', error)
    throw error
  }
  
  console.log('🎉 E2E test environment ready!')
}

export default globalSetup 