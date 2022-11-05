import API_ADDRESS from "assets/Addresses";
import {User} from "@/models/User";

class Edit {
  constructor(userId, axios, notify) {
    this.userId = userId
    this.axios = axios
    this.notify=notify
    this.loading = false
    this.loadingLimit = false
    this.loadingEdit = false
    this.user = {}
    this.genders = []
    this.majors = []
    this.provinces = []
    this.cities = []
    this.availableCities = []
    this.gender = []
    this.major = []
    this.province = []
    this.city = []
    this.usage_number = 0
    this.usage_limit = 0
    this.strategyInstance = null
    this.userCurrentInformation()
  }

  userCurrentInformation() {
    this.loading = true
    this.axios.get(API_ADDRESS.moshaver.edit(this.userId))
      .then((resp) => {
        this.user = new User(resp.data.data)
        this.gender = this.user.gender.title
        this.major = this.user.major.title
        this.province = this.user.province.title
        this.city = this.user.city.title
        this.usage_limit = this.user.student_register_limit
        this.usage_number = this.user.student_register_number
        this.getUserFormData()
      })
      .catch(err => {
        this.loading = false
        console.log(err)
      })
  }

  getUserFormData() {
    this.axios.get(API_ADDRESS.user.formData)
      .then((resp) => {
        this.genders = resp.data.data.genders
        this.majors = resp.data.data.majors
        this.provinces = resp.data.data.provinces
        this.cities = resp.data.data.cities
        this.availableCities = this.cities.filter(city =>
          city.province.id === this.user.province.id
        )
        this.loading = false
      })
  }

  changeProvince() {
    const province = this.provinces.filter(item => item.title === this.province)
    this.user.province = province[0]
    this.availableCities = this.cities.filter(city =>
      city.province.id === this.user.province.id
    )
  }

  changeGender() {
    const gender = this.genders.filter(item => item.title === this.gender)
    this.user.gender = gender[0]
  }

  changeMajor() {
    const major = this.majors.filter(item => item.title === this.major)
    this.user.major = major[0]
  }

  changeCity() {
    const city = this.cities.filter(item => item.title === this.city)
    this.user.city = city[0]
  }

  editLimit() {
    this.loadingLimit = true
    this.axios.post(API_ADDRESS.editLimit.base, {
      user_id: this.userId,
      student_register_limit: this.usage_limit
    }).then(resp => {
      this.loadingLimit = false
      this.notify({
        type: 'success',
        text: resp.data.data?.message ? resp.data.data.message : 'ظرفیت ثبت نام ویرایش شد.',
      })
    }).catch(err => {
      this.loadingLimit = false
      console.log(err)
    })
  }

  edit() {
    this.loadingEdit = true
    this.axios.put(API_ADDRESS.moshaver.edit(this.userId),
      {
        firstName: this.user.first_name,
        lastName: this.user.last_name,
        phone: this.user.phone,
        address: this.user.address,
        mobile: this.user.mobile,
        motherMobile: this.user.motherMobile,
        fatherMobile: this.user.fatherMobile,
        nationalCode: this.user.nationalCode,
        major_id: this.user.major.id,
        gender_id: this.user.gender.id,
        shahr_id: this.user.city.id,
      })
      .then(resp => {
        this.loadingEdit = false
        this.user = new User(resp.data)
        this.notify({
          type: 'success',
          text: resp.data.data?.message ? resp.data.data.message : 'اطلاعات با موفقیت ویرایش شد.',
        })
      })
      .catch(() => {
        this.loadingEdit = false
      })
  }

}

export default Edit
