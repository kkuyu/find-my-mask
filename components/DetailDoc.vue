<template>
  <div>
    <!-- content._cdata -->
    <p v-if="content._cdata">{{ content._cdata }}</p>
    <!-- content.PARAGRAPH -->
    <p v-else-if="content.PARAGRAPH && content.PARAGRAPH._cdata">{{ content.PARAGRAPH._cdata }}</p>
    <template v-else-if="content.PARAGRAPH && Array.isArray(content.PARAGRAPH)">
      <slot name="selfArray" :array="content.PARAGRAPH" />
    </template>
    <!-- content._attributes -->
    <p v-else-if="content._attributes && content._attributes.title">{{ content._attributes.title }}</p>
    <!-- check!! -->
    <p v-else>{{ content }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  name: 'DetailDoc',
  props: {
    content: {
      type: Object,
      required: true,
      default: () => ({
        _cdata: null,
        PARAGRAPH: null,
        _attributes: null,
      }),
    },
  },
});
</script>
