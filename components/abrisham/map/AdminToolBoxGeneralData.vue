<template>
    <div class="row m--margin-bottom-30">
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
            <div>
                نمایش زوم از:
                <vue-slider v-model="displayZoom.min_zoom" :direction="rtl" :min="0" :max="10" :marks="true" @change="updateItem"></vue-slider>
            </div>
            <div>
                نمایش زوم تا:
                <vue-slider v-model="displayZoom.max_zoom" :direction="rtl" :min="0" :max="10" :marks="true" @change="updateItem"></vue-slider>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AdminToolBoxGeneralData",
        props: ['mapItem', 'zoom', 'marker', 'polyline'],
        methods: {

        }
    }
</script>

<style scoped>

</style>
