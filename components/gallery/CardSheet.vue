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
const initialLoading = ref(initialCardsToLoad);
const moreLoading = ref(48 - initialCardsToLoad);
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
    
  >
    <div v-if="initialLoading" class="absolute-center card down z-20"></div>
    <p
      v-else-if="!scrolling && !initialLoading"
      :class="`${cardDesign} more-card flex flex-col items-center justify-center absolute w-max bottom-0 right-0 font-mono font-bold text-xl text-center bg-black bg-opacity-80 text-yellow-200`"
    >
      MORE
      <Icon class="text-3xl cursor-pointer" name="gg:more-vertical-r" @pointerdown="finishLoading()" />
    </p>
    <!-- Initially load the first 12 cards in the deck. -->
    <StaticCard
      v-for="cardName in cards.slice(0, initialCardsToLoad)"
      :key="cardName"
      :name="cardName"
      :design="cardDesign"
      loading="eager"
      :class="{'pointer-events-none': true, 'opacity-0': initialLoading}"
      @img-loaded="initialLoading--"
    />
    <!-- Load the rest when user starts scrolling. -->
    <template v-if="scrolling">
      <div v-if="moreLoading" class="absolute-center card down"></div>
      <StaticCard
        v-for="cardName in cards.slice(initialCardsToLoad)"
        :key="cardName"
        :name="cardName"
        loading="lazy"
        :no-animation="false"
        :design="cardDesign"
        :class="{'pointer-events-none': true, 'opacity-0': moreLoading}"
        @img-loaded="moreLoading--"
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

.more-card {
  width: var(--card-width);
  aspect-ratio: var(--card-aspect);
  border-radius: var(--card-radius);
  letter-spacing: 0.1rem;
}

.absolute-center {
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
}

@media (orientation: landscape) and (width > 768px) {
  .card-sheet {
    --row-size: 8;
    max-height: calc(var(--card-height) * var(--all-rows));
  }
}
</style>
