<script setup lang="ts">
import { useScore1, useScore2 } from '~~/components/composables/game';
const roundNum = ref(0);
const score1 = useScore1();
const score2 = useScore2();

// const newOya = useOya();

</script>

<template>
  <div>
    <StatusBar :round-num="roundNum" :score="{ p1: score1, p2: score2 }" oya="p1"/>
    <Table @next-round="roundNum++"/>
  </div>
</template>

<style lang="postcss">
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
</style>
