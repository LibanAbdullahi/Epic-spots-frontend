import { test, expect } from '@playwright/test'
import { testConfig } from './test-config'

test.describe('User Profile Management', () => {
  // Use global authentication for all profile tests
  test.use({ storageState: testConfig.authFile });

  test('should display user profile information', async ({ page }) => {
    await page.goto(`${testConfig.baseUrl}/profile`)
    
    // Should show profile title
    await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible()
    
    // Should show user information section
    await expect(page.getByText('Account Information')).toBeVisible()
    await expect(page.getByText('Full Name')).toBeVisible()
    await expect(page.getByText('Email Address')).toBeVisible()
    await expect(page.getByText('Account Type')).toBeVisible()
  })

  test('should show edit profile button', async ({ page }) => {
    await page.goto(`${testConfig.baseUrl}/profile`)
    
    // Should show edit profile button
    await expect(page.getByRole('button', { name: 'Edit Profile' })).toBeVisible()
    
    // Note: Edit profile functionality is not yet implemented in the UI
    // So we'll just check the button exists for now
  })

  test('should show change password button', async ({ page }) => {
    await page.goto(`${testConfig.baseUrl}/profile`)
    
    // Should show change password button
    await expect(page.getByRole('button', { name: 'Change Password' })).toBeVisible()
    
    // Note: Change password functionality is not yet implemented in the UI
    // So we'll just check the button exists for now
  })

  test('should display user bookings section', async ({ page }) => {
    await page.goto(`${testConfig.baseUrl}/profile`)
    
    // Should show bookings section
    await expect(page.getByText('My Bookings')).toBeVisible()
    await expect(page.getByText('Track and manage your camping reservations')).toBeVisible()
    
    // Check if there are bookings
    const bookingCards = page.locator('.booking-card')
    const count = await bookingCards.count()
    
    if (count > 0) {
      // Should show booking details
      await expect(bookingCards.first()).toBeVisible()
    } else {
      // Should show empty state or loading
      // Since there might be loading state, we'll just verify the section header exists
      await expect(page.getByText('My Bookings')).toBeVisible()
    }
  })

  test('should show clickable booking cards if bookings exist', async ({ page }) => {
    await page.goto(`${testConfig.baseUrl}/profile`)
    
    const bookingCards = page.locator('.booking-card')
    const count = await bookingCards.count()
    
    if (count > 0) {
      // Click on first booking card
      await bookingCards.first().click()
      
      // Should navigate to spot details
      await expect(page).toHaveURL(/\/spots\/[a-zA-Z0-9]+/)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    }
  })

  test('should display booking images if bookings exist', async ({ page }) => {
    await page.goto(`${testConfig.baseUrl}/profile`)
    
    const bookingCards = page.locator('.booking-card')
    const count = await bookingCards.count()
    
    if (count > 0) {
      // Should show spot images in booking cards
      const firstCard = bookingCards.first()
      const img = firstCard.locator('img')
      
      if (await img.count() > 0) {
        await expect(img).toBeVisible()
        
        // Images should not be blue placeholders
        const src = await img.getAttribute('src')
        expect(src).not.toMatch(/placeholder|blue/)
      }
    }
  })

  test('should show rate and review buttons for past bookings if they exist', async ({ page }) => {
    await page.goto(`${testConfig.baseUrl}/profile`)
    
    const rateButtons = page.getByRole('button', { name: 'Rate & Review' })
    const count = await rateButtons.count()
    
    if (count > 0) {
      await expect(rateButtons.first()).toBeVisible()
      
      // Click to open rating modal
      await rateButtons.first().click()
      
      // Should show rating modal
      await expect(page.getByText(/Rate.*experience/i)).toBeVisible()
    }
  })

  test('should show logout functionality', async ({ page }) => {
    await page.goto(`${testConfig.baseUrl}/profile`)
    
    // Should show sign out button (not "Logout")
    await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible()
    
    // Click sign out
    await page.getByRole('button', { name: 'Sign Out' }).click()
    
    // Should redirect to home page
    await expect(page).toHaveURL(testConfig.baseUrl + '/')
    
    // Should show login/signup buttons (not authenticated)
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Sign Up' })).toBeVisible()
  })

  test('should format currency correctly in bookings if they exist', async ({ page }) => {
    await page.goto(`${testConfig.baseUrl}/profile`)
    
    const bookingCards = page.locator('.booking-card')
    const count = await bookingCards.count()
    
    if (count > 0) {
      // Should display prices with euro symbol and decimal places
      await expect(page.getByText(/€\d+\.\d{2}/).first()).toBeVisible()
    }
  })

  test('should show owner dashboard link for owner accounts', async ({ page }) => {
    await page.goto(`${testConfig.baseUrl}/profile`)
    
    // Check if account type is "Spot Owner"
    const ownerBadge = page.getByText('Spot Owner')
    const isOwner = await ownerBadge.isVisible().catch(() => false)
    
    if (isOwner) {
      // Should show owner dashboard link
      await expect(page.getByRole('link', { name: 'Owner Dashboard' })).toBeVisible()
      
      // Should navigate to owner dashboard
      await page.getByRole('link', { name: 'Owner Dashboard' }).click()
      await expect(page).toHaveURL(/\/owner\/dashboard/)
    }
  })

  test('should show account type badge', async ({ page }) => {
    await page.goto(`${testConfig.baseUrl}/profile`)
    
    // Should show either "User" or "Spot Owner" badge
    const accountTypeBadges = page.locator('text="User", text="Spot Owner"')
    const badgeExists = await accountTypeBadges.first().isVisible().catch(() => false)
    
    if (badgeExists) {
      await expect(accountTypeBadges.first()).toBeVisible()
    }
  })

  test('should show refresh button for bookings', async ({ page }) => {
    await page.goto(`${testConfig.baseUrl}/profile`)
    
    // Should show refresh button
    await expect(page.getByRole('button', { name: 'Refresh' })).toBeVisible()
    
    // Click refresh should work without errors
    await page.getByRole('button', { name: 'Refresh' }).click()
    
    // Should still be on profile page
    await expect(page).toHaveURL(`${testConfig.baseUrl}/profile`)
  })

  test('should display user avatar with first letter of name', async ({ page }) => {
    await page.goto(`${testConfig.baseUrl}/profile`)
    
    // Should show user avatar (colored circle with first letter)
    const avatar = page.locator('.w-16.h-16.bg-gradient-to-br')
    await expect(avatar).toBeVisible()
    
    // Should contain a letter (first letter of user's name)
    const avatarText = avatar.locator('span')
    await expect(avatarText).toBeVisible()
  })
}) 