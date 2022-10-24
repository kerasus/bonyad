<template>
  <div class="row">
    <div class="col-md-3">
      <v-text-field
        v-model="user.first_name"
        label="نام"
      />
    </div>
    <div class="col-md-3">
      <v-text-field
        v-model="user.last_name"
        label="نام خانوادگی"
      />
    </div>
    <div class="col-md-3">
      <v-select
        v-model="gender"
        :items="genders"
        item-text="title"
        label="جنسیت"
        @change="changeGender"
      ></v-select>
    </div>
    <div class="col-md-3">
      <v-select
        v-model="major"
        :items="majors"
        item-text="title"
        label="رشته"
        @change="changeMajor"
      ></v-select>
    </div>
    <div class="col-md-3">
      <v-text-field
        v-model="user.mobile"
        label="موبایل"
      />
    </div>
    <div class="col-md-3">
      <v-text-field
        v-model="user.address"
        label="آدرس"
      />
    </div>
    <div class="col-md-3">
      <v-text-field
        v-model="user.phone"
        label="تلفن"
      />
    </div>
    <div class="col-md-3">
      <v-text-field
        v-model="user.nationalCode"
        label="کد ملی"
      />
    </div>
    <div class="col-md-3">
      <v-select
        v-model="province"
        :items="provinces"
        item-text="title"
        label="استان"
        @change="changeProvince()"
      ></v-select>
    </div>
    <div class="col-md-3">
      <v-select
        v-model="city"
        :items="availableCities"
        item-text="title"
        label="شهر"
        @change="changeCity"
      ></v-select>
    </div>
    <div class="col-md-12">
      <v-btn class="mx-5"
             :loading="loading"
             large
             rounded
             elevation="4"
             @click="edit"
      >ذخیره تغییرات
      </v-btn>
    </div>
  </div>
</template>

<script>
import API_ADDRESS from "assets/Addresses";
import {User} from "@/models/User";

export default {
  name: "_id.vue",
  data() {
    return {
      loading: false,
      user: new User(),
      major: null,
      gender: null,
      province: null,
      city: null,
      genders: [],
      majors: [],
      provinces: [],
      cities: [],
      availableCities: [],
    }
  },
  created() {
    this.userCurrentInformation()
  },
  methods: {
    userCurrentInformation() {
      const userId = this.$route.params.id
      this.$axios.get(API_ADDRESS.moshaver.edit(userId))
        .then((resp) => {
          this.user = new User(resp.data.data)
          this.major = this.user.major.title
          this.gender = this.user.gender.title
          this.province = this.user.province.title
          this.city = this.user.city.title
          this.getUserFormData()
        })
        .catch(err => {
          console.log(err)
        })
    },
    getUserFormData() {
      this.$axios.get(API_ADDRESS.user.formData)
        .then((resp) => {
          this.genders = resp.data.data.genders
          this.majors = resp.data.data.majors
          this.provinces = resp.data.data.provinces
          this.cities = resp.data.data.cities
          this.availableCities = this.cities.filter(city =>
            city.province.id === this.user.province.id
          )
        })
    },
    changeProvince() {
      const province = this.provinces.filter(item => item.title === this.province)
      this.user.province = province[0]
      this.availableCities = this.cities.filter(city =>
        city.province.id === this.user.province.id
      )
    },
    changeGender() {
      const gender = this.genders.filter(item => item.title === this.gender)
      this.user.gender = gender[0]
    },
    changeMajor() {
      const major = this.majors.filter(item => item.title === this.major)
      this.user.major = major[0]
    },
    changeCity() {
      const city = this.cities.filter(item => item.title === this.city)
      this.user.city = city[0]
    },
    edit() {
      this.loading = true
      this.$axios.put(API_ADDRESS.moshaver.edit(this.$route.params.id),
        {
          firstName: this.user.first_name,
          lastName: this.user.last_name,
          phone: this.user.phone,
          address: this.user.address,
          nationalCode: this.user.nationalCode,
          major_id: this.user.major.id,
          gender_id: this.user.gender.id,
          shahr_id: this.user.city.id,
        })
        .then(resp => {
          this.loading = false
          this.user = new User(resp.data)
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style scoped>

</style>
