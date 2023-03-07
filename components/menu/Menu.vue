<script setup lang="ts">
const isOpen = ref(false);
const guideOpen = ref(false);
const showOptions = ref(false);

function openMenu() {
  isOpen.value = true;
}

function closeMenu() {
  isOpen.value = false;
  guideOpen.value = false;
  showOptions.value = false;
}

</script>

<template>
  <div
    id="menu-btn"
    :class="`absolute z-50 top-4 right-4 ${isOpen ? 'opacity-100' : 'opacity-50'}`"
  >
    <MenuButton @open-menu="openMenu()" @close-menu="closeMenu()" />
  </div>
  <div
    id="menu-backdrop"
    class="absolute transform-none top-0 left-0 h-screen w-screen opacity-0"
    @click="closeMenu()"
  ></div>
  <menu
    id="menu-container"
    class="font-mono text-white absolute right-0 top-0 translate-x-full scale-x-0 h-screen w-screen"
    :aria-expanded="isOpen"
  >
    <div id="menu" class="relative h-full py-2 flex flex-col justify-between items-start">

      <!-- MENU ITEMS -->
      <nav id="menu-nav" class="w-full">
        <ul class="w-full list-none">
          <li>
            <span @click="guideOpen = true">How To Play</span>
          </li>
          <li class="opacity-30 pointer-events-none">
            <span class="relative under-construction">Hanafuda Gallery</span>
          </li>
          <li>
            <span @click="showOptions = true">Game Options</span>
          </li>
        </ul>
      </nav>

      <!-- HOW-TO-PLAY GUIDE -->
      <section v-if="guideOpen" id="menu-guide" class="absolute top-0 w-full h-full pr-4">
        <div class="absolute top-16 right-4">
          <MenuButton
            ico-name="material-symbols:arrow-back"
            :class="{ hidden: !guideOpen }"
            style="z-index: 70"
            close-only
            @close-menu="guideOpen = false"
          />
        </div>
        <MenuGuide :is-open="guideOpen" />
      </section>

      <!-- GAME OPTIONS -->
      <section v-show="showOptions" id="menu-options" class="w-full h-full absolute pl-6 pr-16 py-2">
        <div class="absolute top-16 right-4">
          <MenuButton
            ico-name="material-symbols:arrow-back"
            :class="{ hidden: !showOptions }"
            style="z-index: 70"
            close-only
            @close-menu="showOptions = false"
          />
        </div>
        <h1 class="py-2">Options:</h1>
        <MenuGameOptions />
      </section>

      <!-- SOCIAL LINK ICONS -->
      <nav v-if="!guideOpen" id="menu-foot" class="w-full flex justify-center items-end pb-4">
        <a href="https://www.github.com/ahamsammich/lets-play-koikoi" target="_blank"
          ><Icon name="mdi:github"
        /></a>
        <a href="https://www.twitter.com/hammons_dev" target="_blank"
          ><Icon name="mdi:twitter"
        /></a>
      </nav>

    </div>
  </menu>
</template>

<style scoped lang="postcss">
* {
  --menu-black: rgb(14, 20, 34);
  --menu-gray1: rgb(64, 73, 90);
  --menu-gray2: rgb(36, 43, 61);
  --menu-accent1: firebrick;
  --menu-accent2: lightgoldenrodyellow;
  --menu-speed: 0.5s;
}

.under-construction::after {
  content: "under construction";
  display: block;
  position: absolute;
  top: 95%;
  right: 0;
  font-size: xx-small;
  width: max-content;
  padding: 0.1rem 0.3rem;
  background: var(--gradient-gold);
  color: var(--menu-black);
  text-transform: uppercase;
  border-radius: 0.3rem;
}

h1 {
  font-family: "Potta One";
  margin-bottom: 0.5em;
  letter-spacing: 0.05em;
  color: var(--menu-accent2);
}

#menu {
  height: 100dvh;
}

#menu-backdrop {
  background: var(--menu-black);
  height: 100dvh;
  transition: opacity var(--menu-speed);
  pointer-events: none;
  z-index: 48;

  &:has(~ [aria-expanded="true"]) {
    opacity: 0.9;
    pointer-events: visible;
  }
}

#menu-container {
  width: clamp(350px, 75vw, 1200px);
  transform-origin: right;
  transition: all var(--menu-speed);
  background: var(--menu-gray2);
  box-shadow: 0 0 0.3rem 0 var(--menu-black);
  z-index: 49;

  &[aria-expanded="true"] {
    transform: translate(0, 0);
  }
}

#menu-options {
  background: var(--menu-gray2);
}

@media (orientation: landscape) {
  #menu-container {
    width: 100vw;
  }
  
  #menu {
    display: grid;
    grid-template-columns: 25% 50% 25%;
  }

  #menu-options {
    max-height: 100svh;
  }

  #menu-foot {
    height: 100%;
    max-height: 100svw;
  }
}

li {
  font-family: "Potta One";
  width: 100%;
  padding: 1rem 2rem;
  letter-spacing: 0.05em;

  & span {
    cursor: pointer;
    white-space: nowrap;
  }

  &:has(:hover) {
    transition: all 0.1s;
    background: var(--menu-black);
    color: var(--menu-accent2);
    box-shadow: -0.1rem 0 0 var(--menu-accent2);
  }
}

a:not(li a):hover {
  cursor: pointer;
  color: var(--menu-accent1);
}
.icon {
  margin-left: 0.5em;
  margin-bottom: 0.2em;

  &:is(#menu-foot .icon) {
    font-size: 1.5em;
  }
}
</style>
