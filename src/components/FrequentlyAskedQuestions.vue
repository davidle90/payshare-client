<script setup>
import { ref } from 'vue'

const activeFAQ = ref(null)

const toggleFAQ = (index) => {
  activeFAQ.value = activeFAQ.value === index ? null : index
}
</script>

<template>
  <section class="px-4 py-12 bg-gray-50">
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">
        Frequently Asked Questions
      </h2>
      <div class="space-y-4">
        <div>
          <button 
            @click="toggleFAQ(0)"
            class="w-full text-left text-lg font-medium text-gray-900 bg-gray-200 px-6 py-4 rounded focus:outline-none"
          >
            How does PAYSHARE work?
          </button>
          <p v-if="activeFAQ === 0" class="text-left mt-2 text-gray-600 px-6">
            PAYSHARE allows you to easily split and track shared expenses with friends, roommates, or groups. Simply add your expenses and the app automatically calculates who owes whom.
          </p>
        </div>
        <div>
          <button 
            @click="toggleFAQ(1)"
            class="w-full text-left text-lg font-medium text-gray-900 bg-gray-200 px-6 py-4 rounded focus:outline-none"
          >
            Is PAYSHARE free to use?
          </button>
          <p v-if="activeFAQ === 1" class="text-left mt-2 text-gray-600 px-6">
            Yes! PAYSHARE is free to use for basic expense tracking. We do offer additional premium features down the road, but the core functionality will always be free.
          </p>
        </div>
        <div>
          <button 
            @click="toggleFAQ(2)"
            class="w-full text-left text-lg font-medium text-gray-900 bg-gray-200 px-6 py-4 rounded focus:outline-none"
          >
            Can I use PAYSHARE for group trips or with roommates?
          </button>
          <p v-if="activeFAQ === 2" class="text-left mt-2 text-gray-600 px-6">
            Absolutely! PAYSHARE is perfect for splitting costs on trips or managing shared expenses in a household. You can add expenses as you go and settle up easily.
          </p>
        </div>
        <div>
          <button 
            @click="toggleFAQ(3)"
            class="w-full text-left text-lg font-medium text-gray-900 bg-gray-200 px-6 py-4 rounded focus:outline-none"
          >
            How can I settle up with someone?
          </button>
          <p v-if="activeFAQ === 3" class="text-left mt-2 text-gray-600 px-6">
            Once all debts are tracked, you can simply view who owes who and settle payments directly. We’ll show you the balances so you can pay or request money with ease.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>