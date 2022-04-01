import { KeywordType, StateType } from './state';

export enum GetterType {
  RECENTLY_LIST_REVERSE = 'RECENTLY_LIST_REVERSE',
}

const getters = {
  [GetterType.RECENTLY_LIST_REVERSE](state: StateType): KeywordType[] {
    return state.recentlyKeyword.slice().reverse();
  },
}

export default getters;

export type Getters = typeof getters;
