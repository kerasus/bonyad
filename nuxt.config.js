import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - بنیاد احسان',
    title: 'بنیاد احسان',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon1.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/notification.js',
    { src: '@/plugins/persistedState.client.js' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',

  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    "vue2-editor/nuxt"
  ],

  axios: {
    credentials: true, // https://axios.nuxtjs.org/options/#credentials
    proxyHeaders: true, // https://axios.nuxtjs.org/options/#proxyheaders
    proxy: true // Can be also an object with default options
  },

  proxy: {
    [process.env.AUTH_INTERNAL_API_SERVER]: { target: process.env.AUTH_TARGET_API_SERVER, pathRewrite: {['^'+process.env.AUTH_INTERNAL_API_SERVER]: ''} },
    [process.env.LUMEN_INTERNAL_API_SERVER]: { target: process.env.LUMEN_TARGET_API_SERVER, pathRewrite: {['^'+process.env.LUMEN_INTERNAL_API_SERVER]: ''} }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    rtl: true,
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [
      'nuxt-vuex-localstorage'
    ],
  },

  server: {
    // port: 8000, // default: 3000
    host: '0.0.0.0', // default: localhost,
    timing: false
  },

  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'custom',
        path: '*',
        component: resolve(__dirname, 'pages/404.vue')
      })
    }
  },

  env: {
    AUTH_TARGET_API_SERVER: process.env.AUTH_TARGET_API_SERVER || 'http://office.alaa.tv/api/v2',
    LUMEN_TARGET_API_SERVER: process.env.LUMEN_TARGET_API_SERVER || 'http://office.alaa.tv/api/v1',
    AUTH_INTERNAL_API_SERVER: process.env.AUTH_INTERNAL_API_SERVER || '/alaa/api/v2',
    LUMEN_INTERNAL_API_SERVER: process.env.LUMEN_INTERNAL_API_SERVER || '/3a/api/v1'
  }
}
