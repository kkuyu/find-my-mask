export type IsSaveModeType = boolean;

export type KeywordType = {
  category: string;
  text: string;
};

export type SearchState = {
  isSaveMode: IsSaveModeType;
  recentlyKeyword: KeywordType[];
};

const search = (): SearchState => ({
  isSaveMode: true,
  recentlyKeyword: [],
});

export default search;
