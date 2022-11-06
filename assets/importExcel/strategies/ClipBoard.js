class ClipBoard {
  constructor(data, keys) {
    this.data = data
    this.keys = keys
    this.header = ['نام', 'نام خانوادگي', 'جنسيت', 'رشته', 'موبايل', 'كد ملي', 'آدرس', 'تلفن', 'موبایل پدر', 'موبایل مادر', 'استان', 'province', 'شهر', 'محدودیت ثبت نام']
  }

  isSuitable() {
    return this.data.type === 'paste';
  }

  getData() {
    this.data.preventDefault();
    let cb;
    let clipText = '';
    if (window.clipboardData && window.clipboardData.getData) {
      cb = window.clipboardData;
      clipText = cb.getData('Text');
    } else if (this.data.clipboardData && this.data.clipboardData.getData) {
      cb = this.data.clipboardData;
      clipText = cb.getData('text/plain');
    } else {
      cb = this.data.originalEvent.clipboardData;
      clipText = cb.getData('text/plain');
    }
    let clipRows = clipText.split('\n')
    for (let i = 0; i < clipRows.length; i++) {
      clipRows[i] = clipRows[i].split('\t');
    }
    let jsonObj = [];
    for (let i = 0; i < clipRows.length - 1; i++) {
      let item = [];
      for (let j = 0; j < clipRows[i].length; j++) {
        console.log(clipRows[i][j].length, clipRows[i][j])
        if (clipRows[i][j] !== '\r' && clipRows[i][j].length !== 0 && clipRows[i][j] !== '#N/A') {
          item[j] = clipRows[i][j];
        }
      }
      if (this.header.indexOf(item[0]) !== -1 || item.length === 0) {
        continue
      }
      jsonObj.push(item);
    }

    if (jsonObj.length > 0) {
      return jsonObj
    }
  }
}

export default ClipBoard
