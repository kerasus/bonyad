<template>
  <div>
    <div
      class="my-5"
      v-for="item in news.list"
    >
      <news-item
        :pin="pin"
        :new-item="item"
        @showMoreClicked="showMoreM"
      />
    </div>
    <div v-if="news.loading" class="text-center mb-8">
      <v-progress-circular
        indeterminate
        color="#ff8f00"
      />
    </div>
    <div v-if="pagination" v-observe-visibility="visibilityChanged"/>
  </div>
</template>

<script>
import {LiveDescription, LiveDescriptionList} from '@/models/LiveDescription';
import NewsItem from "./NewsItem"
import {ObserveVisibility} from 'vue-observe-visibility'
import Vue from 'vue'

Vue.directive('observe-visibility', ObserveVisibility)
export default {
  name: "NewsList",
  components: {NewsItem},
  props: {
    pagination: {
      type: Boolean,
      default: true
    },
    pin: {
      type: Boolean,
      default: false
    },
    news: {
      type: LiveDescriptionList,
      default: new LiveDescriptionList()
    },

  },
  data() {
    return {
      busy: false,
    }
  },
  methods: {
    visibilityChanged(isVisible) {
      if (!isVisible) {
        return
      }
      this.testPushData()
    },
    testPushData() {
      this.$emit('observe')

      // this.loading=true
      // setTimeout( () =>{
      //     this.serverData.forEach(i => {
      //         this.news.list.push(new LiveDescription({
      //             "title": "کمیت و اندازه گیری",
      //             "description": "<p>ویدئوهای ایستگاه درس و نکته و تحلیل تست های جمع بندی فصل اول فیزیک دهم(کمیت و اندازه گیری)، به طور کامل منتشر شد</p>",
      //             "seen_counter": 0,
      //             "tags": null
      //         }))
      //     })
      //     this.loading=false
      // }, 2000)
    },
    showMoreM(data) {
      this.$emit('showMore', data);
    }
  }
}
</script>

<style scoped>

</style>
