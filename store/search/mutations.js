const getIndex = (state, payload) => {
  return state.recentlyKeyword.findIndex((item) => {
    return JSON.stringify(item) === JSON.stringify(payload);
  });
};

export default {
  changeSaveMode(state, payload) {
    state.isSaveMode = payload;
  },
  addKeyword(state, payload) {
    if (state.isSaveMode === false) return false;
    const index = getIndex(state, payload);
    if (index !== -1) {
      state.recentlyKeyword.splice(index, 1);
      state.recentlyKeyword.push(payload);
    } else {
      state.recentlyKeyword.push(payload);
    }
  },
  removeKeyword(state, payload) {
    if (state.isSaveMode === false) return false;
    const index = getIndex(state, payload);
    if (index !== -1) {
      state.recentlyKeyword.splice(index, 1);
    }
  },
  removeRecentlyList(state) {
    if (state.isSaveMode === false) return false;
    state.recentlyKeyword = [];
  },
};
