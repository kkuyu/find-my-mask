<template>
  <div class="error-wrap">
    <strong class="number">{{ error.statusCode }}</strong>
    <h1 class="text">
      <template v-if="error.statusCode === 404">페이지를 찾을 수 없습니다.</template>
      <template v-else-if="error.statusCode === 500">오류가 발생했습니다. 나중에 다시 시도해주세요.</template>
      <template v-else>{{ error.message }}</template>
    </h1>
    <NuxtLink :to="{ path: '/search', query: null }" class="error-link go-home"><font-awesome-icon :icon="['fas', 'hashtag']" aria-hidden="true" /> 홈으로 이동</NuxtLink>
  </div>
</template>

<script lang="ts">
import { NuxtError } from '@nuxt/types';
import { defineComponent, PropType } from '@nuxtjs/composition-api';

export default defineComponent({
  layout: 'error',
  name: 'errorLayout',
  head() {
    return {
      title: 'Error',
      description: process.env.DESCRIPTION,
    };
  },
  props: {
    error: {
      type: Object as PropType<NuxtError>,
      required: false,
      default: () => {
        return {
          statusCode: null,
          message: null,
          path: null,
        };
      },
    },
  },
});
</script>

<style lang="scss" scoped>
.error-wrap {
  padding: 1.25rem 1rem;
  background-color: var(--color-white);
  text-align: center;
  border-radius: 0.5rem;
  .number {
    font-size: 3rem;
  }
  .text {
    font-size: 1.5rem;
  }
  .error-link {
    margin-top: 1.5rem;
    display: inline-block;
    padding: 0.5rem 0.75rem;
    color: var(--color-white);
    background: var(--color-primary);
    border-radius: 0.5rem;
  }
}
</style>
