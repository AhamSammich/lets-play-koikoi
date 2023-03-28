<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTableStore } from "~~/stores/tableStore";

const imagesLoading = ref(8);
const tableStore = useTableStore();
const { cardsOnField, cardSelected, matchSelected } = storeToRefs(tableStore);
const selectingCard = computed(() => cardSelected.value && !matchSelected.value);
const isSelectedMatch = (card: string) => card === matchSelected.value;
const isPossibleMatch = (card: string) => tableStore.checkPreviewMatches(card);

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
  <div v-if="imagesLoading > 0" class="w-full flex justify-center">
    <div class="card down loading twirl -rotate-12"></div>
  </div>
  <div :class="{ 'field pointer-events-none': true, 'opacity-0': imagesLoading > 0 }">
    <Card
      v-for="card in cardsOnField"
      :key="card"
      :name="card"
      :class="{
        'cursor-pointer pointer-events-auto opacity-100 -translate-y-4 z-10':
          selectingCard && isSelectable(card),
        'opacity-70': selectingCard && !isSelectable(card),
        selected: isSelectedMatch(card),
        previewed: isPossibleMatch(card),
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

  & * {
    transition: opacity 0.75s;
    z-index: 0;
  }
  & .previewed {
    z-index: 2;
  }
  & .selected {
    z-index: 3;
  }

  @media (orientation: landscape) {
    max-width: calc(var(--card-width) * 9);
    gap: 0;

    & :nth-child(9) {
      margin-left: 5%;
    }

    & :nth-child(n + 9) {
      margin-top: -40px;
      z-index: 1;
    }

    &:has(:nth-child(9)) .card {
      --card-width: 50px;
    }
  }

  @media (orientation: portrait) and (width < 768px) {
    max-width: calc(var(--card-width) * 5);
    flex-direction: row;

    & :nth-child(5) {
      margin-left: 10%;
    }

    & :nth-child(n + 5) {
      margin-top: -10%;
      z-index: 1;
    }
  }
}
</style>
