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
          solo
          name="input-7-4"
          label="پیام مشاور"
          v-model="description"
        ></v-textarea>
      </v-col>
      <v-col
        cols="12"
        md="12"
      >
        <v-btn
          @click="createMessage"
        >
          ثبت پیام
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import API_ADDRESS from "assets/Addresses";

export default {
  name: "liveDescriptionCreate",
  data() {
    return {
      title: '',
      description: null,
    }
  },
  methods: {
    createMessage() {
      this.$axios.post(API_ADDRESS.liveDescription.create, {
        title: this.title,
        description: this.description,
        owner: 2,
        entity_id: 347,
        entity_type: 'App\Product'
      })
        .then(resp => {
          console.log(resp)
          this.$router.push({path: '/admin/liveDescription/list'})
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
