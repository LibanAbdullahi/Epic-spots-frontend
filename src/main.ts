import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import './style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Initialize authentication state from localStorage
const authStore = useAuthStore()
authStore.initializeAuth()

app.mount('#app') 