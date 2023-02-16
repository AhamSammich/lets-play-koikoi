<script setup lang="ts">
import { STORE } from "./composables/game";
import { getFlower } from "~~/assets/scripts/match";

const props = defineProps<{
  name: string;
  hide?: boolean;
}>();

const emits = defineEmits(["card-select"]);
const previewCard = STORE.usePreview();

const isMatched = () => getFlower(props.name) === getFlower(previewCard.value);

// Single-click to preview card matches
function handleClick(e: Event) {
    previewCard.value = props.name;
}

// Click and hold (2 sec) to select/play card
async function handlePointerDown(e: Event) {
  console.log("Selecting...");
  let target = <HTMLElement>e.target;
    target.classList.add("selected");
    target.addEventListener("pointerup", cancelPointerDown, { once: true });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    if (!target.classList.contains("selected")) return;
    emits("card-select", props.name);
    previewCard.value = "";
}

async function cancelPointerDown(e: Event) {
  (<HTMLElement>e.target).classList.remove("selected");
  console.log("...selection cancelled.");
}

onUpdated(() =>
  document.querySelectorAll("#p1-hand .card").forEach((card) => {
    card.classList.add("inanimate");
    card.classList.remove("selected", "inanimate");
  })
);
</script>

<template>
  <div v-if="hide" class="card down"></div>
  <img
    v-else
    :class="`card ${isMatched() ? 'previewed' : ''}`"
    :src="`cards/${props.name}.png`"
    @click="handleClick"
    @pointerdown="handlePointerDown"
  />
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
    transition-delay: 1.5s;
  }

  &.previewed {
    scale: 1.2;
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
