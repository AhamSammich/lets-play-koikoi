<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTableStore } from "~~/stores/tableStore";
import { useDesignStore } from "../stores/designStore";
const props = defineProps<{
  name: string;
  loading?: "lazy" | "eager";
  forcedStyle?: string;
}>();
const emits = defineEmits(["card-select", "img-loaded"]);

const { activeDesignName } = storeToRefs(useDesignStore());
const tableStore = useTableStore();
const isCardPreviewed = computed(() => tableStore.cardPreviewed === props.name);
const imgUrl = computed(
  () => `cards/${props.forcedStyle || activeDesignName.value}/webp/${props.name}.webp`
);

// Dynamically set the glowing border radius
const glowRadius = computed(() =>
  getComputedStyle(
    document.querySelector(`.${activeDesignName.value}`)!
  ).getPropertyValue("--card-radius")
);

// Mouseover to preview card matches
function handleHover(e: Event) {
  if (isTouchScreen()) return;
  tableStore.setPreviewCard(props.name);
  e.target?.addEventListener("pointerleave", cancelHover, { once: true });
}

function cancelHover() {
  if (isTouchScreen() || tableStore.cardSelected) return;
  tableStore.clearPreview();
}

function handleTouch() {
  if (isCardPreviewed.value) {
    emitSelection();
  } else {
    tableStore.setPreviewCard(props.name);
  }
}

function handlePointerDown() {
  if (isTouchScreen()) {
    console.log("touched");
    handleTouch();
  } else {
    console.log("clicked");
    emitSelection();
  }
}

function emitSelection() {
  if (isCardPreviewed.value) {
    emits("card-select", props.name);
  }
}

function emitLoaded() {
  emits("img-loaded", props.name);
}
</script>

<template>
  <div class="glow">
    <svg class="glow-container absolute">
      <rect
        :rx="glowRadius"
        pathLength="100"
        stroke-linecap="round"
        class="glow-blur"
      ></rect>
      <rect
        :rx="glowRadius"
        pathLength="100"
        stroke-linecap="round"
        class="glow-line"
      ></rect>
    </svg>
    <nuxt-img
      placeholder
      preset="card"
      :alt="name"
      :src="imgUrl"
      :loading="loading || 'lazy'"
      class="card"
      draggable="false"
      @load="emitLoaded"
      @pointerenter="handleHover"
      @pointerdown="handlePointerDown"
    />
  </div>
</template>

<style lang="postcss">
.card {
  border-radius: var(--card-radius);
  width: var(--card-width);
  aspect-ratio: var(--card-aspect);
  transition: all 0.3s 0.1s;
  border: var(--card-border-w) solid var(--card-border-color);

  @media (prefers-reduced-motion: no-preference) {
    animation: dropIn 0.75s;
  }

  &:is(img, .down) {
    box-shadow: 0.1rem 0.1rem 0.3rem 0 #111;
  }

  &.down {
    background: var(--card-bg-color);
    background-size: cover;
  }

  &.selected {
    transform-origin: bottom;
    translate: 0 -10%;
  }

  &.loading {
    transform-origin: center;
    background-color: #EEE;
    margin: 0 auto;
    scale: 0.8;
    opacity: 0.5;
  }

  @media (prefers-reduced-motion: no-preference) {
    &.twirl {
      animation: twirl 2.5s infinite alternate ease-in-out;
    }
  }
}

@keyframes twirl {
  from {
    opacity: 0.9;
    scale: -1 1;
  }
  50% {
    opacity: 0.1;
  }
  to {
    opacity: 0.9;
    scale: 1 1;
  }
}

.previewed {
  transition: all 0.3s 0.1s;
  position: relative;
  scale: 1.1;
}

.previewed {
  /* Used for calc */
  --container-offset: 50px;
  --glow-line-color: var(--card-glow-color);
  --glow-line-thickness: 1.5px;
  --glow-line-length: 20px;
  --glow-blur-color: var(--card-glow-color);
  --glow-blur-size: 5px;
  --duration: 1s;
  position: relative;
  transition: all 0.3s 0.1s;
}

.selected {
  --glow-line-length: 50px;
  --card-glow-color: gold;
}

.glow-container {
  width: calc(100% + var(--container-offset));
  height: calc(100% + var(--container-offset));
  inset: calc((var(--container-offset)) / -2);
  pointer-events: none;
  z-index: 5;
}

.glow-blur,
.glow-line {
  width: calc(100% - var(--container-offset));
  height: calc(100% - var(--container-offset));
  x: calc(var(--container-offset) / 2);
  y: calc(var(--container-offset) / 2);
  fill: transparent;
  stroke: lightgoldenrodyellow;
  stroke-width: 1px;
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
    transform: translate3d(10%, 0, 0);
  }
  to {
    transform: none;
  }
}

@keyframes pickUp {
  from {
    opacity: 1;
  }
  50% {
    opacity: 0.9;
  }
  to {
    opacity: 0;
    transform: scale(1.2) translate3d(25%, 0, 0);
  }
}
</style>
