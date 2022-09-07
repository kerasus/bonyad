<template>
  <data-table
    :table-title="'لیست زیر شبکه ها'"
    :next-page-info="{
        btnName: 'لیست مشاور ها',
        routeName: 'moshaver',
      }"
  />
</template>

<script>
import DataTable from "~/components/RolesLists/DataTable";
export default {
  name: "List",
  components: {DataTable}
}
</script>

<style scoped>

</style>
