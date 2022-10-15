<template>
  <v-row class="user-create">
    <v-overlay v-if="loading">
      <v-progress-circular indeterminate/>
    </v-overlay>
    <v-col md="12">
      <v-row :style="{ padding: '20px 10px' }">
        <v-col md="12" class="vertialcally-center-items">
          <v-btn block color="green" dark
                 @click="window.open('https://nodes.alaatv.com/upload/bonyad/sample.xlsx', '_blank')">
            دانلود نمونه اکسل
            <v-icon class="mr-3">
              mdi-download
            </v-icon>
          </v-btn>
        </v-col>
        <v-col md="5" class="vertialcally-center-items">
          <v-btn color="green" dark @click="save" :loading="loading">
            ذخیره
            <v-icon :style="{ marginRight: '10px' }">
              mdi-content-save
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-form ref="form" lazy-validation>
        <v-row v-for="user in userForm" :key="user.key">
          <v-col md="11" class="user-row" :class="{ 'has-been-saved': user.hasBeenSaved }">
            <div class="input-box">
              <div class="form-input">
                <label>
                  <input @paste="onPaste" :class="{ 'has-error': user.firstName_error }" required type="text"
                         v-model="user.firstName" @change="user.hasBeenSaved = false">
                  <span class="placeholder">نام</span>
                </label>
                <span class="error-message" v-if="user.firstName_error">{{ user.firstName_error }}</span>
              </div>
            </div>
            <div class="input-box">
              <div class="form-input">
                <label>
                  <input @paste="onPaste" :class="{ 'has-error': user.lastName_error }" required type="text"
                         v-model="user.lastName" @change="user.hasBeenSaved = false">
                  <span class="placeholder">نام خانوادگی</span>
                </label>
                <span class="error-message" v-if="user.lastName_error">{{ user.lastName_error }}</span>
              </div>
            </div>
            <div class="input-box">
              <div class="select">
                <select class="select-text" required v-model="user.gender_id"
                        :class="{ 'has-error': user.gender_id_error }">
                  <option value="" disabled selected></option>
                  <option v-for="(item, index) in genders" :key="index" :value="item.id">{{ item.title }}</option>
                </select>
                <span class="select-highlight"></span>
                <span class="select-bar"></span>
                <label class="select-label">جنسیت</label>
                <span class="error-message" v-if="user.gender_id_error">{{ user.gender_id_error }}</span>
              </div>
            </div>
            <div class="input-box">
              <div class="form-input">
                <label>
                  <input @paste="onPaste" :class="{ 'has-error': user.mobile_error }" required type="text"
                         v-model="user.mobile" @change="user.hasBeenSaved = false">
                  <span class="placeholder">موبایل</span>
                </label>
                <span class="error-message" v-if="user.mobile_error">{{ user.mobile_error }}</span>
              </div>
            </div>
            <div class="input-box">
              <div class="form-input">
                <label>
                  <input @paste="onPaste" :class="{ 'has-error': user.nationalCode_error }" required type="text"
                         v-model="user.nationalCode" @change="user.hasBeenSaved = false">
                  <span class="placeholder">کد ملی</span>
                </label>
                <span class="error-message" v-if="user.nationalCode_error">{{ user.nationalCode_error }}</span>
              </div>
            </div>
            <div class="input-box">
              <div class="select">
                <select class="select-text" :class="{ 'has-error': user.province_error }" required
                        v-model="user.province" @click="provinceSelectOnClick(user)"
                        @mousedown="provinceSelectOnClick(user)" @blur="provinceSelectOnBlur(user)"
                        @change="provinceSelectOnChange(user)">
                  <option value="" disabled selected></option>
                  <option
                    v-for="(item, index) in provincesComputed(user.provinceDropDown, user.province)"
                    :key="index"
                    :value="item.id"
                  >
                    {{ item.title }}
                  </option>
                </select>
                <span class="select-highlight"></span>
                <span class="select-bar"></span>
                <label class="select-label">استان</label>
                <span class="error-message" v-if="user.province_error">{{ user.province_error }}</span>
              </div>
            </div>
            <div class="input-box">
              <div class="select">
                <select class="select-text" :class="{ 'has-error': user.shahr_id_error }" required
                        v-model="user.shahr_id" @click="shahr_idSelectOnClick(user)"
                        @mousedown="shahr_idSelectOnClick(user)" @blur="shahr_idSelectOnBlur(user)"
                        @change="shahr_idSelectOnChange(user)">
                  <option value="" disabled selected></option>
                  <option value="disable" disabled selected v-if="selectedProvinceCity(user.province).length === 0">
                    ابتدا استان را انتخاب کنید
                  </option>
                  <option
                    v-for="(item, index) in selectedProvinceCity(user.province, user.shahr_idDropdown, user.shahr_id)"
                    :key="index" :value="item.id">{{ item.title }}
                  </option>
                </select>
                <span class="select-highlight"></span>
                <span class="select-bar"></span>
                <label class="select-label">شهر</label>
                <span class="error-message" v-if="user.shahr_id_error">{{ user.shahr_id_error }}</span>
              </div>
            </div>
            <div class="input-box">
              <div class="form-input">
                <label>
                  <input @paste="onPaste" :class="{ 'has-error': user.student_register_limit_error }" required
                         v-model="user.student_register_limit" type="number" @change="user.hasBeenSaved = false">
                  <span class="placeholder">محدودیت ثبت نام</span>
                </label>
                <span class="error-message"
                      v-if="user.student_register_limit_error">{{ user.student_register_limit_error }}</span>
              </div>
            </div>
          </v-col>
          <v-col md="1" class="options">
            <v-progress-circular
              indeterminate
              color="grey"
              v-if="user.loading"
            />
            <v-tooltip top v-if="user.hasBeenSaved">
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="green" v-bind="attrs" v-on="on">
                  mdi-content-save
                </v-icon>
              </template>
              <span>ذخیره شده</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import API_ADDRESS from "assets/Addresses";
