import {Collection, Model} from 'js-abstract-model'

class PaperSheet extends Model {
    constructor(data) {
        super(data, [
            { key: 'correction_count' },
            { key: 'created_at' },
            { key: 'csv_log' },
            { key: 'original_file_name' },
            { key: 'status' },
            { key: 'zip_url' }
        ],
        {
          status: {
            infoKey: 'status_info',
            enumListKey: 'statusEnums',
            enums: [
              {
                label: 'آپلود موفقیت آمیز و در انتظار تصحیح',
                value: 'correct_queue'
              },
              {
                label: 'شروع عملیات ذخیره برگه‌های تصحیح شده' ,
                value: 'start_saving_answer'
              },
              {
                label: 'پایان عملیات ذخیره برگه‌های تصحیح شده',
                value: 'finished_saving_answer'
              },
              {
                label: 'خطا در عملیات ذخیره پاسخ برگ',
                value: 'failed_saving_answer'
              },
              {
                label: 'خطا در تصحیح پاسخ برگ',
                value: 'cvs_file_not_upload'
              }
            ]
          },
        }
      )
    }
}


class PaperSheetList extends Collection {
  model () {
    return PaperSheet
  }
}

export { PaperSheet, PaperSheetList }
