<template>
  <v-row class="user-create">
    <v-overlay v-if="user.strategyInstance.loading || create.importLoading">
      <v-progress-circular indeterminate/>
    </v-overlay>
    <create-limitation
      :usage_limit="create.usage_limit"
      :usage_number="create.usage_number"
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
    <v-col md="12">
      <v-row :style="{ padding: '20px 10px' }">
        <v-col md="12" class="vertialcally-center-items">
          <v-btn block color="green" dark @click="downloadExcel">
            دانلود نمونه اکسل
            <v-icon class="mr-3">
              mdi-download
            </v-icon>
          </v-btn>
        </v-col>
        <v-col md="5" class="vertialcally-center-items text-left  ">
          <v-btn color="green" dark @click="save" :loading="create.strategyInstance.loading"
                 :style="{ marginRight: '20px' }">
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
            placeholder="import excel file"
          />
        </v-col>
      </v-row>
      <v-form ref="form" lazy-validation>
        <v-row v-for="user in create.strategyInstance.userForm" :key="user.key">
          <v-col :style="{ maxWidth: '95vw' }" class="user-row" :class="{ 'has-been-saved': user.hasBeenSaved }">
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
                  <option v-for="(item, index) in create.strategyInstance.genders" :key="index" :value="item.id">
                    {{ item.title }}
                  </option>
                </select>
                <span class="select-highlight"></span>
                <span class="select-bar"></span>
                <label class="select-label">جنسیت</label>
                <span class="error-message" v-if="user.gender_id_error">{{ user.gender_id_error }}</span>
              </div>
            </div>
            <div class="input-box">
              <div class="select">
                <select class="select-text" required v-model="user.major_id"
                        :class="{ 'has-error': user.major_id_error }">
                  <option value="" disabled selected></option>
                  <option v-for="(item, index) in create.strategyInstance.majors" :key="index" :value="item.id">
                    {{ item.title }}
                  </option>
                </select>
                <span class="select-highlight"></span>
                <span class="select-bar"></span>
                <label class="select-label">رشته</label>
                <span class="error-message" v-if="user.major_id_error">{{ user.major_id_error }}</span>
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
                  <input @paste="onPaste" :class="{ 'has-error': user.address_error }" required type="text"
                         v-model="user.address" @change="user.hasBeenSaved = false">
                  <span class="placeholder">آدرس</span>
                </label>
                <span class="error-message" v-if="user.address_error">{{ user.address_error }}</span>
              </div>
            </div>
            <div class="input-box">
              <div class="form-input">
                <label>
                  <input @paste="onPaste" :class="{ 'has-error': user.phone_error }" required type="text"
                         v-model="user.phone" @change="user.hasBeenSaved = false">
                  <span class="placeholder">تلفن</span>
                </label>
                <span class="error-message" v-if="user.phone_error">{{ user.phone_error }}</span>
              </div>
            </div>
            <div class="input-box">
              <div class="form-input">
                <label>
                  <input @paste="onPaste" :class="{ 'has-error': user.father_mobile_error }" required type="text"
                         v-model="user.father_mobile" @change="user.hasBeenSaved = false">
                  <span class="placeholder">موبایل پدر</span>
                </label>
                <span class="error-message" v-if="user.father_mobile_error">{{ user.father_mobile_error }}</span>
              </div>
            </div>
            <div class="input-box">
              <div class="form-input">
                <label>
                  <input @paste="onPaste" :class="{ 'has-error': user.mother_mobile_error }" required type="text"
                         v-model="user.mother_mobile" @change="user.hasBeenSaved = false">
                  <span class="placeholder">موبایل مادر</span>
                </label>
                <span class="error-message" v-if="user.mother_mobile_error">{{ user.mother_mobile_error }}</span>
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
          </v-col>
          <v-col :style="{ maxWidth: '5vw' }" class="options">
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
import CreateUser from "assets/createUsers/createUser";
import CreateLimitation from '/components/abrisham/createLimitation'

export default {
  name: "create.vue",
  components: {CreateLimitation},
  date() {
    return {
      user: new CreateUser(this.userData.id, this.$axios)
    }
  },
  created() {
    console.log(this.user.strategyInstance)
  }
}
</script>

<style scoped>

</style>
