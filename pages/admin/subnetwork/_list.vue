<template>
  <data-table
    :table-title="'لیست زیر شبکه ها'"
    :page-name="'subnetwork'"
    :next-page-info="{
        btnName: 'لیست مشاور ها',
        routeName: 'moshaver',
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
      return user.hasPermission('bonyadShowMoshavers')
    }
  }
}
</script>

<style scoped>

</style>
