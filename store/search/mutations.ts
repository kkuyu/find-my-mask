import { CommitOptions } from 'vuex';
import { KeywordType, SearchState } from './state';

export enum MutationName {
  INIT_STORE = 'INIT_STORE',
  CHANGE_SAVE_MODE = 'CHANGE_SAVE_MODE',
  ADD_KEYWORD = 'ADD_KEYWORD',
  REMOVE_KEYWORD = 'REMOVE_KEYWORD',
  REMOVE_RECENTLY_LIST = 'REMOVE_RECENTLY_LIST',
}

const getIndex = (state: SearchState, payload: KeywordType) => {
  return state.recentlyKeyword.findIndex((item) => {
    return JSON.stringify(item) === JSON.stringify(payload);
  });
};

const mutations = {
  [MutationName.INIT_STORE](state: SearchState): void {
    if (typeof window !== 'undefined' && localStorage.getItem('storeSearch')) {
      const savedData: string = localStorage.getItem('storeSearch') || '{}';
      state = Object.assign(state, JSON.parse(savedData));
    }
  },
  [MutationName.CHANGE_SAVE_MODE](state: SearchState, payload: SearchState['isSaveMode']): void {
    state.isSaveMode = payload;
  },
  [MutationName.ADD_KEYWORD](state: SearchState, payload: KeywordType): void {
    if (state.isSaveMode === false) return;
    const index = getIndex(state, payload);
    if (index !== -1) {
      state.recentlyKeyword.splice(index, 1);
      state.recentlyKeyword.push(payload);
    } else {
      state.recentlyKeyword.push(payload);
    }
  },
  [MutationName.REMOVE_KEYWORD](state: SearchState, payload: KeywordType): void {
    if (state.isSaveMode === false) return;
    const index = getIndex(state, payload);
    if (index !== -1) {
      state.recentlyKeyword.splice(index, 1);
    }
  },
  [MutationName.REMOVE_RECENTLY_LIST](state: SearchState): void {
    if (state.isSaveMode === false) return;
    state.recentlyKeyword = [];
  },
};

export default mutations;

export type MutationType = typeof mutations;

export type SearchMutations = {
  commit<K extends keyof MutationType, P extends Parameters<MutationType[K]>[1]>(key: `search/${K}`, payload: P, options?: CommitOptions): ReturnType<MutationType[K]>;
};
