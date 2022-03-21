<template>
  <div class="result-card" :class="{ isLoading: isLoading }">
    <component :is="isLoading ? 'div' : 'nuxt-link'" :to="isLoading ? false : `/detail/${data.product}`" class="box">
      <template v-if="isCompany">
        <strong class="title">{{ data.company }}</strong>
        <span class="description">{{ data.product }}</span>
      </template>
      <template v-if="isProduct">
        <strong class="title">{{ data.product }}</strong>
        <span class="description">{{ data.company }}</span>
      </template>
      <template v-for="key in badgeItem">
        <em v-if="data[key]" class="badge" :key="key">
          <font-awesome-icon :icon="['fas', 'hashtag']" />
          <span class="text">{{ data[key] }}</span>
        </em>
      </template>
    </component>
  </div>
</template>

<script>
import { computed } from '@nuxtjs/composition-api';

export default {
  name: 'SearchResultCard',
  props: {
    data: {
      type: Object,
      required: false,
      default: () => ({
        product: '',
        company: '',
        grade: '',
        class: '',
      }),
    },
    isLoading: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props, context) {
    const query = computed(() => context.root.$route.query);
    const isCompany = computed(() => query.value.hasOwnProperty('company'));
    const isProduct = computed(() => query.value.hasOwnProperty('product'));

    const badgeItem = ['class', 'grade'];

    return {
      query,
      isCompany,
      isProduct,
      badgeItem,
    };
  },
};
</script>

<style lang="scss" scoped>
.result-card {
  .box {
    display: block;
    padding: 0.75rem 1rem;
    background-color: var(--color-white);
    border-radius: 0.5rem;
  }
  .title {
    display: block;
    font-size: 1rem;
  }
  .description {
    margin-top: 0.25rem;
    display: block;
    font-size: 0.875rem;
    color: var(--color-gray);
  }
  .badge {
    display: inline-block;
    margin-top: 0.5rem;
    font-size: 0.75rem;
    line-height: 1;
    padding: 0.25rem 0.5rem 0.4rem 0.5rem;
    color: var(--color-white);
    background-color: var(--color-primary);
    border-radius: 0.25rem;
    .fa-hashtag,
    .text {
      vertical-align: middle;
    }
  }
  .badge + .badge {
    margin-left: 0.25rem;
  }
}

.result-card.isLoading {
  .title,
  .description {
    position: relative;
    min-height: 1.4rem;
    background-image: linear-gradient(125deg, var(--color-bg) 0rem, var(--color-white) 2.5rem, var(--color-bg) 5rem);
    background-size: 200% 100%;
    background-position-x: 180%;
    animation: shine-lines 2s infinite linear;
    border-radius: 0.25rem;
    &:after {
      content: '';
      position: absolute;
      left: 45%;
      right: 0;
      height: 100%;
      background-color: var(--color-white);
    }
  }
  .description {
    animation-delay: 0.04s;
    &:after {
      left: 80%;
    }
  }
}

@keyframes shine-lines {
  to {
    background-position-x: -20%;
  }
}
</style>
