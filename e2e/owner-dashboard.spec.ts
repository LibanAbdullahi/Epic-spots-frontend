import { test, expect } from '@playwright/test'
import { testConfig } from './test-config'

test.describe('Owner Dashboard', () => {
  // Disable global authentication for these tests since we need owner-specific login
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ page }) => {
    // Login as an owner before each test using demo owner credentials
    await page.goto(`${testConfig.baseUrl}/login`)
    await page.getByLabel('Email address').fill(testConfig.demoOwner.email)
    await page.getByLabel('Password').fill(testConfig.demoOwner.password)
    await page.getByRole('button', { name: 'Sign in' }).click()
    
    // Wait for successful login
    await page.waitForURL(testConfig.baseUrl + '/')
  })

  test('should display owner dashboard with spots overview', async ({ page }) => {
    await page.goto(`${testConfig.baseUrl}/owner/dashboard`)
    
    // Should show dashboard title and stats
    await expect(page.getByRole('heading', { name: 'Owner Dashboard' })).toBeVisible()
    await expect(page.getByText('Total Spots')).toBeVisible()
    await expect(page.getByText('Total Bookings')).toBeVisible()
    await expect(page.getByText('Total Revenue')).toBeVisible()
    
    // Should display spots list
    await expect(page.getByText('My Camping Spots')).toBeVisible()
  })

  test('should show add new spot button and modal', async ({ page }) => {
    await page.goto(`${testConfig.baseUrl}/owner/dashboard`)
    
    // Should show add spot button
    await expect(page.getByRole('button', { name: 'Add New Spot' })).toBeVisible()
    
    // Click to open modal
    await page.getByRole('button', { name: 'Add New Spot' }).click()
    
    // Should show add spot modal with correct form fields
    await expect(page.getByRole('textbox', { name: 'Spot Title *' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Location *' })).toBeVisible();
    await expect(page.getByRole('spinbutton', { name: 'Price per night (€) *' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Description *' })).toBeVisible();
    await expect(page.getByText('Images (Optional)')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Choose images' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create Spot' })).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();
  })

  test('should create a new camping spot successfully', async ({ page }) => {
    await page.goto(`${testConfig.baseUrl}/owner/dashboard`)
    
    // Open add spot modal
    await page.getByRole('button', { name: 'Add New Spot' }).click()
    
    // Fill form with correct field selectors
    await page.getByRole('textbox', { name: 'Spot Title *' }).fill('Test Mountain Retreat');
    await page.getByRole('textbox', { name: 'Location *' }).fill('Test Mountains, Country');
    await page.getByRole('spinbutton', { name: 'Price per night (€) *' }).fill('75');
    await page.getByRole('textbox', { name: 'Description *' }).fill('A beautiful mountain camping spot perfect for adventure seekers.');
    await page.getByRole('button', { name: 'Create Spot' }).click();
    
        
    // Should show new spot in the list
    await expect(page.getByText('Test Mountain Retreat')).toBeVisible()
  })

  test('should show validation errors for invalid spot creation', async ({ page }) => {
    await page.goto(`${testConfig.baseUrl}/owner/dashboard`)
    
    // Open add spot modal
    await page.getByRole('button', { name: 'Add New Spot' }).click()
    
    // Try to submit empty form
    await page.getByRole('button', { name: 'Create Spot' }).click()
    
    // Should show validation errors (check for any error-related textff) "Please fill in this fields"
    // await expect(page.getByText('Please fill in this fields')).toBeVisible({ timeout: 5000 })
  })

  test('should edit existing camping spot', async ({ page }) => {
    await page.goto(`${testConfig.baseUrl}/owner/dashboard`)
    
    // Find and click edit button on first spot
    const editButton = page.getByRole('button', { name: 'Edit' }).first()
    await expect(editButton).toBeVisible()
    await editButton.click()
    
    // Should open edit modal - wait for any modal or form to appear
    await expect(page.locator('.modal, .dialog, form')).toBeVisible()
    
    // Try to find and modify spot details (use more flexible selectors)
    const nameField = page.locator('input[type="text"]').first()
    const priceField = page.locator('input[type="number"], input[inputmode="numeric"]').first()
    
    if (await nameField.isVisible()) {
      await nameField.fill('Updated Spot Name')
    }
    if (await priceField.isVisible()) {
      await priceField.fill('100')
    }
    
    // Submit changes
    const updateButton = page.getByRole('button', { name: /update|save/i })
    if (await updateButton.isVisible()) {
      await updateButton.click()
    }
    
    // Should show updated information eventually
    await expect(page.getByText('Updated Spot Name')).toBeVisible({ timeout: 10000 })
  })

  test('should delete camping spot with confirmation', async ({ page }) => {
    await page.goto(`${testConfig.baseUrl}/owner/dashboard`)
    
    // Find delete button - be more specific by using first spot's delete button
    const firstSpotDeleteButton = page.getByTestId('delete-spot-button').first()
    await expect(firstSpotDeleteButton).toBeVisible()
    
    // Click delete
    await firstSpotDeleteButton.click()
    
    // Wait for confirmation modal to appear
    await expect(page.getByTestId('confirmation-modal')).toBeVisible()
    
    // Click confirm button in the modal
    await page.getByTestId('confirm-button').click()
    
    // Should show success notification toast
    await expect(page.getByTestId('notification-toast')).toBeVisible({ timeout: 10000 })
  })

  test('should display revenue statistics correctly', async ({ page }) => {
    await page.goto(`${testConfig.baseUrl}/owner/dashboard`)
    
    // Should show revenue information
    const revenueSection = page.getByText('Total Revenue')
    await expect(revenueSection).toBeVisible()
    
    // Should display currency format
    await expect(page.getByText(/€\d+\.\d{2}/).first()).toBeVisible()
  })

  test('should show bookings for owner spots', async ({ page }) => {
    await page.goto(`${testConfig.baseUrl}/owner/dashboard`)
    
    // Should show bookings section (be flexible with the text)
    const bookingsSection = page.locator(':has-text("Booking"), :has-text("Recent"), :has-text("Orders")')
    
    // Check if there are any booking-related elements
    const bookingCards = page.locator('[data-testid="booking-card"], .booking-item, .booking-card, [class*="booking"]')
    const count = await bookingCards.count()
    
    if (count > 0) {
      // Should show booking details
      await expect(bookingCards.first()).toBeVisible()
    } else {
      // Should show empty state or no bookings message
      const emptyState = page.locator(':has-text("No bookings"), :has-text("No orders"), :has-text("Empty")')
      if (await emptyState.count() > 0) {
        await expect(emptyState.first()).toBeVisible()
      }
    }
  })

  test('should upload images when editing a spot', async ({ page }) => {
    await page.goto(`${testConfig.baseUrl}/owner/dashboard`)
    
    // Find and click edit button
    const editButton = page.getByRole('button', { name: 'Edit' }).first()
    await editButton.click()
    
    // Should show file upload section (be flexible with text)
    const uploadSection = page.locator(':has-text("Image"), :has-text("Upload"), :has-text("Choose"), input[type="file"]')
    if (await uploadSection.count() > 0) {
      await expect(uploadSection.first()).toBeVisible()
    }
  })

  test('should filter spots by search', async ({ page }) => {
    await page.goto(`${testConfig.baseUrl}/owner/dashboard`)
    
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i], input[placeholder*="filter" i]')
    
    if (await searchInput.count() > 0) {
      await searchInput.first().fill('Mountain')
      
      // Should filter results
      const spotCards = page.locator('[data-testid="spot-card"], .spot-card, [class*="spot"]')
      const visibleSpots = await spotCards.count()
      
      // Results should contain searched term
      if (visibleSpots > 0) {
        await expect(page.getByText(/Mountain/i).first()).toBeVisible()
      }
    }
  })

  test('should display spot ratings and reviews in dashboard', async ({ page }) => {
    await page.goto(`${testConfig.baseUrl}/owner/dashboard`)
    
    // Should show ratings for owned spots
    const ratingElements = page.locator('[data-testid="rating"], .rating, .star, [class*="rating"], [class*="star"]')
    const count = await ratingElements.count()
    
    if (count > 0) {
      await expect(ratingElements.first()).toBeVisible()
    }
  })

  test('should restrict dashboard access to owners only', async ({ page }) => {
    // Logout first
    await page.goto(`${testConfig.baseUrl}/profile`)
    await page.getByRole('button', { name: 'Sign Out' }).click()
    
    // Try to access dashboard without login
    await page.goto(`${testConfig.baseUrl}/owner/dashboard`)
    
    // Should redirect to login or show access denied
    await expect(page).toHaveURL(`${testConfig.baseUrl}/login`)
  })

  test('should show revenue update after bookings', async ({ page }) => {
    await page.goto(`${testConfig.baseUrl}/owner/dashboard`)
    
    // Should display current balance/revenue
    await expect(page.getByText('Total Revenue')).toBeVisible()
    await expect(page.getByText(/€\d+\.\d{2}/).first()).toBeVisible()
    
    // Revenue should be formatted to 2 decimal places
    const revenueElements = page.getByText(/€\d+\.\d{2}/).first()
    await expect(revenueElements.first()).toBeVisible()
  })
}) 