import {mixinCreateUsers} from '@/mixin/Mixins'

export default {
  name: 'moshaverCreate',
  mixins: [mixinCreateUsers],
  middleware: ['auth', 'redirectAdmin'],
  data() {
    return {
      userForm: [],
      genders: [],
      majors: [],
      provinces: [],
      cities: [],
      loading: false
    }
  },
  head() {
    return {
      title: 'ثبت نام مشاوران'
    }
  },
  methods: {
    provinceSelectOnClick(user) {
      user.provinceDropDown = true
    },
    provinceSelectOnBlur(user) {
      user.provinceDropDown = false
    },
    provinceSelectOnChange(user) {
      user.provinceDropDown = false
    },
    shahr_idSelectOnClick(user) {
      user.shahr_idDropdown = true
    },
    shahr_idSelectOnBlur(user) {
      user.shahr_idDropdown = false
    },
    shahr_idSelectOnChange(user) {
      user.shahr_idDropdown = false
    },
    initUserFormArray(clean = true, amount = 20, data) {
      if (clean) {
        this.userForm = []
      }
      for (let i = 0; i < amount; i++) {
        this.userForm.push({
          firstName: data && data[i] ? data[i][0] : '',
          firstNameMessage: '',
          firstName_error: false,
          student_register_limit: data && data[i] ? data[i][9] : '',
          student_register_limitMessage: '',
          student_register_limit_error: '',
          lastName: data && data[i] ? data[i][1] : '',
          lastName_error: false,
          gender_id: '',
          gender_id_error: false,
          mobile: data && data[i] ? data[i][4] : '',
          mobile_error: false,
          nationalCode: data && data[i] ? data[i][5] : '',
          nationalCode_error: false,
          province: '',
          provinceDropDown: false,
          province_error: false,
          shahr_id: '',
          shahr_idDropdown: false,
          shahr_id_error: false,
          key: Date.now() + Math.random() * 10000,
          hasBeenSaved: false,
          editable: true,
          loading: false
        })
        if (data && data[i]) {
          const gender_id = this.genders.filter(gender => gender.title === data[i][2])
          const major_id = this.majors.filter(major => major.title === data[i][3])
          const province = this.provinces.filter(province => province.title === data[i][6])
          let shahr_id = this.cities.find(city => city.title === data[i][8])
          if (!shahr_id) {
            shahr_id = this.cities.find(city => city.title === data[i][8])
          }
          this.userForm[i].gender_id = gender_id[0] ? gender_id[0].id : 0
          this.userForm[i].major_id = major_id[0] ? major_id[0].id : 0
          this.userForm[i].province = province[0] ? province[0].id : 0
          this.userForm[i].shahr_id = shahr_id? shahr_id.id : 0
        }
      }
    },
    isUserInfoComplete(user) {
      return !!(user.firstName || user.student_register_limit || user.lastName || user.gender_id
        || user.mobile || user.nationalCode ||
        user.province || user.shahr_id);
    },
    getUserFormData() {
      this.loading = true
      this.$axios.get(API_ADDRESS.user.formData)
        .then((resp) => {
          this.loading = false
          this.genders = resp.data.data.genders
          this.majors = resp.data.data.majors
          this.provinces = resp.data.data.provinces
          this.cities = resp.data.data.cities
        })
    },
    save() {
      this.userForm.forEach(user => {
        let that = this
        if (!user.hasBeenSaved && that.isUserInfoComplete(user)) {
          user.loading = true
          this.loading = true
          this.$axios.post(API_ADDRESS.subnetwork.create, {
            firstName: user.firstName,
            lastName: user.lastName,
            student_register_limit: user.student_register_limit,
            mobile: user.mobile,
            nationalCode: user.nationalCode,
            gender_id: user.gender_id,
            shahr_id: user.shahr_id
          }).then(() => {
            user.hasBeenSaved = true
            user.editable = false
            user.loading = false
            this.loading = false
            Object.keys(user).forEach(key => {
              if (key.includes('_error')) {
                user[key] = false
              }
            })
            setTimeout(() => {
              this.$refs.form.validate()
            }, 500)
          }).catch(err => {
            user.loading = false
            Object.keys(user).forEach(key => {
              if (key.includes('_error')) {
                user[key] = false
              }
            })
            Object.keys(err.response.data.errors).forEach(key => {
              user[key + '_error'] = err.response.data.errors[key][0]
            })
            setTimeout(() => {
              this.$refs.form.validate()
            }, 500)
          })
        } else if (user.firstName || user.lastName || user.student_register_limit || user.gender_id
          || user.mobile || user.nationalCode ||
          user.province || user.shahr_id) {
          this.$notify({
            type: 'error',
            duration: 10000,
            title: 'توجه',
            text: 'پر کردن تمامی فیلدهای یک سطر الزامی ست'
          })
        }
      })
    },
    onPaste(e) {
      this.pasteData(e)
      this.initUserFormArray(true, this.jsonObj.length, this.jsonObj)
    }
  },
  computed: {
    provincesComputed() {
      return (show, provinceId) => {
        if (!show && !provinceId) {
          return []
        } else if (!show && provinceId) {
          return this.provinces.filter(province => province.id === provinceId)
        }
        return this.provinces
      }
    },
    selectedProvinceCity() {
      return (provinceId, show = true, cityId) => {
        if (!provinceId || (!show && !cityId)) {
          return []
        } else if (!show && cityId) {
          return this.cities.filter(city => city.id === cityId)
        }
        return this.cities.filter(city => city.province.id === provinceId)
      }
    },
  },
  created() {
    this.initUserFormArray(true, 20)
    this.getUserFormData()
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
  color: white !important;
}

.has-been-saved {
  background: rgba(0, 280, 0, 0.2);
}

.has-error {
  border-color: red !important;
}

.error-message {
  color: red;
  font-size: 14px;
}

.input-box {
  padding: 0 10px;
  width: 100%;
}

.user-row {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.options {

}

.vertialcally-center-items {
  display: flex;
  align-items: center;
}
</style>

<style lang="scss">

.form-input {
  width: 100%;


  label {
    position: relative;
    display: block;
    width: 100%;
    min-height: 30px + 15px;
  }

  .placeholder {
    position: absolute;
    display: block;
    color: grey;
    top: 8px;
    z-index: 2;
    font-size: 16px;
    transition: all 200ms ease-in-out;
    cursor: text;
    right: 10px;
    background-color: #fff;
    padding: 0 5px;
  }

  input {
    position: absolute;
    padding: 0 10px;
    z-index: 1;
    width: 100%;
    font-size: 16px;
    border: 1px solid grey;
    border-radius: 5px;
    transition: border-color 200ms ease-in-out;
    outline: none;
    margin: 0;
  }

  input {
    height: 40px;
  }

  input:focus,
  input:valid,
  textarea:focus,
  textarea:valid {
    & + .placeholder {
      top: -10px;
      cursor: inherit;
      font-size: 14px;
      color: orange;
    }

    border: 1px solid grey;
  }
}


.select {
  position: relative;
  width: 100%;
}

.select-text {
  position: relative;
  font-family: inherit;
  background-color: transparent;
  width: 100%;
  padding: 6px 10px 5px 0;
  font-size: 18px;
  border-radius: 5px;
  border: 1px solid grey;
}

/* Remove focus */
.select-text:focus {
  outline: none;
  border: 1px solid grey;
}

/* Use custom arrow */
.select .select-text {
  appearance: none;
  -webkit-appearance: none
}

.select:after {
  position: absolute;
  top: 18px;
  left: 14px;
  /* Styling the down arrow */
  width: 0;
  height: 0;
  padding: 0;
  content: '';
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid grey;
  pointer-events: none;
}


/* LABEL ======================================= */
.select-label {
  color: grey;
  font-size: 16px;
  font-weight: normal;
  position: absolute;
  pointer-events: none;
  right: 10px;
  top: 7px;
  transition: 0.2s ease-in-out all;
  background-color: #fff;
  z-index: 2;
  padding: 0 5px;
}

/* active state */
.select-text:focus ~ .select-label, .select-text:valid ~ .select-label {
  color: orange;
  top: -10px;
  transition: 0.2s ease all;
  font-size: 14px;
}

/* BOTTOM BARS ================================= */
.select-bar {
  position: relative;
  display: block;
  width: 100%;
}

.select-bar:before, .select-bar:after {
  content: '';
  height: 3px;
  width: 0;
  bottom: 0px;
  position: absolute;
  background: orange;
  transition: 0.2s ease all;
}

.select-bar:before {
  left: 50%;
}

.select-bar:after {
  right: 50%;
}

/* active state */
.select-text:focus ~ .select-bar:before, .select-text:focus ~ .select-bar:after {
  width: 50%;
}

/* HIGHLIGHTER ================================== */
.select-highlight {
  position: absolute;
  height: 60%;
  width: 100px;
  top: 25%;
  left: 0;
  pointer-events: none;
  opacity: 0.5;
}

</style>
