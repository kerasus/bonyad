import {Model} from 'js-abstract-model'
import Assistant from '@/assets/assistant'
import API_ADDRESS from '@/assets/Addresses'

class User extends Model {
  constructor(data) {
    super(data, [
      {
        key: 'baseRoute',
        default: API_ADDRESS.user.base
      },
      {key: 'id'},
      {key: 'first_name'},
      {key: 'last_name'},
      {key: 'full_name'},
      {key: 'mobile'},
      {key: 'fatherMobile'},
      {key: 'motherMobile'},
      {key: 'phone'},
      {key: 'city'},
      {key: 'province'},
      {key: 'ostan_id'},
      {key: 'shahr_id'},
      {key: 'address'},
      {key: 'nationalCode'},
      {key: 'postal_code'},
      {key: 'email'},
      {key: 'school'},
      {key: 'user_exam_status'},
      {key: 'photo'},
      {key: 'token'},
      {key: 'has_admin_permission'},
      {key: 'has_educational_permission'},
      {key: 'student_register_limit'},
      {key: 'student_register_number'},

      {key: 'mobile_verified_at'},
      {key: 'wallet_balance'},
      {key: 'permissions'},
      {key: 'profile_completion'},

      {
        key: 'gender',
        default: {id: null}
      },
      {
        key: 'major',
        default: {id: null}
      },
      {
        key: 'grade',
        default: {id: null}
      },
      {
        key: 'updateType',
        default: 'profile'
      }

    ])

    if (!this.full_name) {
      this.full_name = ''
      if (this.first_name) {
        this.full_name += this.first_name + ' '
      }
      if (this.last_name) {
        this.full_name += this.last_name
      }
    }
  }

  hasPermission(permission) {
    return this.permissions.includes(permission)
  }

  getCompletionInfoKeys() {
    return [
      'first_name',
      'last_name',
      'major',
      'city',
      // 'school',
      'mobile_verified_at',
      'grade'
    ]
  }

  checkInformationCompletionKey(key) {
    return (
      (this[key] !== null && typeof this[key] === 'object' && typeof this[key].id !== 'undefined' && this[key].id !== null) ||
      (this[key] && typeof this[key].id === 'undefined')
    )
  }

  percentageOfInformationCompletion() {
    let percentage = 0,
      completionInfoKeys = this.getCompletionInfoKeys(),
      percentageStep = (100 / completionInfoKeys.length)

    completionInfoKeys.forEach(item => {
      if (this.checkInformationCompletionKey(item)) {
        percentage += percentageStep
      }
    })

    if (percentage > 100) {
      percentage = 100
    }

    return percentage
  }

  needToCompleteInfo() {
    let completionInfoKeys = this.getCompletionInfoKeys()
    let status = false
    try {
      completionInfoKeys.forEach(item => {
        if (!this.checkInformationCompletionKey(item)) {
          throw 'needToCompleteInfo: ' + item
        }
      })
    } catch (e) {

      status = true
    }

    return status
  }

  getUserData() {
    let that = this
    return new Promise(function (resolve, reject) {
      that.show(null, API_ADDRESS.user.show_user)
        .then((response) => {
          that = new User(response.data.data)
          resolve(that)
        })
        .catch((error) => {
          Assistant.reportErrors({location: 'models/User.js -> getUserData()'})
          reject(error)
        })
    })
  }
}

export {User}
