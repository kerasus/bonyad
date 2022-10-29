import ClipBoard from './strategies/ClipBoard'
import ImportExcel from './strategies/ImportExcel'

class ReadExcel {
  constructor(data, keys) {
    this.data = data
    this.keys = keys
    this.finalData = []
    this.limit_error_row = false
    this.strategies = [
      ClipBoard,
      ImportExcel
    ]
    this.strategyInstance = null
    this.setStrategiesInstance()
  }

  setStrategiesInstance() {
    this.strategies.forEach(strategy => {
      const instance = new strategy(this.data, this.keys)
      if (instance.isSuitable()) {
        this.strategyInstance = instance
      }
    })
  }

  async getData() {
    this.finalData = await this.strategyInstance.getData()
    if (this.finalData.length > 200) {
      this.limit_error_row = true
    }
  }
}

export default ReadExcel
