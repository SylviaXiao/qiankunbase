<template>
  <div class="f-charts-wrapper">
    <div class="charts-main" :id="chartsId"></div>
  </div>
</template>

<script>
import { DEFAULT_BAR_OPTION, DEFAULT_LINE_OPTION } from './chartsOptions'

export default {
  name: 'FCharts',
  props: {
    type: {
      type: String,
      required: true,
      default: 'bar',
      validator: value => {
        return value === 'line' ? 'line' : 'bar'
      }
    },
    data: {
      type: Array,
      required: true,
      default: () => []
    },
    format: {
      type: Object,
      default: () => {}
    },
    tooltip: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      chartsId: `charts${Math.floor(Math.random() * 100000000000000)}`
    }
  },
  mounted() {
    this.initCharts()
  },
  methods: {
    initCharts() {
      const { chartsId, formatData } = this
      const dom = document.getElementById(chartsId)
      const myCharts = this.$charts.init(dom)
      const chartsOption = formatData()
      myCharts.setOption(chartsOption)
    },
    formatData() {
      const { data, format, type, tooltip } = this
      const x = [],
        y = []
      data.map(item => {
        Object.keys(item).forEach(value => {
          if (value === format.x) {
            x.push(item[value])
          }
          if (value === format.y) {
            y.push(item[value])
          }
        })
      })
      const option = type === 'bar' ? DEFAULT_BAR_OPTION : type === 'line' ? DEFAULT_LINE_OPTION : {}
      option.xAxis[0] ? (option.xAxis[0].data = x) : (option.xAxis.data = x)
      option.series[0].data = y
      option.series[0].name = tooltip
      return option
    }
  }
}
</script>

<style lang="less" scoped>
.charts-main {
  height: 400px;
}
</style>
