<template>
  <v-container fluid>
    <v-overlay v-if="!loaded">
      <v-progress-circular indeterminate />
    </v-overlay>
    <v-row>
      <v-col>
        <v-data-table
          v-if="loaded"
          :headers="headers"
          :items="response.data"
          :loading="loading"
          :items-per-page="response.meta.per_page"
          class="elevation-1"
          :page.sync="page"
          hide-default-footer
        >
          <template v-slot:top>
            <v-toolbar
              flat
            >
              <v-toolbar-title>لیست</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
              <v-spacer></v-spacer>
              <v-dialog
                v-model="dialog"
                max-width="700px"
              >
                <v-card>
                  <v-card-title>
                    <span>اطلاعات دانش آموز</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-form ref="form" lazy-validation>
                        <v-row>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-text-field
                              v-model="editedItem.user_first_name"
                              :rules="[editedItem.user_firstName_error]"
                              label="نام"
                              outlined
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-text-field
                              v-model="editedItem.user_last_name"
                              :rules="[editedItem.user_lastName_error]"
                              label="نام خانوادگی"
                              outlined
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-select :rules="[editedItem.user_gender_id_error]" label="جنسیت" :items="genders" item-value="id" item-text="title" v-model="editedItem.user_gender_id" outlined/>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-select :rules="[editedItem.user_major_id_error]" label="رشته" :items="majors" item-value="id" item-text="title" v-model="editedItem.user_major_id" outlined/>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-text-field
                              v-model="editedItem.user_mobile"
                              label="موبایل"
                              :rules="[editedItem.user_mobile_error]"
                              outlined
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-text-field
                              v-model="editedItem.user_national_code"
                              :rules="[editedItem.user_nationalCode_error]"
                              label="کد ملی"
                              outlined
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="6"
                          >
                            <v-select label="استان" :items="provinces" item-value="id" item-text="title" v-model="editedItem.user_province_id" outlined/>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="6"
                          >
                            <v-select :rules="[editedItem.user_shahr_id_error]" label="شهر" :items="cityFromSpecificProvince(editedItem.user_province_id)" item-value="id" item-text="title" v-model="editedItem.user_shahr_id" outlined/>
                          </v-col>
                        </v-row>
                      </v-form>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="close"
                    >
                      لغو
                    </v-btn>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="save"
                    >
                      ذخیره
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title>از حذف این سطر اطمینان دارید؟</v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete">لغو</v-btn>
                    <v-btn color="blue darken-1" text @click="deleteItemConfirm">تایید</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.user="{ item }">
            <p>{{item.user_first_name + ' ' + item.user_last_name}}</p>
          </template>
          <template v-slot:item.major="{ item }">
            <p>{{item.major}}</p>
          </template>
          <template v-slot:item.city="{ item }">
            <p>{{item.city}}</p>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn icon @click="editItem(item)" color="primary">
              <v-icon
              >
                mdi-pencil
              </v-icon>
            </v-btn>
            <v-btn icon color="red">
              <v-icon
                @click="deleteItem(item)"
              >
                mdi-delete
              </v-icon>
            </v-btn>
          </template>
        </v-data-table>
        <div class="text-center pt-2" v-if="!loading">
          <v-pagination
            total-visible="10"
            v-model="page"
            :length="response.meta.last_page"
          ></v-pagination>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from 'moment-jalaali'
import API_ADDRESS from "assets/Addresses";
import goTo from 'vuetify/lib/services/goto'
import {Order, OrderList} from "~/models/Order";

