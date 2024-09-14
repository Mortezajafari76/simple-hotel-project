import axios from "axios";
import VianaAxios from "@/constants/viana-axios";
import importedConfig from "@/public/config.json";
import Constants from "@/constants/global-constants";

export let baseURLs = {};

const setURLs = (config) => {
  if (!config) return;

  Object.keys(config).forEach((key) => {
    baseURLs[key] = config[key];
  });
};

export default defineNuxtPlugin(async (nuxtApp) => {
  try {
    // TODO: doesn't work for ssr
    if (Constants.SSR) {
      setURLs(importedConfig);
      return;
    }

    const configResponse = await fetch("/config.json");
    const config = await configResponse.json();

    if (!config) throw "not found";

    setURLs(config);

    const localeCode =
      nuxtApp.$i18n?.localeProperties?.code?.toUpperCase() || "FA";

    const baseURL = config[`BASE_URL_${localeCode}`];

    if (!baseURL) return;

    axios.defaults.baseURL = baseURL;
    VianaAxios.defaults.baseURL = baseURL;
  } catch (error) {
    console.error("Error loading configuration:", error);
  }
});
