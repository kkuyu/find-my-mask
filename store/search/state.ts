export type KeywordType = {
  category: string;
  text: string;
};

export type StateType = {
  isSaveMode: boolean;
  recentlyKeyword: KeywordType[];
};

const search = (): StateType => ({
  isSaveMode: true,
  recentlyKeyword: [],
});

export default search;
