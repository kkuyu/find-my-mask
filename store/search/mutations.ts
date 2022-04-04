import { CommitOptions } from 'vuex';
import { IsSaveModeType, KeywordType, SearchState } from './state';

export enum MutationName {
  SET_IS_SAVE_MODE = 'SET_IS_SAVE_MODE',
  SET_RECENTLY_KEYWORD = 'SET_RECENTLY_KEYWORD',
}

const mutations = {
  [MutationName.SET_IS_SAVE_MODE](state: SearchState, payload: IsSaveModeType): void {
    state.isSaveMode = payload;
  },
  [MutationName.SET_RECENTLY_KEYWORD](state: SearchState, payload: KeywordType[]): void {
    state.recentlyKeyword = payload;
  },
};

export default mutations;

export type MutationType = typeof mutations;

export type SearchMutations = {
  commit<K extends keyof MutationType, P extends Parameters<MutationType[K]>[1]>(key: `search/${K}`, payload: P, options?: CommitOptions): ReturnType<MutationType[K]>;
};
