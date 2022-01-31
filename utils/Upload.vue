<template>
  <div class="dropbox">
    <input type="file" :multiple="multiple" :name="uploadFieldName" :disabled="isSaving" @change="filesChange($event)"
           accept="image/*" class="input-file">
    <p v-if="isInitial">
      فایل خود را در اینجا قرار دهید
      <br>
      و یا برای انتخاب فایل اینجا کلیک کنید

    </p>
    <p v-if="isSaving">
      در حال بارگزاری {{ fileCount }} فایل...
    </p>
  </div>
</template>

<script>
// import { upload } from './file-upload.service';

const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;

export default {
  name: "Upload",
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
      uploadFieldName: 'photos'
    }
  },
  computed: {
    isInitial() {
      return this.currentStatus === STATUS_INITIAL;
    },
    isSaving() {
      return this.currentStatus === STATUS_SAVING;
    },
    isSuccess() {
      return this.currentStatus === STATUS_SUCCESS;
    },
    isFailed() {
      return this.currentStatus === STATUS_FAILED;
    }
  },
  methods: {
    reset() {
      // reset form to initial state
      this.currentStatus = STATUS_INITIAL;
      this.uploadedFiles = [];
      this.uploadError = null;
    },
    save(formData) {
      // upload data to the server
      this.currentStatus = STATUS_SAVING;

      this.upload(formData)
        .then(x => {
          this.uploadedFiles = [].concat(x);
          this.currentStatus = STATUS_SUCCESS;
        })
        .catch(err => {
          this.uploadError = err.response;
          this.currentStatus = STATUS_FAILED;
        });
    },
    filesChange($event) {
      let fileList = $event.target.files;
      this.fileCount = $event.target.files.length;
      this.$emit('filesChange', fileList);

      // // handle file changes
      // const formData = new FormData();
      //
      // if (!fileList.length) return;
      //
      // // append the files to FormData
      // Array
      //     .from(Array(fileList.length).keys())
      //     .map(x => {
      //         formData.append(fieldName, fileList[x], fileList[x].name);
      //     });
      //
      // // save it
      // this.save(formData);
    },
    upload(formData) {
      const photos = formData.getAll('photos');
      const promises = photos.map((x) => getImage(x)
        .then(img => ({
          id: img,
          originalName: x.name,
          fileName: x.name,
          url: img
        })));
      return Promise.all(promises);
    },
    getImage(file) {
      return new Promise((resolve, reject) => {
        const fReader = new FileReader();
        const img = document.createElement('img');

        fReader.onload = () => {
          img.src = fReader.result;
          resolve(this.getBase64Image(img));
        }

        fReader.readAsDataURL(file);
      })
    },
    getBase64Image(img) {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const dataURL = canvas.toDataURL('image/png');

      return dataURL;
    }
  },
  mounted() {
    this.reset();
  },
}
</script>

<style scoped>
.dropbox {
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -10px;
  background: lightcyan;
  color: dimgray;
  padding: 10px 10px;
  min-height: 200px; /* minimum height */
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 200px;
  position: absolute;
  cursor: pointer;
}

.dropbox:hover {
  background: lightblue; /* when mouse over to the drop zone, change color */
}

.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 50px 0;
}
</style>
