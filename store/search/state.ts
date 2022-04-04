export type KeywordType = {
  category: string;
  text: string;
};

export type SearchState = {
  isSaveMode: boolean;
  recentlyKeyword: KeywordType[];
};

const search = (): SearchState => ({
  isSaveMode: true,
  recentlyKeyword: [],
});

export default search;
