# E2E Testing for Epic Spots

This directory contains end-to-end tests for the Epic Spots camping booking application using Playwright.

## Test Coverage

Our E2E tests cover all requirements from the requirements.md:

### ✅ **User Features (Need to Have)**
- **Authentication**: Login, registration, logout functionality
- **Spot Discovery**: Find and filter camping spots
- **Booking**: Complete booking flow with validation
- **Profile Management**: View bookings, edit profile information

### ✅ **User Features (Nice to Have)**
- **Interactive Map**: Toggle between grid/map view, markers, popups
- **Rating System**: Rate and review completed bookings
- **Professional UI**: Modern, responsive design

### ✅ **Owner Features (Need to Have)**
- **Dashboard**: Owner-specific page with spots overview
- **Spot Management**: Create, edit, delete camping spots
- **Booking Visibility**: View bookings and revenue

### ✅ **Owner Features (Nice to Have)**
- **Image Upload**: Add images when editing spots
- **Revenue Tracking**: Balance updates and statistics

## Test Files

- `auth.spec.ts` - User authentication and registration
- `spots-discovery.spec.ts` - Spot search, filtering, and map functionality
- `booking.spec.ts` - Booking system end-to-end flow
- `owner-dashboard.spec.ts` - Owner dashboard and spot management
- `profile.spec.ts` - User profile and booking management

## Running Tests

### Prerequisites
Make sure both frontend and backend servers are running:

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### Run All Tests
```bash
cd client
npm run test:e2e
```

### Run Tests with UI
```bash
npm run test:e2e:ui
```

### Run Tests in Headed Mode (see browser)
```bash
npm run test:e2e:headed
```

### Debug Tests
```bash
npm run test:e2e:debug
```

### Run Specific Test File
```bash
npx playwright test auth.spec.ts
```

### Run Tests on Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Setup

### Global Setup
- Automatically resets and seeds the database before tests
- Creates test users for authentication scenarios
- Ensures clean test environment

### Test Data
Tests use seeded data including:
- 3 camping spot owners (Sarah, Marcus, Elena)
- 14 diverse camping spots across different categories
- Real coordinates for map testing
- Various price points and locations

### Test Users
- **Test User**: `test@example.com` / `password123` (created during setup)
- **Owner**: `sarah@epicspots.com` / `password123` (from seed data)

## Configuration

The tests are configured to run on multiple browsers and devices:
- Desktop Chrome, Firefox, Safari
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

## Reports

Test results are generated in multiple formats:
- HTML report (default viewer)
- JSON report for CI/CD integration
- JUnit XML for reporting systems

## Best Practices

### Selectors
- Use role-based selectors when possible: `page.getByRole('button', { name: 'Login' })`
- Use test IDs for complex components: `[data-testid="camping-card"]`
- Combine CSS classes and test IDs: `.camping-card, [data-testid="camping-card"]`

### Waiting and Timing
- Use `waitForSelector()` for dynamic content
- Use `expect().toBeVisible()` instead of hardcoded waits
- Set reasonable timeouts for navigation and actions

### Test Independence
- Each test is independent and can run in parallel
- Tests clean up after themselves
- No shared state between tests

## Troubleshooting

### Common Issues

1. **Tests fail with timeout**
   - Ensure both servers are running
   - Check if ports 5173 (frontend) and 3000 (backend) are available

2. **Database connection errors**
   - Verify PostgreSQL is running
   - Check `.env` configuration in server directory

3. **Authentication tests fail**
   - Ensure test user exists (should be created in global setup)
   - Check if registration form validation matches test expectations

4. **Map tests fail**
   - Ensure spots have coordinates (seeded data should include them)
   - Check if Leaflet components are properly loaded

### Debug Tips
- Use `--headed` flag to see browser interactions
- Use `--debug` flag to step through tests
- Add `await page.pause()` to stop execution at specific points
- Check browser console for JavaScript errors

## Contributing

When adding new features:
1. Add corresponding E2E tests
2. Update test documentation
3. Ensure tests cover both happy path and error scenarios
4. Test on multiple browsers if UI changes are involved 