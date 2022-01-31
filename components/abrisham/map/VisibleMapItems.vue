<template>
    <div>
        <div v-for="(item, index) in visibleMapItems">
            <l-marker
                v-if="item.type.name === 'marker' || item.type.id === 1"
                :lat-lng="item.data.latlng"
                :draggable="false">
                <l-icon
                    :icon-url="item.data.icon.options.iconUrl"
                    :icon-size="item.data.icon.options.iconSize"
                    :icon-anchor="item.data.icon.options.iconAnchor"
                    :shadow-url="item.data.icon.options.shadowUrl"
                    :shadow-size="item.data.icon.options.shadowSize"
                    :shadow-anchor="item.data.icon.options.shadowAnchor">
                    <div class="markerHeadline" v-html="item.data.headline.text"
                         :style="{
                            fontSize: item.data.headline.fontSize+'px',
                            'text-fill-color': item.data.headline.fillColor,
                            '-webkit-text-fill-color': item.data.headline.fillColor,
                            'text-stroke-width': item.data.headline.strokeWidth+'px',
                            '-webkit-text-stroke-width': item.data.headline.strokeWidth+'px',
                            'text-stroke-color': item.data.headline.strokeColor,
                            '-webkit-text-stroke-color': item.data.headline.strokeColor
                            }"
                    >
                    </div>
                    <!--                        <i class="fa fa-edit editMapItem" v-if="item.editMode"></i>-->
                    <img :src="item.data.icon.options.iconUrl" class="markerImage">
                </l-icon>
                <!--                    <l-popup-->
                <!--                        v-if="editMapMode"-->
                <!--                        :content="'<div>disable</div>'"-->
                <!--                        :options="{ autoClose: false, closeOnClick: false }"-->
                <!--                    >-->
                <!--                    </l-popup>-->
            </l-marker>
            <l-polyline
                v-if="item.type.name === 'polyline' || item.type.id === 2"
                :options="item.data.line.options"
                :lat-lngs="item.data.latlngs"
                :color="item.data.line.color"
                :bubblingMouseEvents="item.data.line.bubblingMouseEvents"
                :dashArray="item.data.line.dashArray"
                :dashOffset="item.data.line.dashOffset"
                :weight="item.data.line.weight"
            >
                <!--                    <l-popup :content="'<div>disable</div>'" :options="{ autoClose: false, closeOnClick: false }"></l-popup>-->
            </l-polyline>
        </div>
    </div>
</template>

<script>
    import {LMarker, LPolyline, LIcon} from 'vue2-leaflet'
    export default {
        name: 'VisibleMapItems',
        props: ['visibleMapItems'],
        components: {
            LMarker,
            LIcon,
            LPolyline,
        },
    }
</script>

<style scoped>

</style>
