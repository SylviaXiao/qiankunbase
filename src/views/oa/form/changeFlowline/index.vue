<template>
  <div class="mt20">
    <a-modal title="审批流程" width="700px" :destroyOnClose="true" :visible="showFlowline" @ok="handleFlowlineOk" @cancel="handleFlowlineCancel" :confirm-loading="confirmLoading">
      <div class="cardContent">
        <flow-line :flowLine="flowLine" :isChange="true" />
      </div>
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment'
import FlowLine from '../FlowLine'
import { workFlowProcdefFlowLine } from '@/api/workFlow/request.js'
export default {
  name: 'flowlineList',
  props: ['procdefId', 'formData', 'nodeList'],
  data() {
    return {
      flowLine: [],
      confirmLoading:false,
      showFlowline: false //是否显示审批流程弹出框
    }
  },
  components: {
    FlowLine
  },
  mounted() {},
  created() {},
  computed: {},
  methods: {
    handleFlowlineOk() {
      let flag = false
      this.confirmLoading=true
      let flowLine = JSON.parse(JSON.stringify(this.flowLine))
      flowLine.forEach(item => {
        if (item.type != 'start') {
          item.properties.menbers = item.Allmenbers.filter(element => {
            if (item.AllmenbersKey.includes(element.id)) {
              return item
            }
          })
          if (!flag && item.properties.menbers.length === 0 && item.properties.procdefType.approverEmpty === 'admin') {
            flag = true
          }
          delete item.AllmenbersKey
          delete item.Allmenbers
        }
      })
      if (flag) {
        this.$notification['error']({
          message: '系统通知',
          description: '请选择人员'
        })
      } else {
        this.$emit('submitFormEnd', flowLine)
        this.showFlowline = false
      }
      this.confirmLoading=false
    },
    handleFlowlineCancel() {
      this.showFlowline = false
      this.confirmLoading=false
    },
    open() {
      this.getFlowLine()
      this.showFlowline = true
    },
    getFlowLine() {
      var that = this
      let formData_ = JSON.parse(JSON.stringify(this.formData))
      for (let key in formData_) {
        if (Array.isArray(formData_[key]) || formData_[key] instanceof Object) {
          formData_[key] = JSON.stringify(formData_[key])
        } else {
          formData_[key] = String(formData_[key])
        }
      }
      if (this.nodeList) {
        this.formatFlowLine(this.nodeList || [])
      } else {
        workFlowProcdefFlowLine({
          procdefId: that.procdefId,
          var: formData_
        })
          .then(res => {
            this.formatFlowLine(res.data || [])
          })
          .catch(() => {})
      }
    },
    formatFlowLine(data) {
      data.forEach(item => {
        if (item.type != 'start') {
          item.Allmenbers = item.properties.menbers
          item.AllmenbersKey = item.properties.menbers.map(t => {
            return t.id
          })
        }
      })
      this.flowLine = data
    }
  }
}
</script>
<style lang="less" type="text/less" scoped>
.cardContent {
  padding: 20px;
}
</style>
