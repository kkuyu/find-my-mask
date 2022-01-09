export default (axios) => ({
  getMasks(params) {
    const url = 'api/getNonMdcinPrductPrmisnInfoList';
    return axios.get(url, { params });
  },
});
