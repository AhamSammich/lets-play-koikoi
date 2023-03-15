// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devServer: {
    port: 43505,
  },
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
      link: [
        {
          rel: "icon",
          type: "image/webp",
          href: "images/webp/sakura.webp",
        },
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Potta+One&display=swap",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&display=swap",
        },
      ],
    },
  },
  pages: true,
  ssr: true,
  nitro: {
    compressPublicAssets: {
      gzip: true,
      brotli: false,
    },
    routeRules: {
      // Set custom headers matching paths
      "/_nuxt/**": {
        headers: {
          "Cache-Control":
            "private, maxage=86400, stale-while-revalidate=86400",
          "Content-Encoding": "gzip",
          Vary: "Accept-Encoding",
        },
      },
      "/_ipx/**": {
        headers: {
          "Cache-Control":
            "private, maxage=604800, stale-while-revalidate=86400, stale-if-error=86400",
        },
      },
      "/cards/**": {
        headers: {
          "Cache-Control":
            "private, maxage=604800, stale-while-revalidate=86400, stale-if-error=86400",
        },
      },
    },
  },
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
      src: "~/plugins/vercel.ts",
      mode: "client",
    },
  ],
  css: [
    "@/assets/css/card-styles.css",
    // "@/assets/css/font-face.css",
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
          fit: "cover",
          sizes: "sm:80px md:120px lg:150px",
        },
      },
      screenshot: {
        modifiers: {
          width: 285,
          height: 640,
        },
      },
    },
  },
});
