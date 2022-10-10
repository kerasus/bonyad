<template>
  <div
    class="consulting-page"
  >
    <v-row>
      <v-col
        cols="12"
        class="consulting-msg"
      >
        <p class="consulting-title">
          پیام مشاور
        </p>
        <div
          class="consulting-main"
        >
          <div
            v-if="hasLoaded && news.list && news.list.length"
            class="consulting-message"
          >
            <consultingMessage
              v-for="item in news.list"
              :key="item.id"
              :new-item="item"
            />
          </div>
          <div
            v-else-if="hasLoaded"
            class="no-message"
          >
            <v-alert
              v-if="!news.loading"
              outlined
              type="warning"
              prominent
              border="left"
              max-width="290"
              rounded
            >
              در حال حاضر پیامی موجود نیست :(
            </v-alert>
          </div>
          <div v-if="news.loading" class="loading">
            <v-progress-circular
              indeterminate
              color="#ff8f00"
            />
          </div>
          <div v-if="pagination" v-observe-visibility="visibilityChanged"/>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="false">
      <v-col class="consulting-body">
        <v-row>
          <v-col
            class="content-show text-md-right text-center d-flex flex-column justify-center "
          >
            مشاوره راه ابریشم آلاء
          </v-col>
        </v-row>
        <!--   --------------------------------- video box &&  content list item ------------------------- -->
        <v-row
          class="body-row"
        >
          <v-col
            md="8"
            xs="12"
            cols="12"
            clas="video-box-col"
          >
            <div class="video-box-parent">
              <video-box
                :content="currentContent"
                @favorite="toggleFavor"
                @has_watched="watched"
                :afterLoad="hasLoaded"
              />
            </div>
            <div class="mobile-view">
              <div
                class="current-content-title"
                v-text="currentContent.title"
              />
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
              v-model="currentContent"
              :loading="contentListLoading"
              :afterLoad="hasLoaded"
              :contents="filteredContents"
              :header="{ title: 'لیست فیلم ها'}"
              type="video"
              @input="changeCurrentContent($event.id)"
            >
            </content-list-component>
          </v-col>
        </v-row>
        <!--   --------------------------------- comment box &&  content list item ------------------------- -->
        <v-row>
          <v-col
            md="8"
            cols="12"
          >
            <div class="desktop-view">
              <div class="current-content-title">
                {{ currentContent.title }}
              </div>
              <comment-box
                v-model="comment"
                @input="saveComment"
              />
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import consultingMessage from "@/components/abrisham/consulting/consultingMessage";
import CommentBox from '@/components/abrisham/CommentBox';
import ContentListComponent from '@/components/abrisham/ContentList';
import videoBox from '@/components/abrisham/videoBox';
import {Content, ContentList} from '@/models/Content';
import {LiveDescriptionList} from '@/models/LiveDescription';
import {ObserveVisibility} from 'vue-observe-visibility'
import AbrishamContentMixin from '@/mixin/AbrishamContentMixin'
import Vue from 'vue'

export default {
  layout: 'abrisham',
  name: 'Consulting',
  components: {ContentListComponent, CommentBox, videoBox, consultingMessage},
  mixins: [AbrishamContentMixin],
  data() {
    return {
      news: new LiveDescriptionList(),
      newsNextPage: 1,
      newsLastPage: null,
      pagination: true,
      contents: new ContentList(),
      currentContent: new Content(),
      contentListLoading: false,
      comment: '',
      hasLoaded: false,
    }
  },
  async created() {
    await this.getLoadContents();
  },
  computed: {
    filteredContents() {
      return new ContentList(this.contents.list)
    },
  },
  methods: {
    visibilityChanged(isVisible) {
      if (!isVisible) {
        return
      }
      this.nextPage()
    },
    generateParams() {
      // const param = 'tags[]=مشاوره&order_by[]=created_at&order_type[]=desc&liveDescriptionPage=' + this.newsNextPage;
      const param = 'order_by[]=created_at&order_type[]=desc&liveDescriptionPage=' + this.newsNextPage;
      return param
    },
    nextPage() {
      if (this.newsLastPage !== null && parseInt(this.newsLastPage) < parseInt(this.newsNextPage)) {
        return
      }
      const param = this.generateParams()
      this.news.loading = true
      this.$axios.get('/alaa/api/v2/livedescription', {params: {owner: 2, length: 9999}})
        .then((response) => {
          this.newsNextPage = parseInt(response.data.meta.current_page) + 1
          this.newsLastPage = response.data.meta.last_page
          this.news.add(...response.data.data)
          this.news.loading = false
        })
        .catch(() => {
          this.news.loading = false
        })
    },
    async getLoadContents(setId) {
      let contents = await this.getContentList(setId)
      if (contents.status === 200) {
        this.fillContents(contents.data.data)
        this.setCurrentContent()
        this.contentListLoading = false
        this.hasLoaded = true
      } else {
        this.contentListLoading = false
        this.hasLoaded = true
      }
    },
    fillContents(contents) {
      this.contents = new ContentList(contents)
    },
    async getContentList(setId) {
      return await this.$axios.get('/alaa/api/v2/set/' + 1213 + '/contents')
    },
    setCurrentContent() {
      const currentContent = this.contents.list.find(item => item.type === 8)
      this.changeCurrentContent(currentContent.id)
    },
    changeCurrentContent(id) {
      Vue.set(this, 'currentContent', this.contents.list.find(content => content.id === id))
      this.loadComment(id)
    },
    loadComment(id) {
      this.currentContent = this.contents.list.find(content => content.id === id)
      if (this.currentContent.comments[0]) {
        this.comment = this.currentContent.comments[0].comment
      } else {
        this.comment = ''
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.consulting-page {
  margin: 0 60px;
  @media screen and (max-width: 1904px) {
    margin: 0 10px;
  }
  @media screen and (max-width: 960px) {
    margin: 0;
  }

  .consulting-msg {
    padding-bottom: 0 !important;
    margin-bottom: 30px;
    @media screen and (max-width: 1904px) {
      margin-bottom: 25px;
    }
    @media screen and (max-width: 1200px) {
      margin-bottom: 16px;
    }
    @media screen and (max-width: 990px) {
      margin-bottom: 20px;
    }
    @media screen and (max-width: 768px) {
      padding-right: 0 !important;
    }

    .consulting-title {
      font-size: 20px;
      font-weight: 500;
      color: #3e5480;
      margin-bottom: 20px;
      @media screen and (max-width: 1904px) {
        margin-bottom: 15px;
      }
      @media screen and (max-width: 990px) {
        margin-bottom: 20px;
        text-align: center;
      }
      @media screen and (max-width: 768px) {
        margin-bottom: 15px;
        font-size: 16px;
      }
    }

    .consulting-main {
      height: 190px;
      border-radius: 30px;
      background-color: #eff3ff;
      padding: 20px 0;
      display: flex;
      flex-direction: row;
      overflow: auto;
      @media screen and (max-width: 990px) {
        height: 170px;
        border-radius: 20px;
        padding: 15px 0;
      }
      @media screen and (max-width: 768px) {
        height: 150px;
        width: 100vw;
        border-radius: 0;
      }
      @media screen and (max-width: 576px) {
        height: 162px;
      }
      @media screen and (max-width: 350px) {
        height: 167px;
      }

      .consulting-message {
        display: flex;
        flex-direction: row;
      }

      .no-message {
        margin: auto;
      }

      .loading {
        margin: auto;
      }
    }
  }

  .consulting-body {
    padding-top: 0 !important;

    .content-show {
      font-size: 20px;
      color: #3e5480;
      font-weight: 500;
      margin-bottom: 30px;
      padding: 0px 20px !important;
      @media screen and (max-width: 1904px) {
        margin-bottom: 15px;
      }
      @media screen and (max-width: 1200px) {
        margin-bottom: 10px;
      }
      @media screen and (max-width: 990px) {
        margin-bottom: 20px;
      }
      @media screen and (max-width: 768px) {
        margin-bottom: 15px;
        font-size: 15px;
      }
    }

    .body-row {
      margin-top: 0 !important;

      .video-box-col {
        padding-bottom: 0 !important;

        .video-box-parent {
          margin-bottom: 20px;
          @media screen and (max-width: 1904px) {
            margin-bottom: 15px;
          }
          @media screen and (max-width: 990px) {
            margin-bottom: 20px;
          }
          @media screen and (max-width: 576px) {
            margin-bottom: 10px;
          }
          @media screen and (max-width: 350px) {
            margin-bottom: 5px;
          }
        }
      }

      .mobile-view {
        display: none;
        @media screen and (max-width: 959px) {
          display: block;
        }
      }
    }

    .current-content-title {
      font-size: 20px;
      font-weight: 500;
      color: #3e5480;
      margin-bottom: 21px;
      @media screen and (max-width: 1920px) {
        margin-bottom: 15px;
      }
      @media screen and (max-width: 768px) {
        margin-bottom: 20px;
      }
      @media screen and (max-width: 576px) {
        font-size: 16px;
        margin-bottom: 10px;
      }
      @media screen and (max-width: 350px) {
        margin-bottom: 5px;
      }
    }
  }

  .desktop-view {
    display: block;
    @media screen and (max-width: 959px) {
      display: none;
    }
  }
}
</style>

