<template>
    <div
        class="userAbrishamProgress-page"
    >
        <!--   -- ------------------------------- chip group ------------------------- -->
        <v-row class="header">
            <v-col
                lg="9"
                md="7"
                cols="12"
                order-lg="2"
                class="d-md-block justify-center chip-parent"
            >
                <v-row>
                    <v-col
                        lg="6"
                        sm="12"
                        cols="6"
                        class="chips-1 chip-top"
                    >
                        <chip-group
                            v-model="majors"
                            :drop-down="true"
                            @input="filterLessons"
                        />
                    </v-col>
                    <v-col
                        lg="6"
                        sm="12"
                        cols="6"
                        class="chips-1 chip-down"
                    >
                        <chip-group
                            v-model="lessons"
                            chip-title="درس"
                            :drop-down="true"
                        />
                    </v-col>
                </v-row>
            </v-col>
            <v-col
                order-xl="first"
                order-lg="last"
                xl="3"
                lg="6"
                md="6"
                cols="12"
                class="text-md-right text-center d-flex flex-column justify-center header-label"
            >
                نمایش محتوا بر اساس فعالیت شما
            </v-col>
        </v-row>
        <!--   --------------------------------- video box &&  content list item ------------------------- -->
        <v-row>
            <v-col
                md="8"
                xs="12"
                cols="12"
                class="video-box-col"
            >
                <video-box
                    :lesson="selectedLesson"
                    :set="selectedSet"
                    :content="currentContent"
                    @favorite="toggleFavor"
                    @has_watched="watched"
                    @bookmarkTimestamp="bookmarkPostIsFavored"
                    :afterLoad="hasLoaded"
                />
                <div class="mobile-view">
                    <div class="current-content-title" v-text="currentContent.title" />
                    <comment-box
                        v-model="comment"
                        @input="saveComment"
                    />
                </div>
            </v-col>
            <v-col
                md="4"
                cols="12"
                class="content-list-col"
            >
                <content-list-component
                    v-model="currentContent"
                    :loading="contentListLoading"
                    :afterLoad="hasLoaded"
                    :contents="filteredContents"
                    :header="{ title: 'لیست فیلم ها', button: { title: 'من کجام؟' } }"
                    type="video"
                    @input="changeCurrentContent($event.id)"
                    @clicked="goToWherAmI"
                >
                    <template v-slot:filter>
                        <div class="d-flex  v-select-box">
                            <div class="ml-xm-2 ml-5 col-6 pa-0">
                                <v-select
                                    v-model="setFilterId"
                                    :loading="contentListLoading"
                                    color="#3e5480"
                                    :items="sets.list"
                                    class="v-select"
                                    item-text="short_title"
                                    item-value="id"
                                    :menu-props="{ bottom: true, offsetY: true }"
                                    solo
                                    append-icon="mdi-chevron-down"
                                    dense
                                    background-color="#eff3ff"
                                    flat
                                    placeholder="انتخاب فرسنگ ها"
                                    @change="onChangeSet"
                                    :key="sets.list.length"
                                />
                            </div>
                            <v-select
                                v-model="sectionFilterId"
                                :loading="contentListLoading"
                                value="all"
                                color="#3e5480"
                                :menu-props="{ bottom: true, offsetY: true }"
                                :items="filteredSections"
                                item-text="title"
                                item-value="id"
                                solo
                                append-icon="mdi-chevron-down"
                                dense
                                background-color="#eff3ff"
                                placeholder="همه"
                                flat
                            />
                        </div>
                    </template>
                </content-list-component>
            </v-col>
        </v-row>
        <!--   --------------------------------- comment box &&  content list item------------------------- -->
        <v-row>
            <v-col
                md="8"
                cols="12"
            >
                <div class="desktop-view">
                    <div class="current-content-title" v-text="currentContent.title" />
                    <comment-box
                        v-model="comment"
                        @input="saveComment"
                    />
                </div>
            </v-col>
            <v-col
                md="4"
                cols="12"
            >
                <content-list-component
                    :header="{ title: 'جزوه ها' }"
                    :loading="contentListLoading"
                    :afterLoad="hasLoaded"
                    :contents="filteredContents"
                    type="pamphlet"
                />
            </v-col>
        </v-row>
    </div>
