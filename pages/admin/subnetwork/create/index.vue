<template>
  <v-row class="user-create">
    <v-overlay v-if="create.strategyInstance.loading || create.importLoading">
      <v-progress-circular indeterminate/>
    </v-overlay>
    <create-limitation
      :usage_limit="create.strategyInstance.usage_limit"
      :usage_number="create.strategyInstance.usage_number"
    />
    <v-alert v-if="create.limit_error_row"
             color="red"
             type="error"
    >
      حداکثر 200 دانش آموز میتوانید وارد کنید
      <v-icon left @click="limit_error_row=false">
        mdi-close
      </v-icon>
    </v-alert>
    <v-col md="12" class="text-center">
      <h2 class="mt-3">صفحه ثبت زیرشبکه</h2>
    </v-col>
    <v-col md="12">
      <v-row :style="{ padding: '20px 10px' }">
        <v-col md="12" class="vertialcally-center-items">
          <v-btn block color="green" dark
                 @click="downloadExcel">
            دانلود نمونه اکسل
            <v-icon class="mr-3">
              mdi-download
            </v-icon>
          </v-btn>
        </v-col>
        <v-col md="5" class="vertialcally-center-items">
          <v-btn color="green" dark @click="save" :loading="create.strategyInstance.loading">
            ذخیره
            <v-icon class="mr-3">
              mdi-content-save
            </v-icon>
          </v-btn>
        </v-col>
        <v-col md="5" class="text-right">
          <v-file-input
            @change="addExcel"
            truncate-length="50"
            placeholder="بارگزاری اطلاعات با اکسل"
          />
        </v-col>
      </v-row>
      <v-form ref="form" lazy-validation>
        <v-row v-for="user in create.strategyInstance.userForm" :key="user.key">
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
                  <option v-for="(item, index) in create.strategyInstance.genders" :key="index" :value="item.id">{{ item.title }}</option>
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
import CreateLimitation from '/components/abrisham/createLimitation'
import CreateUser from "assets/createUsers/createUser";

export default {
  name: 'moshaverCreate',
  components: {CreateLimitation},
  middleware: ['auth', 'redirectAdmin'],
  data() {
    return {
      create: null,
      type: 'subnetwork'
    }
  },
  head() {
    return {
      title: 'ثبت نام مشاوران'
    }
  },
  methods: {
    downloadExcel() {
      window.open('https://nodes.alaatv.com/upload/bonyad/sample%28moshaver%29.xlsx', '_blank')
    },
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
    save() {
      this.create.strategyInstance.save()
    },
    addExcel(event) {
      this.create.addExcel(event)
    },
    onPaste(event) {
      this.create.onPaste(event)
    }
  },
  computed: {
    provincesComputed() {
      return (show, provinceId) => {
        if (!show && !provinceId) {
          return []
        } else if (!show && provinceId) {
          return this.create.strategyInstance.provinces.filter(province => province.id === provinceId)
        }
        return this.create.strategyInstance.provinces
      }
    },
    selectedProvinceCity() {
      return (provinceId, show = true, cityId) => {
        if (!provinceId || (!show && !cityId)) {
          return []
        } else if (!show && cityId) {
          return this.create.strategyInstance.cities.filter(city => city.id === cityId)
        }
        return this.create.strategyInstance.cities.filter(city => city.province.id === provinceId)
      }
    },
    userData() {
      return this.$store.getters['Auth/user']
    }
  },
  created() {
    this.create = new CreateUser(this.userData.id, this.$axios, this.type, this.$notify)
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
  bottom: 0;
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
