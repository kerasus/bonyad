<template>
  <data-table
    :table-title="'لیست مشاور ها'"
    :next-page-info="{
        btnName: 'لیست دانش آموزان',
        routeName: 'user',
    }"
    :show-next-list-btn="isUserPermitted"
  />
</template>

<script>
import DataTable from "~/components/RolesLists/DataTable";
export default {
  name: "List",
  components: {DataTable},
  data() {
    return {}
  },
  computed: {
    isUserPermitted () {
      const user = this.$store.getters['Auth/user']
      return user.hasPermission('bonyadShowStudents')
    }
  }
}
</script>

<style scoped>

</style>
