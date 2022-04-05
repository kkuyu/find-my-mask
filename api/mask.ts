import { NuxtAxiosInstance } from '@nuxtjs/axios';
import { AxiosResponse } from 'axios';

import { ListParams, ListResult, ProductParams, ProductResult } from './maskTypes';

const Mask = (axios: NuxtAxiosInstance, env: Record<string, any>) => ({
  getList(params: ListParams): Promise<AxiosResponse<ListResult>> {
    const url = 'list/getMaskGradPrmsnStusListInq';
    return axios.get(url, {
      params: {
        serviceKey: env.API_LIST_KEY,
        type: 'json',
        ...params,
      },
    });
  },
  getProduct(params: ProductParams): Promise<AxiosResponse<ProductResult>> {
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

export default Mask;
