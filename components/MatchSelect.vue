<script setup lang="ts">
const props = defineProps<{
  showModal: boolean;
  matchSrc?: string;
  cards: string[];
}>();

const emits = defineEmits(["match-select"]);
</script>

<template>
  <div :class="{ modal: true, hidden: !showModal }">
    <template v-if="matchSrc">
      <h1>{{ matchSrc.replace(/-\d?/g, " ") }}</h1>
      <div id="match-src">
        <Card :name="matchSrc" />
      </div>
    </template>
    <h2>Select a card to match:</h2>
    <div id="choose-match">
      <template v-for="(card, index) in cards">
        <div :id="`${index}`">
          <!-- Get selected card details and check table for match -->
          <Card
            :name="card"
            @card-select="(cardName: string) => $emit('match-select', [cardName])"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="postcss">
#choose-match {
  width: 300px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

#match-src {
  pointer-events: none;
  animation: none;
}
</style>
