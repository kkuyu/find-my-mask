import { Store as VuexStore } from 'vuex';
import { SearchActions } from './search/actions';
import { SearchGetters } from './search/getters';
import { SearchMutations } from './search/mutations';
import { SearchState } from './search/state';

export type MaskState = {
  search: SearchState;
};

export type MaskStore = Omit<VuexStore<MaskState>, 'getters' | 'commit' | 'dispatch'> & SearchMutations & SearchGetters & SearchActions;
