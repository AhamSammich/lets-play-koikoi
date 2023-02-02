// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxtjs/tailwindcss',
    ],
    tailwindcss: {
    },
    postcss: {
        plugins: {
            'autoprefixer': {},
            'postcss-preset-env': {
                stage: 0,
                // features: {
                //     'container-queries': true,
                // }
            }
        }
    }
})
