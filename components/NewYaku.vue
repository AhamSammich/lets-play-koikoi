<script setup lang="ts">
const props = defineProps<{
  showModal: boolean;
  player: string;
  yakuList: Dict;
  koikoiAllowed: boolean;  // Hide Koi Koi button if no cards in hand
}>();

const emits = defineEmits(["koi-koi"]);

function callKoiKoi() {
  emits("koi-koi", true, props.player);
}

function endGame() {
  emits("koi-koi", false, props.player);
}

onMounted(async () => {
  if (props.player === "p1") return;
  await new Promise((resolve) => setTimeout(resolve, 2000));
  endGame();
});
</script>

<template>
  <div :class="{ modal: true, hidden: !showModal }">
    <template v-for="yaku in Object.keys(yakuList)" :key="yaku">
      <h1>{{ yaku }}</h1>
      <div class="new-yaku">
        <template v-for="card in yakuList[yaku]">
          <div>
            <Card :name="card" />
          </div>
        </template>
      </div>
    </template>
    <template v-if="player === 'p1'">
      <div class="btn-bar">
        <template v-if="koikoiAllowed">
          <button @click="callKoiKoi()">KOI KOI!</button>
        </template>
        <button @click="endGame()">END ROUND</button>
      </div>
    </template>
  </div>
</template>

<style scoped lang="postcss">
.new-yaku {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 400px;
  gap: 0.2rem;
  pointer-events: none;
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
    background: linear-gradient(45deg, goldenrod, palegoldenrod);
  }
}

h1 {
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
