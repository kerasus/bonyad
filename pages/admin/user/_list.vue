<template>
  <data-table
    :table-title="'لیست دانش آموزان'"
    :page-name="'student'"
    :show-next-list-btn="false"
    :next-page-info="{
        btnName: 'لیست دانش آموزان',
        routeName: 'user'
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
