<script setup lang="ts">
const props = defineProps<{
  rows?: number;
  arrangement?: {
    reversed?: boolean;
    orderByName?: string[];
  };
  cardDesign?: string;
}>();

function arrangeCards() {
  // Global constants CARDS and CARDS_REV defined in utils/match.ts
  if (!props.arrangement) return CARDS;
  let { orderByName, reversed } = props.arrangement;
  if (orderByName) {
    return orderByName;
  } else if (reversed) {
    return CARDS_REV;
  } else {
    return CARDS;
  }
}

const initialCardsToLoad = 8;
const cards = arrangeCards();
const scrolling = ref(false);

function finishLoading() {
  scrolling.value = true;
}
</script>

<template>
  <div
    :data-style="cardDesign"
    :class="`relative card-sheet grid overflow-x-hidden overflow-y-scroll z-10 ${cardDesign}`"
    :style="`--display-rows: ${rows || 1};`"
    @scroll="finishLoading()"
    @pointerenter="finishLoading()"
  >
    <p
      v-if="!scrolling"
      class="absolute w-max bottom-1 right-1 p-1 rounded-md text-xs bg-black text-yellow-200"
    >
      Load more
      <Icon class="text-base" name="icon-park-solid:blocks-and-arrows" />
    </p>
    <!-- Initially load the first 12 cards in the deck. -->
    <StaticCard
      v-for="cardName in cards.slice(0, initialCardsToLoad)"
      :key="cardName"
      :name="cardName"
      :design="cardDesign"
      loading="eager"
      class="pointer-events-none"
    />
    <!-- Load the rest when user starts scrolling. -->
    <template v-if="scrolling">
      <StaticCard
        v-for="cardName in cards.slice(initialCardsToLoad)"
        :key="cardName"
        :name="cardName"
        loading="lazy"
        :design="cardDesign"
        class="pointer-events-none"
      />
    </template>
  </div>
</template>

<style scoped lang="postcss">
.card-sheet {
  --card-width: 80px;
  --card-height: calc(var(--card-width) * 1.5);
  --row-size: 4;
  --all-rows: 12;
  grid-template-columns: repeat(var(--row-size), minmax(var(--card-width), 1fr));
  min-height: var(--card-height);
  max-height: calc(var(--card-height) * var(--display-rows));

  &::-webkit-scrollbar {
    width: 0.4rem;
    margin-left: 0.1rem;
  }

  &::-webkit-scrollbar-thumb {
    border: 0.5px solid var(--menu-gray1);
    border-radius: 0.2rem;
    width: 0.4rem;
  }
}

@media (orientation: landscape) and (width > 768px) {
  .card-sheet {
    --row-size: 8;
    max-height: calc(var(--card-height) * var(--all-rows));
  }
}
</style>
