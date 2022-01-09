import Vue from 'vue';
import { ValidationProvider, ValidationObserver, extend, localize } from 'vee-validate';
import { required, max } from 'vee-validate/dist/rules';
import ko from 'vee-validate/dist/locale/ko.json';

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

localize('ko', ko);
extend('required', required);
extend('max', max);
