import API_ADDRESS from "assets/Addresses";

class Network_Subnetwork_Moshaver {
  constructor(userId, axios, keys) {
    this.userId = userId
    this.axios = axios
    this.keys = keys
    this.genders = []
    this.majors = []
    this.provinces = []
    this.cities = []
    this.userForm = []
    this.loading = false
    this.valid = false
    this.studentKeys = ['firstName', 'lastName', 'gender', 'mobile', 'nationalCode', 'province', 'city', 'registerLimit']
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
        firstNameMessage: '',
        firstName_error: false,
        student_register_limit: data && data[i] ? Number(data[i][7]) || data[i]['محدودیت ثبت نام'] : '',
        student_register_limitMessage: '',
        student_register_limit_error: '',
        lastName: data && data[i] ? data[i][1] || data[i]['نام خانوادگي'] : '',
        lastName_error: false,
        gender_id: '',
        gender_id_error: false,
        mobile: data && data[i] ? data[i][3] || data[i]['موبايل'] : '',
        mobile_error: false,
        nationalCode: data && data[i] ? data[i][4] || data[i]['كد ملي'] : '',
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
        const gender_id = this.genders.find(gender => gender.title === data[i][2] || data[i]['جنسيت'])
        const province = this.provinces.find(province => province.title === data[i][5] || data[i]['استان'])
        let shahr_id = this.cities.find(city => city.title === data[i][6] || data[i]['شهر'])
        this.userForm[i].gender_id = gender_id ? gender_id.id : 0
        this.userForm[i].province = province ? province.id : 0
        this.userForm[i].shahr_id = shahr_id ? shahr_id.id : 0
      }
    }
  }

  isUserInfoComplete(user) {
    return !!(user.firstName || user.student_register_limit || user.lastName || user.gender_id
      || user.mobile || user.nationalCode ||
      user.province || user.shahr_id);
  }

  save() {
    const availableUsers = this.userForm.filter(user => user.mobile)
    const sendData = {
      users: availableUsers.map(user => {
        return {
          firstName: user.firstName,
          lastName: user.lastName,
          student_register_limit: user.student_register_limit,
          mobile: user.mobile,
          nationalCode: user.nationalCode,
          gender_id: user.gender_id,
          shahr_id: user.shahr_id
        }
      }),
      type: 'network'
    }
    this.userForm.forEach(user => {
      let that = this
      if (!user.hasBeenSaved && that.isUserInfoComplete(user)) {
        user.loading = true
        this.valid = true
      } else if (user.firstName || user.lastName || user.student_register_limit || user.gender_id
        || user.mobile || user.nationalCode || user.shahr_id) {
        this.$notify({
          type: 'error',
          duration: 10000,
          title: 'توجه',
          text: 'پر کردن تمامی فیلدهای یک سطر الزامی ست'
        })
      }
    })
    if (this.valid) {
      this.loading = true
      this.axios.post(API_ADDRESS.subnetwork.bulkCreate, {
        users: sendData.users,
        type: sendData.type
      }).then(r => {
        console.log(r)
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
          console.log('vvv')
        }, 500)
      })
    }
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
      .catch((err) => {
        console.log(err)
      })
  }

}

export default Network_Subnetwork_Moshaver
