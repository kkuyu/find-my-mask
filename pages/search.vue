<template>
  <div>
    <!-- form -->
    <SearchForm :isLoading="isLoading" :formData="formData" @validSubmit="onFormSubmit"></SearchForm>
    <!-- result -->
    <SearchResult :isLoading="isLoading" :resultData="resultData">
      <template #resultListCardSkeleton>
        <SearchResultCard :isSkeleton="true" />
      </template>
      <template v-for="item in resultData.list" v-slot:[`resultListCard${item.PRDLST_SN}`]="{ data }">
        <SearchResultCard :key="`resultListCard${item.PRDLST_SN}`" :isSkeleton="false" :data="data" />
      </template>
    </SearchResult>
    <!-- pagination -->
    <SearchPagination :resultData="resultData" @updatePage="onUpdatePage" />
  </div>
</template>

<script>
import { ref, watch, computed, onMounted, useStore } from '@nuxtjs/composition-api';

import SearchForm from '@/components/SearchForm';
import SearchResult from '@/components/SearchResult';
import SearchResultCard from '@/components/SearchResultCard';
import SearchPagination from '@/components/SearchPagination.vue';

export default {
  name: 'Index',
  components: {
    SearchForm,
    SearchResult,
    SearchResultCard,
    SearchPagination,
  },
  setup(props, context) {
    const store = useStore();
    const $route = computed(() => context.root.$route);

    const isLoading = ref(false);

    const formData = ref({
      category: '',
      keyword: '',
    });

    const resultData = ref({
      status: 'reset',
      currentPage: 1,
      totalPage: 1,
      list: [],
    });

    const resetFormData = () => {
      formData.value.category = 'product';
      formData.value.keyword = '';
    };

    const resetResultData = () => {
      resultData.value.status = 'reset';
      resultData.value.currentPage = 1;
      resultData.value.totalPage = 1;
      resultData.value.list = [];
    };

    const updateFormData = () => {
      formData.value.category = $route.value.query.company ? 'company' : 'product';
      formData.value.keyword = $route.value.query[formData.value.category];
    };

    const updateResultData = async () => {
      resultData.value.currentPage = parseInt($route.value.query.page);
      resultData.value.list = [];

      const params = {
        BSSH_NM: encodeURIComponent(formData.value.category === 'company' ? formData.value.keyword : ''),
        PRDLST_NM: encodeURIComponent(formData.value.category === 'product' ? formData.value.keyword : ''),
        pageNo: resultData.value.currentPage,
        numOfRows: 10,
      };

      const response = await context.root.$api.mask.getList(params);
      try {
        // emptyBody
        if (!response.data.body) {
          throw { name: 'emptyBody' };
        }
        // totalPageOver
        const totalPage = Math.ceil(response.data.body.totalCount / 10);
        if (resultData.value.currentPage > totalPage) {
          throw { name: 'totalPageOver', totalPage };
        }
        // naturel data
        isLoading.value = false;
        resultData.value.status = 'update';
        resultData.value.totalPage = totalPage;
        if (response.data.body.hasOwnProperty('items') && response.data.body.items.length) {
          resultData.value.list.push(...response.data.body.items);
        }
      } catch (error) {
        if (error.name === 'totalPageOver') {
          context.root.$router.push({
            path: '/search',
            query: {
              page: error.totalPage || 1,
              [formData.value.category]: formData.value.keyword,
            },
          });
          return;
        } else if (error.name === 'emptyBody') {
          isLoading.value = false;
          resultData.value.status = 'error';
        } else {
          console.log(error);
          isLoading.value = false;
          resultData.value.status = 'error';
        }
      }
    };

    const onFormSubmit = () => {
      if (isLoading.value === true) return false;

      context.root.$router.push({
        path: '/search',
        query: {
          page: 1,
          [formData.value.category]: formData.value.keyword,
        },
      });
    };

    const onUpdatePage = (num) => {
      context.root.$router.push({
        path: '/search',
        query: {
          page: num,
          [formData.value.category]: formData.value.keyword,
        },
      });
    };

    watch(
      () => $route.value.query,
      () => {
        if (!Object.keys($route.value.query).length) {
          isLoading.value = false;
          resetFormData();
          resetResultData();
        } else {
          isLoading.value = true;
          updateFormData();
          updateResultData();
          store.commit('search/addKeyword', {
            text: formData.value.keyword,
            category: formData.value.category,
          });
        }
      }
    );

    onMounted(() => {
      if (!Object.keys($route.value.query).length) {
        isLoading.value = false;
        resetFormData();
        resetResultData();
      } else {
        isLoading.value = true;
        updateFormData();
        updateResultData();
        store.commit('search/addKeyword', {
          text: formData.value.keyword,
          category: formData.value.category,
        });
      }
    });

    return {
      isLoading,
      formData,
      resultData,
      onFormSubmit,
      onUpdatePage,
    };
  },
};
</script>
