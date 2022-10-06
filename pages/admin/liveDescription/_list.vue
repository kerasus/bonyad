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
      class="elevation-1"
    >
      <template v-slot:item.has_pinned="{ item }">
        <v-btn v-if="item.has_pinned"
               color="grey"
               @click="unpin(item)"
        >
          از سنجاق برداشتن
        </v-btn>
        <v-btn v-else
               @click="pin(item)"
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
export default {
  name: "messagesList",
  data() {
    return {
      headers: [
        {
          text: 'توضیحات',
          align: 'center',
          value: 'description'
        },
        {text: 'عنوان', value: 'title'},
        {text: 'پین', value: 'has_pinned'},
        {text: 'ویرایش', value: 'edit'},
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
      this.$axios.get('alaa/api/v2/livedescription?owner=2')
        .then(resp => {
          this.items = resp.data.data
          console.log(this.items)
        })
        .catch(err => {
          console.log(err)
        })
    },
    pin(item) {
      item.has_pineed = true
      // this.getMessagesList()
    },
    unpin(item){
      item.has_pineed = false
      this.getMessagesList()
    }
  }
}
</script>

<style scoped>

</style>
