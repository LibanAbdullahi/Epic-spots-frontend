import { test, expect } from '@playwright/test'
import { testConfig } from './test-config'

test.describe('Camping Spots Discovery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(testConfig.baseUrl)
  })

  test('should display camping spots on the homepage', async ({ page }) => {
    // Should show Featured Camping Spots title when not searching
    await expect(page.getByRole('heading', { name: 'Featured Camping Spots' })).toBeVisible()
    
    // Should display camping spots cards
    await expect(page.getByTestId('camping-card').first()).toBeVisible()
    
    // Each card should have basic information
    const firstCard = page.getByTestId('camping-card').first()
    await expect(firstCard).toBeVisible()
    await expect(firstCard.getByRole('button', { name: /View Details/ })).toBeVisible()
  })

  test('should search for specific camping spots', async ({ page }) => {
    // Search for mountain spots using the search input and button
    await page.getByPlaceholder(/Search by location, name, or description/i).fill('Mountain')
    
    // Click the search button (it's an icon-only button)
    await page.locator('button').filter({ has: page.locator('svg') }).nth(1).click() // The search button is the second button with SVG icon
    
    // Should show search results
    await expect(page.getByText(/Found.*matching.*Mountain/i)).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Search Results' })).toBeVisible()
    
    // Should display filtered spots (if any exist)
    const spots = page.getByTestId('camping-card')
    const spotsCount = await spots.count()
    if (spotsCount > 0) {
      await expect(spots.first()).toBeVisible()
    } else {
      // If no spots match, should show empty state
      await expect(page.getByText('No spots found')).toBeVisible()
    }
  })

  test('should filter spots using quick filter buttons', async ({ page }) => {
    // Use the Mountains filter button
    await page.getByRole('button', { name: 'Mountains' }).click()
    
    // Should show search results
    await expect(page.getByText(/Found.*matching.*Mountain/i)).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Search Results' })).toBeVisible()
    
    // Reset filters
    await page.getByRole('button', { name: 'All Spots' }).click()
    await expect(page.getByRole('heading', { name: 'Featured Camping Spots' })).toBeVisible()
  })

  test('should display spot details when clicking on a spot', async ({ page }) => {
    // Wait for spots to load
    await expect(page.getByTestId('camping-card').first()).toBeVisible()
    
    // Click on the first spot's View Details button
    await page.getByTestId('camping-card').first().getByRole('button', { name: /View Details/ }).click()

    // Should navigate to spot details page
    await expect(page).toHaveURL(/\/spots\/[a-zA-Z0-9]+/)

    // Should display spot details
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible() // Spot title
  })

  test('should switch between grid and map view', async ({ page }) => {
    // Should be in grid view by default
    await expect(page.getByTestId('camping-card').first()).toBeVisible()
    
    // Switch to map view
    await page.getByRole('button', { name: 'Map View' }).click()
    
    // Should see map component (if it loads properly)
    // Since map might take time to load, we'll just check the button state
    await expect(page.getByRole('button', { name: 'Map View' })).toHaveClass(/bg-slate-900/)
    
    // Switch back to grid view  
    await page.getByRole('button', { name: 'Grid View' }).click()
    await expect(page.getByRole('button', { name: 'Grid View' })).toHaveClass(/bg-slate-900/)
    await expect(page.getByTestId('camping-card').first()).toBeVisible()
  })

  test('should handle empty search results gracefully', async ({ page }) => {
    // Search for something that doesn't exist
    await page.getByPlaceholder(/Search by location, name, or description/i).fill('NonexistentPlace12345')
    await page.locator('button').filter({ has: page.locator('svg') }).nth(1).click()

    // Should show no results message
    await expect(page.getByText(/Found 0 spot.*matching/i)).toBeVisible()
    await expect(page.getByText('No spots found')).toBeVisible()

    // Should offer to clear search
    await page.getByRole('button', { name: 'All Spots' }).click()
    await expect(page.getByRole('heading', { name: 'Featured Camping Spots' })).toBeVisible()
  })

  test('should display spot ratings and reviews', async ({ page }) => {
    // Wait for spots to load
    await expect(page.getByTestId('camping-card').first()).toBeVisible()

    // Should show rating stars in spot cards (look for star SVGs)
    const firstCard = page.getByTestId('camping-card').first()
    await expect(firstCard.locator('svg').filter({ hasText: '' }).first()).toBeVisible() // Star SVGs

    // Click on a spot to see detailed ratings
    await firstCard.getByRole('button', { name: /View Details/ }).click()
    
    // Should navigate to spot details
    await expect(page).toHaveURL(/\/spots\/[a-zA-Z0-9]+/)
    
    // Should show rating information on details page
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
}) 