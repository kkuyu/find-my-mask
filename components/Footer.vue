<template>
  <footer>
    <p class="copy">&copy; {{ year }} All rights reserved</p>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  setup(props, context) {
    const year = new Date().getFullYear();

    return {
      year,
    };
  },
};
</script>

<style lang="scss" scoped>
footer {
  .copy {
    margin: 2rem 1rem;
    font-size: 0.875rem;
    text-align: center;
    color: var(--color-gray);
  }
}
</style>
