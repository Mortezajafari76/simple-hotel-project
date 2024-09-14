import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import vitePluginRequire from "vite-plugin-require";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  build: {
    transpile: ["vuetify"],
  },

  plugins: [],

  css: [
    "~/assets/css/index.scss",
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.css",
  ],

  runtimeConfig: {
    public: {
      VERSION: require("./package.json").version,
    },
  },

  app: {
    head: {
      titleTemplate: "%s",
      // title: Constants.WEBSITE_TITLE,
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content: "",
        },
        { name: "format-detection", content: "telephone=no" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    "@nuxtjs/i18n",
  ],

  i18n: {
    vueI18n: "./i18n.config.js", // if you are using custom path, default
  },

  // storybook: {
  //   //
  // },

  components: {
    global: true,
    dirs: ["~/components"],
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    resolve: {
      mainFields: ["browser", "module", "main", "jsnext:main", "jsnext"],
    },
    ssr: {
      // if ssr enabled in future, this config is required to load vuetify properly
      noExternal: ["vuetify"],
    },
    plugins: [vitePluginRequire()],
  },

  compatibilityDate: "2024-09-14",
});