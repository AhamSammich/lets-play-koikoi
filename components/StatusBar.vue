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
    class="flex flex-row items-center justify-around p-4 fixed top-0 right-0 w-screen opacity-30 text-white z-10"
  >
    <div id="p1-score">
      <p>PLAYER 1</p>
      <p>{{ score.p1 }}</p>
    </div>
    <div id="round-num">
      <p>ROUND</p>
      <p>{{ roundNum }}</p>
    </div>
    <div id="p2-score">
      <p>PLAYER 2</p>
      <p>{{ score.p2 }}</p>
    </div>
  </header>
</template>

<style scoped lang="postcss">
#status {
  transition: all 0.5s;

  &:hover {
    background: var(--tbl-black);
    opacity: 1;
  }
}
p {
  font-weight: bold;
  font-size: smaller;
  text-align: center;
}
</style>
