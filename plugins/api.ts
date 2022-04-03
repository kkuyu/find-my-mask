import { Context, Plugin } from '@nuxt/types';
import { Inject } from '@nuxt/types/app';

import Mask from '@/api/mask';

const api: Plugin = (context: Context, inject: Inject) => {
  const factories = {
    mask: Mask(context.$axios, context.env),
  };

  inject('api', factories);
};
export default api;
