// import Vue from "vue";
import moment from "jalali-moment";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.productionTip = false;
  // require("moment/locale/fa");
  // nuxtApp.vueApp.use(require("vue-moment-jalaali"));
  moment.locale("fa");
});
