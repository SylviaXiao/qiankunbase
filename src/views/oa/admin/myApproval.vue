<template>
  <div class="mt20">
    <div class="mb20">
      <a-space :size="15">
        <a-button type="primary" @click="newApprovalOpen">新增报销</a-button>
        <a-button v-if="tabKey === 1 || tabKey === 2" @click="handleRecall()">批量撤销</a-button>

        <span v-if="tabKey === 3">
          <!--<a-button @click="exportExcel">批量导出</a-button>-->
          <a-dropdown>
            <a-menu slot="overlay" @click="handleExportClick">
              <a-menu-item :key="1">费用报销单</a-menu-item>
            </a-menu>
            <a-button>
              批量导出
              <a-icon type="down"/>
            </a-button>
          </a-dropdown>
        </span>
        <!--<perm-box perm="student:user:school" v-if="tabKey === 2">
          <a-button>批量催审</a-button>
        </perm-box>-->
      </a-space>
    </div>
    <a-card :bordered="false">
      <a-tabs :activeKey="tabKey" @change="changeTabs">
        <a-tab-pane :tab="item.text" v-for="item in tabList" :key="item.id">
          <div class="mb20">
            <a-button @click="handleReset()">重置查询</a-button>
          </div>
          <s-table
            :ref="`table${item.id}`"
            :columns="columns"
            :data="loadData"
            :rowKey="(record, index) => index"
            :rowSelection="rowSelection"
            :scroll="{ x: true }"
          >
            <span slot="_title" slot-scope="text, record">
              <a href="#" @click="toInfo(record)">
                <a-icon type="fire" theme="filled" style="color: red" v-if="record.urgent === 'A'" />
                {{ record.title || '无' }}
              </a>
            </span>
            <a-icon slot="filterIcon" slot-scope="filtered" type="search" :style="{ color: filtered ? '#1ba97b' : undefined }" />
            <div slot="filterDropdown" slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }" class="column_search_wrap">
              <template v-if="column.dataIndex === 'createTime'">
                <a-range-picker
                  style="width: 100%"
                  class="mb10"
                  format="YYYY-MM-DD"
                  valueFormat="YYYY-MM-DD"
                  :value="selectedKeys[0]"
                  :allowClear="true"
                  @change="e => setSelectedKeys(e.length > 0 ? [e] : [])"
                />
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
              <span v-if="tabKey === 1 || tabKey === 4 || tabKey === 5">
                <a href="#" style="padding: 0 5px;" @click="handleEdit(record)">修改</a>
              </span>
              <!-- <span v-if="tabKey === 1">
                <a href="#" style="padding: 0 5px;" @click="handleRecall(record)">撤销</a>
              </span> -->
              <span v-if="tabKey === 2 && record.procdefType && record.procdefType.recall">
                <a href="#" style="padding: 0 5px;" @click="handleRecall(record)">撤销</a>
              </span>
              <!--<span v-if="tabKey === 2">
                <a href="#" style="padding: 0 5px;" @click="handleUrgent(record)">{{record.urgent === 'A' ? '取消加急' : '加急'}}</a>
              </span>-->
              <!--<perm-box perm="student:user:school" v-if="tabKey === 3">
                <a href="#" @click="updateState(record, 5)">确认</a>
              </perm-box>-->
              <span v-if="tabKey === 3">
                <a href="#" style="padding: 0 5px;" @click="handleCopy(record)">复制</a>
              </span>
              <span v-if="tabKey === 4 || tabKey === 5 || tabKey === 6 || (tabKey === 1 || isAdmin)">
                <a href="#" style="padding: 0 5px;" @click="handleDelete(record)">删除</a>
              </span>
              <span v-if="tabKey !== 5">
                <a href="#" style="padding: 0 5px;" @click="print(record)">打印</a>
              </span>
            </span>
          </s-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <!-- 新增报销 -->
    <newApproval ref="newApproval" />

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
import moment from 'moment'
import { STable, PermBox } from '@/components'
import store from '@/store'
import workFlowTable from '@/views/oa/view/workFlowTable'
import newApproval from './modules/newApproval'
import {
  workflowProcinstPage,
  workflowDel,
  workFlowProcdefGet,
  workflowProcinstRecall,
  workflowProcinstGet,
  workflowProcinstDel,
  updateState,
  updateUrgent,
  downMyAll
} from '@/api/workFlow/request'
import Vue from 'vue'

