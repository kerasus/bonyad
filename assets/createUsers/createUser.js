import Student from './strategies/Student'
import Network_Subnetwork_Moshaver from "./strategies/Network_Subnetwork_Moshaver";
import ReadExcel from "assets/importExcel/readExcel";

class CreateUser {
  constructor(userId, axios, keys) {
    this.userId = userId
    this.axios = axios
    this.keys = keys
    this.importLoading = false
    this.limit_error_row = 0
    this.loading = false
    this.usage_limit = 0
    this.usage_number = 0
    this.strategies = [
      Student,
      Network_Subnetwork_Moshaver
    ]
    this.strategyInstance = null
    this.getRegisterLimit()
    this.setStrategiesInstance()
  }

  setStrategiesInstance() {
    this.strategies.forEach(strategy => {
      const instance = new strategy(this.userId, this.axios, this.keys)
      if (instance.isSuitable()) {
        this.strategyInstance = instance
      }
    })
  }

  getRegisterLimit() {
    let that = this
    this.axios.get('/alaa/api/v2/admin/bonyadEhsan/consultant/' + this.userId)
      .then(resp => {
        that.usage_limit = resp.data.data.usage_limit
        that.usage_number = resp.data.data.usage_number
      })
  }

  async addExcel(event) {
    if (event) {
      this.importLoading = true
      const keys = this.strategyInstance.keys
      const importExcel = new ReadExcel(event, keys)
      await importExcel.getData()
      this.limit_error_row = importExcel.limit_error_row
      if (!this.limit_error_row) {
        this.strategyInstance.initUserFormArray(true, importExcel.finalData.length, importExcel.finalData)
      }
      this.importLoading = false
    }
  }

  async onPaste(event) {
    const keys = this.strategyInstance.keys
    const importExcel = new ReadExcel(event, keys)
    await importExcel.getData()
    this.limit_error_row = importExcel.limit_error_row
    if (!this.limit_error_row) {
      this.strategyInstance.initUserFormArray(true, importExcel.finalData.length, importExcel.finalData)
    }
  }


}

export default CreateUser
