import { Constants } from "@/constants/global-constants";

import { version } from "../package.json";

const currentVersion = version;

export default defineNuxtPlugin((app) => {
  const cacheVersion = localStorage.getItem(`${Constants.STORE_KEY}-version`);

  // CAUTION: Only works for https websites
  if (cacheVersion == currentVersion) return;

  if (typeof caches != "undefined") {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((name) => {
        caches.delete(name);
      });
    });
  }

  localStorage.setItem(`${Constants.STORE_KEY}-version`, currentVersion);

  window.location.replace(window.location.href);
});
