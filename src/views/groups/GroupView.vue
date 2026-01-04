<script setup>
import BaseLayout from '@/layouts/BaseLayout.vue';
import { getGroup } from '@/services/groupsApiService';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const referenceId = route.params.id;

const group = ref(null);
const members = ref([]);
const expenses = ref([]);

onMounted(async () => {
  group.value = await getGroup(referenceId);
  members.value = group.value.members;
  expenses.value = group.value.expenses;
});

const showExpenseData = () => {
    console.log('Show expense data')
}

const createExpense = () => {
    console.log('Create expense')
}

const editGroup = () => {
  console.log('Edit group');
};

const leaveGroup = () => {
  console.log('Leave group');
};
</script>

<template>
  <BaseLayout>
    <div class="flex justify-between items-center mb-6">
      <router-link to="/dashboard" class="underline text-gray-700 hover:text-gray-900">Back</router-link>
      <div class="flex gap-2">
        <button @click="editGroup" class="px-3 py-1 rounded bg-black text-sm text-white hover:bg-gray-800 transition-colors cursor-pointer">
            Edit group
        </button>
        <button @click="leaveGroup" class="px-3 py-1 rounded bg-black text-sm text-white hover:bg-gray-800 transition-colors cursor-pointer">
            Leave group
        </button>
      </div>
    </div>

    <div v-if="group">
      <div class="mb-4">
        <h1 class="text-2xl font-bold">{{ group.name }}</h1>
        <span class="text-sm text-gray-500">{{ group.referenceId }}</span>
      </div>

      <!-- Members -->
      <section class="mb-6">
        <h2 class="text-lg font-semibold mb-2">Members</h2>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="member in members"
            :key="member.user.id"
            class="px-3 py-1 bg-gray-100 rounded-full text-sm capitalize"
          >
            {{ member.user.username }}
          </span>
        </div>
      </section>

    <!-- Debts -->
    <section>
        <h2 class="text-lg font-semibold mb-2">Debts</h2>
        <p>//</p>
    </section>

      <!-- Expenses -->
      <section>
        <div class="flex justify-between mb-2">
            <h2 class="text-lg font-semibold">Expenses</h2>
            <button @click="createExpense" class="px-3 py-1 rounded bg-black text-sm text-white hover:bg-gray-800 transition-colors cursor-pointer">
                Create expense
            </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="expense in expenses"
            :key="expense.id"
            @click="showExpenseData"
            class="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white cursor-pointer"
          >
            <h3 class="font-medium text-gray-800">{{ expense.name }}</h3>
            <p class="text-sm text-gray-500 mb-2">{{ expense.description }}</p>
            <p class="text-sm text-gray-700">
              <strong>Total: </strong>{{ expense.totalAmount }}
            </p>
            <p class="text-sm text-gray-700">
              <strong>Status: </strong>
              <span :class="expense.isSettled ? 'text-green-600' : 'text-blue-600'">
                {{ expense.isSettled ? 'Settled' : 'Pending' }}
              </span>
            </p>
            <p class="text-xs text-gray-400 mt-1">Created: {{ new Date(expense.createdAt).toLocaleDateString() }}</p>
          </div>
        </div>
      </section>
    </div>

    <div v-else>
      <p class="text-gray-500">Loading group data...</p>
    </div>
  </BaseLayout>
</template>
