<template>
  <div class="result-wrap">
    <div v-if="isLoading">
      <slot :name="`resultListCardSkeleton`" />
    </div>
    <ul v-else-if="resultData.list.length" class="result-list">
      <template v-for="item in resultData.list">
        <li :key="item.PRDLST_SN">
          <slot :name="`resultListCard${item.PRDLST_SN}`" :data="{ product: item.PRDLST_NM, company: item.BSSH_NM, grade: item.GRADE, class: item.CLSF_NO_NM }" />
        </li>
      </template>
    </ul>
    <div v-else-if="resultData.status === 'update'" class="result-empty">
      <span>조회 결과가 없습니다.</span>
    </div>
    <div v-else-if="resultData.status === 'error'" class="result-error">
      <span>오류가 발생했습니다. 나중에 다시 시도해주세요.</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api';
import { SearchListData } from '@/types/view';

export default defineComponent({
  name: 'SearchResult',
  props: {
    isLoading: {
      type: Boolean,
      required: true,
      default: false,
    },
    resultData: {
      type: Object as PropType<SearchListData>,
      required: true,
      default: () => ({
        status: 'reset',
        currentPage: 1,
        totalPage: 0,
        list: [],
      }),
    },
  },
});
</script>

<style lang="scss" scoped>
.result-wrap {
  margin-top: 1.5rem;
}

.result-list {
  li + li {
    margin-top: 1rem;
  }
}
</style>
