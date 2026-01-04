<script setup>
import { onMounted, ref } from 'vue';
import BaseLayout from '../../layouts/BaseLayout.vue';
import { getGroups } from '../../services/groupsApiService';
import GroupsList from '@/components/GroupsList.vue';
import UserDebtsList from '@/components/UserDebtsList.vue';

const groups = ref([]);

onMounted(async () => {
  groups.value = await getGroups();
});

const createGroup = () => {
  console.log('Create group')
}

const joinGroup = () => {
  console.log('Join group')
}

</script>

<template>
  <BaseLayout>
    <div class="flex flex-col gap-4">
      <div>
        <div class="text-sm font-bold">Debts</div>
        <UserDebtsList />
      </div>
      
      <div>
        <div class="flex justify-between">
          <div class="text-sm font-bold">Groups</div>
          <div class="flex gap-2">
            <button @click="joinGroup" class="px-3 py-1 cursor-pointer rounded bg-black text-sm text-white">Join group</button>
            <button @click="createGroup" class="px-3 py-1 cursor-pointer rounded bg-black text-sm text-white">Create group</button>
          </div>
        </div>
      </div>
    </div>
    <GroupsList :groups />
  </BaseLayout>
</template>
