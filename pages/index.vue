<template>
  <div>
    <SearchForm :formData="formData" @validSubmit="onFormSubmit"></SearchForm>
    <SearchResult :resultData="resultData" @onScrolling="onScrolling"></SearchResult>
  </div>
</template>

<script>
import { ref, watch, computed, onMounted, useStore } from '@nuxtjs/composition-api';

import SearchForm from '@/components/SearchForm';
import SearchResult from '@/components/SearchResult';

export default {
  name: 'Index',
  components: {
    SearchForm,
    SearchResult,
  },
  setup(props, context) {
    const store = useStore();
    const $route = computed(() => context.root.$route);

    const formData = ref({
      category: 'company',
      keyword: '',
      isLoading: false,
    });

    const resultData = ref({
      status: 'reset',
      pageNo: 1,
      list: [],
    });

    const updateFormData = () => {
      formData.value.category = $route.value.query.company ? 'company' : 'product';
      formData.value.keyword = $route.value.query[formData.value.category];
    };

    const resetFormData = () => {
      formData.value.category = 'company';
      formData.value.keyword = '';
      formData.value.isLoading = false;
    };

    const resetResultData = () => {
      resultData.value.status = 'reset';
      resultData.value.pageNo = 1;
      resultData.value.list = [];
    };

    const getListData = async (eventType, state) => {
      formData.value.isLoading = true;

      const params = {
        class_no: formData.value.drugCode,
        BSSH_NM: encodeURIComponent(formData.value.category === 'company' ? formData.value.keyword : ''),
        PRDLST_NM: encodeURIComponent(formData.value.category === 'product' ? formData.value.keyword : ''),
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
        query: {
          [formData.value.category]: formData.value.keyword,
        },
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
          resetFormData();
          resetResultData();
        } else {
          updateFormData();
          resetResultData();
          getListData('onChangeQuery');
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
        getListData('onMounted');
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
