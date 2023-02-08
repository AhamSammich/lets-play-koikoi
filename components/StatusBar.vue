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
    class="flex flex-col items-center justify-around p-1 fixed top-0 right-0 h-screen bg-gray-900 bg-opacity-50 opacity-25 text-white z-10"
  >
    <div id="p2-score">
      <p>P2</p>
      <p>{{ score.p2 }}</p>
    </div>
    <div id="round-num">
      <p>RND</p>
      <p>{{ roundNum }}</p>
    </div>
    <div id="p1-score">
      <p>P1</p>
      <p>{{ score.p1 }}</p>
    </div>
  </header>
</template>

<style scoped lang="postcss">
#status {
  transition: opacity 0.5s;

  &:hover {
    opacity: 1;
  }
}
p {
    font-weight: bold;
    font-size: smaller;
    text-align: center;
}
</style>
