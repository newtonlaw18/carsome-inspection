import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import VuePhoneNumberInput from "vue-phone-number-input";
import "vue-phone-number-input/dist/vue-phone-number-input.css";
import "vue2-timepicker/dist/VueTimepicker.css";

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VCalendar from "v-calendar";
import ICS from "vue-ics";

Vue.config.productionTip = false;

Vue.component("vue-phone-number-input", VuePhoneNumberInput);
Vue.use(VCalendar, {
  componentPrefix: "vc",
});
Vue.use(ICS);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
