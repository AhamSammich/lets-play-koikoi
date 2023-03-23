<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTableStore } from "~~/stores/tableStore";

const imagesLoading = ref(8);
const tableStore = useTableStore();
const { cardsOnField, cardSelected, matchSelected } = storeToRefs(tableStore);
const selectingCard = computed(() => cardSelected.value && !matchSelected.value);

const isSelectable = (card: string) => {
  return tableStore.checkSelectedMatches(card);
};

function handleSelection(card: string) {
  tableStore.setSelectedMatch(card);
}

function countLoaded(card: string) {
  imagesLoading.value--;
}
</script>

<template>
  <div v-if="imagesLoading > 0" class="mx-auto card down loading rotate-12"></div>
  <div :class="{ 'field pointer-events-none': true, 'opacity-0': imagesLoading > 0 }">
    <Card
      v-for="card in cardsOnField"
      :key="card"
      :name="card"
      :class="{
        'cursor-pointer pointer-events-auto opacity-100 -translate-y-4 z-10':
          selectingCard && isSelectable(card),
        'opacity-70': selectingCard && !isSelectable(card),
      }"
      @img-loaded="countLoaded"
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
