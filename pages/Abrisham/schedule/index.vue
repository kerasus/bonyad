<template>
    <div class="schedule-page">
        <!--   --------------------------------- chip group ------------------------- -->
        <v-row >
            <div ref="schedule" ></div>
            <v-col
                lg="4"
                md="7"
                cols="12"
                order-lg="2"
                order-md="2"
                class="d-flex justify-center"
            >
                <chip-group
                    v-model="userMajors"
                    chip-title="رشته: "
                    @input="changeCurrentContentOnMajorChange"
                />
            </v-col>
            <v-col
                order-xl="first"
                order-lg="last"
                lg="4"
                md="5"
                cols="12"
                order-md="-1"
                class="text-md-right text-center d-flex flex-column justify-center header-label"
            >
                نمایش محتوا بر اساس برنامه مطالعاتی
            </v-col>
        </v-row>
        <!--   --------------------------------- video box &&  content list item ------------------------- -->
        <v-row>
            <v-col
                md="8"
                cols="12"
            >
                <video-box
                    :content="currentContent"
                    @favorite="toggleFavor"
                    @has_watched="watched"
                    :afterLoad="hasLoaded"
                    @bookmarkTimestamp="bookmarkPostIsFavored"
                />
                <div class="mobile-view">
                    <div class="current-content-title" v-text="currentContent.title" />
                    <comment-box
                       :doesnt-have-content="contentIsEmpty"
                        v-model="comment"
                        @input="saveComment"
                    />
                </div>
            </v-col>
            <v-col
                md="4"
                cols="12"
            >
                <date-picker
                    v-model="DatePickerDate"
                    element="null"
                    input-format="YYYY-MM-DD"
                    format="YYYY-MM-DD jYYYY/jMM/jDD"
                    :show="showDatePicker"
                    @close="showDatePicker = false"
                    @change="onChangeDate"
                />
                <content-list-component
                    v-model="currentContent"
                    :loading="contentListLoading"
                    :afterLoad="hasLoaded"
                    :contents="filteredContents"
                    :header="{ title: todayDate, button: { title: 'روزهای دیگر' }}"
                    type="video"
                    @input="changeCurrentContent($event.id)"
                    @clicked="showDatePicker = true"
                />
            </v-col>
        </v-row>
        <!--   --------------------------------- comment box &&  content list item ------------------------- -->
        <v-row>
            <v-col
                md="8"
                cols="12"
            >
               <div class="desktop-view">
                   <div class="current-content-title" v-text="currentContent.title" />
                   <comment-box
                       :doesnt-have-content="contentIsEmpty"
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
        <!--   --------------------------------- study plan ------------------------- -->
        <v-row >
            <v-col>
                <study-plan-group
                    @contentClicked="contentClicked"
                    @scrollIsMoved="scrollIsMoved"
                />
            </v-col>
        </v-row>
    </div>
</template>

<script>

import {Content, ContentList} from '@/models/Content';
import CommentBox from '@/components/abrisham/CommentBox';
import ContentListComponent from '@/components/abrisham/ContentList';
import chipGroup from '@/components/abrisham/chipGroup';
import videoBox from '@/components/abrisham/videoBox';
import StudyPlanGroup from '@/components/abrisham/studyPlanGroup/StudyPlanGroup';
import {StudyPlanList} from '@/models/StudyPlan';
import VuePersianDatetimePicker from 'vue-persian-datetime-picker';
import Vue from 'vue';
import AbrishamContentMixin from '@/mixin/AbrishamContentMixin'

