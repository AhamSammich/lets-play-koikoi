// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
          rel: "preload",
          as: "style",
          href: "https://fonts.googleapis.com/css2?family=Potta+One&display=swap",
          onload: "this.rel = 'stylesheet'",
        },
        {
          rel: "preload",
          as: "style",
          href: "https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;700&display=swap",
          onload: "this.rel = 'stylesheet'",
        },
      ],
      meta: [
        {
          name: "theme-color",
          content: "#40495a",
        },
      ],
    },
  },
  css: ["@/assets/css/card-styles.css"],
  devServer: {
    port: 43505,
  },
  // image: {
  //   presets: {
  //     card: {
  //       modifiers: {
  //         fit: "cover",
  //         sizes: "sm:80px md:120px lg:150px",
  //       },
  //     },
  //     screenshot: {
  //       modifiers: {
  //         width: 285,
  //         height: 640,
  //       },
  //     },
  //   },
  // },
  modules: [
    "@nuxtjs/tailwindcss",
    "nuxt-icon",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    // "@nuxt/image-edge",
    "@nuxt/devtools",
  ],
  pages: true,
  plugins: [
    {
      src: "~/plugins/vercel.ts",
      mode: "client",
    },
  ],
  routeRules: {
    // Set custom headers matching paths
    "/_nuxt/**": {
      headers: {
        "Cache-Control": "public, maxage=86400, stale-while-revalidate=86400",
      },
    },
    "/(_ipx|cards|images|_vercel)/**": {
      headers: {
        "Cache-Control":
          "public, maxage=604800, stale-while-revalidate=86400, stale-if-error=86400",
      },
    },
  },
  ssr: false,
  tailwindcss: {
    viewer: false,
  },
});
