<template>
  <div>
    <v-row :style="{ padding: '20px 10px' }">
      <v-col md="12" class="vertialcally-center-items">
        <v-btn block color="green" dark>
          <a :href=download target="_blank" download>دانلود خروجی اکسل</a>
          <v-icon :style="{ marginRight: '10px' }">
            mdi-download
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <div class="header">
      <h2 class="mb-2">
        {{ tableTitle }}
      </h2>
    </div>
    <v-data-table
      :footer-props="{
        disableItemsPerPage: true,
        itemsPerPageText: '',
        pageText: 'صفحه ' + options.page + ' از ' + Math.ceil(totalRows / options.itemsPerPage),
        showCurrentPage: true
      }"
      :headers="headers"
      :items="rows"
      :options.sync="options"
      :server-items-length="totalRows"
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
          <v-btn
            class="ma-5"
            color="orange"
            elevation="2"
            :to="goToEdit(item.id)"
          >ویرایش اطلاعات
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
          btnName: 'لیست زیر شبکه ها',
          routeName: 'subnetwork'
        }
      }
    },
    tableTitle: {
      type: String,
      default: 'لیست شبکه ها'
    },
    pageName: {
      type: String,
      default: 'network'
    }
  },
  data() {
    return {
      download: '',
      options: {
        itemsPerPage: 25,
        page: 1
      },
      totalRows: 0,
      headers: [
        {
          text: 'شناسه',
          align: 'center',
          value: 'id',
        },
        {text: 'نام', value: 'first_name'},
        {text: 'نام خانوادگی', value: 'last_name'},
        {text: 'شماره همراه', value: 'mobile'},
        {text: 'پایه', value: 'grade'},
        {text: 'رشته', value: 'major'},
        {text: 'عملیات', value: 'actions'},
      ],
      rows: [],
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false
    }
  },
  watch: {
    options: {
      handler() {
        this.getUsersOfBonyad();
      },
    },
    deep: true,
  },
  methods: {
    getExcel() {
      const mode = this.getUserOfBonyadParam()
      this.$axios.get(API_ADDRESS.exam.usersOfBonyad, {params: {action: mode, excel_export: true}})
        .then(resp => {
          this.download = resp.data.data.export_file_url
        })
        .catch(err => {
          console.log(err)
        })
    },
    getUsersOfBonyad() {
      const id = this.getUserOfBonyadId()
      const mode = this.getUserOfBonyadParam()
      this.$axios.get(API_ADDRESS.exam.getUsersOfBonyad(id, mode, this.options.page))
        .then((response) => {
          response.data.data.map(item => (item.major = item.major?.title) && (item.gender = item.gender?.title) && (item.grade = item.grade?.title))
          this.rows = response.data.data
          this.totalRows = response.data.meta.total
          this.totalRows = response.data.meta.total
          this.options.itemsPerPage = response.data.meta.per_page
          this.getExcel()
        })
    },
    getUserOfBonyadParam() {
      if (!this.doesRouteHaveId()) {
        return 'show-' + this.pageName + 's'
      }
      return null
    },
    getUserOfBonyadId() {
      // return this.$route.params.list && (this.$route.params.list !== 'List' && this.$route.params.list !== 'list') ? this.$route.params.list : this.user.id
      if (this.doesRouteHaveId()) {
        return this.$route.params.list
      }
      return null
    },
    doesRouteHaveId() {
      return this.$route.params.list && (this.$route.params.list !== 'List' && this.$route.params.list !== 'list')
    }
  },
  computed: {
    getNextRoutePath() {
      return (id) => {
        return {
          path: '/admin/' + this.nextPageInfo.routeName + '/' + id
        }
      }
    },
    user() {
      return this.$store.getters['Auth/user']
    },
    getResultRoute() {
      return (id) => {
        return {
          path: '/admin/user/result/' + id
        }
      }
    },
    goToEdit() {
      return (id) => {
        return {
          path: 'edit/' + id
        }
      }
    }
  },
  mounted() {
    // this.getUsersOfBonyad()
  }
}
</script>

<style scoped lang="scss">
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

::v-deep .v-data-footer {
  .v-data-footer__select {
    .v-input {
      display: none;
    }
  }
}
</style>
