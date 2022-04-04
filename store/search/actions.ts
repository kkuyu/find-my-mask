import { ActionContext as VuexActionContext, DispatchOptions } from 'vuex';
import { MutationName, MutationType } from './mutations';
import { IsSaveModeType, KeywordType, SearchState } from './state';

export enum ActionName {
  INIT_STORE = 'INIT_STORE',
  CHANGE_SAVE_MODE = 'CHANGE_SAVE_MODE',
  ADD_KEYWORD = 'ADD_KEYWORD',
  REMOVE_KEYWORD = 'REMOVE_KEYWORD',
  REMOVE_RECENTLY_LIST = 'REMOVE_RECENTLY_LIST',
}

type ActionContext = {
  commit<K extends keyof MutationType>(key: K, payload?: Parameters<MutationType[K]>[1]): ReturnType<MutationType[K]>;
} & Omit<VuexActionContext<SearchState, SearchState>, 'commit'>;

const getIndex = (state: SearchState, payload: KeywordType) => {
  return state.recentlyKeyword.findIndex((item) => {
    return JSON.stringify(item) === JSON.stringify(payload);
  });
};

const actions = {
  [ActionName.INIT_STORE](context: ActionContext): void {
    if (typeof window !== 'undefined' && localStorage.getItem('storeSearch')) {
      const savedData: string = localStorage.getItem('storeSearch') || '{}';
      context.commit(MutationName.SET_SEARCH_DATA, Object.assign(context.state, JSON.parse(savedData)));
    }
  },
  [ActionName.CHANGE_SAVE_MODE](context: ActionContext, payload: SearchState['isSaveMode']): void {
    context.commit(MutationName.SET_IS_SAVE_MODE, payload);
  },
  [ActionName.ADD_KEYWORD](context: ActionContext, payload: KeywordType): void {
    if (context.state.isSaveMode === false) return;
    const index = getIndex(context.state, payload);
    const updateList = [...context.state.recentlyKeyword];
    if (index !== -1) {
      updateList.splice(index, 1);
      updateList.push(payload);
    } else {
      updateList.push(payload);
    }
    context.commit(MutationName.SET_RECENTLY_KEYWORD, updateList);
  },
  [ActionName.REMOVE_KEYWORD](context: ActionContext, payload: KeywordType): void {
    if (context.state.isSaveMode === false) return;
    const index = getIndex(context.state, payload);
    const updateList = [...context.state.recentlyKeyword];
    if (index !== -1) {
      updateList.splice(index, 1);
    }
    context.commit(MutationName.SET_RECENTLY_KEYWORD, updateList);
  },
  [ActionName.REMOVE_RECENTLY_LIST](context: ActionContext): void {
    if (context.state.isSaveMode === false) return;
    context.commit(MutationName.SET_RECENTLY_KEYWORD, []);
  },
};

export default actions;

export type ActionType = typeof actions;

export type SearchActions = {
  dispatch<K extends keyof ActionType, P extends Parameters<ActionType[K]>[1]>(key: `search/${K}`, payload?: P, options?: DispatchOptions): ReturnType<ActionType[K]>;
};
