import Vue from 'vue';
import { NuxtAxiosInstance } from '@nuxtjs/axios';

declare module '*.vue' {
  export default Vue;
}

declare module '@nuxt/types' {
  interface Context {
    $axios: NuxtAxiosInstance;
  }
}
