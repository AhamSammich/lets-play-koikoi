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
  emits("new-yaku", yakuArr, props.player);
}

onBeforeUpdate(() => {
  sortedCards = sortCardsByType(props.cards);
});

onUpdated(() => {
  let yakuArr = checkForYaku(props.cards);
  yakuArr = yakuArr.filter((yakuName) => yakuName && !yakuList.has(yakuName));
  console.log(yakuArr);
  if (yakuArr.length) registerYaku(yakuArr);
});
</script>

<template>
  <div :id="`${player}-collected`">
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
.subset {
  display: flex;
  flex-wrap: wrap;
  max-width: 180px;
  min-height: 50px;
  gap: 0.1rem;

  & > * {
    width: 30px;
    height: 45px;
    margin-bottom: -1rem;
  }
}
</style>
