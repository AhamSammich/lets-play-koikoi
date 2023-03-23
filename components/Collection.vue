<script setup lang="ts">
const props = defineProps<{
  player: string;
  cards: string[];
}>();

const emits = defineEmits(["collecting", "new-yaku", "no-yaku"]);
const viewingsAllowed = RULES.useViewingsAllowed();
const restrictedYaku = new Set(["hanami-zake", "tsukimi-zake"]);

const yakuMap: Map<string, string[]> = new Map();
let sortedCards = sortCardsByType(props.cards);

function registerYaku(yakuArr: string[]) {
  yakuArr.forEach((yakuName) =>
    yakuMap.set(yakuName, getCardsInYaku(yakuName, props.cards))
  );
  emits("new-yaku", yakuArr, props.player);
}

// Filter given array for yaku already attained
// Resubmit tan-zaku, tane-zaku, and kasu if improved
function filterYaku(yakuArr: string[]) {
  for (let yakuName of yakuArr) {
    // Find yaku already attained in yakuMap
    let arrFromMap = yakuMap.get(yakuName);
    if (arrFromMap === undefined) continue;
    // Remove yaku from yakuMap if improved
    switch (yakuName) {
      case "tan-zaku":
        if (arrFromMap.length < sortedCards["ribbons"].length) yakuMap.delete(yakuName);
        break;
      case "tane-zaku":
        if (arrFromMap.length < sortedCards["animals"].length) yakuMap.delete(yakuName);
        break;
      case "kasu":
        if (arrFromMap.length < sortedCards["plains"].length) yakuMap.delete(yakuName);
        break;
    }
  }
  // Filter given array for names not in yakuMap
  // Return new array
  return yakuArr.filter((yakuName) => yakuName && !yakuMap.has(yakuName));
}

function allowViewings(yakuArr: string[]): string[] {
  switch (viewingsAllowed.value) {
    case 0: // 0 => never allowed
      return yakuArr.filter((yakuName) => !restrictedYaku.has(yakuName));

    case 1: // 1 => limited allowance
      // Yaku not allowed if players has no non-viewing yaku
      if (yakuMap.size === 0 && yakuArr.every((yaku) => restrictedYaku.has(yaku)))
        return yakuArr.filter((yakuName) => !restrictedYaku.has(yakuName));

    default:
      // 2 => allow always
      return yakuArr;
  }
}

onBeforeUpdate(() => {
  emits("collecting");
  if (props.cards.length === 0) yakuMap.clear();
  sortedCards = sortCardsByType(props.cards);
});

onUpdated(() => {
  let yakuArr = checkForYaku(props.cards);
  yakuArr = filterYaku(yakuArr);
  yakuArr = allowViewings(yakuArr);
  if (yakuArr.length) registerYaku(yakuArr);
  else emits("no-yaku");
});
</script>

<template>
  <div :id="`${player}-collected`" class="collected">
    <div :id="`${player}-brights`" class="subset">
      <StaticCard v-for="card in sortedCards['brights']" :key="card" :name="card" />
    </div>
    <div :id="`${player}-animals`" class="subset">
      <StaticCard v-for="card in sortedCards['animals']" :key="card" :name="card" />
    </div>
    <div :id="`${player}-ribbons`" class="subset">
      <StaticCard v-for="card in sortedCards['ribbons']" :key="card" :name="card" />
    </div>
    <div :id="`${player}-plains`" class="subset">
      <StaticCard v-for="card in sortedCards['plains']" :key="card" :name="card" />
    </div>
  </div>
</template>

<style scoped lang="postcss">
.collected {
  --card-w: 25px;
  --card-h: calc(var(--card-w) * 1.5);
  --row-w: calc(6 * var(--card-w));
  display: grid;
  grid-template-columns: repeat(2, max-content);
  grid-template-rows: repeat(2, calc(1.3 * var(--card-h)));
  gap: 0.3rem 1rem;

  @media (orientation: portrait) {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
}

.subset {
  display: flex;
  flex-wrap: wrap;
  width: max-content;
  max-width: var(--row-w);
  min-height: 50px;
  overflow: hidden;
  /* 
  & * {
    transition: none;
    animation: none;
  } */

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
