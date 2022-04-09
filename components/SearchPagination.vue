<template>
  <div v-if="resultData.status === 'update'" class="pagination-wrap">
    <span v-if="itemPrev.isVisible" class="pagination-item">
      <button type="button" class="is-prev" @click="updatePage(itemPrev.num)">
        <font-awesome-icon :icon="['fa', 'chevron-left']" aria-label="이전" />
      </button>
    </span>
    <span class="pagination-item" v-for="num in itemNums" :key="num">
      <button type="button" :class="{ 'is-active': num === resultData.currentPage }" :disabled="num === resultData.currentPage" @click="updatePage(num)">
        {{ num }}
      </button>
    </span>
    <span v-if="itemNext.isVisible" class="pagination-item">
      <button type="button" class="is-next" @click="updatePage(itemNext.num)">
        <font-awesome-icon :icon="['fa', 'chevron-right']" aria-label="다음" />
      </button>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api';
import { computed, ComputedRef } from '@vue/composition-api';
import { SearchListData } from '@/types/view';

type ItemNums = number[];
type ItemBtns = {
  isVisible: boolean;
  num: number;
};

export default defineComponent({
  name: 'SearchPagination',
  props: {
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
  setup(props, context) {
    const itemNums: ComputedRef<ItemNums> = computed(() => {
      const row = Math.floor((props.resultData.currentPage - 1) / 5);
      const result = [...Array(5).keys()].reduce((acc: number[], cur: number) => {
        const num = 5 * row + cur + 1;
        if (num <= props.resultData.totalPage) acc.push(num);
        return acc;
      }, []);
      return result.toString() === [1].toString() ? [] : result;
    });

    const itemPrev: ComputedRef<ItemBtns> = computed(() => {
      const firstNum = itemNums.value[0];
      const prevNum = firstNum - 1 || 0;
      if (prevNum === 0) return { isVisible: false, num: prevNum };
      return { isVisible: true, num: prevNum };
    });

    const itemNext: ComputedRef<ItemBtns> = computed(() => {
      const lastNum = itemNums.value[itemNums.value.length - 1];
      const nextNum = lastNum + 1 || 0;
      if (nextNum > props.resultData.totalPage || nextNum === 0) return { isVisible: false, num: nextNum };
      return { isVisible: true, num: nextNum };
    });

    const updatePage = (num: number): void => {
      context.emit('updatePage', num);
    };

    return {
      itemNums,
      itemPrev,
      itemNext,
      updatePage,
    };
  },
});
</script>

<style lang="scss" scoped>
.pagination-wrap {
  margin: 1.5rem -0.2rem 0;
  text-align: center;
}

.pagination-item {
  padding: 0 0.2rem;
  button {
    min-width: 2rem;
    height: 2rem;
    padding: 0 0.54rem;
    font-size: 0.875rem;
    background-color: var(--color-white);
    border-radius: 0.5rem;
  }
  button.is-active {
    color: var(--color-primary);
  }
}
</style>
