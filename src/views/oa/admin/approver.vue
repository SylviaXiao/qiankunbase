<template>
  <div class="page">
    <header class="page__header">
      <div class="page-actions">
        <!-- <div style="border-right:1px solid #c5c5c5;cursor: pointer;" @click="exit">
          <i class="el-icon-arrow-left"></i>
        </div> -->
        <div>{{ title }}</div>
      </div>
      <div class="step-tab">
        <div
          v-for="(item, index) in steps"
          :key="index"
          class="step"
          :class="[activeStep == item.key ? 'active' : '']"
          @click="changeSteps(item)"
          v-if="item.key != 'formDesign' || (item.key == 'formDesign' && isOnlineForm)"
        >
          <span class="step-index">{{ index + 1 }}</span>
          {{ item.label }}
        </div>
        <div class="ghost-step step" :style="{ transform: translateX }"></div>
      </div>
      <div>
        <el-button size="small" class="publish-btn" @click="preview">预览</el-button>
        <el-button size="small" class="publish-btn" @click="publish">发布</el-button>
      </div>
    </header>
    <section class="page__content" v-if="mockData">
      <BasicSetting
        ref="basicSetting"
        :conf="mockData.basicSetting"
        v-show="activeStep === 'basicSetting'"
        tabName="basicSetting"
        @initiatorChange="onInitiatorChange"
      />

      <DynamicForm ref="formDesign" :conf="mockData.formData" v-show="activeStep === 'formDesign'" tabName="formDesign" v-if="isOnlineForm" />

      <Process
        ref="processDesign"
        :conf="mockData.processData"
        :isOnlineForm="isOnlineForm"
        tabName="processDesign"
        v-show="activeStep === 'processDesign'"
        @startNodeChange="onStartChange"
      />

      <AdvancedSetting ref="advancedSetting" :conf="mockData.advancedSetting" v-show="activeStep === 'advancedSetting'" />
    </section>
  </div>
</template>

<script>
// @ is an alias to /src
import Process from '@/components/Process'
import DynamicForm from '@/components/DynamicForm'
import BasicSetting from '@/components/BasicSetting'
import AdvancedSetting from '@/components/AdvancedSetting'
import { Message } from 'element-ui'
import { modifyWorkflow, addWorkflow, workFlowProcdefGet } from '@/api/workFlow/request.js'
import mockdataDefault from './mockData'
const beforeUnload = function(e) {
  /*var confirmationMessage = '离开网站可能会丢失您编辑得内容';
  (e || window.event).returnValue = confirmationMessage;     // Gecko and Trident
  return confirmationMessage;*/ // Gecko and WebKit
  return true
}

