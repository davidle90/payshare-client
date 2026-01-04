<script setup>
import { useAuthStore } from '@/stores/auth';
import { computed, ref } from 'vue';

const props = defineProps({
    groups: Array
})

const authStore = useAuthStore();
const user = computed(() => authStore.user)

const debts = computed(() =>
    props.groups.flatMap(g => g.debts)
)

const members = computed(() => 
    props.groups.flatMap(g => g.members)
)

const userById = computed(() => {
    const map = new Map()

    for (const member of members.value) {
        map.set(member.user.id, member.user.username)
    }

    return map
})

const displayDebts = computed(() =>
    debts.value
        .filter(d => d.fromUser === user.value.userId)
        .map(d => ({
            fromUsername: userById.value.get(d.fromUser),
            toUsername: userById.value.get(d.toUser),
            amount: d.amount,
        }))
)

</script>

<template>
    <div class="container mx-auto">
      <div v-if="debts.length">
        <ul class="space-y-3">
            <li
                v-for="debt in displayDebts"
                :key="debt.id"
                class="flex items-center justify-between rounded-lg border px-4 py-3"
            >
                <div class="text-sm">
                    <p class="font-medium text-gray-900">
                        {{ debt.toUsername }}
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

      <div v-else class="text-center py-12">
        <p class="text-lg font-medium text-gray-500">You can lean back, there is nothing to do :)</p>
      </div>
    </div>
</template>