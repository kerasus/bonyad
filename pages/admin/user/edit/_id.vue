<template>
  <div class="ma-3">
    <edit-data :is-student="true"/>
  </div>
</template>

<script>
import editData from "@/pages/admin/editUser.vue";

export default {
  name: "_id.vue",
  components: {editData},
}
</script>

<style scoped>

</style>
