<template>
  <div>
    <div>{{ error }}</div>
    <NuxtLink :to="{ path: '/', query: null }">Go Home</NuxtLink>
  </div>
</template>

<script>
export default {
  layout: 'error',
  name: 'errorLayout',
  head() {
    return {
      title: 'Error',
      description: process.env.DESCRIPTION,
    };
  },
  components: {
    Error,
  },
  props: {
    error: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
  },
  setup(props, context) {},
};
</script>