export default {
  name: 'Home',
  /*props: {
    title: {
      type: String,
      default: '空白模板'
    }
  },*/
  data() {
    return {
      showEditPaidAccount: true, //审批中是否允许编辑/查看打款账户
      showEditFeeType: true, //审批中是否允许查看/编辑费用类型
      mockdataDefault,
      id: '',
      title: '空白模板',
      procdefData: null,
      mockData: null, // 可选择诸如 $route.param，Ajax获取数据等方式自行注入
      activeStep: 'basicSetting', // 激活的步骤面板
      steps: [
        { label: '基础设置', key: 'basicSetting' },
        { label: '表单设计', key: 'formDesign' },
        { label: '流程设计', key: 'processDesign' },

        { label: '高级设置', key: 'advancedSetting' }
      ],
      isOnlineForm: false
    }
  },
  async created() {
    var that = this

    localStorage.removeItem('drawingItems')
    this.id = this.$route.params.id
    if (this.id != 'new') {
      this.procdefData = (await workFlowProcdefGet({ id: this.id })).data
      if (this.procdefData) {
        this.mockData = JSON.parse(this.procdefData.config)
        this.title = this.procdefData.name
      } else {
        this.mockData = {}
      }
      if (localStorage.getItem('FLOWLINEMOCEKADA')) {
        this.mockData = JSON.parse(localStorage.getItem('FLOWLINEMOCEKADA'))
      }
    } else {
      this.mockData = {}
      if (localStorage.getItem('FLOWLINEMOCEKADA')) {
        this.mockData = JSON.parse(localStorage.getItem('FLOWLINEMOCEKADA'))
      }
    }
    setInterval(function() {
      that.refresheFormType()
    }, 500)
  },
  beforeRouteEnter(to, from, next) {
    window.addEventListener('beforeunload', beforeUnload)
    next()
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener('beforeunload', beforeUnload)
    next()
  },
  computed: {
    translateX() {
      var index = this.steps.findIndex(t => t.key === this.activeStep)

      if (!this.isOnlineForm && index > 1) {
        index = index - 1
      }

      return `translateX(${index * 100}%)`
    }
  },
  watch: {
    // eslint-disable-next-line func-names
    mockData: {
      handler(val) {
        // console.log('this.mockData', val)
        // console.log(localStorage.getItem('FLOWLINEMOCEKADA'))
        if (!val) return
        localStorage.setItem('FLOWLINEMOCEKADA', JSON.stringify(val))
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    refresheFormType() {
      var that = this

      var basicSetting = 'basicSetting'

      if (!that.mockData || !that.$refs[basicSetting]) {
        that.isOnlineForm = false
      } else {
        const p1 = this.$refs[basicSetting]
          .getDataNoValidate()
          .then(function(res) {
            var formData = res.formData
            that.isOnlineForm = 0 === formData.formType
          })
          .catch(e => {
            console.info(e)
          })
      }
    },

    changeSteps(item) {
      this.activeStep = item.key
      if (this.activeStep == 'advancedSetting') {
        this.$refs.advancedSetting.init()
      }
    },
    preview() {
      this.$refs.formDesign.preview()
    },
    publish() {
      var that = this

      const getCmpData = name => this.$refs[name].getData()
      // basicSetting  formDesign processDesign 返回的是Promise 因为要做校验
      // advancedSetting返回的就是值
      const p1 = getCmpData('basicSetting')

      var p2 = null
      if (that.isOnlineForm) {
        p2 = getCmpData('formDesign')
      } else {
        p2 = new Promise(function(resolve, reject) {
          resolve(null)
        })
      }

      const p3 = getCmpData('processDesign')
      Promise.all([p1, p2, p3])
        .then(res => {
          const param = {
            basicSetting: res[0].formData,
            processData: res[2].formData,
            formData: that.isOnlineForm ? res[1].formData : {},
            advancedSetting: getCmpData('advancedSetting')
          }
          this.sendToServer(param)
        })
        .catch(err => {
          this.$notification['error']({
            message: '系统通知',
            description: '请完成所有流程步骤后再进行提交'
          })
          err.target && (this.activeStep = err.target)
          err.msg && this.$message.warning(err.msg)
        })
    },
    async sendToServer(options) {
      /*this.$notify({
        title: '数据已整合完成',
        message: '请在控制台中查看数据输出',
        position: 'bottom-right'
      });*/
      console.log('配置数据', options)

      var params = {}
      params.config = JSON.stringify(options)
      params.name = options.basicSetting.flowName
      params.code = options.basicSetting.code
      params.status = options.basicSetting.status
      params.modeId = options.basicSetting.modeId
      params.mode = options.basicSetting.mode
      params.groupId = options.basicSetting.flowGroup
      params.version = 1
      params.icon = options.basicSetting.flowImg
      params.id = this.id == 'new' ? '' : this.id
      params.state = 0
      let url = params.id ? modifyWorkflow : addWorkflow
      url(params).then(res => {
        if (res.code === 200) {
          this.$notification['success']({
            message: '系统通知',
            description: '添加成功'
          })
          this.$router.push({ name: 'approvalList' })
          // this.resetForm()
        }
      })
      setTimeout(function() {
        //window.close();
      }, 2000)
    },
    exit() {
      this.$confirm('离开此页面您得修改将会丢失, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          /*this.$message({
            type: 'success',
            message: '模拟返回!'
          });*/
          window.close()
        })
        .catch(() => {})
    },
    /**
     * 同步基础设置发起人和流程节点发起人
     */
    onInitiatorChange(val, labels) {
      const processCmp = this.$refs.processDesign
      const startNode = processCmp.data
      startNode.properties.initiator = val
      startNode.content = labels || '所有人'
      processCmp.forceUpdate()
    },
    /**
     * 监听 流程节点发起人改变 并同步到基础设置 发起人数据
     */
    onStartChange(node) {
      const basicSetting = this.$refs.basicSetting
      basicSetting.formData.initiator = node.properties.initiator
    }
  },
  components: {
    Process,
    DynamicForm,
    BasicSetting,
    AdvancedSetting
  }
}
</script>
<style lang="less" scoped>
@import '~@/assets/style/index';
@header-height: 54px;

.page {
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  .page__header {
    width: 100%;
    height: @header-height;
    .between();
    box-sizing: border-box;
    color: white;
    background: @theme-color;
    font-size: 14px;

    .page-actions {
      height: 100%;
      text-align: center;
      line-height: @header-height;

      > div {
        height: 100%;
        padding-left: 20px;
        padding-right: 20px;
        display: inline-block;
      }

      i {
        font-size: 22px;
        vertical-align: middle;
      }
    }

    .step-tab {
      display: flex;
      justify-content: center;
      height: 100%;
      position: relative;

      > .step {
        width: 140px;
        line-height: @header-height;
        padding-left: 30px;
        padding-right: 30px;
        cursor: pointer;
        position: relative;

        &.ghost-step {
          position: absolute;
          height: @header-height;
          left: 0;
          z-index: -1;
          background: #4483f2;
          transition: transform 0.5s;

          &::after {
            content: '';
            border-width: 6px 6px 6px;
            border-style: solid;
            border-color: transparent transparent white;
            position: absolute;
            bottom: 0;
            left: 50%;
            margin-left: -6px;
          }
        }

        &.active > .step-index {
          background: white;
          color: #4483f2;
        }

        > .step-index {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 1px solid #fff;
          border-radius: 8px;
          line-height: 18px;
          text-align: center;
          box-sizing: border-box;
        }
      }
    }
  }

  .page__content {
    width: 100%;
    // height: calc(100% - 54px);
    height: calc(100vh - 200px);
    overflow: hidden;
    box-sizing: border-box;
    background: #f5f5f7;
  }
}

.publish-btn {
  margin-right: 20px;
  color: #19a97b;
  padding: 7px 20px;
  border-radius: 4px;
  font-size: 14px;
  background: #f5f5f7;
}
</style>