</template>

<script>

import CommentBox from '@/components/abrisham/CommentBox';
import ContentListComponent from '@/components/abrisham/ContentList';
import chipGroup from '@/components/abrisham/chipGroup';
import videoBox from '@/components/abrisham/videoBox';
import {StudyPlanList} from '@/models/StudyPlan';
import { Content, ContentList } from '@/models/Content';
import {SetList, Set} from '@/models/Set';
import {SetSection} from '@/models/SetSection';
import AbrishamContentMixin from '@/mixin/AbrishamContentMixin'
import Vue from 'vue'

export default {
    name: 'UserAbrishamProgress',
    components: {ContentListComponent, CommentBox, chipGroup, videoBox},
    mixins: [AbrishamContentMixin],
    data() {
        return {
            majors: [],
            lessons: [],
            canUseWhereAmI: true,
            contents: new ContentList(),
            currentContent: new Content(),
            studyPlans: new StudyPlanList(),
            sets: new SetList(),
            userContent: new Content(),
            userSet: new Set(),
            setFilterId: '',
            sectionFilterId: 'all',
            contentListLoading: false,
            comment: '',
            hasLoaded: false
        }
    },
    computed: {
        filteredSets () {
            return this.sets.list.filter(set => this.setFilterId === set.id)
        },
        selectedSet () {
            return this.sets.list.find( item => item.id === this.setFilterId )
        },
        selectedLesson () {
            return this.lessons.find( item => item.selected )
        },
        filteredContents () {
            return new ContentList(this.contents.list.filter(content =>  {
                return this.sectionFilterId === 'all' || content.section.id === this.sectionFilterId
            }))
        },
        filteredSections () {
            if (this.sets.list.length === 0) {
                return []
            }
            var setFilterId = this.setFilterId
            if (this.setFilterId === null || this.setFilterId === '') {
                setFilterId = this.sets.list[0].id
            }
            var selectedSet = this.sets.list.find( setItem => setItem.id === setFilterId )
            if (!selectedSet) {
                return []
            }

            return selectedSet.sections.list
        }
    },
    watch : {
        // setFilterId (newValue, oldValue) {
        //     if (oldValue) {
        //         this.getContents(this.setFilterId)
        //     }
        // },
        selectedLesson (newValue, oldValue) {
            this.canUseWhereAmI = true
            if (oldValue) {
                this.getSets(newValue.id)
            }
        }
    },
    created() {
        this.getLessons()
    },
    methods: {
        goToWherAmI () {
            this.canUseWhereAmI = true
            this.getContents(this.userSet.id)
        },
        async whereAmI () {
            let product = this.lessons.find(lesson => lesson.selected)
            return this.$axios.get('/api/v2/product/' + product.id + '/toWatch')

        },
        getSets (productId, whereAmI) {
            this.contentListLoading = true
            this.$axios.get('/api/v2/product/' + productId + '/sets')
                .then( response => {
                    // if (response.data.data.length > 0) {
                    //     this.getContents(response.data.data[0].id)
                    // }
                    this.sets = new SetList(response.data.data)
                    this.sets.list.forEach(item => item.sections.list.unshift(new SetSection({ id: 'all', title: 'همه' })))
                    this.getContents(this.sets.list[0].id, whereAmI)
                })
                .catch(() => {
                    this.contentListLoading = false
                })
        },
        async getContents (setId, whereAmI) {
            this.contentListLoading = true

            var response = null
            if (this.canUseWhereAmI) {
                var response = await this.whereAmI()
            }
            if (response && response.status === 200) {
                this.canUseWhereAmI = false
                this.setFilterId = response.data.data.set.id
                this.userContent = new Content(response.data.data)
                this.userSet = new Set(response.data.data.set)
                setId = this.setFilterId
            }

            this.$axios.get('/api/v2/set/' + setId + '/contents')
                .then( response => {
                    this.contents = new ContentList(response.data.data)
                    const currentContent = this.contents.list.find( item => item.id === this.userContent.id)
                    if (!currentContent) {
                        this.currentContent = new Content(this.contents.list[0])
                    } else {
                        this.currentContent = currentContent
                    }
                    this.changeCurrentContent(currentContent.id)
                    this.contentListLoading = false
                    this.hasLoaded = true

                })
                .catch(() => {
                    this.contentListLoading = false
                })
        },

        filterLessons () {
            const paramLessonId = this.$route.query.lesson_id
            if (paramLessonId) {
                const majorHasLesson = this.majors.find( item => item.lessons.find(lessonItem => lessonItem.id.toString() === paramLessonId.toString()))
                if (majorHasLesson) {
                    this.majors.forEach( majorItem => {
                        if (majorItem.id.toString() === majorHasLesson.id.toString()) {
                            majorItem.selected = true
                            majorItem.lessons.forEach( lessonItem => {
                                if (lessonItem.id.toString() === paramLessonId.toString()) {
                                    lessonItem.selected = true
                                } else {
                                    lessonItem.selected = false
                                }
                            })
                        } else {
                            majorItem.selected = false
                            majorItem.lessons.forEach( lessonItem => {
                                lessonItem.selected = false
                            })
                        }
                    })
                }
            }
            let lessons = this.majors.filter( majorItem => majorItem.selected).map( item => item.lessons )[0]
            if (!lessons) {
                return []
            }
            // lessons.map( item => {
            //   item.color = 'blue'
            //   return item
            // } )

            const hasSelected = lessons.find( item => item.selected )

            if (!hasSelected && lessons.length > 0) {
                lessons[0].selected = true
            }

            this.lessons = lessons
        },
        changeCurrentContent (id) {
            Vue.set(this, 'currentContent', this.contents.list.find(content => content.id === id))
            this.currentContent = this.contents.list.find(content => content.id === id)
            if (this.currentContent.comments[0]) {
                this.comment = this.currentContent.comments[0].comment
            } else {
                this.comment = ''
            }
        },
        getLessons () {
            this.$axios.get('/api/v2/abrisham/lessons')
                .then( response => {
                    response.data.data.forEach( (item, index) => {
                        this.majors.push({
                            id: index,
                            title: item.title,
                            lessons: item.lessons,
                            selected: false,
                            color: '#ff8f00'
                        })
                    })
                    this.setMajorSelected()
                    this.filterLessons()
                    let product = this.lessons.find(lesson => lesson.selected)
                    this.getSets(product.id, true)
                })
        },
        setMajorSelected () {
            this.majors.forEach( mejorItem => {
                mejorItem.lessons.forEach( lessonItem => {
                    if (lessonItem.selected) {
                        mejorItem.selected = true
                    }
                })
            })
        },
        onChangeSet () {
            this.getContents(this.setFilterId)
        },
        loadPlansOfStudyPlan (studyPlanId) {
            this.$axios.get('/api/v2/plan', { params: {'studyPlan_id': studyPlanId, }})
        }
    }
}
</script>

