<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth.js'
import { checkAuth } from './services/authApiService.js'

const authStore = useAuthStore()

onMounted(async () => {
  authStore.initializeAuth()

  // if (authStore.token) {
  //   try {
  //     const response = await checkAuth()

  //     if (response.success) {
  //       authStore.updateUser(response.user)
  //       localStorage.setItem('authUser', JSON.stringify(response.user))
  //     } else {
  //       authStore.logout()
  //     }
  //   } catch (error) {
  //     console.error('Auth check failed:', error)
  //     authStore.logout()
  //   }
  // } else {
  //   authStore.isAuthenticated = false
  // }

  // authStore.finishInit()

})
</script>

<template>
  <router-view />
</template>
