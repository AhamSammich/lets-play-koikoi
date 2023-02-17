<script setup lang="ts">
import { getFlower } from '~~/assets/scripts/match';

defineProps<{
  cards: string[];
}>();
</script>

<template>
  <div class="field">
    <template v-for="(card, index) in cards">
      <div :id="`field-${index}`" :class="`field-card ${getFlower(card)}`">
        <Card :name="card" :interactive="true"/>
      </div>
    </template>
  </div>
</template>

<style scoped lang="postcss">
.field {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 500px;
  align-items: flex-start;
  gap: 0.3rem;
  overflow: visible;
  pointer-events: none;

  @media (orientation: landscape) {
    gap: 0.3rem;

    & :nth-child(7) {
      margin-left: 5%;
    }

    & :nth-child(n+7) {
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
