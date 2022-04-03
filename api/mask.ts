import { NuxtAxiosInstance } from '@nuxtjs/axios';

type ListParams = {
  BSSH_NM: string;
  PRDLST_NM: string;
  pageNo: number;
  numOfRows: number;
  serviceKey?: string;
  type?: 'json' | 'xml';
};

type ProductParams = {
  item_name: string;
  numOfRows: number;
  serviceKey?: string;
  type?: 'json' | 'xml';
};

export default (axios: NuxtAxiosInstance, env: Record<string, any>) => ({
  getList(params: ListParams) {
    const url = 'list/getMaskGradPrmsnStusListInq';
    return axios.get(url, {
      params: {
        serviceKey: env.API_LIST_KEY,
        type: 'json',
        ...params,
      },
    });
  },
  getProduct(params: ProductParams) {
    const url = 'product/getQdrgPrdtPrmsnInfoInq01';
    return axios.get(url, {
      params: {
        serviceKey: env.API_LIST_KEY,
        type: 'json',
        ...params,
      },
    });
  },
});
