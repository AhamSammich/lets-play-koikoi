<script setup lang="ts">
import { getYakuScore, processYakuList } from "~~/assets/scripts/match";

const props = defineProps<{
  showModal: boolean;
  player: string;
  yakuList: Dict;
  koikoi: boolean;
}>();

const emits = defineEmits(["reset", "next"]);
let score: number;
let finalList: Dict;

function resetGame() {
  emits("reset", score);
}

onBeforeMount(() => {
  finalList = processYakuList(props.yakuList);
  score = getYakuScore(finalList, props.koikoi)
});
</script>

<template>
  <div :class="{ modal: true, hidden: !showModal }">
    <h1>{{ player }}: <span id="points">{{ score + `${score === 1 ? ' point' : ' points'}` }}</span></h1>
    <div id="scoresheet">
      <template v-for="yaku in Object.keys(finalList)" :key=yaku>
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
    justify-content: center;
    align-items: flex-start;
    align-self: flex-start;

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

.modal {
  background: hsl(0 0% 13% / 0.9);
  width: 100%;
  height: 100vh;
  height: 100dvh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  position: fixed;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  color: white;
  font-size: x-large;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 0.2rem;
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(
      45deg,
      goldenrod,
      palegoldenrod
    );
  }
}

h1,
h2 {
  font-weight: bold;
  font-size: larger;
  text-transform: uppercase;
}

.btn-bar {
  width: 100%;
  max-width: 400px;
  display: flex;
  justify-content: space-around;
  pointer-events: all;

  & button {
    outline: 1px solid yellow;
    border-radius: 0.2rem;
    background: firebrick;
    padding: 0.5em 1em;
    font-weight: bold;
    font-size: smaller;

    &:hover {
      transform: translate3d(0, -5%, 0);
    }
  }
}

.hidden {
  display: none;
}
</style>
