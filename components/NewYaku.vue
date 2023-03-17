<script setup lang="ts">
const props = defineProps<{
  showModal: boolean;
  player: string;
  yakuList: Dict;
  koikoiAllowed: boolean; // Hide Koi Koi button if no cards in hand
}>();

const emits = defineEmits(["koi-koi"]);
const tableVisible = ref(false);

function callKoiKoi() {
  emits("koi-koi", true, props.player);
}

function callShoubu() {
  emits("koi-koi", false, props.player);
}

onMounted(async () => {
  if (props.player === "p1") return;
  await sleep(2000);
  callShoubu();
});
</script>

<template>
  <dialog :open="showModal" aria-modal="true">
    <!-- Toggle button to reveal the table behind the modal -->
    <div id="new-yaku" :class="{ invisible: tableVisible }">
      <div class="yaku" v-for="yaku in Object.keys(yakuList)" :key="yaku">
        <h1>{{ yaku }}</h1>
        <div class="yaku-cards">
            <StaticCard v-for="card in yakuList[yaku]" :name="card" />
        </div>
      </div>
    </div>
    <div v-show="player === 'p1'" class="btn-bar">
      <button v-show="koikoiAllowed" @click="callKoiKoi()">KOI KOI</button>
      <button @click="callShoubu()">END ROUND</button>
    </div>
    <MenuButton v-show="player === 'p1'" id="toggle-btn" ico-name="mdi:eye" 
    class="top-4 opacity-50 z-50"
    @open-menu="tableVisible = true"
    @close-menu="tableVisible = false"
    />
  </dialog>
</template>

<style scoped lang="postcss">
#new-yaku {
  transition: opacity 0.3s;
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
    transform-origin: left;
    animation: spreadLeft 0.5s;
  }

  & :has(.card) {

    &:nth-child(n+6) {
      transform: translate3d(0, -20%, 0);
    }

    &:nth-child(n+11) {
      transform: translate3d(0, -40%, 0);
    }
    
    &:nth-child(6) {
      margin-left: 5%;
    }

  }
}

dialog, .btn-bar, button {
  transition: all 0.3s;
}

dialog:has(#new-yaku.invisible) {
  background: none;

  #new-yaku {
    transition: none;
    opacity: 0;
  }

  #toggle-btn {
    opacity: 1;
  }

  .btn-bar button {
    box-shadow: 0 0 1rem 0.1rem lightgoldenrodyellow;
  }

  @media (orientation: landscape) {

    & .btn-bar {
      flex-direction: column;
      max-width: max-content;
      gap: 1rem;
      position: absolute;
      right: 1rem;
    }

    & #toggle-btn {
      translate: 0 1.75rem;
    }
  }
}

@media (width > 800px) or (orientation: landscape) {
  #new-yaku { 
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }

  #toggle-btn {
    align-self: flex-end;
    top: -2.5rem;
    right: 1rem;
  }

  .yaku {
    width: 48vw;
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
