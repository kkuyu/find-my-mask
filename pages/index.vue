<template>
  <div>
    <strong>index</strong>
    <SearchForm @validSubmit="getMasks"></SearchForm>
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
    const getMasks = async (formData) => {
      const { category, drugCode, company, product } = formData;
      const params = {
        class_no: drugCode,
        entp_name: encodeURIComponent(company),
        item_name: encodeURIComponent(product),
        pageNo: 1,
        numOfRows: 10,
      };

      console.log(formData);

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
      getMasks,
    };
  },
};
</script>
