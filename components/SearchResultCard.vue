<template>
  <div class="result-card" :class="{ isLoading: isLoading }">
    <component :is="isLoading ? 'div' : 'nuxt-link'" :to="isLoading ? false : `/detail/${data.product}`" class="box">
      <strong class="title">
        {{ query.company ? data.company : query.product ? data.product : '' }}
      </strong>
      <span class="description">
        {{ query.company ? data.product : query.product ? data.company : '' }}
      </span>
      <em v-if="data.class" class="hashtag"><font-awesome-icon :icon="['fas', 'hashtag']" />{{ data.class }}</em>
      <em v-if="data.grade" class="hashtag"><font-awesome-icon :icon="['fas', 'hashtag']" />{{ data.grade }}</em>
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

    return {
      query,
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
  .hashtag {
    display: inline-block;
    margin-top: 0.5rem;
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    color: var(--color-white);
    background-color: var(--color-primary);
    border-radius: 0.25rem;
    .fa-hashtag {
      margin-right: 0.25rem;
    }
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
