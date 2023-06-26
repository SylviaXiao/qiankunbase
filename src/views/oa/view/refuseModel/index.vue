<template>
  <div class="refuse-model-wrapper">
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="审批意见"
      :width="800"
      :visible="showModel"
      :confirmLoading="confirmLoading"
      @ok="confirm"
      @cancel="close"
    >
      <a-form-model ref="refuseForm" :model="refuseForm" :rules="refuseRules">
        <a-form-model-item label="审批意见" prop="refuseSuggest">
          <a-input v-model="refuseForm.refuseSuggest" placeholder="请输入审批意见" />
        </a-form-model-item>
        <a-form-model-item label="驳回流程" prop="refuseFlow">
          <a-input type="hidden" v-model="refuseForm.refuseFlow" />
          <div class="refuse-flow-wrapper">
            <div
              v-for="(item, index) in refuseFlowOptions"
              :key="index"
              class="refuse-flow-option"
              :class="{ active: refuseForm.refuseFlow === item.nodeId }"
              @click="refuseFlowChange(item)"
            >
              <span>
                {{ item.userNames.join(',') }}
                <span v-if="index == 0">（{{ item.roleName }}）</span>
              </span>
            </div>
          </div>
        </a-form-model-item>
        <a-form-model-item v-if="procedureTypeOptions.length > 0 && refuseForm.refuseFlow == 'start'" label="可编辑表单数据" prop="procedureType">
          <a-select mode="multiple" v-model="refuseForm.procedureType" placeholder="请选择可编辑表单数据">
            <a-select-option v-for="item in procedureTypeOptions" :key="item.formId" :value="item.formId">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item v-if="commitNodeType == 'toChooseNode' && refuseForm.refuseFlow == 'start'" label="驳回后再次提交审核节点" prop="commitNodeType">
          <a-radio-group :options="commitNodeTypeOptions" v-model="refuseForm.commitNodeType" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { listApprovePeople } from '@/api/workFlow/request'
export default {
  name: 'refuseModel',
  components: {},
  props: {
    //可编辑表单数据下拉框选项
    procedureTypeOptions: {
      type: Array,
      default: () => []
    },
    //拒绝时提交节点
    commitNodeType: {
      type: String
    },
    schoolId: {
      type: String
    },
    procinstId: {
      type: String
    }
  },
  computed: {},
  data() {
    return {
      showModel: false,
      confirmLoading: false,
      refuseFlowOptions: [],
      commitNodeTypeOptions: [{ label: '提交至初始节点', value: 'toFirstNode' }, { label: '提交至驳回节点', value: 'toRejectNode' }],
      refuseForm: {
        refuseSuggest: '',
        refuseFlow: 'start',
        procedureType: [],
        commitNodeType: 'toFirstNode',
        undoIds: []
      },
      refuseRules: {
        refuseSuggest: { required: true, message: '请输入审批意见', trigger: 'change' },
        refuseFlow: { required: true, message: '请选择驳回流程', trigger: 'change' },
        procedureType: { required: false, message: '请选择可编辑表单数据', trigger: 'change' },
        commitNodeType: { required: true, message: '请选择驳回后再次提交审核节点', trigger: 'change' }
      }
    }
  },
  created() {},
  methods: {
    open() {
      this.showModel = true
      this.initRefuseFlowList()
    },
    close() {
      this.showModel = false
      this.confirmLoading = false
      this.$refs.refuseForm.resetFields()
    },
    loading() {
      this.confirmLoading = true
    },
    initRefuseFlowList() {
      listApprovePeople({ schoolId: this.schoolId, procinstId: this.procinstId }).then(res => {
        this.refuseFlowOptions = this.formatData(res.data)
        if (!this.refuseFlowOptions[0]?.nodeId) {
          this.refuseFlowOptions[0].nodeId = 'start'
        }
      })
    },
    formatData(data) {
      let list = []
      data.forEach(item => {
        let index = list.findIndex(d => d.nodeId === item.nodeId)
        if (index >= 0) {
          item.undoId ? list[index].undoIds.push(item.undoId) : ''
          list[index].userNames.push(item.userName)
        } else {
          list.push(Object.assign({ undoIds: item.undoId ? [item.undoId] : [], userNames: [item.userName] }, item))
        }
      })
      return list
    },
    refuseFlowChange(value) {
      this.refuseForm.refuseFlow = value.nodeId
      this.refuseForm.undoIds = value.undoIds
      this.$refs.refuseForm.validateField('refuseFlow', () => {})
    },
    confirm() {
      this.$refs.refuseForm.validate(valid => {
        if (valid) {
          let { procedureTypeOptions, refuseForm: { refuseFlow, procedureType } } = this
          if (procedureTypeOptions.length > 0 && procedureType.length > 0) {
            this.refuseForm.procedure = this.procedureTypeOptions.filter(d => procedureType.includes(d.formId)).map(d => d.vModel)
          }
          this.$emit('confirm', Object.assign({}, this.refuseForm, { refuseFlow: refuseFlow === 'start' ? '' : refuseFlow }))
        }
      })
    }
  }
}
</script>

<style lang="less" type="text/less" scoped>
.refuse-model-wrapper {
}

.refuse-flow-wrapper {
  display: flex;
  flex-direction: column;
  max-height: 160px;
  overflow-y: auto;
  .refuse-flow-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    height: 40px;
    padding: 0 15px;
    &.active {
      background: #e1fcf4;
      &:after {
        content: '✔';
        font-size: 22px;
        /*color: #1BA97B;*/
      }
    }
  }
}
</style>
