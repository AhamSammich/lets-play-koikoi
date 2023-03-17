<script setup lang="ts">
defineProps<{
  showModal: boolean;
  matchSrc?: string;
  cards: string[];
}>();

defineEmits(["match-select"]);
</script>

<template>
  <dialog :open="showModal" aria-modal="true" class="gap-4">
    <template v-if="matchSrc">
      <h1>{{ matchSrc.replace(/-\d?/g, " ").trim() }}</h1>
      <StaticCard id="match-src" :name="matchSrc" />
    </template>
    <h2>Pick a card:</h2>
    <!-- Get selected card details and check table for match -->
    <div id="choose-match">
      <Card
        v-for="(card, index) in cards"
        :id="`${index}`"
        class="cursor-pointer"
        :name="card"
        :interactive="true"
        @card-select="(cardName: string) => $emit('match-select', [matchSrc, cardName])"
      />
    </div>
  </dialog>
</template>

<style scoped lang="postcss">
#choose-match {
  --plus-angle: 10deg;
  --minus-angle: calc(-1 * var(--plus-angle));
  width: 300px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;

  & > :first-child {
    rotate: var(--minus-angle);
  }

  & > :last-child {
    rotate: var(--plus-angle);
  }

  & > :hover {
    translate: 0 -3%;
  }
}

h2 {
  letter-spacing: 0.05em;
}

#match-src {
  pointer-events: none;
  animation: none;
  width: 50px;
}
</style>
