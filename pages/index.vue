<template>
  <div>
    <strong>index</strong>
    <SearchForm :formData="formData" @validSubmit="onFormSubmit"></SearchForm>
    <ul v-if="resultData.list.length">
      <template v-for="(item, index) in resultData.list">
        <li :key="index">{{ item }}</li>
      </template>
    </ul>
    <div v-else-if="resultData.status === 'complete'">조회 결과가 없습니다.</div>
    <InfiniteLoading v-if="resultData.list.length" @infinite="onScrolling"></InfiniteLoading>
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

    const pageNum = ref(1);
    const resultData = ref({
      status: 'reset',
      list: [],
    });

    const getMasks = async (eventType, state) => {
      const params = {
        class_no: formData.value.drugCode,
        entp_name: encodeURIComponent(formData.value.company),
        item_name: encodeURIComponent(formData.value.product),
        pageNo: pageNum.value,
        numOfRows: 10,
      };

      context.root.$api.mask
        .getMasks(params)
        .then((response) => {
          const data = JSON.parse(
            convert.xml2json(response.data, {
              compact: true,
              spaces: 4,
            })
          );
          if (data.response.body.items.hasOwnProperty('item') && data.response.body.items.item.length) {
            resultData.value.status = 'update';
            resultData.value.list.push(...data.response.body.items.item);
            if (eventType === 'onScrolling') state.loaded();
          } else {
            resultData.value.status = 'complete';
            if (eventType === 'onScrolling') state.complete();
          }
        })
        .catch((error) => {
          console.log(error);
          resultData.value.status = 'error';
          if (eventType === 'onScrolling') state.error();
        });
    };

    const onFormSubmit = () => {
      pageNum.value = 1;
      resultData.value.status = 'reset';
      resultData.value.list = [];
      getMasks('onFormSubmit');
    };

    const onScrolling = (state) => {
      pageNum.value += 1;
      getMasks('onScrolling', state);
    };

    return {
      formData,
      resultData,
      getMasks,
      onFormSubmit,
      onScrolling,
    };
  },
};
</script>
