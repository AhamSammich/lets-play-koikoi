<script setup lang="ts">

defineProps<{
  cards: string[];
}>();
</script>

<template>
  <div class="field">
      <Card v-for="card in cards" :key="card" :name="card" />
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
  pointer-events: none;

  @media (orientation: landscape) {
    max-width: calc(var(--card-width) * 9);

    & :nth-child(9) {
      margin-left: 5%;
    }

    & :nth-child(n+9) {
      margin-top:  -40px;
    }

    &:has(:nth-child(9)) .card {
      width: 60px;
    }
  }

  @media (orientation: portrait) {
    max-width: calc(var(--card-width) * 5);
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
