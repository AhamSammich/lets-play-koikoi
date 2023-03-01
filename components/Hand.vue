<script setup lang="ts">
defineProps<{
  player: string;
  cards: string[];
}>();

// Emit card detail to Table
const emits = defineEmits(["check-match"]);
const activeP = STORE.useActiveP();

// If match, props.cards will be updated
function selectCard(cardName: string) {
  if (cardName == null || activeP.value !== "p1") return;
  emits("check-match", cardName);
}
</script>

<template>
  <div class="hand">
    <template v-for="card in cards">
      <div class="player-card">
        <!-- Get selected card details and check table for match -->
        <Card
          :name="card"
          :hide="player === 'p2'"
          :interactive="player === 'p1'"
          @card-select="(cardName: string) => selectCard(cardName)"
        />
      </div>
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
}
.player-card > * {
  max-width: 60px;
}

@media (width < 800px) {
  .player-card {
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
