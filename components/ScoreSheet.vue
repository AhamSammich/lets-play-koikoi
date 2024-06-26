<script setup lang="ts">
import { useDesignStore } from '~~/stores/designStore';

const props = defineProps<{
  showModal: boolean;
  player: string | null;
  yakuList: Dict | null;
  koikoi: number;
}>();

const emits = defineEmits(["reset", "next"]);
const doubledOverSeven = RULES.useDoubledOverSeven();
const roundNum = STORE.useRoundNum();
const maxRounds = RULES.useMaxRounds();
const designStore = useDesignStore();
const activeDesignName = computed(() => designStore.activeDesignName);

let score = 0;
let finalList: Dict;

function resetGame() {
  emits("reset", score);
}

function bonusAdded(baseScore: number): number {
  let finalScore = baseScore;
  if (doubledOverSeven.value && score >= 7) finalScore *= 2;
  finalScore *= 1 + props.koikoi;
  return finalScore;
}

onBeforeMount(() => {
  if (props.yakuList === null) return;
  finalList = processYakuList(props.yakuList);
  score = getYakuScore(finalList);
  score = bonusAdded(score);
});
</script>

<template>
  <dialog :open="showModal" aria-modal="true" :class="activeDesignName">
    <div id="points" class="mt-12 md:mt-4 relative">
      <h1>{{ player || "draw" }}</h1>
      <h2 :class="{ bonus: koikoi && score > 0 }">
        {{ score + `${score === 1 ? " point" : " points"}` }}
      </h2>
      <div
        v-if="koikoi && yakuList"
        class="flex items-center gap-2 w-max absolute left-8 -top-1/2 md:static"
      >
        <p class="text-sm">KOI-KOI BONUS:</p>
        <div class="relative flex gap-1 w-max">
          <img
            v-for="n in koikoi"
            src="/images/webp/coin.webp" 
            alt="coin for koikoi"
            class="coin relative w-6"
          />
        </div>
      </div>
    </div>
    <div v-if="player && yakuList" id="scoresheet">
      <div v-for="yaku in Object.keys(finalList)" :key="yaku" class="yaku">
        <h2>{{ yaku }}</h2>
        <div class="yaku-cards">
          <StaticCard v-for="card in finalList[yaku]" :key="card" :name="card" />
        </div>
      </div>
    </div>
    <div class="btn-bar">
      <button @click="resetGame()" autofocus="true" tabindex="1">
        <template v-if="roundNum === maxRounds">
          VIEW RESULTS
        </template>
        <template v-else>
          NEXT ROUND
        </template>
      </button>
    </div>
  </dialog>
</template>

<style scoped lang="postcss">
#scoresheet {
  width: 100vw;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding-top: 20px;
  padding-bottom: 5%;
  justify-content: flex-start;
  align-items: flex-start;
  align-self: flex-start;
  mask-image: linear-gradient(180deg, transparent, #111 25px 90%, transparent);
  overflow-y: scroll;

  & .yaku {
    padding-left: 2rem;
  }

  & .yaku-cards {
    --card-width: 60px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    max-width: 350px;
    gap: 0.2rem;
    pointer-events: none;

    & :nth-child(n + 6) {
      transform: translate3d(0, -20%, 0);
    }

    & :nth-child(n + 11) {
      transform: translate3d(0, -40%, 0);
    }

    & :nth-child(6) {
      margin-left: 5%;
    }
  }

  & h2 {
    font-family: "Potta One", Verdana, sans-serif;
    letter-spacing: 0.05em;
  }
}

#points {
  width: 100%;
  display: flex;
  padding: 0 2rem;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  transition: all 0.5s;

  & h2 {
    font-size: 32px;

    &.bonus {
      color: transparent;
      background: var(--gradient-gold);
      background-clip: text;
    }
  }
}

@media (width > 800px) or (orientation: landscape) {
  #scoresheet {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  #points h2 {
    margin: 0 1rem;
  }

  .yaku {
    width: 48vw;
  }
}
</style>
