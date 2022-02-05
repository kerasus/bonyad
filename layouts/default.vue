<template>
  <v-app dark>
    <v-navigation-drawer
      v-if="!isLoginPage && false"
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon
        v-if="!isLoginPage"
        @click.stop="rightDrawer = !rightDrawer"
      />
      <v-btn
        v-if="false"
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn
        v-if="false"
        icon
        @click.stop="clipped = !clipped"
      >
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn
        v-if="false"
        icon
        @click.stop="fixed = !fixed"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-btn
        v-if="!isLoginPage"
        icon
        @click.stop="logout"
      >
        <v-icon>mdi-logout</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn
        v-if="false"
        icon
        @click.stop="drawer = !drawer"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <span>
        {{ user.full_name }}
      </span>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <notifications />
        <Nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer
      v-model="rightDrawer"
      :right="right"
      fixed
      app
    >
      <v-img
        :src="require('~/static/boniad-ehsan-logo.png')"
        class="mx-auto mt-5"
        max-width="90%"
        width="100px"
      />
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          v-if="!item.permission || (user.permissions && user.permissions.find(permission => permission === item.permission))"
          :key="i"
          :to="item.to"
          @click="rightDrawer = false"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer
      v-if="false"
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import '@/static/fonts/IRANSans/css/fontiran.css'
import Assistant from "assets/assistant";

export default {
  name: 'DefaultLayout',
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-account-multiple-plus',
          title: 'ثبت کاربر',
          to: '/admin/user/create',
          permission: 'accessBonyadEhsanPanel'
        },
        {
          icon: 'mdi-account-multiple-plus',
          title: 'ثبت مشاور',
          to: '/admin/moshaver/create',
          permission: 'accessBonyadEhsanPanel'
        },
        {
          icon: 'mdi-account-details',
          title: 'مشاهده ثبت نام شده ها',
          to: '/admin/order',
          permission: 'accessBonyadEhsanPanel'
        },
        {
          icon: 'mdi-account-details',
          title: 'داشبورد ابریشم',
          to: '/abrisham',
          permission: ''
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'بنیاد احسان'
    }
  },
  created() {
    let that = this
    this.$axios.interceptors.response.use(undefined, function (error) {
      const messages = Assistant.handleAxiosError(error, that.$notify)
      messages.forEach((item) => {
        that.$notify({
          title: 'توجه!',
          text: item,
          type: 'error'
        })
      })

      // that.$notify({
      //     type: 'error',
      //     title: 'توجه',
      //     text: error.response.data.message
      // })

      return Promise.reject(error);
    })
    let token = this.$store.getters['Auth/accessToken']
    if (token) {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
    }
  },
  computed: {
    isLoginPage () {
      return this.$route.path === '/login'
    },
    user () {
      return this.$store.getters["Auth/user"]
    }
  },
  methods: {
    logout () {
      this.rightDrawer = false
      this.$store.dispatch('Auth/logout')
      this.$router.push({path: '/login'})
    }
  }
}
</script>

<style>
.v-application .body-1,
.v-application .body-2,
.v-application .subtitle-1,
.v-application .subtitle-2,
.v-application .caption,
.v-application, .v-application .headline {
  font-family: 'IRANSans', 'Arial', 'Verdana', 'Tahoma', sans-serif !important;
}

</style>
