export default (axios) => ({
  getList(params) {
    const url = 'list/getMaskGradPrmsnStusListInq';
    return axios.get(url, { params });
  },
  getDetail(params) {
    const url = 'detail/getQdrgPrdtPrmsnInfoInq';
    return axios.get(url, { params });
  },
});
