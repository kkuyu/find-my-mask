<template>
  <div class="result-wrap">
    <ul v-if="resultData.list.length" class="result-list">
      <template v-for="item in resultData.list">
        <li :key="item.PRDLST_SN">
          <slot :name="`resultListCard${item.PRDLST_SN}`" :data="{ product: item.PRDLST_NM, company: item.BSSH_NM, grade: item.GRADE, class: item.CLSF_NO_NM }" />
        </li>
      </template>
    </ul>
    <div v-if="resultData.status === 'complete' && !resultData.list.length" class="result-empty">
      <span>조회 결과가 없습니다.</span>
    </div>
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
};
</script>

<style lang="scss" scoped>
.result-wrap {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.result-list {
  li + li {
    margin-top: 1rem;
  }
}

.result-empty {
  text-align: center;
}
</style>
