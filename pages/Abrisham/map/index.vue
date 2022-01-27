<template>
    <div class="map-page">
        <app
            :can-edit-map="false"
            :base-url="baseUrl"
            :map-version="mapVersion"
            :content-search-api="contentSearchApi"
        />
    </div>
</template>

<script>
import 'font-awesome/css/font-awesome.css'
import App from "@/components/abrisham/map/App";
export default {
    name: "Map",
    components:{App},
    data () {
        return {
            baseUrl: window.baseUrl,
            mapVersion: window.mapVersion,
            contentSearchApi: window.contentSearchApi
        }
    }
}
</script>

<style scoped>
.map-page {
    height: calc( 100vh - 64px );
    margin: -12px;
}
</style>

<style>
.btn.btn-warning.btn-block {
    min-height: 50px;
    color: #212529;
    background-color: #ffb822;
    border-color: #ffb822;
}
</style>
