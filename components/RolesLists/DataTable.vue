<template>
  <div>
    <v-overlay v-if="loadingPage" z-index="1">
      <v-progress-circular indeterminate/>
    </v-overlay>
    <div class="text-center">
      <v-dialog
        v-model="dialog"
        width="500"
      >

        <v-card>
          <v-card-title class="text-h5 grey lighten-2 headline">
            تأیید نهایی
          </v-card-title>

          <v-card-text>
            آیا از حذف این کاربر مطمئن هستید؟
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="deleteUser"
            >
              بله
            </v-btn>
            <v-btn
              color="primary"
              text
              @click="dialog = false"
            >
              خیر
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div class="header justify-center">
      <h2 class="mb-2">
        {{ tableTitle }}
      </h2>
    </div>
    <v-row :style="{ padding: '10px 10px' }">
      <v-col md="12" class="vertialcally-center-items">
        <v-btn block color="green" dark @click="getExcel" :loading="excelLoading">
          دانلود خروجی اکسل
          <v-icon class="mr-3">
            mdi-download
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-progress-linear v-if="excelLoading" class="progress-linear mb-2" reverse :value="excleProgress" color="primary"
                       height="25">
      <template v-slot:default="{ value }">
        <strong>{{ value }}%</strong>
      </template>
    </v-progress-linear>
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
          <v-btn
            v-if="isUserPermittedToDelete"
            class="ma-2"
            color="error"
            @click="showConfirmMessage(item.id)"
          >
            <v-icon left>
              mdi-delete
            </v-icon>
            حذف کاربر
          </v-btn>
        </div>
      </template>
    </v-data-table>
    <v-row class="ma-5">
      <span>تعداد کل : </span>
      <span>{{ totalRows }}</span>
    </v-row>
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
      id: null,
      deleteComfirm: false,
      dialog: false,
      timer: null,
      loadingPage: false,
      excelLoading: false,
      excleProgress: 0,
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
        {text: 'استان', value: 'province.title'},
        {text: 'شهر', value: 'city.title'},
        {text: 'نقش ثبت نام کننده', value: 'insertedByRoles[0]'},
        {text: 'نام ثبت نام کننده', value: 'insertedByFirstName'},
        {text: 'نام خانوادگی ثبت نام کننده', value: 'insertedByLastName'},
        {text: 'پایه', value: 'grade'},
        {text: 'رشته', value: 'major'},
        {text: 'عملیات', value: 'actions'},
      ],
      rows: [],
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
  beforeDestroy() {
    clearTimeout(this.timer)
  },
  methods: {
    showConfirmMessage(userId) {
      this.dialog = true
      this.id = userId
    },
    deleteUser() {
      this.dialog = false
      this.$axios.delete(API_ADDRESS.delete.base(this.id))
        .then(resp => {
          this.getUsersOfBonyad()
          this.$notify({
            type: 'success',
            text: resp.data?.message ? resp.data.message : 'کاربر با موفقیت حذف شد',
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    getExcel() {
      this.excelLoading = true
      const mode = this.getUserOfBonyadParam()
      this.$axios.get(API_ADDRESS.exam.usersOfBonyad, {params: {action: mode, excel_export: true}})
        .then(resp => {
          this.excelProgressRequest(resp.data.data.id)
        })
        .catch(err => {
          this.excelLoading = false
          console.log(err)
        })
    },
    excelProgressRequest(id) {
      this.timer = setTimeout(() => {
        this.$axios.get(API_ADDRESS.exam.checkExport(id))
          .then(resp => {
            this.excleProgress = Math.floor(resp.data.data.progress)
            if (resp.data.data.link) {
              setTimeout(() => {
                window.open(resp.data.data.link, '_self')
                this.excelLoading = false
                this.excleProgress = 0
              }, 500)
            } else {
              this.excelProgressRequest(id)
            }
          })
          .catch(err => {
            console.log(err)
            this.excelLoading = false
          })
      }, 2000)
    },
    getUsersOfBonyad() {
      this.loadingPage = true
      const mode = this.getUserOfBonyadParam()
      this.$axios.get(API_ADDRESS.exam.getUsersOfBonyad(null, mode, this.options.page))
        .then((response) => {
          response.data.data.map(item => (item.major = item.major?.title) && (item.gender = item.gender?.title) && (item.grade = item.grade?.title))
          this.rows = response.data.data
          this.totalRows = response.data.meta.total
          this.totalRows = response.data.meta.total
          this.options.itemsPerPage = response.data.meta.per_page
          this.loadingPage = false
        }).catch(() => {
        this.loadingPage = false
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
    isUserPermittedToDelete() {
      const user = this.$store.getters['Auth/user']
      console.log(user)
      return user.hasPermission('bonyadDeleteUsers')
    },
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
a {
  text-decoration: none;
  color: white !important;
}

.progress-linear {
  position: sticky;
  top: 80px;
  z-index: 5;
  border-radius: 15px;
}

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
