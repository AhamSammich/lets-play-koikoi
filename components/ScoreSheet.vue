<script setup lang="ts">
import { getYakuScore, processYakuList } from "~~/assets/scripts/match";

const props = defineProps<{
  showModal: boolean;
  player: string | null;
  yakuList: Dict | null;
  koikoi: boolean;
}>();

const emits = defineEmits(["reset", "next"]);
let score = 0;
let finalList: Dict;

function resetGame() {
  emits("reset", score);
}

onBeforeMount(() => {
  if (props.yakuList === null) return;
  finalList = processYakuList(props.yakuList);
  score = getYakuScore(finalList, props.koikoi);
});
</script>

<template>
  <div :class="{ modal: true, hidden: !showModal }">
    <div id="points">
      <h1>{{ player || "draw" }}</h1>
      <h2>{{ score + `${score === 1 ? " point" : " points"}` }}</h2>
    </div>
    <template v-if="player && yakuList">
      <div id="scoresheet">
        <template v-for="yaku in Object.keys(finalList)" :key="yaku">
          <div class="yaku">
            <h2>{{ yaku }}</h2>
            <div class="yaku-cards">
              <template v-for="card in finalList[yaku]">
                <div class="card">
                  <Card :name="card" />
                </div>
              </template>
            </div>
          </div>
        </template>
      </div>
    </template>
    <div class="btn-bar">
      <!-- <button @click="">END GAME</button> -->
      <button @click="resetGame()">NEXT ROUND</button>
    </div>
  </div>
</template>

<style scoped lang="postcss">
#scoresheet {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 25px;
  padding-bottom: 5%;
  justify-content: flex-start;
  align-items: flex-start;
  align-self: flex-start;
  mask-image: linear-gradient(
    180deg,
    transparent,
    #111 25px 95%,
    transparent
  );
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 0.2rem;
    background: none;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, goldenrod, palegoldenrod);
  }

  & * {
    animation: none;
  }
}

#points {
  width: 100vw;
  display: flex;
  padding: 0 2rem;
  justify-content: flex-start;
  align-items: center;
  gap: 2rem;

  & h2 {
  font-size: 44px;
  }
    
}

.yaku {
  /* width: 45vw; */
  padding-left: 2rem;
}

.yaku-cards {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  max-width: 300px;
  gap: 0.2rem;
  pointer-events: none;
}

.card {
  max-width: 50px;
  max-height: 75px;

  &:nth-child(n+6) {
    transform: translate3d(0, -50%, 0);
  }
  
  &:nth-child(6) {
    margin-left: 10%;
  }

}

@media (width > 800px) {
  #scoresheet { 
    flex-direction: row;
    flex-wrap: wrap;
  }

  .yaku {
    width: 45vw;
  }
}
</style>
