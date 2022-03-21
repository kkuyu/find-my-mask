<template>
  <div>
    <!-- form -->
    <SearchForm :formData="formData" @validSubmit="onFormSubmit"></SearchForm>
    <!-- result -->
    <SearchResult :resultData="resultData">
      <template v-for="item in resultData.list" v-slot:[`resultListCard${item.PRDLST_SN}`]="{ data }">
        <SearchResultCard :key="item.PRDLST_SN" :data="data" />
      </template>
    </SearchResult>
    <!-- initial loading -->
    <SearchResultCard v-if="formData.isLoading && !resultData.list.length" :isLoading="true" />
    <!-- infinite loading -->
    <InfiniteLoading v-if="resultData.list.length" @infinite="onScrolling">
      <div slot="spinner">
        <SearchResultCard :isLoading="true" />
      </div>
      <div slot="no-more">마지막 데이터입니다.</div>
      <div slot="no-results">마지막 데이터입니다.</div>
    </InfiniteLoading>
  </div>
</template>

<script>
import { ref, watch, computed, onMounted, useStore } from '@nuxtjs/composition-api';

import SearchForm from '@/components/SearchForm';
import SearchResult from '@/components/SearchResult';
import SearchResultCard from '@/components/SearchResultCard';

export default {
  name: 'Index',
  components: {
    SearchForm,
    SearchResult,
    SearchResultCard,
  },
  setup(props, context) {
    const store = useStore();
    const $route = computed(() => context.root.$route);

    const formData = ref({
      category: '',
      keyword: '',
      isLoading: false,
    });

    const resultData = ref({
      status: '',
      currentPage: 1,
      list: [],
    });

    const resetFormData = () => {
      formData.value.category = 'product';
      formData.value.keyword = '';
      formData.value.isLoading = false;
    };

    const resetResultData = () => {
      resultData.value.status = '';
      resultData.value.currentPage = 1;
      resultData.value.list = [];
    };

    const updateFormData = () => {
      formData.value.category = $route.value.query.company ? 'company' : 'product';
      formData.value.keyword = $route.value.query[formData.value.category];
    };

    const updateResultData = async (eventType, state) => {
      formData.value.isLoading = true;

      const params = {
        BSSH_NM: encodeURIComponent(formData.value.category === 'company' ? formData.value.keyword : ''),
        PRDLST_NM: encodeURIComponent(formData.value.category === 'product' ? formData.value.keyword : ''),
        pageNo: resultData.value.currentPage,
        numOfRows: 10,
      };

      context.root.$api.mask
        .getList(params)
        .then((response) => {
          formData.value.isLoading = false;
          if (!response.data.body) {
            resultData.value.status = 'error';
            if (eventType === 'onScrolling') state.error();
            return;
          }
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
        path: '/search',
        query: {
          [formData.value.category]: formData.value.keyword,
        },
      });
    };

    const onScrolling = (state) => {
      if (formData.value.isLoading === true) return false;

      resultData.value.currentPage += 1;
      updateResultData('onScrolling', state);
    };

    watch(
      () => [$route.value.query.company, $route.value.query.product],
      () => {
        if (!Object.keys($route.value.query).length) {
          resetFormData();
          resetResultData();
        } else {
          updateFormData();
          resetResultData();
          updateResultData('onChangeQuery');
          store.commit('search/addKeyword', {
            text: formData.value.keyword,
            category: formData.value.category,
          });
        }
      }
    );

    onMounted(() => {
      if (!Object.keys($route.value.query).length) {
        resetFormData();
        resetResultData();
      } else {
        updateFormData();
        resetResultData();
        updateResultData('onMounted');
        store.commit('search/addKeyword', {
          text: formData.value.keyword,
          category: formData.value.category,
        });
      }
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
