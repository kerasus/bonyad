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
        :items="gendersTitle"
        label="جنسیت"
        @change="changeGender"
      ></v-select>
    </div>
    <div class="col-md-3">
      <v-select
        v-model="major"
        :items="majorsTitle"
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
        v-model="user.fatherMobile"
        label="موبایل پدر"
      />
    </div>
    <div class="col-md-3">
      <v-text-field
        v-model="user.motherMobile"
        label="موبایل مادر"
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
        :items="provincesTitle"
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
    <v-btn class="mx-5"
           :loading="loading"
           large
           rounded
           elevation="4"
           @click="edit"
    >ذخیره تغییرات
    </v-btn>
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
      gendersTitle: [],
      majors: [],
      majorsTitle: [],
      provinces: [],
      provincesTitle: [],
      cities: [],
      citiesTitle: [],
      availableCities: [],
    }
  },
  created() {
    this.userCurrentInformation()
  },
  methods: {
    userCurrentInformation() {
      const userId = this.$route.params.id
      this.$axios.get('alaa/api/v2/admin/bonyadEhsan/user/' + userId)
        .then((resp) => {
          // console.log(resp.data.data)
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
          for (let index = 0; index < this.genders.length; index++) {
            this.gendersTitle.push(this.genders[index].title);
          }
          this.majors = resp.data.data.majors
          for (let index = 0; index < this.majors.length; index++) {
            this.majorsTitle.push(this.majors[index].title);
          }
          this.provinces = resp.data.data.provinces
          for (let index = 0; index < this.provinces.length; index++) {
            this.provincesTitle.push(this.provinces[index].title);
          }
          this.cities = resp.data.data.cities
          for (let index = 0; index < this.cities.length; index++) {
            this.citiesTitle.push(this.cities[index].title);
          }
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
    changeMajor(){
      const major = this.majors.filter(item => item.title === this.major)
      this.user.major = major[0]
    },
    changeCity(){
      const city = this.cities.filter(item => item.title === this.city)
      this.user.city = city[0]
    },
    edit() {
      console.log(this.user.motherMobile)
      this.$axios.put(API_ADDRESS.moshaver.edit(this.$route.params.id),
        {
          firstName: this.user.first_name,
          lastName: this.user.last_name,
          phone: this.user.phone,
          address: this.user.address,
          motherMobile: this.user.motherMobile,
          fatherMobile: this.user.fatherMobile,
          nationalCode: this.user.nationalCode,
          major_id: this.user.major.id,
          gender_id: this.user.gender.id,
          shahr_id: this.user.city.id,
        })
        .then(resp => {
          console.log(resp.data)
          this.user= new User(resp.data)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped>

</style>
