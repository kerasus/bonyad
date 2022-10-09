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
      products: [],
      product:null,
      checkbox: false,
      disabled: false
    }
  },
  created() {
    this.getMessage()
    this.getProducts()
  },
  watch: {
    checkbox(newValue) {
      if (newValue === true) {
        this.disabled = true
        this.product = null
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
    getMessage() {
      const userId = this.$route.params.id
      this.$axios.get(API_ADDRESS.liveDescription.edit(userId))
        .then(resp => {
          this.title = resp.data.data.title
          this.description = resp.data.data.description
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
        entity_id: this.productId,
        entity_type: 'App\Product',
        owner: 2
      })
        .then(resp => {
          console.log(resp.data)
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
