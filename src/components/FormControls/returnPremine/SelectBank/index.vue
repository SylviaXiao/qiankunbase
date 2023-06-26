<template>
  <div class="fc-select-bank">
    <a-row>
      <a-col :span="18">
        <a-form-model ref="bankForm" :model="bankForm" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="类型" prop="receiptType" ref="receiptType">
                <a-select
                  @change="receiptTypeChange"
                  :disabled="disabled || editType"
                  v-model="bankForm.receiptType"
                  allowClear
                  style="width:90%"
                  placeholder="请选择类型"
                >
                  <a-select-option value="A">公司</a-select-option>
                  <a-select-option value="B" v-if="defaultType == 'default'">个人</a-select-option>
                </a-select>

                <a-tooltip v-if="defaultType == 'table'">
                  <template slot="title">
                    个人类型请填写至表单最下方收款账户，公司类型填写此处
                  </template>
                  <a-icon style="margin-left:5px;" type="question-circle" />
                </a-tooltip>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="defaultType == 'default' || bankForm.receiptType == 'A'">
              <a-form-model-item label="收款人户名" ref="receiptName" prop="receiptName">
                <a-input
                  :disabled="disabled || editType"
                  style="width:90%"
                  placeholder="请输入收款人户名"
                  v-model="bankForm.receiptName"
                  @change="bankInputOther"
                /> </a-form-model-item
            ></a-col>
            <a-col :span="12" v-if="defaultType == 'default' || bankForm.receiptType == 'A'">
              <a-form-model-item label="开户行" ref="bank" prop="bank">
                <a-input :disabled="disabled" style="width:90%" placeholder="请输入开户行" v-model="bankForm.bank" @change="bankInputOther" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="defaultType == 'default' || bankForm.receiptType == 'A'">
              <a-form-model-item label="银行卡号" ref="bankNo" prop="bankNo">
                <a-input :disabled="disabled" style="width:90%" placeholder="请输入银行卡号" :value="bankForm.bankNo" @change="bankInput" />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-col>
      <a-col :span="6" v-if="(defaultType == 'default' || bankForm.receiptType == 'A') && !editType">
        <a-button style="margin-top: 3px;" type="primary" :disabled="disabled" @click="choosePerson"> 从个人中心选择</a-button>
      </a-col>
    </a-row>
    <!-- 选择银行 -->
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" title="选择银行" :width="800" v-model="staffModal" @cancel="staffCancel" @ok="staffOk">
      <!-- <div class="mb20">
        <span>银行账户：</span>
        <a-input-search style="width: 300px;" placeholder="请输入银行账户" v-model="queryParam.bankNo" enter-button @search="onSearch" />
      </div> -->
      <ChoosePersons
        v-if="staffModal"
        :ref="`ChoosePersons`"
        :columns="columns"
        :loadData="loadData"
        chooseKey="id"
        chooseName="bankNo"
        @pick="getStaff"
        :deleteBtn="true"
        :radio="true"
      />
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    title: '类型',
    key: 'receiptType',
    dataIndex: 'receiptType',
    customRender: text => {
      return text == 'B' ? '个人' : text == 'A' ? '公司' : ''
    }
  },
  {
    title: '开户行',
    key: 'bank',
    dataIndex: 'bank'
  },
  {
    title: '银行卡号',
    key: 'bankNo',
    dataIndex: 'bankNo'
  },
  {
    title: '收款人户名',
    key: 'receiptName',
    dataIndex: 'receiptName'
  },
  {
    title: '备注',
    key: 'remark',
    dataIndex: 'remark',
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
import ChoosePersons from '@/components/ChoosePersons'
import { pageListBank } from '@/api/common'
import { listReceiptBank } from '@/api/organize'

export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: [
    'value',
    'cmpType',
    'tag',
    'tagIcon',
    'precision',
    'disabled',
    'labelWidth',
    'step-strictly',
    'controls',
    'controls-position',
    'regList',
    'changeTag',
    'proCondition',
    'formId',
    'renderKey',
    'layout',
    'defaultType'
  ],
  name: 'fc-select-bank',
  components: {},
  data() {
    return {
      editType: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      bankForm: this.value || {
        id: '',
        name: '',
        receiptName: '',
        bank: '',
        bankNo: '',
        receiptType: this.defaultType == 'default' ? 'B' : ''
      },
      stafList: [],
      staffModal: false,
      queryParam: {
        bankNo: ''
      },
      loadData: parameter => {
        let obj = Object.assign(parameter, this.queryParam)
        return listReceiptBank(obj).then(res => {
          let data = res.data.receiptBank
          if (this.defaultType == 'table') {
            data = res.data.receiptBank.filter(item => item.receiptType == 'A')
          }
          return {
            data
          }
        })
      },
      columns,
      deptTree: [] //所有分馆列表
    }
  },
  created() {
    this.editType = this.$route.params.type == 2
    if (this.$store.getters.userInfo?.account?.id == 'admin') {
      this.editType = false
    }
  },
  components: {
    ChoosePersons
  },
  computed: {},
  methods: {
    receiptTypeChange(e) {
      if (this.defaultType == 'table') {
        this.bankForm = Object.assign(this.bankForm, {
          id: '',
          name: '',
          receiptName: '',
          bank: '',
          bankNo: ''
        })
      }
      this.handleInput(this.bankForm)
    },
    bankInputOther() {
      this.handleInput(this.bankForm)
    },
    bankInput(e) {
      const { value } = e.target
      if (value) {
        this.bankForm.bankNo = value.replace(/[^0-9]/gi, '')
      } else {
        this.bankForm.bankNo = ''
      }
      this.handleInput(this.bankForm)
    },
    onSearch(value) {
      this.$refs.ChoosePersons.refresh()
    },
    choosePerson() {
      if (!this.disabled) {
        this.staffModal = true
      }
    },
    //选择银行
    staffOk() {
      if (this.stafList.length) {
        let { id, receiptName, bank, bankNo, receiptType } = this.stafList[0]
        this.bankForm = Object.assign(this.bankForm, {
          id,
          receiptName,
          bank,
          bankNo,
          receiptType
        })
      }
      this.handleInput(this.bankForm)
      this.staffCancel()
    },
    staffCancel() {
      this.staffModal = false
    },
    getStaff(data) {
      if (data.length) {
        this.stafList = data
      } else {
        this.stafList = []
      }
    },
    handleInput(val) {
      if (val) {
        this.$emit('change', {
          id: val.id,
          name:
            (val.receiptType == 'A' ? '公司' : val.receiptType == 'B' ? '个人' : '') +
            (val.receiptType ? '/' : '') +
            val.receiptName +
            (val.receiptName ? '/' : '') +
            val.bank +
            (val.bank ? '/' : '') +
            val.bankNo,
          receiptName: val.receiptName,
          bank: val.bank,
          bankNo: val.bankNo,
          receiptType: val.receiptType
        })
      } else {
        this.$emit('change', '')
      }
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.bankForm = Object.assign(this.bankForm, val)
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.explain-text {
  font-size: 12px;
  color: #aaa;
  line-height: 20px;
}
</style>
