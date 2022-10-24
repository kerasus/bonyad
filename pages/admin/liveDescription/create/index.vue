<template>
  <v-container fluid>
    <v-row align="center">
      <v-col
        class="d-flex"
        cols="12"
        sm="5"
      >
        <v-text-field
          v-model="title"
          label="موضوع پیام"
          outlined
        />
      </v-col>
      <v-col
        class="d-flex"
        cols="12"
        sm="5"
      >
        <v-select
          v-model="product"
          :items="products"
          item-text="name"
          label="انتخاب محصول"
          :disabled="disabled"
          @change="changeProduct"
        ></v-select>
      </v-col>
      <v-col
        class="d-flex"
        cols="12"
        sm="2"
      >
        <v-checkbox
          v-model="checkbox"
          label="انتخاب همه"
        ></v-checkbox>
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
          :loading="loading"
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
      products: [],
      product: null,
      checkbox: false,
      disabled: false,
      productId: null,
      entity_type: 'App\\Product',
      loading: false
    }
  },
  created() {
    this.getProducts()
  },
  watch: {
    checkbox(newValue) {
      if (newValue === true) {
        this.disabled = true
        this.product = null
        this.productId = 5
        this.entity_type = 'َApp\\Studyevent'
      } else this.disabled = false
    }
  },
  methods: {
    getProducts() {
      this.$axios.get(API_ADDRESS.moshaver.product)
        .then(resp => {
          this.products = resp.data.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    changeProduct() {
      const product = this.products.filter(product => product.name === this.product)
      this.productId = product[0].id
    },
    createMessage() {
      this.loading = true
      this.$axios.post(API_ADDRESS.liveDescription.create, {
        title: this.title,
        description: this.description,
        owner: 2,
        entity_id: this.productId,
        entity_type: this.entity_type
      })
        .then(() => {
          this.$router.push({path: '/admin/liveDescription/list'})
          this.loading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
    }
  }
}
</script>

<style scoped>

</style>
