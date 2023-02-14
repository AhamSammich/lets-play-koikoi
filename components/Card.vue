<script setup lang="ts">
const props = defineProps<{
  name: string;
  hide?: boolean;
}>();

const emits = defineEmits(["card-select"]);

function handleClick(e: Event) {
  (<HTMLElement>e.target).classList.add("selected");
  emits("card-select", props.name);
}

onUpdated(() =>
  document.querySelectorAll("#p1-hand .card").forEach((card) => {
    card.classList.add("inanimate");
    card.classList.remove("selected", "inanimate");
  })
);
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

  &.inanimate {
    animation: none;
    transition: none;
  }

  &:hover {
    cursor: pointer;
    transform: translate3d(0, -5%, 0);
    outline: none;
  }

  &.down {
    background-color: rgb(220 38 38);
    max-width: 60px;
  }

  &.selected {
    transform-origin: bottom;
    outline: none;
    opacity: 0;
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

@keyframes pickUp {
  from {
    opacity: 1;
  }
  50% {
    opacity: 0.75;
  }
  to {
    opacity: 0;
    transform: scale(1.2) translate3d(25%, 0, 0);
    box-shadow: none;
    outline: none;
  }
}
</style>
