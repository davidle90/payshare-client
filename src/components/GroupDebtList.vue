<script setup>
import { getGroupDebts } from '@/services/debtsApiService';
import { ref, computed, watch } from 'vue'

const props = defineProps({
    groupId: String
})

const debts = ref([]);

watch(
  () => props.groupId,
  async (id) => {
    if (!id) return
    debts.value = await getGroupDebts(id)
  },
  { immediate: true }
)

const visibleDebts = computed(() => {
  const seen = new Set()

  return debts.value.filter(debt => {
    if (debt.amount <= 0) return false

    const key = `${debt.fromUser.id}-${debt.toUser.id}`
    if (seen.has(key)) return false

    seen.add(key)
    return true
  })
})
</script>

<template>
  <div class="container mx-auto">
    <ul class="space-y-3">
      <li
        v-for="(debt, index) in visibleDebts"
        :key="index"
        class="flex items-center justify-between rounded-lg border px-4 py-3"
      >
        <p class="text-gray-900 font-semibold">
            {{ debt.fromUser.username }} owes {{ debt.toUser.username }}
        </p>

        <div class="text-sm font-semibold">
          {{ debt.amount }}
        </div>
      </li>
    </ul>

    <p v-if="!visibleDebts.length" class="text-sm text-gray-500">
      No outstanding debts
    </p>
  </div>
</template>