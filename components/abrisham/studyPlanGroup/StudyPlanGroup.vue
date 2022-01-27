<template>
    <div ref="studyPlan" class="study-plan-group">
        <v-card
            class="study-plan"
            elevation="0"
        >
            <v-fade-transition>
                <v-overlay :value="studyPlanListLoading" absolute z-index="2" color="#FFEDD6">
                    <v-progress-circular
                        indeterminate
                        size="64"
                    ></v-progress-circular>
                </v-overlay>
            </v-fade-transition>
            <v-card-title class="study-plan-header-title">
                جدول برنامه مطالعاتی راه ابریشم آلاء
            </v-card-title>
            <div class="major-card">
                <p class="major-card-text">
                    رشته:
                </p>
                <v-select
                    v-model="selectedMajor"
                    :items="majorOptions"
                    :item-value=" (item) => item"
                    item-text="name"
                    solo
                    flat
                    append-icon="mdi-chevron-down"
                />
            </div>
            <div class="all-the-expansions" id="study-scroll-1-x">
                <v-row>
                    <v-expansion-panels
                        flat
                        multiple
                        v-model="openStudyPanel"
                        class="study-plan-expansion"
                    >
                        <v-expansion-panel
                            v-for="(item, index) in studyPlanList.list"
                            :key="index"
                            :ref="index"
                            @click="loadPlans(index)"
                        >
                            <v-expansion-panel-header class="study-plan-expansion-header">
                                <v-row>
                                    <v-col
                                        cols="4"
                                    >
                                        <div class="study-plan-expansion-header-text">{{ item.title }}</div>
                                    </v-col>
                                    <v-col
                                        cols="4"
                                    >
                                        <div class="study-plan-expansion-header-text">
                                            {{ item.convertDate().dayOfWeek }}
                                        </div>
                                    </v-col>
                                    <v-col
                                        cols="4"
                                    >
                                        <div class="study-plan-expansion-header-text">
                                            {{ item.convertDate().dateOfMonth }}
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-expansion-panel-header>
                            <study-plan
                                :study-plan="item"
                                :selected-major="selectedMajor"
                                :study-plan-loading="studyPlanLoading"
                                :opened-panel="openedPanel"
                                @contentClicked="contentClicked"
                            />
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-row>
            </div>
        </v-card>
    </div>
</template>

<script>
import StudyPlan from './StudyPlan';
import {StudyPlanList} from '@/models/StudyPlan.js'
import Major from '@/models/Major';
import {dragscroll} from 'vue-dragscroll'
import {PlanList} from '@/models/Plan';
import {scroller} from 'vue-scrollto/src/scrollTo'

