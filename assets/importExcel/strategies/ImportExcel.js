import * as XLSX from "xlsx";

class ImportExcel {
  constructor(data, keys) {
    this.data = data
    this.keys = keys
    this.finalData=null
  }

  isSuitable() {
    return this.data.type !== 'paste'
  }

  async getData() {
    this.file = this.data
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
     return new Promise((resolve, reject) => {
       let arrayList = null
       fileReader.onload = (e) => {
         this.arrayBuffer = fileReader.result;
         const data = new Uint8Array(this.arrayBuffer);
         const arr = [];
         for (let i = 0; i !== data.length; ++i)
           arr[i] = String.fromCharCode(data[i]);
         const bstr = arr.join("");
         const workbook = XLSX.read(bstr, {type: "binary"});
         const first_sheet_name = workbook.SheetNames[0];
         const worksheet = workbook.Sheets[first_sheet_name];
         arrayList = XLSX.utils.sheet_to_json(worksheet, {raw: true})
         resolve(arrayList)
       }
     })

  }
}

export default ImportExcel
