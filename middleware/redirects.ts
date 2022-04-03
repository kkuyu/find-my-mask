import { ServerMiddleware } from '@nuxt/types';

type Route = {
  from: string;
  to: string;
};

const redirects: Route[] = [
  {
    from: '/',
    to: '/search',
  },
];

const redirectMiddleware: ServerMiddleware = function (req, res, next) {
  const redirect = redirects.find((route) => route.from === req.url);

  if (redirect) {
    res.writeHead(301, { Location: redirect.to });
    res.end();
  } else {
    next();
  }
};

export default redirectMiddleware;
