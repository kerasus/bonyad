<template>
  <v-progress-linear
    :value="usage_number / usage_limit * 100"
    color="blue-grey"
    height="25"
  >
    <template v-slot:default="{ value }">
      <strong>ظرفیت ثبت نام: {{ usage_number }} / {{ usage_limit }}</strong>
    </template>
  </v-progress-linear>
</template>

<script>
export default {
  name: "createLimitation.vue",
  data(){
    return{

    }
  },
  props:{
    usage_number:{
      type: Number,
      default: 0
    },
    usage_limit:{
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped>

</style>
