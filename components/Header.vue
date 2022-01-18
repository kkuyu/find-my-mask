<template>
  <div class="header">
    <component :is="isHome ? 'h1' : 'strong'">
      <NuxtLink v-if="isHome" :to="{ path: '/', query: null }" class="header-link go-home">
        <font-awesome-icon :icon="['fas', 'paperclip']" />
        <span class="text">Find My Mask</span>
      </NuxtLink>
      <button v-else type="button" class="header-link go-back" @click="historyBack">
        <font-awesome-icon :icon="['fas', 'arrow-left']" />
        <span class="text">Find My Mask</span>
      </button>
    </component>
  </div>
</template>

<script>
import { computed } from '@nuxtjs/composition-api';

export default {
  name: 'Header',
  setup(props, context) {
    const isHome = computed(() => context.root.$route.path === '/');

    const historyBack = () => {
      context.root.$router.back();
    };

    return {
      historyBack,
      isHome,
    };
  },
};
</script>

<style lang="scss" scoped>
.header {
  padding: 1.5rem 0;
  > h1,
  > strong {
    display: block;
  }
}

.header-link {
  display: flex;
  align-items: center;
  font-size: 1.125rem;
  .svg-inline--fa {
    display: block;
    padding: 0.75rem;
    color: var(--color-primary);
    background-color: var(--color-white);
    border-radius: 0.5rem;
  }
  .text {
    padding-left: 0.5rem;
    color: var(--color-black);
    font-weight: 600;
  }
}
</style>
