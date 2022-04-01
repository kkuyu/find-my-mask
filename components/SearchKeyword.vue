<template>
  <div class="keyword-wrap">
    <div class="keyword-body">
      <template v-if="$store.state.search.isSaveMode === true">
        <ul v-show="keywordList.length" class="keyword-list">
          <template v-for="keyword in keywordList">
            <li :key="`${keyword.category}-${keyword.text}`">
              <button type="button" class="btn-item" @click="keywordClick($event, keyword)">
                <span class="badge">{{ keyword.category === 'company' ? '업체명' : '제품명' }}</span>
                <span class="text">{{ keyword.text }}</span>
              </button>
              <button type="button" class="btn-remove" @click="keywordRemove($event, keyword)">
                <font-awesome-icon :icon="['fas', 'times']" aria-label="삭제" />
              </button>
            </li>
          </template>
        </ul>
        <div v-show="!keywordList.length" class="keyword-empty">최근 검색어 내역이 없습니다.</div>
      </template>
      <div v-else class="keyword-off">검색어 저장 기능이 꺼져있습니다.</div>
    </div>
    <div class="keyword-footer">
      <button type="button" class="btn-toggle" @click="toggleSaveMode">
        <span>자동저장 {{ $store.state.search.isSaveMode === true ? '끄기' : '켜기' }}</span>
      </button>
      <template v-if="$store.state.search.isSaveMode === true">
        <button v-show="keywordList.length" type="button" class="btn-remove-all" @click="keywordRemoveAll($event)">
          <span>전체삭제</span>
        </button>
      </template>
    </div>
  </div>
</template>

<script>
import { ref, computed, useStore } from '@nuxtjs/composition-api';

export default {
  name: 'SearchKeyword',
  setup(props, context) {
    const store = useStore();
    const $router = context.root.$router;

    const keywordList = computed(() => {
      return store.getters['search/RECENTLY_LIST_REVERSE'];
    });

    const keywordClick = ($event, keyword) => {
      $router.push({
        path: '/search',
        query: {
          page: 1,
          [keyword.category]: keyword.text,
        },
      });
    };

    const keywordRemove = ($event, keyword) => {
      store.commit('search/REMOVE_KEYWORD', keyword);
    };

    const keywordRemoveAll = ($event) => {
      store.commit('search/REMOVE_RECENTLY_LIST');
    };

    const toggleSaveMode = ($event) => {
      store.commit('search/CHANGE_SAVE_MODE', !store.state.search.isSaveMode);
    };

    return {
      keywordList,
      keywordRemoveAll,
      keywordClick,
      keywordRemove,
      toggleSaveMode,
    };
  },
};
</script>

<style lang="scss" scoped>
.keyword {
  &-wrap {
    position: relative;
    display: flex;
    flex-direction: column;
    max-height: 0;
    overflow: hidden;
    transition: 0.5s ease max-height;
    &.show {
      max-height: 15rem;
    }
  }
  &-body {
    padding: 0.5rem 1rem;
    overflow-y: auto;
    border-top: 0.125rem solid var(--color-bg);
  }
  &-footer {
    display: flex;
    justify-content: space-between;
    flex-shrink: 0;
    padding: 0 1rem;
    border-top: 0.125rem solid var(--color-bg);
  }
}

.keyword-body {
  .keyword-list {
    > li {
      position: relative;
    }
    .btn-item {
      display: flex;
      align-items: center;
      min-width: 0;
      width: 100%;
      padding: 0.5rem 0;
      .badge {
        flex-shrink: 0;
        display: inline-block;
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        color: var(--color-white);
        background-color: var(--color-primary);
        border-radius: 0.25rem;
      }
      .text {
        padding-left: 0.5rem;
        padding-right: 1.25rem;
        font-size: 0.875rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .btn-remove {
      position: absolute;
      top: 50%;
      right: 0.125rem;
      transform: translateY(-50%);
      padding: 0.25rem 0.5rem;
      color: var(--color-secondary);
    }
  }
  .keyword-off,
  .keyword-empty {
    margin: 1.5rem 0;
    text-align: center;
  }
}

.keyword-footer {
  .btn-toggle {
    padding: 0.75rem 0;
    font-size: 0.875rem;
    color: var(--color-gray);
  }
  .btn-remove-all {
    padding: 0.75rem 0.5rem;
    font-size: 0.875rem;
    color: var(--color-gray);
  }
}
</style>
