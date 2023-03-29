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
  designStore.setActiveDesign(designName);
  let designSelectElement = document.getElementById("card-design");
  if (designSelectElement instanceof HTMLSelectElement)
    designSelectElement.value = designName;
}
</script>

<template>
  <div id="fuda-gallery" class="h-max w-screen overflow-y-scroll flex flex-col gap-4">
    <div class="header min-h-16 flex flex-col justify-center px-4 py-4 gap-4">
      <h1 class="text-2xl">🎴<span>Hanafuda Gallery</span></h1>
      <div class="text-lg lg:text-xl flex flex-col self-center gap-4 max-w-2xl lg:max-w-4xl">
        <p>Welcome! 👋🏽</p>
        <p>
          This collection features some awesome hanafuda designs by various artists!🔥
          Play Koi-Koi using your favorite design by clicking on <em>Play this deck!</em>
        </p>
        <p>
          If you are interested in submitting a design or otherwise contributing, follow this project on
          <a href="https://www.github.com/ahamsammich/lets-play-koikoi" target="_blank"
            class="hover:underline">Github!</a>⭐
        </p>
      </div>
    </div>
    <article v-for="(design, key) in designStore.getDesigns" :key="key"
      class="flex flex-col items-center h-max overflow-x-hidden px-4 py-8">
      <section class="h-max w-full max-w-5xl grid gap-1 md:px-8 mb-4">
        <div class="flex justify-between w-full">
          <h2 class="ml-2 lg:text-xl">{{ design.title }}</h2>
          <NuxtLink class="play text-yellow-200 text-xs lg:text-xl w-max mr-4 hover:underline" to="/"
            @click="applyDesign(key)">
            <Icon name="material-symbols:play-circle-rounded" class="text-lg mb-1 mx-1" />Play this deck!
          </NuxtLink>
        </div>
        <div class="flex flex-col gap-1 md:max-w-2xl lg:text-lg text-sm px-2">
          <p>{{ design.attribution }}</p>
          <a class="text-yellow-200 max-w-full hover:underline" :href="design.url" target="_blank">{{
            design.urlDescription }}
            <Icon name="material-symbols:arrow-right-alt-rounded" class="ml-1 mb-1" />
          </a>
        </div>
      </section>
      <section class="w-full h-max flex justify-center">
        <GalleryCardSheet :rows="3" :card-design="key" :arrangement="design.arrangement" />
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
  --hover-color: var(--tbl-black);
  font-family: Rubik, Verdana, sans-serif;
  overflow-y: scroll;
  color: var(--text-color);
  background-color: var(--color1);

  @media (prefers-color-scheme: light) {
    --color2: whitesmoke;
    --color1: white;
    --text-color: var(--tbl-black);
    --link-color: #e30000;
    --hover-color: white;
  }
}

h1,
h2 {
  font-family: "Potta One", sans-serif;
  font-weight: bold;
  letter-spacing: 0.1rem;
}

.header {

  @media (prefers-color-scheme: dark) {
    & h1 span {
      color: transparent;
      background: var(--gradient-gold);
      background-clip: text;
    }
  }
}

article {
  background-color: var(--color2);
  width: 90%;
  margin: 1rem auto;
  border-radius: 1rem;
  box-shadow: 0.05rem 0.1rem 0.3rem 0 #555;

  &:hover {
    background-color: var(--hover-color);
  }
}

a {
  transition: translate 0.5s;
  color: var(--link-color);

  &.play {
    font-family: "Potta One", sans-serif;
  }
}
</style>
