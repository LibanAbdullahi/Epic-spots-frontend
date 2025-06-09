# Epic Spots - Frontend Client

A modern Vue.js application for discovering and booking amazing camping spots around the world.

## 🏕️ Overview

Epic Spots is a camping booking platform built with Vue 3, TypeScript, and Tailwind CSS. The frontend provides an intuitive interface for users to discover camping spots, make bookings, manage their profiles, and for owners to manage their camping spots.

## ✨ Features

### For Campers
- **Spot Discovery**: Browse and search camping spots with interactive maps
- **Advanced Filtering**: Filter by location, amenities, price, and more
- **Booking System**: Easy-to-use booking interface with date selection
- **User Profiles**: Manage account settings and view booking history
- **Reviews & Ratings**: Read and write reviews for camping spots
- **Responsive Design**: Optimized for desktop and mobile devices

### For Spot Owners
- **Owner Dashboard**: Comprehensive management interface
- **Spot Management**: Create, edit, and delete camping spots
- **Booking Management**: View and manage incoming bookings
- **Revenue Tracking**: Monitor earnings and booking statistics
- **Image Upload**: Upload and manage spot photos

## 🛠️ Tech Stack

- **Framework**: Vue 3 with Composition API
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Routing**: Vue Router
- **HTTP Client**: Axios
- **Maps**: Leaflet with Vue3-Leaflet
- **Build Tool**: Vite
- **Testing**: Playwright (E2E), Vitest (Unit)

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/epic-spots.git
   cd epic-spots/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   Edit `.env` and configure the following:
   ```
   VITE_API_BASE_URL=http://localhost:3001/api
   VITE_APP_NAME=Epic Spots
   VITE_APP_DESCRIPTION=Find and book amazing camping spots
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:e2e:headed` - Run E2E tests with browser UI

## 🧪 Testing

### End-to-End Tests
We use Playwright for comprehensive E2E testing:

```bash
# Run all E2E tests
npm run test:e2e

# Run specific test file
npx playwright test e2e/auth.spec.ts

# Run tests with browser UI
npm run test:e2e:headed

# Open Playwright test report
npx playwright show-report
```

### Test Credentials
For E2E testing, use these demo accounts:
- **Regular User**: `pieter@example.com` / `password123`
- **Spot Owner**: `marie@example.com` / `password123`

## 📁 Project Structure

```
client/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, icons, styles
│   │   ├── auth/         # Authentication components
│   │   ├── booking/      # Booking-related components
│   │   ├── common/       # Common UI components
│   │   ├── profile/      # User profile components
│   │   └── spots/        # Spot-related components
│   ├── router/           # Vue Router configuration
│   ├── stores/           # Pinia stores
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── views/            # Page components
│   ├── App.vue           # Root component
│   └── main.ts           # Application entry point
├── e2e/                  # End-to-end tests
├── tests/                # Unit tests
├── playwright.config.ts  # Playwright configuration
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## 🎨 Styling

This project uses Tailwind CSS for styling with a custom design system:

- **Colors**: Custom camping-themed color palette
- **Typography**: Responsive typography scale
- **Components**: Pre-built component classes
- **Utilities**: Extended utility classes for camping-specific needs

### Key Design Principles
- Mobile-first responsive design
- Accessibility-focused components
- Consistent spacing and typography
- Nature-inspired color scheme

## 🔧 Configuration

### Environment Variables
Create a `.env` file with the following variables:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api

# App Information
VITE_APP_NAME=Epic Spots
VITE_APP_DESCRIPTION=Find and book amazing camping spots

# Test Credentials (for E2E tests)
PLAYWRIGHT_TEST_EMAIL=test@example.com
PLAYWRIGHT_TEST_PASSWORD=password123
PLAYWRIGHT_DEMO_USER_EMAIL=pieter@example.com
PLAYWRIGHT_DEMO_USER_PASSWORD=password123
PLAYWRIGHT_DEMO_OWNER_EMAIL=marie@example.com
PLAYWRIGHT_DEMO_OWNER_PASSWORD=password123
```

### API Integration
The frontend communicates with the backend API through:
- Axios HTTP client
- Centralized API service layer
- Request/response interceptors
- Error handling middleware

## 🌐 Key Features in Detail

### Authentication System
- JWT-based authentication
- Persistent login state
- Role-based access control (User/Owner)
- Profile management

### Booking System
- Interactive date picker
- Real-time availability checking
- Price calculation
- Booking confirmation

### Map Integration
- Interactive Leaflet maps
- Custom camping markers
- Spot location visualization
- Search by map area

### State Management
- Pinia stores for global state
- Reactive data binding
- Computed properties
- Persistent state

## 🐛 Debugging

### Common Issues
1. **CORS Errors**: Ensure the backend server is running and CORS is configured
2. **API Connection**: Check `VITE_API_BASE_URL` in your `.env` file
3. **Build Errors**: Run `npm run type-check` to identify TypeScript issues
4. **Test Failures**: Ensure both frontend and backend servers are running for E2E tests

### Development Tools
- Vue DevTools browser extension
- Browser developer tools
- ESLint error reporting
- TypeScript error checking

## 📚 Learn More

- [Vue.js Documentation](https://vuejs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Playwright Documentation](https://playwright.dev/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Use semantic commit messages
- Follow the existing code style
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the existing issues on GitHub
2. Review the documentation
3. Create a new issue with detailed information

---

Built with ❤️ for camping enthusiasts everywhere! 🏕️ 