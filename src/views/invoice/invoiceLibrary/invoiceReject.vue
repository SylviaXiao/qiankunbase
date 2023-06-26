<template>
  <div class="mt20">
    <div ref="elementSearch" :style="{ padding: '20px 0' }">
      <a-card :bordered="false">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" ref="elementSearch" :searchParams="searchParams"> </search-com-pro>
      </a-card>
    </div>
    <a-card :bordered="false">
      <div class="mt10 mb10 flex" style="justify-content:flex-end;">
          <a-button type="primary" @click.native="handleDeduct()" class="mr20" style="background:#1890ff;">
            抵扣
          </a-button>
          <a-button type="primary" @click.native="handleReject" class="mr20" style="background:#1890ff;">
            驳回
          </a-button>
      </div>
      <s-table ref="table" :columns="columns" :data="loadData" rowKey="id" :rowSelection="rowSelection">
        <span slot="invoiceLibraryInfoList" slot-scope="text, record">
          <a href="javascript:;" @click="toviewInvoice(record)">
            {{ record.invoiceNo || record.fileName }}
          </a>
        </span>
        <span slot="invoiceState" slot-scope="text, record">
          <a href="javascript:;" v-if="record.invoiceState === 'D'" @click="handlePrint(record)"> 已抵扣 </a>
            <span v-else style="color:#9ca1a5;">{{text === 'A' ? '未操作' : text === 'B' ? '已驳回' : text === 'D' ? '已抵扣' : ''}}</span>
        </span>
        <span slot="action" slot-scope="text, record">
          <span v-if="record.invoiceState === 'B'" style="color:#9ca1a5;">已驳回</span>
          <span v-if="record.invoiceState === 'B'" style="color:#9ca1a5;">抵扣</span>
          <a href="javascript:;" v-if="record.invoiceState === 'A'" @click="toRejectInvoice(record)"> 驳回 </a>
          <span v-if="record.invoiceState === 'D'" style="color:#9ca1a5;">已抵扣</span>
          <span v-if="record.invoiceState === 'D'" style="color:#9ca1a5;">驳回</span>
          <a href="javascript:;" v-if="record.invoiceState === 'A'" @click="handleDeduct(record)"> 抵扣 </a>
        </span>
      </s-table>
    </a-card>
    <Preview ref="Preview" :showPre="false"></Preview>
    <Expense ref="Expense" :invoiceIds="invoiceIds" :createUserName='createUserName' @refreshTable='_refreshTable' :maxPrice="maxPrice"></Expense>
    <a-modal title="驳回原因" :visible="visible" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel">
      <a-form :form="form">
        <a-row>
          <a-col :span="24">
            <a-form-item v-bind="formItemLayout" label="驳回原因">
              <a-textarea
                placeholder="请输入驳回原因"
                :rows="4"
                v-decorator="[
                  'reason',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入驳回原因'
                      }
                    ]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { STable, PermBox } from '@/components'
