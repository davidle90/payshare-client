<script setup>
import { ref, watch } from 'vue'
import { settleUpByGroupId, simplifyBalance } from '@/services/debtsApiService'

const props = defineProps({
  showSettleUpModal: Boolean,
  groupId: String,
  members: Array,
})

const emit = defineEmits(['expensesSettled', 'modalClosed'])

const showModal = ref(props.showSettleUpModal)
const transactions = ref(null);

const loading = ref(false)
const error = ref('')

watch(
  () => props.showSettleUpModal,
  (newValue) => {
    showModal.value = newValue;

    if(!newValue) {
      transactions.value = null;
    }
  }
)

const toggleModal = () => {
  showModal.value = !showModal.value

  if(showModal.value == false){
    emit('modalClosed')
  }
}

const simplifyTransactions = async () => {
  error.value = ''
  loading.value = true

  try {
    const balances = await simplifyBalance(props.groupId)

    // Create a map of user IDs to usernames
    const userMap = props.members.reduce((acc, member) => {
      acc[member.user.id] = member.user.username;
      return acc;
    }, {});

    // Merge balances with usernames
    transactions.value = balances.map(balance => ({
      from: userMap[balance.from],
      to: userMap[balance.to],
      amount: balance.amount
    }));
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred'
  } finally {
    loading.value = false
  }
}

const handleSettleUp = async () => {
  error.value = ''
  loading.value = true

  try {
    const response = await settleUpByGroupId(props.groupId)
    emit('expensesSettled')
    toggleModal()
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    v-if="showModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    @click.self="toggleModal"
  >
    <div class="w-full max-w-lg bg-white rounded-lg shadow-xl p-6">
      <!-- Modal Header -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-gray-900">Settle Up</h3>
        <button @click="toggleModal" class="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>

      <!-- Modal Body -->
      <div class="space-y-4 mb-8">
        <p class="text-gray-700 text-lg">It's time to settle up your expenses!</p>
        <p class="text-gray-600">Click "Calculate" to minimize the transactions and balance things out.</p>

        <!-- Calculate Button -->
        <button
          v-if="!transactions"
          @click="simplifyTransactions"
          class="mt-4 w-full py-2 rounded bg-blue-500 text-white font-medium hover:bg-blue-600 focus:outline-none"
          :disabled="loading"
        >
          <span v-if="loading">Calculating...</span>
          <span v-else>Calculate</span>
        </button>

        <!-- Display Transactions -->
        <div v-else>
          <ul class="space-y-2">
            <li v-for="(transaction, index) in transactions" :key="index" class="text-sm text-gray-800">
              <span class="font-semibold">{{ transaction.from ?? 'Unknown' }}</span> → 
              <span class="font-semibold">{{ transaction.to ?? 'Unknown' }}</span>: 
              <span class="font-semibold text-green-600">{{ transaction.amount }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="flex justify-end gap-3">
        <button @click="toggleModal" class="px-4 py-2 rounded bg-gray-200" :disabled="loading">
          Cancel
        </button>
        <button @click="handleSettleUp" class="px-4 py-2 rounded bg-black text-white" :disabled="loading">
          <span v-if="loading">Updating...</span>
          <span v-else>Settle</span>
        </button>
      </div>
    </div>
  </div>
</template>