<style lang="scss" scoped>
.userAbrishamProgress-page{
    margin: 0 60px;
    @media screen and (max-width: 1904px) {
        margin: 0 10px;
    }
    @media screen and (max-width: 960px) {
        margin: 0 ;
    }
    .header{
        display: flex;
        flex-direction: row;
        @media screen and (max-width: 1904px){
            flex-direction:column !important;
        }
        .header-label {
            font-size: 20px;
            color: #3e5480;
            font-weight: 500;
            padding-right: 20px;
            padding-top:0 !important;
            padding-bottom:0 !important;
            @media screen and (max-width: 1904px){
                padding-bottom:15px!important;
            }
            @media screen and (max-width: 960px){
                padding-bottom:10px!important;
            }
            @media screen and (max-width: 768px){
                padding-bottom:20px!important;
            }
            @media screen and (max-width: 600px) {
                padding-bottom:15px!important;
                font-size: 16px;
            }
        }
        .chip-parent{
            display: flex;
            @media screen and (max-width: 1264px){
                flex-direction:column;
            }
            .chips-1{
                @media screen and (max-width: 600px){
                    padding-bottom: 0 !important;
                    padding-top: 0 !important;
                }
                &.chip-top{
                    @media screen and (max-width: 1204px){
                        padding-bottom: 0 !important;
                    }
                }
                &.chip-down{
                    @media screen and (max-width: 1204px){
                        padding-top: 0 !important;
                    }
                }
            }
        }
    }
    .current-content-title{
        font-size: 20px;
        font-weight: 500;
        color: #3e5480;
        margin-bottom:21px;
        @media screen and (max-width: 1920px) {
            margin-bottom : 15px;
        }
        @media screen and (max-width: 960px) {
            display: block;
        }
        @media screen and (max-width: 576px){
            font-size: 14px;
        }
        &.current-content-title-mobile {
            display: none;
            @media screen and (max-width: 960px){
                display: block;
                margin-top:15px;
                margin-bottom:5px;
            }
            @media screen and (max-width:768px){
                margin-top:5px;
            }
            @media screen and (max-width: 576px){
                margin-bottom:2px;
            }
            @media screen and (max-width: 350px){
                margin-bottom:0;
            }
        }
    }
    .content-list-col{
        padding-top:0 !important;
    }
    .video-box-col{
        padding-top:0 !important;
        .mobile-view{
            display: none;
            @media screen and (max-width: 959px){
                display: block;
            }
        }
    }
    .current-content-title{
        font-size: 20px;
        font-weight: 500;
        color: #3e5480;
        margin-bottom:21px;
        @media screen and (max-width: 1920px) {
            margin-bottom : 15px;
        }
        @media screen and (max-width: 768px) {
            margin-bottom : 20px;
        }
        @media screen and (max-width: 576px){
            font-size: 16px;
            margin-bottom : 10px;
        }
        @media screen and (max-width: 350px){
            margin-bottom : 5px;
        }
    }
    .desktop-view{
        display: block;
        @media screen and (max-width: 959px){
            display: none;
        }
    }
}
.v-select-box {
    .theme--light{
        &.v-label{
            color:#3e5480;
            font-size: 14px;
            font-weight: 500;
        }
        &.v-icon{
            color:#3e5480;
        }
    }
}
.theme--light{
    &.v-chip{
        &:not(.v-chip--active) {
            padding-right: 7.5px;
            padding-left: 7.5px;
        }
        .v-size--default {
            border-radius: 16px;
            font-size: 16px;
            height: 32px;
            font-weight: 500;
            font-stretch: normal;
            font-style: normal;
            line-height: 2.13;
            letter-spacing: normal;
            color: #9fa5c0;
        }
    }
}
@media screen and (max-width: 768px) {
    .v-text-field{
        &.v-text-field--enclosed {
            .v-text-field__details {
                display: none;
            }
        }
    }
    .v-application {
        .text-center {
            padding-bottom: 0px;
            margin-top: 9px;
        }
    }
}

</style>
<style lang="scss">
.v-menu__content{
    .v-list{
        width:100%;
        border-radius: 0 !important;
        .v-list-item{
            .v-list-item__content{
                padding: 0;
                .v-list-item__title{
                    font-size:14px;
                }
            }
        }
    }
}
.v-select-box{
    .v-input{
        border-radius: 10px;
        .v-input__slot{
            border:4px solid #eff3ff;
        }
        &.v-select--is-menu-active{
            .v-input__control{
                .v-input__slot{
                    background-color: transparent !important;
                    box-sizing: border-box;
                }
            }
        }

    }

}
</style>
