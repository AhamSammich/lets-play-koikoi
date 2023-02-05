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
      <div id="match-src">
        <Card :name="matchSrc" />
      </div>
    </template>
    <h1>Select a card to match:</h1>
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
}

.modal {
  background: hsl(0 0% 13% / 0.95);
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  color: white;
  font-size: x-large;
  font-weight: bold;
}

.hidden {
  display: none;
}
</style>
