<template>
  <div class="header">
    <component :is="isHome ? 'h1' : 'strong'">
      <NuxtLink v-if="isHome" :to="{ path: '/search', query: null }" class="header-link go-home">
        <font-awesome-icon :icon="['fas', 'paperclip']" aria-hidden="true" />
        <span class="text">Find My Mask</span>
      </NuxtLink>
      <button v-else type="button" class="header-link go-back" @click="historyBack">
        <font-awesome-icon :icon="['fas', 'arrow-left']" aria-hidden="true" />
        <span class="text">Find My Mask</span>
      </button>
    </component>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  name: 'Header',
  setup(props, context) {
    const isHome: ComputedRef<boolean> = computed(() => {
      if (context.root.$route.path === '/') return true;
      if (context.root.$route.path.includes('/search')) return true;
      return false;
    });

    const historyBack: () => void = () => {
      if (window.history.length > 1) {
        context.root.$router.back();
      } else {
        context.root.$router.push({
          path: '/search',
        });
      }
    };

    return {
      historyBack,
      isHome,
    };
  },
});
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
  width: 100%;
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
    font-weight: 700;
  }
}
</style>
