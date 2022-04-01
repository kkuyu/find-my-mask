<template>
  <div id="app">
    <Header />
    <Nuxt />
    <Footer />
  </div>
</template>

<script>
import { useStore } from '@nuxtjs/composition-api';

import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
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
    const store = useStore();

    store.commit('search/INIT_STORE');

    store.subscribe((mutation, state) => {
      typeof window !== 'undefined' && localStorage.setItem('storeSearch', JSON.stringify(state.search));
    });
  },
};
</script>
