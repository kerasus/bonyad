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
          v-if="!item.permission || (user.permissions && user.permissions.find(permission => permission === item.permission))"
          :key="i"
          @click="onSelectItem(item)"
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
          icon: 'mdi-format-list-bulleted',
          title: 'لیست شبکه ها',
          to: '/admin/network/list',
          permission: 'bonyadShowNetworks'
        },
        {
          icon: 'mdi-format-list-bulleted',
          title: 'لیست زیر شبکه ها',
          to: '/admin/subnetwork/list',
          permission: 'bonyadShowSubnetworks'
        },
        {
          icon: 'mdi-format-list-bulleted',
          title: 'لیست مشاور ها',
          to: '/admin/moshaver/list',
          permission: 'bonyadShowMoshavers'
        },
        {
          icon: 'mdi-format-list-bulleted',
          title: 'لیست دانش آموزان',
          to: '/admin/user/list',
          permission: 'bonyadShowStudents'
        },
        {
          icon: 'mdi-account-multiple-plus',
          title: 'ثبت شبکه',
          to: '/admin/network/create',
          permission: 'bonyadAddNetworks'
        },
        {
          icon: 'mdi-account-multiple-plus',
          title: 'ثبت زیر شبکه',
          to: '/admin/subnetwork/create',
          permission: 'bonyadAddSubnetworks'
        },
        {
          icon: 'mdi-account-multiple-plus',
          title: 'ثبت مشاور',
          to: '/admin/moshaver/create',
          permission: 'bonyadAddMoshavers'
        },
        {
          icon: 'mdi-account-multiple-plus',
          title: 'ثبت دانش آموز',
          to: '/admin/user/create',
          permission: 'bonyadAddStudents'
        },
        // {
        //   icon: 'mdi-account-details',
        //   title: 'مشاهده ثبت نام شده ها',
        //   to: '/admin/order',
        //   permission: 'accessBonyadEhsanPanel'
        // },
        {
          icon: 'mdi-account-details',
          title: 'داشبورد ابریشم',
          externalLink: '/panel/ehsan-abrisham2',
          permission: ''
        },
        {
          icon: 'mdi-account-details',
          title: 'داشبورد فوریت',
          externalLink: '/panel/110',
          permission: ''
        },
        {
          icon: 'mdi-format-list-bulleted',
          title: 'پیام مشاور',
          to: '/admin/LiveDescription/list',
          permission: 'insertLiveDescription'
        },
        {
          icon: 'mdi-format-list-bulleted',
          title: 'آپلود فایل آزمون و مشاهده نتایج',
          to: '/admin/quizOperation',
          permission: 'putMinioUpload'
        }
      ]
    }
  },
  head () {
    return {
      title: 'فهرست'
    }
  },
  computed: {
    user () {
      return this.$store.getters['Auth/user']
    }
  },
  methods: {
    onSelectItem (item) {
      if (item.to) {
        this.$router.push({path: item.to})
      } else if (item.externalLink) {
        window.location.href = item.externalLink
      }
    }
  }
}
</script>
