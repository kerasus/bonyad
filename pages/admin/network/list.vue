<template>
  <div>
    <data-table
      :table-title="'لیست شبکه ها'"
      :page-name="'network'"
      :next-page-info="{
        btnName: 'لیست زیر شبکه ها',
        routeName: 'subnetwork',
      }"
      :show-next-list-btn="isUserPermitted"
    />
  </div>
</template>

<script>
import DataTable from "~/components/RolesLists/DataTable";
export default {
  name: "List",
  components: {DataTable},
  data() {
    return {

    }
  },
  computed: {
    isUserPermitted () {
      const user = this.$store.getters['Auth/user']
      return user.hasPermission('bonyadShowSubnetworks')
    }
  }
}
</script>

<style scoped>

</style>
