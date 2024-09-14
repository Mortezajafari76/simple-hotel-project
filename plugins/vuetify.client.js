// import this after install `@mdi/font` package

import { createVuetifyConfig } from "../constants/vuetify-config";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetifyConfig();
  app.vueApp.use(vuetify);
});
