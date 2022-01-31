<template>
    <div>
        <div class="timeTable" id="study-scroll-2-y" v-dragscroll.x="true">
            <div class="timeTable-header">
                <div class="timeTable-header-number-boxes">
                    <div
                        v-if="canShowTimeTableHeader(startTime)"
                        class="timeTableHeader"
                        :style="{ flex: ('0 0 ' + customizedHeaderWidth() + 'px') }"
                    />
                    <div
                        v-for="i in timeArray"
                        :key="i"
                        class="timeTableHeader"
                        :style="{ flex: ('0 0 ' + headerWidth + 'px') }"
                    >
                        <v-row>
                            <v-col>
                                <div class="timeTableHeaderNumber">
                                    {{ i }}
                                </div>
                            </v-col>
                        </v-row>
                    </div>
                </div>
            </div>
            <div
                v-if="!loading"
                class="timeTable-body"
            >
                <div
                    v-for="i in timeArray"
                    :key="i"
                    :style="[{ flex: ('0 0 ' + headerWidth + 'px') }]"
                >
                    <div class="timeTable-main-line" />
                    <div class="timeTable-line" />
                </div>
                <div
                    v-for="p in plansOfSelectedMajor"
                    :key="p.id"
                    class="plan"
                    :style="{
                        right: calcPosition(p.start, p.end).right
                      }"
                    @click="selectPlan(p.id)"
                >
