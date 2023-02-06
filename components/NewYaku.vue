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
</style>
