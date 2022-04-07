import { Context, Plugin } from '@nuxt/types';
import { Inject } from '@nuxt/types/app';

import CustomError from '~/api/customError';
import { CustomErrorProto } from '~/api/customErrorTypes';

const customError: Plugin = (context: Context, inject: Inject) => {
  inject('customError', CustomError);
};

export interface CustomErrorInstance {
  new (label: string, extra?: object): CustomErrorProto;
  prototype: CustomErrorProto;
}

export default customError;
