<template>
  <footer>
    <p class="copy">&copy; {{ yearString }} All rights reserved</p>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  name: 'Footer',
  setup(props, context) {
    const yearString: string = new Date().getFullYear().toString();

    return {
      yearString,
    };
  },
});
</script>

<style lang="scss" scoped>
footer {
  .copy {
    padding: 2rem 1rem;
    font-size: 0.875rem;
    text-align: center;
    color: var(--color-gray);
  }
}
</style>
