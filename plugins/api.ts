import { Context, Plugin } from '@nuxt/types';
import { Inject } from '@nuxt/types/app';
import { AxiosResponse } from 'axios';

import Mask from '@/api/mask';
import { ListParams, ListResult, ProductParams, ProductResult } from '@/api/maskTypes';

const api: Plugin = (context: Context, inject: Inject) => {
  const factories = {
    mask: Mask(context.$axios, context.env),
  };

  inject('api', factories);
};

export interface CustomApiInstance {
  mask: {
    getList(params: ListParams): Promise<AxiosResponse<ListResult>>;
    getProduct(params: ProductParams): Promise<AxiosResponse<ProductResult>>;
  };
}

export default api;
