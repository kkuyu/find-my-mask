<template>
  <div>
    <div>{{ error }}</div>
    <NuxtLink :to="{ path: '/' }">Go Home</NuxtLink>
  </div>
</template>

<script>
export default {
  layout: 'error',
  name: 'errorLayout',
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
