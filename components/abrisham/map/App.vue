<template>
    <div style="height: 100%;">
        <Sidebar ref="sidebarAdminToolBox"
                 @on-closed="sidebarClosed"
                 :width="'50%'"
                 :minimize="true"
        >
            <admin-tool-box
                :center="currentCenter"
                :zoom="currentZoom"
                :marker="adminToolBox.marker"
                :polyline="adminToolBox.polyline"
                ref="admintoolbox"
                @add_marker="addAdminMarker"
                @save_marker="saveMapItem"
                @marker_change="updateAdminMarker"
                @delete_marker="deleteAdminMapItem"

                @delete_polyline="deleteAdminMapItem"
                @save_polyline="saveMapItem"
                @polyline_change="updateAdminPolyline"

                @tab_changed="sidebarAdminToolBoxOnTabChange"
                @open_map_items_list="openMapItemsList"
                @reset_editable_polyline_to_center_of_map="resetEditablePolylineToCenterOfMap"
            />
        </Sidebar>
        <Sidebar ref="rightSidebarMapTool"
                 @on-closed="sidebarClosed"
                 :position="'right'"
                 :width="'15%'"
                 :background="'#ffffffa6'"
        >
            <div v-if="canEditMap && !mapSearchToolShow">
                <div v-if="sidebarAdminToolBoxTabName === 'marker'">
                    <div class="text-center">
                        نقطه
                    </div>
                    <MapItemsList
                        :map-items="allMapMarker"
                        @on-select-item="selectMapItem"
                    />
                </div>
                <div v-else-if="sidebarAdminToolBoxTabName === 'polyline'">
                    <div class="text-center">
                        خط
                    </div>
                    <MapItemsList
                        :map-items="allMapPolyline"
                        @on-select-item="selectMapItem"
                    />
                </div>
            </div>
            <div v-if="mapSearchToolShow">
                <SearchTool @changed="fetchMapItems" />
            </div>
        </Sidebar>
        <div :class="{setMarker: selectedMapClickActionTypes.name === 'addIcon'}" style="height: 100%;">
            <l-map style="height: 100%;"
                   ref="lMap"
                   @click="mapClick"
                   :zoom.sync="zoom"
                   :center.sync="center"
                   :min-zoom="minZoom"
                   :max-zoom="maxZoom"
                   :options.sync="mapOptions"
                   :bounds="bounds"
                   :maxBounds="maxBounds"
                   :maxBoundsViscosity="maxBoundsViscosity"
                   :crs="crs"
                   @update:zoom="zoomUpdated"
                   @update:center="centerUpdated"
                   @update:bounds="boundsUpdated">

                <l-tile-layer :url="url" />

                <div v-for="item in visibleMapItems" :key="item.id">
                    <l-marker
                        v-if="(item.type.name === 'marker' || item.type.id === 1) && item.isInView"
                        :lat-lng="item.data.latlng"
                        :draggable="false"
                        @add="openPopup($event, item)"
                        @click="showMapItemInfo($event, item)"
                    >
                        <l-icon
                            :icon-url="getIconURL(item)"
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
                        <!--                        :contenta="'<div>disable</div>'"-->
                        <!--                        :options="{ autoClose: false, closeOnClick: false }"-->
                        <!--                    >-->
                        <!--                    </l-popup>-->
                    </l-marker>
                    <l-polyline
                        v-if="(item.type.name === 'polyline' || item.type.id === 2) && item.data.line && item.data.line.options"
                        :options="item.data.line.options"
                        :lat-lngs="item.data.latlngs"
                        :color="item.data.line.color"
                        :bubblingMouseEvents="item.data.line.bubblingMouseEvents"
                        :dashArray="item.data.line.dashArray"
                        :dashOffset="item.data.line.dashOffset"
                        :weight="item.data.line.weight"
                        @add="openPopup($event, item)"
                        @click="showMapItemInfo($event, item)"
                    >
                        <!--                    <l-popup :content="'<div>disable</div>'" :options="{ autoClose: false, closeOnClick: false }"></l-popup>-->
                    </l-polyline>
                </div>
                <l-control position="topleft">
                    <button class="btnMapControl btnGetLinkToShare d-flex justify-center" @click="copyToClipboard">
                        <i class="fa fa-link" />
                    </button>
                    <div style="width: 130px; background: #ffffff8f;font-family: IRANSans;padding: 5px;border-radius: 5px;">
                        زوم:
                        {{ currentZoom }}
                        <br>
                        عرض:
                        <span dir="ltr">
                            {{ currentCenter.lat | latlang }}
                        </span>
                        <br>
                        طول:
                        <span dir="ltr">
                            {{ currentCenter.lng | latlang }}
                        </span>
                    </div>
                </l-control>
                <l-control position="topright">
                    <button v-if="canEditMap" class="btnMapControl d-flex justify-center" @click="mapEditModeUpdate">
                        <i class="fa fa-edit" />
                    </button>
                    <button class="btnMapControl d-flex justify-center" @click="showMapSearchTool(true)">
                        <i class="fa fa-search" />
                    </button>
                </l-control>