<!--                    calcPosition(p.start, p.end).right-->
                    <div
                        class="plan-within-box"
                        :style="{
                          width: calcPosition(p.start, p.end).width,
                          backgroundColor: p.backgroundColor,
                          borderColor: p.borderColor,
                          color: p.textColor,
                          position : 'absolute'
                        }"
                        :class="{ planActive: activateSelectedPlan === parseInt(p.id) }"
                    >
                        {{ p.title }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Major from '@/models/Major'
import {PlanList , Plan} from '@/models/Plan'
import { dragscroll } from 'vue-dragscroll'

export default {
    name: 'TimeScheduleTable',
    directives: {
        dragscroll
    },
    props: {
        headerWidth: {
            default: 200,
            type: Number
        },
        startTime: {
            default: '00:00:00',
            type: String
        },
        endTime: {
            default: '24:00:00',
            type: String
        },
        plans: {
            type: PlanList,
            default: new PlanList(),
        },
        loading: {
            default: () => {
                return false
            },
            type: Boolean
        },
        selectedMajor: {
            default() {
                return new Major({
                    id: 1,
                    name: 'ریاضی'
                })
            },
            type: Major
        },
        selectedPlanStyle:{
            default() {
                return {}
            },
            type : Object
        },
        chosenTimeToAdd: {
            default: '01:00:00',
            type: String
        },
        notTheSamePlan : {
            default: () => {
                return false
            },
            type: Boolean
        }
    },
    data() {
        return {
            timeArray: [],
            selectedPlanId: null,
            spaceBetweenEndingTimes : 0,
            spaceBetweenStartTimes : 0,
            spaceBetweenStartTimeSeconds : 0,
            selectedPlan : [],
            planToActivate : null,
            openedPanel: false
        }
    },
    computed: {
        plansOfSelectedMajor() {
            return this.plans.list.filter(item => parseInt(item.major.id) === parseInt(this.selectedMajor.id))
        },
        setRightPositionForMediaTags() {
            if (this.$store.getters.windowSize.x < 1920) {
                return this.calcPosition(p.start, p.end , 0.30).right
            }
            else if (this.$store.getters.windowSize.x > 1920) {
                return this.calcPosition(p.start, p.end , 0.25).right

            }
        }
        ,
        activateSelectedPlan(){
            const result = this.plans.list.find( item => item.active === true )
            if (this.openedPanel){
                if (!result){
                    return null
                }
                return result.id
            }
            return null
        }
    },
    created() {
        this.calcSpaceBetweenTimes()
        const totalTime = this.calcTheEndingPoint() - this.calcTheStartingPoint()
        for (var i = 0; i < totalTime + 1; i++) {
            this.timeArray.push(this.calcTheStartingPoint() + i)
        }
    },
    methods: {
        selectPlan(id){
            this.selectedPlanId = id
            let that = this
            this.plans.list.forEach( function (item) {
                if (parseInt(item.id) === parseInt(id)) {
                    that.selectedPlan = item
                    item.active = !!!item.active
                    that.changePanelStatus(item.active)
                    return
                }
                item.active = false
            })
            this.$emit('planClicked' , this.selectedPlan)
        },
        timeToPixel(time) {
            return (this.headerWidth * time) / 3600
        },
        canShowTimeTableHeader(time) {
            return (this.parseTheTime(time).minutes !== 0 || this.parseTheTime(time).seconds !== 0)
        },
        customizedHeaderWidth() {
            const parsedStartTime = this.parseTheTime(this.startTime)
            if (parsedStartTime.minutes !== 0 || parsedStartTime.seconds !== 0) {
                return (
                    this.roundTheTime(parsedStartTime) * 3600 - parsedStartTime.totalSecond) * this.headerWidth / 3600
            } else {
                return this.headerWidth
            }
        },
        parseTheTime(time) {
            const [hh = '0', mm = '0', ss = '0'] = (time || '0:0:0').split(':');
            const hour = parseInt(hh, 10) || 0;
            const minute = parseInt(mm, 10) || 0;
            const second = parseInt(ss, 10) || 0;
            return {
                totalSeconds: (hour * 3600) + (minute * 60) + (second),
                minutes: minute,
                hour: hour,
                seconds: second
            }
        },
        roundTheTime(timeSeconds) {
            if (timeSeconds.minutes === 0 && timeSeconds.seconds === 0) {
                return timeSeconds.hour
            } else {
                return timeSeconds.hour + 1
            }
        },
        calcPosition(start, end) {
            const rFixed = 0.275
            const startSeconds = this.parseTheTime(start).totalSeconds
            const endSeconds = this.parseTheTime(end).totalSeconds
            const i = ((this.calcTheStartingPoint() - rFixed)  * 3600)
            const right = ((startSeconds - i) * (this.headerWidth / 3600) ).toString() + 'px'
            const width = ((endSeconds - startSeconds) * (this.headerWidth) / 3600).toString() + 'px'
            return { right: right , width: width }
        },
        calcSpaceBetweenTimes(){
            const parsedStartTime = this.parseTheTime(this.startTime)
            if (this.plans.list[0].start === '00:00:00') {
                this.spaceBetweenStartTimes = parsedStartTime.hour
                this.spaceBetweenStartTimeSeconds = parsedStartTime.seconds
            }
            else{
                this.spaceBetweenStartTimes = this.parseTheTime(this.plans.list[0].start).hour - parsedStartTime.hour
                this.spaceBetweenStartTimeSeconds = this.parseTheTime(this.plans.list[0].start).seconds - parsedStartTime.seconds
            }
            if (this.plans.list[this.plans.list.length - 1].end === '24:00:00') {
                this.spaceBetweenEndingTimes = this.parseTheTime(this.endTime).hour
            }
            else{
                this.spaceBetweenEndingTimes = this.parseTheTime(this.endTime).hour - this.parseTheTime(this.plans.list[this.plans.list.length - 1].end).hour
            }
        },
        calcTheEndingPoint(){
            return this.parseTheTime(this.endTime).hour - this.spaceBetweenEndingTimes + this.parseTheTime(this.chosenTimeToAdd).hour
        },
        calcTheStartingPoint(){
            return this.roundTheTime(this.parseTheTime(this.startTime)) + this.spaceBetweenStartTimes - this.parseTheTime(this.chosenTimeToAdd).hour
        },
        calcTheStartingPointSeconds(){
            return this.parseTheTime(this.startTime).hour + this.spaceBetweenStartTimes - this.parseTheTime(this.chosenTimeToAdd).hour
        },
        changePanelStatus(active){
            this.openedPanel = false
            if (active){
                this.openedPanel = true
            }
            this.$emit('openPanel' , this.openedPanel)
        }
    }
}
</script>
<style lang="scss" scoped>
.timeTable{
    position: relative;
    overflow-x: scroll;
    overflow-y: hidden;
    background-color: white;
    top: 3px;
    @media only screen and (max-width: 767px){
        border-radius: 0;
    }
    .timeTable-header{
        position: relative;
        right: 0.4px;
        .timeTable-header-number-boxes{
            display: flex;
            .timeTableHeader{
                padding: 5px 0;
                text-align: center;
                line-height: 48px;
                background-color: rgba(225, 240, 255, 1);
                &:last-child {
                    padding-left: 20px;
                }
                .timeTableHeaderNumber{
                    position: relative;
                    background-color: white;
                    width: 30px;
                    height: 30px;
                    right: 38px;
                    border-radius: 50%;
                    padding: 5px 7px 1px;
                    font-size: 12px;
                    font-weight: normal;
                    font-stretch: normal;
                    font-style: normal;
                    line-height: normal;
                    letter-spacing: normal;
                    text-align: center;
                    color: #333333;
                    @media only screen and (max-width: 1919px){
                        right: 25px;
                    }
                }
            }
        }
    }
    .timeTable-body{
        display: flex;
        background-color: white;
        height: 55px;
        @media only screen and (max-width: 767px){
            height: 36px;
        }
        .timeTable-main-line{
            position: relative;
            border-left: solid 2px #e1f0ff;
            height: 70px;
            right: -146px;
            @media only screen and (max-width: 1919px){
                right: -100px;
            }
            @media only screen and (max-width: 767px){
                height: 37px;
            }
        }
        .timeTable-line{
            display: inline-block;
            position: relative;
            border-left: solid 1px #e1f0ff;
            height: 70px;
            right: -46px;
            bottom: 70px;
            @media only screen and (max-width: 1919px){
                right: 109px;
            }
        }
        .plan{
            position: absolute;
            cursor: pointer;
            border-radius: 10px;
            text-align: center;
            top: 0;
            height: 100%;
            padding-top: 57px;
            @media only screen and (max-width: 767px){
                padding-top: 47px;
            }
            .plan-within-box{
                border-radius: 10px;
                font-size: 14px;
                padding-top: 3px;
                padding-bottom: 3px;
                @media only screen and (max-width: 767px){
                    border-radius: 8px;
                }
                &.planActive{
                    box-shadow: 0 2px 5px 0 rgba(255, 143, 0, 0.4) !important;
                    background-color: #ff8f00 !important;
                }
            }
        }
    }
}
#study-scroll-2-y{
    &::-webkit-scrollbar-track {
        border-radius: 6px;
        background-color: #F5F5F5;
    }
    &::-webkit-scrollbar {
        width: 6px;
        border-radius: 6px;
        height: 6px;
        background-color: #F5F5F5;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 6px;
        background-color: #f7941d;
    }
}
</style>

