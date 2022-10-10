<template>
  <v-container
    fluid
    fill-height
  >
    <v-layout
      align-center
      justify-center
    >
      <v-flex
        xs12
        sm8
        md4
      >

        <v-img
          :src="require('~/static/boniad-ehsan-logo.png')"
          class="mx-auto"
          max-width="100px"
          width="100px"
        />
        <v-card class="elevation-12">
          <v-progress-linear
            color="#ffc107"
            absolute
            top
            :active="loadingList"
            indeterminate
            rounded
            height="6"
          />
          <v-toolbar
            color="success"
            dark
            flat
          >
            <v-toolbar-title>
              <v-row>
                <v-col>
                  <v-img
                    src="/img/logo.png"
                    width="20"
                  />
                </v-col>
                <v-col>
                  ورود
                </v-col>
              </v-row>
            </v-toolbar-title>
            <v-spacer/>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  :href="'https://alaatv.com/'"
                  icon
                  small
                  target="_blank"
                  v-on="on"
                >
                  <v-img
                    src="img/alaa-logo.png"
                    width="50"
                  />
                </v-btn>
              </template>
              <span>آموزش مجازی آلاء</span>
            </v-tooltip>
          </v-toolbar>
          <v-form @submit.prevent="login">
            <v-card-text>
              <v-text-field
                id="username"
                v-model="username"
                label="شماره همراه"
                name="login"
                prepend-icon="mdi-account"
                type="text"
              />

              <v-text-field
                id="password"
                v-model="password"
                label="کد ملی"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
              />
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="primary"
                :loading="loadingList"
                :disabled="loadingList"
                type="submit"
              >
                ورود
              </v-btn>
              <v-spacer/>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import API_ADDRESS from '@/assets/Addresses'
import {User} from '@/models/User'
import {mixinAuth} from '@/mixin/Mixins'

export default {
  name: 'Login',
  mixins: [mixinAuth],
  data() {
    return {
      // user: new User(window.localStorage.getItem('user')),
      loadingList: false,
      username: null,
      password: null,
      autofilledUsername: false,
      autofilledPass: false
    }
  },
  head() {
    return {
      title: 'ورود'
    }
  },
  computed: {
    user() {
      return this.$store.getters['Auth/user']
    }
  },
  created() {
    // if (this.getToken()) {
    //   this.getUserData( () => { this.redirectTo() })
    // }
  },
  methods: {
    getToken() {
      return this.$store.getters['Auth/accessToken']
    },
    setUserData(userData) {
      this.$store.commit('Auth/updateUser', new User(userData))
    },
    setAccessToken(access_token) {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token
      this.$store.commit('Auth/updateAccessToken', access_token)
    },
    redirectTo() {
      // if (this.$route.query.redirect_to_exam) {
      //   this.$router.push({path: '/user/create'})
      //   return
      // }
      //
      // let redirect_to = window.localStorage.getItem('redirect_to')
      // if (!redirect_to) {
      //   redirect_to = 'dashboard'
      // }
      // this.$router.push({ name: redirect_to })
      // this.$router.push({path: '/user/create'})

    },
    login() {
      let that = this
      this.loadingList = true
      this.$axios.post(API_ADDRESS.auth.login, {
        mobile: this.username,
        password: this.password
      })
        .then((response) => {

          this.loadingList = false

          that.user = new User(response.data.data.user)
          that.$store.commit('Auth/updateUser', that.user)
          const access_token = response.data.data.access_token
          this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token
          this.setAccessToken(access_token)
          that.setUserData(response.data.data.user)
          that.$axios.get(API_ADDRESS.user.info).then((resp) => {
            this.$store.commit('Auth/updateUser', resp.data.data)
            if (this.user.hasPermission('accessBonyadEhsanAdminPanel')) {
              this.$router.push({path: '/'})
            } else {
              this.$router.push({path: '/abrisham/UserAbrishamProgress'})
            }

          }).catch(() => {
            this.$store.dispatch('Auth/logout')
            this.$notify({
              type: 'error',
              title: 'توجه',
              text: 'شما دسترسی لازم برای ورود به پنل را ندارید'
            })
          })
          // this.getUserData(() => { this.redirectTo() })
        })
        .catch(() => {
          this.loadingList = false
        })
    }
  }
}
</script>

<style scoped>

</style>
