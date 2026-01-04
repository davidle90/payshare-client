<script setup>
import { computed, ref } from 'vue'
import BaseLayout from '../../layouts/BaseLayout.vue'
import { useAuthStore } from '../../stores/auth.js'
import FrequentlyAskedQuestions from '@/components/FrequentlyAskedQuestions.vue'

const authStore = useAuthStore()
const isAuthenticated = ref(authStore.isAuthenticated)
const routeTo = computed(() => {
  return isAuthenticated.value ? '/dashboard' : '/login'
})
</script>

<template>
  <BaseLayout>
    <section class="flex flex-col items-center text-center px-4 pt-28 pb-20">
      <!-- Hero -->
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 max-w-3xl leading-tight mb-6">
        Split expenses.<br class="hidden sm:block" />
        Stay fair. No awkward reminders.
      </h1>

      <p class="text-lg text-gray-600 max-w-2xl mb-10">
        PAYSHARE simplifies expense sharing for friends, roommates, or group trips.
        Track balances and settle up with clarity.
      </p>

      <!-- CTA -->
      <router-link
        :to="routeTo"
        class="bg-gray-900 text-white px-8 py-3 rounded-lg text-base font-medium hover:bg-gray-800 transition"
      >
        Get started
      </router-link>

      <!-- Feature hints -->
      <div class="my-14 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl text-sm text-gray-600">
        <div class="flex flex-col items-center">
          <span class="mb-2 text-lg">💸</span>
          <p>Track shared expenses</p>
        </div>
        <div class="flex flex-col items-center">
          <span class="mb-2 text-lg">🤝</span>
          <p>See who owes who</p>
        </div>
        <div class="flex flex-col items-center">
          <span class="mb-2 text-lg">✅</span>
          <p>Settle up with clarity</p>
        </div>
      </div>

      <FrequentlyAskedQuestions />
    </section>
  </BaseLayout>
</template>
