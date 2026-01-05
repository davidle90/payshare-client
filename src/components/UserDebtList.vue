<script setup>
import { getUserDebts } from '@/services/debtsApiService';
import { jwtDecode } from 'jwt-decode';
import { ref } from 'vue';

const debts = ref([]);

const token = localStorage.getItem('authToken');
const userId = token ? jwtDecode(token).sub : null;

if (userId) {
  (async () => {
    try {
      debts.value = await getUserDebts(userId);
      debts.value = debts.value.filter(d => !!d.toUser)
    } catch (error) {
      console.error('Failed to fetch debts:', error);
    }
  })();
}
</script>

<template>
    <div class="container mx-auto">
        <ul class="space-y-3">
            <li
                v-for="debt in debts"
                :key="debt.id"
                class="flex items-center justify-between rounded-lg border px-4 py-3"
            >
                <div class="text-sm">
                    <p class="font-medium text-gray-900">
                        {{ debt.toUser.username }}
                    </p>
                    <p class="text-xs text-gray-500">
                        {{ debt.amount > 0 ? 'You need to pay' : 'You will get paid' }}
                    </p>
                </div>

                <div
                    class="text-sm font-semibold"
                    :class="debt.amount > 0 ? 'text-red-600' : 'text-green-600'"
                >
                    {{ Math.abs(debt.amount) }}
                </div>
            </li>
        </ul>
    </div>
</template>