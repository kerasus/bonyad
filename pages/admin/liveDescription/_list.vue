<template>
  <div>
    <v-overlay v-if="pageLoading">
      <v-progress-circular indeterminate/>
    </v-overlay>
    <div class="header">
      <h2 class="mb-2">
        لیست پیام های مشاور
      </h2>
    </div>
    <v-data-table
      :footer-props="{
        disableItemsPerPage: true,
        itemsPerPageText: 'تعداد پيام در هر صفحه',
        pageText: 'صفحه ' + options.page + ' از ' + Math.ceil(totalRows / options.itemsPerPage),
        showCurrentPage: true,
        showFirstLastPage: true
      }"
      :headers="headers"
      :items="items"
      :items-per-page="5"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      class="elevation-1"
    >
      <template v-slot:item.has_pinned="{ item }">
        <v-btn v-if="item.has_pinned"
               :loading="pinLoading"
               color="grey"
               @click="unpin(item.id)"
        >
          <v-icon color="white">
            mdi-pin
          </v-icon>
        </v-btn>
        <v-btn v-else
               :loading="pinLoading"
               @click="pin(item.id)"
        >
          سنجاق کردن
        </v-btn>
      </template>
      <template v-slot:item.edit="{ item }">
        <div class="btns">
          <v-btn
            class="ma-2"
            color="light-blue lighten-1"
            :to="getEditRoute(item.id)"
          >
            <v-icon color="white">
              mdi-pencil
            </v-icon>
          </v-btn>
        </div>
      </template>
      <template v-slot:item.delete="{ item }">
        <div class="btns">
          <v-btn
            class="ma-2"
            color="red lighten-1"
            @click="deleteMessage(item.id)"
            :loading="deleteLoading"
          >
            <v-icon color="white">
              mdi-delete
            </v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-table>
    <v-btn
      class="ma-5"
      :to="goToCreate"
    >
      ثبت پیام
    </v-btn>
  </div>
</template>

<script>
import API_ADDRESS from "assets/Addresses";

export default {
  name: "messagesList",
  data() {
    return {
      pageLoading: false,
      sortBy: 'has_pinned',
      sortDesc: true,
      pinLoading: false,
      deleteLoading: false,
      options: {
        itemsPerPage: 5,
        page: 1
      },
      totalRows: 7,
      headers: [
        {text: 'عنوان', align: 'center', value: 'title'},
        {text: 'سنجاق', value: 'has_pinned'},
        {text: 'ویرایش', value: 'edit',},
        {text: 'حذف', value: 'delete',},
      ],
      items: []
    }
  },
  created() {
    this.getMessagesList()
  },
  computed: {
    getEditRoute() {
      return (id) => {
        return {
          path: '/admin/liveDescription/edit/' + id
        }
      }
    },
    goToCreate() {
      return {
        path: '/admin/liveDescription/create'
      }
    }
  },
  methods: {
    getMessagesList() {
      this.pageLoading = true
      this.$axios.get(API_ADDRESS.liveDescription.create, {
        params: {owner: 2, length: 9999}
      })
        .then(resp => {
          this.items = resp.data.data
          this.totalRows = resp.data.meta.total
          // this.options.itemsPerPage = resp.data.meta.per_page
          this.pageLoading = false
        })
        .catch(err => {
          console.log(err)
          this.pageLoading = false
        })
    },
    deleteMessage(messageId) {
      this.deleteLoading = true
      this.$axios.delete(API_ADDRESS.liveDescription.edit(messageId))
        .then(() => {
          this.deleteLoading = false
          this.getMessagesList()
        })
        .catch(err => {
          console.log(err)
        })
    },
    pin(messageId) {
      this.pinLoading = true
      this.$axios.get(API_ADDRESS.liveDescription.pin(messageId))
        .then(() => {
          this.pinLoading = false
          this.getMessagesList()
        })
        .catch(err => {
          console.log(err)
        })
    },
    unpin(messageId) {
      this.pinLoading = true
      this.$axios.get(API_ADDRESS.liveDescription.unpin(messageId))
        .then(() => {
          this.pinLoading = false
          this.getMessagesList()
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped>

</style>
