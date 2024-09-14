import "vuetify/styles";
import "vuetify/lib/styles/main.sass";
import "../assets/css/vuetify-variables.scss";

import { createVuetify } from "vuetify";
import { fa } from "vuetify/locale";

import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export const createVuetifyConfig = () =>
  createVuetify({
    components,
    directives,
    locale: {
      locale: "fa",
      fallback: "fa",
      messages: { fa },
      rtl: { fa: true },
    },
    theme: {
      defaultTheme: "light",
    },
    ssr: false,
    // ... your configuration
  });