export default {
    name: 'Schedule',
    components: {StudyPlanGroup, ContentListComponent, CommentBox, chipGroup, videoBox, datePicker: VuePersianDatetimePicker},
    mixins: [AbrishamContentMixin],
    destroyed () {
        // console.log('destoryed')
    },
    data() {
        return {
            showDatePicker: false,
            DatePickerDate: '',
            majors: [],
            userMajors: [],
            contentListLoading: false,
            contents: new ContentList(),
            currentContent: new Content(),
            studyPlans: new StudyPlanList(),
            contentIsEmpty: false,
            comment: '',
            hasLoaded: false
        }
    },
    computed: {
        todayDate () {
            let string = 'فیلم های '
          if (this.DatePickerDate === '') {
              string = string.concat('امروز')
          } else {
              string = string.concat(this.DatePickerDate.split(' ')[1])
          }
          return string
        },
        filteredContents () {
            return new ContentList(this.contents.list.filter(content =>  {
                const selectedMajor = this.userMajors.find(major => major.selected)
                return !selectedMajor || content.major.id === selectedMajor.id
            }))
        }
    },
    created() {
        this.getLessons()
        this.getContents()
        this.getMajorsForChip()
    },
    methods: {
        contentClicked(content){
            this.currentContent = content
            this.$vuetify.goTo('.schedule-page')
        },
        changeCurrentContentOnMajorChange () {
            this.currentContent = new Content(this.filteredContents.list[0])
        },

        changeCurrentContent (id, content) {
            Vue.set(this, 'currentContent', this.contents.list.find(content => content.id === id))
            this.currentContent = this.contents.list.find(content => content.id === id)
            if (this.currentContent.comments[0]) {
                this.comment = this.currentContent.comments[0].comment
                // console.log('comment', this.currentContent.comments[0].comment)
            } else {
                this.comment = ''
            }
        },
        onChangeDate () {
            this.getContents(this.DatePickerDate.split(' ')[0])
        },
        getContents (date) {
          this.$axios.get('/api/v2/abrisham/whereIsKarvan', { params: {'date': date }})
                .then( response => {
                    this.contents = new ContentList(response.data.data)
                    if(this.contents.list.length === 0 ){
                        this.contentIsEmpty=true
                    }
                    else {
                        this.contentIsEmpty = false
                    }
                    // find and set the color of the content
                    this.contents.list.forEach(content => {
                        let major = this.majors.find(major => major.id === content.major.id)
                        let lesson
                        if (major.lessons) {
                            lesson = major.lessons.find(lesson => lesson.title === content.inputData.lesson_name)
                        }
                        if (major.lessons && lesson) {
                            content.color = lesson.color
                            return
                        }
                        content.color = 'red'
                    })
                    this.currentContent = new Content(this.currentContentByTime(response.data.data))
                    this.contentListLoading = false
                    this.hasLoaded = true
                })
        },
        currentContentByTime(contentList){
          let current =  contentList.find( item => item.is_current)
            if(current){
                return current
            }
            return contentList[0]
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
                            color: item.color
                        })
                    })
                })
        },
        loadPlansOfStudyPlan (studyPlanId) {
          this.$axios.get('/api/v2/plan', { params: {'studyPlan_id': studyPlanId, }})
        },
        getMajors (studyPlanId) {
          this.$axios.get('/api/v2/plan', { params: {'studyPlan_id': studyPlanId, }})
                .then( response => {
                    this.majors = response.data.data
                })
        },
        getMajorsForChip() {
          this.$axios.get('/api/v2/abrisham/majors')
                .then(response => {
                    this.userMajors = response.data.data
                    let userM=[]
                     this.userMajors.forEach(item => {
                         if(item.selected){
                             userM.push(item)
                         }
                     })
                    if(userM.length === 0 || userM.length > 1){
                      this.userMajors[0].selected = true
                    }
                this.userMajors.forEach((major) => major.color = '#ff8f00')

                })
        },
        scrollIsMoved(val){
            if(val){
                this.$nextTick(() => {
                    this.$refs.schedule.scrollIntoView({alignToTop: true , block:'end' ,  inline: "start"})
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.schedule-page{
    margin: 0 60px;
    @media screen and (max-width: 1904px) {
        margin: 0 10px;
    }
    @media screen and (max-width: 960px) {
        margin: 0;
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
    .mobile-view{
        display: none;
        @media screen and (max-width: 959px){
            display: block;
        }
    }
}
</style>

