const CreateUsersMixin = {
  data() {
    return {
      jsonObj: [],
      header: ['نام', 'نام خانوادگی', 'جنسیت', 'رشته', 'موبایل', 'کد ملی', 'آدرس', 'تلفن', 'موبایل پدر', 'موبایل مادر', 'استان', 'province', 'شهر', 'محدودیت ثبت نام']
    }
  }, methods: {
    pasteData(e) {
      e.preventDefault();
      let cb;
      let clipText = '';
      if (window.clipboardData && window.clipboardData.getData) {
        cb = window.clipboardData;
        clipText = cb.getData('Text');
      } else if (e.clipboardData && e.clipboardData.getData) {
        cb = e.clipboardData;
        clipText = cb.getData('text/plain');
      } else {
        cb = e.originalEvent.clipboardData;
        clipText = cb.getData('text/plain');
      }
      let clipRows = clipText.split('\n');
      for (let i = 0; i < clipRows.length; i++) {
        clipRows[i] = clipRows[i].split('\t');
      }
      let jsonObj = [];
      for (let i = 0; i < clipRows.length - 1; i++) {
        let item = [];
        for (let j = 0; j < clipRows[i].length; j++) {
          if (clipRows[i][j] !== '\r' && clipRows[i][j].length !== 0) {
            item[j] = clipRows[i][j];
          }
        }
        if (this.header.indexOf(item[0])!==-1){
          continue
        }
        jsonObj.push(item);
      }
      if (jsonObj.length > 0) {
        this.jsonObj = jsonObj;
        // toastr.success('اکسل کپی شد.');
        console.log(this.jsonObj);
      } else {
        // toastr.error('عبارت کپی شده صحیح نمی باشد.');
      }
    }
  }
}

export default CreateUsersMixin
