<template>
  <div>
    <el-card shadow="never">
      <el-row>
        <el-col :span="isChange ? 24 : 6">
          <h4 v-if="node.properties.title">{{ node.properties.title }}</h4>
          <span style="font-size: 12px;color: #C0C4CC;">
            <!-- 指定用户审批 -->
            <template v-if="node.properties.menbers && node.properties.menbers.length > 0">
              {{ node.properties.menbers.length }}人{{
                node.properties.procdefType.sign ? (node.properties.menbers.length > 1 ? '依次' : '') : node.properties.menbers.length > 1 ? '任意一人' : ''
              }}审批
            </template>

            <template v-else>
              <!-- 未匹配到主管领导 -->
              <!-- <template v-if="node.properties.assigneeType === assigneeType.BRANCH">
                {{ node.properties.menbers.length }}人{{
                  node.properties.counterSign ? (node.properties.menbers.length > 1 ? '依次' : '') : '任意一人'
                }}审批
              </template> -->
              <template v-if="node.properties.assigneeType === assigneeType.DIRECTOR && showApproverEmpty">
                <span style="color: #F56C6C">未查到主管领导,请咨询管理员</span>
              </template>

              <template v-else-if="node.properties.assigneeType === assigneeType.USER && showApproverEmpty">
                <span style="color: #F56C6C">未查到审批人,请咨询管理员</span>
              </template>

              <template v-else-if="node.properties.assigneeType === assigneeType.ROLE && showApproverEmpty">
                <span style="color: #F56C6C">未查到审批人,请咨询管理员</span>
              </template>

              <template v-else-if="node.properties.assigneeType === assigneeType.POSITION && showApproverEmpty">
                <span style="color: #F56C6C">未查到审批人,请咨询管理员</span>
              </template>

              <template v-else>
                请选择审批人
              </template>
            </template>
          </span>
        </el-col>
        <el-col :span="isChange ? 24 : 18" style="text-align: right;">
          <!-- 查看全部 -->
          <!-- <div style="width:100%;" v-if="isShowMoreBtn" @click="showAllUserEvent()">
            <div>
              <div>
                <el-avatar style="background-color: #19a97b">
                  <i class="el-icon-user"></i>
                  <i class="el-icon-user"></i>
                </el-avatar>
              </div>
              <div class="title">
                <span>全部</span>
              </div>
            </div>
            <div class="el-icon-plus" style="position: absolute;top: 14px;font-size: 10px;margin-left: 2px;"></div>
          </div> -->
          <!-- 查看全部 -->

          <!-- 处理用户 -->
          <div v-if="node.properties.menbers" style="display: inline-block;width:100%;">
            <div v-if="isChange" style="display: flex;flex-wrap: wrap;">
              <!-- <div v-for="(handler, i) in node.properties.menbers" :key="i" style="padding-right:10px;">
                <div class="title">
                  <span>{{ handler.name }}</span>
                  <span v-if="i < node.properties.menbers.length - 1">,</span>
                </div>
              </div> -->
              <a-select mode="multiple" class="select_flow" v-model="node.AllmenbersKey" style="width: 100%" :disabled="true" placeholder="请选择">
                <a-select-option v-for="i in node.Allmenbers" :key="i.id">
                  {{ i.name }}
                </a-select-option>
              </a-select>
            </div>
            <!-- @change="handleChange" -->
            <div v-else>
              <div v-for="(handler, i) in node.properties.menbers" :key="i">
                <!-- v-if="i < maxShowCount" -->
                <div style="display: inline-block;">
                  <div>
                    <div class="close-btn" @click="delHandler(i)" v-if="handler.enableDel">
                      <span class="el-icon-close" style="background-color: #1e1e1e; color: white;font-size: 10px;border-radius: 50%;"></span>
                    </div>
                    <el-avatar style="background-color: #19a97b">{{
                      handler.name.length > 2 && handler.userId ? handler.name.substring(1) : handler.name
                    }}</el-avatar>
                  </div>
                  <div class="title">
                    <span>{{ handler.name }}</span>
                  </div>
                </div>
              </div>
              <!-- 节点中的加号 -->
              <!-- <div class="el-icon-plus" style="position: absolute;top: 14px;font-size: 10px;margin-left: 2px;" v-if="isShowPlusBtn(i)"></div> -->
              <!-- 节点中的加号 -->
            </div>
          </div>
          <!-- 处理用户 -->
          <!-- 添加 -->
          <!-- <div style="height:56px;width:55px;display: inline-block;" v-if="isShowAddBtn">
            <div style="width: 40px;display: inline-block;" @click="addUserEvent()">
              <div style="width: 40px;width: 40px;">
                <el-avatar style="border:1px dashed;color: #19a97b;background-color: white;">
                  <i class="el-icon-plus"></i>
                </el-avatar>
              </div>
              <div class="title">
                <span style="display: inline-block;"></span>
              </div>
            </div>
          </div> -->
          <!-- 添加 -->
        </el-col>
      </el-row>
    </el-card>

    <FlowOrgSelect
      v-model="node.properties.menbers"
      :filterConfig="node.properties"
      :maxNum="node.properties.optionalMultiUser ? 99 : 1"
      :enableEdit="node.properties.userOptional"
      :show.sync="isShowFlowOrgSelect"
      :type="'flow_user'"
    ></FlowOrgSelect>
  </div>
