<template>
  <div id="app">
    <Header />
    <Nuxt />
    <Footer />
  </div>
</template>

<script lang="ts">
import { Store as VuexStore } from 'vuex';
import { defineComponent, useStore } from '@nuxtjs/composition-api';

import { MaskType } from '@/store/types';

import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default defineComponent({
  name: 'defaultLayout',
  head() {
    return {
      title: '',
    };
  },
  components: {
    Header,
    Footer,
  },
  setup(props, context) {
    const store: VuexStore<MaskType> = useStore();

    store.commit('search/INIT_STORE');

    store.subscribe((mutation, state: MaskType) => {
      typeof window !== 'undefined' && localStorage.setItem('storeSearch', JSON.stringify(state.search));
    });
  },
});
</script>
