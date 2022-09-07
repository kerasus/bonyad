<template>
<div>
  <highcharts :options="chartOptions" />
</div>
</template>

<script>
import { Chart } from 'highcharts-vue'
import API_ADDRESS from "assets/Addresses";

export default {
  name: "userResult",
  components: { highcharts: Chart },
  data () {
    return {
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
          text: 'Source: <a href="https://irecusa.org/programs/solar-jobs-census/" target="_blank">IREC</a>'
        },
        yAxis: {
          title: {
            text: 'Number of Employees'
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
      }
    }
  },
  created() {
    this.loadCartData()
    this.getStatistics()
  },
  methods: {
    loadCartData () {
      this.series()
      this.loadxAxis()
    },
    loadxAxis () {
      this.chartOptions.xAxis.categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    series () {
      this.chartOptions.series = [{
        name: 'Installation & Developers',
        data: [43934, 48656, 65165, 81827, 112143, 142383,
          171533, 165174, 155157, 161454, 154610]
      }, {
        name: 'Manufacturing',
        data: [24916, 37941, 29742, 29851, 32490, 30282,
          38121, 36885, 33726, 34243, 31050]
      }, {
        name: 'Sales & Distribution',
        data: [11744, 30000, 16005, 19771, 20185, 24377,
          32147, 30912, 29243, 29213, 25663]
      }, {
        name: 'Operations & Maintenance',
        data: [null, null, null, null, null, null, null,
          null, 11164, 11218, 10077]
      }, {
        name: 'Other',
        data: [21908, 5548, 8105, 11248, 8989, 11816, 18274,
          17300, 13053, 11906, 10073]
      }]
    },
    getStatistics () {
      this.$axios.get(API_ADDRESS.exam.averageRank)
        .then((resp) => {
          console.log(resp.data)
        })
    }
  }
}
</script>

<style scoped>

</style>
