<script setup>
import CreateExpenseModal from '@/components/CreateExpenseModal.vue';
import EditGroupModal from '@/components/EditGroupModal.vue';
import GroupDebtList from '@/components/GroupDebtList.vue';
import LeaveGroupModal from '@/components/LeaveGroupModal.vue';
import ManageMembersModal from '@/components/ManageMembersModal.vue';
import SettleUpModal from '@/components/SettleUpModal.vue';
import ViewExpenseModal from '@/components/ViewExpenseModal.vue';
import BaseLayout from '@/layouts/BaseLayout.vue';

import { getGroup } from '@/services/groupsApiService';
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const referenceId = route.params.id;

const group = ref(null);
const members = ref([]);
const expenses = ref([]);

const groupName = ref('')
const hasUnsettled = computed(() => expenses.value.some(e => !e.isSettled && e.status === 'finalized'))

const showActionsDropdown = ref(false)
const showMembersModal = ref(false)
const showEditGroupModal = ref(false)
const showLeaveGroupModal = ref(false)
const showCreateExpenseModal = ref(false)
const showViewExpenseModal = ref(false)
const showSettleUpModal = ref(false)

const selectedExpenseId = ref('')

onMounted(async () => {
  group.value = await getGroup(referenceId);
  members.value = group.value.members;
  expenses.value = group.value.expenses;

  groupName.value = group.value.name;
});

// Toggle modals
const toggleActionsDropdown = () => {
  showActionsDropdown.value = !showActionsDropdown.value
}
const toggleMembersModal = () => {
  showActionsDropdown.value = false;
  showMembersModal.value = !showMembersModal.value
}
const toggleSettleUpModal = () => {
  showActionsDropdown.value = false;
  showSettleUpModal.value = !showSettleUpModal.value
}
const toggleCreateExpenseModal = () => {
  showActionsDropdown.value = false;
  showCreateExpenseModal.value = !showCreateExpenseModal.value
}
const toggleViewExpenseModal = (expenseId = '') => {
  showActionsDropdown.value = false;
  showViewExpenseModal.value = !showViewExpenseModal.value;

  if (!showViewExpenseModal.value) {
    selectedExpenseId.value = '';
  } else if (expenseId) {
    selectedExpenseId.value = expenseId;
  }
};

// Settle up
const handleSettleUp = async () => {
  showActionsDropdown.value = false;
  group.value = await getGroup(referenceId);
}

// Expense
const handleExpenseCreated = (expense) => {
    showActionsDropdown.value = false;
    expenses.value.unshift(expense);
}

//Update group
function editGroup() {
  showActionsDropdown.value = false;

  groupName.value = group.value.name;
  showEditGroupModal.value = true;
}
const handleGroupUpdated = (updatedGroup) => {
  groupName.value = updatedGroup.name;
  showEditGroupModal.value = false;
};

//Leave group
function leaveGroup() {
  showActionsDropdown.value = false
  showLeaveGroupModal.value = true;
}
const handleLeaveGroup = () => {
  showLeaveGroupModal.value = false;
  router.push('/dashboard');
};

//Update members
const handleUpdateMembers = (removedMemberIds) => {
  showMembersModal.value = false;
  members.value = members.value.filter(m => !removedMemberIds.includes(m.id));
};

const copied = ref(false)

