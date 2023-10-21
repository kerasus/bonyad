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
          @change="setProduct"
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
        <client-only>
          <vue-editor v-model="description" />
        </client-only>
      </v-col>
      <v-col
        cols="12"
        md="12"
      >
        <v-btn
          @click="editMessage"
          :loading="loading"
        >
          ثبت تغییرات
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import API_ADDRESS from "assets/Addresses";
import { VueEditor } from "vue2-editor";

export default {
  name: "_id.vue",
  components: {VueEditor},
  data() {
    return {
      title: '',
      description: '',
      products: [],
      product: null,
      checkbox: false,
      disabled: false,
      productId: null,
      entity_type: '',
      loading: false
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
        this.productId = 5
        this.entity_type = 'App\\Studyevent'
      } else this.disabled = false
    }
  },
  methods: {
    setProduct() {
      const product = this.products.filter(product => product.id === this.productId)
      this.product = product[0].name
      this.productId = product[0].id
    },
    getProducts() {
      this.$axios.get(API_ADDRESS.moshaver.product)
        .then(resp => {
          this.products = resp.data.data
          this.setProduct()
        })
        .catch(err => {
          console.log(err)
        })
    },
    getMessage() {
      const userId = this.$route.params.id
      this.$axios.get(API_ADDRESS.liveDescription.edit(userId))
        .then(resp => {
          this.title = resp.data.data.title
          this.description = resp.data.data.description
          this.productId = resp.data.data.entity_id
          this.entity_type = resp.data.data.entity_type
          if (this.productId === 5) {
            this.checkbox = true
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    editMessage() {
      this.loading = true
      const userId = this.$route.params.id
      this.$axios.put(API_ADDRESS.liveDescription.edit(userId), {
        title: this.title,
        description: this.description,
        entity_id: this.productId,
        entity_type: this.entity_type,
        owner: 2
      })
        .then(() => {
          this.loading = false
          this.$router.push({path: '/admin/liveDescription/list'})
        })
        .catch(() => {
          this.loading = false

        })
    }
  }
}
</script>

<style scoped>

</style>
