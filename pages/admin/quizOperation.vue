<template>
  <v-container>
    <v-row class="d-flex justify-center align-center">
      <v-col cols="12" class="d-flex justify-center">
        <h2 class="mb-2">
          آپلود فایل آزمون و مشاهده نتایج
        </h2>
      </v-col>
      <v-col sm="12"
        lg="9">
        <v-file-input
          v-model="files"
          chips
          dense
          prepend-icon="mdi-paperclip"
          outlined
          :loading="loading"
          label="آپلود فایل آزمون"
          @change="uploadFile"
        >
        </v-file-input>
      </v-col>
    </v-row>
    <v-row class="d-flex justify-center align-center">
      <v-col cols="12"
        lg="4">

        <v-card elevation="3" v-if="paperSheetsHistory.list.length > 0">
          <v-card-title class="white--text orange darken-3">
            لیست فایل های آپلود شده

            <v-spacer></v-spacer>

          </v-card-title>
          <v-virtual-scroll
            :bench="2"
            :items="paperSheetsHistory.list"
            height="500"
            item-height="64"
          >
            <template v-slot:default="{ item }">
              <v-list-item dense :key="item">

                <v-list-item-content>
                  <v-list-item-title>
                    نام فایل : {{ item.original_file_name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>وضعیت : {{ item.status_info.label }}</v-list-item-subtitle>
                  <v-list-item-subtitle>تاریخ آپلود : {{ item.shamsiDate('created_at').dateTime }}</v-list-item-subtitle>
                  <v-list-item-subtitle v-if="item.correction_count">تعداد تصحیح شده : {{ item.correction_count }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn
                    fab
                    x-small
                    dense
                    color="orange lighten-3"
                    class="dark--text"
                    @click="downloadFile(item.zip_url)"
                  >
                    <v-icon small>
                      mdi-download
                    </v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
              <v-divider></v-divider>
            </template>
          </v-virtual-scroll>
        </v-card>
        <v-card v-else elevation="3" class="orange darken-3">
          <v-card-text class="text-h5 font-weight-bold white--text">
            هیچ فایلی آپلود نشده است
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12"
        lg="5">

        <v-card elevation="3" v-if="examReports.length > 0">
          <v-card-title class="white--text light-blue darken-2">
            لیست آزمون ها و نتایج

            <v-spacer></v-spacer>

          </v-card-title>
          <v-virtual-scroll
            :bench="2"
            :items="examReports"
            height="500"
            item-height="60"
          >
            <template v-slot:default="{ item }">
              <v-list-item dense :key="item">
                <v-list-item-content>
                  <v-list-item-title>
                    نام آزمون : {{ item.title }}
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn
                    fab
                    x-small
                    dense
                    color="light-blue lighten-3"
                    class="white--text"
                    @click="downloadFile(item.link)"
                  >
                    <v-icon small>
                      mdi-download
                    </v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
              <v-divider></v-divider>
            </template>
          </v-virtual-scroll>
        </v-card>
        <v-card v-else elevation="3" class="light-blue darken-2">
          <v-card-text class="text-h5 font-weight-bold white--text">
            هیچ آزمونی وجود ندارد
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import API_ADDRESS from "assets/Addresses";
import { PaperSheetList } from "@/models/PaperSheet";

export default {
  name: 'quizOperation',
  data () {
    return {
      paperSheetsHistory: new PaperSheetList(),
      examReports: [],
      files: [],
      loading: false
    }
  },
  mounted () {
    this.getPaperSheetsHistory()
    this.getExamReport()
  },
  methods: {
    getPaperSheetsHistory () {
      this.$axios.get(API_ADDRESS.exam.getPaperSheetsHistory)
      .then(response => {
        this.paperSheetsHistory = new PaperSheetList(response.data)
      })
    },
    getExamReport () {
      this.$axios.get(API_ADDRESS.exam.bonyadExamReport)
      .then(response => {
        this.examReports = response.data
      })
    },
    uploadFile (file) {
      this.loading = true
      this.$axios.post(API_ADDRESS.exam.presignedUrlPaperSheet,{
            key: file.name
          })
            .then(response => {
              const url = response.data.url
              this.$axios({
                method: 'put',
                headers: {
                  'Content-Type': file.type
                },
                url,
                body: file,
                data: file,
                transformRequest: (data, headers) => {
                  if (headers.common && headers.common.Authorization) {
                    delete headers.common.Authorization
                  }
                  if (headers.Authorization) {
                    delete headers.Authorization
                  }

                  return data
                }
              })
                .then(() => {
                  this.correctPaperSheet(response.data.original_file_name, response.data.unique_file_name)
                })
                .catch((err) => {
                  this.loading = false
                  console.error(err)
                })
            }).catch((err) => {
              this.files = []
              this.loading = false
              console.error(err)
            })
    },
    correctPaperSheet (originalFileName, uniqueFileName) {
      this.$axios.post(API_ADDRESS.exam.correctPaperSheet, {
        original_file_name: originalFileName,
        unique_file_name: uniqueFileName
      })
      .then(() => {
        this.loading = false
        this.files = []
        this.getPaperSheetsHistory()

      })
      .catch(() => {
        this.files = []
        this.loading = false
      })
    },
    downloadFile (url) {
      window.open(url, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
