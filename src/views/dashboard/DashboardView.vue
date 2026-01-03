<script setup>
import { onMounted, ref } from 'vue';
import BaseLayout from '../../layouts/BaseLayout.vue';
import { getGroup, listGroups } from '../../services/groupsApiService';
import { useRouter } from 'vue-router';

const router = useRouter();
const groups = ref([]);

onMounted(async () => {
  groups.value = await listGroups();
});

const goToGroup = async (referenceId) => {
  if(!referenceId) {
    return;
  }
  router.push('/groups/'+referenceId)
}

</script>

<template>
  <BaseLayout>
    <div class="flex justify-center items-center py-6 bg-gray-50 shadow-md rounded-md mb-6">
      <h2 class="text-3xl font-semibold text-center text-gray-800">DASHBOARD</h2>
    </div>

    <div class="container mx-auto px-4 py-6">
      <div v-if="groups.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="group in groups" :key="group.id" @click="goToGroup(group.referenceId)" class="cursor-pointer bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-900">{{ group.name }}</h3>
            <p class="mt-2 text-gray-600 text-xs">#{{ group.referenceId }}</p>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-lg font-medium text-gray-500">No groups found</p>
      </div>
    </div>
  </BaseLayout>
</template>
