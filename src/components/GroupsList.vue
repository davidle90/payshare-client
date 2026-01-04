<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
    groups: Array
})

const router = useRouter();

const goToGroup = async (referenceId) => {
    if(!referenceId) return
    router.push('/groups/'+referenceId)
}
</script>

<template>
    <div class="container mx-auto">
      <div v-if="groups.length">
        <table class="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">
                        Name
                    </th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">
                        Reference ID
                    </th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">
                        Total Expense
                    </th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">
                        Members
                    </th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
                <tr
                    v-for="group in groups"
                    :key="group.id"
                    @click="goToGroup(group.referenceId)"
                    class="cursor-pointer hover:bg-gray-50 transition-colors"
                >
                    <td class="px-4 py-3 text-sm text-gray-900">
                        {{ group.name }}
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-900">
                        {{ group.referenceId }}
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-900">
                        {{ group.totalExpenses }} {{ group.currency }}
                    </td>
                    <td class="px-4 py-3 text-sm 900-gray-500">
                        {{ group.members?.length }}
                    </td>
                </tr>
            </tbody>
        </table>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-lg font-medium text-gray-500">No groups found</p>
      </div>
    </div>
</template>