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
import { ref, watch, computed, onMounted } from '@nuxtjs/composition-api';

import SearchForm from '@/components/SearchForm';

export default {
  name: 'Index',
  components: {
    SearchForm,
  },
  setup(props, context) {
    const $route = computed(() => context.root.$route);

    const formData = ref({
      category: 'company',
      company: '',
      product: '',
      isLoading: false,
    });

    const resultData = ref({
      status: 'reset',
      pageNo: 1,
      list: [],
    });

    const resetResultData = () => {
      resultData.value.status = 'reset';
      resultData.value.pageNo = 1;
      resultData.value.list = [];
    };

    const getListData = async (eventType, state) => {
      formData.value.isLoading = true;

      const params = {
        class_no: formData.value.drugCode,
        BSSH_NM: encodeURIComponent(formData.value.company),
        PRDLST_NM: encodeURIComponent(formData.value.product),
        pageNo: resultData.value.pageNo,
        numOfRows: 10,
      };

      context.root.$api.mask
        .getList(params)
        .then((response) => {
          formData.value.isLoading = false;
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
          formData.value.isLoading = false;
          resultData.value.status = 'error';
          if (eventType === 'onScrolling') state.error();
        });
    };

    const onFormSubmit = () => {
      if (formData.value.isLoading === true) return false;

      context.root.$router.push({
        path: '',
        query: (() => {
          if (formData.value.company) return { company: formData.value.company };
          if (formData.value.product) return { product: formData.value.product };
        })(),
      });
    };

    const onScrolling = (state) => {
      if (formData.value.isLoading === true) return false;

      resultData.value.pageNo += 1;
      getListData('onScrolling', state);
    };

    watch(
      () => [$route.value.query.company, $route.value.query.product],
      () => {
        if (!Object.keys($route.value.query).length) {
          formData.value.category = 'company';
          formData.value.company = '';
          formData.value.product = '';

          resultData.value.status = 'reset';
          resultData.value.pageNo = 1;
          resultData.value.list = [];
        } else {
        resetResultData();
        getListData('onChangeQuery');
        }
      }
    );

    onMounted(() => {
      if (!Object.keys($route.value.query).length) return;

      if ($route.value.query.company) {
        formData.value.category = 'company';
        formData.value.company = $route.value.query.company;
      }
      if ($route.value.query.product) {
        formData.value.category = 'product';
        formData.value.product = $route.value.query.product;
      }

      resetResultData();
      getListData('onMounted');
    });

    return {
      formData,
      resultData,
      onFormSubmit,
      onScrolling,
    };
  },
};
</script>
