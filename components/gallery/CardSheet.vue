<script setup lang="ts">
const props = defineProps<{
  rows?: number;
  reversed?: boolean;
  styleName?: string;
}>();

let cards = props.reversed ? CARDS_REV : CARDS;
</script>

<template>
  <div
    class="card-sheet grid overflow-x-hidden overflow-y-scroll z-10"
    :style="`--display-rows: ${rows || 2};`"
  >
    <Card
      v-for="cardName in cards"
      :key="cardName"
      :name="cardName"
      :forced-style="styleName"
      class="pointer-events-none"
    />
  </div>
</template>

<style scoped lang="postcss">
.card-sheet {
  --card-width: 80px;
  --card-height: calc(var(--card-width) * 1.5);
  --row-size: 4;
  grid-template-columns: repeat(var(--row-size), minmax(var(--card-width), 1fr));
  min-height: var(--card-height);
  max-height: calc(var(--card-height) * var(--display-rows));
}

@media (orientation: landscape) and (width > 768px) {
  .card-sheet {
    --row-size: 8;
  }
}
</style>
