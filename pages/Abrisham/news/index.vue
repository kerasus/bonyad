<template>
  <div class="news-page">
    <v-row>
      <v-col
        :xl="bannerImages.length > 0 ? 8 : 12"
        :lg="bannerImages.length > 0 ? 9 : 12"
        order-lg="1"
        order="2"
      >
        <div
          class="news-part"
        >
          <v-row>
            <v-col
              cols="12"
              class="news-top"
            >
              <div class="news-header">
                <div class="news-filter">
                  <div class="news-title">
                    <p>
                      اخبار و اطلاعیه ها
                    </p>
                  </div>
                  <div class="filter-select">
                    <v-btn
                      depressed
                      class="filter-default"
                      :class="{'filter-button':!doFilter , 'filter-clicked':doFilter}"
                      @click="clicked"
                    >
                      فیلترها
                      <i class="fi fi-rr-settings-sliders icon"/>
                    </v-btn>
                    <div class="order-parent">
                      <v-select
                        solo
                        append-icon="mdi-chevron-down"
                        dense
                        background-color="#eff3ff"
                        flat
                        placeholder="مرتب کردن بر اساس"
                        label="مرتب کردن بر اساس"
                        class="order"
                        v-model="filtersData.sort"
                        :menu-props="{ bottom: true, offsetY: true }"
                        :items="sorts"
                        return-object
                        item-text="text"
                        item-value="value"
                        @change="selectedItem"
                        :loading="unpinNews.loading"
                        :disabled="unpinNews.loading"
                      />
                    </div>
                  </div>
                </div>
                <div
                  v-if="doFilter"
                  class="filter-list"
                >
                  <div class="lesson-parent">
                    <v-autocomplete
                      solo
                      append-icon="mdi-chevron-down"
                      dense
                      background-color="#eff3ff"
                      flat
                      label="درس"
                      placeholder="درس"
                      class="lesson"
                      v-model="filtersData.lesson"
                      :menu-props="{ bottom: true, offsetY: true }"
                      :items="lessons"
                      return-object
                      item-text="title"
                      item-key="id"
                      @change="selectedItem"
                      :loading="unpinNews.loading"
                      :disabled="unpinNews.loading"
                    />
                  </div>
                  <div class="category-parent">
                    <v-select
                      solo
                      append-icon="mdi-chevron-down"
                      dense
                      background-color="#eff3ff"
                      flat
                      v-model="filtersData.category"
                      label="دسته بندی"
                      placeholder="دسته بندی"
                      class="category"
                      :menu-props="{ bottom: true, offsetY: true }"
                      :items="categories"
                      @change="selectedItem"
                      :loading="unpinNews.loading"
                      :disabled="unpinNews.loading"
                    />
                  </div>
                </div>
              </div>
            </v-col>
            <v-col
              cols="12"
              class="news-bottom"
            >
              <news-list
                :news="pinNews"
                :pin="true"
                @observe="getNewPinLiveDesctiption"
                @showMore="seen"
              />
              <v-divider class="my-2"/>
              <news-list
                :news="unpinNews"
                :pin="false"
                @observe="getNewUnpinLiveDesctiption"
                @showMore="seen"
              />
            </v-col>
          </v-row>
        </div>
      </v-col>
      <v-col
        v-if="bannerImages.length > 0"
        xl="4"
        lg="3"
        cols="12"
        order-lg="2"
        order="1"
        class="banner-col"
      >
        <div class="banner-part">
          <div class="banner">
            <div
              v-for="(item , index) in bannerImages"
              :key="index"
            >
              <NewsBanner
                :bannerData="item"
              />
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import NewsList from "@/components/abrisham/news/NewsList";
import NewsBanner from "@/components/abrisham/news/NewsBanner";
import {LiveDescriptionList} from '@/models/LiveDescription';