const stateOptions = [
  { value: '-1', label: '驳回' },
  { value: '0', label: '待审批' },
  { value: '1', label: '审批中' },
  { value: '2', label: '通过' },
  { value: '3', label: '撤回' },
  { value: '5', label: '确定' },
  { value: '6', label: '已过期' }
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
    title: '当前审核人',
    dataIndex: 'reviewer',
    key: 'reviewer',
    scopedSlots: {
      customRender: 'reviewer',
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon'
    }
  },
  {
    title: '审批状态',
    dataIndex: 'state',
    key: 'state',
    scopedSlots: {
      customRender: 'state'
    },
    customRender: text => {
      return stateOptions.find(item => item.value == text)?.label || ''
    }
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  }
]
const draftsColumns = [
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
    title: '操作',
    key: 'action',
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  components: { STable, PermBox, newApproval, workFlowTable },
  data() {
    return {
      isAdmin: store.getters.roles && store.getters.roles.permissionList && store.getters.roles.permissionList[0] == '*',
      printVisible: false,
      procinst: null,
      config: null,
      confirmLoading: false,
      queryParam: {},
      tabKey: 2,
      tabList: [
        { id: 2, text: '审批中', value: '1' },
        { id: 1, text: '被驳回', value: '-1' },
        { id: 3, text: '已付款', value: '2' },
        { id: 4, text: '草稿箱', value: '0' },
        { id: 5, text: '已撤销', value: '3' },
        { id: 6, text: '已过期', value: '6' }
      ],
      stateOptions,
      clearFilters: null,
      columns: [],
      selectedRows: [],
      selectedRowKeys: [],
      loadData: parameter => {
        if (this.tabKey != 4) {
          this.columns = columns
        } else {
          this.columns = draftsColumns
        }
        const { page, limit } = parameter
        const pageInfo = { pageNum: page, pageSize: limit }
        let state = this.tabList.find(item => item.id == this.tabKey)?.value

        let parama = JSON.parse(JSON.stringify(this.queryParam))
        if (this.tabKey == 4) {
          let { totalMoney, procdefName, title, modeType } = this.queryParam
          parama = {
            totalMoney: totalMoney || '',
            procdefName: procdefName || '',
            title: title || '',
            modeType: modeType || ''
          }
        }
        return workflowProcinstPage(Object.assign({ state }, pageInfo, parama)).then(res => {
          return res
        })
      },

      /* 打印 */
      flowName: null,
      formData: {},
      confGlobal: {}
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRows: this.selectedRows,
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRows = selectedRows
          this.selectedRowKeys = selectedRowKeys
        },
        getCheckboxProps: record => ({
          props: {
            disabled: this.tabKey===3&&record.code!=='001'
          }
        })
      }
    }
  },
  created() {},
  methods: {
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
        if (e.key == 1) filename = '费用报销单审批.xlsx'
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
        key ='001'
      }else{
        key=''
      }
      if(e.key){
        let params = { code: key }
        if(this.selectedRows.length>0){
          params.procinstIds=this.selectedRows.map(item=>{return item.procinstId}).join(',')
          console.log(this.selectedRows)
        }else{
          params=Object.assign({ code: key }, this.queryParam)
        }
        downMyAll(params)
          .then(callback)
          .catch(errCallback)
      }
    },
    onClose() {
      this.printVisible = false
    },
    changeTabs(e) {
      this.tabKey = e

      this._refreshTable()
    },
    _refreshTable() {
      this.selectedRows = []
      this.selectedRowKeys = []

      this.$nextTick(() => {
        this.$refs[`table${this.tabKey}`] && this.$refs[`table${this.tabKey}`][0] && this.$refs[`table${this.tabKey}`][0].refresh()
      })
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
    },
    // 重置
    handleReset(clearFilters, dataIndex) {
      if (clearFilters && dataIndex) {
        let paramName = dataIndex
        if (dataIndex === '_title') paramName = 'title'
        this.queryParam[paramName] = undefined
        clearFilters()
      } else {
        this.queryParam = {}
        this._refreshTable()
        // this.clearFilters ? this.clearFilters() : this._refreshTable()
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
      if (this.tabKey === 1 || this.tabKey === 4 || this.tabKey === 5 || this.tabKey === 6) {
        this.handleEdit(record)
      } else {
        this.$router.push({
          path: `viewNew/${id}/0/0/false`
        })
      }
    },
    // 批量撤销
    handleRecall(record) {
      if (record) {
        this.recall([record.procinstId])
      } else {
        this.examine().then(() => {
          if (this.tabKey === 2 && this.selectedRows.findIndex(record => !record.procdefType.recall) >= 0) {
            this.$notification['error']({
              message: '系统通知',
              description: '选择单据当前阶段不允许撤销！'
            })
          } else {
            this.recall(this.selectedRows.map(record => record.procinstId))
          }
        })
      }
    },
    recall(ids) {
      this.$confirm({
        title: '系统提示',
        content: '撤销后不可更改, 是否继续?',
        onOk: () => {
          this.confirmLoading = true
          workflowProcinstRecall(ids)
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
                  description: res.msg ? res.msg : '处理失败,请稍后重试!'
                })
              }
            })
            .finally(e => {
              this.confirmLoading = false
            })
        },
        onCancel: () => {}
      })
    },
    handleEdit(record) {
      this.removeStorage()
      if (this.tabKey === 4 || this.tabKey === 5) {
        this.$router.push({
          name: 'formNew',
          params: { procdefId: record.procdefId },
          query: { procinstId: record.procinstId ? record.procinstId : record.id, procinstType: this.tabKey === 5 ? 'recall' : 'draft' }
        })
      } else {
        let id = record.procinstId ? record.procinstId : record.id
        this.$router.push({
          path: `flowlineEdit/${id}/0`
        })
      }
    },
    handleCopy(record) {
      let id = record.procinstId ? record.procinstId : record.id
      let that = this
      workFlowProcdefGet({ id: record.procdefId }).then(data => {
        workflowProcinstGet(id).then(res => {
          if (res.data && res.data.flowVal) {
            let formData ={}
            if(record.code==='001'){
              let defaulyFormData =  JSON.parse(res.data.flowVal)
              formData=JSON.parse(data.data.config).formData
              formData.initiator=defaulyFormData.initiator
              formData.title=defaulyFormData.title
              formData.priceInfo=defaulyFormData.priceInfo.map(item=>{
                return {
                  expense:item.expense,
                  unit:item.unit
                }
              })
            }else{
              formData = JSON.parse(res.data.flowVal)
              formData.fields = JSON.parse(data.data.config).formData.fields
            }
            localStorage.setItem('FLOWLINEFORMEDIT', JSON.stringify(formData))
            localStorage.setItem('FLOWLINEFORMEDITId', record.procdefId)
            localStorage.setItem('FLOWLINEFORMEDITPRODEFID', '')
            that.removeStorage()
            console.log(7777,formData)
            that.$router.push({
              name: 'formNew',
              params: { procdefId: record.procdefId }
            })
          }
        })
      })
    },
    handleDelete(record) {
      this.$confirm({
        title: '系统提示',
        content: '删除后不可更改, 是否继续?',
        onOk: () => {
          this.confirmLoading = true
          workflowProcinstDel([record.procinstId])
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
              this.confirmLoading = false
            })
        },
        onCancel: () => {}
      })
    },
    // 修改状态
    updateState(record, state) {
      this.$confirm({
        title: '系统提示',
        content: '确认后不可更改, 是否继续?',
        onOk: () => {
          this.confirmLoading = true
          updateState(record.procinstId, state)
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
              this.confirmLoading = false
            })
        },
        onCancel: () => {}
      })
    },

    // 加急
    handleUrgent(record) {
      this.$confirm({
        title: '系统提示',
        content: record.urgent === 'A' ? '确认要取消加急吗?' : '确认要加急吗?',
        onOk: () => {
          this.confirmLoading = true
          updateUrgent({
            procinstId: record.procinstId,
            urgent: record.urgent === 'A' ? 'B' : 'A'
          })
            .then(res => {
              if (res.code == '200') {
                this.$notification['success']({
                  message: '系统通知',
                  description: '操作成功!'
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
              this.confirmLoading = false
            })
        },
        onCancel: () => {}
      })
    },

    /* 新增报销 */
    newApprovalOpen() {
      this.removeStorage()
      this.$refs.newApproval.open()
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
  width: 200px;
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
.ant-table-thead > tr > th .ant-table-filter-icon {
  right: unset;
}
</style>
