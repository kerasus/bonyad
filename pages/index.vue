<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-img
        :src="require('~/static/boniad-ehsan-logo.png')"
        class="mx-auto mt-5"
        max-width="90%"
        width="100px"
      />
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
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
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'IndexPage',
  middleware: 'auth',
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-account-multiple-plus',
          title: 'ثبت کاربر',
          to: '/admin/user/create'
        },
        {
          icon: 'mdi-account-multiple-plus',
          title: 'ثبت مشاور',
          to: '/admin/moshaver/create'
        },
        {
          icon: 'mdi-account-details',
          title: 'مشاهده ثبت نام شده ها',
          to: '/admin/order'
        }
      ]
    }
  },
  head() {
    return {
      title: 'فهرست'
    }
  }
}
</script>