import { SearchComPro } from '@/components'
import { getInvoicePrint, listInvoiceLibraryInfo, rejectInvoice, saveInvoicePrint } from '@/api/invoice'
import Preview from './UploadSth/preview.vue'
import Expense from './expense.vue'
export default {
  name: 'invoiceReject',
  components: { STable, PermBox, SearchComPro, Preview ,Expense},
  data() {
    const columns = [
      {
        title: '提单人',
        align: 'center',
        dataIndex: 'createUserName',
        width: 150
      },
      {
        title: '公司名称',
        align: 'center',
        dataIndex: 'companyName',
        width: 150
      },
      {
        title: '发票类型',
        align: 'center',
        dataIndex: 'invoiceType',
        width: 150,
        customRender: (text, record) => {
          return text === 'A' ? '增值税专用发票' : text === 'B' ? '增值税普通发票' : text === 'C' ? '定额发票' : text === 'D' ? '的士票' : ''
        }
      },

      {
        title: '开票代码',
        align: 'center',
        dataIndex: 'invoiceCode',
        width: 150
      },
      {
        title: '发票号码',
        align: 'center',
        dataIndex: 'invoiceNo',
        width: 150
      },
      // {
      //   title: '是否验真',
      //   align: 'center',
      //   dataIndex: 'fpStatus',
      //   width: 150
      // },
      // {
      //   title: '开票日期',
      //   align: 'center',
      //   dataIndex: 'fpDate',
      //   width: 150
      // },
      {
        title: '金额',
        align: 'center',
        dataIndex: 'invoiceMoney',
        width: 150
      },
      {
        title: '预览',
        align: 'center',
        dataIndex: 'invoiceLibraryInfoList',
        width: 150,
        scopedSlots: { customRender: 'invoiceLibraryInfoList' }
      },
      {
        title: '状态',
        align: 'center',
        dataIndex: 'invoiceState',
        width: 150,
        scopedSlots: { customRender: 'invoiceState' },
      },
      {
        title: '驳回原因',
        align: 'center',
        dataIndex: 'remark',
        width: 150
      },
      {
        title: '操作',
        align: 'center',
        dataIndex: 'action',
        width: 80,
        scopedSlots: { customRender: 'action' }
      }
    ]
    return {
      createUserName:'',
      maxPrice:0,
      invoiceIds:'',
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 }
        }
      },
      columns, //表内容
      loadData: parameter => {
        const { page, limit, sortField, sortOrder } = parameter
        let pageInfo = { pageNum: page, pageSize: limit,type:'A' }
        return listInvoiceLibraryInfo(Object.assign(pageInfo, this.queryParams)).then(res => {
          return res
        })
      },
      //搜索项
      searchParams: [
        {
          type: 'text',
          key: 'createUserName',
          show: true,
          label: '提单人',
          placeholder: '请输入提单人'
        },
        {
          type: 'select', // 静态select框
          key: 'invoiceType',
          show: true,
          label: '发票类型',
          placeholder: '请选择发票类型',
          staticArr: [
            {
              string: '增值税专用发票',
              value: 'A'
            },
            {
              string: '增值税普通发票',
              value: 'B'
            },
            {
              string: '定额发票',
              value: 'C'
            },
            {
              string: '的士票',
              value: 'D'
            }
          ]
        },
        {
          type: 'text',
          key: 'invoiceNo',
          label: '发票号码',
          show: true,
          placeholder: '请输入发票号码'
        },
        {
          type: 'select', // 静态select框
          key: 'invoiceState',
          show: true,
          label: '状态',
          placeholder: '请选择状态',
          staticArr: [
            {
              string: '已驳回',
              value: 'B'
            },
            {
              string: '已抵扣',
              value: 'D'
            },
            {
              string: '未操作',
              value: 'A'
            }
          ]
        }
      ],
      queryParams: {},
      confirmLoading: false,
      visible: false,
      invoiceInfoId: '',
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created() {
    this.form = this.$form.createForm(this)
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys
          this.selectedRows = selectedRows
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.invoiceState === 'B'||record.invoiceState === 'D'
          }
        })
      }
    }
  },
  methods: {
    handlePrint(record){
      getInvoicePrint({invoiceId :record.id}).then(res=>{
        this.$refs.Expense.open()
        this.$refs.Expense.backData(res.data)
      })

    },
    //校验是否有勾选
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
    handleDeduct(record){
      if(record){
        this.invoiceIds = record.id
        this.maxPrice=record.invoiceMoney
        this.createUserName=record.createUserName
        this.$refs.Expense.open()
      }else{
        this.examine().then(() => {
          this.invoiceIds = this.selectedRowKeys.join(',')
          this.maxPrice=this.selectedRows.reduce((sum, c) => (c.invoiceMoney || 0) + sum, 0)
          let createUserName =Array.from(new Set(this.selectedRows.map(item=>item.createUserName)))
          this.createUserName=createUserName.join(',')
          this.$refs.Expense.open()
        })
      }
    },
    handleReject(){
      this.examine().then(() => {
        this.invoiceInfoId = this.selectedRowKeys.join(',')
        this.visible = true
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.confirmLoading = false
      this.visible = false
    },
    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          rejectInvoice(Object.assign({ invoiceInfoId: this.invoiceInfoId }, values))
            .then(res => {
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功!'
              })
              this.handleCancel()
              this._refreshTable()
            })
            .catch(err => {
              this.confirmLoading = false
            })
        }
      })
    },
    toviewInvoice(previewFiles, index) {
      this.$refs.Preview.open([previewFiles], 0)
    },
    toRejectInvoice(record) {
      this.invoiceInfoId = record.id
      this.visible = true
    },
    searchSubmit(data) {
      this.queryParams = data
      this._refreshTable()
    },
    _refreshTable() {
      this.selectedRowKeys=[]
      this.selectedRows=[]
      this.invoiceInfoId=''
      if (this.$refs.table) this.$refs.table.refresh()
    }
  }
}
</script>

<style lang="less" type="text/less" scoped>
@import '~@/assets/style/index';
</style>
