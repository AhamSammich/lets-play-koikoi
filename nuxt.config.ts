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
    },
  },
  pages: false,
  ssr: true,
  // app: {
  //     pageTransition: { name: 'page', mode: 'out-in' }
  //   },
  modules: ["@nuxtjs/tailwindcss", "nuxt-icon"],
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
