<template>
  <div>
    <strong>index</strong>
    <SearchForm :formData="formData" @validSubmit="getMasks"></SearchForm>
  </div>
</template>

<script>
import { ref } from '@nuxtjs/composition-api';
import convert from 'xml-js';

import SearchForm from '@/components/SearchForm';

export default {
  name: 'Index',
  components: {
    SearchForm,
  },
  setup(props, context) {
    const formData = ref({
      category: 'company',
      drugCode: '32100',
      company: '',
      product: '',
    });

    const getMasks = async () => {
      const { category, drugCode, company, product } = formData.value;
      const params = {
        class_no: drugCode,
        entp_name: encodeURIComponent(company),
        item_name: encodeURIComponent(product),
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

    return {
      formData,
      getMasks,
    };
  },
};
</script>
