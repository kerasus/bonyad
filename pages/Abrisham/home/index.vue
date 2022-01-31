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
                    <v-col md="5">

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

                </div>
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col md="4">

        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  layout: 'abrisham',
  components: {
  },
  data () {
    return {
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
      ]
    }
  },
  computed: {
    user () {
      return this.$store.getters["Auth/user"]
    }
  }
}
</script>

<style scoped lang="scss">

$font-color: #3E5480;

.home-container {
  margin-right: 60px;
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
}

.stat-container {
  color: $font-color;
  margin: 0 18px;

  .stat-title {
    font-size: 20px;
  }

  .stat-box {
    background-color: #EFF3FF;
    width: 560px;
    height: 210px;
    margin-top: 20px;
    border-radius: 30px;
    padding: 21px 32px;

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

        ::after {
          content: '';
          width: 20px;
          height: 20px;
          background-color: #fff;
          position: absolute;
        }

        &.active {
          background-color: #FF8F00;
          position: relative;

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
  }
}

</style>
