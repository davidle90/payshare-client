<script setup>
import BaseLayout from '@/layouts/BaseLayout.vue';
import { getExpense } from '@/services/expensesApiService';
import { getGroupMembers } from '@/services/groupsApiService';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { TrashIcon } from '@heroicons/vue/24/solid'

const route = useRoute();
const groupId = route.params.groupId;
const expenseId = route.params.expenseId;
const isFinalized = ref(false);

const members = ref([]); // Store group members
const expense = ref({
  name: '',
  description: '',
  category: '',
  totalAmount: 0,
  status: '', // Read-only
  participants: [],
  contributors: []
});

const contributors = ref([]); // Local contributors array
const participants = ref([]); // Local participants array

const showDeleteModal = ref(false);

onMounted(async () => {
  // Fetch expense details and group members
  expense.value = await getExpense(expenseId);
  members.value = await getGroupMembers(groupId);
  isFinalized.value = expense.value.status === 'finalized'

  // Initialize participants and contributors arrays based on members
  members.value.forEach(member => {
    // Initialize empty amounts for each member
    participants.value.push({
      memberId: member.id,
      amountOwed: 0
    });
    contributors.value.push({
      memberId: member.id,
      amountPaid: 0
    });
  });

  // Pre-fill participants and contributors arrays with data from expense
  expense.value.participants.forEach(participant => {
    const participantIndex = participants.value.findIndex(
      p => p.memberId === participant.memberId
    );
    if (participantIndex !== -1) {
      participants.value[participantIndex].amountOwed = parseFloat(participant.amountOwed);
    }
  });

  expense.value.contributors.forEach(contributor => {
    const contributorIndex = contributors.value.findIndex(
      c => c.memberId === contributor.memberId
    );
    if (contributorIndex !== -1) {
      contributors.value[contributorIndex].amountPaid = parseFloat(contributor.amountPaid);
    }
  });
});

const toggleDeleteModal = () => {
    showDeleteModal.value = !showDeleteModal.value;
}

// Update functions for adding participants, contributors, and saving
const updateParticipant = (memberId, amount) => {
  // If the amount is 0, remove from the participants array
  if (amount === 0) {
    participants.value = participants.value.filter(p => p.memberId !== memberId);
  } else {
    // Update participant amount
    const existing = participants.value.find(p => p.memberId === memberId);
    if (existing) {
      existing.amountOwed = amount; // Update if already exists
    } else {
      participants.value.push({ memberId, amountOwed: amount });
    }
  }
};

const updateContributor = (memberId, amount) => {
  // If the amount is 0, remove from the contributors array
  if (amount === 0) {
    contributors.value = contributors.value.filter(c => c.memberId !== memberId);
  } else {
    // Update contributor amount
    const existing = contributors.value.find(c => c.memberId === memberId);
    if (existing) {
      existing.amountPaid = amount; // Update if already exists
    } else {
      contributors.value.push({ memberId, amountPaid: amount });
    }
  }
};

const saveExpense = () => {
  console.log('Saving expense:', expense.value);
  console.log('Participants:', participants.value);
  console.log('Contributors:', contributors.value);

  // TODO: Implement API logic to save contributors and participants
};

const handleFinalizeExpense = () => {
    console.log('finalizing expense')
}

const handleDeleteExpense = () => {
    console.log('deleting expense')
}
</script>

<template>
    <BaseLayout>
        <!-- Back Button -->
        <div class="mb-2">
            <router-link :to="'/groups/' + groupId" class="underline">Return to group</router-link>
        </div>

        <!-- Expense Form -->
        <h2 class="text-2xl font-semibold mb-6">Edit Expense</h2>

        <!-- Expense Details -->
        <div class="space-y-4">
            <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Expense Name</label>
                <input
                id="name"
                v-model="expense.name"
                type="text"
                class="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Expense Name"
                :disabled="isFinalized"
                />
            </div>

            <div>
                <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                id="description"
                v-model="expense.description"
                class="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Expense Description"
                :disabled="isFinalized"
                ></textarea>
            </div>

            <div>
                <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
                <input
                id="category"
                v-model="expense.category"
                type="text"
                class="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Category"
                :disabled="isFinalized"
                />
            </div>

            <div>
                <span class="block text-sm font-medium text-gray-700">Total Amount</span>
                {{ expense.totalAmount }}
                <span class="block text-sm font-medium text-gray-700">Status</span>
                {{ expense.status }}
            </div>
            </div>

            <!-- Participants and Contributors -->
            <div class="space-y-6 mb-8">
            <div>
                <h3 class="text-xl font-semibold mb-2">Participants</h3>
                <ul class="space-y-2">
                <li v-for="member in members" :key="member.id" class="flex justify-between items-center">
                    <span>{{ member.user.username }}</span>
                    <input
                    v-model.number="participants.find(p => p.memberId === member.id).amountOwed"
                    @input="updateParticipant(member.id, participants.find(p => p.memberId === member.id).amountOwed)"
                    type="number"
                    min="0"
                    placeholder="Amount Owed"
                    class="border rounded p-2"
                    :disabled="isFinalized"
                    />
                </li>
                </ul>
            </div>

            <div>
                <h3 class="text-xl font-semibold mb-2">Contributors</h3>
                <ul class="space-y-2">
                <li v-for="member in members" :key="member.id" class="flex justify-between items-center">
                    <span>{{ member.user.username }}</span>
                    <input
                        v-model.number="contributors.find(c => c.memberId === member.id).amountPaid"
                        @input="updateContributor(member.id, contributors.find(c => c.memberId === member.id).amountPaid)"
                        type="number"
                        min="0"
                        placeholder="Amount Paid"
                        class="border rounded p-2"
                        :disabled="isFinalized"
                    />
                </li>
                </ul>
            </div>
        </div>

        <!-- Save / Update Buttons -->
        <div class="mt-16">
            <div v-if="isFinalized" class="flex justify-center items-center">
                <router-link
                    :to="'/groups/' + groupId"
                    class="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 cursor-pointer"
                >
                    Return to Group Overview
                </router-link>
            </div>
            <div v-else>
                <div class="flex flex-col items-center gap-2">
                    <button
                        @click="saveExpense"
                        class="w-full px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                    >
                        Save Draft
                    </button>
                    <button
                        @click="handleFinalizeExpense"
                        class="w-full px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
                    >
                        Save and Finalize Expense
                    </button>

                    <p class="text-center mt-2 text-sm text-gray-600">
                        *Once finalized, this expense cannot be modified.
                    </p>
                </div>

                <!-- Delete Button -->
                <div class="flex justify-center mt-4">
                    <button
                        @click="toggleDeleteModal"
                        class="font-semibold text-red-600 hover:text-red-700 cursor-pointer flex items-center"
                    >
                        <TrashIcon class="w-4 h-4" /> Delete Expense
                    </button>
                </div>

                <router-link :to="'/groups/' + groupId" class="underline flex justify-center text-gray-600 hover:text-gray-800 mt-4">
                    Return to group
                </router-link>

                <!-- Delete Confirmation Modal -->
                <div v-if="showDeleteModal" class="fixed inset-0 flex justify-center items-center bg-black/50 z-50" @click.self="toggleDeleteModal">
                    <div class="bg-white rounded-md shadow-lg p-6 max-w-sm w-full">
                    <p class="text-lg font-semibold mb-4">Are you sure you want to delete this expense?</p>
                    <div class="flex justify-end gap-4">
                        <button
                            @click="toggleDeleteModal"
                            class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            @click.prevent="handleDeleteExpense"
                            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
                        >
                            Yes, Delete
                        </button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </BaseLayout>
</template>
