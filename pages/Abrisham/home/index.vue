<template>
  <div class="home">
    <v-container fluid class="home-container">
      <v-row>
        <v-col md="8">
          <v-row>
            <v-col md="6" class="d-flex flex-row align-center">
              <v-avatar size="90">
                <img
                  :src="user.photo"
                >
              </v-avatar>
              <div class="greeting-container">
                <span class="hello-text">سلام {{user.last_name}} عزیز!</span>
                <span class="greeting-text">به کاروانسرای راه ابریشم آلاء خوش اومدی</span>
              </div>
            </v-col>
            <v-col md="6" class="d-flex flex-row-reverse justify-start">
              <div class="info-box thin">
                <div class="header green-color">آبان</div>
                <div class="body">۱۷</div>
              </div>
              <div class="info-box thick">
                <div class="header yellow-color">روز شمار آزمون سه آ</div>
                <div class="body"> ۲۹ <span> روز مانده </span></div>
              </div>
              <div class="info-box thick">
                <div class="header orange-color">روز شمار کنکور ۱۴۰۱</div>
                <div class="body"> ۲۸۲ <span> روز مانده </span></div>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="12" class="overall-stats">
              وضعیت کلی
            </v-col>
            <v-col md="6" :style="{ padding: '12px 0' }">
              <div class="stat-container">
                <div class="stat-title">
                  مسیر طی شده در راه ابریشم
                </div>
                <div class="stat-box">
                  <v-row>
                    <v-col md="7">
                      <div class="d-flex flex-column justify-space-around">
                        <div class="stat">
                          <span class="number">
                            ۴۷
                          </span>
                          <span class="text">
                            امین روز شروع راه ابریشم آلاء
                          </span>
                        </div>
                        <div class="stat">
                          <span class="number">
                            ۳۲
                          </span>
                          <span class="text">
                            امین روز ورود من به راه ابریشم
                          </span>
                        </div>
                        <div class="farsang-line">
                          <div :class="{ 'active': farsang.active }" class="farsang" v-for="(farsang, index) in farsangs" :key="index">
                            <span v-if="farsang.active">{{ farsang.name }}</span>
                          </div>
                        </div>
                      </div>
                    </v-col>
                    <v-col md="5" class="d-flex justify-center align-center">
                      <v-progress-circular
                        :rotate="270"
                        :size="165"
                        :width="20"
                        :value="35"
                        color="#FF8F00"
                      >
                        <span class="percent">۳۵٪</span>
                        <span class="label">دیده شده</span>
                      </v-progress-circular>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </v-col>
            <v-col md="6">
              <div class="stat-container">
                <div class="stat-title">
                  مسیر طی شده در فرسنگ
                </div>
                <div class="stat-box">
                  <v-row>
                    <v-col md="7">
                      <div class="d-flex flex-column justify-space-around">
                        <div class="d-flex flex-row align-center farsang-detail-container">
                          <v-avatar size="70">
                            <img
                              :src="user.photo"
                            >
                          </v-avatar>
                          <div class="farsang-detail">
                            <span class="farsang-title">فرسنگ دوم راه ابریشم آلاء</span>
                            <span class="farsang-city">شهر دان هوانگ - چین</span>
                          </div>
                        </div>
                        <div class="stat">
                          <span class="number">
                            ۳۲
                          </span>
                          <span class="text">
                            امین روز ورود من به راه ابریشم
                          </span>
                        </div>
                      </div>
                    </v-col>
                    <v-col md="5" class="d-flex justify-center align-center">
                      <v-progress-circular
                        :rotate="270"
                        :size="165"
                        :width="20"
                        :value="100"
                        color="#60BEA1"
                      >
                        <span class="percent">۱۰۰٪</span>
                        <span class="label">دیده شده</span>
                      </v-progress-circular>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </v-col>
            <v-col md="12">
              <swiper v-if="products[0]" :perPage="4" dir="rtl" :options="swiperOptions">
                <swiper-slide v-for="product in products" :key="product.id">
                  <product-item  :product="product" :style="{ margin: '0 10px 10px' }" />
                </swiper-slide>
                <div class="swiper-button-prev" slot="button-prev"></div>
                <div class="swiper-button-next" slot="button-next"></div>
              </swiper>
            </v-col>
          </v-row>
        </v-col>
        <v-col md="4" class="d-flex flex-column">
          <news-list
            :header="{ title: 'آخرین اخبار' }"
            :loading="contentListLoading"
            :afterLoad="hasLoaded"
            :news-list="news"
          />
          <content-list-component
            :header="{ title: 'برنامه مطالعاتی' }"
            :loading="contentListLoading"
            :afterLoad="hasLoaded"
            :contents="contents"
            type="pamphlet"
            :style="{ marginTop: '32px' }"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src

import ProductItem from "@/components/abrisham/ProductItem";
import NewsList from "@/components/abrisham/NewsList";
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import ContentListComponent from '@/components/abrisham/ContentList';
import {ContentList} from "@/models/Content";


