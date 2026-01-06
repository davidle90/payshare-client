<script setup>
import { getExpense } from '@/services/expensesApiService'
import { ref, watch } from 'vue'

const props = defineProps({
  showViewExpenseModal: Boolean,
  selectedExpenseId: String,
})

const emit = defineEmits(['modalClosed'])
const showModal = ref(props.showViewExpenseModal)
const expenseId = ref(props.selectedExpenseId || '')
const expense = ref(null)

watch(
  () => props.showViewExpenseModal,
  (newValue) => {
    showModal.value = newValue
  }
)

watch(
  () => props.selectedExpenseId,
  async (newValue) => {
    expenseId.value = newValue

    if(!expenseId.value) return;

    expense.value = await getExpense(expenseId.value);
  }
)

const toggleModal = () => {
  showModal.value = !showModal.value

  if(showModal.value == false){
    emit('modalClosed')
  }
}
</script>

<template>
  <div
    v-if="showModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    @click.self="toggleModal"
  >
    <div class="w-full max-w-lg rounded-lg bg-white shadow-lg p-6 overflow-y-auto max-h-[90vh]">
      <!-- Modal Header -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-gray-900">
          {{ expense?.name }}
        </h3>
        <button @click="toggleModal" class="text-gray-500 hover:text-gray-700 transition">
          ✕
        </button>
      </div>

      <!-- Modal Body -->
      <div v-if="expense" class="mb-4">
        <!-- Status Indicator -->
        <div class="flex justify-between items-center">
          <small class="text-gray-500">{{ expense.category }}</small>
        </div>

        <p class="text-gray-700">{{ expense.description }}</p>

        <span class="font-semibold">Status: </span>
        <small :class="[expense?.status == 'finalized' ? 'text-green-600' : 'text-blue-600']" class="font-semibold">
          {{ expense?.status }}
        </small>
        <!-- Total Amount -->
        <p><span class="font-semibold">Total: </span>{{ expense.totalAmount }}</p>

        <!-- Settlement Status -->
        <p>
          <span class="font-semibold">Settlement: </span>
          <span :class="expense.isSettled ? 'text-green-600' : 'text-blue-600'" class="font-semibold">
            {{ expense.isSettled ? 'Settled' : 'Pending' }}
          </span>
        </p>

        <!-- Created Date -->
        <p class="text-xs text-gray-400 mt-1">Created: {{ new Date(expense.createdAt).toLocaleDateString() }}</p>

        <!-- Participants List -->
        <div class="font-semibold mt-6">Participants:</div>
        <ul class="space-y-2">
          <li v-for="participant in expense.participants" :key="participant.id" class="flex items-center justify-between p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
            <span class="font-semibold">{{ participant.user.username }}</span>
            <span class="text-green-600 font-semibold">{{ Math.abs(participant.amountOwed) }}</span>
          </li>
        </ul>

        <!-- Contributors List -->
        <div class="font-semibold mt-6">
          <span>Contributors:</span>
        </div>
        <ul class="space-y-2">
          <li v-for="contributor in expense.contributors" :key="contributor.id" class="flex items-center justify-between p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
            <span class="font-semibold">{{ contributor.user.username }}</span>
            <span class="text-blue-600 font-semibold">{{ Math.abs(contributor.amountPaid) }}</span>
          </li>
        </ul>
      </div>

      <!-- Loading State -->
      <div v-else class="mb-4 text-center text-gray-600">
        <p>Loading...</p>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end gap-4 mt-6">
        <button @click="toggleModal" class="px-6 py-1 rounded bg-gray-200 hover:bg-gray-300 transition text-gray-800 cursor-pointer">
          Close
        </button>
        <router-link v-if="expense?.status !== 'finalized'" @click="toggleModal" :to="'/expenses/'+expense?.referenceId+'/edit'" class="px-6 py-1 rounded bg-black text-white cursor-pointer">
          Edit
        </router-link>
      </div>
    </div>
  </div>
</template>
