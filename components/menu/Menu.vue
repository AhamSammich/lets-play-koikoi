<script setup lang="ts">
const isOpen = ref(false);

</script>

<template>
  <div id="menu-btn" :class="`absolute z-50 top-4 right-4 ${isOpen ? 'opacity-100' : 'opacity-50'}`">
    <MenuButton @open-menu="isOpen = true" @close-menu="isOpen = false" />
  </div>
  <div
    id="menu-backdrop"
    class="absolute transform-none top-0 left-0 h-screen w-screen opacity-0"
  ></div>
  <menu
    id="menu-container"
    class="absolute right-0 top-0 translate-x-full scale-x-0 max-w-full h-screen"
    :aria-expanded="isOpen"
  >
    <div id="menu" class="relative h-full py-4 flex flex-col justify-between items-start">
      <nav id="menu-nav" class="w-full">
        <ul class="w-full list-none">
          <li>
            <a href="https://fudawiki.org/en/hanafuda/games/koi-koi#gameplay" target="_blank"
              >How To Play<Icon name="mi:external-link"
            /></a>
          </li>
        </ul>
      </nav>
      <section id="menu-options" class="w-full px-8 py-4">
        <h1>Options:</h1>
        <MenuGameOptions />
      </section>
      <nav id="menu-foot" class="w-full flex justify-center items-end pb-4">
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

h1 {
  font-family: 'Potta One';
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
  }
}

#menu-container {
  width: clamp(350px, 50vw, 500px);
  transition: all var(--menu-speed);
  background: var(--menu-gray2);
  color: white;
  font-family: Consolas, sans-serif;
  transform-origin: right;
  z-index: 49;

  &[aria-expanded="true"] {
    transform: translate(0, 0);
  }
}

@media (orientation: landscape) {
  #menu {
    width: 100vw;
    flex-direction: row;
  }

  #menu-container[aria-expanded="true"] {
    width: 100vw;
  }

  #menu-foot {
    height: 100%;

  }
}

li {
  font-family: 'Potta One';
  width: 100%;
  padding: 0.75rem 2rem;
  letter-spacing: 0.05em;

  &:has(:hover) {
    background: var(--menu-accent1);
    box-shadow: -0.1rem 0 0 var(--menu-accent2);
  }
}

a:not(li a):hover {
  cursor: pointer;
  color: var(--menu-accent1);
}
.icon {
  font-size: 1.2em;
  margin-left: 0.5em;
  margin-bottom: 0.2em;

  &:is(#menu-foot .icon) {
    font-size: 1.5em;
  }
}
</style>
