<script setup>
import BaseLayout from '@/layouts/BaseLayout.vue';
import { getGroup } from '@/services/groupsApiService';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const group = ref(null)
const members = ref([]);
const expenses = ref([]);
const referenceId = route.params.id;

onMounted(async () => {
  group.value = await getGroup(referenceId);
  members.value = group.value.members;
  expenses.value = group.value.expenses;
});
</script>

<template>
    <BaseLayout>
        <div v-if="group">
            <strong>{{ group.name }}</strong>
            
            <div class="flex flex-col gap-4">
                <div>
                    <h1 class="font-bold">Members</h1>
                    <div v-for="member in members">
                        <span class="capitalize">{{ member.user.username }}</span>
                    </div>
                </div>

                <div>
                    <h1 class="font-bold">Expenses</h1>
                    <div v-for="expense in expenses">
                        <span class="capitalize">{{ expense.name }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <p>Loading...</p>
        </div>
  </BaseLayout>
</template>