export default {
  name: "productShowEdit.vue",
  middleware: 'auth',
  created () {
    this.getData()
    this.getUserFormData()
  },
  data () {
    return {
      loaded: false,
      loading: true,
      page: 1,
      response: [],
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: 'دانش آموز',
          value: 'user'
        },
        {
          text: 'رشته دانش آموز',
          value: 'major'
        },
        {
          text: 'موبایل دانش آموز',
          value: 'user_mobile'
        },
        {
          text: 'شهر دانش آموز',
          value: 'city'
        },
        {
          text: 'تخصیص دهنده',
          value: 'insertor'
        },
        {
          text: 'موبایل تخصیص دهنده',
          value: 'insertor_mobile'
        },
        {
          text: 'تاریخ',
          align: 'start',
          value: 'completed_at'
        },
        {
          text: '',
          value: 'actions'
        }
      ],
      editedIndex: -1,
      editedItem: {
        user_first_name: '',
        user_last_name: '',
        user_gender_id: '',
        user_major_id: '',
        user_mobile: '',
        user_national_code: '',
        user_shahr_id: '',
        user_province_id: '',
        user_firstName_error: () => true,
        user_lastName_error: () => true,
        user_mobile_error: () => true,
        user_gender_id_error: () => true,
        user_major_id_error: () => true,
        user_nationalCode_error: () => true,
        user_shahr_id_error: () => true,
      },
      defaultItem: {
        user_first_name: '',
        user_last_name: '',
        user_gender_id: '',
        user_major_id: '',
        user_mobile: '',
        user_national_code: '',
        user_shahr_id: '',
        user_province_id: '',
        user_firstName_error: () => true,
        user_lastName_error: () => true,
        user_mobile_error: () => true,
        user_gender_id_error: () => true,
        user_major_id_error: () => true,
        user_nationalCode_error: () => true,
        user_shahr_id_error: () => true,
      },
      genders: [],
      majors: [],
      provinces: [],
      cities: []
    }
  },
  head() {
    return {
      title: 'ثبت نامی ها'
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
    page (val) {
      this.getData(val)
    }
  },
  computed: {
    cityFromSpecificProvince () {
      return (provinceId) => {
        console.log(provinceId)
        return this.cities.filter(city => city.province.id === provinceId)
      }
    }
  },
  methods: {
    getUserFormData () {
      this.$axios.get(API_ADDRESS.user.formData)
        .then((resp) => {
          this.genders = resp.data.data.genders
          this.majors = resp.data.data.majors
          this.provinces = resp.data.data.provinces
          this.cities = resp.data.data.cities
        })
    },
    getData (page = 1) {
      goTo(0)
      this.loading = true
      this.$axios.get(API_ADDRESS.product.base + '?page=' + page).then(resp => {
        this.response = resp.data
        this.response.data.forEach((item, index) => {
          this.response.data[index] =
            {
              id: item.id,
              orderProducts: item.orderproducts,
              major: item.user && item.user.major ? item.user.major.name : '',
              city: item.user ? item.user.city : '',
              user: item.user ? item.user.first_name + ' ' + item.user.last_name : '',
              user_mobile: item.user ? item.user.mobile : '',
              user_mobile_error: () => true,
              insertor: item.insertor ? item.insertor.first_name + ' ' + item.insertor.last_name : '',
              insertor_mobile: item.insertor ? item.insertor.mobile : '',
              completed_at: (item.completed_at) ? moment(item.completed_at, 'YYYY-M-D hh:mm:ss').format('jYYYY/jMM/jDD hh:mm:ss') : '-',
              user_first_name: item.user ? item.user.first_name : '',
              user_firstName_error: () => true,
              user_last_name: item.user ? item.user.last_name : '',
              user_lastName_error: () => true,
              user_id: item.user ? item.user.id : '',
              user_national_code: item.user ? item.user.national_code : '',
              user_nationalCode_error: () => true,
              user_major_id: item.user && item.user.major ? item.user.major.id : '',
              user_major_id_error: () => true,
              user_gender_id: item.user && item.user.gender ? item.user.gender.id : '',
              user_gender_id_error: () => true,
              user_shahr_id: item.user && item.user.shahr ? item.user.shahr.id : '',
              user_shahr_id_error: () => true,
            }
        })
        this.page = resp.data.meta.current_page
        this.loading = false
        this.loaded = true
      })
    },
    editItem (item) {
      this.editedIndex = this.response.data.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editedItem.first_name = item.user_first_name
      this.editedItem.last_name = item.user_last_name
      this.editedItem.user_province_id = this.getProvince(item.user_shahr_id).id
      this.dialog = true
    },
    deleteItem (item) {
      this.editedIndex = this.response.data.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    getProvince(cityId) {
      return this.cities.find(city => {
        return city.id === cityId
      }).province
    },
    deleteItemConfirm () {
      this.$axios.delete(API_ADDRESS.product.delete + this.response.data[this.editedIndex].id)
      .then(() => {
        this.response.data.splice(this.editedIndex, 1)
        this.closeDelete()
        this.$notify({
          type: 'success',
          text: 'با موفقیت حذف شد',
        })
      }).catch(error => {
        this.$notify({
          type: 'error',
          title: 'مشکلی رخ داده است',
          text: error.response.data.message,
        })
      })
    },
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    save () {
      if (this.editedIndex > -1) {
        this.$axios.post(API_ADDRESS.user.update + this.editedItem.user_id, {
          firstName: this.editedItem.user_first_name,
          lastName: this.editedItem.user_last_name,
          mobile: this.editedItem.user_mobile,
          nationalCode: this.editedItem.user_national_code,
          gender_id: this.editedItem.user_gender_id,
          major_id: this.editedItem.user_major_id,
          shahr_id: this.editedItem.user_shahr_id,
          _method: 'put'
        }).then(() => {
          this.$notify({
            type: 'success',
            text: 'ذخیره با موفقیت انجام شد'
          })
          Object.assign(this.response.data[this.editedIndex], this.editedItem)
          this.response.data[this.editedIndex].user = this.response.data[this.editedIndex].user_first_name + ' ' + this.response.data[this.editedIndex].user_last_name
          this.close()
        }).catch(error => {
          Object.keys(error.response.data.errors).forEach(errKey => {
            this.response.data[this.editedIndex]['user_' + errKey + '_error'] = () => error.response.data.errors[errKey][0]
            this.editedItem['user_' + errKey + '_error'] = () => error.response.data.errors[errKey][0]
          })
          this.$notify({
            type: 'error',
            title: 'مشکلی رخ داده است',
            text: error.response.data.message
          })
          setTimeout(() => {
            this.$refs.form.validate()
          }, 500)
        })
      } else {
        this.response.data.push(this.editedItem)
      }
    },
  }
}
</script>

<style scoped>

</style>
