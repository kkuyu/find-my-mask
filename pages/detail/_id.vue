<template>
  <article>
    <h1 class="detail-title">{{ detailId }}</h1>
    <div class="detail-content">
      <template v-if="resultData.status === 'reset'">
        <p>제품 정보를 불러오고있습니다.</p>
      </template>
      <template v-if="resultData.status === 'empty'">
        <p>제품 정보를 불러올 수 없습니다.</p>
      </template>
      <template v-if="resultData.status === 'error'">
        <p>오류가 발생했습니다. 나중에 다시 시도해주세요.</p>
      </template>
      <template v-if="resultData.status === 'update'">
        <DetailSection v-for="(item, key) in resultData.detail" :key="key" :title="key" :content="item || ''"> </DetailSection>
      </template>
    </div>
  </article>
</template>

<script>
import convert from 'xml-js';
import { ref, watch, computed, useRoute, onMounted } from '@nuxtjs/composition-api';

import DetailSection from '@/components/DetailSection';

export default {
  name: 'Detail',
  head() {
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
    const resultData = ref({
      status: 'reset',
      detail: null,
    });

    const convertData = (object) => {
      const result = { ...object };
      for (const key in result) {
        if (Object.hasOwnProperty.call(result, key) && key.indexOf('_DOC_') !== -1) {
          result[key] = JSON.parse(convert.xml2json(result[key], { compact: true, spaces: 4 }));
        }
      }
      return result;
    };

    const getProductData = async (eventType, state) => {
      const params = {
        item_name: encodeURIComponent(detailId.value),
        pageNo: 1,
        numOfRows: 1,
      };

      context.root.$api.mask
        .getProduct(params)
        .then((response) => {
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
        })
        .catch((error) => {
          console.log(error);
          resultData.value.status = 'error';
        });
    };

    watch(
      () => detailId.value,
      () => {
        resultData.value.status = 'reset';
        resultData.value.detail = null;
        getProductData();
      }
    );

    onMounted(() => {
      resultData.value.status = 'reset';
      resultData.value.detail = null;
      getProductData();
    });

    return {
      detailId,
      resultData,
    };
  },
};
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
      margin-top: 1.25rem;
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
  }
}
</style>
