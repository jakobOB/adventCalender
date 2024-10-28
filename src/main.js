import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import Vue3Lottie from 'vue3-lottie'
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import ConfirmationService from 'primevue/confirmationservice';
import Ripple from 'primevue/ripple';
import StyleClass from 'primevue/styleclass';
import Tooltip from 'primevue/tooltip';
import ToastService from "primevue/toastservice";
import DialogService from "primevue/dialogservice";
import BadgeDirective from "primevue/badgedirective";

import Card from 'primevue/card';
import Dialog from 'primevue/dialog';
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";

import '@/assets/styles/styles.scss';

const app = createApp(App);

app.use(PrimeVue);
app.use(Vue3Lottie);
app.use(ToastService);
app.use(DialogService);
app.use(ConfirmationService);

app.component('Card', Card);
app.component('Dialog', Dialog);
app.component('Button', Button);
app.component('Dropdown', Dropdown);

app.directive('tooltip', Tooltip);
app.directive('badge', BadgeDirective);
app.directive('ripple', Ripple);
app.directive('styleclass', StyleClass);

app.mount('#app');
