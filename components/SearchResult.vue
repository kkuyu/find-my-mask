<template>
  <div>
    <ul v-if="resultData.list.length">
      <template v-for="(item, index) in resultData.list">
        <li :key="index">
          <NuxtLink :to="`/detail/${item.PRDLST_NM}`">
            {{ item }}
          </NuxtLink>
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
