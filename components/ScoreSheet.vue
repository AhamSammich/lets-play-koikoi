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
    <h1>
      {{ player || "draw" }}
    </h1>
    <h2 id="points">{{ score + `${score === 1 ? " point" : " points"}` }}</h2>
    <template v-if="player && yakuList">
      <div id="scoresheet">
        <template v-for="yaku in Object.keys(finalList)" :key="yaku">
          <h2>{{ yaku }}</h2>
          <div class="yaku">
            <template v-for="card in finalList[yaku]">
              <div class="card">
                <Card :name="card" />
              </div>
            </template>
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
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 5%;
  padding-bottom: 5%;
  justify-content: flex-start;
  align-items: flex-start;
  align-self: flex-start;
  mask-image: linear-gradient(
    180deg,
    transparent,
    #111 4% 96%,
    transparent
  );
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 0.2rem;
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, goldenrod, palegoldenrod);
  }
}

#points {
  font-size: 44px;
}

.yaku {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  max-width: 540px;
  gap: 0.2rem;
  pointer-events: none;
}

.card {
  max-width: 50px;
  max-height: 75px;
}
</style>
