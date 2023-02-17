<script setup lang="ts">
import { STORE } from "./composables/game";
import { getFlower } from "~~/assets/scripts/match";

const props = defineProps<{
  name: string;
  hide?: boolean;
  interactive?: boolean;
}>();

const emits = defineEmits(["card-select"]);
const previewCard = STORE.usePreview();

const isMatched = () =>
  props.interactive && getFlower(props.name) === getFlower(previewCard.value);

// Mouse to preview card matches
function handleHover(e: Event) {
  previewCard.value = props.name;
  e.target?.addEventListener("pointerleave", cancelHover, { once: true });
}

// Remove effects from matched cards
function cancelHover() {
  previewCard.value = "";
}

// Click and hold (0.5 sec) to select/play card
async function handlePointerDown(e: Event) {
  e.preventDefault();
  let target = <HTMLElement>e.target;
  target.classList.add("selecting");
  target.addEventListener("pointerup", cancelPointerDown, { once: true });
  await new Promise((resolve) => setTimeout(resolve, 300));

  previewCard.value = "";
  if (!target.classList.contains("selecting")) return;
  emits("card-select", props.name);
}

// Remove selection effects
async function cancelPointerDown(e: Event) {
  (<HTMLElement>e.target).classList.remove("selecting", "selected");
}
</script>

<template>
  <div v-if="hide" class="card down"></div>

  <div v-else :class="`card glow ${isMatched() ? 'previewed' : ''}`">
    <svg v-if="interactive" class="glow-container absolute">
      <rect rx="0.2rem" pathLength="100" stroke-linecap="round" class="glow-blur"></rect>
      <rect rx="0.2rem" pathLength="100" stroke-linecap="round" class="glow-line"></rect>
    </svg>
    <img
      class=""
      :src="`cards/${props.name}.png`"
      @pointerover="handleHover"
      @pointerdown="handlePointerDown"
    />
  </div>
</template>

<style lang="postcss">
.card,
img {
  border-radius: 0.2rem;
}
.card {
  width: 75px;
  aspect-ratio: 2 / 3;
  outline: 0.05px solid lightgoldenrodyellow;
  transition: all 0.3s 0.1s;
  animation: dropIn 0.5s;

  &.down {
    background-color: rgb(220 38 38);
    max-width: 60px;
  }

  &.selected {
    transform-origin: bottom;
    outline: none;
    opacity: 0;
    transition-delay: 0.1s;
  }

  &.previewed {
    position: relative;
    scale: 1.1;
  }
}

.previewed,
.card:hover {
  /* Used for calc */
  --container-offset: 50px;
  --glow-line-color: lightgoldenrodyellow;
  --glow-line-thickness: 1.5px;
  --glow-blur-color: lightgoldenrodyellow;
  --glow-blur-size: 8px;
  --duration: 1s;
  position: relative;

  &:has(.selecting) {
    --glow-line-color: gold;
    --glow-blur-color: gold;
    --duration: 500ms;
  }

  &:has(.selected) {
    --duration: 5s;
  }
}

.glow-container {
  width: calc(100% + var(--container-offset));
  height: calc(100% + var(--container-offset));
  inset: calc(var(--container-offset) / -2);
  pointer-events: none;
}

.glow-blur,
.glow-line {
  width: calc(100% - var(--container-offset));
  height: calc(100% - var(--container-offset));
  x: calc(var(--container-offset) / 2);
  y: calc(var(--container-offset) / 2);
  fill: transparent;
  stroke: lightgoldenrodyellow;
  stroke-width: 3px;
  stroke-dasharray: 20px 30px;
  transition: stroke-dashoffset var(--duration);
}

.glow:is(:hover, :focus, .previewed) :is(.glow-line, .glow-blur) {
  stroke-dashoffset: -60px;
}

.glow-line {
  stroke: var(--glow-line-color);
  stroke-width: var(--glow-line-thickness);
}

.glow-blur {
  filter: blur(var(--glow-blur-size));
  stroke: var(--glow-blur-color);
  stroke-width: var(--glow-blur-size);
}

.glow:is(:hover, :focus) .glow-container {
  animation: glow-visibility ease-in-out var(--duration) infinite;
}

@keyframes glow-visibility {
  0%,
  100% {
    opacity: 0;
  }
  25%,
  75% {
    opacity: 1;
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
