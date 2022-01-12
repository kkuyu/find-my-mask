<template>
  <div>
    <strong>detail</strong>
    <p>detailId: {{ detailId }}</p>
    <p>status: {{ resultData.status }}</p>
    <div>{{ resultData.detail }}</div>
  </div>
</template>

<script>
import { ref, watch, computed, useRoute, onMounted } from '@nuxtjs/composition-api';

export default {
  name: 'Detail',
  setup(props, context) {
    const route = useRoute();

    const detailId = computed(() => route.value.params.id || '');
    const resultData = ref({
      status: 'reset',
      detail: null,
    });

    const getProductData = async (eventType, state) => {
      const params = {
        item_name: encodeURIComponent(detailId.value),
        pageNo: 1,
        numOfRows: 1,
      };

      console.log(params);

      context.root.$api.mask
        .getProduct(params)
        .then((response) => {
          console.log(response.data.body);
          if (response.data.body.hasOwnProperty('items') && response.data.body.items.length) {
            if (detailId.value === response.data.body.items[0].ITEM_NAME) {
              resultData.value.status = 'update';
              resultData.value.detail = response.data.body.items[0];
            } else {
              resultData.value.status = 'empty';
            }
          } else {
            resultData.value.status = 'empty';
          }
        })
        .catch((error) => {
          console.log(error);
          resultData.value.status = 'error';
        });
    };

    watch(
      () => detailId.value,
      () => {
        resultData.value.status = 'reset';
        resultData.value.detail = null;
        getProductData();
      }
    );

    onMounted(() => {
      resultData.value.status = 'reset';
      resultData.value.detail = null;
      getProductData();
    });

    return {
      detailId,
      resultData,
    };
  },
};
</script>
