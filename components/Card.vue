<script setup lang="ts">
import { useImage } from "@vueuse/core";
import { useDesignStore } from "../stores/designStore";
const props = defineProps<{
  name: string;
  hide?: boolean;
  interactive?: boolean;
  forcedStyle?: string;
}>();

const imgFormat = "webp";
const cardStyle = RULES.useCardStyle();
const cardBacks: Record<string, string> = useDesignStore().cardBacks;
const glowRadius = ref("0.3rem");

const { isLoading } = useImage({
  src: `cards/${props.forcedStyle || cardStyle.value}/${imgFormat}/${
    props.name
  }.${imgFormat}`,
});
const emits = defineEmits(["card-select"]);
const previewCard = STORE.usePreview();

const isMatched = () =>
  props.interactive && getFlower(props.name) === getFlower(previewCard.value);

// Mouseover to preview card matches
function handleHover(e: Event) {
  if (!props.interactive || isTouchScreen()) return; // Prevent triggering effects hovering over cards not in hand
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
  if (!props.interactive) return; // Prevent events on cards not in hand
  e.preventDefault();
  let target = <HTMLElement>e.target;
  target.classList.add("selecting");
  if (previewCard.value === props.name) {
    previewCard.value = "";
    emits("card-select", props.name);
  } else {
    previewCard.value = props.name;
  }
}

async function setGlowRadius() {
  // Set the glowing border radius
  glowRadius.value = getComputedStyle(document.body).getPropertyValue("--card-radius");
}

onUpdated(async () => {
  // await sleep(1800);
  [...document.querySelectorAll(".selected")].forEach((target) =>
    target.classList.remove("selected")
  );
});

onMounted(() => {
  // Apply styles for specific designs by toggling body class
  watchEffect(() => {
    let newStyle = props.forcedStyle || cardStyle.value;
    if (!document.body.classList.contains(newStyle)) {
      console.log(`Applied style: ${newStyle}.`);
      document.body.className = newStyle;
    }
    setGlowRadius();
  });
});
</script>

<template>
  <div
    v-if="hide"
    class="card down rotate-180"
    :style="`background-image: url(${
      cardBacks[cardStyle] // Applies a card-back image if provided in the designStore.
    });`"
  ></div>

  <div v-else :class="{ glow: interactive, previewed: isMatched() }">
    <!-- No effects if interactive is false -->
    <svg v-if="interactive" class="glow-container absolute">
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
    <div v-if="isLoading" class="card loading"></div>
    <nuxt-img
      v-else
      preset="card"
      :alt="`Card image for ${getName(props.name).toUpperCase()}`"
      :src="`cards/${forcedStyle || cardStyle}/${imgFormat}/${props.name}.${imgFormat}`"
      loading="lazy"
      class="card"
      draggable="false"
      @pointerenter="handleHover"
      @pointerdown="handlePointerDown"
    />
  </div>
</template>

<style lang="postcss">
@import "~/assets/css/card-styles.css";
.card {
  border-radius: var(--card-radius);
  width: var(--card-width);
  aspect-ratio: 2 / 3;
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
    opacity: 0;
  }

  &.loading {
    max-width: 50px;
    opacity: 0;
    /* box-shadow: inset 0 0 0 3px var(--card-bg-color);

    @media (prefers-reduced-motion: no-preference) {
      animation: twirl 2s infinite alternate ease-in-out;
    } */
  }
}

@keyframes twirl {
  from {
    scale: -1 1;
    background: white;
  }
  to {
    background: rgb(64, 73, 90);
    scale: 1 1;
  }
}

.previewed {
  transition: all 0.3s 0.1s;
  position: relative;
  scale: 1.1;
}

.previewed,
.card:hover {
  /* Used for calc */
  --container-offset: 50px;
  --glow-line-color: var(--card-glow-color);
  --glow-line-thickness: 1.5px;
  --glow-line-length: 20px;
  --glow-blur-color: var(--card-glow-color);
  --glow-blur-size: 5px;
  --duration: 1s;
  position: relative;

  &:has(.selected) {
    opacity: 0;
  }
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
    /* opacity: 0.5; */
    transform: translate3d(10%, 0, 0);
  }
  to {
    /* opacity: 1; */
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
