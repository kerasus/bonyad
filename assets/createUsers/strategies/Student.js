import API_ADDRESS from "assets/Addresses";

class Student {
  constructor(userId, axios, keys, notify) {
    this.userId = userId
    this.axios = axios
    this.keys = keys
    this.notify = notify
    this.genders = []
    this.majors = []
    this.provinces = []
    this.cities = []
    this.userForm = []
    this.loading = false
    this.valid = false
    this.studentKeys = ['firstName', 'lastName', 'gender', 'major', 'mobile', 'address', 'phone', 'fatherMobile', 'motherMobile', 'nationalCode', 'province', 'city']
    this.getUserFormData()
    this.initUserFormArray(true, 20)
  }

  isSuitable() {
    return JSON.stringify(this.studentKeys) === JSON.stringify(this.keys);
  }

  initUserFormArray(clean = true, amount = 20, data) {
    if (clean) {
      this.userForm = []
    }
    for (let i = 0; i < amount; i++) {
      this.userForm.push({
        firstName: data && data[i] ? data[i][0] || data[i]['نام'] : '',
        address: data && data[i] ? data[i][5] || data[i]['آدرس'] : '',
        address_error: false,
        phone: data && data[i] ? data[i][6] || data[i]['تلفن'] : '',
        phone_error: false,
        father_mobile: data && data[i] ? data[i][7] || data[i]['موبايل پدر'] : '',
        father_mobile_error: false,
        mother_mobile: data && data[i] ? data[i][8] || data[i]['موبايل مادر'] : '',
        mother_mobile_error: false,
        firstName_error: false,
        lastName: data && data[i] ? data[i][1] || data[i]['نام خانوادگي'] : '',
        lastName_error: false,
        gender_id: '',
        gender_id_error: false,
        major_id: data && data[i] ? data[i][5] || data[i]['نام'] : '',
        major_id_error: false,
        mobile: data && data[i] ? data[i][4] || data[i]['موبايل'] : '',
        mobile_error: false,
        nationalCode: data && data[i] ? data[i][10] || data[i]['كد ملي'] : '',
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
        let gender_id = this.genders.find(gender => gender.title === data[i][2])
        if (!gender_id) {
          gender_id = this.genders.find(gender => gender.title === data[i]['جنسيت'])
        }
        let major_id = this.majors.find(major => major.title === data[i][3])
        if (!major_id) {
          major_id = this.majors.find(major => major.title === data[i]['رشته'])
        }
        let province = this.provinces.find(province => province.title === data[i]['استان'])
        if (!province) {
          province = this.provinces.find(province => province.title === data[i][11])
        }
        if (!province) {
          province = this.provinces.find(province => province.title === data[i][10])
        }
        let shahr_id = this.cities.find(city => city.title + '\r' === data[i][11])
        if (!shahr_id) {
          shahr_id = this.cities.find(city => city.title === data[i][12])
        }
        if (!shahr_id) {
          shahr_id = this.cities.find(city => city.title === data[i]['شهر'])
        }
        this.userForm[i].gender_id = gender_id ? gender_id.id : 0
        this.userForm[i].major_id = major_id ? major_id.id : 0
        this.userForm[i].province = province ? province.id : 0
        this.userForm[i].shahr_id = shahr_id ? shahr_id.id : 0
      }
    }
  }

  isUserInfoComplete(user) {
    return !!(user.firstName || user.lastName || user.address ||
      user.phone || user.father_mobile || user.mother_mobile || user.gender_id
      || user.major_id || user.mobile || user.nationalCode ||
      user.province || user.shahr_id);
  }

  getUserFormData() {
    this.loading = true
    this.axios.get(API_ADDRESS.user.formData)
      .then((resp) => {
        this.loading = false
        this.genders = resp.data.data.genders
        this.majors = resp.data.data.majors
        this.provinces = resp.data.data.provinces
        this.cities = resp.data.data.cities
      })
  }

  save() {
    const availableUsers = this.userForm.filter(user => user.mobile)
    const sendData = {
      users: availableUsers.map(user => {
        return {
          firstName: user.firstName,
          address: user.address,
          phone: user.phone,
          father_mobile: user.father_mobile,
          mother_mobile: user.mother_mobile,
          lastName: user.lastName,
          mobile: user.mobile,
          nationalCode: user.nationalCode,
          gender_id: user.gender_id,
          major_id: user.major_id,
          shahr_id: user.shahr_id
        }
      }),
      type: 'student'
    }
    this.userForm.forEach(user => {
      let that = this
      if (!user.hasBeenSaved && that.isUserInfoComplete(user)) {
        user.loading = true
        this.valid = true
      }
    })
    if (this.valid) {
      this.loading = true
      this.axios.post(API_ADDRESS.user.bulkCreate, {
        users: sendData.users,
        type: sendData.type
      }).then((response) => {
        this.userForm.forEach(user => {
          user.hasBeenSaved = true
          user.editable = false
          Object.keys(user).forEach(key => {
            if (key.includes('_error')) {
              user[key] = false
            }
          })
        })
        this.loading = false
        setTimeout(() => {
          let that = this
          this.axios.get('/alaa/api/v2/admin/bonyadEhsan/consultant/' + this.userId)
            .then(resp => {
              that.usage_limit = resp.data.data.usage_limit
              that.usage_number = resp.data.data.usage_number
            })
        }, 500)
        this.notify({
          type: 'success',
          text: response.data.data?.message ? response.data.data.message : 'کاربران با موفقیت افزوده شدند',
        })
      }).catch(err => {
        this.userForm.forEach((user, userIndex) => {
          user.loading = false
          Object.keys(user).forEach(userKey => {
            if (userKey.includes('_error')) {
              user[userKey] = false
            }
          })

          function getUserIndexAndInputNameFromKey(errorKey) {
            const dataArray = errorKey.split('.')
            if (dataArray.length < 3 || dataArray[0] !== 'users') {
              return null
            }

            return {
              index: dataArray[1],
              key: dataArray[2]
            }
          }

          Object.keys(err.response.data.errors).forEach(errorKey => {
            const errorData = getUserIndexAndInputNameFromKey(errorKey)
            if (errorData && parseInt(errorData.index) === parseInt(userIndex)) {
              const error = err.response.data.errors[errorKey][0].split('.')
              user[errorData.key + '_error'] = error[2]
            }
          })
        })
        this.loading = false
        setTimeout(() => {
          this.$refs.form.validate()
        }, 500)
      })
    }
  }

}

export default Student
