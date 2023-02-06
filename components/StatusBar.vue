<script setup lang="ts">
const props = defineProps<{
  roundNum: number;
  score: { p1: number; p2: number };
  oya: string;
}>();
</script>

<template>
  <header
    id="status"
    class="flex items center justify-between px-4 py-1 fixed top-0 left-0 w-screen bg-gray-900 bg-opacity-50 text-white z-10"
  >
    <p id="p1-score" :class="{ oya: oya === 'p1' }">P1: {{ score.p1 }}</p>
    <p id="round-num">ROUND {{ roundNum }}</p>
    <p id="p2-score" :class="{ oya: oya === 'p2' }">P2: {{ score.p2 }}</p>
  </header>
</template>

<style scoped lang="postcss">
p {
    font-weight: bold;
}
</style>
