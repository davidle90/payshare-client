<script setup>
import { useAuthStore } from '../stores/auth.js'
import { ref } from 'vue'

const authStore = useAuthStore()
const isAuthenticated = ref(authStore.isAuthenticated)
</script>

<template>
  <div class="flex justify-between">
    <div>
      <router-link to="/">PAYSHARE</router-link>
    </div>
    <div>
      <div v-if="isAuthenticated">
        <router-link to="/logout">Logout</router-link>
      </div>
      <div v-else>
        <router-link to="/login">Login</router-link>
      </div>
    </div>
  </div>
</template>
