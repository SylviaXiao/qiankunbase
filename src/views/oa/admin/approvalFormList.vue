<template>
  <div class="mt20">
    <div class="mb20">
      <a-space :size="15">
        <span v-if="tabKey === 3">
          <!--<a-button @click="exportExcel">批量导出</a-button>-->
          <a-dropdown>
            <a-menu slot="overlay" @click="handleExportClick">
              <a-menu-item :key="1">离职导出</a-menu-item>
              <a-menu-item :key="2">费用报销单</a-menu-item>
              <a-menu-item :key="3">教研离职导出</a-menu-item>
            </a-menu>
            <a-button>
              批量导出
              <a-icon type="down"/>
            </a-button>
          </a-dropdown>
        </span>
        <perm-box perm="fast:undo:listUpdate" v-if="tabKey === 1 || tabKey === 4">
          <a-button @click="openModal(1)">批量同意</a-button>
        </perm-box>
        <perm-box perm="fast:undo:listSave" v-if="tabKey === 1 || tabKey === 4">
          <a-button @click="openModal(0)">批量驳回</a-button>
        </perm-box>
        <span v-if="tabKey === 4" style="">
          <span class="selectBtn">
            <a-button :disabled="showRowkeys" @click.native="handledistribution">合并打款</a-button>
            <span v-if="showRowkeys">
              <span @click="handleRight" class="checkIcon check">
                确定
              </span>
              <span @click="handleClose" class="checkIcon close">
                取消
              </span>
            </span>
          </span>
        </span>
      </a-space>
    </div>
    <a-card :bordered="false">
      <a-tabs :activeKey="tabKey" @change="changeTabs">
        <!-- v-if="handlePermBox(item.perm)" -->
        <a-tab-pane :tab="item.text" v-for="item in tabList" :key="item.id">
          <div class="mb20">
            <a-button @click="handleReset()">重置查询</a-button>
          </div>
          <s-table
            :ref="`table${item.id}`"
            :showSlider="tabKey === 1"
            :columns="columns"
            :data="loadData"
            :rowKey="(record, index) => record.procinstId + record.schoolId + index"
            :rowSelection="rowSelection"
            :scroll="{ x: true }"
            :totalMoney="tabKey === 1 ? 'totalMoney' : null"
          >
            <span slot="_title" slot-scope="text, record">
              <a href="#" @click="toInfo(record)">
                <a-icon type="fire" theme="filled" style="color: red" v-if="record.urgent === 'A'" />
                {{ record.title || '无' }}
              </a>
            </span>
            <a-icon slot="filterIcon" slot-scope="filtered" type="search" :style="{ color: filtered ? '#1ba97b' : undefined }" />
            <div slot="filterDropdown" slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }" class="column_search_wrap">
              <template v-if="column.dataIndex === 'state'">
                <a-radio-group
                  class="mb10"
                  :value="selectedKeys[0]"
                  @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                >
                  <a-radio
                    class="column_search_radio"
                    v-for="(option, optioni) in stateOptions"
                    :key="optioni"
                    :value="option.value"
                    :checked="queryParam.state === option.value"
                  >
                    {{ option.label }}
                  </a-radio>
                </a-radio-group>
              </template>
              <template v-else-if="column.dataIndex === 'branchName'">
                <a-select
                  style="width: 100%"
                  class="mb10"
                  :value="selectedKeys[0]"
                  :placeholder="`请输入${column.title}`"
                  :showSearch="true"
                  :allowClear="true"
                  :dropdownMatchSelectWidth="false"
                  :filterOption="filterOption"
                  @change="e => setSelectedKeys(e ? [e] : [])"
                >
                  <a-select-option v-for="(option, optioni) in schoolList" :key="optioni" :value="option.schoolId">
                    {{ option.schoolName }}
                  </a-select-option>
                </a-select>
              </template>
              <template v-else-if="column.dataIndex === 'createTime' || column.dataIndex==='undoAssertionTime'">
                <a-range-picker
                  style="width: 100%"
                  class="mb10"
                  format="YYYY-MM-DD"
                  valueFormat="YYYY-MM-DD"
                  :value="selectedKeys[0]"
                  :disabledDate="disabledDate"
                  :allowClear="true"
                  @change="e => setSelectedKeys(e.length > 0 ? [e] : [])"
                />
              </template>
              <template v-else-if="column.dataIndex === 'undoResult'">
                <a-radio-group
                  class="mb10"
                  :value="selectedKeys[0]"
                  @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                >
                  <a-radio
                    class="column_search_radio"
                    v-for="(option, optioni) in undoResultList"
                    :key="optioni"
                    :value="option.value"
                    :checked="queryParam.state == option.value"
                  >
                    {{ option.title }}
                  </a-radio>
                </a-radio-group>
              </template>
              <template v-else>
                <a-input
                  class="column_search_input mb10"
                  :placeholder="`请输入${column.title}`"
                  :value="selectedKeys[0]"
                  @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                  @pressEnter="() => handleSearch(clearFilters, selectedKeys[0], confirm, column.dataIndex)"
                />
              </template>
              <span class="between">
                <a-button type="primary" size="small" @click="() => handleSearch(clearFilters, selectedKeys[0], confirm, column.dataIndex)">
                  搜索
                </a-button>
                <a-button size="small" @click="() => handleReset(clearFilters, column.dataIndex)">
                  重置
                </a-button>
              </span>
            </div>
            <span slot="action" slot-scope="text, record">
              <span v-if="tabKey === 1">
                <a href="#" style="padding: 0 5px;" @click="openModal(0, record)">驳回</a>
                <a href="#" style="padding: 0 5px;" @click="openModal(1, record)">通过</a>
              </span>
              <span v-if="tabKey === 4">
                <template v-if="record.code === '004' || record.code === '005'">
                  <a href="#" style="padding: 0 5px;" @click="openModal(0, record)">驳回</a>
                  <a href="#" style="padding: 0 5px;" @click="openModal(1, record)">通过</a>
                </template>
                <template v-else>
                  <a href="#" style="padding: 0 5px;" @click="openModal(1, record)">付款</a>
                </template>
              </span>
              <span v-if="tabKey === 5">
                <a href="#" style="padding: 0 5px;" @click="getChangeList(record)">修改记录</a>
                <a href="#" style="padding: 0 5px;" @click="toInfo(record)">修改</a>
              </span>
              <span v-if="tabKey !== 5">
                <a href="#" style="padding: 0 5px;" @click="print(record)">打印</a>
              </span>
              <span v-if="tabKey === 3">
                <a href="#" style="padding: 0 5px;" @click="saveReimbursement(record)">录入数据</a>
              </span>
            </span>
          </s-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <!-- 通过/驳回 -->
    <EditLise ref="EditLise"></EditLise>
    <!-- 通过/驳回 -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="600"
      :title="title"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-form-model-item v-bind="defaultLayout" label=" " prop="_commitNodeType" :colon="false" v-if="modalType == 0 && commitNodeType == 'toChooseNode'">
          <div>驳回后再次提交审核节点</div>
          <el-radio-group v-model="form._commitNodeType">
            <el-radio label="toFirstNode" class="mr30">提交至初始节点</el-radio>
            <el-radio label="toRejectNode">提交至驳回节点</el-radio>
          </el-radio-group>
        </a-form-model-item>
        <a-form-model-item v-bind="defaultLayout" label="可编辑表单数据" prop="_procedureType" v-if="modalType == 0 && procedureType == 'chooseLimit'">
          <a-select placeholder="请选择可编辑表单数据" v-model="form._procedureType" mode="multiple">
            <a-select-option v-for="option in fotmItemOptions" :key="option.formId" :value="option.formId">
              {{ option.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <template v-if="modalType == 1 && isSingle && procOrgUserList.length > 0">
          <a-form-model-item
            v-for="(item, index) in procOrgUserList"
            :key="item.nodeId"
            v-bind="defaultLayout"
            :label="item.title + '的审批人'"
            :prop="'listOrgUser' + index"
          >
            <a-select :placeholder="'请选择' + item.title + '的审批人'" :options="item.orgUserBOList" v-model="form['listOrgUser' + index]"></a-select>
            <!-- mode="multiple"
              label-in-value -->
          </a-form-model-item>
        </template>
        <template v-if="modalType == 2">
          <a-row style="color:#000;margin-bottom:20px;">
            <a-col :span="6" style="text-align:right;">打款总金额：</a-col>
            <a-col :span="14">{{ mergePaidPrice }}</a-col>
          </a-row>
          <a-form-model-item v-bind="defaultLayout" label="打款账户" prop="bank">
            <a-tree-select
              style="width: 100%"
              v-model="form.bank"
              :show-search="true"
              treeNodeFilterProp="title"
              placeholder="请选择打款账户"
              treeDefaultExpandAll
              :allowClear="true"
              :multiple="false"
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="deptTree"
              @change="handleInput"
            />
          </a-form-model-item>
        </template>
        <a-form-model-item v-bind="defaultLayout" label="理由" prop="suggest">
          <a-input v-model="form.suggest" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!-- 驳回至任意节点 -->
    <refuseModel
      ref="refuseModel"
      :procedureTypeOptions="procedureType == 'chooseLimit' ? fotmItemOptions : []"
      :commitNodeType="commitNodeType"
      :schoolId="curSchoolId"
      :procinstId="curProcinstId"
      @confirm="refuseModelConfirm"
    />
    <!-- 打印 -->
    <a-drawer title="打印" width="1000" placement="right" :closable="false" :visible="printVisible" @close="onClose">
      <div v-if="printVisible">
        <workFlowTable
          ref="workFlowTable"
          :title="flowName"
          :formDatas="formData"
          :confGlobal="confGlobal"
          :createTime="procinst.createTime"
          :createUserName="procinst.createUserName"
          :curator="procinst.curator"
          :code="config.basicSetting.code"
        ></workFlowTable>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import { cloneDeep } from 'lodash'
import { STable, PermBox } from '@/components'
import workFlowTable from '@/views/oa/view/workFlowTable'
import MergePay from './modules/mergePay.vue'
import EditLise from './modules/EditLise.vue'
import refuseModel from '../view/refuseModel'
import {
  listWorkflowRoleUserDetail,
  saveReimbursement,
  waitApprovePage,
  alreadyApprovePage,
  pageRecord,
  workflowUndoAgree,
  workflowUndoRefuse,
  listAgree,
  megerAgree,
  listRefuse,
  workflowProcinstGet,
  workFlowProcdefFlowLine,
  workflowUndoGet,
  listCashierUndo,
  workflowTaskGet,
  downWaitFile,
  downAlreadyFile,
  downLoadFile,
  downTeacher,
  listNextProcOrgUser,
  updateNextProcOrgUser,
  listBankByDeptId,
  FinishedPage,
  rejectAnyNode
} from '@/api/workFlow/request'

const stateOptions = [
  { value: '-1', label: '驳回' },
  { value: '0', label: '待审批' },
  { value: '1', label: '审批中' },
  { value: '2', label: '通过' },
  { value: '3', label: '撤回' },
  { value: '5', label: '确定' }
]
const undoResultList = [
  { value: 0, title: '等待处理' },
  { value: 1, title: '已读' },
  { value: 2, title: '同意' },
  { value: 3, title: '拒绝' },
  { value: 4, title: '委托' },
  { value: 5, title: '过期' }
]
const columns = [
  {
    title: '标题',
    key: '_title',
    dataIndex: '_title',
    scopedSlots: {
      customRender: '_title',
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon'
    }
  },
  {
    title: '合计金额',
    dataIndex: 'totalMoney',
    key: 'totalMoney',
    scopedSlots: {
      customRender: 'totalMoney',
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon'
    }
  },
  {
    title: '提交分馆',
    dataIndex: 'branchName',
    key: 'branchName',
    scopedSlots: {
      customRender: 'branchName',
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon'
    }
  },
  {
    title: '单据模板',
    dataIndex: 'procdefName',
    key: 'procdefName',
    scopedSlots: {
      customRender: 'procdefName',
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon'
    }
  },
  {
    title: '单号',
    dataIndex: 'procinstNo',
    key: 'procinstNo',
    scopedSlots: {
      customRender: 'procinstNo',
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon'
    }
  },
  {
    title: '提交日期',
    dataIndex: 'createTime',
    key: 'createTime',
    scopedSlots: {
      customRender: 'createTime',
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon'
    },
    customRender: text => {
      return text ? moment(text).format('YYYY-MM-DD') : ''
    }
  },
  {
    title: '提交人',
    dataIndex: 'createUser',
    key: 'createUser',
    scopedSlots: {
      customRender: 'createUser',
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon'
    },
    sorter: true
  },
  {
    title: '审批状态',
    dataIndex: 'state',
    key: 'state',
    scopedSlots: {
      customRender: 'state',
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon'
    },
    customRender: text => {
      return stateOptions.find(item => item.value == text)?.label || ''
    }
  },
  {
    title: '类型',
    dataIndex: 'modeType',
    key: 'modeType',
    scopedSlots: {
      customRender: 'modeType',
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon'
    }
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  }
]
const defaultLayout = {
  labelCol: { md: { span: 6 } },
  wrapperCol: { md: { span: 14 } }
}
const isEmpty = data => data === null || data === undefined || data === ''

export default {
  name: 'approvalFormList',
  components: { STable, PermBox, workFlowTable, MergePay, EditLise, refuseModel },
  data() {
    return {
      undoResultList,
      mergeSchoolId: '',
      printVisible: false,
      config: null,
      isSingle: true, //同意拒绝 非批量--TRUE，批量--false
      defaultLayout,
      queryParam: {},
      tabKey: 1,
      tabList: [{ id: 1, text: '待我审批' }, { id: 4, text: '待我支付' }, { id: 2, text: '已审批' }, { id: 3, text: '付款记录' }],
      stateOptions,
      clearFilters: null,
      columns,
      selectedRows: [],
      selectedRowKeys: [],
      schoolList: [],
      loadData: parameter => {
        const { page, limit, sortField, sortOrder } = parameter
        let pageInfo = { pageNum: page, pageSize: limit }
        if (sortField === 'createUser' && sortOrder === 'ascend') {
          pageInfo.orderByColumn = ' CONVERT(TRIM(procinst.create_user_name) USING gbk) asc'
        } else if (sortField === 'createUser' && sortOrder === 'descend') {
          pageInfo.orderByColumn = ' CONVERT(TRIM(procinst.create_user_name) USING gbk) desc'
        } else if (this.tabKey === 1 || this.tabKey === 4) {
          pageInfo.orderByColumn = ' procinst.create_time asc'
        } else {
          pageInfo.orderByColumn = ' procinst.create_time desc'
        }
        if (this.tabKey === 1) {
          return waitApprovePage(Object.assign({}, pageInfo, this.queryParam)).then(res => {
            this.seleteList = res.data
            return res
          })
        } else if (this.tabKey === 2) {
          if(this.queryParam?.undoAssertionTime){
            this.queryParam.startUndoAssertionTime=this.queryParam.undoAssertionTime[0]
            this.queryParam.endUndoAssertionTime=this.queryParam.undoAssertionTime[1]
            delete this.queryParam.undoAssertionTime
          }else{
            this.queryParam.startUndoAssertionTime = null
            this.queryParam.endUndoAssertionTime = null
          }
          return alreadyApprovePage(Object.assign({}, pageInfo, this.queryParam)).then(res => {
            return res
          })
        } else if (this.tabKey === 3) {
          return pageRecord(Object.assign({}, pageInfo, this.queryParam)).then(res => {
            return res
          })
        } else if (this.tabKey === 4) {
          return listCashierUndo(Object.assign({}, pageInfo, this.queryParam)).then(res => {
            return res
          })
        } else if (this.tabKey === 5) {
          return FinishedPage(Object.assign({ state: 2 }, pageInfo, this.queryParam)).then(res => {
            return res
          })
        }
      },
      seleteList: [],

      confirmLoading: false,
      procinst: null,
      flowLine: null,

      /* 通过/驳回 */
      visible: false,
      modalType: 0, // 1.同意 0.驳回
      curUndoIds: [], // 当前选择数据
      curSchoolId: '',
      curProcinstId: '',
      title: '',
      form: {
        suggest: '',
        listOrgUser: [],
        _commitNodeType: undefined,
        _procedureType: []
      },
      rules: {},
      commitNodeType: null, //拒绝时提交节点
      procedureType: null, //请选择可编辑表单数据
      fotmItemOptions: [],
      procOrgUserList: [],

      /* 打印 */
      flowName: null,
      formData: {},
      confGlobal: {},

      task: '',

      showRowkeys: false, //合并打款
      mergePayVisible: false,
      deptTree: [], //所有银行列表
      bank: null,
      mergePaidPrice: 0,
      modeType: null,
      option: {
        string: 'bank',
        key: 'branch',
        apiOption: {
          api: listBankByDeptId, // promise类型的接口
          string: 'bankNo',
          value: 'id',
          childString: 'bankNo',
          childValue: 'id',
          params: {}
        }
      }
    }
  },
  created() {
    if (this.handlePermBox('fast:procinst:view')) {
      this.tabList.push({ id: 5, text: '已完成' })
    }
    this.initSchoolList()

    const tabKey = Vue.ls.get(`APPROVAL_FORM_LIST_KEY`) || 1
    const queryParam = Vue.ls.get(`APPROVAL_FORM_LIST_PARAM`)
    this.queryParam = queryParam ? JSON.parse(queryParam) : {}
    this.changeTabs(tabKey)
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRows = selectedRows
          this.selectedRowKeys = selectedRowKeys
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record._disabled || false
          }
        })
      }
    }
  },
  methods: {
    disabledDate(current) {
      return current && current > moment().endOf('day')
    },
    //修改记录
    getChangeList(record) {
      this.$refs.EditLise.open(record)
    },
    handleInput(val, data, extra) {
      this.form.bank = val
      if (val) {
        let data = extra.triggerNode.dataRef
        this.bank = {
          id: data.id,
          name: data.bankNo,
          bankName: data.bankName || '',
          bankCardNo: data.bankCardNo || ''
        }
      } else {
        this.bank = ''
      }
      this.$forceUpdate()
    },
    onTreeSearch(inputValue, path) {
      let { string, childString } = this.option.apiOption
      if (path.data.props[string]) {
        return path.data.props[string].indexOf(inputValue) > -1
      } else {
        return path.data.props[childString].indexOf(inputValue) > -1
      }
    },
    _handleTreeData(data, type1, type2, type3, type4) {
      data.forEach((item, index) => {
        item.title = item[type1] || ''
        item.value = item[type2]
        item.key = item[type2]
        if (item.children && item.children.length > 0) {
          if (this.option.disabled) {
            item.selectable = false
            item.disabled = true
          }
          this._handleTreeData(item.children, type3, type4, type3, type4)
        }
      })
    },
    initTreeData() {
      let { api, params, string, value, childString, childValue } = this.option.apiOption
      params.schoolId = this.mergeSchoolId
      api(params).then(res => {
        let data = res.data
        if ((res.code === 200 || res.code === '200') && data) {
          this._handleTreeData(data, string, value, childString, childValue)
          this.deptTree = data
        } else {
          this.deptTree = []
        }
      })
    },
    initSchoolList() {
      listWorkflowRoleUserDetail().then(res => {
        let data = []
        if (res.code == 200 && Array.isArray(res.data) && res.data.length > 0) {
          res.data.forEach(item => {
            if (Array.isArray(item.schools) && item.schools.length > 0) {
              data = data.concat(item.schools)
            }
          })
        }
        this.schoolList = this.process(data)
      })
    },
    process(arr) {
      // 缓存用于记录
      const cache = []
      for (const t of arr) {
        // 检查缓存中是否已经存在
        if (cache.find(c => c.schoolId === t.schoolId)) {
          // 已经存在说明以前记录过，现在这个就是多余的，直接忽略
          continue
        }
        // 不存在就说明以前没遇到过，把它记录下来
        cache.push(t)
      }
      // 记录结果就是过滤后的结果
      return cache
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase())
    },
    onClose() {
      this.printVisible = false
    },
    handleRight() {
      this.examine().then(() => {
        let modeType = this.selectedRows[0].code
        let isMultiple = false
        this.selectedRows.forEach(item => {
          if (item.code != modeType) isMultiple = true
        })
        if (isMultiple) {
          this.$notification['error']({
            message: '系统通知',
            description: '只能选择一种类型的单据'
          })
          return
        }
        this.modeType = modeType
        if (modeType == '001') {
          let list1 = this.selectedRows.filter(item => item.schoolId !== '0')
          let list2 = this.selectedRows.filter(item => item.schoolId == '0')
          let schoolId = ''
          if (list1.length > 0) {
            schoolId = list1[0].schoolId
          } else {
            let flowVal = JSON.parse(list2[0].flowVal)
            if (flowVal.paidBranch) {
              if (flowVal.paidBranch.data[0].school && flowVal.paidBranch.data[0].school.id) {
                schoolId = flowVal.paidBranch.data[0].school.branchId
              }
            }
            if (!schoolId && flowVal.priceInfo) {
              let paidBranch = flowVal.priceInfo[0].paidBranch.data[0]
              schoolId = paidBranch.school.branchId
            }
          }
          this.mergeSchoolId = schoolId
          let isOnly = true
          if (list1.length > 0) {
            list1.forEach(item => {
              if (item.schoolId != schoolId) isOnly = false
            })
          }
          if (isOnly && list2.length > 0) {
            let schoolIdList = []
            list2.forEach(item => {
              let flowVal = JSON.parse(item.flowVal)
              if (flowVal.paidBranch) {
                if (Array.isArray(flowVal.paidBranch.data) && flowVal.paidBranch.data.length > 0) schoolIdList = [...schoolIdList, ...flowVal.paidBranch.data]
              }
              flowVal.priceInfo.forEach(col => {
                if (Array.isArray(col.paidBranch.data) && col.paidBranch.data.length > 0) schoolIdList = [...schoolIdList, ...col.paidBranch.data]
              })
            })
            schoolIdList.forEach(item => {
              if (item.school.branchId && item.school.branchId != schoolId) isOnly = false
            })
          }
          if (!isOnly) {
            this.$notification['error']({
              message: '系统通知',
              description: '只能选择一个付款分馆'
            })
            return
          }
          let calculateFields = []
          let calculateFields1 = []

          this.selectedRows.forEach(item => {
            let formDates = JSON.parse(item.flowVal)
            if (formDates.paidBranch && formDates.paidBranch.data) calculateFields = [...calculateFields, ...formDates.paidBranch.data]
            calculateFields1 = [...calculateFields1, ...formDates.priceInfo.map(item => item.paidBranch)]
          })

          calculateFields1.forEach(item => {
            if (item.data) calculateFields = [...calculateFields, ...item.data]
          })
          let mergePaidPrice = this.$number(0)
          calculateFields = calculateFields.forEach(item => {
            if (item.school && item.school.branchId == this.mergeSchoolId) {
              mergePaidPrice = mergePaidPrice.plus(item.money)
            }
          })
          this.mergePaidPrice = mergePaidPrice.toNumber().toFixed(2)
        } else if (modeType == '004' || modeType == '005') {
          let mergeSchoolIds = []
          let mergePaidPrice = this.$number(0)
          this.selectedRows.forEach((n, o) => {
            mergePaidPrice = mergePaidPrice.plus(n.totalMoney)
            mergeSchoolIds.push(n.schoolId)
          })
          this.mergePaidPrice = mergePaidPrice.toNumber().toFixed(2)
          mergeSchoolIds = [...new Set(mergeSchoolIds)]
          if (mergeSchoolIds.length > 1) {
            this.$notification['error']({
              message: '系统通知',
              description: '只能选择一个付款分馆'
            })
            return
          }
          this.mergeSchoolId = mergeSchoolIds[0]
        } else {
          let mergePaidPrice = this.$number(0)
          this.selectedRows.forEach((n, o) => {
            mergePaidPrice = mergePaidPrice.plus(n.totalMoney)
          })
          this.mergePaidPrice = mergePaidPrice.toNumber().toFixed(2)
        }
        this.initTreeData()
        this.openModal(2)
      })
    },
    handleClose() {
      this.modeType = null
      this.showRowkeys = false
      this.selectedRowKeys = []
      this.selectedRows = []
      this.seleteList.forEach((record, index) => {
        this.$set(this.seleteList, index, Object.assign(record, { _disabled: false }))
      })
    },
    handledistribution() {
      this.modeType = null
      this.selectedRowKeys = []
      this.selectedRows = []
      this.seleteList.forEach((record, index) => {
        this.$set(this.seleteList, index, Object.assign(record, { _disabled: record.procdefType && record.procdefType.mergePay !== 'A' }))
      })
      this.showRowkeys = true
    },
    saveReimbursement(record) {
      let that = this
      this.$confirm({
        title: '系统提示',
        content: '确定录入数据吗',
        onOk() {
          let params = {
            checkSave: record.checkSave,
            code: record.code,
            procinstId: record.procinstId
          }
          saveReimbursement(params).then(res => {
            if (res.code == 200) {
              that.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
            }
          })
        },
        onCancel() {}
      })
    },
    handlePermBox(str) {
      return this.$tools.checkPerm(str)
    },
    changeTabs(e) {
      this.tabKey = e
      this.columns = cloneDeep(columns)
      if (this.tabKey === 1) {
        let index = this.columns.findIndex(c => c.key === 'procdefName') + 1
        this.columns.splice(index, 0, {
          title: '审批步骤',
          dataIndex: 'reviewer',
          key: 'reviewer',
          scopedSlots: {
            customRender: 'reviewer',
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon'
          },
          customRender: (text, record) => {
            return text ? `${record.content}审批中-${record.reviewer}` : ''
          },
        })
      }
      if (this.tabKey === 2) {
        this.columns.splice(0, 0, {
          title: '审批时间',
          dataIndex: 'undoAssertionTime',
          key: 'undoAssertionTime',
          scopedSlots: {
            customRender: 'undoAssertionTime',
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon'
          }
        })
        let index = this.columns.findIndex(c => c.key == 'createUser') + 1
        this.columns.splice(index, 0, {
          title: '审批结果',
          dataIndex: 'undoResult',
          key: 'undoResult',
          customRender:  text => {
            return text ===0?'等待处理':text ===1?'已读':text ===2?'同意':text ===3?'拒绝':text ===4?'委托':text ===5?'过期':''
          },
          scopedSlots: {
            customRender:'undoResult',
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon'
          }
        })
        this.columns.splice(index, 0, {
          title: '操作人',
          dataIndex: 'undoUserName',
          key: 'undoUserName',
          scopedSlots: {
            customRender: 'undoUserName',
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon'
          }
        })
      }
      //   let index = this.columns.findIndex(c => c.key == 'createUser') + 1
      //   this.columns.splice(index, 0, {
      //     title: '当前审核人',
      //     dataIndex: 'reviewer',
      //     key: 'reviewer',
      //     scopedSlots: {
      //       customRender: 'reviewer',
      //       filterDropdown: 'filterDropdown',
      //       filterIcon: 'filterIcon'
      //     }
      //   })
      // }
      if (this.tabKey === 1 || this.tabKey === 4) {
        let index = this.columns.findIndex(c => c.key === 'createTime') + 1
        this.columns.splice(index, 0, {
          title: '付款分馆',
          dataIndex: 'schoolName',
          key: 'schoolName',
          scopedSlots: {
            customRender: 'schoolName',
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon'
          }
        })
      }
      this._refreshTable()
    },
    _refreshTable() {
      this.selectedRowKeys = []
      this.$refs[`table${this.tabKey}`] && this.$refs[`table${this.tabKey}`][0].refresh()
    },
    // 校验是否有勾选
    examine() {
      return new Promise((resolve, reject) => {
        if (this.selectedRowKeys.length === 0) {
          this.$notification['error']({
            message: '系统通知',
            description: '请先进行勾选！'
          })
        } else {
          resolve()
        }
      })
    },
    // 搜索
    handleSearch(clearFilters, value, confirm, dataIndex) {
      if (dataIndex === '_title') {
        this.queryParam['title'] = value
      } else if (dataIndex === 'createTime') {
        this.queryParam['startCreateTime'] = value[0]
        this.queryParam['endCreateTime'] = value[1]
      } else {
        this.queryParam[dataIndex] = value
      }
      this.clearFilters = clearFilters
      confirm()

      Vue.ls.set('APPROVAL_FORM_LIST_KEY', this.tabKey)
      Vue.ls.set('APPROVAL_FORM_LIST_PARAM', JSON.stringify(this.queryParam))
    },
    // 重置
    handleReset(clearFilters, dataIndex) {
      if (clearFilters && dataIndex) {
        if (dataIndex === '_title') {
          this.queryParam['title'] = undefined
        } else if (dataIndex === 'createTime') {
          this.queryParam['startCreateTime'] = undefined
          this.queryParam['endCreateTime'] = undefined
        } else {
          this.queryParam[dataIndex] = undefined
        }
        clearFilters()
      } else {
        Vue.ls.remove('APPROVAL_FORM_LIST_KEY')
        Vue.ls.remove('APPROVAL_FORM_LIST_PARAM')
        this.queryParam = {}
        this.clearFilters ? this.clearFilters() : this._refreshTable()
      }
    },
    // 清除表单缓存
    removeStorage() {
      let keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.includes('form_controls')) localStorage.removeItem(key)
      })
    },

    // 跳转详情
    toInfo(record) {
      this.removeStorage()
      let id = record.procinstId ? record.procinstId : record.undoId

      if (this.tabKey === 1 || this.tabKey === 4) {
        const { href } = this.$router.resolve({
          name: 'viewNew',
          params: { id: id, undoId: record.undoId || 0, schoolId: record.schoolId || 0, isWait: 'true' }
        })
        //结合open打开新的页面
        // window.open(href, '_blank')
        this.$router.push({
          path: `viewNew/${id}/${record.undoId || 0}/${record.schoolId || 0}/true?tabKey=${this.tabKey}`
        })
      } else if (this.tabKey === 5) {
        // let id = record.procinstId ? record.procinstId : record.id
        const { href } = this.$router.resolve({
          name: 'flowlineEdit',
          params: { id: id, type: 2 }
        })
        //结合open打开新的页面
        // window.open(href, '_blank')
        this.$router.push({
          path: `flowlineEdit/${id}/${2}`
        })
      } else {
        const { href } = this.$router.resolve({
          name: 'viewNew',
          params: { id: id, undoId: record.undoId || 0, schoolId: record.schoolId || 0, isWait: 'false' }
        })
        //结合open打开新的页面
        // window.open(href, '_blank')
        this.$router.push({
          path: `viewNew/${id}/${record.undoId || 0}/${record.schoolId || 0}/false?tabKey=${this.tabKey}`
        })
      }
    },

    formatFormData(flowVal) {
      let formData = JSON.parse(flowVal)
      for (let key in formData) {
        if (Array.isArray(formData[key]) || formData[key] instanceof Object) {
          formData[key] = JSON.stringify(formData[key])
        } else {
          formData[key] = String(formData[key])
        }
      }
      return formData
    },
    initFormOperates(config) {
      // 自定义组件不加入权限控制
      const res = []
      const format = (list, parentName = '') =>
        list.forEach(t => {
          const data = {
            formId: t.formId,
            required: t.required,
            label: parentName ? [parentName, t.label].join('.') : t.label,
            tag: t.tag,
            vModel: t.vModel
          }
          res.push(data)
          Array.isArray(t.children) && format(t.children, t.label)
        })
      const formItemList = JSON.parse(JSON.stringify(config.formData.fields))
      const formItems = formItemList.filter(t => t.cmpType !== 'custom')
      format(formItems)
      return res
    },
    async initData(modalType, record) {
      let procinstRes = await workflowProcinstGet(record.procinstId)
      this.procinst = procinstRes.data

      if (modalType == 1) {
        let config = JSON.parse(this.procinst.procdefConfig)
        let formatFormData = this.formatFormData(this.procinst.flowVal)
        let flowLineRes = await workFlowProcdefFlowLine({
          procdefId: this.procinst.procdefId,
          procinstId: this.procinst.id,
          var: formatFormData
        })
        this.flowLine = flowLineRes.data

        let userRes = { data: [] }
        if (config.basicSetting.code === '001') {
          if (record.schoolId) {
            userRes = await listNextProcOrgUser({ procinstId: this.procinst.id, schoolId: record.schoolId })
          } else if (!record.schoolId && this.isChooseApprove) {
          }
        } else {
          userRes = await listNextProcOrgUser({ procinstId: this.procinst.id })
        }
        // let userRes = record.schoolId ? await listNextProcOrgUser({ procinstId: this.procinst.id, schoolId: record.schoolId }) : { data: [] }
        let taskRes = await workflowTaskGet(this.procinst.taskId)
        this.task = taskRes.data
        // if (this.task && this.task.counterSign && this.task.unCompleteNum > 1) {
        //   this.procOrgUserList = []
        // } else {
        userRes.data.forEach((item, index) => {
          if (item.orgUserBOList && Array.isArray(item.orgUserBOList) && item.orgUserBOList.length > 0) {
            item.orgUserBOList.forEach(items => {
              items.key = items.userId
              items.label = items.userName
            })
          }
          this.rules['listOrgUser' + index] = [{ required: true, message: '请选择' + item.title + '的审批人', trigger: 'change' }]
        })
        this.procOrgUserList = userRes.data
        // }
        // this.procOrgUserList = userRes.data?.map(data => ({ key: data.userId, label: data.userName })) || []
        // this.form.listOrgUser = this.procOrgUserList
      } else {
        let nodeList = JSON.parse(this.procinst.nodeList)
        let config = JSON.parse(this.procinst.procdefConfig)

        // let undoRes = await workflowUndoGet(record.undoId)
        let taskRes = await workflowTaskGet(this.procinst.taskId)
        let task = taskRes.data

        let procedure
        nodeList.forEach(item => {
          if (item.nodeId == task.nodeId) {
            procedure = item
          }
        })
        let { commitNodeType, updateLimitType } = procedure.properties.procdefType
        if (updateLimitType) {
          this.procedureType = updateLimitType
        }
        if (commitNodeType) {
          this.commitNodeType = commitNodeType
        }
        this.fotmItemOptions = this.initFormOperates(config)
      }
    },
    // 弹框字段验证规则
    initModalRules() {
      this.rules = {
        _commitNodeType: [{ required: true, message: '请选择再次提交审核节点', trigger: 'change' }],
        _procedureType: [{ required: false, message: '请选择可编辑表单数据', trigger: 'change' }],
        listOrgUser: [{ required: true, message: '请选择下一个流程的审批人', trigger: 'change' }]
      }
      if (this.modalType == 0) {
        this.rules.suggest = [{ required: true, message: '请输入理由', trigger: 'change' }]
      }
      if (this.modalType == 2) {
        let validateIdeNumber = (rule, value, callback) => {
          if (this.form.bank) {
            callback()
          } else {
            callback(new Error('请选择银行账户'))
          }
        }
        this.rules.bank = [{ required: true, validator: validateIdeNumber, trigger: 'change' }]
        // message: '请选择银行账户',
      }
    },
    getModelNameByTag(tag, fields = this.formData.fields) {
      let vModelList = []
      fields.forEach(field => {
        if (tag === 'fc-input-table') {
          if (field.tag === tag) {
            vModelList.push(field.vModel)
          }
        } else {
          if (field.tag === 'fc-input-table') {
            let pModel = field.vModel
            let vModel = this.getModelNameByTag(tag, field.children)
            vModel = vModel.map(item => pModel + '.' + item)
            vModelList.push(...vModel)
          } else if (field.tag === tag) {
            vModelList.push(field.vModel)
          }
        }
      })
      return vModelList
    },
    getSelectFinanceValue(vModel, formData) {
      let getValues = data => {
        let valueList = []
        if (data && data.data) {
          data.data.forEach(item => {
            if (item.school && item.school.branchId) {
              valueList.push(item)
            }
          })
        }
        return valueList
      }
      let value = []
      if (vModel.indexOf('.') > -1) {
        let [tabelVModel, cmpVModel] = vModel.split('.')
        let array = formData[tabelVModel].map(item => item[cmpVModel])
        array.forEach(data => {
          value.push(...getValues(data))
        })
      } else {
        value.push(...getValues(formData[vModel]))
      }
      return value
    },
    // 同意审批前需要验证表单内是否有必填项(true.验证通过)
    async agreeValidate(record) {
      let formData = JSON.parse(this.procinst.flowVal)
      let config = null
      if (this.procinst && this.procinst.procdefConfig) {
        config = JSON.parse(this.procinst.procdefConfig)
      } else {
        config = JSON.parse(this.procdef.config)
      }
      let formOperates = config.processData.properties.formOperates
      let procdefType = {}

      if (record.undoId) {
        let taskRes = await workflowTaskGet(this.procinst.taskId)
        let task = taskRes.data
        this.task = task
        let nodeId = !record.undoId ? this.procinst.nodeId : this.task.nodeId
        let flag = true
        this.flowLine.forEach(item => {
          if (item.nodeId == nodeId) {
            formOperates = item.properties.formOperates
            procdefType = item.properties.procdefType
            flag = false
          }
        })
        if (flag) {
          let nodeList = JSON.parse(this.procinst.nodeList)
          nodeList.forEach(item => {
            if (item.nodeId == nodeId) {
              formOperates = item.properties.formOperates
              procdefType = item.properties.procdefType
            }
          })
        }
      }

      let requiredFields = []
      const fieldIsEmpty = (field, value) => {
        if (field.tag === 'fc-select-feeType') {
          let { finSpendingItemSplits } = value
          if (!finSpendingItemSplits || !Array.isArray(finSpendingItemSplits)) return false
          let checkCol = true
          finSpendingItemSplits.forEach(col => {
            if (!col.feeItemName || !col.financeName || !col.operateName) {
              checkCol = false
            }
          })
          return !checkCol
        } else if (field.tag === 'fc-select-finance') {
          return true
        } else {
          return isEmpty(value)
        }
      }
      const loopGetRequiredField = (array, before = null) => {
        array.forEach(field => {
          let formOperate = formOperates.find(item => item.formId == field.formId)?.formOperate
          if (field.required && !formData[field.vModel]) {
            if (before) {
              ;(formData[before.vModel] || []).forEach(sub => {
                if (formOperate == 2 && fieldIsEmpty(field, sub[field.vModel])) requiredFields.push([before, field])
              })
            } else {
              if (formOperate == 2 && fieldIsEmpty(field, formData[field.vModel])) requiredFields.push([field])
            }
          }
          if (field.rowType === 'table') {
            loopGetRequiredField(field.children, field)
          }
        })
      }

      loopGetRequiredField(JSON.parse(this.procinst.procdefConfig).formData.fields)

      if (procdefType.editPaidAccount) {
        let valueList = []
        let vModelList = this.getModelNameByTag('fc-select-finance', formData.fields)
        vModelList.forEach(item => {
          valueList.push(...this.getSelectFinanceValue(item, formData))
        })
        let data = valueList.find(d => d.school?.branchId === record.schoolId)
        return !isEmpty(data?.bank?.id)
      }
      return !requiredFields.length
    },
    // 打开 同意/驳回 弹框
    async openModal(modalType, record) {
      this.modalType = modalType
      this.initModalRules()
      if (record) {
        this.isSingle = true
        this.curUndoIds = [record.undoId]
        this.curSchoolId = record.schoolId
        this.curProcinstId = record.procinstId || this.procinst.id
        await this.initData(modalType, record)
        if (modalType) {
          this.title = '同意审批'
          let validate = await this.agreeValidate(record)
          if (!validate) {
            this.toInfo(record)
            return
          }
          this.visible = true
        } else {
          this.title = '驳回审批'
          this.$refs.refuseModel.open()
        }
      } else {
        this.isSingle = false
        this.examine().then(async () => {
          let rows = new Set(this.selectedRows.map(item => item.procdefId))
          if (rows.size > 1) {
            return this.$notification['error']({
              message: '系统通知',
              description: `不能批量${modalType ? '同意' : '驳回'}不同单据模板的审批`
            })
          }

          await this.initData(modalType, this.selectedRows[0])
          if (modalType == 1) {
            this.title = '批量同意审批'
          } else if (modalType == 2) {
            this.title = '合并打款'
            this.form.bank = null
          } else {
            this.title = '批量驳回审批'
          }
          this.curUndoIds = this.selectedRowKeys
          this.curSchoolId = ''
          this.visible = true
        })
      }
    },
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let request = ''
          if (this.modalType) {
            if (this.isSingle) {
              let nodeList = JSON.parse(JSON.stringify(this.flowLine))
              nodeList.shift()
              let params = this.curUndoIds.map(undoId => ({
                undoId,
                suggest: this.form.suggest,
                flowVal: this.procinst.flowVal,
                nodeList: JSON.stringify(nodeList)
              }))
              let listOrgUser = JSON.parse(JSON.stringify(this.procOrgUserList))
              this.procOrgUserList.forEach((item, index) => {
                if (item.orgUserBOList && Array.isArray(item.orgUserBOList) && item.orgUserBOList.length > 0) {
                  item.orgUserBOList.forEach(items => {
                    if (items.key == this.form['listOrgUser' + index]) {
                      listOrgUser[index].orgUserBOList = [
                        {
                          userId: items.userId,
                          userName: items.userName
                        }
                      ]
                    }
                  })
                }
              })
              params = {
                nodeBOList: listOrgUser,
                paramList: params,
                procinstId: this.procinst.id,
                schoolId: this.curSchoolId
              }
              // params.nodeBOList = listOrgUser
              // this.form.listOrgUser.map(data => ({ userId: data.key, userName: data.label.trim() })),
              request = updateNextProcOrgUser(params)
            } else {
              let params = this.selectedRows.map(undoId => {
                let nodeList = JSON.parse(undoId.nodeList)
                return {
                  undoId: undoId.undoId,
                  suggest: this.form.suggest,
                  flowVal: undoId.flowVal,
                  nodeList: JSON.stringify(nodeList)
                }
              })
              if (this.modalType == 1) {
                request = listAgree(params)
              } else if (this.modalType == 2) {
                // let bank = {
                //   id: this.bank.id,
                //   name: this.bank.name
                // }
                // params.forEach(item => {
                //   let flowVal = JSON.parse(item.flowVal)
                //   let school = flowVal.paidBranch.data[0].school
                //   if (school && school.branchId && school.branchId == this.mergeSchoolId) {
                //     flowVal.paidBranch.data[0].bank = bank
                //   }
                //   flowVal.priceInfo.forEach((col, index) => {
                //     let paidBranch = col.paidBranch.data
                //     if (Array.isArray(paidBranch) && paidBranch.length > 0) {
                //       paidBranch.forEach(branchIntem => {
                //         if (branchIntem.school && branchIntem.school.branchId && branchIntem.school.branchId == this.mergeSchoolId) {
                //           branchIntem.bank = bank
                //         }
                //       })
                //     }
                //   })
                //   item.flowVal = JSON.stringify(flowVal)
                // })
                let paramsMerge = {
                  undoIds: params.map(item => item.undoId),
                  bankId: this.bank.id,
                  bankName: this.bank.name,
                  deptId: this.mergeSchoolId,
                  suggest: this.form.suggest
                }
                if (this.modeType == '004' || this.modeType == '005') {
                  paramsMerge.bankCardNo = this.bank.bankCardNo
                  paramsMerge.bankCardNoName = this.bank.bankName
                }
                request = megerAgree(paramsMerge)
              }
            }
          } else {
            let configLimit = {}
            if (this.commitNodeType == 'toChooseNode') {
              configLimit.commitNodeType = this.form._commitNodeType
            }
            if (this.procedureType == 'chooseLimit') {
              configLimit.updateLimitType = this.form._procedureType
            }
            let b = function(obj) {
              for (let key in obj) {
                return false
              }
              return true
            }
            if (b(configLimit)) {
              configLimit = undefined
            } else {
              configLimit = JSON.stringify(configLimit)
            }

            let params = this.curUndoIds.map(undoId => ({
              undoId,
              suggest: this.form.suggest,
              configLimit
            }))
            request = this.isSingle ? workflowUndoRefuse(params) : listRefuse(params)
          }

          this.confirmLoading = true
          request
            .then(res => {
              if (res.code === 200) {
                this.$notification['success']({
                  message: '系统通知',
                  description: '操作成功'
                })
                this.handleCancel()
                this._refreshTable()
              } else {
                this.$notification['error']({
                  message: '系统通知',
                  description: res.msg
                })
              }
            })
            .finally(() => (this.confirmLoading = false))
        }
      })
    },
    handleCancel() {
      this.visible = false
      this.procinst = null
      this.commitNodeType = null
      this.procedureType = null
      this.form.listOrgUser = []
      this.$refs.ruleForm.resetFields()
    },
    refuseModelConfirm(data) {
      const { refuseSuggest, refuseFlow, procedureType, commitNodeType, undoIds } = data
      let param = {
        undoId: this.curUndoIds[0],
        nodeUndoIds: undoIds,
        nodeId: refuseFlow,
        commitNodeStatus: commitNodeType,
        suggest: refuseSuggest,
        configLimit: {}
      }
      if (this.commitNodeType == 'toChooseNode') {
        param.configLimit.commitNodeType = commitNodeType
      }
      if (this.procedureType == 'chooseLimit') {
        param.configLimit.updateLimitType = procedureType
        param.limit = data.procedure ? JSON.stringify(data.procedure) : null
      }
      param.configLimit = JSON.stringify(param.configLimit)

      this.$refs.refuseModel.loading()
      rejectAnyNode(param)
        .then(res => {
          if (res.code == '200') {
            this.$notification['success']({
              message: '系统通知',
              description: '处理成功!'
            })
            this._refreshTable()
          } else {
            this.$notification['error']({
              message: '系统通知',
              description: '处理失败,请稍后重试!'
            })
          }
        })
        .finally(e => {
          this.commitNodeType = null
          this.procedureType = null
          this.$refs.refuseModel.close()
        })
    },

    handleExportClick(e) {
      const callback = res => {
        if (res.type !== 'application/vnd.ms-excel') {
          this.$message.error('导出失败')
          return false
        }
        const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        const downloadElement = document.createElement('a')
        const href = window.URL.createObjectURL(blob)
        let filename = '审批导出.xlsx'
        if (e.key == 1) filename = '离职审批.xlsx'
        if (e.key == 2) filename = '费用报销单审批.xlsx'
        if (e.key == 3) filename = '费用报销单审批.xlsx'
        downloadElement.style.display = 'none'
        downloadElement.href = href
        downloadElement.download = filename //下载后文件名
        document.body.appendChild(downloadElement)
        downloadElement.click() //点击下载
        document.body.removeChild(downloadElement) //下载完成移除元素
        window.URL.revokeObjectURL(href) //释放掉blob对象
      }
      const errCallback = err => {}
      let key = ''
      if (e.key == 1) {
        key ='006'
      }else if (e.key == 2) {
        key ='001'
      }else if (e.key == 3) {
        key ='008'
      }else{
        key=''
      }
      if(e.key){
        downTeacher(Object.assign({ code: key }, this.queryParam))
          .then(callback)
          .catch(errCallback)
      }
    },
    // 批量导出
    exportExcel() {
      const callback = res => {
        if (res.type !== 'application/vnd.ms-excel') {
          this.$message.error('导出失败')
          return false
        }
        const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        const downloadElement = document.createElement('a')
        const href = window.URL.createObjectURL(blob)
        // let contentDisposition = res.headers['content-disposition'];  //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
        // let patt = new RegExp("filename=([^;]+\\.[^\\.;]+);*");
        // let result = patt.exec(contentDisposition);
        // let filename = decodeURI(result[1]);
        let filename = 'excel.xlsx'
        if (this.tabKey === 1) {
          filename = '待我审批.xlsx'
        } else if (this.tabKey === 2) {
          filename = '已审批.xlsx'
        } else if (this.tabKey === 3) {
          filename = '付款记录.xlsx'
        } else if (this.tabKey === 4) {
          filename = '待我支付.xlsx'
        }

        downloadElement.style.display = 'none'
        downloadElement.href = href
        downloadElement.download = filename //下载后文件名
        document.body.appendChild(downloadElement)
        downloadElement.click() //点击下载
        document.body.removeChild(downloadElement) //下载完成移除元素
        window.URL.revokeObjectURL(href) //释放掉blob对象
      }

      const errCallback = err => {}

      if (this.tabKey === 1 || this.tabKey === 4) {
        downWaitFile(this.queryParam)
          .then(callback)
          .catch(errCallback)
      } else if (this.tabKey === 2) {
        downAlreadyFile(this.queryParam)
          .then(callback)
          .catch(errCallback)
      } else if (this.tabKey === 3) {
        downLoadFile(this.queryParam)
          .then(callback)
          .catch(errCallback)
      }
    },
    // 打印
    print({ procinstId }) {
      workflowProcinstGet(procinstId).then(res => {
        let procinst = res.data
        this.procinst = procinst
        let config = JSON.parse(procinst.procdefConfig)
        this.config = config
        this.flowName = config.basicSetting.flowName
        this.formData = JSON.parse(procinst.flowVal)
        this.confGlobal = JSON.parse(procinst.procdefConfig).formData
        this.$nextTick(() => {
          // this.$refs.workFlowTable.print()
          this.printVisible = true
        })
      })
    }
  }
}
</script>

<style lang="less" type="text/less" scoped>
@import '~@/assets/style/index';

.column_search_wrap {
  width: 220px;
  padding: 10px;

  .column_search_input {
    display: block;
    width: 100%;
  }

  .column_search_radio {
    display: block;
    height: 30px;
    line-height: 30px;
  }
}
.checkIcon {
  margin-right: 10px;
  font-size: 14px;
  font-weight: 500;
}
.checkIcon.check {
  color: #1ba97b;
  margin-left: 6px;
}
.selectBtn {
  border: 1px solid #d9d9d9;
  vertical-align: middle;
  display: inline-block;
  height: 32px;
  line-height: 1.499;
  white-space: nowrap;
  text-align: center;
  // box-shadow: 0 2px 0 rgba(0, 0, 0, 2%);
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;

  .ant-btn {
    border: 0;
    box-shadow: none;
  }
}
.selectBtn.active {
  // background-color: #f5f5f5;
  .ant-btn {
    border: 0;
  }
}
.ant-table-thead > tr > th .ant-table-filter-icon {
  right: unset;
}
</style>
