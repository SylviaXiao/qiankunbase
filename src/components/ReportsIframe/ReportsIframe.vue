<template>
  <div class="reports-iframe-wrapper">
    <a-spin tip="正在加载中..." :spinning="rpSpinning" style="height: calc(100vh - 180px)">
      <iframe :src="iframeSrc()" @load="postMsg" frameborder="0" ref="rpIframe" id="rpIframe" width="100%" height="calc(100vh - 200px)"></iframe>
    </a-spin>
  </div>
</template>

<script>
import moment from 'moment'
import { mixin } from '@/utils/mixin'

const TEST_SRC = 'http://localhost:8080/common/report?name=fin_profit_date'
export default {
  name: 'ReportsIframe',
  mixins: [mixin],
  props: {
    src: {
      required: true,
      type: String,
      default: null
    },
    perm: {
      type: String,
      default: ''
    },
    date: {
      // month day [1, 5]
      type: [String, Array],
      default: null
    },
    hasUserId: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      iframeSrc: () => {
        const { src, date, getToken, setDate, getSchoolId, getUserId, hasUserId } = this
        return (
          process.env.VUE_APP_URL +
          src +
          `${hasUserId ? `&userId=${getUserId()}` : ''}` +
          `${getSchoolId() ? `&schoolId=${getSchoolId()}` : ''}` +
          `&auth_token=${getToken()}` +
          `${setDate(date)}`
        )
      },
      schoolId: this.getSchoolId()
    }
  },
  created() {
    this.setDate()
  },
  methods: {
    setDate(date) {
      if (!date) return ''
      let startDate = '',
        endDate = ''
      if (typeof date == 'string') {
        startDate = moment()
          .startOf(date)
          .format('YYYY-MM-DD')
        endDate = moment()
          .endOf(date)
          .format('YYYY-MM-DD')
      } else {
        startDate = date[0]
        endDate = date[1]
      }
      return `&startDate=${startDate}&endDate=${endDate}`
    }
  }
}
</script>

<style lang="less" scoped>
.reports-iframe-wrapper {
  /deep/ .ant-spin-container {
    height: 100%;

    iframe {
      height: 100%;
    }
  }
}
</style>
