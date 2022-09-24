<template>
  <div>
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
      class="elevation-1"
    />
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
          categories: [],
          accessibility: {
            rangeDescription: 'Range: 2010 to 2020'
          }
        },
        legend: {
          layout: 'vertical',
          align: 'center',
          verticalAlign: 'bottom'
        },
        plotOptions: {
          series: {
            label: {
              connectorAllowed: false
            },
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
    this.getStatistics()
      .then(() => {
        this.setCartData()
      })
  },
  computed: {
    user() {
      return this.$store.getters['Auth/user']
    }
  },
  methods: {
    onChangeMajor () {
      this.getStatistics()
        .then(() => {
          this.setCartData()
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
      this.series(this.flatData.rankChart.map(item=>{
        return {
          name: item.title,
          data: item.data
        }
      }))
    },
    setRankChartAxis() {
      let config = []
      this.flatData.rankChart.forEach(item => {
        config.push(item.title)
      })
      this.loadxAxis(config)
    },
    setUserTable() {
      this.rows = this.flatData.userTable
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
        averageRank: averageRank.data.data
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

</style>
