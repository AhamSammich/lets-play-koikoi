<script setup lang="ts">
const emits = defineEmits(["open-menu", "close-menu"]);

const menuOpen = ref(false);
function toggleBtn() {
  menuOpen.value = !menuOpen.value;
  menuOpen.value ? emits("open-menu") : emits("close-menu");
}
</script>

<template>
  <div class="container" :class="{ 'menu-open': menuOpen }" @pointerup="toggleBtn()">
    <div class="top bar"></div>
    <div class="middle bar"></div>
    <div class="bottom bar"></div>
  </div>
</template>

<style scoped lang="postcss">
.container {
  --color1: white;
  --color2: transparent;
  width: clamp(28px, 2svw, 40px);
  aspect-ratio: 1 / 1;
  border: 0.1rem solid var(--color1);
  border-radius: 0.2rem;
  background-color: var(--color2);
  box-shadow: 0 0 0.2rem var(--color2);
  cursor: pointer;
  position: relative;

  &.menu-open {
    & .middle {
      transform: none;
      opacity: 0;
    }

    & .top {
      transform: none;
      rotate: 45deg;
    }

    & .bottom {
      transform: none;
      rotate: -45deg;
    }
  }

  &:not(.menu-open) :is(.top, .bottom) {
    transition: rotate 0.25s, transform 0.25s linear 0.25s;
  }
}

.bar {
  width: 80%;
  height: 8%;
  background-color: var(--color1);
  border-radius: 0.2rem;
  box-shadow: 0 0 0.2rem var(--color2);
  position: absolute;
  top: 46%;
  left: 10%;
  transform-origin: center;
  transition: transform 0.25s, rotate 0.25s linear 0.25s;
  pointer-events: none;
}

.top {
  transform: translate3d(0, -300%, 0);
}

.bottom {
  transform: translate3d(0, 300%, 0);
}
</style>
