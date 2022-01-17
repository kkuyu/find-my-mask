<template>
  <div>
    <ul v-if="resultData.list.length">
      <template v-for="item in resultData.list">
        <li :key="item.PRDLST_SN">
          <slot :name="`resultListItem${item.PRDLST_SN}`" :data="{ product: item.PRDLST_NM, company: item.BSSH_NM, grade: item.GRADE, class: item.CLSF_NO_NM }" />
        </li>
      </template>
    </ul>
    <div v-else-if="resultData.status === 'complete'">조회 결과가 없습니다.</div>
    <InfiniteLoading v-if="resultData.list.length" @infinite="onScrolling"></InfiniteLoading>
  </div>
</template>

<script>
export default {
  name: 'SearchResult',
  props: {
    resultData: {
      type: Object,
      required: true,
      default: () => ({
        status: 'reset',
        pageNo: 1,
        list: [],
      }),
    },
  },
  setup(props, context) {
    const onScrolling = (state) => {
      context.emit('onScrolling', state);
    };

    return {
      onScrolling,
    };
  },
};
</script>

<style></style>
