<script setup lang="ts">
const props = defineProps<{
  name: string;
  hide?: boolean;
}>();

const emits = defineEmits(["card-select"]);

function handleClick(e: Event) {
  emits("card-select", props.name);
}
</script>

<template>
  <template v-if="hide">
    <div class="card bg-red-600" @click="handleClick"></div>
  </template>
  <template v-else>
    <img class="card" :src="`cards/${props.name}.png`" @click="handleClick" />
  </template>
</template>

<style lang="postcss">
.card {
  width: clamp(75px, 1vw, 40px);
  aspect-ratio: 2 / 3;
  outline: 1px solid #111;
  border-radius: 0.2rem;
  transition: transform 0.3s 0.1s;
  animation: dropIn 0.5s;

  &:hover {
    cursor: pointer;
    transform: translate3d(0, -30%, 0);
  }
}

@keyframes dropIn {
  from {
    opacity: 0;
    transform: scale(1.5) translate3d(0, -10%, 0);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
