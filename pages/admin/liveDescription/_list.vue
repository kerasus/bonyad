<template>
  <div>
    <div class="header">
      <h2 class="mb-2">
        لیست پیام های مشاور
      </h2>
    </div>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="5"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      class="elevation-1"
    >
      <template v-slot:item.has_pinned="{ item }">
        <v-btn v-if="item.has_pinned"
               color="grey"
               @click="unpin(item.id)"
        >
          از سنجاق برداشتن
        </v-btn>
        <v-btn v-else
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
            ویرایش پیام
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
      sortBy: 'has_pinned',
      sortDesc: true,
      headers: [
        {
          text: 'توضیحات',
          align: 'center',
          value: 'description'
        },
        {text: 'عنوان', value: 'title'},
        {text: 'پین', value: 'has_pinned'},
        {text: 'ویرایش', value: 'edit',},
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
      this.$axios.get(API_ADDRESS.liveDescription.list, {

      })
        .then(resp => {
          this.items = resp.data.data
          console.log(this.items)
        })
        .catch(err => {
          console.log(err)
        })
    },
    pin(messageId) {
      this.$axios.get(API_ADDRESS.liveDescription.pin(messageId))
        .then(() => {
          this.getMessagesList()
        })
        .catch(err => {
          console.log(err)
        })
    },
    unpin(messageId) {
      this.$axios.get(API_ADDRESS.liveDescription.unpin(messageId))
        .then(() => {
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
