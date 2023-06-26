<template>
  <div class="block flow-line">
    <a-collapse v-model="activeKey" expand-icon-position="right">
      <template #expandIcon="props">
        <span style="color:#1ba97b;">
          <a-icon color="#1ba97b" type="menu-unfold" :rotate="props.isActive ? 0 : 180" />
          {{ props.isActive ? '隐藏' : '展开' }}
        </span>
      </template>
      <a-collapse-panel key="1" header="" :bordered="false">
        <el-timeline style="padding-left: 0px;">
          <template v-for="(task, index) in flowLine">
            <!-- 开始节点 -->
            <template v-if="task.nodeType === nodeType.START">
              <el-timeline-item color="#19a97b" size="large">
                <StartNode :node="task" :procinst="procinst" :confGlobal="confGlobal"></StartNode>
              </el-timeline-item>
            </template>
            <!-- 开始节点 -->

            <!-- 再次发起审批 -->
            <template v-if="task.nodeType === nodeType.SUBMITTER">
              <el-timeline-item color="#19a97b" size="large">
                <StartNode :node="getSubmitterTask(task)" :procinst="procinst" :confGlobal="confGlobal"></StartNode>
              </el-timeline-item>
            </template>
            <!-- 再次发起审批 -->

            <!-- 审批节点 -->
            <template v-if="task.nodeType === nodeType.APPROVER">
              <!-- 存在处理节点 -->
              <template v-if="task.undos && task.undos.length > 0">
                <!-- 已结束节点 -->
                <template v-if="task.finished !== 0">
                  <el-timeline-item :color="approverNodeColor(task.undos)" size="large" :icon="approverNodeIcon(task.undos)">
                    <a-row>
                      <a-col :span="6" v-for="(undo, undoIndex) in task.undos" :key="undoIndex">
                        <ApproverNode :undo="undo" :task="task"></ApproverNode>
                      </a-col>
                    </a-row>
                  </el-timeline-item>
                </template>
                <!-- 未结束节点 -->
                <template v-if="task.finished === 0">
                  <el-timeline-item color="#E6A23C" size="large" icon="el-icon-more">
                    <WaitApproverNode :task="task"></WaitApproverNode>
                  </el-timeline-item>
                </template>
              </template>
            </template>
            <!-- 审批节点 -->

            <!-- 抄送节点 -->
            <template v-if="task.nodeType === nodeType.COPY">
              <el-timeline-item color="#0bbd87" size="large" icon="el-icon-check">
                <CopyNode :task="task"></CopyNode>
              </el-timeline-item>
            </template>
            <template v-if="task.nodeType === nodeType.REVOKE">
              <el-timeline-item color="#909399" size="large" icon="el-icon-refresh-left">
                <ReCallNodes :procinst="task"></ReCallNodes>
              </el-timeline-item>
            </template>

            <!-- 过期 -->
            <template v-if="task.nodeType === nodeType.OVERDUE">
              <el-timeline-item color="#F56C6C" size="large" icon="el-icon-close">
                <div style="display: flex; flex-direction: column;">
                  <span style="color: #F56C6C">已过期</span>
                  <span style="color: rgb(192, 196, 204)">{{ task.createTime }}</span>
                </div>
              </el-timeline-item>
            </template>
          </template>
          <!-- 撤回 -->
          <template v-if="procinst.state === procinstState.RECALL">
            <el-timeline-item color="#909399" size="large" icon="el-icon-refresh-left">
              <ReCallNode :procinst="procinst"></ReCallNode>
            </el-timeline-item>
          </template>

          <!--
          <el-timeline-item
            v-for="(node, index) in flowLine"
            :key="index"
            size="large">

              <template v-if="node.type === nodeType.START">
                  <StartNode :node="node"></StartNode>
              </template>
              <template v-else-if="node.type === nodeType.COPY">
                  <CopyNode :node="node"></CopyNode>
              </template>

              <template v-else-if="node.type === nodeType.APPROVER">
                  <ApproverNode :node="node"></ApproverNode>
              </template>

          </el-timeline-item>
           -->
        </el-timeline>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
<script>
import StartNode from './FlowNode/StartNode/index.vue'
import CopyNode from './FlowNode/CopyNode/index.vue'
import ApproverNode from './FlowNode/ApproverNode/index.vue'
import WaitApproverNode from './FlowNode/WaitApproverNode/index.vue'

import ReCallNode from './FlowNode/ReCallNode/index.vue'
import ReCallNodes from './FlowNode/ReCallNodes/index.vue'

export default {
  name: 'flow-line',
  props: ['flowLine', 'procinst', 'confGlobal'],
  data() {
    return {
      activeKey: '1',
      workFlowList: [],
      nodeType: {
        START: 'start', //开始
        APPROVER: 'approver', //审批
        SUBMITTER: 'submitter', // 再次发起审批
        COPY: 'copy', //抄送
        REVOKE: 'revoke', //撤回
        OVERDUE: 'overdue', //过期
      },

      procinstState: {
        IN_APPROVAL: 1, //审批中
        PASS: 2, //通过
        REJECT: -1, //驳回
        RECALL: 3 //撤回
      }
    }
  },
  components: {
    StartNode,
    CopyNode,
    ApproverNode,
    WaitApproverNode,
    ReCallNode,
    ReCallNodes
  },

  created() {},

  computed: {},
  methods: {
    approverNodeColor(undo) {
      var result = '#0bbd87'
      let flag = undo.some(item => item.result == 3)
      if (flag) {
        //拒绝
        result = '#F56C6C'
      }
      // else if (undo.result == 4) {
      //   //委托

      //   result = '#E6A23C'
      // }

      return result
    },

    approverNodeIcon(undo) {
      var result = 'el-icon-check'
      let flag = undo.some(item => item.result == 3)
      if (flag) {
        //拒绝
        result = 'el-icon-close'
      }
      return result
    },

    getSubmitterTask(task) {
      return {
        nodeType: task.nodeType,
        createTime: task.createTime,
        senderName: task.createUserName,
        senderId: task.createUser
      }
    }
  },
  watch: {
    flowLine: {
      handler: function(nodeInfos) {
        var that = this
      },
      immediate: true,
      deep: true
    },

    procinst: {
      handler: function(procinst) {
        var that = this
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
<style lang="stylus">

.flow-line {
  position:relative;
  .ant-collapse, .ant-collapse-content {
    border: none;
 }
 .ant-collapse > .ant-collapse-item{
   border: none;
 }
 .ant-collapse > .ant-collapse-item:last-child > .ant-collapse-header{
    width: 100%;
    background: #f0f2f5;
 }
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
