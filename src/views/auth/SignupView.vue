<script setup>
import { useRouter } from 'vue-router';
import BaseLayout from '../../layouts/BaseLayout.vue';
import { register } from '../../services/authApiService';
import { ref } from 'vue';

const router = useRouter();

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');

const handleRegister = async () => {
  errorMessage.value = '';

  if(!username.value || !email.value || !password.value || !confirmPassword.value){
    errorMessage.value = 'Please fill the form to register'
    return;
  }

  if(password.value !== confirmPassword.value){
    errorMessage.value = 'Password does not match';
    return;
  }

  const response = await register(username.value, email.value, password.value);

  if(response.success){
    router.push('/dashboard')
  } else {
    errorMessage.value = response.message;
  }
}
</script>

<template>
  <BaseLayout>
    <div class="flex justify-center items-center">
      <form class="bg-white p-8 w-full max-w-md flex flex-col space-y-4">
        <h2 class="text-2xl font-bold text-center">Create Your Account</h2>

        <input 
          v-model="username"
          type="text" 
          placeholder="Username" 
          class="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
        <input 
          v-model="email"
          type="email" 
          placeholder="Email" 
          class="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
        <input 
          v-model="password"
          type="password" 
          placeholder="Password" 
          class="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
        <input 
          v-model="confirmPassword"
          type="password" 
          placeholder="Confirm Password" 
          class="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />

        <div v-if="errorMessage" class="text-red-600">{{ errorMessage }}</div>

        <button @click.prevent="handleRegister" type="button" class="bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600">
          Sign Up
        </button>

        <p class="text-gray-500 text-sm text-center">
          Already have an account? 
          <router-link to="/login" class="text-blue-500 hover:underline">Login</router-link>
        </p>
      </form>
    </div>
  </BaseLayout>
</template>
