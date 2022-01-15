import * as FontAwesome from './icon/fontawesome';

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'find-my-mask',
    htmlAttrs: {
      lang: 'ko',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [{ src: '@/plugins/api.js' }, { src: '@/plugins/validation.js' }, { src: '@/plugins/infinite.js' }],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ['@nuxtjs/composition-api/module', ['@nuxtjs/fontawesome', { component: 'fontAwesome', suffix: true }]],

  fontawesome: {
    icons: {
      solid: FontAwesome.solid,
      regular: FontAwesome.regular,
      brands: FontAwesome.brands,
    },
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxtjs/axios', '@nuxtjs/proxy'],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: { transpile: ['vee-validate/dist/rules'] },

  axios: {
    proxy: true, // Can be also an object with default options
  },

  proxy: {
    '/list/': {
      target: process.env.API_LIST_URL,
      pathRewrite: { '^/list/': '' },
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        proxyReq.path += req._parsedOriginalUrl.search ? '&' : '?';
        proxyReq.path += 'serviceKey=' + encodeURIComponent(process.env.API_LIST_KEY);
        proxyReq.path += '&type=json';
      },
    },
    '/product/': {
      target: process.env.API_PRODUCT_URL,
      pathRewrite: { '^/product/': '' },
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        proxyReq.path += req._parsedOriginalUrl.search ? '&' : '?';
        proxyReq.path += 'serviceKey=' + encodeURIComponent(process.env.API_PRODUCT_KEY);
        proxyReq.path += '&type=json';
      },
    },
  },
};
