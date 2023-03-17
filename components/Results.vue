<script setup lang="ts">
const props = defineProps<{
  showModal: boolean;
  scoreboard: Record<string, number>;
  resultsMap: Map<string, Record<string, unknown>>;
}>();

const playerWins = () => props.scoreboard.p1 > props.scoreboard.p2;
const playerLoses = () => props.scoreboard.p1 < props.scoreboard.p2;
</script>

<template>
  <dialog aria-modal="true" :open="showModal" class="flex flex-col items-center justify-start py-4 overflow-y-scroll z-40">

    <section class="game-result w-full flex-col flex items-center justify-start">
        <h1 v-if="playerWins()" class="win">YOU WIN</h1>
        <h1 v-else-if="playerLoses()">YOU LOSE</h1>
        <h1 v-else class="lose">DRAW</h1>
        <div class="flex justify-around w-full p-4">
            <h2>P1: <span :class="`text-xl mx-2 ${playerWins() ? 'win' : ''}`">{{ scoreboard.p1 }}</span> pts</h2>
            <h2>P2: <span :class="`text-xl mx-2 ${playerLoses() ? 'win' : ''}`">{{ scoreboard.p2 }}</span> pts</h2>
        </div>
    </section>
    <div class="flex flex-wrap gap-4 items-start w-full">
        <section v-for="key in resultsMap.keys()" :key="key" class="round-result min-w-1/2 px-8">
        <div>
            <h1 :class="{ win: resultsMap.get(key)?.winner === 'p1' }">ROUND {{ key }}</h1>
            <h2>{{ resultsMap.get(key)?.winner || "DRAW" }}</h2>
        </div>
        <div class="yaku-list flex flex-col gap-1">
            <div v-for="(yaku, index) in resultsMap.get(key)?.yaku" :key="yaku" class="yaku flex flex-wrap relative">
              <StaticCard v-for="card in yaku" :key="card" :name="card" />
            <p class="absolute top-1/2 -right-4 bg-black bg-opacity-80 p-2 -translate-y-1/2 uppercase text-xs rounded-lg">{{ index }}</p>
            </div>
        </div>
        </section>
    </div>
  </dialog>
</template>

<style scoped lang="postcss">
.win {
    background: var(--gradient-gold);
    background-clip: text;
    color: transparent;
}
.round-result {
  max-width: 800px;
  margin-bottom: 1rem;
  display: flex;
  gap: 1.5rem;
}

.yaku-list {
  --card-width: 30px;
  --card-radius: 0.5rem;
  width: calc(var(--card-width) * 6);

  & :nth-child(6) {
    margin-left: 1rem;
  }

  & :nth-child(n+6) {
    margin-top: -1rem;
  }
}
</style>
