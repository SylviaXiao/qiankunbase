<template>
  <div class="block flow-line">
    <el-timeline style="padding-left: 0px;">
      <el-timeline-item v-for="(node, index) in flowLine" :key="index" size="large" v-if="node.type !== nodeType.START">
        <template v-if="node.type === nodeType.COPY">
          <CopyNode :node="node" v-if="node.type != 'empty'"></CopyNode>
        </template>
        <template v-else>
          <ApproverNode :isChange="isChange" :node="node" v-if="node.type != 'empty'"></ApproverNode>
        </template>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<script>
import CopyNode from './FlowNode/CopyNode/index.vue'
import ApproverNode from './FlowNode/ApproverNode/index.vue'

export default {
  name: 'flow-line',
  props: ['flowLine', 'isChange'],
  data() {
    return {
      nodeType: {
        START: 'start', //开始
        APPROVER: 'approver', //审批
        COPY: 'copy' //抄送
      }
    }
  },
  components: {
    CopyNode,
    ApproverNode
  },

  created() {},

  computed: {},
  methods: {},
  watch: {
    flowLine: {
      handler: function(nodeInfos) {
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
