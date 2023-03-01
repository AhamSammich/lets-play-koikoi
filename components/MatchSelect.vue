<script setup lang="ts">
const props = defineProps<{
  showModal: boolean;
  matchSrc?: string;
  cards: string[];
}>();

const emits = defineEmits(["match-select"]);
</script>

<template>
  <dialog :open="showModal" aria-modal="true" class="gap-4">
    <template v-if="matchSrc">
      <h1>{{ matchSrc.replace(/-\d?/g, " ").trim() }}</h1>
      <Card id="match-src" :name="matchSrc" />
    </template>
    <h2>Pick a card:</h2>
    <div id="choose-match">
      <div v-for="(card, index) in cards" :id="`${index}`" class="cursor-pointer">
        <!-- Get selected card details and check table for match -->
        <Card
          :name="card"
          @card-select="(cardName: string) => $emit('match-select', [matchSrc, cardName])"
        />
      </div>
    </div>
  </dialog>
</template>

<style scoped lang="postcss">
#choose-match {
  width: 300px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
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
