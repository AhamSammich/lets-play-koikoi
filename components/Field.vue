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
  max-height: 250px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 0.2rem;
  overflow: visible;
  pointer-events: none;
}
</style>
