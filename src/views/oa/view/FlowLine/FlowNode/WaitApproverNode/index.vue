<template>
  <div>
    <el-card shadow="never">
      <el-row v-if="task">
        <el-col :span="24">
          <h4 v-if="task.nodeName">{{ task.nodeName }}</h4>
          <!-- <h4 v-if="task.roleName || task.nodeName">{{ task.roleName || task.nodeName }}</h4> -->
          <span style="font-size: 12px;color: #8492a6;"> {{ getLable }} <a href="#" :style="`color:${getStateColor}`">( {{getStateName}} )</a> </span>
        </el-col>
        <!-- <el-col :span="18" style="text-align: right;">
          &nbsp;
        </el-col> -->
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <!-- 处理用户 -->
          <!-- height:46px;width:50px;display: inline-block; -->
          <a-row>
            <!-- 已审批 -->
            <a-col :span="6" v-for="(undo, i) in undoList" :key="i + undoList.length" v-show="undo.result !== 0">
              <div v-if="undo.result !== 0">
                <ApproverNode :undo="undo" :task="task" :showTotal="false"></ApproverNode>
              </div>
              <!-- 节点中的加号 -->
              <div class="el-icon-plus" style="position: absolute;top: 14px;font-size: 10px;margin-left: 2px;" v-if="i >= task.undos.length"></div>
              <!-- 节点中的加号 -->
            </a-col>
            <!-- 审批中 -->
            <a-col :span="6" v-for="(undo, i) in undoList" :key="i" v-show="undo.result == 0">
              <div v-if="undo.result == 0" style="">
                <!-- width: 50px;display: inline-block;text-align: center; -->
                <div style="">
                  <!-- height: 40px; width: 50px; -->
                  <!-- <el-avatar style="background-color: #19a97b;">{{
                    undo.userName && undo.userName.length > 3 ? undo.userName.substring(2) : undo.userName
                  }}</el-avatar> -->
                </div>
                <div class="title" style="height: 46px;">
                  <span style="font-size:12px;">{{ undo.userName }}</span>
                  <span v-if="undo.roleName" style="font-size:12px;">（{{ undo.roleName }}）</span>
                  <template v-if="undo.assignorUndoId">
                    <br />
                    <span style="font-size:12px;color: #E6A23C;">(被委托)</span>
                  </template>
                  <template v-if="undo.suggest">
                    <br />
                    <span style="font-size:12px;">{{ undo.suggest }}</span>
                  </template>
                  <template v-if="undo.remark">
                    <br />
                    <span style="font-size:12px;">{{ undo.remark }}</span>
                  </template>
                  <template>
                    <br />
                    <span style="font-size:12px;color: #E6A23C;line-height:14px;display: inline-block;">&nbsp;</span>
                  </template>
                </div>
              </div>
              <!-- 节点中的加号 -->
              <div class="el-icon-plus" style="position: absolute;top: 14px;font-size: 10px;margin-left: 2px;" v-if="i >= task.undos.length"></div>
              <!-- 节点中的加号 -->
            </a-col>
          </a-row>
          <!-- <div style="" v-for="(undo, i) in task.undos" :key="i"> -->
          <!-- </div> -->
          <!-- 处理用户 -->
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import moment from 'moment'
import ApproverNode from '../ApproverNode/index.vue'
export default {
  /**
   * 组件名称
   */
  name: 'WaitApproverNode',
  props: {
    task: Object
  },
  data() {
    return { undoList: [] }
  },

  created() {},

  computed: {
    getLable() {
      if (this.task.counterSign) {
        return this.task.unCompleteNum + '会签'
      } else {
        return '任意一人审批'
      }
    },
    getStateName() {
      return this.task.state == 0 ? '已过期' : '审批中'
    },
    getStateColor() {
      return this.task.state == 0 ? '#F56C6C' : '#1BA97B'
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
        if (that.task.undos && Array.isArray(that.task.undos) && that.task.undos.length > 0) {
          that.task.undos.forEach(item => {
            if (item.listRoleName && Array.isArray(item.listRoleName) && item.listRoleName.length > 0) {
              item.roleName = item.listRoleName.join('/  ')
            }
          })
          const undos = JSON.parse(JSON.stringify(that.task.undos))
          that.undoList = undos
        }
      },
      immediate: true,
      deep: true
    }
  },
  components: { ApproverNode }
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
