<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTableStore } from "~~/stores/tableStore";

const tableStore = useTableStore();
const { cardsOnField, cardSelected, matchSelected } = storeToRefs(tableStore);
const selectingCard = computed(
  () => (cardSelected.value && !matchSelected.value)
);

const isSelectable = (card: string) => {
  return tableStore.checkSelectedMatches(card);
};

function handleSelection(card: string) {
  tableStore.setSelectedMatch(card);
}
</script>

<template>
  <div :class="{ 'field pointer-events-none': true }">
    <Card
      v-for="card in cardsOnField"
      :key="card"
      :name="card"
      :class="{
        'cursor-pointer pointer-events-auto opacity-100 -translate-y-4 z-10':
          selectingCard && isSelectable(card),
        'opacity-70': selectingCard && !isSelectable(card),
      }"
      @card-select="handleSelection(card)"
    />
  </div>
</template>

<style scoped lang="postcss">
.field {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 0.5rem;
  overflow: visible;
  transition: opacity 0.5s;

  @media (orientation: landscape) and (width > 768px) {
    max-width: calc(var(--card-width) * 9);

    & :nth-child(9) {
      margin-left: 5%;
    }

    & :nth-child(n + 9) {
      margin-top: -40px;
    }

    &:has(:nth-child(9)) .card {
      width: 60px;
    }
  }

  @media (orientation: portrait) or (width <= 768px) {
    max-width: calc(var(--card-width) * 5);
    flex-direction: row;

    & :nth-child(5) {
      margin-left: 10%;
    }

    & :nth-child(n + 5) {
      margin-top: -10%;
    }
  }
}
</style>
