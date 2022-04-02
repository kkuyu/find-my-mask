<template>
  <section class="detail-section">
    <strong class="title"><font-awesome-icon :icon="['fas', 'hashtag']" aria-hidden="true" />{{ convertTitle }}</strong>
    <template v-if="typeof content === 'string'">
      <p v-if="!content">-</p>
      <p v-else-if="title === 'ADD_INGR' || title === 'MAIN_INGR'">
        {{
          content
            .split('/')
            .filter((item, index) => content.indexOf(item) === index)
            .join(', ')
        }}
      </p>
      <p v-else-if="/^http/.test(content)">
        <a :href="content" target="_blank" class="link">{{ content }}</a>
      </p>
      <p v-else>{{ content }}</p>
    </template>
    <template v-if="typeof content === 'object' && !Array.isArray(content.DOC.SECTION.ARTICLE)">
      <DetailDoc :content="content.DOC.SECTION.ARTICLE">
        <template #selfArray="{ array }">
          <DetailDoc v-for="(innerItem, innerIndex) in array" :content="innerItem" :key="`${innerIndex}`" />
        </template>
      </DetailDoc>
    </template>
    <template v-if="typeof content === 'object' && Array.isArray(content.DOC.SECTION.ARTICLE)">
      <template v-for="(item, index) in content.DOC.SECTION.ARTICLE">
        <DetailDoc :content="item" :key="index">
          <template #selfArray="{ array }">
            <DetailDoc v-for="(innerItem, innerIndex) in array" :content="innerItem" :key="`${index}-${innerIndex}`" />
          </template>
        </DetailDoc>
      </template>
    </template>
  </section>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from '@nuxtjs/composition-api';

import DetailDoc from '@/components/DetailDoc.vue';

export default defineComponent({
  name: 'DetailSection',
  components: {
    DetailDoc,
  },
  props: {
    title: {
      type: String,
      required: true,
      default: '',
    },
    content: {
      type: [String, Object],
      required: true,
      default: null,
    },
  },
  setup(props, context) {
    const convertTitle: ComputedRef<string> = computed(() => {
      switch (props.title) {
        case 'ADD_INGR':
          return '첨가제';
        case 'CANCEL_CODE':
          return '취소/취하';
        case 'CANCEL_DATE':
          return '취소일';
        case 'CLASS_NO':
          return '품목코드';
        case 'CLASS_NO_NAME':
          return '품목코드명';
        case 'EE_DOC_DATA':
          return '효능효과';
        case 'ENTP_NAME':
          return '업체명';
        case 'ITEM_NAME':
          return '품목명';
        case 'ITEM_PERMIT_DATE':
          return '허가일';
        case 'ITEM_SEQ':
          return '품목기준코드';
        case 'MAIN_INGR':
          return '주성분';
        case 'NB_DOC_DATA':
          return '주의사항';
        case 'UD_DOC_DATA':
          return '용법용량';
        case 'ENTP_NO':
          return '업허가번호';
        case 'ENTP_SEQ':
          return '업일련번호';
        default:
          return props.title;
      }
    });

    return {
      convertTitle,
    };
  },
});
</script>