</template>
<script>
import FlowOrgSelect from '../../FlowOrgSelectNew/index.vue'

export default {
  /**
   * 组件名称
   */
  name: 'ApproverNode',
  props: {
    node: Object,
    isChange: { type: Boolean, default: false }
  },
  data() {
    return {
      assigneeType: {
        USER: 'user', // 指定成员,
        DIRECTOR: 'director', // 主管
        ROLE: 'role', //角色
        POSITION: 'position', //岗位
        MYSELF: 'myself', //发起人自己
        OPTIONAL: 'optional', //发起人自选
        BRANCH: 'branch' //选择分馆
      },
      defaultMaxShowHandlerCount: 4,

      /**
       * 是否查看所有参与者列表
       */
      isShowFlowOrgSelect: false
    }
  },

  created() {},

  computed: {
    /**
     * 最大显示处理人员数量
     */
    maxShowCount() {
      var result = this.defaultMaxShowHandlerCount

      if (this.node.properties.userOptional) {
        result = result - 1

        if (this.node.properties.menbers.length > this.defaultMaxShowHandlerCount - 1) {
          result = result - 1
        }
      } else {
        if (this.node.properties.menbers.length > this.defaultMaxShowHandlerCount) {
          result = result - 1
        }
      }

      return result
    },

    /**
     * 是否显示查看更多按钮
     */
    isShowMoreBtn() {
      var result = false

      if (this.node.properties.userOptional) {
        if (this.node.properties.menbers.length > this.defaultMaxShowHandlerCount - 1) {
          result = true
        }
      } else {
        if (this.node.properties.menbers.length > this.defaultMaxShowHandlerCount) {
          result = true
        }
      }

      return result
    },

    /**
     * 是否显示添加按钮
     */
    isShowAddBtn() {
      return this.node.properties.userOptional
    },

    /**
     * 是否显示处理节点中的加号
     */
    isShowPlusBtn() {
      return length => {
        return this.node.properties.userOptional || length < this.node.properties.menbers.length - 1
      }
    },

    /**
     * 是否显示审批人必填提示
     */
    showApproverEmpty() {
      return this.node.properties.menbers.length === 0 && this.node.properties?.procdefType?.approverEmpty === 'admin'
    }
  },
  methods: {
    addUserEvent() {
      this.isShowFlowOrgSelect = true
    },

    showAllUserEvent() {
      this.isShowFlowOrgSelect = true
    },

    /**
     * 删除用户信息
     */
    delHandler(index) {
      this.node.properties.menbers.splice(index, 1)
    }
  },
  watch: {
    node: {
      handler: function(val) {
        var that = this
        that.node = val
        if (that.node && that.node.properties.menbers) {
          for (var i = 0; i < that.node.properties.menbers.length; i++) {
            if (that.node.properties.userOptional) {
              //允许用户自选
              that.node.properties.menbers[i].enableDel = true //允许用户自选时,配置为用户可以删除
            }
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  components: {
    FlowOrgSelect
  }
}
</script>
<style lang="stylus">
.select_flow.ant-select-disabled .ant-select-selection {
    background: #fff;
}
.select_flow.ant-select-disabled .ant-select-selection--multiple .ant-select-selection__choice {
    color: rgba(0, 0, 0, 0.65);
    background-color: #fafafa;
}
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
