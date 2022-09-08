<template>
<div>
  <div class="header">
    <h2 class="mb-2">
      {{ tableTitle }}
    </h2>
  </div>
  <v-data-table
    :headers="headers"
    :items="rows"
    :items-per-page="5"
    class="elevation-1"
  >
    <template v-slot:item.actions="{ item }">
      <div class="btns">
        <v-btn
          v-if="showResultBtn"
          class="ma-2"
          color="light-blue lighten-1"
          :to="getResultRoute(item.id)"
        >
          نتایج
        </v-btn>
        <v-btn
          v-if="showNextListBtn"
          class="ma-2"
          color="secondary"
          :to="getNextRoutePath(item.id)"
        >
          {{ nextPageInfo.btnName }}
        </v-btn>
      </div>
    </template>
  </v-data-table>
</div>
</template>

<script>
import API_ADDRESS from "assets/Addresses";

export default {
  name: "DataTable",
  props: {
    showResultBtn: {
      type: Boolean,
      default: true
    },
    showNextListBtn: {
      type: Boolean,
      default: true
    },
    nextPageInfo: {
      type: Object,
      default() {
         return {
           btnName : 'لیست زیر شبکه ها',
           routeName : 'subnetwork'
         }
      }
    },
    tableTitle: {
      type: String,
      default: 'لیست شبکه ها'
    },
  },
  data () {
    return {
      headers: [
        {
          text: 'شناسه',
          align: 'center',
          value: 'id',
        },
        { text: 'نام', value: 'first_name' },
        { text: 'نام خانوادگی', value: 'last_name' },
        { text: 'شماره همراه', value: 'mobile' },
        { text: 'پایه', value: 'grade' },
        { text: 'رشته', value: 'major' },
        { text: 'عملیات', value: 'actions' },
      ],
      rows: [],
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false
    }
  },
  methods: {
    getUsersOfBonyad() {
      const id = this.getUserOfBonyadId()
      this.$axios.get(API_ADDRESS.exam.getUsersOfBonyad(id))
        .then((resp) => {
          resp.data.map(item => (item.major = item.major?.title) && (item.gender = item.gender?.title) && (item.grade = item.grade?.title))
          this.rows = resp.data
        })
    },
    getUserOfBonyadId () {
      // return this.$route.params.list && (this.$route.params.list !== 'List' && this.$route.params.list !== 'list') ? this.$route.params.list : this.user.id
      return this.$route.params.list && (this.$route.params.list !== 'List' && this.$route.params.list !== 'list') ? this.$route.params.list : null
    }
  },
  computed: {
    getNextRoutePath () {
      return (id) => {
        return {
          path: '/admin/'+ this.nextPageInfo.routeName + '/' + id
        }
      }
    },
    user () {
      return this.$store.getters['Auth/user']
    },
    getResultRoute() {
      return (id) => {
        return {
          path : '/admin/user/result/' + id
        }
      }
    },
  },
  mounted() {
    this.getUsersOfBonyad()
  }
}
</script>

<style scoped lang="scss">
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