export default {
  name: 'Home',
  layout: 'abrisham',
  components: {
    ProductItem,
    Swiper,
    SwiperSlide,
    ContentListComponent,
    NewsList
  },
  directives: {
    swiper: directive
  },
  data () {
    return {
      news: [],
      contents: new ContentList(),
      contentListLoading: false,
      hasLoaded: false,
      farsangs: [
        {
          name: 'فرسنگ ۲',
          active: false
        },
        {
          name: 'فرسنگ ۲',
          active: true
        },
        {
          name: 'فرسنگ ۲',
          active: false
        },
        {
          name: 'فرسنگ ۲',
          active: false
        },
        {
          name: 'فرسنگ ۲',
          active: false
        },
        {
          name: 'فرسنگ ۲',
          active: false
        },
        {
          name: 'فرسنگ ۲',
          active: false
        },
        {
          name: 'فرسنگ ۲',
          active: false
        },
        {
          name: 'فرسنگ ۲',
          active: false
        },
      ],
      products: [],
      swiperOptions: {
        slidesPerView: 4,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      }
    }
  },
  computed: {
    user () {
      return this.$store.getters["Auth/user"]
    }
  },
  created() {
    this.$axios.get('alaa/api/v2/product').then(response => {
      this.products = response.data.data
    })
    this.$axios.get('alaa/api/v2/set/727/contents').then(response => {
      this.contents = new ContentList(response.data.data)
      this.hasLoaded = true
    })

    this.$axios.get('/alaa/api/v2/livedescription?order_by[]=created_at&order_type[]=desc&liveDescriptionPage=1').then(response => {
      this.news = response.data.data
    })
  }
}
</script>

<style scoped lang="scss">

$font-color: #3E5480;

.home-container {
  margin-left: 60px;
}

.greeting-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 20px;

  .hello-text {
    color: $font-color;
    font-size: 24px;
    font-weight: 500;
  }

  .greeting-text {
    font-size: 20px;
    font-weight: 500;
    color: #9fa5c0;
    margin-top: 8px;
  }
}

.info-box {
  height: 120px;
  margin: 0 12px;
  border-radius: 30px;
  background-color: #fff;
  min-width: 120px;
  box-shadow: 0 3px 5px rgba(64, 64, 64, 0.1);
  overflow: hidden;

  &.thin {
    width: 120px;
  }

  &.thick {
    width: 184px;
  }

  .header {
    height: 42px;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    word-wrap: unset;

    &.green-color {
      background-color: #60BEA1;
      color: #fff;
    }

    &.yellow-color {
      background-color: #FCD332;
      color: $font-color;
    }

    &.orange-color {
      background-color: #FF8F00;
      color: #fff;
    }
  }

  .body {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 36px;
    font-weight: 700;
    color: $font-color;
    height: 78px;

    span {
      font-size: 16px;
      font-weight: 500;
      margin-right: 8px;
    }
  }
}

.overall-stats {
  color: $font-color;
  font-size: 20px;
  margin-right: 8px;
}

.stat-container {
  color: $font-color;
  margin: 0 18px;

  .stat-title {
    font-size: 20px;
  }

  .stat-box {
    background-color: #EFF3FF;
    width: 530px;
    height: 210px;
    margin-top: 20px;
    border-radius: 30px;
    padding: 21px 21px;

    .stat {
      background-color: #fff;
      color: $font-color;
      font-size: 14px;
      width: 260px;
      height: 40px;
      border-radius: 30px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      margin: 8px 0;

      .number {
        font-size: 16px;
        background-color: #eff3ff;
        height: 24px;
        width: 40px;
        border-radius: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 8px;
      }
    }

    .farsang-line {
      display: flex;
      flex-direction: row;
      width: 264px;
      justify-content: space-around;
      margin-top: 28px;

      .farsang {
        background: #fff;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        position: relative;
        z-index: 2;

        &:last-child::before {
          display: none;
        }

        &::before {
          content: '';
          width: 20px;
          height: 4px;
          top: 5px;
          right: 10px;
          background-color: #fff;
          z-index: -1;
          position: relative;
          display: block;
        }

        &.active {
          background-color: #FF8F00;

          span {
            font-size: 12px;
            position: absolute;
            bottom: 20px;
            width: 50px;
            right: -10px;
          }
        }
      }
    }

    .farsang-detail-container {
      margin-bottom: 30px;

      .farsang-detail {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-right: 16px;

        .farsang-title {
          font-size: 18px;
        }

        .farsang-city {
          margin-top: 4px;
          color: #9FA5C0;
        }
      }
    }
  }
}

</style>

<style lang="scss">
$font-color: #3E5480;


.stat-box .v-progress-circular__underlay {
  stroke: #fff !important;
}

.stat-box .v-progress-circular__info {
  display: flex;
  flex-direction: column;

  .percent {
    font-size: 30px;
    font-weight: 700;
    color: $font-color;
    margin-top: 14px;
    line-height: 25px;
  }

  .label {
    font-size: 14px;
    color: #9FA5C0;
  }
}

.home-container .swiper-button-disabled {
  display: none;
}

.home-container .swiper-button-next {
  background: linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 70%, rgba(255,255,255,0) 100%);
  height: 100%;
  top: 20px;
  width: 100px;
  left: -30px;
}

.home-container .swiper-button-next::after {
  width: 40px !important;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #EFF3FF;
  color: #3E5480 !important;
  font-size: 12px;
  font-weight: bold;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;

}

.home-container .swiper-button-prev {
  background: linear-gradient(270deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 70%, rgba(255,255,255,0) 100%);
  height: 100%;
  top: 20px;
  width: 100px;
  right: -30px;
}

.home-container .swiper-button-prev::after {
  width: 40px !important;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #EFF3FF;
  color: #3E5480 !important;
  font-size: 12px;
  font-weight: bold;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;

}
</style>
