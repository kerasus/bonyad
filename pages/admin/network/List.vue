<template>
  <div>
    <data-table
      :table-title="'لیست شبکه ها'"
      :next-page-info="{
        btnName: 'لیست زیر شبکه ها',
        routeName: 'subnetwork',
      }"
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
  }
}
</script>

<style scoped>

</style>
