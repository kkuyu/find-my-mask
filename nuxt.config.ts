import * as FontAwesome from './icon/fontawesome';
import configure from './configure';

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: true,

  target: 'static',

  generate: {
    fallback: true,
  },

  env: {
    GTAG_KEY: process.env.GTAG_KEY,
    NODE_ENV: process.env.NODE_ENV || '',
    API_LIST_URL: process.env.API_LIST_URL || '',
    API_LIST_KEY: process.env.API_LIST_KEY || '',
    API_PRODUCT_URL: process.env.API_PRODUCT_URL || '',
    API_PRODUCT_KEY: process.env.API_PRODUCT_KEY || '',
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    htmlAttrs: {
      lang: 'ko',
    },
    titleTemplate: new Function('titleChunk', `return titleChunk ? titleChunk + ' ${' | ' + configure.title}' : '${configure.title}'`),
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: configure.description },
      { name: 'format-detection', content: 'telephone=no' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: configure.url },
      { property: 'og:title', content: configure.title },
      { property: 'og:description', content: configure.description },
      { property: 'og:image', content: '/share-image.png' },
      { property: 'og:image.width', content: '1200' },
      { property: 'og:image.height', content: '620' },
      { name: 'twitter:card', content: 'photo' },
      { name: 'twitter:title', content: configure.title },
      { name: 'twitter:description', content: configure.description },
      { name: 'twitter:image', content: '/share-image.png' },
    ],
    link: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;700&display=swap' },
      { rel: 'apple-touch-icon', sizes: '57x57', href: '/apple-icon-57x57.png' },
      { rel: 'apple-touch-icon', sizes: '60x60', href: '/apple-icon-60x60.png' },
      { rel: 'apple-touch-icon', sizes: '72x72', href: '/apple-icon-72x72.png' },
      { rel: 'apple-touch-icon', sizes: '76x76', href: '/apple-icon-76x76.png' },
      { rel: 'apple-touch-icon', sizes: '114x114', href: '/apple-icon-114x114.png' },
      { rel: 'apple-touch-icon', sizes: '120x120', href: '/apple-icon-120x120.png' },
      { rel: 'apple-touch-icon', sizes: '144x144', href: '/apple-icon-144x144.png' },
      { rel: 'apple-touch-icon', sizes: '152x152', href: '/apple-icon-152x152.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-icon-180x180.png' },
      { rel: 'icon', type: 'image/png', sizes: '36x36', href: '/android-icon-36x36.png' },
      { rel: 'icon', type: 'image/png', sizes: '48x48', href: '/android-icon-48x48.png' },
      { rel: 'icon', type: 'image/png', sizes: '72x72', href: '/android-icon-72x72.png' },
      { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/android-icon-96x96.png' },
      { rel: 'icon', type: 'image/png', sizes: '144x144', href: '/android-icon-144x144.png' },
      { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/android-icon-192x192.png' },
      { rel: 'shortcut icon', type: 'image/x-icon', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'shortcut icon', type: 'image/x-icon', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'shortcut icon', type: 'image/x-icon', sizes: '96x96', href: '/favicon-96x96.png' },
      { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'canonical', href: configure.url },
    ],
    script: [
      {
        hid: 'agent',
        innerHTML: `
          var agent = navigator.userAgent.toLowerCase();
          if ((navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || agent.indexOf('msie') != -1) {
            window.location.replace('/not-support.html');
          }
        `,
      },
      {
        hid: 'schema',
        type: 'application/ld+json',
        innerHTML: `
          {
            "@context": "http://schema.org/",
            "@type": "WebSite",
            "name": "${configure.title}",
            "description": "${configure.description}",
            "url": "${configure.url}"
          }
        `,
      },
      { hid: 'gtag-load', src: `https://www.googletagmanager.com/gtag/js?id=${process.env.GTAG_KEY}`, async: true },
      {
        hid: 'gtag-js',
        innerHTML: `
          window.dataLayer = window.dataLayer || [];
          function gtag() {
            dataLayer.push(arguments);
          };
          gtag('js', new Date());
          gtag('config', '${process.env.GTAG_KEY}');
        `,
        type: 'text/javascript',
        charset: 'utf-8',
      },
    ],
    __dangerouslyDisableSanitizers: ['script'],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['normalize.css', '@/assets/css/common.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [{ src: '@/plugins/api.ts' }, { src: '@/plugins/validation.ts' }],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ['@nuxtjs/composition-api/module', ['@nuxtjs/fontawesome', { component: 'fontAwesome', suffix: true }], '@nuxt/typescript-build'],

  fontawesome: {
    icons: {
      solid: FontAwesome.solid,
      regular: FontAwesome.regular,
      brands: FontAwesome.brands,
    },
  },

  serverMiddleware: ['@/middleware/redirects.ts'],

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
