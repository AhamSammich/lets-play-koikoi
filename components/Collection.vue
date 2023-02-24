<script setup lang="ts">
const props = defineProps<{
  player: string;
  cards: string[];
}>();

const emits = defineEmits(["collecting", "new-yaku", "no-yaku"]);
const viewingsAllowed = RULES.useViewingsAllowed();
const restrictedYaku = new Set(["hanami-zake", "tsukimi-zake"]);

const yakuList = new Map();
let sortedCards = sortCardsByType(props.cards);

function registerYaku(yakuArr: string[]) {
  yakuArr.forEach((yakuName) =>
    yakuList.set(yakuName, getCardsInYaku(yakuName, props.cards))
  );
  emits("new-yaku", yakuArr, props.player);
}

function allowViewings(yakuArr: string[]): string[] {
  switch (viewingsAllowed.value) {
    case 0:  // 0 => never allowed
      return yakuArr.filter((yakuName) => !restrictedYaku.has(yakuName));

    case 1:  // 1 => limited allowance
      // Yaku not allowed if players has no non-viewing yaku
      if (yakuList.size === 0 && yakuArr.every(yaku => restrictedYaku.has(yaku)))
        return yakuArr.filter((yakuName) => !restrictedYaku.has(yakuName));

    default:  // 2 => allow always
      return yakuArr;
  }
}

onBeforeUpdate(() => {
  emits("collecting");
  if (props.cards.length === 0) yakuList.clear();
  sortedCards = sortCardsByType(props.cards);
});

onUpdated(() => {
  let yakuArr = checkForYaku(props.cards);
  yakuArr = yakuArr.filter((yakuName) => yakuName && !yakuList.has(yakuName));
  yakuArr = allowViewings(yakuArr);
  if (yakuArr.length) registerYaku(yakuArr);
  else emits("no-yaku");
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
  --card-w: 35px;
  --card-h: calc(var(--card-w) * 1.5);
  --row-w: calc(5.2 * var(--card-w));
  display: grid;
  grid-template-columns: repeat(2, var(--row-w));
  grid-template-rows: repeat(2, calc(1.3 * var(--card-h)));
  gap: 0.1rem;

  @media (orientation: portrait) {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
}

.subset {
  display: flex;
  flex-wrap: wrap;
  max-width: var(--row-w);
  min-height: 50px;
  overflow: hidden;

  & > * {
    width: var(--card-w);
    height: var(--card-h);
  }

  & > *:nth-child(6) {
    margin-left: calc(0.2 * var(--card-h));
  }

  & > *:nth-child(n + 6) {
    margin-top: calc(-0.7 * var(--card-h));
  }
}
</style>
