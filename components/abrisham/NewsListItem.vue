<template>
  <div
    class="newsListItem"
    :class="selected ? 'selected-newsListItem' : ''"
    ref="newsListItem"
  >
    <div
      class="d-flex newsListItem-main-box"
    >
      <div class="right-newsListItem">
        <div class="newsListItem-box">
          <v-img
            v-if="newsListItem.photo"
            :src="newsListItem.photo"
            width="85"
            height="85"
            class="newsListItem-image"
          />
          <v-skeleton-loader
            v-else
            type="image"
            width="85"
            height="85"
          />
        </div>
      </div>
        <div
          class="sheet-icon d-flex justify-space-between align-center"
        >
          <div class="d-flex flex-column justify-center title-box">
            <p class="newsListItem-title" v-if="false">
              {{ newsListItem.short_title }}
            </p>
            <p
              class="newsListItem-description"
            >
              {{ newsListItem.title }}
            </p>
          </div>
<!--          <div-->
<!--            v-if="newsListItem.file"-->
<!--          >-->
<!--            <a-->
<!--              :href="newsListItem.file.pamphlet[0].link"-->
<!--            >-->
<!--              <i-->
<!--                class="fi fi-rr-download download-icon"-->
<!--              />-->
<!--            </a>-->
<!--          </div>-->
<!--        </div>-->
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name:'NewsListItem',
  props: {
    newsListItem: {
      default: () => {
        return {};
      },
    },
    selected: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this.setScrollPosition()
  },
  methods: {
    setScrollPosition() {
      if ( this.newsListItem.is_current){
        this.$refs.newsListItemItem.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
      }
    },
    getClockTime () {
      return {
        start: this.formatClock(this.newsListItem.start),
        end: this.formatClock(this.newsListItem.end)
      }
    },
    formatClock (clock) {
      if (!clock) {
        return clock
      }
      var timeArray = clock.split(':')

      timeArray.splice(2, 1)
      return  timeArray.join(':')
    },
  },
  computed: {
  },
  data(){
    return {
    }
  },
}
</script>

<style lang="scss" scoped>
.newsListItem{
  &:hover {
    cursor: pointer;
    background-color: rgba(242, 245, 255, 0.31);
  }
  .newsListItem-main-box {
    margin:0 32px;
    padding-top: 21px;
    @media screen and (max-width: 1920px){
      margin: 0 15px;
      padding-top: 15px;
    }
    @media screen and (max-width: 350px){
      margin: 0 10px;
      padding-top: 10px;
    }
    .right-newsListItem {
      margin-bottom: 21px;
      @media screen and (max-width: 576px){
        margin-bottom: 15px;
      }
      .lesson_name {
        font-size: 12px;
        line-height: 20px;
        @media screen and (max-width: 768px){
          font-size: 11px;
          line-height: 22px;
        }
      }
      .newsListItem-box {
        position: relative;
        .newsListItem-image {
          width: 96px;
          border-radius: 10px !important;
          @media screen and (max-width: 1920px){
            width: 70px;
            border-radius: 5px !important;
          }
          @media screen and (max-width: 959px){
            width: 96px;
            border-radius: 10px !important;
          }
          @media screen and (max-width: 768px){
            width: 70px;
            border-radius: 5px !important;
          }
          @media screen and (max-width: 320px){
            width: 60px;
          }

        }
        .seen {
          height: 54px;
          width: 96px;
          opacity: 0.5;
          border-radius: 10px;
          background-color: #000000;
          position: absolute;
          top: 0;
          @media screen and (max-width: 1920px){
            height: 100%;
            width: 100%;
            border-radius: 5px;
          }
          @media screen and (max-width: 320px){
            height: 33px;
            width: 60px;
          }
          .icon {
            font-size: 25px;
            color: #fff;
          }
        }
      }
    }
    .left-newsListItem {
      margin-right: 15px;
      width: 100%;
      height: 100%;
      @media screen and (max-width: 1920px){
        margin-right: 10px;
      }
      @media screen and (max-width: 576px){
        margin-right: 5px;
      }
      .time-sheet {
        font-size: 12px;
        .clock {
          .text-color{
            color: #3e5480;
          }
        }
      }
      .sheet-icon {
        .title-box {
          height: 100%;
          width: 100%;
          .newsListItem-description {
            font-size: 14px;
            color: #9fa5c0;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            @media screen and (max-width: 1920px){
              font-size: 14px;
              color: #9fa5c0;
            }
            @media screen and (max-width: 768px){
              font-size: 12px;
            }
            @media screen and (max-width: 350px){
              font-size: 12px;
            }

          }
          .newsListItem-title {
            font-size: 18px;
            font-weight: 500;
            text-align: right;
            color: #3e5480;
            margin-bottom: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            @media screen and (max-width: 1920px){
              font-size: 18px;
              font-weight: 500;
              text-align: right;
              color: #3e5480;
              margin-bottom: 0;
            }
            @media screen and (max-width: 768px){
              font-size: 14px;
            }
            @media screen and (max-width: 350px){
              font-size: 14px;
            }
          }
        }
        .download-icon{
          color: #3e5480;
          font-weight: 500;
          font-size: 20px;
          margin-right: 5px;
          @media screen and (max-width: 959px){
            font-size: 24px ;
          }
          @media screen and (max-width: 768px){
            font-size: 15px;
          }
        }
        a{
          text-decoration: none;
        }
      }

    }
  }
  &:last-child {
    .newsListItem-main-box {
      border-bottom: none;
    }
  }
}
.selected-newsListItem {
  background-color: #f2f5ff!important;
}
</style>
