export default (axios) => ({
  getList(params) {
    const url = 'list/getMaskGradPrmsnStusListInq';
    return axios.get(url, { params });
  },
  getProduct(params) {
    const url = 'product/getQdrgPrdtPrmsnInfoInq';
    return axios.get(url, { params });
  },
});
