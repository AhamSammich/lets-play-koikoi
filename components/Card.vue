<script setup lang="ts">
const props = defineProps<{
  name: string;
  hide?: boolean;
  interactive?: boolean;
}>();

const emits = defineEmits(["card-select"]);
const previewCard = STORE.usePreview();

const isTouchScreen = () => window.matchMedia("(pointer:coarse)").matches;
const isMatched = () =>
  props.interactive && getFlower(props.name) === getFlower(previewCard.value);

// Mouseover to preview card matches
function handleHover(e: Event) {
  previewCard.value = props.name;
  e.target?.addEventListener("pointerleave", cancelHover, { once: true });
}

// Remove effects from matched cards
// Maintains preview on touchscreens without hover
async function cancelHover() {
  if (isTouchScreen()) return;
  previewCard.value = "";
}

// Click (and hold for touchscreen) to play a card
async function handlePointerDown(e: Event) {
  e.preventDefault();
  let target = <HTMLElement>e.target;
  target.classList.add("selecting");
  target.addEventListener("pointerup", cancelPointerDown, { once: true });
  if (isTouchScreen()) await sleep(300);

  if (!target.classList.contains("selecting")) return;
  target.classList.add("selected");
  previewCard.value = "";
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
    <!-- No effects if interactive is false -->
    <svg v-if="interactive" class="glow-container absolute">
      <rect rx="0.2rem" pathLength="100" stroke-linecap="round" class="glow-blur"></rect>
      <rect rx="0.2rem" pathLength="100" stroke-linecap="round" class="glow-line"></rect>
    </svg>
    <!-- Prevent long-press menu on touchscreen -->
    <img
      class=""
      :src="`cards/${props.name}.png`"
      @touchstart.prevent
      @touchend.prevent
      @pointerenter="handleHover"
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
  --glow-line-length: 20px;
  --glow-blur-color: lightgoldenrodyellow;
  --glow-blur-size: 5px;
  --duration: 1s;
  position: relative;

  /* Visual feedback for card selection */
  &:has(.selecting) {
    --glow-line-color: gold;
    --glow-blur-color: gold;
    --duration: 500ms;
    opacity: 0.2;

    /* Provides better touchscreen long-press feedback */
    @media (pointer: coarse) {
      --glow-line-length: 50px;
    }
  }

  &:has(.selected) {
    opacity: 0;
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
  stroke-dasharray: var(--glow-line-length) calc(50px - var(--glow-line-length));
  transition: stroke-dashoffset var(--duration), stroke-dasharray var(--duration);
  /* Provides better touchscreen long-press feedback */
  @media (pointer: coarse) {
    transition: stroke-dasharray var(--duration);
  }
}

.glow:is(:hover, .previewed) :is(.glow-line, .glow-blur) {
  stroke-dashoffset: -40px;
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

.glow:is(:hover) .glow-container {
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
