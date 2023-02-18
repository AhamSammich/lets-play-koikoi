<script setup lang="ts">
const isOpen = ref(false);
</script>

<template>
  <div
    id="menu-backdrop"
    class="absolute transform-none top-0 left-0 h-screen w-screen opacity-0 z-30"
  ></div>
  <menu
    id="menu-container"
    class="absolute right-0 top-0 translate-x-full max-w-full h-screen z-40"
    :aria-expanded="isOpen"
  >
    <div id="menu" class="relative h-full py-4 flex flex-col justify-between items-start">
      <div id="menu-btn" class="absolute z-50 top-4 mr-4 right-full">
        <MenuButton @open-menu="isOpen = true" @close-menu="isOpen = false" />
      </div>
      <div id="menu-nav" class="w-full">
        <ul class="w-full list-none">
          <li>How To Play</li>
          <li>Options</li>
        </ul>
      </div>
      <div id="menu-social"></div>
      <div id="menu-foot"></div>
    </div>
  </menu>
</template>

<style scoped lang="postcss">
* {
  --menu-black: rgb(14, 20, 34);
  --menu-gray1: rgb(64, 73, 90);
  --menu-gray2: rgb(36, 43, 61);
  --menu-accent: red;
  --menu-speed: 0.5s;
}

#menu-backdrop {
  background: var(--menu-black);
  height: 100dvh;
  transition: opacity var(--menu-speed);
  pointer-events: none;

  &:has(~ [aria-expanded="true"]) {
    opacity: 0.9;
  }
}

#menu-container {
  min-width: 300px;
  transition: all var(--menu-speed);
  background: var(--menu-gray2);
  color: white;

  &[aria-expanded="true"] {
    transform: translate(0, 0);
  }
}

li {
  width: 100%;
  padding: 0.75rem 2rem;

  &:hover {
    background: var(--menu-accent);
    box-shadow: -0.1rem 0 0 gold;
  }
}
</style>
