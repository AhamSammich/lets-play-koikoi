<script setup lang="ts">
const props = defineProps<{
  rows?: number;
  reversed?: boolean;
  styleName?: string;
}>();

let cards = props.reversed ? CARDS_REV : CARDS;
const cardStyle = props.styleName ? props.styleName : '';

const scrolling = ref(false);

function finishLoading() {
  scrolling.value = true;
}
</script>

<template>
  <div
    :data-style="cardStyle"
    :class="`card-sheet grid overflow-x-hidden overflow-y-scroll z-10 ${cardStyle}`"
    :style="`--display-rows: ${rows || 1};`"
    @pointerenter="finishLoading()"
  >
    <!-- Initially load the first 8 cards in the deck. -->
    <nuxt-img
      v-for="cardName in cards.slice(0,8)"
      :key="cardName"
      :name="cardName"
      loading="eager"
      :src="`cards/${styleName}/webp/${cardName}.webp`"
      :alt="`${cardName} in ${styleName}`"
      preset="card"
      class="card pointer-events-none"
    />
    <!-- Load the rest when user starts scrolling. -->
    <template v-if="scrolling">
      <nuxt-img
        v-for="cardName in cards.slice(8)"
        :key="cardName"
        :name="cardName"
        loading="lazy"
        :src="`cards/${styleName}/webp/${cardName}.webp`"
        :alt="`${cardName} in ${styleName}`"
        preset="card"
        class="card pointer-events-none"
      />
    </template>
  </div>
</template>

<style scoped lang="postcss">
.card-sheet {
  --card-width: 80px;
  --card-height: calc(var(--card-width) * 1.5);
  --row-size: 4;
  grid-template-columns: repeat(var(--row-size), minmax(calc(var(--card-width) + var(--card-border-w)), 1fr));
  min-height: var(--card-height);
  max-height: calc(var(--card-height) * var(--display-rows));

  &::-webkit-scrollbar {
    width: 0.4rem;
    margin-left: 0.1rem;
  }

  &::-webkit-scrollbar-thumb {
    border: 0.5px solid  var(--menu-gray1);
    border-radius: 0.2rem;
    width: 0.4rem;
  }
}

@media (orientation: landscape) and (width > 768px) {
  .card-sheet {
    --row-size: 8;
  }
}
</style>
