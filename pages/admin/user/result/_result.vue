<template>
  <div style="position: relative;">
    <v-overlay :absolute="true"
               :value="statisticsLoading"
    >
      کمی صبر کنید...
    </v-overlay>
    <v-select
      v-model="selectedMajor"
      :items="majors"
      item-text="title"
      item-value="value"
      label="رشته"
      @change="onChangeMajor"
    />
    <highcharts :options="chartOptions" class="mb-10"/>
    <v-card
      class="mx-auto"
      color="#ff8f00"
      dark
      max-width="400"
    >
      <v-card-text class="text-h5 font-weight-bold text-center mb-10">
        میانگین تراز کل : {{ averageRank }}
      </v-card-text>
    </v-card>
    <v-data-table
      :headers="headers"
      :items="rows"
      :items-per-page="5"
      class="elevation-1 userRanksTable"
    />
    <div class="watchTimeCard">
      میزان مشاهده فیلم ها به دقیقه:
      {{ watchTime }}
    </div>
  </div>
</template>

<script>
import {Chart} from 'highcharts-vue'
import API_ADDRESS from "assets/Addresses";

export default {
  name: "moshaverResult",
  components: {highcharts: Chart},
  data() {
    return {
      statisticsLoading: false,
      watchTime: 0,
      selectedMajor: 1,
      majors: [
        {
          title: 'ریاضی',
          value: 1
        },
        {
          title: 'تجربی',
          value: 2
        },
        {
          title: 'انسانی',
          value: 3
        },
        {
          title: 'علوم و معارف اسلامی',
          value: 4
        },
        {
          title: 'زبان',
          value: 5
        },
        {
          title: 'هنر',
          value: 6
        },
      ],
      chartOptions: {
        chart: {
          height: 700,
          style: {
            fontFamily: 'IranSans'
          }
        },
        title: {
          text: 'نمودار مقایسه عملکرد'
        },
        credits: {
          text: 'soalaa.com',
          href: 'https://www.soalaa.com'
        },
        subtitle: {
          text: 'Source: <a href="https://www.soalaa.com" target="_blank">soalaa.com</a>'
        },
        yAxis: {
          title: {
            text: 'تراز های آزمون'
          }
        },
        xAxis: {
          labels: {
            enabled: false
          },
          // categories: [],
          accessibility: {
            description: 'آزمون ها',
            rangeDescription: 'آزمون ها'
          }
        },
        legend: {
          layout: 'vertical',
          align: 'center',
          verticalAlign: 'bottom'
        },
        plotOptions: {
          series: {
            relativeXValue: true
            // pointStart: 2010
          }
        },
        series: [],
        responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }]
        }
      },
      flatData: {},
      rankChart: [],
      userTable: [],
      averageRank: [],
      headers: [
        {
          text: 'نام آزمون',
          align: 'center',
          value: 'title',
        },
        {text: 'عربی', value: 'lessons.arabi'},
        {text: 'فارسی', value: 'lessons.farsi'},
        {text: 'ریاضی', value: 'lessons.riazi'},
        {text: 'شیمی', value: 'lessons.shimi'}
      ],
      rows: [],
    }
  },
  created() {
    this.statisticsLoading = true
    this.getStatistics()
      .then(() => {
        this.statisticsLoading = false
        this.setCartData()
      })
      .catch(()=>{
        this.statisticsLoading = false
      })
  },
  computed: {
    user() {
      return this.$store.getters['Auth/user']
    }
  },
  methods: {
    onChangeMajor() {
      this.statisticsLoading = true
      this.getStatistics()
        .then(() => {
          this.statisticsLoading = false
          this.setCartData()
        })
        .catch(()=>{
          this.statisticsLoading = false
        })
    },
    getUserOfBonyadId() {
      return this.$route.params.result ? this.$route.params.result : this.user.id
    },
    setCartData() {
      this.setRankChart()
      this.setUserTable()
      this.setAverageRank()
    },
    loadxAxis(data) {
      this.chartOptions.xAxis.categories = data
    },
    series(data) {
      this.chartOptions.series = data
    },
    setRankChart() {
      this.setRankChartSeries()
      this.setRankChartAxis()
    },
    setRankChartSeries() {
      const seriesData = this.flatData.rankChart.map(item => {
        let counter = 1
        return {
          name: item.title,
          data: item.data.map(dataItem => {
            return {
              name: dataItem.title,
              x: counter++,
              y: dataItem.value
            }
          })
        }
      })
      this.series(seriesData)
    },
    setRankChartAxis() {
      let config = []
      this.flatData.rankChart.forEach(item => {
        config.push(item.title)
      })
      this.loadxAxis(config)
    },
    setUserTable() {
      this.flatData.userTable.forEach(row => {
        row.lessons.forEach(lesson => {
          row[lesson.title] = lesson.value
        })
      })
      this.rows = this.flatData.userTable
      this.headers = this.getAllHeadersFromRanks(this.rows)
    },
    getAllHeadersFromRanks(ranks) {
      const allHeaders = [{
        text: 'نام آزمون',
        align: 'center',
        value: 'title',
      }]
      ranks.forEach(exam => {
        exam.lessons.forEach(lesson => {
          if (!allHeaders.find(header => header.text === lesson.title)) {
            allHeaders.push({
              text: lesson.title,
              value: lesson.title
            })
          }
        })
      })

      return allHeaders
    },
    setAverageRank() {
      this.averageRank = this.flatData.averageRank
    },
    async getStatistics() {
      const [rankChart, userTable, averageRank] = await Promise.all([
        this.getRankChart(),
        this.getUserTable(),
        this.getAverageRank()
      ])
      this.flatData = {
        rankChart: rankChart.data.data,
        userTable: userTable.data.data,
        averageRank: averageRank.data[0].data
      }
    },
    getRankChart() {
      const id = this.getUserOfBonyadId()
      return this.$axios.get(API_ADDRESS.exam.getRankChart(id, this.selectedMajor))
    },
    getUserTable() {
      const id = this.getUserOfBonyadId()
      return this.$axios.get(API_ADDRESS.exam.getUserRank(id, this.selectedMajor))
    },
    getAverageRank() {
      const id = this.getUserOfBonyadId()
      return this.$axios.get(API_ADDRESS.exam.getAverageRank(id, this.selectedMajor))
    }
  }
}
</script>

<style scoped>
.watchTimeCard {
  padding: 10px;
  margin: 30px 20px;
  border-radius: 6px;
  background-color: #f7941d;
  color: white;
}
</style>

<style lang="scss">
.userRanksTable {
  tbody {
    tr {
      td:not(:first-child) {
        direction: ltr;
        text-align: right;
      }
    }
  }
}
</style>