<!--                <l-rectangle :bounds="rectangle.bounds" :l-style="rectangle.style"></l-rectangle>-->

                <l-marker :lat-lng="adminToolBox.marker.data.latlng"
                          :draggable="true"
                          :visible="adminToolBox.marker.editMode"
                          @drag="reportAdminMarker($event, adminToolBox.marker)">
                    <l-icon
                        :icon-url="adminToolBox.marker.data.icon.options.iconUrl"
                        :icon-size="adminToolBox.marker.data.icon.options.iconSize"
                        :icon-anchor="adminToolBox.marker.data.icon.options.iconAnchor"
                        :shadow-url="adminToolBox.marker.data.icon.options.shadowUrl"
                        :shadow-size="adminToolBox.marker.data.icon.options.shadowSize"
                        :shadow-anchor="adminToolBox.marker.data.icon.options.shadowAnchor">
                        <div
                            class="markerHeadline"
                            v-html="adminToolBox.marker.data.headline.text"
                            :style="{
                                fontSize: adminToolBox.marker.data.headline.fontSize+'px',
                                'text-fill-color': adminToolBox.marker.data.headline.fillColor,
                                '-webkit-text-fill-color': adminToolBox.marker.data.headline.fillColor,
                                'text-stroke-width': adminToolBox.marker.data.headline.strokeWidth+'px',
                                '-webkit-text-stroke-width': adminToolBox.marker.data.headline.strokeWidth+'px',
                                'text-stroke-color': adminToolBox.marker.data.headline.strokeColor,
                                '-webkit-text-stroke-color': adminToolBox.marker.data.headline.strokeColor
                            }"
                        >
                        </div>
                        <img :src="adminToolBox.marker.data.icon.options.iconUrl" class="markerImage adminToolBoxMarker">
                    </l-icon>
                </l-marker>
                <editable-polyline
                    v-if="adminToolBox.polyline !== null"
                    ref="editablePolyline"
                    :latlngs.sync="adminToolBox.polyline.data.latlngs"
                    :editablePolylineOptions="adminToolBox.polyline.data"
                    :visible="adminToolBox.polyline.editMode"
                    :map="$refs.lMap"
                />
            </l-map>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {LMap, LTileLayer, LMarker, LPolyline, LIcon, LControl} from 'vue2-leaflet'
    import 'leaflet/dist/leaflet.css';
    import 'pretty-checkbox/dist/pretty-checkbox.css';
    import {MapItem, MapItemList} from '@/models/MapItem'
    import L, {CRS, latLng} from 'leaflet'
    import { FlowingSVG } from 'vue-leaflet-flowing-line'
    import SearchTool from './SearchTool';
    import Sidebar from '@/components/abrisham/Sidebar';
    import mixinLogin from '@/mixin/Login'

    import VueClipboard from 'vue-clipboard2'
    VueClipboard.config.autoSetContainer = true;
    Vue.use(VueClipboard);

    import Loading from 'vue-loading-overlay';
    import 'vue-loading-overlay/dist/vue-loading.css';
    import FilterItems from "./filterItems";
    import initFilterItems from "./initFilterItems";

    Vue.use(Loading);
    Vue.use(FlowingSVG);
    Vue.use(initFilterItems);

    import {MapItemAction} from '@/models/MapItemAction'

    export default {
        name: "MapApp",
        filters: {
            latlang(value) {
                if (!value) return ''
                return parseFloat(value.toString()).toFixed(3)
            }
        },
        watch: {
            currentZoom() {
                // if (Date.now() - this.lastCenterChangeTime > 500) {
                //     this.updateVisibleMapItems();
                // }
                this.updateVisibleMapItems();
            }
        },
        components: {
            MapItemsList: () => import('./MapItemsList'),
            EditablePolyline: () => import('vue-leaflet-editable-polyline'),
            AdminToolBox: () => import('./AdminToolBox'),

            Sidebar,
            SearchTool,

            LMap,
            LControl,
            LTileLayer,
            LIcon,
            LMarker,
            LPolyline,
            // VisibleMapItems
        },
        // props: ['canEditMap', 'contentSearchApi', 'baseUrl', 'mapVersion'],
        props : {
            canEditMap : {
                type: Boolean,
                default: false
            },
            contentSearchApi : {
                type: [ String, Object ],
                default: null
            },
            baseUrl : {
                type: String,
                default: null
            },
            mapVersion : {
                type: [ String, Object ],
                default: null
            }
        },
        computed: {
            // msh(){
            //     // let cl = this.currentCenter.lat,
            //     //     sl = this.bounds._southWest.lat,
            //     //     nl = this.bounds._northEast.lat,
            //     //     e = (nl - sl) / Math.pow(2, this.maxZoom - this.currentZoom),
            //     //     zd = this.maxZoom - this.currentZoom,
            //     //     zd2 = Math.pow(2, zd),
            //     //     e2zd2 = (e * zd2) / 2;
            //     // (this.bounds._northEast.lat - this.bounds._southWest.lat) / Math.pow(2, this.maxZoom - this.currentZoom) => 117.125
            //     return {
            //         // e2zd2: e2zd2,
            //         // nl: nl,
            //         // sl: sl,
            //         // calced_nl: e2zd2 + cl,
            //         // calced_sl: cl - e2zd2
            //         // zoomDiff: this.maxZoom - this.currentZoom,
            //         // zoomDiffPow: Math.pow(2, this.maxZoom - this.currentZoom),
            //         calc: (this.bounds._northEast.lat - this.bounds._southWest.lat) / Math.pow(2, this.maxZoom - this.currentZoom),
            //         calc2: (this.bounds._northEast.lng - this.bounds._southWest.lng) / Math.pow(2, this.maxZoom - this.currentZoom)
            //     };
            // },
            isInView() {
                return (item, margin = 0) => {
                    if (item.type.name !== 'marker') {
                        return true
                    }
                    if (!item.data.latlng) {
                        item.data = JSON.parse(item.data)
                    }
                    if (typeof this.bounds._southWest === 'undefined') {
                        return false
                    }
                    return (
                        item.data.latlng.lat > this.bounds._southWest.lat - margin &&
                        item.data.latlng.lat < this.bounds._northEast.lat + margin &&
                        item.data.latlng.lng > this.bounds._southWest.lng - margin &&
                        item.data.latlng.lng < this.bounds._northEast.lng + margin
                    )
                }
            },
            searchQuery() {
                return this.selectedTeags.flatMap(item => ('tags[]='+item.name.replace(/\s/g, '_'))).join('&')
            },
            filterItems() {
                return FilterItems
            },
            selectedTeags() {
                return this.allTags.filter(item => item.selected);
            },
            allTags() {
                let sugestions = [],
                    reshte = this.filterItems.reshte,
                    path = [this.filterItems.path.abrisham, this.filterItems.path.oghianous],
                    stepsAbrisham = this.filterItems.path.abrisham.steps,
                    stepsOghianous = this.filterItems.path.oghianous.steps,
                    lessonsAbrisham = this.filterItems.path.abrisham.lessons,
                    lessonsOghianous = this.filterItems.path.oghianous.lessons,
                    teachers = this.filterItems.teachers;

                sugestions = reshte.concat(path, stepsAbrisham, stepsOghianous, lessonsAbrisham, lessonsOghianous, teachers);
                return sugestions;
            },
            selectedMapClickActionTypes() {
                return this.mapClickActionTypes.find(function (item) {
                    return item.selected;
                });
            },
            // mapItems() {
            //     return this.$store.getters.appProps.mapItems
            // },
            allMapMarker() {
                return this.allMapItems.getMarkers();
            },
            allMapPolyline() {
                return this.allMapItems.getPolylines();
            },
            visibleMapMarkers() {
                return this.mapItems.getMarkers().filter((item) => { return this.canShowMapItem(item) })
            },
            visibleMapPolylines() {
                return this.mapItems.getPolylines().filter((item) => { return this.canShowMapItem(item) })
            },
            mapMarkers() {
                return this.mapItems.getMarkers();
            },
            mapPolylines() {
                return this.mapItems.getPolylines();
            }
        },
        data() {
            return {
                lastZoomTime: 0,
                lastCenterChangeTime: 0,
                hasZoomChanged: false,
                hasCenterChanged: false,
                visibleMapItems: [],
                mapSearchToolShow: false,
                sidebarAdminToolBoxTabName: null,
                editMapMode: false,
                adminToolBox: {
                    marker: null,
                    polyline: null,
                    polygon: {
                        latlngs: [],
                        color: 'green'
                    }
                },
                mapClickActionTypes: [
                    {name: 'noAction', selected: true},
                    {name: 'addIcon', selected: false},
                    {name: 'addPolygonPoint', selected: false},
                ],
                crs: null,
                zoom: 4,
                minZoom: 3.1,
                maxZoom: 11,
                center: latLng(-8560, 21008),
                bounds: null,
                maxBounds: null,
                maxBoundsViscosity: 1,
                rectangle: {
                    bounds: [[47.341456, -1.397133], [47.303901, -1.243813]], // down - left - up - right
                    style: { color: 'red', weight: 1 }
                },
                polygon: {
                    latlngs: [],
                    color: 'green'
                },
                url: 'https://nodes.alaatv.com/upload/raheAbrishamMap/{z}/{x}/{y}.png?v=' + this.mapVersion,
                currentZoom: 1,
                currentCenter: [0, 0],
                mapIsAnimated: true,
                mapOptions: {
                    zoomSnap: 1,
                    zoomAnimation: true
                },
                mapItems: new MapItemList(),
                allMapItems: new MapItemList(),
                mapItemsListType: null,
                mapLoading: false
            };
        },
        created: function () {
            this.cleanAdminToolBoxMapItemMarker();
            this.cleanAdminToolBoxMapItemPolyline();
            // this.$store.commit('updateAppProps', {
            //     filterItems: FilterItems
            // });
            this.crs = this.getCRS([0.00000000, -15426.00000000, 26934.00000000, 0.00000000]);
            this.bounds = [[-20140, 220 ], [-920, 29650 ]]; // down - left - up - right
            this.center = latLng(-8560, 21008);
            this.maxBounds = this.bounds;
        },
        mounted() {
            this.fetchMapItems();

            let that = this

            if (this.$route.query.lat && this.$route.query.lng) {
                this.panToWithLink()
            } else {
                let that = this
                Vue.nextTick()
                    .then(function () {
                        that.zoomToPoint(4, {'lat': -11468, 'lng': 19972});
                    })
            }
        },
        methods: {
            getBundsByZoom(zoom, center) {
                // (this.bounds._northEast.lat - this.bounds._southWest.lat) / Math.pow(2, this.maxZoom - this.currentZoom) => 117.125
                // (this.bounds._northEast.lng - this.bounds._southWest.lng) / Math.pow(2, this.maxZoom - this.currentZoom) => 240
                let clat = center.lat,
                    clng = center.lng,
                    zd = this.maxZoom - zoom,
                    zd2 = Math.pow(2, zd),
                    e_lat = 117.125,
                    e_lng = 240,
                    e2zd2_lat = (e_lat * zd2) / 2,
                    e2zd2_e_lng = (e_lng * zd2) / 2;

                return {
                    northEast: {
                        lat: e2zd2_lat + clat,
                        lng: e2zd2_e_lng + clng
                    },
                    southWest: {
                        lat: clat - e2zd2_lat,
                        lng: clng - e2zd2_e_lng
                    }
                };
            },
            panToWithLink() {
                let that = this;
                Vue.nextTick()
                    .then(function () {
                        if (that.$route.query.lat && that.$route.query.lng) {
                            let zoom = (typeof that.$route.query.z !== 'undefined') ? that.$route.query.z : this.currentZoom;
                            that.zoomToPoint(zoom, {'lat': that.$route.query.lat, 'lng': that.$route.query.lng});
                        }
                    })
            },
            copyToClipboard() {
                let shareLink = this.baseUrl + '/map?lat=' + this.currentCenter.lat + '&lng=' + this.currentCenter.lng + '&z=' + this.currentZoom;
                let that = this;
                this.$copyText(shareLink).then(function (e) {
                    toastr.success('لینک این قسمت از نقشه کپی شد.');
                }, function (e) {
                    toastr.error('مشکلی در گرفتن لینک رخ داده است.');
                })
            },
            getSelectedMapItemLatlng(mapItem) {
                if (mapItem.type.name === 'marker') {
                    if (!mapItem.data.latlng) {
                        mapItem.data = JSON.parse(mapItem.data)
                    }
                    let bounds = this.getBundsByZoom(mapItem.min_zoom, mapItem.data.latlng),
                        newLng = ((bounds.northEast.lng - bounds.southWest.lng) * (1 / 4)) + bounds.southWest.lng;
                    return {'lat': mapItem.data.latlng.lat, 'lng': newLng};
                } else if (mapItem.type.name === 'polyline') {
                    const latlngsLength = mapItem.data.latlngs.length,
                        latAverage = mapItem.data.latlngs.reduce((total, next) => total + next.lat, 0) / latlngsLength,
                        lngAverage = mapItem.data.latlngs.reduce((total, next) => total + next.lng, 0) / latlngsLength;
                    return {'lat': latAverage, 'lng': lngAverage};
                }
            },
            getSelectedMapItemZoom(mapItem) {
                if (mapItem.type.name === 'marker') {
                    return mapItem.min_zoom;
                } else if (mapItem.type.name === 'polyline') {
                    if (mapItem.min_zoom > 6) {
                        return mapItem.min_zoom;
                    } else {
                        return 6;
                    }
                }
            },
            zoomToMapItemForAdmin(mapItem) {
                this.zoomToPoint(this.getSelectedMapItemZoom(mapItem), this.getSelectedMapItemLatlng(mapItem));
            },
            setMapItemEditMode(mapItem, mode) {
                let mapItemIndex = this.mapItems.list.findIndex(item => item.id === mapItem.id);
                Vue.set(this.mapItems.list[mapItemIndex], 'editMode', mode);
            },
            selectMapItem(mapItem) {
                this.mapItems.setEditMode(false);
                this.setMapItemEditMode(mapItem, true);

                let newMapItem = new MapItem(JSON.parse(JSON.stringify(mapItem)));
                newMapItem.editMode = true;
                Vue.set(this.adminToolBox, mapItem.type.name, newMapItem);
                this.zoomToMapItemForAdmin(mapItem);
                this.updateVisibleMapItems();
            },
            openMapItemsList(mapItem) {
                this.$refs.rightSidebarMapTool.open();
                this.showMapSearchTool(false);
            },
            sidebarAdminToolBoxOnTabChange(tabName) {
                this.sidebarAdminToolBoxTabName = tabName;
            },
            fetchMapItems() {
                let that = this,
                    loader = this.$loading.show({
                        container: that.$refs.lMap.$el,
                        canCancel: false
                    });
                this.mapLoading = true;
                this.mapItems.fetch(null, this.mapItems.actionUrl + '?' + this.searchQuery)
                    .then(function (response) {
                        that.mapItems = new MapItemList(response.data.data);
                        that.mapLoading = false;
                        that.updateVisibleMapItems();
                        loader.hide();
                    })
                    .catch(function () {
                        loader.hide();
                    });

                if (this.canEditMap) {
                    this.fetchAllMapItems();
                }
            },
            fetchAllMapItems() {
                let that = this,
                    loader = this.$loading.show({
                        container: that.$refs.lMap.$el,
                        canCancel: false
                    });
                this.mapLoading = true;
                this.allMapItems.fetch()
                    .then(function (response) {
                        console.log('admin',response)
                        that.allMapItems = new MapItemList(response.data.data);
                        that.mapLoading = false;
                        loader.hide();
                    })
                    .catch(function () {
                        loader.hide();
                    });
            },
            openPopup: function (event, item) {
                if (!item.enable) {
                    this.$nextTick(() => {
                        event.target.openPopup();
                    })
                }
            },
            canShowMapItem (item) {
                this.lastZoomTime = Date.now()
                item.isInView = this.isInView(item, 50)
                return (
                    item.min_zoom <= this.currentZoom &&
                    item.max_zoom >= this.currentZoom &&
                    !item.editMode &&
                    (
                        item.enable ||
                        this.editMapMode
                    )
                )
            },
            resetEditablePolylineToCenterOfMap() {
                this.cleanAdminToolBoxMapItem();
                // this.cleanAdminToolBoxMapItemPolyline();
                let that = this;
                Vue.set(that.adminToolBox.marker, 'editMode', false);
                Vue.set(that.adminToolBox.polyline, 'editMode', true);
                this.$nextTick(() => {
                    that.$refs.editablePolyline.resetToCenterOfMap();
                });
                // setTimeout(function () {
                //     that.$refs.editablePolyline.resetToCenterOfMap();
                // }, 500)
            },
            resetMap() {
                this.fetchMapItems();
                this.cleanAdminToolBoxMapItem();
                this.mapItems.setEditMode(false);
            },
            cleanAdminToolBoxMapItem () {
                this.cleanAdminToolBoxMapItemMarker();
                this.cleanAdminToolBoxMapItemPolyline();
            },
            cleanAdminToolBoxMapItemMarker() {
                let newMapItem = new MapItem();
                Vue.set(this.adminToolBox, 'marker', newMapItem.getCleanMarker());
            },
            cleanAdminToolBoxMapItemPolyline() {
                let newMapItem = new MapItem();
                Vue.set(this.adminToolBox, 'polyline', newMapItem.getCleanPolyline());
            },
            mapEditModeUpdate() {
                this.$refs.sidebarAdminToolBox.toggle();
                this.editMapMode = this.$refs.sidebarAdminToolBox.getState();
                if (!this.editMapMode) {
                    this.resetMap();
                }
            },
            showMapSearchTool(show) {
                if (typeof show === 'undefined' || show === true) {
                    this.mapSearchToolShow = true;
                    this.$refs.rightSidebarMapTool.open();
                } else {
                    this.mapSearchToolShow = false;
                }
            },
            toggleShowSearch() {
                this.$refs.rightSidebarMapTool.toggle();
                this.editMapMode = this.$refs.sidebarAdminToolBox.getState();
                if (!this.editMapMode) {
                    this.resetMap();
                }
            },
            sidebarClosed() {
                this.editMapMode = false;
                if (this.canEditMap) {
                    this.resetMap();
                }
            },
            zoomToPoint(zoom, center) {
                let that = this;
                this.zoom = zoom;
                setTimeout(() => {
                    that.center = center;
                }, 500);
            },
            showMapItemInfo($event, mapItem) {
                if (!this.editMapMode) {
                    if (mapItem.action.name === 'link') {
                        window.open(mapItem.action.data.link, mapItem.action.data.link.target);
                    } else if (mapItem.action.name === 'zoom') {
                        this.zoomToPoint(mapItem.action.data.zoom, mapItem.action.data.center);
                    }
                    return;
                }
                this.selectMapItem(mapItem);
            },
            deleteAdminMapItem(data) {
                let that = this,
                    loader = this.$loading.show({
                        container: that.$refs.lMap.$el,
                        canCancel: false
                    });
                data.delete()
                    .then(function () {
                        that.resetMap();
                        loader.hide();
                    })
                    .catch(function () {
                        that.resetMap();
                        loader.hide();
                    });
            },
            editMapItem(data) {
                let that = this,
                    loader = this.$loading.show({
                        container: that.$refs.lMap.$el,
                        canCancel: false
                    });
                data.update()
                    .then(function () {
                        that.resetMap();
                        loader.hide();
                        that.$refs.admintoolbox.bufferMarker.editMode = false
                    })
                    .catch(function () {
                        that.resetMap();
                        loader.hide();
                    });
            },
            saveMapItem(data) {
                const imgBeforeBinary = data.data.icon.options.iconUrl ;
                data.data.icon.options.iconUrl = '';
                if (data.id) {
                    this.editMapItem(data);
                    return;
                }

                let that = this,
                    loader = this.$loading.show({
                        container: that.$refs.lMap.$el,
                        canCancel: false
                    });

                let newMapItem = new MapItem(data);
                newMapItem.create()
                    .then(function (data) {
                        that.resetMap();
                        loader.hide();
                        that.$refs.admintoolbox.bufferMarker.editMode = false
                    })
                    .catch(function () {
                        that.resetMap();
                        loader.hide();
                    });
            },
            addAdminMarker(data) {
                this.setMapClickActionType('addIcon');
            },
            reportAdminMarker(event, marker) {
                Vue.set(this.adminToolBox.marker.data, 'latlng', event.latlng);
            },
            updateAdminMarker(data) {
                Vue.set(this.adminToolBox, 'marker', data);
                Vue.set(this.adminToolBox.marker.data, 'headline', data.data.headline);
                Vue.set(this.adminToolBox.marker.data.headline, 'fillColor', data.data.headline.fillColor);
                Vue.set(this.adminToolBox.marker.data.headline, 'strokeColor', data.data.headline.strokeColor);
            },
            updateAdminPolyline(data) {
                Vue.set(this.adminToolBox, 'polyline', data);
            },
            mapClick(event) {
                if (this.selectedMapClickActionTypes.name === 'addIcon') {
                    this.cleanAdminToolBoxMapItem();
                    Vue.set(this.adminToolBox.marker.data, 'latlng', event.latlng);
                    Vue.set(this.adminToolBox.polyline, 'editMode', false);
                    Vue.set(this.adminToolBox.marker, 'editMode', true);
                    Vue.set(this.adminToolBox.marker, 'enable', true);
                    Vue.set(this.adminToolBox.marker, 'min_zoom', 11);
                    Vue.set(this.adminToolBox.marker, 'max_zoom', 11);
                    const newMapItemAction = new MapItemAction();
                    Vue.set(this.adminToolBox.marker, 'action', newMapItemAction.getLink());
                    this.setMapClickActionType('noAction');
                }
            },
            setMapClickActionType(type) {
                for (let i = 0; typeof this.mapClickActionTypes[i] !== 'undefined'; i++) {
                    this.mapClickActionTypes[i].selected = false;
                }
                for (let i = 0; typeof this.mapClickActionTypes[i] !== 'undefined'; i++) {
                    if (this.mapClickActionTypes[i].name === type) {
                        this.mapClickActionTypes[i].selected = true;
                    }
                }
                this.polygon.latlngs = [];
            },
            updateVisibleMapItems() {
                this.visibleMapItems = [];
                let that = this;
                setTimeout(function () {
                    that.visibleMapItems = that.mapItems.list.filter((item) => { return that.canShowMapItem(item) })
                    // Vue.set(that, visibleMapItems, that.mapItems.list.filter((item) => { return that.canShowMapItem(item) }))
                }, 10)
            },
            zoomUpdated (zoom) {
                this.currentZoom = zoom;
            },
            centerUpdated (center) {
                this.lastCenterChangeTime = Date.now()
                if (Date.now() - this.lastZoomTime > 500) {
                    this.visibleMapItems.forEach((item) => {
                        item.isInView = this.isInView(item, 50)
                    })
                }
                this.currentCenter = center;
            },
            boundsUpdated (bounds) {
                this.bounds = bounds;
            },
            getCRS(mapExtent) {
                let mapMinZoom = 0,
                    mapMaxZoom = 10,
                    mapMaxResolution = 0.12500000,
                    mapMinResolution = Math.pow(2, mapMaxZoom) * mapMaxResolution,
                    tileExtent = mapExtent,
                    crs = CRS.Simple;
                crs.transformation = new L.Transformation(1, -tileExtent[0], -1, tileExtent[3]);
                crs.scale = function(zoom) {
                    return Math.pow(2, zoom) / mapMinResolution;
                };
                crs.zoom = function(scale) {
                    return Math.log(scale * mapMinResolution) / Math.LN2;
                };

                return crs;
            },
            getIconURL(item){
                return item.data.icon.options.iconUrl;
            }
        }
    }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style src="vue-leaflet-flowing-line/css/animate.css"></style>

<style>
    .btnMapControl {
        background: white;
        /*position: relative;*/
        /*z-index: 999;*/
        border: 1px solid gray;
        width: 35px;
        height: 35px;
        text-align: center;
        line-height: 35px;
        border-radius: 5px;
    }
    .btnGetLinkToShare {
        position: absolute;
        top: -35px;
        right: 0;
    }

    .adminToolBoxMarker {
        border: dotted 2px gray;
    }
    .markerImage, .markerHeadline {
        text-align: center;
        width: 100%;
        /*height: 100%;*/
    }
    .markerHeadline {
        /*left: -100%;*/
        /*position: absolute;*/
        /*bottom: 100%;*/
        /*width: max-content;*/
        /*min-width: 300%;*/
        font-family: IRANSans;
    }
    .editMapItem {
        position: absolute;
        top: 0;
        right: 0;
        background: white;
        padding: 2px;
        border-radius: 4px;
        color: orange;
        border: solid 2px orange;
    }
</style>

<style scoped>
    .setMarker .leaflet-grab {
        cursor: crosshair;
    }
</style>
