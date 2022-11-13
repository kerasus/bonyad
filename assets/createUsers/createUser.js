import Student from './strategies/Student'
import Network_Subnetwork_Moshaver from "./strategies/Network_Subnetwork_Moshaver";
import ReadExcel from "assets/importExcel/readExcel";

class CreateUser {
  constructor(userId, axios, type, notify) {
    this.userId = userId
    this.axios = axios
    this.type = type
    this.notify = notify
    this.importLoading = false
    this.limit_error_row = 0
    this.loading = false
    this.strategies = [
      Student,
      Network_Subnetwork_Moshaver
    ]
    this.strategyInstance = null
    this.setStrategiesInstance()
  }

  setStrategiesInstance() {
    this.strategies.forEach(strategy => {
      const instance = new strategy(this.userId, this.axios, this.type, this.notify)
      if (instance.isSuitable()) {
        this.strategyInstance = instance
      }
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
