

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import VueApexCharts from "vue3-apexcharts";
import App from './App.vue'
import router from './router'
import '@/assets/styles/index.css';


const app = createApp(App)
const pinia = createPinia()

const vuetify = createVuetify({
    components,
    directives,
})
app.component('v-select', vSelect)

app.use(router)
app.use(pinia)
app.use(vuetify)
app.use(Toast, {
    transition: "Vue-Toastification__bounce",
    maxToasts: 20,
    newestOnTop: true,
    position: "top-right",
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: "button",
    icon: true,
    rtl: false
});
app.use(VueApexCharts);

app.mount('#app')
