import { Store as VuexStore } from 'vuex';
import { SearchActions } from '@/store/search/actions';
import { SearchGetters } from '@/store/search/getters';
import { SearchMutations } from '@/store/search/mutations';
import { SearchState } from '@/store/search/state';

export type MaskState = {
  search: SearchState;
};

export type MaskStore = Omit<VuexStore<MaskState>, 'getters' | 'commit' | 'dispatch'> & SearchMutations & SearchGetters & SearchActions;