export default {
  name: "News",
  layout: 'abrisham',
  components: {NewsList, NewsBanner},
  data() {
    return {
      pinNews: new LiveDescriptionList(),
      pinNewsNextPage: 1,
      pinNewsLastPage: null,
      unpinNews: new LiveDescriptionList(),
      unpinNewsNextPage: 1,
      unpinNewsLastPage: null,
      doFilter: false,
      banner: true,
      filtersData: {
        sort: {
          value: 'created_at-desc',
          text: 'جدیدترین ها',
          key: 'created_at',
          type: 'desc'
        },
        category: null,
        lesson: null,
      },
      sorts: [
        {
          value: 'created_at-desc',
          text: 'جدیدترین ها',
          key: 'created_at',
          type: 'desc'
        },
        {
          value: 'created_at-asc',
          text: 'قدیمی ترین ها',
          key: 'created_at',
          type: 'asc'
        },
        {
          value: 'seen_counter-desc',
          text: 'پربازدید ترین ها',
          key: 'seen_counter',
          type: 'desc'
        },
      ],
      lessons: [
        {
          "id": 347,
          "title": "راه ابریشم ریاضی تجربی آلاء"
        },
        {
          "id": 439,
          "title": "راه ابریشم ریاضیات ریاضی آلاء"
        },
        {
          "id": 440,
          "title": "راه ابریشم فیزیک آلاء"
        },
        {
          "id": 441,
          "title": "راه ابریشم فیزیک آلاء"
        },
        {
          "id": 442,
          "title": "راه ابریشم زیست شناسی آلاء"
        },
        {
          "id": 443,
          "title": "راه ابریشم شیمی آلاء"
        },
        {
          "id": 445,
          "title": "پک اختصاصی راه ابریشم رشته تجربی آلاء"
        },
        {
          "id": 446,
          "title": "پک اختصاصی راه ابریشم رشته ریاضی آلاء"
        },
        {
          "id": 569,
          "title": "راه ابریشم زبان انگلیسی آلاء"
        },
        {
          "id": 570,
          "title": "راه ابریشم دین و زندگی آلاء"
        },
        {
          "id": 571,
          "title": "راه ابریشم عربی آلاء"
        },
        {
          "id": 572,
          "title": "راه ابریشم ادبیات آلاء"
        },
        {
          "id": 573,
          "title": "پک راه ابریشم عمومی آلاء"
        }
      ],
      categories: [
        'همه',
        'مشاوره',
        'اطلاعیه',
        'انتشار',
      ],
      bannerImages: [],
    }
  },
  methods: {
    getNewPinLiveDesctiption() {
      if (this.pinNewsLastPage !== null && parseInt(this.pinNewsLastPage) < parseInt(this.pinNewsNextPage)) {
        return
      }
      this.pinNews.loading = true
      this.$axios.get('/alaa/api/v2/livedescription/getPined?liveDescriptionPage=' + this.pinNewsNextPage)
        .then((response) => {
          this.pinNewsNextPage = parseInt(response.data.meta.current_page) + 1
          this.pinNewsLastPage = response.data.meta.last_page
          this.pinNews.add(...response.data.data)
          this.pinNews.loading = false
        })
        .catch(() => {
          this.pinNews.loading = false
        })
    },
    getNewUnpinLiveDesctiption() {
      if (this.unpinNewsLastPage !== null && parseInt(this.unpinNewsLastPage) < parseInt(this.unpinNewsNextPage)) {
        return
      }
      const params = this.generateParams()
      this.unpinNews.loading = true
      this.$axios.get('/alaa/api/v2/livedescription?' + params)
        .then((response) => {
          this.unpinNewsNextPage = parseInt(response.data.meta.current_page) + 1
          this.unpinNewsLastPage = response.data.meta.last_page
          this.unpinNews= new LiveDescriptionList(response.data.data)
          this.unpinNews.loading = false
        })
        .catch(() => {
          this.unpinNews.loading = false
        })
    },
    clicked() {
      this.doFilter = !this.doFilter;
    },
    generateParams() {
      const params = []
      if (
        this.filtersData.lesson &&
        this.filtersData.lesson.id !== null &&
        typeof this.filtersData.lesson.id !== 'undefined'
      ) {
        params.push({
          key: 'product_id',
          value: this.filtersData.lesson.id
        })
      }

      if (this.filtersData.category && this.filtersData.category !== 'همه') {
        params.push({
          key: 'tags[]',
          value: this.filtersData.category
        })
      }
      if (this.filtersData.sort) {
        params.push({
          key: 'order_by[]',
          value: this.filtersData.sort.key
        })
        params.push({
          key: 'order_type[]',
          value: this.filtersData.sort.type
        })
      }

      params.push({
        key: 'liveDescriptionPage',
        value: this.unpinNewsNextPage
      })

      params.push({
        key: 'owner',
        value: 2
      })


      return params.map(item => item.key + '=' + item.value).join('&')
    },
    selectedItem() {
      this.unpinNewsNextPage = 1
      this.unpinNews = new LiveDescriptionList()
      this.getNewUnpinLiveDesctiption()
    },
    seen(liveDescriptionId) {
      this.$axios.get('/alaa/api/v2/livedescription/' + liveDescriptionId + '/seen')
        .then((response) => {
        })
        .catch(() => {
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.news-page {
  margin: 0 60px;
  @media screen and (max-width: 1904px) {
    margin: 0 21px;
  }
  @media screen and (max-width: 1264px) {
    margin: 0 11px;
  }
  @media screen and (max-width: 960px) {
    margin: 0 6px;
  }

  .news-part {
    margin-left: 9px;
    @media screen and (max-width: 1904px) {
      margin-left: -4px;
    }
    @media screen and (max-width: 1264px) {
      margin-left: 0;
    }

    .news-top {
      padding-bottom: 0 !important;

      .news-header {
        align-items: center;

        .news-filter {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          @media screen and (max-width: 960px) {
            flex-direction: column !important;
          }

          .news-title {
            font-size: 20px;
            font-weight: 500;
            color: #3e5480;
            @media screen and (max-width: 960px) {
              font-size: 16px !important;
              text-align: center;
            }
          }

          .filter-select {
            display: flex;
            flex-direction: row;
            @media screen and (max-width: 960px) {
              justify-content: space-between !important;
            }

            .filter-default {
              width: 119px;
              height: 48px;
              color: #3e5480;
              font-size: 16px;
              font-weight: 500;
              border-radius: 10px;
              margin-left: 16px;
              justify-content: space-between;
              @media screen and (max-width: 1264px) {
                height: 40px !important;
              }
              @media screen and (max-width: 960px) {
                width: 100px !important;
                height: 36px;
                font-size: 14px !important;
              }
              @media screen and (max-width: 768px) {
                width: 100px !important;
              }

              &.filter-button {
                background-color: #eff3ff;
              }

              &.filter-clicked {
                border: solid 4px #eff3ff;
                box-sizing: border-box;
                background-color: #ffffff;
              }

              .fi {
                font-size: 16px;
                font-weight: 500;
              }
            }

            .order-parent {
              width: 165px;
              @media screen and (max-width: 768px) {
                width: 134px !important;
              }

              .order {
                border-radius: 10px;
              }
            }
          }
        }
      }

      .filter-list {
        display: flex;
        flex-direction: row;
        @media screen and (max-width: 960px) {
          justify-content: space-between;
        }

        .lesson-parent {
          .lesson {
            margin-left: 16px;
            border-radius: 10px;
          }
        }

        .category-parent {
          width: 245px;

          .category {
            border-radius: 10px;
          }
        }
      }
    }

    .news-bottom {
      padding-top: 0 !important;
    }
  }

  .banner-col {
    padding-bottom: 0 !important;

    .banner-part {
      display: flex;
      flex-direction: column;
      @media screen and (max-width: 1264px) {
        display: grid;
        grid-template-rows: auto;
        overflow: hidden;
      }

      .banner {
        margin-bottom: 20px;
        @media screen and (max-width: 1264px) {
          margin-bottom: 5px !important;
          overflow-x: scroll;
          overflow-y: hidden;
          display: flex;
          grid-row-start: 2;
        }
        @media screen and (max-width: 960px) {
          margin-bottom: 0 !important;
        }
        @media screen and (max-width: 600px) {
          margin-bottom: 0 !important;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.news-page {
  .news-part {
    .news-header {
      .mdi-chevron-down {
        &:before {
          color: #3e5480;
        }
      }

      .v-select {
        &.v-input--dense {
          .v-select__selection--comma {
            color: #3e5480;
            font-size: 16px;
            font-weight: 500;
          }
        }
      }

      .v-text-field {
        &.v-text-field--solo {
          &.v-input--dense {
            > {
              .v-input__control {
                min-height: 48px !important;
                @media screen and (max-width: 1264px) {
                  min-height: 40px !important;
                }
                @media screen and (max-width: 768px) {
                  min-height: 36px !important;
                }
              }
            }
          }
        }
      }
    }

    .theme--light {
      &.v-label {
        color: #3e5480;
        font-size: 16px;
        font-weight: 500;
        @media screen and (max-width: 768px) {
          font-size: 14px;
        }
      }

      &.v-icon {
        color: #3e5480;
      }
    }
  }
}

.v-menu__content {
  border-radius: 0 0 20px 20px;
}
</style>
