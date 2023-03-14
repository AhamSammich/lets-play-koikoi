// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: "icon",
          type: "image/webp",
          href: "images/webp/sakura.webp",
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
  plugins: [
    {
      src: '~/plugins/vercel.ts',
      mode: 'client',
    }
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
