import Vue from 'vue';
import { NuxtAxiosInstance } from '@nuxtjs/axios';
import { MaskStore } from '@/store/types';
import { CustomApiInstance } from '@/plugins/api';

// NOTE: `node_modules/vuex/types/vue.d.ts` 파일 삭제 필요

declare module '*.vue' {
  export default Vue;
}

declare module 'vue/types/vue' {
  interface Vue {
    $api: CustomApiInstance;
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
