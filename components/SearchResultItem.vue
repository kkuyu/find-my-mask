<template>
  <div>
    <NuxtLink :to="`/detail/${data.product}`">
      {{ data.product }}
      {{ data.company }}
      {{ data.grade }}
      {{ data.class }}
    </NuxtLink>
  </div>
</template>

<script>
export default {
  name: 'SearchResultItem',
  props: {
    data: {
      type: Object,
      required: true,
      default: () => ({
        product: '',
        company: '',
        grade: '',
        class: '',
      }),
    },
  },
  setup(props, context) {},
};
</script>

<style></style>
