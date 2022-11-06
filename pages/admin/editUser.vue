<template>
  <div class="row">
    <div class="row">
      <v-overlay v-if="edit.loading">
        <v-progress-circular indeterminate/>
      </v-overlay>
      <div class="col-md-3">
        <v-text-field
          v-model="edit.user.first_name"
          label="نام"
        />
      </div>
      <div class="col-md-3">
        <v-text-field
          v-model="edit.user.last_name"
          label="نام خانوادگی"
        />
      </div>
      <div class="col-md-3">
        <v-select
          v-model="edit.gender"
          :items="edit.genders"
          item-text="title"
          label="جنسیت"
          @change="edit.changeGender()"
        ></v-select>
      </div>
      <div class="col-md-3" v-if="isStudent">
        <v-select
          v-model="edit.major"
          :items="edit.majors"
          item-text="title"
          label="رشته"
          @change="edit.changeMajor()"
        ></v-select>
      </div>
      <div class="col-md-3">
        <v-text-field
          v-model="edit.user.mobile"
          label="موبایل"
        />
      </div>
      <div class="col-md-3" v-if="isStudent">
        <v-text-field
          v-model="edit.user.address"
          label="آدرس"
        />
      </div>
      <div class="col-md-3" v-if="isStudent">
        <v-text-field
          v-model="edit.user.phone"
          label="تلفن"
        />
      </div>
      <div class="col-md-3" v-if="isStudent">
        <v-text-field
          v-model="edit.user.fatherMobile"
          label="موبایل پدر"
        />
      </div>
      <div class="col-md-3" v-if="isStudent">
        <v-text-field
          v-model="edit.user.motherMobile"
          label="موبایل مادر"
        />
      </div>
      <div class="col-md-3">
        <v-text-field
          v-model="edit.user.nationalCode"
          label="کد ملی"
        />
      </div>
      <div class="col-md-3">
        <v-select
          v-model="edit.province"
          :items="edit.provinces"
          item-text="title"
          label="استان"
          @change="edit.changeProvince()"
        ></v-select>
      </div>
      <div class="col-md-3">
        <v-select
          v-model="edit.city"
          :items="edit.availableCities"
          item-text="title"
          label="شهر"
          @change="edit.changeCity()"
        ></v-select>
      </div>
      <div class="col-md-12">
        <v-btn class="mx-5 mb-5"
               :loading="edit.loadingEdit"
               large
               rounded
               elevation="4"
               @click="edit.edit()"
        >ذخیره تغییرات
        </v-btn>
      </div>
    </div>
    <v-row class="justify-center" v-if="!isStudent">
      <v-col md="6" cols="12">
        <v-card elevation="5" class="pa-5">
          <v-row>
            <v-col cols="12"
                   md="4">
              <v-text-field
                class="mx-5"
                label="ظرفیت ثبت نام"
                v-model="edit.usage_limit"
              ></v-text-field>
            </v-col>
            <v-col cols="12"
                   md="4">
              <v-text-field
                class="mx-5"
                label="ظرفیت استفاده شده"
                readonly
                v-model="edit.usage_number"
              ></v-text-field>
            </v-col>
            <v-col cols="12"
                   md="12">
              <v-btn class="mx-10"
                     :loading="edit.loadingLimit"
                     large
                     rounded
                     elevation="4"
                     @click="edit.editLimit()">
                تغییر ظرفیت
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>

import Edit from "assets/EditUser/Edit";

export default {
  name: "_id.vue",
  props: {
    isStudent: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      edit: new Edit(this.$route.params.id, this.$axios, this.$notify),
    }
  },
}
</script>

<style scoped>

</style>
