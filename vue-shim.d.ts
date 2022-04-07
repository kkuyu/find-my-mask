import Vue from 'vue';
import { NuxtAxiosInstance } from '@nuxtjs/axios';
import { MaskStore } from '@/store/types';
import { CustomApiInstance } from '@/plugins/api';
import { CustomErrorInstance } from '@/plugins/error';

declare module '*.vue' {
  export default Vue;
}

declare module 'vue/types/vue' {
  interface Vue {
    $api: CustomApiInstance;
    $customError: CustomErrorInstance;
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    store?: MaskStore;
  }
}

declare module '@nuxt/types' {
  interface Context {
    $axios: NuxtAxiosInstance;
  }
}
