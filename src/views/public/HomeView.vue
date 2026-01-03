<script setup>
import BaseLayout from '../../layouts/BaseLayout.vue';
</script>

<template>
  <BaseLayout>
    <div class="flex flex-col items-center justify-center text-center space-y-6 mt-20">
      <h1 class="text-5xl font-bold">Welcome to PAYSHARE App</h1>
      <p class="text-gray-600 text-lg max-w-xl">
        This is a simple landing page built with Vue 3 and Tailwind CSS.
      </p>
      <router-link 
        to="/login" 
        class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
      >
        Get Started
      </router-link>
    </div>
  </BaseLayout>
</template>
