<template>
  <div>
    <el-card shadow="never">
      <el-row>
        <el-col :span="6">
          <h4 v-if="task.nodeName">{{ task.nodeName }}</h4>
          <span style="font-size: 12px;color: #8492a6;">
            已抄送{{ task.memberCount }}人 <span style="font-size: 14px;color: #19a97b;">{{ task.agreeNum }}人已读</span>
          </span>
        </el-col>
        <el-col :span="18" style="text-align: right;">
          &nbsp;
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <!-- 处理用户 -->
          <div style="height:46px;width:50px;display: inline-block;" v-for="(undo, i) in task.undos">
            <div style="width: 50px;display: inline-block;text-align: center;">
              <div class="close-btn" v-if="undo.result == 1">
                <span class="el-icon-check" style="background-color: #0bbd87; color: white;font-size: 10px;border-radius: 50%;"></span>
              </div>
              <div style="">
                <!-- height: 40px; width: 50px; -->
                <el-avatar style="background-color: #19a97b;">{{ undo.userName.length > 3 ? undo.userName.substring(2) : undo.userName }}</el-avatar>
              </div>
              <div class="title" style="height: 46px;">
                <span style="font-size:12px;">{{ undo.userName }}</span>
              </div>
            </div>

            <!-- 节点中的加号 -->
            <div class="el-icon-plus" style="position: absolute;top: 14px;font-size: 10px;margin-left: 2px;" v-if="i >= task.undos.length"></div>
            <!-- 节点中的加号 -->
          </div>
          <!-- 处理用户 -->
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
  name: 'WaitApproverNode',
  props: {
    task: Object
  },
  data() {
    return {}
  },

  created() {},

  computed: {
    getLable() {
      if (this.task.counterSign) {
        return this.task.unCompleteNum + '会签'
      } else {
        return '任意一人审批'
      }
    }
  },
  methods: {
    formatDate(timestamp) {
      return moment(new Date(timestamp)).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  watch: {
    task: {
      handler: function(val) {
        var that = this

        that.task = val
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
        width: 30px;
        height: 14px;
        display: inline-block;
        position: absolute;
        top: -2px;
    }
}
</style>
