<template>
  <div class="row">
    <div class="col-md-3">
      <v-text-field
        label="نام"
      />
    </div>
    <div class="col-md-3">
      <v-text-field
        label="نام خانوادگی"
      />
    </div>
    <div class="col-md-3">
      <v-select
        :items="items"
        label="Standard"
      ></v-select>
    </div>
  </div>
</template>

<script>
export default {
  name: "_id.vue",
  data () {
    return {
      user: {
        major:
      },
      majors: [

      ]
    }
  }
}
</script>

<style scoped>

</style>
