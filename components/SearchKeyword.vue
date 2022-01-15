<template>
  <div>
    <button type="button" @click="keywordRemoveAll($event)">
      <span>전체삭제</span>
    </button>
    <div v-if="$store.state.search.isSaveMode === false">검색어 저장 기능이 꺼져있습니다.</div>
    <ul v-else-if="$store.state.search.recentlyKeyword.length">
      <template v-for="keyword in $store.state.search.recentlyKeyword">
        <li :key="`${keyword.category}-${keyword.text}`">
          <button type="button" @click="keywordClick($event, keyword)">
            {{ keyword }}
          </button>
          <button type="button" @click="keywordRemove($event, keyword)">
            <span>삭제</span>
          </button>
        </li>
      </template>
    </ul>
    <div v-else>최근 검색어 내역이 없습니다.</div>
    <div>
      <button type="button" @click="toggleSaveMode">
        <span>자동저장 {{ $store.state.search.isSaveMode === true ? '끄기' : '켜기' }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, useStore } from '@nuxtjs/composition-api';

export default {
  name: 'SearchKeyword',
  setup(props, context) {
    const store = useStore();
    const $route = computed(() => context.root.$route);
    const $router = context.root.$router;

    const keywordClick = ($event, keyword) => {
      $router.push({
        path: '/',
        query: {
          [keyword.category]: keyword.text,
        },
      });
    };

    const keywordRemove = ($event, keyword) => {
      store.commit('search/removeKeyword', keyword);
    };

    const keywordRemoveAll = ($event) => {
      store.commit('search/removeRecentlyList');
    };

    const toggleSaveMode = ($event) => {
      store.commit('search/changeSaveMode', !store.state.search.isSaveMode);
    };

    return {
      keywordRemoveAll,
      keywordClick,
      keywordRemove,
      toggleSaveMode,
    };
  },
};
</script>
