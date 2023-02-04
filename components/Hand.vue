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
        :id="`${player || 'field'}-${index}`"
        :class="`${player ? 'p-card' : 'f-card'}`"
      >
        <!-- Get selected card details and check table for match -->
        <Card :name="card" :hide="player.includes('2')" @card-select="(cardName: string) => checkForMatch(cardName)" />
      </div>
    </template>
  </div>
</template>

<style lang="postcss">
@container (width < 900px) {
  .p-card {
    margin-right: -2rem;
    margin-bottom: -3rem;
  }
}


.hand {
  container-type: inline-size;
  width: 100%;
  height: inherit;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 0.2rem;
  animation: fanOut 2s;
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
