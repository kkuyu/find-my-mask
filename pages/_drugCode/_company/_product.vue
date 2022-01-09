<template>
  <div>
    <strong>detail</strong>
    <p>drugCode: {{ drugCode }}</p>
    <p>company: {{ company }}</p>
    <p>product: {{ product }}</p>
  </div>
</template>

<script>
import { ref, onMounted, computed, useRoute } from '@nuxtjs/composition-api';
import convert from 'xml-js';

export default {
  name: 'Detail',
  setup(props, context) {
    const route = useRoute();

    const drugCode = computed(() => route.value.params.drugCode || '');
    const company = computed(() => route.value.params.company || '');
    const product = computed(() => route.value.params.product || '');

    const getMasks = async () => {
      const params = {
        class_no: encodeURIComponent(drugCode.value),
        entp_name: encodeURIComponent(company.value),
        item_name: encodeURIComponent(product.value),
        pageNo: 1,
        numOfRows: 10,
      };

      const response = context.root.$api.mask.getMasks(params);

      response
        .then((response) => {
          const data = convert.xml2json(response.data, {
            compact: true,
            spaces: 4,
          });
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    onMounted(() => {
      getMasks();
    });

    return {
      drugCode,
      company,
      product,
    };
  },
};
</script>
