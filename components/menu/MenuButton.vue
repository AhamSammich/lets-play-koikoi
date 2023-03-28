<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    forceState?: boolean | null;
    icoName?: string;
    closeOnly?: boolean;
  }>(),
  { forceState: null, closeOnly: false }
);
const emits = defineEmits(["open-menu", "close-menu"]);

const menuOpen = ref(false);

function toggleBtn() {
  menuOpen.value = !menuOpen.value;
  menuOpen.value ? emits("open-menu") : emits("close-menu");
}

function closeMenu() {
  emits("close-menu");
}

function handleClick() {
  if (props.closeOnly) {
    closeMenu();
  } else {
    toggleBtn();
  }
}

onUpdated(() => {
  if (typeof props.forceState !== "boolean") return;
  menuOpen.value = props.forceState;
});
</script>

<template>
  <div class="container" :class="{ 'menu-open': menuOpen }" @pointerup="handleClick()">
    <template v-if="!icoName || (icoName && menuOpen)">
      <div class="top bar"></div>
      <div class="middle bar"></div>
      <div class="bottom bar"></div>
    </template>
    <Icon v-else :name="icoName" />
  </div>
</template>

<style scoped lang="postcss">
.container {
  --color1: white;
  --color2: var(--menu-gray2);
  width: 32px;
  height: 32px;
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

.icon {
  position: absolute;
  height: 80%;
  width: 80%;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  stroke: white;
}
</style>
