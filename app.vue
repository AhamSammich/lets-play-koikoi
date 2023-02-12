<script setup lang="ts">
import { STORE} from '~~/components/composables/game';
const roundNum = ref(1);
const score1 = STORE.useScore1();
const score2 = STORE.useScore2();

// const newOya = useOya();

</script>

<template>
  <main>
    <StatusBar :round-num="roundNum" :score="{ p1: score1, p2: score2 }" oya="p1"/>
    <Table @next-round="roundNum++"/>
  </main>
</template>

<style lang="postcss">
@import url('https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&display=swap');

* {
  --tbl-green: rgb(19, 86, 44);
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Mochiy Pop One', sans-serif;
}

main {
  background-color: var(--tbl-green);
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  overflow-y: scroll;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 0.2rem;
    background: none;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, goldenrod, palegoldenrod);
  }
}
</style>
