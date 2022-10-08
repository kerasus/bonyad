<template>
  <v-container fluid>
    <v-row align="center">
      <v-col
        class="d-flex"
        cols="12"
        sm="12"
      >
        <v-text-field
          v-model="title"
          label="موضوع پیام"
          outlined
        />
      </v-col>
      <v-col
        cols="12"
        md="12"
      >
        <v-textarea
          v-model="description"
          solo
          name="input-7-4"
          label="پیام مشاور"
        ></v-textarea>
      </v-col>
      <v-col
        cols="12"
        md="12"
      >
        <v-btn
          @click="editMessage"
        >
          ثبت تغییرات
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import API_ADDRESS from "assets/Addresses";

export default {
  name: "_id.vue",
  data() {
    return {
      title: '',
      description: '',
      messageType: []
    }
  },
  created() {
    this.getMessage()
  },
  methods: {
    getMessage() {
      const userId = this.$route.params.id
      this.$axios.get(API_ADDRESS.liveDescription.edit(userId))
        .then(resp => {
          this.title = resp.data.data.title
          this.description = resp.data.data.description
          console.log(resp.data)
        })
        .catch(err => {
          console.log(err)
        })
    },
    editMessage() {
      const userId = this.$route.params.id
      this.$axios.put(API_ADDRESS.liveDescription.edit(userId), {
        title: this.title,
        description: this.description,
        entity_id: this.$route.params.id,
        entity_type: 'App\Product',
        owner:2
      })
        .then(resp => {
          console.log(resp.data)
          this.$router.push({path:'/admin/liveDescription/list'})
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
