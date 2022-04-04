import { KeywordType, SearchState } from './state';

export enum GetterName {
  RECENTLY_LIST_REVERSE = 'RECENTLY_LIST_REVERSE',
}

const getters = {
  [GetterName.RECENTLY_LIST_REVERSE](state: SearchState): KeywordType[] {
    return state.recentlyKeyword.slice().reverse();
  },
};

export default getters;

export type GetterType = typeof getters;

export type SearchGetters = {
  getters: {
    [Property in keyof GetterType as `search/${Capitalize<string & Property>}`]: () => GetterType[Property];
  };
};
