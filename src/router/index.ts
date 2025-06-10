import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Import views
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import SpotDetails from '@/views/SpotDetails.vue'
import Profile from '@/views/Profile.vue'
import OwnerDashboard from '@/views/OwnerDashboard.vue'
import OAuthCallback from '@/views/OAuthCallback.vue'
import ForgotPassword from '@/views/ForgotPassword.vue'
import ResetPassword from '@/views/ResetPassword.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: { requiresGuest: true }
    },
    {
      path: '/login/callback',
      name: 'OAuthCallback',
      component: OAuthCallback
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: ForgotPassword,
      meta: { requiresGuest: true }
    },
    {
      path: '/reset-password',
      name: 'ResetPassword',
      component: ResetPassword,
      meta: { requiresGuest: true }
    },
    {
      path: '/spots/:id',
      name: 'SpotDetails',
      component: SpotDetails,
      props: true
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: { requiresAuth: true }
    },
    {
      path: '/owner/dashboard',
      name: 'OwnerDashboard',
      component: OwnerDashboard,
      meta: { requiresAuth: true, requiresOwner: true }
    }
  ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
  } else if (to.meta.requiresOwner && authStore.user?.role !== 'OWNER') {
    next('/')
  } else {
    next()
  }
})

export default router 