const copyReferenceId = async () => {
  try {
    await navigator.clipboard.writeText(referenceId)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch (e) {
    console.error('Clipboard copy failed', e)
  }
}
</script>

<template>
  <BaseLayout>
    <div class="flex justify-between items-center mb-6" @click.self="showActionsDropdown = false">
      <router-link to="/dashboard" class="underline text-gray-700 hover:text-gray-900">Return to dashboard</router-link>
      <div class="relative">
        <!-- Dropdown trigger -->
        <button 
          @click="toggleActionsDropdown" 
          class="px-3 py-1 rounded bg-gray-800 text-sm text-white hover:bg-gray-700 transition-colors cursor-pointer flex items-center gap-1"
        >
          Actions
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Dropdown menu -->
        <div 
          v-if="showActionsDropdown" 
          class="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded shadow-md z-10"
        >
          <button 
            @click="editGroup" 
            class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
          >
            Edit group
          </button>
          <button 
            @click="leaveGroup" 
            class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
          >
            Leave group
          </button>
        </div>
      </div>
    </div>

    <div v-if="group">
      <div class="mb-4">
        <h1 class="text-2xl font-bold">{{ groupName }}</h1>
        <button
          class="flex items-center gap-2 text-sm text-gray-500 cursor-pointer"
          @click="copyReferenceId"
          title="Copy to clipboard"
        >
          {{ group.referenceId }}
          <span v-if="!copied">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
            </svg>
          </span>
          <span v-else>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
            </svg>
          </span>
        </button>
      </div>

      <!-- Members -->
      <section class="mb-4">
        <div class="flex justify-between">
          <h2 class="text-lg font-semibold mb-2">Members</h2>
          <div>
            <button 
              @click="toggleMembersModal" 
              class="px-3 py-1 rounded bg-gray-800 text-sm text-white hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Manage
            </button>
          </div>
        </div>
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
        <div class="mb-4">
          <h2 class="text-lg font-semibold">Debts</h2>
          <GroupDebtList :groupId="group.referenceId"/>
        </div>
      </section>

      <!-- Expenses -->
      <section>
        <div class="flex justify-between mb-4">
          <h2 class="text-lg font-semibold">Expenses</h2>
          <button @click="toggleCreateExpenseModal" class="px-3 py-1 rounded bg-gray-800 text-sm text-white hover:bg-gray-700 transition-colors cursor-pointer">
            Create expense
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="expense in expenses"
            :key="expense.id"
            @click="toggleViewExpenseModal(expense.referenceId)"
            class="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition"
          >
            <h3 class="font-medium text-gray-800">{{ expense.name }}</h3>
            <p class="text-sm text-gray-500 mb-2">{{ expense.description }}</p>
            <p class="text-sm text-gray-700"><strong>Total: </strong>{{ expense.totalAmount }}</p>
            <p class="text-sm text-gray-700">
              <strong>Settlement: </strong>
              <span :class="expense.isSettled ? 'text-green-600' : 'text-blue-600'">
                {{ expense.isSettled ? 'Settled' : 'Pending' }}
              </span>
            </p>
            <p class="text-sm text-gray-700">
              <strong>Status: </strong>
              <span :class="expense.status === 'finalized' ? 'text-green-600 capitalize' : 'text-blue-600 capitalize'">
                {{ expense.status }}
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

    <div class="mt-12">
      <div class="fixed bottom-16 left-0 w-full flex justify-center px-4 z-50">
        <div 
          v-if="hasUnsettled"
          class="px-4 py-2 rounded border border-blue-100 bg-blue-50 shadow-md flex items-center gap-2"
        >
          <span>You have unsettled expenses</span>
          <button @click="toggleSettleUpModal" class="px-2 py-1 text-sm rounded shadow-sm bg-blue-200 transition cursor-pointer">
            Settle up
          </button>
        </div>

        <div 
          v-else
          class="px-4 py-2 rounded border border-gray-300 bg-white text-gray-600"
        >
          Nothing to settle
        </div>
      </div>
    </div>

    <!-- MODALS -->
    <EditGroupModal
      :showEditGroupModal="showEditGroupModal"
      :groupName="groupName"
      :groupId="group?.referenceId || ''"
      @groupUpdated="handleGroupUpdated"
      @modalClosed="showEditGroupModal = false"
    />

    <LeaveGroupModal
      :showLeaveGroupModal="showLeaveGroupModal"
      :group
      @groupLeft="handleLeaveGroup"
      @modalClosed="showLeaveGroupModal = false"
    />

    <ManageMembersModal
      :showMembersModal
      :group
      @membersUpdated="handleUpdateMembers"
      @modalClosed="showMembersModal = false"
    />

    <CreateExpenseModal
      :showCreateExpenseModal
      :groupId="group?.referenceId || ''"
      @expenseCreated="handleExpenseCreated"
      @modalClosed="showCreateExpenseModal = false"
    />

    <ViewExpenseModal
      :showViewExpenseModal="showViewExpenseModal"
      :selectedExpenseId="selectedExpenseId"
      :groupId="group?.referenceId"
      @modalClosed="showViewExpenseModal = false"
    />

    <SettleUpModal
      :showSettleUpModal
      :groupId="group?.referenceId || ''"
      :members="members"
      @expensesSettled="handleSettleUp"
      @modalClosed="showSettleUpModal = false"
    />

  </BaseLayout>
</template>
