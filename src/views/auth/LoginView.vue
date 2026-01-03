
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'
import BaseLayout from '../../layouts/BaseLayout.vue';
import { login } from '../../services/authApiService';
import { useAuthStore } from '../../stores/auth.js'

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  if(authStore.isAuthenticated){
    router.push('/dashboard')
  }
})

const handleLogin = async () => {

  errorMessage.value = '';

  if(!email.value || !password.value){
    errorMessage.value = 'Please insert required fields to login'
    return;
  }

  const response = await login(email.value, password.value);
  
  if(response.success){
    router.push('/dashboard');
  } else {
    errorMessage.value = response.message;
  }
}

</script>

<template>
  <BaseLayout>
    <div class="flex justify-center items-center">
      <form class="bg-white p-8 w-full max-w-md flex flex-col space-y-4">
        <h2 class="text-2xl font-bold text-center">Login to Your Account</h2>

        <input v-model="email" type="email" placeholder="Email" class="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input v-model="password" type="password" placeholder="Password" class="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

        <div v-if="errorMessage" class="text-center text-red-600">{{ errorMessage }}</div>

        <button @click.prevent="handleLogin" type="button" class="bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600">
          Login
        </button>

        <p class="text-gray-500 text-sm text-center">
          Don't have an account? <router-link to="/signup" class="text-blue-500 hover:underline">Sign Up</router-link>
        </p>
      </form>
    </div>
  </BaseLayout>
</template>