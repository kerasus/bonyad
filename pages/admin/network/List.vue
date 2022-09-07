<template>
  <div>
    <div>لیست شبکه ها</div>
    <data-table/>
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
