<template>
  <div>
    <el-card shadow="never">
      <el-row>
        <el-col :span="6">
          <h4>
            发起申请
            <a href="#" class="ml10" @click="getProcinstLogList()">查看版本</a>
          </h4>
          <span style="font-size: 12px;color: #8492a6;">
            {{ getSenderName() }}
          </span>
        </el-col>
        <el-col :span="24" style="text-align: left;color: rgb(192, 196, 204)">
          {{ formatDate(node.createTime) }}
        </el-col>
      </el-row>
    </el-card>

    <!-- 审核报表 -->
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" :width="1600" title="查看版本" :visible="visible" @cancel="handleCancel">
      <div class="top">
        <div v-if="visible" style="width: 50%;">
          <div style="text-align: center; background: #F7F7F7; padding: 10px;">上一版本</div>
          <workFlowData v-if="oldData.flowVal" :procinst="oldData" :confGlobal="_confGlobal"></workFlowData>
        </div>
        <div v-if="visible" style="width: 50%;">
          <div style="text-align: center; background: #F7F7F7; padding: 10px;">当前版本</div>
          <workFlowData v-if="newData.flowVal" :procinst="newData" :oldProcinst="oldData" :confGlobal="_confGlobal" :compare="true"></workFlowData>
        </div>
      </div>
      <template slot="footer">
        <a-button key="back" @click="handleCancel">
          关闭
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment'
import workFlowData from '@/views/oa/view/workFlowData/index.vue'
import { getProcinstLogList } from '@/api/workFlow/request'
import PermBox from '@/components/PermBox'

export default {
  /**
   * 组件名称
   */
  name: 'StartNode',
  props: {
    node: Object,
    procinst: Object,
    confGlobal: Object
  },
  data() {
    return {
      visible: false,
      newData: {},
      oldData: {},
      _confGlobal: {}
    }
  },
  components: {
    workFlowData,
    PermBox
  },

  created() {},

  computed: {},

  methods: {
    formatDate(timestamp) {
      return moment(new Date(timestamp)).format('YYYY-MM-DD HH:mm:ss')
    },

    getSenderName() {
      var result = this.node.senderName

      if (top.SessionUtils) {
        if (this.node.senderId == top.SessionUtils.getLoginUser().userId) {
          result = '我'
        }
      }

      return result
    },

    getProcinstLogList() {
      getProcinstLogList({ userId: this.node.senderId, procinstId: this.procinst.id, creatTime: this.node.createTime }).then(res => {
        if (res.data[0] && res.data[0].flowVal) {
          this.newData = Object.assign({}, this.procinst, { flowVal: res.data[0].flowVal })
        }
        if (res.data[1] && res.data[1].flowVal) {
          this.oldData = Object.assign({}, this.procinst, { flowVal: res.data[1].flowVal })
        }

        this.visible = true
      })
    },
    handleCancel() {
      this.visible = false
    }
  },

  watch: {
    node: {
      handler: function(val) {
        var that = this

        that.node = val
      },
      immediate: true,
      deep: true
    },
    confGlobal: {
      handler(n, o) {
        this._confGlobal = JSON.parse(JSON.stringify(this.confGlobal))
        const formatFunc = fields => {
          fields.forEach(item => {
            if (item.formOperatesType == 2) item.show = true
          })
          if (fields.children && fields.children.length > 0) {
            formatFunc(fields.children)
          }
        }
        formatFunc(this._confGlobal.fields)
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
<style lang="stylus">

.flow-line {
    .el-card__body{
        padding: 5px;
    }

    h4{
        margin-top: 0px;
        margin-bottom: 0px;
    }

    .el-card{
        border-left: 0px;
        border-right: 0px;
        border-top: 0px;
        border-bottom: 0px;
    }

    .next-line{
        color: #C0C4CC;
        text-align: center;
        width: 15px;
        font-size: 14px;
        display: inline-block;
    }

    .el-timeline-item{
        padding-bottom: 10px!important;
    }

    .title {
        color: #8492a6;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 10px;
        // text-align: center;
    }

    .add-require {
        color: #F56C6C!important;
    }

    .close-btn{
        width: 40px;
        height: 14px;
        display: inline-block;
        position: absolute;
        top: -2px;
    }
}
</style>
