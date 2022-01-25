import {Collection, Model} from 'js-abstract-model'
import Assistant from '@/assets/assistant'
import API_ADDRESS from '@/assets/Addresses'
import {Comment} from "~/models/Comment";

class Order extends Model {
    constructor(data) {
        super(data, [
            {
                key: 'baseRoute',
                default: API_ADDRESS.user.base
            },
            { key: 'id' },
            { key: 'orderProducts' },
            { key: 'major' },
            { key: 'city' },
            { key: 'user' },
            { key: 'user_mobile' },
            {
              key: 'user_mobile_error',
              default: () => true
            },
            {
              key: 'user_firstName_error',
              default: () => true
            },
            { key: 'insertor' },
            { key: 'insertor_mobile' },
            { key: 'completed_at' },
            { key: 'user_first_name' },
            { key: 'user_last_name' },
            { key: 'user_id' },
            { key: 'user_national_code' },
            { key: 'user_major_id' },
            { key: 'user_gender_id' },
            { key: 'user_shahr_id' },
            {
              key: 'user_lastName_error',
              default: () => true
            },
            {
              key: 'user_nationalCode_error',
              default: () => true
            },
            {
              key: 'user_major_id_error',
              default: () => true
            },
            {
              key: 'user_gender_id_error',
              default: () => true
            },
            {
              key: 'user_shahr_id_error',
              default: () => true
            },
            { key: 'has_educational_permission' },

            { key: 'mobile_verified_at' },
            { key: 'wallet_balance' },
            { key: 'profile_completion' },

            {
                key: 'gender',
                default:{ id: null}
            },
            {
                key: 'major',
                default:{ id: null}
            },
            {
                key: 'grade',
                default:{ id: null}
            },
            {
                key: 'updateType',
                default: 'profile'
            }

        ])

        if (!this.full_name) {
            this.full_name = this.first_name + ' ' + this.last_name
        }
    }
}


class OrderList extends Collection {
  model () {
    return Order
  }
}

export { Order, OrderList }
