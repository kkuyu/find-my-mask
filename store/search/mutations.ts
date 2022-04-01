import { KeywordType, StateType } from './state';

export enum MutationType {
  INIT_STORE = 'INIT_STORE',
  CHANGE_SAVE_MODE = 'CHANGE_SAVE_MODE',
  ADD_KEYWORD = 'ADD_KEYWORD',
  REMOVE_KEYWORD = 'REMOVE_KEYWORD',
  REMOVE_RECENTLY_LIST = 'REMOVE_RECENTLY_LIST',
}

const getIndex = (state: StateType, payload: KeywordType) => {
  return state.recentlyKeyword.findIndex((item) => {
    return JSON.stringify(item) === JSON.stringify(payload);
  });
};

const mutations = {
  [MutationType.INIT_STORE](state: StateType): void {
    if (typeof window !== 'undefined' && localStorage.getItem('storeSearch')) {
      const savedData: string = localStorage.getItem('storeSearch') || '{}';
      state = Object.assign(state, JSON.parse(savedData));
    }
  },
  [MutationType.CHANGE_SAVE_MODE](state: StateType, payload: StateType['isSaveMode']): void {
    state.isSaveMode = payload;
  },
  [MutationType.ADD_KEYWORD](state: StateType, payload: KeywordType): void {
    if (state.isSaveMode === false) return;
    const index = getIndex(state, payload);
    if (index !== -1) {
      state.recentlyKeyword.splice(index, 1);
      state.recentlyKeyword.push(payload);
    } else {
      state.recentlyKeyword.push(payload);
    }
  },
  [MutationType.REMOVE_KEYWORD](state: StateType, payload: KeywordType): void {
    if (state.isSaveMode === false) return;
    const index = getIndex(state, payload);
    if (index !== -1) {
      state.recentlyKeyword.splice(index, 1);
    }
  },
  [MutationType.REMOVE_RECENTLY_LIST](state: StateType): void {
    if (state.isSaveMode === false) return;
    state.recentlyKeyword = [];
  },
};

export default mutations;

export type Mutations = typeof mutations;