export default {
    props: {},
    directives: {
        dragscroll
    },
    components: {StudyPlan},
    created() {
        this.doesSelectedMajorExist()
        this.getStudyPlanList()
    },
    mounted() {
        this.setDateOnToday()
    },
    data() {
        return {
            majorOptions: [
                new Major({
                    id: 1,
                    name: 'ریاضی',
                }),
                new Major({
                    id: 2,
                    name: 'تجربی',
                }),
                new Major({
                    id: 3,
                    name: 'انسانی',
                })
            ],
            major: '',
            selectedMajor: new Major(),
            studyPlans: new StudyPlanList(),
            studyPlanListLoading: true,
            openStudyPanel: [],
            studyPlanLoading: false,
            studyPanelIsClosing: false,
            planList: new PlanList(),
            openedPanel: false,
            today: '',
            studyPlanList : new StudyPlanList()

        }
    },
    methods: {
        contentClicked(content) {
            this.$emit('contentClicked', content)
        },
        doesSelectedMajorExist() {
            if (this.selectedMajor.id === null) {
                this.selectedMajor = this.majorOptions[0]
            }
        },
        getStudyPlanList() {
            const i = 5
            let that = this
            axios.get('/api/v2/studyEvent/' + i + '/studyPlans')
                .then(response => {
                    this.studyPlanList = new StudyPlanList(response.data.data)
                    this.studyPlanListLoading = false
                    that.$nextTick(() => {
                        that.openPanelOfToday()
                    })
                })
                .catch(err => console.error(err));
        },
        setDateOnToday() {
            var todayDate = new Date();
            var dd = String(todayDate.getDate()).padStart(2, '0');
            var mm = String(todayDate.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = todayDate.getFullYear();
            todayDate = String(yyyy + '-' + mm + '-' + dd)
            this.today = todayDate
        },
        loadPlans(index) {
            let that = this
            this.studyPanelIsClosing = false
            this.openStudyPanel.forEach(function (item) {
                if (item === index) {
                    that.studyPanelIsClosing = true
                }
            })
            if (!this.studyPanelIsClosing) {
                this.studyPlanLoading = true
                const i = this.studyPlanList.list[index].studyPlan_id
                axios.get('/api/v2/studyPlan/' + i + '/plans')
                    .then(response => {
                        this.planList = new PlanList(response.data.data)
                        this.studyPlanList.list[index].plans = this.planList
                        this.studyPlanLoading = false
                    })
                    .catch(err => console.error(err));
            } else {
                this.openedPanel = false
            }
        },
        openPanelOfToday() {
            let that = this
            this.studyPlanList.list.forEach(function (item) {
                if (item.date === that.today) {
                    // Array.prototype.indexOf()
                    that.loadPlans(that.studyPlanList.list.indexOf(item))
                    that.openStudyPanel.push(that.studyPlanList.list.indexOf(item))
                    that.$nextTick(() => {
                        that.scrollto(that.studyPlanList.list.indexOf(item))
                    })

                }
            })
        },
        scrollto(id) {
            this.$refs[id][0].$el.scrollIntoView()
            const scrollIsMoved = true
            this.$emit('scrollIsMoved', scrollIsMoved)
        }
    }
}
</script>

<style lang="scss" scoped>
.study-plan-group {
    .study-plan {
        .major-card {
            display: flex;
            flex-direction: row;
            text-align: center;
            align-items: center;
            position: relative;
            margin-top: -57px;
            @media only screen and (max-width: 1200px){
                margin-top: -32px;
            }
            @media only screen and (max-width: 768px){
                justify-content: center;

            }
            .v-input {
                max-width: 195px;
                @media only screen and (max-width: 1904px){
                    max-width: 177px;
                }
                @media only screen and (max-width: 1200px){
                    max-width: 136px;
                }
                @media only screen and (max-width: 990px){
                    max-width: 136px;
                }
            }
            .v-text-field{
                &.v-text-field--enclosed {
                    padding-top: 15px;
                    margin-right: 15px !important;
                    @media only screen and (max-width: 1200px){
                        padding-top: 35px;
                    }
                }
            }
            .major-card-text {
                margin-right: 4%;
                font-size: 16px;
                @media only screen and (max-width: 768px){
                   padding-top: 20px;
                    margin-right: 0;
                }

            }
        }
        .all-the-expansions {
            height: 540px;
            overflow-y: scroll;
            overflow-x: hidden;
            @media only screen and (max-width: 1200px){
                height: 527px;
            }
            @media only screen and (max-width: 990px){
                height: 547px;
            }
            @media only screen and (max-width: 768px){
                height: 466px;
            }
            @media only screen and (max-width: 350px){
                height: 446px;
            }
            .study-plan-expansion {
                padding: 0 80px 0 80px;
                @media only screen and (max-width: 1904px){
                    padding: 0 60px 0 60px;
                }
                @media only screen and (max-width: 1200px){
                    padding: 0 48px 0 48px;
                }
                @media only screen and (max-width: 768px){
                    padding: 0 37px 0 37px;
                }
                @media only screen and (max-width: 576px){
                    padding: 0 20px 0 20px;
                }
                &.theme--light{
                    &.v-expansion-panels {
                        .v-expansion-panel {
                            margin-top: 15px;
                            border-radius: 20px !important;
                        }
                    }
                }
                .study-plan-expansion-header{
                    font-size: 18px;
                    font-weight: normal;
                    line-height: normal;
                    text-align: right;
                    color: #3e5480;
                    @media only screen and (max-width: 768px){
                        font-size: 14px;
                    }
                    .v-card__subtitle , .v-card__text {
                        font-size: 0.875rem;
                        font-weight: 400;
                        line-height: 1.375rem;
                        letter-spacing: 0.0071428571em;
                        margin-right: 38px;
                    }
                }
            }
        }
    }
    .v-card{
        &.theme--light{
            background-color: #ffe2bc;
            color: #3e5480;
            padding-bottom: 51px;
        }
        &.v-sheet{
            border-radius: 30px;
            @media only screen and (max-width: 1200px){
                border-radius: 20px;
            }
        }
        .v-card__title {
            font-size: 20px;
            font-weight: 500;
            justify-content: center;
            padding-top: 40px;
            @media only screen and (max-width: 768px){
                padding-top: 30px;
            }
            @media only screen and (max-width: 768px){
                font-size: 16px;
                padding-top: 25px;
            }
        }
    }

}

#study-scroll-1-x{
    &::-webkit-scrollbar-track {
        border-radius: 6px;
        background-color: #F5F5F5;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 6px;
        background-color: #f7941d;
    }
}
@media only screen and (max-width: 1200px) {
    .v-card > :first-child:not(.v-btn):not(.v-chip):not(.v-avatar), .v-card > .v-card__progress + :not(.v-btn):not(.v-chip):not(.v-avatar) {
        border-radius: 20px;
    }
}
@media only screen and (max-width: 768px) {
    .v-text-field.v-text-field--solo .v-input__control {
        min-height: 40px;
    }
}
</style>
<style lang="scss">
.v-text-field fieldset, .v-text-field .v-input__control, .v-text-field .v-input__slot {
    border-radius: 10px !important;
}

.v-expansion-panel-content__wrap {
    box-shadow: 0 0 0 0;
}

@media only screen and (max-width: 768px) {
    .study-plan-group .v-text-field.v-text-field--solo .v-input__control {
        min-height: 40px;
    }
}
</style>
<style lang="scss">
.study-plan-expansion {
    .v-expansion-panel{
        .v-expansion-panel-content__wrap{
            box-shadow: 0 0 0 0;
            padding: 0 20px 16px !important;
            @media screen and (max-width: 990px){
                padding: 0 15px 16px !important;
            }
            @media screen and (max-width: 768px){
                padding: 0 5px 10px !important;
            }
            @media screen and (max-width: 576px){
                padding: 0 5px 9px !important;
            }
        }
    }
}
</style>
