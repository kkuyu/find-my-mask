export default (axios, env) => ({
  getList(params) {
    const url = 'list/getMaskGradPrmsnStusListInq';
    return axios.get(url, {
      params: {
        ...params,
        serviceKey: env.API_LIST_KEY,
        type: 'json',
      },
    });
  },
  getProduct(params) {
    const url = 'product/getQdrgPrdtPrmsnInfoInq01';
    return axios.get(url, {
      params: {
        ...params,
        serviceKey: env.API_LIST_KEY,
        type: 'json',
      },
    });
  },
});
