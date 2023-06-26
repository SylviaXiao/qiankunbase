<template>
  <div>
    <el-card shadow="never">
      <el-row>
        <el-col :span="6">
          <h4>已撤回</h4>
          <span style="font-size: 12px;color: #8492a6;">
            {{ getSenderName() }}
          </span>
        </el-col>
        <el-col :span="18" style="text-align: right;color: rgb(192, 196, 204)">
          {{ formatDate(procinst.createTime) }}
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
  name: 'ReCallNode',
  props: {
    procinst: Object
  },
  data() {
    return {}
  },

  created() {},

  computed: {},

  methods: {
    formatDate(timestamp) {
      return moment(new Date(timestamp)).format('YYYY-MM-DD HH:mm:ss')
    },

    getSenderName() {
      var result = this.procinst.createUserName

      if (top.SessionUtils) {
        if (this.procinst.createUser == top.SessionUtils.getLoginUser().userId) {
          result = '我'
        }
      }

      return result
    }
  },

  watch: {
    procinst: {
      handler: function(val) {
        var that = this

        that.procinst = val
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
