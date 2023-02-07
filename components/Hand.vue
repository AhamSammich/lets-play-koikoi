<script setup lang="ts">
const props = defineProps<{
  isActive: boolean;
  player: string;
  cards: string[];
}>();

// Emit card detail to Table
const emits = defineEmits(['check-match', 'set-selected']);

// If match, props.cards will be updated
function checkForMatch(cardName: string) {
  if (cardName == null || props.isActive === false) return;
  emits('check-match', cardName);
}
</script>

<template>
  <div class="hand" :style="`${isActive ? '' : 'pointer-events: none;'}`">
    <template v-for="(card, index) in cards">
      <div
        :id="`${player}-${index}`"
        :class="`${player ? 'p-card' : 'f-card'}`"
      >
        <!-- Get selected card details and check table for match -->
        <Card :name="card" :hide="player.includes('2')" @card-select="(cardName: string) => checkForMatch(cardName)" />
      </div>
    </template>
  </div>
</template>

<style lang="postcss">
.hand {
  height: inherit;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.2rem;
  margin-left: 0.5rem;
  transform-origin: left;
  animation: fanOut 2s;
}

@media (width < 800px) {
  .p-card {
    margin-right: -1.5rem;
    margin-bottom: -3rem;
  }
  .hand {
    scale: 0.75;
  }
}

@keyframes fanOut {
  from {
    gap: 3rem;
  }
  to {
    gap: 0.2rem;
  }
}
</style>
