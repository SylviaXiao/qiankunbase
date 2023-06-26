<template>
  <div>
    <el-card shadow="never">
      <el-row>
        <el-col :span="24">
          <h4 v-if="task.nodeName && showTotal">{{ task.nodeName }}</h4>
          <div>
            <el-avatar style="background-color: #19a97b;">{{
              undo.userName && undo.userName.length > 3 ? undo.userName.substring(2) : undo.userName
            }}</el-avatar>
          </div>
          <span style="font-size: 12px;color: #8492a6;">
            <span>{{ undo.userName }}</span>
            <span v-if="undo.roleName">（{{ undo.roleName }}）</span>
            <span :style="`color:${approverNodeColor(undo)}`">({{ getUndoStateName() }})</span>
            <br />
          </span>
        </el-col>
        <el-col :span="24" style="text-align: left;color: rgb(192, 196, 204)">
          {{ formatDate(undo.assertionTime) }}
        </el-col>
        <el-col v-if="undo.suggest" :span="16" style="padding: 5px 5px 5px 0;color: #1BA97B;font-size: 12px;">
          <span> {{ undo.suggest }}</span>
          <template v-if="undo.remark">
            <span style="font-size:12px;">{{ undo.remark }}</span>
            <br />
          </template>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import moment from 'moment'

export default {
  /**
   * 组件名称
   */
  name: 'ApproverNode',
  props: {
    undo: Object,
    task: Object,
    showTotal: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      State: {
        WAIT_HANDLE: {
          value: 0,
          name: '等待处理'
        },
        READED: {
          value: 1,
          name: '已读'
        },
        AGREE: {
          value: 2,
          name: '同意'
        },
        REFUSE: {
          value: 3,
          name: '拒绝'
        },
        ASSIGNOR: {
          value: 4,
          name: '委托'
        },
        OVERDUE: {
          value: 5,
          name: '已过期'
        }
      }
    }
  },

  created() {},

  computed: {},
  methods: {
    approverNodeColor(undo) {
      var result = '#8492a6'
      if (undo.result == 3) {
        //拒绝
        result = '#F56C6C'
      } else if (undo.result == 5) {
        //过期
        result = '#F56C6C'
      }
      return result
    },
    getUndoStateName() {
      var result = ''
      for (var key in this.State) {
        if (this.State[key].value == this.undo.result) {
          result = this.State[key].name
          break
        }
      }
      return result
    },
    formatDate(timestamp) {
      if(timestamp)return moment(new Date(timestamp)).format('YYYY-MM-DD HH:mm:ss')
      return ''
    }
  },
  watch: {
    undo: {
      handler: function(val) {
        var that = this

        that.undo = val
      },
      immediate: true,
      deep: true
    },
    task: {
      handler: function(val) {
        var that = this
        that.task = val
        if (that.task.undos && Array.isArray(that.task.undos) && that.task.undos.length > 0) {
          that.task.undos.forEach(item => {
            if (item.listRoleName && Array.isArray(item.listRoleName) && item.listRoleName.length > 0) {
              item.roleName = item.listRoleName.join('/  ')
            }
          })
        }
      },
      immediate: true,
      deep: true
    }
  },
  components: {}
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
