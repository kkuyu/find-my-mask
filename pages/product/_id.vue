<template>
  <div>
    <strong>product detail</strong>
    <p>productId: {{ productId }}</p>
  </div>
</template>

<script>
import { ref, onMounted, computed, useRoute } from '@nuxtjs/composition-api';
export default {
  name: 'ProductDetail',
  setup(props, context) {
    const route = useRoute();

    const productId = computed(() => route.value.params.id || '');

    return {
      productId,
    };
  },
};
</script>
