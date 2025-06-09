// Test configuration for Playwright E2E tests
// Note: Environment variables should be set in .env file or CI/CD environment

export const testConfig = {
  // Test user credentials
  testUser: {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User'
  },
  
  // Demo user credentials
  demoUser: {
    email: 'pieter@example.com',
    password: 'password123'
  },
  
  // Demo owner credentials
  demoOwner: {
    email: 'marie@example.com',
    password: 'password123'
  },
  
  // Application URLs
  baseUrl: 'http://localhost:5173',
  apiUrl: 'http://localhost:3001/api',
  
  // Auth file path
  authFile: './playwright/.auth/user.json'
} 