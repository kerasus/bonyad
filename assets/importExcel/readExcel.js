import ClipBoard from './strategies/ClipBoard'
import ImportExcel from './strategies/importExcel'

class ReadExcel {
  constructor(data, keys) {
    this.data = data
    this.keys = keys
    this.strategies = [
      ClipBoard,
      ImportExcel
    ]
    this.strategyInstance = null
    this.setStrategiesInstance()
  }

  setStrategiesInstance() {
    // this.strategies.forEach(strategy => {
    //   const instance = new strategy(this.data, this.keys)
    //   if (instance.isSuitable()) {
    //     this.strategyInstance = instance
    //   }
    // })
  }

  getData() {
    return ClipBoard.getData()
  }
}


// const importExcel = new ReadExcel(data, keys) => keys : ['qwe', 'wrew', ...]
// importExcel.getData()
export default ReadExcel
