import { test, expect } from '@playwright/test'
import { testConfig } from './test-config'

test.describe('Authentication', () => {
  // Most auth tests need to run without authentication
  test.describe('Unauthenticated Tests', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ page }) => {
      await page.goto(testConfig.baseUrl)
    })

    test('should display login and signup buttons when not authenticated', async ({ page }) => {
      // Check that login and signup buttons are visible
      await expect(page.locator('a:has-text("Login")')).toBeVisible()
      await expect(page.locator('a:has-text("Sign Up")')).toBeVisible()
      
      // Check that profile link is not visible when logged out - use nav specific selector
      await expect(page.locator('nav a:has-text("Profile")')).not.toBeVisible()
    })

    test('should register a new user successfully', async ({ page }) => {
      // Navigate to registration page
      await page.click('a:has-text("Sign Up")')
      
      // Verify we're on the registration page
      await expect(page.locator('h1, h2')).toContainText('Create your account')
      
      // Generate unique email using timestamp to avoid conflicts
      const timestamp = Date.now()
      const uniqueEmail = `test+${timestamp}@example.com`
      
      // Fill registration form
      await page.fill('input[name="name"], input[type="text"]', 'Test User')
      await page.fill('input[name="email"], input[type="email"]', uniqueEmail)
      await page.fill('input[name="password"], input[type="password"]', 'TestPassword123!')
      
      // Submit registration
      await page.click('button:has-text("Create account")')
      
      // Verify successful registration - user should be redirected and logged in
      await expect(page).toHaveURL(testConfig.baseUrl + '/')
      await expect(page.locator('nav a:has-text("Profile")')).toBeVisible()
      await expect(page.locator('a:has-text("Login")')).not.toBeVisible()
      await expect(page.locator('a:has-text("Sign Up")')).not.toBeVisible()
    })

    test('should login with demo user account', async ({ page }) => {
      // Navigate to login page
      await page.click('a:has-text("Login")')
      
      // Verify we're on the login page
      await expect(page.locator('h1, h2')).toContainText('Sign in to your account')
      
      // Fill login form with demo account
      await page.fill('input[name="email"], input[type="email"]', testConfig.demoUser.email)
      await page.fill('input[name="password"], input[type="password"]', testConfig.demoUser.password)
      
      // Submit login
      await page.click('button:has-text("Sign in")')
      
      // Verify successful login
      await expect(page).toHaveURL(testConfig.baseUrl + '/')
      await expect(page.locator('nav a:has-text("Profile")')).toBeVisible()
      await expect(page.locator('a:has-text("Login")')).not.toBeVisible()
    })

    test('should logout successfully', async ({ page }) => {
      // First login
      await page.click('a:has-text("Login")')
      await page.fill('input[name="email"], input[type="email"]', testConfig.demoUser.email)
      await page.fill('input[name="password"], input[type="password"]', testConfig.demoUser.password)
      await page.click('button:has-text("Sign in")')
      
      // Verify logged in
      await expect(page.locator('nav a:has-text("Profile")')).toBeVisible()
      
      // Navigate to profile and logout
      await page.click('nav a:has-text("Profile")')
      await expect(page.locator('button:has-text("Sign Out")')).toBeVisible()
      await page.click('button:has-text("Sign Out")')
      
      // Verify logout - should see login/signup buttons again and be redirected to home
      await expect(page).toHaveURL(testConfig.baseUrl + '/')
      await expect(page.locator('a:has-text("Login")')).toBeVisible()
      await expect(page.locator('a:has-text("Sign Up")')).toBeVisible()
      await expect(page.locator('nav a:has-text("Profile")')).not.toBeVisible()
      
      // Footer should change from "My Profile" back to "Join Epic Spots"
      await expect(page.locator('text=Join Epic Spots')).toBeVisible()
    })

    test('should stay on login page with invalid credentials', async ({ page }) => {
      // Navigate to login page
      await page.click('a:has-text("Login")')
      
      // Try to login with invalid credentials
      await page.fill('input[name="email"], input[type="email"]', 'invalid@example.com')
      await page.fill('input[name="password"], input[type="password"]', 'wrongpassword')
      await page.click('button:has-text("Sign in")')
      
      // Should stay on login page
      await expect(page.locator('h1, h2')).toContainText('Sign in to your account')
    })

    test('should display demo accounts information on login page', async ({ page }) => {
      await page.click('a:has-text("Login")')
      
      // Check that demo accounts are displayed
      await expect(page.locator('text=Demo accounts')).toBeVisible()
      await expect(page.locator(`text=${testConfig.demoUser.email} / ${testConfig.demoUser.password} (User)`)).toBeVisible()
      await expect(page.locator(`text=${testConfig.demoOwner.email} / ${testConfig.demoOwner.password} (Owner)`)).toBeVisible()
    })

    test('should navigate between login and signup pages', async ({ page }) => {
      // Go to login page
      await page.click('a:has-text("Login")')
      await expect(page.locator('h1, h2')).toContainText('Sign in to your account')
      
      // Check link to registration
      await expect(page.locator('a:has-text("create a new account")')).toBeVisible()
      await page.click('a:has-text("create a new account")')
      await expect(page.locator('h1, h2')).toContainText('Create your account')
      
      // Check link back to login
      await expect(page.locator('a:has-text("sign in to your existing account")')).toBeVisible()
      await page.click('a:has-text("sign in to your existing account")')
      await expect(page.locator('h1, h2')).toContainText('Sign in to your account')
    })
  })

  // Test that requires owner authentication
  test.describe('Owner Dashboard Access', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('should login as owner and verify dashboard access', async ({ page }) => {
      await page.goto(testConfig.baseUrl)
      
      // Navigate to login page
      await page.click('a:has-text("Login")')
      
      // Login with owner demo account
      await page.fill('input[name="email"], input[type="email"]', testConfig.demoOwner.email)
      await page.fill('input[name="password"], input[type="password"]', testConfig.demoOwner.password)
      await page.click('button:has-text("Sign in")')
      
      // Verify successful login and owner dashboard access
      await page.getByRole('link', { name: 'Profile', exact: true }).click();
      await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible();
      await expect(page.getByText('Manage your account and view')).toBeVisible();
      await expect(page.getByText('Account Type')).toBeVisible();
      await expect(page.getByText('Spot Owner')).toBeVisible();
      await expect(page.getByRole('link', { name: 'Owner Dashboard' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Edit Profile' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Change Password' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();
    })
  })
}) 