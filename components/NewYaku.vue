<script setup lang="ts">
const props = defineProps<{
  showModal: boolean;
  player: string;
  yakuList: Dict;
  koikoiAllowed: boolean; // Hide Koi Koi button if no cards in hand
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
    <div id="new-yaku">
      <template v-for="yaku in Object.keys(yakuList)" :key="yaku">
        <div class="yaku">
          <h1>{{ yaku }}</h1>
          <div class="yaku-cards">
            <template v-for="card in yakuList[yaku]">
              <div class="card">
                <Card :name="card" />
              </div>
            </template>
          </div>
        </div>
      </template>
    </div>
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
#new-yaku {
  width: 100vw;
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
}

.yaku {
  /* width: 45vw; */
  padding-left: 2rem;
}

.yaku-cards {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  max-width: 350px;
  gap: 0.2rem;
  pointer-events: none;
  transform-origin: left;
  animation: spreadLeft 0.5s;
}

.card {
  max-width: 60px;
  aspect-ratio: 2 / 3;

  &:nth-child(n+6) {
    transform: translate3d(0, -50%, 0);
  }
  
  &:nth-child(6) {
    margin-left: 10%;
  }

}

@media (width > 800px) or (orientation: landscape) {
  #new-yaku { 
    flex-direction: row;
    flex-wrap: wrap;
  }

  .yaku {
    width: 45vw;
  }
}

@keyframes spreadLeft {
  from {
    scale: 0 1;
    opacity: 0;
  }
  to {
    scale: 1 1;
    opacity: 1;
  }
}
</style>
