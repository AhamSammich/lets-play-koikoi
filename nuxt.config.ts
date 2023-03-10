// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "Let's Play Koi-Koi!",
      meta: [
        {
          name: "description",
          content: "Play Hanafuda Koi-Koi against an AI opponent.",
        },
      ],
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "~/assets/images/coin.png",
        },
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: true,
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&family=Potta+One&display=swap",
        },
      ],
    },
  },
  pages: false,
  ssr: true,
  modules: ["@nuxtjs/tailwindcss", "nuxt-icon", "@vueuse/nuxt", "nuxt-vitest"],
  tailwindcss: {},
  postcss: {
    plugins: {
      autoprefixer: {},
      "postcss-preset-env": {
        stage: 1,
      },
    },
  },
});
