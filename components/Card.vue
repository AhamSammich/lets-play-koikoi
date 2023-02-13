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
    <div class="card down"></div>
  </template>
  <template v-else>
    <img class="card" :src="`cards/${props.name}.png`" @click="handleClick" />
  </template>
</template>

<style lang="postcss">
.card {
  width: 75px;
  aspect-ratio: 2 / 3;
  outline: 0.05px solid lightgoldenrodyellow;
  background-color: #11111180;
  border-radius: 0.2rem;
  transition: all 0.3s 0.1s;
  animation: dropIn 0.5s;

  &:hover {
    cursor: pointer;
    transform: translate3d(0, -5%, 0);
    outline: none;
  }

  &.down {
  background-color: rgb(220 38 38);
  max-width: 40px;
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
