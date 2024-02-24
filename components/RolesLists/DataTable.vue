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
      <template v-slot:top>
        <v-row>
          <v-col cols="12" xl="2" lg="2" md="2">
            <v-text-field
              v-model="filter.first_name"
              dense
              label="نام"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" xl="2" lg="2" md="2">
            <v-text-field
              v-model="filter.last_name"
              dense
              label="نام خانوادگی"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" xl="2" lg="2" md="2">
            <v-select
              v-model="filter.province"
              :items="formData.provinces"
              dense
              label="استان"
              :loading="formDataLoading"
              @click:clear="clearCity"
              @change="clearCity"
              no-data-text="اطلاعات استان ها لود نشده است"
              item-text="title"
              item-value="id"
              clearable="true"
              outlined
            ></v-select>
          </v-col>
          <v-col cols="12" xl="2" lg="2" md="2">
            <v-select
            v-model="filter.city"
              :items="cities"
              dense
              label="شهر"
              :loading="formDataLoading"
              no-data-text="ابتدا استان خود را انتخاب کنید"
              item-text="title"
              item-value="id"
              clearable="true"
              outlined
            ></v-select>
          </v-col>
          <v-col cols="12" xl="3" lg="3" md="3" >
            <v-row>
              <v-col cols="6">
                <v-checkbox
                  v-model="filter.has_exam"
                  label="دارای آزمون"
                  dense
                  value="1"
                ></v-checkbox>
              </v-col>
              <v-col cols="6">
                <v-checkbox
                  v-model="filter.has_product"
                  label="دارای محصول"
                  dense
                  value="1"
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" xl="1" lg="1" md="1" >
            <v-btn
                block
                dark
                color="green"
                :loading="loadingPage"
                @click="getFilteredData"
              >
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
          </v-col>
        </v-row>
      </template>
      <template v-slot:item.total_content_watch_time="{ item }">
        {{ getHumanizeTime(item.total_content_watch_time) }}
      </template>
      <template v-slot:item.active="{ item }">
        {{ item.active ? 'فعال' : 'غیرفعال' }}
      </template>
      <template v-slot:item.actions="{ item }">
        <div class="btns">
          <v-menu
            bottom
            left
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item :to="getResultRoute(item.id)">
                <v-list-item-title class="text-center blue-grey--text text--darken-4">
                  نتایج
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-if="showNextListBtn" :to="getNextRoutePath(item.id)">
                <v-list-item-title class="text-center blue-grey--text text--darken-4">
                  {{ nextPageInfo.btnName }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item :to="goToEdit(item.id)">
                <v-list-item-title class="text-center blue-grey--text text--darken-4">
                  ویرایش اطلاعات
                </v-list-item-title>
              </v-list-item>
              <v-list-item @click="showConfirmMessage(item.id)">
                <v-list-item-title>
                  <v-icon left>
                    mdi-delete
                  </v-icon>
                  حذف کاربر
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
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
      formDataLoading: false,
      excleProgress: 0,
      download: '',
      formData: {
        cities: [],
        provinces: [],
        majors: [],
        genders: [],
        grades: []
      },
      filter: {
        first_name: '',
        last_name: '',
        city: null,
        province: null,
        has_exam: 0,
        has_product: 0,
      },
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
        {text: 'فعال', value: 'active'},
        {text: 'استان', value: 'province.title'},
        {text: 'شهر', value: 'city.title'},
        {text: 'نقش ثبت نام کننده', value: 'insertedByRoles[0]'},
        {text: 'نام ثبت نام کننده', value: 'insertedByFirstName'},
        {text: 'نام خانوادگی ثبت نام کننده', value: 'insertedByLastName'},
        {text: 'پایه', value: 'grade'},
        {text: 'رشته', value: 'major'},
        {text: 'مقدار مشاهده فیلم', value: 'total_content_watch_time'},
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
  mounted () {
    this.getFormData()
  },
  methods: {
    showConfirmMessage(userId) {
      this.dialog = true
      this.id = userId
    },
    getHumanizeTime (seconds) {
      if (!seconds) {
        return '-'
      }
      const parseIntSeconds = parseInt(seconds)
      const hours = Math.floor(parseIntSeconds / 3600)
      const minutes = Math.floor((parseIntSeconds % 3600) / 60)
      const remainingSeconds = Math.floor(parseIntSeconds % 60)

      const formattedHours = String(hours).padStart(2, '0')
      const formattedMinutes = String(minutes).padStart(2, '0')
      const formattedSeconds = String(remainingSeconds).padStart(2, '0')

      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
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
    getFormData() {
      this.formDataLoading = true
      this.$axios.get(API_ADDRESS.user.formData)
        .then(resp => {
          this.formData = resp.data.data
          this.formDataLoading = false
        })
        .catch(err => {
          this.formDataLoading = false
          console.log(err)
        })
    },
    clearCity () {
      this.filter.city = null
    },
    getFilteredData () {
      if (this.filter.province && !this.filter.city) {
        this.$notify({
          type: 'error',
          title: 'توجه',
          text: 'در صورت انتخاب استان، انتخاب شهر الزامی است'
        })
        return
      }
      this.getUsersOfBonyad()
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
      console.log(typeof this.$route.params.list !== 'number');
      this.$axios.get(API_ADDRESS.exam.getUsersOfBonyad(this.getUserOfBonyadId(), this.getUserOfBonyadId() ? null : mode, this.options.page, ), {
        params: {
          first_name: this.filter.first_name,
          last_name: this.filter.last_name,
          shahr_id: this.filter.city,
          has_exam: this.filter.has_exam,
          has_product: this.filter.has_product
        }
      })
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
      return 'show-' + this.pageName + 's'

      // if (!this.doesRouteHaveId()) {
      //   return 'show-' + this.pageName + 's'
      // }
      // return null
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
    },
    getNextRoutePath(id) {
      return {
        path: '/admin/' + this.nextPageInfo.routeName + '/' + id
      }
    },
  },
  computed: {
    cities () {
      return this.formData.cities.filter(city => city.province.id === this.filter.province)
    },
    isUserPermittedToDelete() {
      const user = this.$store.getters['Auth/user']
      return user.hasPermission('bonyadDeleteUsers')
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
