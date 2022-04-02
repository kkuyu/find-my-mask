import { Store as VuexStore, CommitOptions } from 'vuex';

import { StateType } from './state';
import { Getters, GetterType } from './getters';
import { Mutations } from './mutations';

type SearchMutations = {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(key: K, payload: P, options?: CommitOptions): ReturnType<Mutations[K]>;
};

type SearchGetters = {
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>;
  };
};

export type SearchStore = Omit<VuexStore<StateType>, 'getters' | 'commit' | 'dispatch'> & SearchMutations & SearchGetters;
