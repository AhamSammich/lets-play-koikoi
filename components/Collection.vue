<script setup lang="ts">
import { checkForYaku, sortCardsByType, getCardsInYaku } from "~~/assets/scripts/match";

const props = defineProps<{
  player: string;
  cards: string[];
}>();

const emits = defineEmits(["new-yaku"]);

const yakuList = new Map();
let sortedCards = sortCardsByType(props.cards);

function registerYaku(yakuArr: string[]) {
  yakuArr.forEach((yakuName) =>
    yakuList.set(yakuName, getCardsInYaku(yakuName, props.cards))
  );
  console.dir(yakuList);
  emits("new-yaku", yakuArr, props.player);
}

onBeforeUpdate(() => {
  if (props.cards.length === 0) yakuList.clear();
  sortedCards = sortCardsByType(props.cards);
});

onUpdated(() => {
  let yakuArr = checkForYaku(props.cards);
  yakuArr = yakuArr.filter((yakuName) => yakuName && !yakuList.has(yakuName));
  console.log(`%c${props.player.toUpperCase()} found: `, 'color: pink', yakuArr);
  if (yakuArr.length) registerYaku(yakuArr);
});
</script>

<template>
  <div :id="`${player}-collected`" class="collected">
    <div :id="`${player}-brights`" class="subset">
      <template v-for="card in sortedCards['brights']" :key="card">
        <Card :name="card" />
      </template>
    </div>
    <div :id="`${player}-animals`" class="subset">
      <template v-for="card in sortedCards['animals']" :key="card">
        <Card :name="card" />
      </template>
    </div>
    <div :id="`${player}-ribbons`" class="subset">
      <template v-for="card in sortedCards['ribbons']" :key="card">
        <Card :name="card" />
      </template>
    </div>
    <div :id="`${player}-plains`" class="subset">
      <template v-for="card in sortedCards['plains']" :key="card">
        <Card :name="card" />
      </template>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.collected {
  --card-w: 28px;
  --card-h: calc(var(--card-w)*1.5);
  /* width: inherit;
  height: inherit; */
  display: grid;
  grid-template-columns: repeat(2, calc(5.5*var(--card-w)));
  grid-template-rows: repeat(2, calc(1*var(--card-h)));
  gap: 0.2rem;
}

.subset {
  display: flex;
  flex-wrap: wrap;
  max-width: 180px;
  min-height: 50px;
  gap: 0.1rem;

  & > * {
    width: var(--card-w);
    height: var(--card-h);
    margin-bottom: -1rem;
  }
}
</style>
