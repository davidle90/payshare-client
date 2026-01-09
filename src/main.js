import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/main.css'
import router from './router'
import App from './App.vue'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

app.use(router)
app.use(createPinia())

const authStore = useAuthStore()
authStore.initializeAuth()

app.mount('#app')