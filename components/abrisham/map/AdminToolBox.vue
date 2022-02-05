<template>
    <div class="m-portlet">
        <vue-confirm-dialog></vue-confirm-dialog>
        <div class="m-portlet__head">
            <div class="m-portlet__head-caption">
                <div class="m-portlet__head-title">
                            <span class="m-portlet__head-icon">
                                <i class="fa fa-toolbox"></i>
                            </span>
                    <h3 class="m-portlet__head-text">
                        جعبه ابزار
                    </h3>
                </div>
            </div>
            <div class="m-portlet__head-tools">
                <ul class="m-portlet__nav">
                    <li class="m-portlet__nav-item">
                        <span class="m-portlet__nav-link m-portlet__nav-link--icon" @click="tabChanged('marker')">
                            <i class="fa fa-map-pin" :class="{'m--font-info': toolTab === 'marker'}"></i>
                        </span>
                    </li>
                    <li class="m-portlet__nav-item">
                        <span class="m-portlet__nav-link m-portlet__nav-link--icon" @click="tabChanged('polyline')">
                            <i class="fa fa-vector-square" :class="{'m--font-info': toolTab === 'polyline'}"></i>
                        </span>
                    </li>
                    <li class="m-portlet__nav-item">
                        <span class="m-portlet__nav-link m-portlet__nav-link--icon" @click="openMapItemsList">
                            <i class="fa fa-list"></i>
                        </span>
                    </li>
                    <li class="m-portlet__nav-item">
                        <a href="" class="m-portlet__nav-link m-portlet__nav-link--icon">
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="m-portlet__body">
            <div v-if="canShowGeneralData" class="row m--margin-bottom-30">
                <div class="col-12">
                    <div class="row">
                        <div class="col-md-6">
                            تگ:
                            <vue-tags-input
                                v-model="newMapItemTag"
                                :tags="mapItemTags"
                                :autocomplete-items="sugestedTags"
                                :allow-edit-tags="true"
                                @tags-changed="mapItemTagsChanged"
                            />
                        </div>
                        <div class="col-md-6">

                            <PrettyCheckBox
                                :type="'checkbox'"
                                :name="'mapItemEnable'"
                                :val="true"
                                :state-off-label="'فعال'"
                                :state-on-label="'فعال'"
                                v-model="mapItemEnable"
                                @changed="setGeneralDataToMapItem(null)"
                            />

                            <hr>

                            <PrettyCheckBox
                                v-for="(item, key) in entities"
                                :key="item.entity_type"
                                :type="'radio'"
                                :name="'mapItemEntity'"
                                :val="item.entity_type"
                                :state-off-label="item.display_name"
                                :state-on-label="item.display_name"
                                v-model="selectedEntity"
                                @changed="setGeneralDataToMapItem(null)"
                            />


                            <div v-show="selectedEntity !== 'nothing'" >
                                کد موجودیت:
                                <input
                                    type="text"
                                    class="a--full-width"
                                    ref="actionLink"
                                    v-model="selectedEntityId"
                                    dir="ltr"
                                >
                            </div>

                        </div>
                    </div>
                    <hr>
                </div>
                <div class="col-md-6">
                    <div>
                        انتخاب نوع فعالیت:
                        <multiselect v-model="selectedMapItemActionType"
                                     @input="onChangeMapItemAction"
                                     placeholder=""
                                     label="title"
                                     track-by="id"
                                     :options="mapItemActionTypes"
                                     :show-labels="true"
                                     :close-on-select="true"
                                     :clear-on-select="true"
                                     :preserve-search="true"
                                     :preselect-first="false"
                                     :select-label="'با کلیک یا اینتر انتخاب کنید'"
                                     :deselect-label="'با کلیک یا اینتر حذف کنید'"
                                     :selected-label="'انتخاب شده'"
                                     :multiple="false">
                            <template slot="singleLabel" slot-scope="props">
                                {{ props.option.title }}
                            </template>
                            <template slot="option" slot-scope="props">
                                {{ props.option.title }}
                            </template>
                            <span slot="noResult">موردی یافت نشد!</span>
                        </multiselect>
                    </div>
                    <div v-if="selectedMapItemActionType !== null && typeof selectedMapItemActionType !== 'undefined'">
                        <div v-if="selectedMapItemActionType.name === 'zoom'">
                            انتخاب مختصات برای زوم:
                            <br>
                            زوم: {{zoom}}
                            <br>
                            مرکز: {{center}}
                            <button type="button" class="btn btn-success m-btn m-btn--custom a--full-width" @click="setMapItemActionZoom(zoom, center)">
                                <i class="fa fa-save"></i>
                            </button>
                        </div>
                        <div v-if="selectedMapItemActionType.name === 'link'">
                            لینک:
                            <input type="text" class="a--full-width" ref="actionLink" v-model="actionLink" dir="ltr" @input="setMapItemActionLink">
                            <multiselect v-model="selectedOpenLinkTypes"
                                         @input="setMapItemActionLink"
                                         placeholder=""
                                         label="title"
                                         track-by="title"
                                         :options="openLinkTypes"
                                         :show-labels="true"
                                         :close-on-select="true"
                                         :clear-on-select="true"
                                         :preserve-search="true"
                                         :preselect-first="false"
                                         :select-label="'با کلیک یا اینتر انتخاب کنید'"
                                         :deselect-label="'با کلیک یا اینتر حذف کنید'"
                                         :selected-label="'انتخاب شده'"
                                         :multiple="false">
                                <template slot="singleLabel" slot-scope="props">
                                    {{ props.option.title }}
                                </template>
                                <template slot="option" slot-scope="props">
                                    {{ props.option.title }}
                                </template>
                                <span slot="noResult">موردی یافت نشد!</span>
                            </multiselect>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div>
                        میزان زوم:
                        {{zoom}}
                    </div>
                    <div style="margin-bottom: 20px;">
                        نمایش زوم از:
                        <vue-slider v-model="displayZoom.min_zoom" direction="rtl" :min="0" :max="11" :marks="true" @change="updateItem"></vue-slider>
                    </div>
                    <div>
                        نمایش زوم تا:
                        <vue-slider v-model="displayZoom.max_zoom" direction="rtl" :min="0" :max="11" :marks="true" @change="updateItem"></vue-slider>
                    </div>
                </div>
            </div>
            <div v-if="toolTab === 'marker'">
                <div v-if="bufferMarker.editMode">
                    <div class="row">
                        <div class="col-md-9">
                            <upload @filesChange="iconFilesChange"></upload>
                        </div>
                        <div class="col-md-3">
                            <img :src="bufferMarker.data.icon.options.iconUrl" class="a--full-width">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            متن بالای آیکن
                            :
                            <input v-model="bufferMarker.data.headline.text" @input="updateItem" type="text">
                        </div>
                        <div class="col-md-6">
                            اندازه متن بالای آیکن
                            :
                            <vue-slider v-model="bufferMarker.data.headline.fontSize" :min="0" :max="50" @change="updateItem"></vue-slider>
                            <br>
                            ضخامت stroke
                            :
                            <vue-slider v-model="bufferMarker.data.headline.strokeWidth" :min="0" :max="50" @change="updateItem"></vue-slider>
                        </div>
                        <div class="col-12">

                            <div class="row">
                                <div class="col-6">
                                    رنگ متن:
                                    <color-picker
                                        :color="bufferMarker.data.headline.fillColor"
                                        @changeColor="changeFillColor"
                                    />
                                </div>
                                <div class="col-6">
                                    رنگ stroke:
                                    <color-picker
                                        :color="bufferMarker.data.headline.strokeColor"
                                        @changeColor="changeStrokeColor"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            اندازه آیکن
                            :
                            <vue-slider v-model="bufferMarker.data.icon.options.iconSize[0]"
                                        :min="0"
                                        :max="200"
                                        @change="updateItem">
                            </vue-slider>
                            <vue-slider v-model="bufferMarker.data.icon.options.iconSize[1]"
                                        direction="btt"
                                        :min="0"
                                        :max="200"
                                        @change="updateItem"
                                        style="display: inline-block; margin: 30px 0; height: 100px;">
                            </vue-slider>
                        </div>
                        <div class="col-md-6">
                            موقعیت آیکن نسبت به مختصات انتخاب شده
                            :
                            <vue-slider v-model="bufferMarker.data.icon.options.iconAnchor[0]"
                                        :min="0"
                                        :max="200"
                                        @change="updateItem">
                            </vue-slider>
                            <vue-slider v-model="bufferMarker.data.icon.options.iconAnchor[1]"
                                        direction="btt"
                                        :min="0"
                                        :max="200"
                                        @change="updateItem"
                                        style="display: inline-block; margin: 30px 0; height: 100px;">
                            </vue-slider>
                        </div>
                    </div>
                </div>
                <button type="button" class="btn btn-success m-btn m-btn--custom a--full-width" @click="addMarker"><i class="fa fa-plus"></i></button>
                <button v-if="bufferMarker.editMode" type="button" class="btn btn-info m-btn m-btn--custom a--full-width" @click="duplicateMarker"><i class="fa fa-copy"></i></button>
                <button v-if="bufferMarker.editMode" type="button" class="btn btn-info m-btn m-btn--custom a--full-width" @click="saveMarker"><i class="fa fa-save"></i></button>
                <button v-if="bufferMarker.editMode" type="button" class="btn btn-danger m-btn m-btn--custom a--full-width" @click="deleteMarker"><i class="fa fa-trash"></i></button>
            </div>
            <div v-if="toolTab === 'polyline'" ref="polylineList" dir="ltr" class="text-right">
                <div v-if="bufferPolyline.editMode" class="row">
                    <div class="col-md-6">
                        <div>
                            نوع خط
                            :
                            <input v-model="bufferPolyline.data.line.dashArray" @input="updateItem" type="text">
                        </div>
                        <div>
                            ضخامت خط
                            :
                            <vue-slider v-model="bufferPolyline.data.line.weight" :min="0" :max="50" @change="updateItem"></vue-slider>
                        </div>
                        <div>
                            شروع الگوی خط
                            :
                            <vue-slider v-model="bufferPolyline.data.line.dashOffset" :min="0" :max="1000" @change="updateItem"></vue-slider>
                        </div>
                        <div>
                            نوع حرکت خط:
                            <br>
                            <span>
                                بدون حرکت
                                <input type="radio" value="fixed" v-model="bufferPolyline.data.line.options.flowing.dir" @change="updateItem">
                            </span>
                            <br>

                            <span>
                                متحرک
                                <input type="radio" value="flowing" v-model="bufferPolyline.data.line.options.flowing.dir" @change="updateItem">
                            </span>
                            <br>

                            <span>
                                حرکت معکوس
                                <input type="radio" value="reverse" v-model="bufferPolyline.data.line.options.flowing.dir" @change="updateItem">
                            </span>
                        </div>
                        <div v-if="bufferPolyline.data.line.options.flowing.dir !== 'fixed'">
                            سرعت حرکت
                            :
                            <vue-slider v-model="bufferPolyline.data.line.options.flowing.style['animation-duration']" :min="0" :max="50" @change="updateItem"></vue-slider>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <color-picker
                            :color="bufferPolyline.data.line.color"
                            @changeColor="changeEditablePolylineColor"
                        />
                    </div>
                </div>
                <button type="button" class="btn btn-warning m-btn m-btn--custom a--full-width" @click="resetToCenterOfMap"><i class="fa fa-sync"></i></button>
                <button v-if="bufferPolyline.editMode" type="button" class="btn btn-success m-btn m-btn--custom a--full-width" @click="duplicatePolyline"><i class="fa fa-copy"></i></button>
                <button v-if="bufferPolyline.editMode" type="button" class="btn btn-success m-btn m-btn--custom a--full-width" @click="savePolyline"><i class="fa fa-save"></i></button>
                <button v-if="bufferPolyline.editMode" type="button" class="btn btn-danger m-btn m-btn--custom a--full-width" @click="deletePolyline"><i class="fa fa-trash"></i></button>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import Upload from '@/utils/Upload'
    import Multiselect from 'vue-multiselect'
    import VueSlider from 'vue-slider-component'
    import 'vue-slider-component/theme/default.css'
    import colorPicker from '@caohenghu/vue-colorpicker'
    import {MapItemAction} from '@/models/MapItemAction'
    import MapItemEntity from '@/models/MapItemEntity'
    import VueTagsInput from '@johmun/vue-tags-input'
    import VueConfirmDialog from 'vue-confirm-dialog'
    import {MapItem} from '@/models/MapItem'
    import PrettyCheckBox from '@/components/abrisham/PrettyCheckBox'

    Vue.use(VueConfirmDialog)
    Vue.component('vue-confirm-dialog', VueConfirmDialog.default);

    export default {
        name: "AdminToolBox",
        // props: ['center', 'zoom', 'marker', ''],
        props: {
            center : {
                type: Object ,
                default() {
                    return {}
                }
            },
            zoom : {
                type: [ String, Number ],
                default : null
            },
            marker : {
                type: Object ,
                default: {}
            },
            polyline : {
                type: Object ,
                default: {}
            }
        },
        components: {
            colorPicker,
            Multiselect,
            Upload,
            VueSlider,
            PrettyCheckBox,
            VueTagsInput
        },
        computed: {
            activeMapItem() {
                if (this.bufferMarker.editMode) {
                    return this.bufferMarker
                } else if (this.bufferPolyline.editMode) {
                    return this.bufferPolyline
                } else {
                    return false
                }
            },
            canShowGeneralData() {
                return this.activeMapItem.editMode && this.activeMapItem.type.name === this.toolTab;
            },
            filterItems() {
                return this.$store.getters.appProps.filterItems;
            },
            sugestedTags() {
                return this.allSugestions.filter(i => {
                    return i.text.indexOf(this.newMapItemTag) !== -1;
                });
            },
            allSugestions() {
                let sugestions = [],
                    reshte = this.filterItems.reshte.flatMap(item => { return { text: item.name } }),
                    path = [{ text: this.filterItems.path.abrisham.name }, { text: this.filterItems.path.oghianous.name }],
                    stepsAbrisham = this.filterItems.path.abrisham.steps.flatMap(item => { return { text: item.name } }),
                    stepsOghianous = this.filterItems.path.oghianous.steps.flatMap(item => { return { text: item.name } }),
                    lessonsAbrisham = this.filterItems.path.abrisham.lessons.flatMap(item => { return { text: item.name } }),
                    lessonsOghianous = this.filterItems.path.oghianous.lessons.flatMap(item => { return { text: item.name } }),
                    teachers = this.filterItems.teachers.flatMap(item => { return { text: item.name } });

                sugestions = reshte.concat(path, stepsAbrisham, stepsOghianous, lessonsAbrisham, lessonsOghianous, teachers);
                sugestions.map(item => {item.text = item.text.replace(/\s/g, '_')});

                return sugestions;
            },
            mapItemTagsText() {
                return this.mapItemTags.map(item => ((typeof item.text !== 'undefined') ? item.text : item));
            }
        },
        watch: {
            marker(to, from) {
                if (!to.editMode) {
                    return;
                }

                this.tabChanged('marker');
                let newMapItem = new MapItem();
                if (to) {
                    this.bufferMarker = to;
                    this.bufferPolyline = newMapItem.getCleanPolyline();
                } else {
                    this.bufferMarker = newMapItem.getCleanMarker();
                    return;
                }
                this.setGeneralDataFromMapItemToBufferItem(to, this.bufferMarker);
                this.setEntityId(this.bufferMarker.entity);
            },
            polyline(to, from) {
                if (!to.editMode) {
                    return;
                }

                this.tabChanged('polyline');
                let newMapItem = new MapItem();
                if (to) {
                    this.bufferMarker = newMapItem.getCleanMarker();
                    this.bufferPolyline = to;
                } else {
                    this.bufferPolyline = newMapItem.getCleanPolyline();
                    return;
                }
                this.setGeneralDataFromMapItemToBufferItem(to, this.bufferPolyline);
                this.setEntityId(this.bufferPolyline.entity);
            },
            selectedEntityId() {
                this.setGeneralDataToMapItem(null);
            }
        },
        data() {
            return {
                selectedEntity: 'nothing',
                selectedEntityId: null,
                entities: [],
                toolTab: null,
                bufferMarker: null,
                bufferPolyline: null,
                selectedMapItemActionType: null,
                displayZoom:{
                    min_zoom: 11,
                    max_zoom: 11
                },
                openLinkTypes: [],
                selectedOpenLinkTypes: null,
                actionLink: null,
                mapItemActionTypes: null,
                mapItemTags: [],
                mapItemEnable: true,
                newMapItemTag: ''
            };
        },
        methods: {

            loadInitData() {
                let newMapItemAction = new MapItemAction();
                let newMapItemEntity = new MapItemEntity();
                this.selectedMapItemActionType = newMapItemAction.getNoActoin();
                this.entities = newMapItemEntity.allAvailableItems();
                this.mapItemActionTypes = newMapItemAction.allAvailableItems();
                this.openLinkTypes = [
                    {name: '_blank', title: 'باز شدن در صفحه جدید'},
                    {name: '_self', title: 'باز شدن در همان صفحه'}
                ];
                this.selectedOpenLinkTypes = this.openLinkTypes[0];

            },

            getActiveMapItem() {
                if (this.bufferMarker.editMode) {
                    return this.bufferMarker
                } else if (this.bufferPolyline.editMode) {
                    return this.bufferPolyline
                } else {
                    return false
                }
            },
            clearData() {
                let newMapItem = new MapItem();
                this.setGeneralDataFromMapItemToBufferItem(newMapItem.getCleanMarker(), this.bufferMarker);
                this.setGeneralDataFromMapItemToBufferItem(newMapItem.getCleanPolyline(), this.bufferPolyline);
                this.mapItemTags = [];
            },
            setActionDataFromMapItemToBufferItem (to) {
                this.selectedMapItemActionType = this.mapItemActionTypes.find(item => item.name === to.action.name);

                if (to.action.name === 'zoom') {
                    this.zoom = to.action.data.zoom;
                    this.center = to.action.data.center;
                } else if (to.action.name === 'link') {
                    this.actionLink = to.action.data.link;
                    this.selectedOpenLinkTypes = this.openLinkTypes.find((item) => {return item.name === to.action.data.target})
                }
            },
            mapItemTagsChanged (newTags) {
                this.mapItemTags = newTags;
                this.setGeneralDataToMapItem(null);
            },
            setGeneralDataFromMapItemToBufferItem (to, buffer) {
                buffer = to;
                this.displayZoom = {
                    min_zoom: to.min_zoom,
                    max_zoom: to.max_zoom
                };
                this.mapItemTags = buffer.tags;
                this.mapItemEnable = buffer.enable;
                this.setActionDataFromMapItemToBufferItem(to);
            },
            setGeneralDataToMapItem (mapItemAction) {
                let activeMapItem = this.getActiveMapItem();
                if (!activeMapItem) {
                    return;
                }

                if (mapItemAction instanceof MapItemAction) {
                    activeMapItem.action = mapItemAction;
                }

                activeMapItem.tags = this.mapItemTagsText;
                activeMapItem.enable = this.mapItemEnable;

                this.loadEntity(activeMapItem);
                this.updateItem();
            },
            cleanBufferItemsEntities() {
                this.bufferMarker.entity.clean();
                this.bufferPolyline.entity.clean();
            },
            loadEntity(activeMapItem) {
                this.cleanBufferItemsEntities();
                // this.selectedEntityId = null;
                activeMapItem.entity.entity_type = this.selectedEntity;
                if (activeMapItem.entity.entity_type === 'nothing') {
                    return;
                }
                activeMapItem.entity.entity_id = this.selectedEntityId;
            },
            setEntityId(entity) {
                this.selectedEntity = entity.entity_type;
                this.selectedEntityId = entity.entity_id;
                this.setGeneralDataToMapItem(null);
            },
            setMapItemActionLink() {
                let mapItemAction = new MapItemAction({
                    name: 'link',
                    data: {
                        link: this.actionLink, // this.$refs.actionLink.value,
                        target: this.selectedOpenLinkTypes.name // '_blank'
                    }
                });
                mapItemAction.convertToValidValue();
                this.setGeneralDataToMapItem(mapItemAction);
            },
            onChangeMapItemAction() {
                let mapItemAction;
                if (this.selectedMapItemActionType.id === 0) {
                    mapItemAction = new MapItemAction({
                        id: 0,
                        title: 'بدون فعالیت',
                        name: 'noAction',
                        data: {}
                    });
                } else if (this.selectedMapItemActionType.id === 1) {
                    mapItemAction = new MapItemAction({
                        name: 'link',
                        data: {
                            link: this.actionLink, // this.$refs.actionLink.value,
                            target: this.selectedOpenLinkTypes.name // '_blank'
                        }
                    });
                } else if (this.selectedMapItemActionType.id === 2) {
                    mapItemAction = new MapItemAction({
                        id: 2,
                        title: 'زوم',
                        name: 'zoom',
                        data: {
                            zoom: 1,
                            center: [0, 0]
                        }
                    });
                }
                mapItemAction.convertToValidValue();

                if (mapItemAction.id !== null) {
                    this.setGeneralDataToMapItem(mapItemAction);
                }
            },
            setMapItemActionZoom(zoom, center) {
                let mapItemAction = new MapItemAction({
                    name: 'zoom',
                    data: {
                        zoom: zoom,
                        center: center
                    }
                });
                mapItemAction.convertToValidValue();
                this.setGeneralDataToMapItem(mapItemAction);
            },
            changeEditablePolylineColor(color) {
                this.bufferPolyline.data.line.color = color.hex;
                this.updateItem();
            },
            changeFillColor(color) {
                this.bufferMarker.data.headline.fillColor = color.hex;
                this.updateItem();
            },
            changeStrokeColor(color) {
                this.bufferMarker.data.headline.strokeColor = color.hex;
                this.updateItem();
            },
            iconFilesChange(fileList) {
                let that = this;
                var reader = new FileReader();
                var reader2 = new FileReader();
                window.currentIconFile = fileList[0]; // (saving a global value to use it later)
                window.iconFileData2 = fileList[0]
                this.bufferMarker.fileData = fileList[0];
                reader.onload = function(e) {
                    that.bufferMarker.data.icon.options.iconUrl = e.target.result;
                };
                reader2.onload = function(e) {
                    window.currentIconFile = e.target ;
                };
                reader.readAsDataURL(fileList[0]); // convert to base64 string
                reader2.readAsBinaryString(window.iconFileData2) // convert to binary string
            },
            shadowFilesChange(fileList) {
                let that = this;
                var reader = new FileReader();
                var reader2 = new FileReader();
                window.currentShadowFile = fileList[0]; // (saving a global value to use it later)
                window.shadowFileData2 = fileList[0]
                reader.onload = function(e) {
                    that.bufferMarker.data.icon.options.shadowUrl = e.target.result;
                };
                reader2.onload = function(e) {
                    window.currentShadowFile = e.target ;
                };
                reader.readAsDataURL(fileList[0]); // convert to base64 string
                reader.readAsBinaryString(window.shadowFileData2) // convert to binary string
            },
            saveMarker() {
                this.$emit('save_marker', this.marker);
                this.clearData();
            },
            duplicateMarker() {
                this.marker.id = null;
                this.$emit('save_marker', this.marker);
                this.clearData();
            },
            tabChanged(tabName) {
                this.toolTab = tabName;
                this.$emit('tab_changed', tabName);
            },
            openMapItemsList() {
                this.$emit('open_map_items_list', this.activeMapItem);
            },
            addMarker() {
                this.$emit('add_marker', this.marker);
            },
            updateMarker() {
                this.$emit('marker_change', this.bufferMarker);
            },
            deleteMarker () {
                this.$confirm(
                    {
                        message: `بابت حذف نقطه اطمینان دارید؟`,
                        button: {
                            no: 'خیر',
                            yes: 'بله'
                        },
                        callback: confirm => {
                            if (confirm) {
                                this.$emit('delete_marker', this.marker);
                                this.clearData();
                            }
                        }
                    }
                )
            },
            savePolyline() {
                this.$emit('save_polyline', this.polyline);
                this.clearData();
            },
            duplicatePolyline() {
                this.polyline.id = null;
                this.$emit('save_polyline', this.polyline);
                this.clearData();
            },
            updatePolyline() {
                this.$emit('polyline_change', this.bufferPolyline);
            },
            resetToCenterOfMap() {
                this.$emit('reset_editable_polyline_to_center_of_map');
            },
            deletePolyline () {
                this.$confirm(
                    {
                        message: `بابت حذف خط اطمینان دارید؟`,
                        button: {
                            no: 'خیر',
                            yes: 'بله'
                        },
                        callback: confirm => {
                            if (confirm) {
                                this.$emit('delete_polyline', this.polyline);
                                this.clearData();
                            }
                        }
                    }
                )
            },
            updateItem() {
                let activeMapItem = this.getActiveMapItem();
                if (!activeMapItem) {
                    return;
                }
                activeMapItem.min_zoom = this.displayZoom.min_zoom;
                activeMapItem.max_zoom = this.displayZoom.max_zoom;
                this.$emit(activeMapItem.type.name + '_change', activeMapItem);
            },
        },
        created: function () {
            this.loadInitData();
            this.tabChanged('marker');
            this.bufferMarker = this.marker;
            this.bufferPolyline = this.polyline;
        },
    }
</script>

<style scoped>
    .editMapItem {
        position: absolute;
        left: -20px;
        top: -20px;
        color: orange;
        background: white;
        border: solid 2px orange;
        padding: 3px;
        border-radius: 5px;
    }
    .editMapItem:hover ~ img {
        border: dashed 1px gray;
    }
    span.m-portlet__nav-link,
    .fa.fa-times-circle {
        cursor: pointer;
    }
    input[type="number"] {
        width: 100px;
    }
</style>

<style>
    .hu-color-picker {
        width: 220px !important;
    }
</style>
