<template>
  <data-table
    :table-title="'لیست مشاور ها'"
    :next-page-info="{
        btnName: 'لیست دانش آموزان',
        routeName: 'user',
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
