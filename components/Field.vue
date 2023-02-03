<script setup lang="ts">
import { getFlower } from '~~/assets/scripts/match';

const props = defineProps<{
  cards: string[];
}>();
</script>

<template>
  <div class="field">
    <template v-for="(card, index) in cards">
      <div :id="`field-${index}`" :class="`field-card ${getFlower(card)}`">
        <Card :name="card" />
      </div>
    </template>
  </div>
</template>

<style scoped lang="postcss">
.field {
  width: 100%;
  height: inherit;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 0.2rem;
  pointer-events: none;
}
</style>
