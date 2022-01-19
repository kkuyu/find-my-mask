import * as FontAwesome from './icon/fontawesome';

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: true,

  target: 'static',

  env: {
    NODE_ENV: process.env.NODE_ENV,
    API_LIST_URL: process.env.API_LIST_URL,
    API_LIST_KEY: process.env.API_LIST_KEY,
    API_PRODUCT_URL: process.env.API_PRODUCT_URL,
    API_PRODUCT_KEY: process.env.API_PRODUCT_KEY,
  },

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
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Hahmlet:wght@300;400;600&display=swap' },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['normalize.css', '@/assets/css/common.scss'],

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
    },
    '/product/': {
      target: process.env.API_PRODUCT_URL,
      pathRewrite: { '^/product/': '' },
      logLevel: 'debug',
    },
  },
};
