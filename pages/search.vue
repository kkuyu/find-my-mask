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

<script lang="ts">
import { ref, watch, computed, onMounted, useStore, defineComponent, Ref } from '@nuxtjs/composition-api';

import SearchForm from '@/components/SearchForm.vue';
import SearchResult from '@/components/SearchResult.vue';
import SearchResultCard from '@/components/SearchResultCard.vue';
import SearchPagination from '@/components/SearchPagination.vue';

import CustomError from '@/api/customError';
import { CustomErrorProto } from '@/api/customErrorTypes';

import { Category, Status, SearchFormData, SearchListData } from '@/types/view';
import { ListItem } from '@/api/maskTypes';

export default defineComponent({
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

    const formData: Ref<SearchFormData> = ref({
      category: 'product' as Category,
      keyword: '',
    });

    const resultData: Ref<SearchListData> = ref({
      status: 'reset' as Status,
      currentPage: 1,
      totalPage: 0,
      list: [],
    });

    const resetFormData = () => {
      formData.value.category = 'product';
      formData.value.keyword = '';
    };

    const resetResultData = () => {
      resultData.value.status = 'reset';
      resultData.value.currentPage = 1;
      resultData.value.totalPage = 0;
      resultData.value.list = [];
    };

    const updateFormData = () => {
      formData.value.category = ($route.value.query.company ? 'company' : 'product') as Category;
      formData.value.keyword = $route.value.query[formData.value.category] as string;
    };

    const updateResultData = async () => {
      const page = $route.value.query.page as string;
      resultData.value.currentPage = parseInt(page) || 1;
      resultData.value.list = [];

      const params = {
        BSSH_NM: encodeURIComponent(formData.value.category === 'company' ? formData.value.keyword : ''),
        PRDLST_NM: encodeURIComponent(formData.value.category === 'product' ? formData.value.keyword : ''),
        pageNo: resultData.value.currentPage,
        numOfRows: 10,
      };

      const response = await context.root.$api.mask.getList(params);
      try {
        // negative
        if (resultData.value.currentPage <= 0) {
          throw new context.root.$customError('negative');
        }
        // emptyBody
        if (!response.data.body || Object.keys(response.data.body).length === 0) {
          throw new context.root.$customError('emptyBody');
        }
        // totalPageOver
        const totalPage = Math.ceil(response.data.body.totalCount / 10) || 1;
        if (totalPage !== 0 && resultData.value.currentPage > totalPage) {
          throw new context.root.$customError('totalPageOver', { totalPage });
        }
        // naturel data
        isLoading.value = false;
        resultData.value.status = 'update';
        resultData.value.totalPage = totalPage;
        if (response.data.body.hasOwnProperty('items') && response.data.body.items.length) {
          const items: ListItem[] = [...response.data.body.items];
          resultData.value.list = items;
        }
      } catch (error: unknown) {
        if (error instanceof CustomError && error.label === 'negative') {
          onUpdatePage(1);
          return;
        } else if (error instanceof CustomError && error.label === 'emptyBody') {
          isLoading.value = false;
          resultData.value.status = 'error';
        } else if (error instanceof CustomError && error.label === 'totalPageOver') {
          onUpdatePage(error.extra.totalPage);
          return;
        } else if (error instanceof Error) {
          console.log(error);
          isLoading.value = false;
          resultData.value.status = 'error';
          return;
        }
      }
    };

    const onFormSubmit = () => {
      if (isLoading.value === true) return false;
      onUpdatePage(1);
    };

    const onUpdatePage = (num: number) => {
      context.root.$router.push({
        path: '/search',
        query: {
          page: num.toString(),
          [formData.value.category]: formData.value.keyword,
        },
      });
    };

    watch(
      () => $route.value.query,
      () => {
        isLoading.value = false;
        resetFormData();
        resetResultData();
        if (Object.keys($route.value.query).length) {
          isLoading.value = true;
          updateFormData();
          updateResultData();
          store.dispatch('search/ADD_KEYWORD', {
            text: formData.value.keyword,
            category: formData.value.category,
          });
        }
      }
    );

    onMounted(() => {
      isLoading.value = false;
      resetFormData();
      resetResultData();
      if (Object.keys($route.value.query).length) {
        isLoading.value = true;
        updateFormData();
        updateResultData();
        store.dispatch('search/ADD_KEYWORD', {
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
});
</script>
