<template>
  <article>
    <h1 class="detail-title">{{ detailId }}</h1>
    <div class="detail-content">
      <template v-if="resultData.status === 'reset'">
        <p>제품 정보를 불러오고있습니다.</p>
      </template>
      <template v-else-if="resultData.status === 'update'">
        <DetailSection v-for="(item, key) in resultData.detail" :key="key" :title="key" :content="item || ''"> </DetailSection>
      </template>
      <template v-else-if="resultData.status === 'empty'">
        <p>제품 정보를 불러올 수 없습니다.</p>
      </template>
      <template v-else-if="resultData.status === 'error'">
        <p>오류가 발생했습니다. 나중에 다시 시도해주세요.</p>
      </template>
    </div>
  </article>
</template>

<script lang="ts">
import convert from 'xml-js';
import { ref, watch, computed, useRoute, onMounted, defineComponent, Ref } from '@nuxtjs/composition-api';

import { MetaInfo } from 'vue-meta';
import { ProductItem } from '@/api/maskTypes';
import { SearchProductData, Status } from '@/types/view';

import DetailSection from '@/components/DetailSection.vue';

export default defineComponent({
  name: 'Detail',
  head(): MetaInfo {
    return {
      title: this.detailId,
    };
  },
  components: {
    DetailSection,
  },
  setup(props, context) {
    const route = useRoute();

    const detailId = computed(() => route.value.params.id || '');
    const resultData: Ref<SearchProductData> = ref({
      status: 'reset' as Status,
      detail: {},
    });

    const convertData = (object: ProductItem) => {
      const result = { ...object };
      for (const key in result) {
        if (Object.hasOwnProperty.call(result, key) && key.indexOf('_DOC_') !== -1) {
          if (/^http/.test(result[key])) continue;
          result[key] = JSON.parse(convert.xml2json(result[key], { compact: true, spaces: 4 }));
        }
      }
      return result;
    };

    const resetProductData = (): void => {
      resultData.value.status = 'reset';
      resultData.value.detail = {};
    };

    const getProductData = async (): Promise<void> => {
      const params = {
        item_name: encodeURIComponent(detailId.value),
        numOfRows: 1,
      };

      const response = await context.root.$api.mask.getProduct(params);
      try {
        if (response.data.body.hasOwnProperty('items') && response.data.body.items.length) {
          if (detailId.value === response.data.body.items[0].ITEM_NAME) {
            resultData.value.status = 'update';
            resultData.value.detail = convertData(response.data.body.items[0]);
          } else {
            resultData.value.status = 'empty';
          }
        } else {
          resultData.value.status = 'empty';
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log(error);
          resultData.value.status = 'error';
          return;
        }
      }
    };

    watch(
      () => detailId.value,
      () => {
        resetProductData();
        getProductData();
      }
    );

    onMounted(() => {
      resetProductData();
      getProductData();
    });

    return {
      detailId,
      resultData,
    };
  },
});
</script>

<style lang="scss" scoped>
.detail-title {
  font-size: 2rem;
}

.detail-content {
  margin-top: 1.5rem;
  padding: 1.25rem 1rem;
  background-color: var(--color-white);
  border-radius: 0.5rem;
  ::v-deep .detail-section {
    &:not(:first-child) {
      margin-top: 1.5rem;
    }
    .title {
      display: block;
      margin-bottom: 4px;
      font-size: 18px;
    }
    .fa-hashtag {
      margin-right: 4px;
      color: #5873de;
    }
    .link {
      text-decoration: underline;
    }
  }
}
</style>
