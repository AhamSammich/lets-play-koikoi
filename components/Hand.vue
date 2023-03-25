<script setup lang="ts">
import { storeToRefs } from "pinia";
import { usePlayerStore } from "~~/stores/playerStore";
import { useTableStore } from "~~/stores/tableStore";

const props = defineProps<{
  player: string;
}>();

// Emit card detail to Table
const emits = defineEmits(["check-match"]);
const activeP = STORE.useActiveP();
const playerStore = usePlayerStore();
const imagesLoading = ref(8);

const cards = computed(() => playerStore[props.player].cardsInHand);
const tableStore = useTableStore();
const { cardSelected, cardPreviewed, matchSelected } = storeToRefs(tableStore);
const selectingMatch = computed(() => cardSelected.value && !matchSelected.value);
const isP1Turn = computed(() => activeP.value === "p1");
const isSelectedCard = (card: string) => isP1Turn.value && card === cardSelected.value;
const isPreviewedCard = (card: string) => isP1Turn.value && card === cardPreviewed.value;

// If match, props.cards will be updated
function selectCard(cardName: string) {
  if (cardName == null || !isP1Turn.value) return;
  emits("check-match", cardName);
}

function countLoaded() {
  imagesLoading.value--;
}
</script>

<template>
  <div
    :class="{
      hand: true,
      'pointer-events-none opacity-70': selectingMatch,
    }"
  >
    <template v-if="player === 'p1'">
      <div v-if="imagesLoading > 0" class="w-full flex justify-center">
        <div class="card down loading rotate-12"></div>
      </div>
      <!-- Get selected card details and check table for match -->
      <Card
        v-for="card in cards"
        :name="card"
        :class="{
          'opacity-0': imagesLoading > 0,
          selected: isSelectedCard(card),
          previewed: isPreviewedCard(card),
        }"
        @img-loaded="countLoaded"
        @card-select="(cardName: string) => selectCard(cardName)"
      />
    </template>
    <template v-else>
      <!-- Render facedown cards with no names. -->
      <StaticCard v-for="_ in cards" />
    </template>
  </div>
</template>

<style scoped lang="postcss">
.hand {
  --card-width: 60px;
  height: inherit;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.3rem;
  margin-left: 0.5rem;
  transform-origin: left;
  transition: opacity 0.5s;

  & .previewed {
    z-index: 2;
  }

  & .selected {
    z-index: 3;
  }
}

@media (width < 768px) {
  .hand > * {
    max-width: 60px;
    z-index: 0;

    &:nth-child(5) {
      margin-left: 10%;
    }

    &:nth-child(n + 5) {
      margin-top: -10%;
      z-index: 1;
    }
  }

  .hand {
    flex-wrap: wrap;
    max-width: calc(var(--card-width) * 5);
    gap: 0.5rem;
    z-index: 1;
  }
}
</style>
