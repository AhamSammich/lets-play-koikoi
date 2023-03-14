<script setup lang="ts">
import { useDesignStore } from "../stores/designStore";

useServerSeoMeta({
  title: "Hanafuda Gallery | Let's Play Koi-Koi!",
  ogTitle: "Hanafuda Gallery | Let's Play Koi-Koi!",
  description: "Play Koi-Koi with amazing designs by talented artists!",
  ogDescription: "Play Koi-Koi with amazing designs by talented artists!",
  ogImage: "https://assets.codepen.io/8543383/gallery-hanami_1.png",
  twitterCard: "summary_large_image",
});

const designStore = useDesignStore();
const cardStyle = RULES.useCardStyle();

function applyTheme(styleName: string) {
  cardStyle.value = styleName;
  let styleSelectElement = document.getElementById("card-style");
  if (styleSelectElement instanceof HTMLSelectElement)
    styleSelectElement.value = styleName;
}
</script>

<template>
  <div id="fuda-gallery" class="h-max w-screen overflow-y-scroll">
    <article
      v-for="(design, key) in designStore.cardDesigns"
      :key="key"
      class="flex flex-col h-max overflow-x-hidden text-white px-4 py-8"
    >
      <section class="h-max w-full grid gap-1 md:px-8 mb-4">
        <div class="grid grid-cols-2">
          <h2>"{{ design.name }}"</h2>
          <NuxtLink class="text-yellow-200 text-xs" to="/" @click="applyTheme(key)"
            ><p class="text-center mr-2"><Icon name="material-symbols:play-circle-rounded" class="text-lg mb-1 mx-1" />Play this deck!</p></NuxtLink
          >
        </div>
        <div class="flex flex-col gap-1 md:max-w-2xl text-sm">
          <p>{{ design.attribution }}</p>
          <a class="text-yellow-200" :href="design.url" target="_blank"
            >{{ design.urlDescription }}<Icon name="mi:external-link" class="ml-1 mb-1"
          /></a>
        </div>
      </section>
      <section class="w-full h-max flex justify-center">
        <GalleryCardSheet :style-name="key" :reversed="design.reversed" />
      </section>
    </article>
  </div>
</template>

<style scoped lang="postcss">
#fuda-gallery {
  font-family: Consolas, monospace, system-ui;
  overflow-y: scroll;
}

h1,
h2 {
  font-family: "Potta One", cursive;
}

article:nth-child(2n + 1) {
  background-color: lightgray;
  color: var(--tbl-black);

  & a {
    color: red;
  }
}

article:nth-child(2n) {
  background-color: var(--menu-gray1);
}

a {
  transition: translate 0.5s;

  &:hover {
    translate: 3% 0;
  }
}
</style>
