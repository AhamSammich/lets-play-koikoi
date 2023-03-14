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
          href: "coin.png",
        },
      ],
    },
  },
  pages: true,
  ssr: true,
  modules: [
    "@nuxtjs/tailwindcss",
    "nuxt-icon",
    "@vueuse/nuxt",
    "nuxt-vitest",
    "@pinia/nuxt",
    "@nuxt/image-edge",
  ],
  tailwindcss: {},
  postcss: {
    plugins: {
      autoprefixer: {},
      "postcss-preset-env": {
        stage: 1,
      },
    },
  },
  image: {
    presets: {
      card: {
        modifiers: {
          fit: 'cover',
          width: 100,
          height: 150,
        }
      },
      screenshot: {
        modifiers: {
          width: 285,
          height: 640
        }
      }
    }
  }
});
