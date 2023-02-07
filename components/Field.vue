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
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 0.2rem;
  overflow: visible;
  pointer-events: none;

  @media (orientation: landscape) {
    gap: 0.2rem;

    & :nth-child(9) {
      margin-left: 5%;
    }

    & :nth-child(n+9) {
      margin-top:  -10%;
    }
  }

  @media (orientation: portrait) {
    max-width: 350px;
    flex-direction: row;

    & :nth-child(5) {
      margin-left: 10%;
    }

    & :nth-child(n+5) {
      margin-top: -10%;
    }
  }
}
</style>
