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

function applyDesign(designName: string) {
  designStore.changeActive(designName);
  let designSelectElement = document.getElementById("card-design");
  if (designSelectElement instanceof HTMLSelectElement)
    designSelectElement.value = designName;
}
</script>

<template>
  <div id="fuda-gallery" class="h-max w-screen overflow-y-scroll">
    <div class="header min-h-16 flex flex-col justify-center p-2 gap-2">
      <h1 class="text-2xl">🎴<span>Hanafuda Gallery</span></h1>
      <div class="flex flex-col self-center gap-2 pl-4 max-w-2xl">
        <p class="text-lg">🎊 Welcome! 🎊</p>
        <p>
          This collection features some awesome hanafuda designs by various artists!🔥
          Play Koi-Koi using your favorite design by clicking on <em>Play this deck!</em>
        </p>
        <p>
          If there's a design you would like to have added,
          <a href="https://www.twitter.com/hammons_dev" target="_blank">let me know!💬</a>
        </p>
      </div>
    </div>
    <article
      v-for="(design, key) in designStore.cardDesigns"
      :key="key"
      class="flex flex-col items-center h-max overflow-x-hidden px-4 py-8"
    >
      <section class="h-max w-full max-w-5xl grid gap-1 md:px-8 mb-4">
        <div class="flex justify-between w-full">
          <h2>✨{{ design.name }}</h2>
          <NuxtLink
            class="play text-yellow-200 text-xs w-max mr-4"
            to="/"
            @click="applyDesign(key)"
          >
            <Icon
              name="material-symbols:play-circle-rounded"
              class="text-lg mb-1 mx-1"
            />Play this deck!
          </NuxtLink>
        </div>
        <div class="flex flex-col gap-1 md:max-w-2xl text-sm px-4">
          <p>{{ design.attribution }}</p>
          <a class="text-yellow-200 w-max" :href="design.url" target="_blank"
            >{{ design.urlDescription }}<Icon name="mi:external-link" class="ml-1 mb-1"
          /></a>
        </div>
      </section>
      <section class="w-full h-max flex justify-center">
        <GalleryCardSheet :card-design="key" :arrangement="design.arrangement"/>
      </section>
    </article>
  </div>
</template>

<style scoped lang="postcss">
#fuda-gallery {
  --color1: var(--tbl-black);
  --color2: var(--menu-gray2);
  --text-color: white;
  --link-color: rgb(254 240 138);
  font-family: Consolas, monospace, system-ui;
  overflow-y: scroll;
  color: var(--text-color);

  @media (prefers-color-scheme: light) {
    --color1: whitesmoke;
    --color2: white;
    --text-color: var(--tbl-black);
    --link-color: red;
  }
}

h1,
h2 {
  font-family: "Potta One", cursive;
  letter-spacing: 0.05rem;
}

.header {
  background-color: var(--color1);

  @media (prefers-color-scheme: dark) {
    & h1 span {
      color: transparent;
      background: var(--gradient-gold);
      background-clip: text;
    }
  }
}

article:nth-child(2n + 1) {
  background-color: var(--color1);
}

article:nth-child(2n) {
  background-color: var(--color2);
}

a {
  transition: translate 0.5s;
  color: var(--link-color);

  &.play {
    font-family: "Potta One", cursive;
  }

  &:hover {
    translate: 3% 0;
  }
}
</style>
