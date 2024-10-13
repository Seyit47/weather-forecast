// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: true,

    compatibilityDate: "2024-04-03",
    devtools: { enabled: false },

    imports: {
        autoImport: true,
        dirs: [
            "./composables/app",
            "./composables/common",
            "./utils/errors",
            "./utils/date",
            "./types/*.ts",
        ],
    },

    eslint: {
        lintOnStart: false,
    },

    css: ["@/assets/scss/style.scss"],

    tailwindcss: {
        configPath: "../tailwind.config.js",
        viewer: false,
    },

    components: {
        dirs: [
            {
                "path": "@/components/base",
                "pattern": ["Base*.vue", "Base*/index.vue"],
            },
            {
                "path": "@/components/app",
                "pattern": ["App*.vue", "App*/index.vue"],
            },
            {
                "path": "@/components/common",
                "pattern": ["Common*.vue", "Common*/index.vue"],
            },
            {
                "path": "@/components/icons",
                "pattern": ["Icon*.vue"],
            },
        ],
    },

    srcDir: "./src",

    routeRules: {
        "/api/v1/**": {
            proxy: {
                to: `${process.env.FORECAST_SERVER_ORIGIN}/v1/**`,
            },
        },
        "/geo-api/v1/**": {
            proxy: {
                to: `${process.env.GEOCODING_SERVER_ORIGIN}/v1/**`,
            },
        },
        "/static/images/**": {
            proxy: {
                to: `${process.env.IMAGES_SERVER_ORIGIN}/images/**`,
            },
        },
    },

    runtimeConfig: {
        public: {
            API_TOKEN: process.env.API_TOKEN,
        },
    },

    modules: ["@nuxtjs/eslint-module", "@nuxtjs/tailwindcss"],

    plugins: ["~/plugins/http.ts", "~/plugins/toast.ts", "~/plugins/loading.ts"],
});
