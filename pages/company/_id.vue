<template>
  <div>
    <strong>company detail</strong>
    <p>companyId: {{ companyId }}</p>
  </div>
</template>

<script>
import { ref, onMounted, computed, useRoute } from '@nuxtjs/composition-api';
export default {
  name: 'ProductDetail',
  setup(props, context) {
    const route = useRoute();

    const companyId = computed(() => route.value.params.id || '');

    return {
      companyId,
    };
  },
};
</script>
