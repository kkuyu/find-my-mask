import Mask from '@/api/mask';

export default (context, inject) => {
  const factories = {
    mask: Mask(context.$axios, context.env),
  };

  inject('api', factories);
};
