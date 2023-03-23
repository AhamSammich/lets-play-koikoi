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

// const cards = props.player === "p1" ? STORE.useHand1() : STORE.useHand2();
const cards = computed(() => playerStore[props.player].cardsInHand);
const tableStore = useTableStore();
const { cardSelected, matchSelected } = storeToRefs(tableStore);
const selectingMatch = computed(() => cardSelected.value && !matchSelected.value);

// If match, props.cards will be updated
function selectCard(cardName: string) {
  if (cardName == null || activeP.value !== "p1") return;
  emits("check-match", cardName);
}
</script>

<template>
  <div :class="{ hand: true, 'pointer-events-none opacity-70': selectingMatch }">
    <template v-if="player === 'p1'">
      <!-- Get selected card details and check table for match -->
      <Card
        v-for="card in cards"
        :name="card"
        @card-select="(cardName: string) => selectCard(cardName)"
      />
    </template>
    <template v-else>
      <!-- Render facedown cards with no names. -->
      <StaticCard v-for="card in cards" />
    </template>
  </div>
</template>

<style scoped lang="postcss">
.hand {
  height: inherit;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.3rem;
  margin-left: 0.5rem;
  transform-origin: left;
  transition: opacity 0.5s;
}

@media (width < 800px) {
  .hand > * {
    max-width: 60px;

    &:nth-child(5) {
      margin-left: 10%;
    }

    &:nth-child(n + 5) {
      margin-top: -10%;
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
