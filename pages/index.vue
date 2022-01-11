<template>
  <div>
    <strong>index</strong>
    <SearchForm :formData="formData" @validSubmit="onFormSubmit"></SearchForm>
    <ul v-if="resultData.list.length">
      <template v-for="(item, index) in resultData.list">
        <li :key="index">
          <NuxtLink :to="`/detail/${item.PRDLST_NM}`"> {{ item }}</NuxtLink>
        </li>
      </template>
    </ul>
    <div v-else-if="resultData.status === 'complete'">조회 결과가 없습니다.</div>
    <InfiniteLoading v-if="resultData.list.length" @infinite="onScrolling"></InfiniteLoading>
  </div>
</template>

<script>
import { ref } from '@nuxtjs/composition-api';

import SearchForm from '@/components/SearchForm';

export default {
  name: 'Index',
  components: {
    SearchForm,
  },
  setup(props, context) {
    const formData = ref({
      category: 'company',
      company: '',
      product: '',
    });

    const pageNum = ref(1);
    const resultData = ref({
      status: 'reset',
      list: [],
    });

    const getList = async (eventType, state) => {
      const params = {
        class_no: formData.value.drugCode,
        BSSH_NM: encodeURIComponent(formData.value.company),
        PRDLST_NM: encodeURIComponent(formData.value.product),
        pageNo: pageNum.value,
        numOfRows: 10,
      };

      context.root.$api.mask
        .getList(params)
        .then((response) => {
          console.log(response.data.body);
          if (response.data.body.hasOwnProperty('items') && response.data.body.items.length) {
            resultData.value.status = 'update';
            resultData.value.list.push(...response.data.body.items);
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
      getList('onFormSubmit');
    };

    const onScrolling = (state) => {
      pageNum.value += 1;
      getList('onScrolling', state);
    };

    return {
      formData,
      resultData,
      getList,
      onFormSubmit,
      onScrolling,
    };
  },
};
</script>
