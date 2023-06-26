<template>
  <div class="mt20">
    <div ref="elementSearch" :style="{ padding: '20px 0' }">
      <a-card :bordered="false">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" ref="elementSearch" :searchParams="searchParams"> </search-com-pro>
      </a-card>
    </div>
    <a-card :bordered="false">
      <div class="mt10 mb10 flex" style="justify-content:flex-end;">
        <a-button type="primary" @click.native="toMyInvoice" :loading='loading' class="mr20">
          批量重发
        </a-button>
        <a-button type="primary" @click.native="handleDelete" :loading='deleteLoading' class="mr20">
          批量删除
        </a-button>
      </div>
      <s-table ref="table" :columns="columns" :data="loadData" rowKey="id" :rowSelection="rowSelection"> </s-table>
    </a-card>
  </div>
</template>
<script>
import Vue from 'vue'
import { STable, PermBox } from '@/components'
import { SearchComPro } from '@/components'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { listInvoiceLibraryInfo, getLoginUserCompany, updateCheck, delInvoice } from '@/api/invoice'
import moment from 'moment'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment()
  .add(1, 'months')
  .date(0)
  .format('YYYY-MM-DD')
export default {
  name: 'invoiceChecked',
  components: { STable, PermBox, SearchComPro },
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
          return text == 'A' ? '增值税专用发票' : text == 'B' ? '增值税普通发票' : text == 'C' ? '定额发票' : text == 'D' ? '的士票' : ''
        }
      },
      {
        title: '发票号码',
        align: 'center',
        dataIndex: 'invoiceNo',
        width: 150
      },
      {
        title: '开票代码',
        align: 'center',
        dataIndex: 'invoiceCode',
        width: 150
      },
      // {
      //   title: '是否验真',
      //   align: 'center',
      //   dataIndex: 'fpStatus',
      //   width: 150
      // },
      {
        title: '开票日期',
        align: 'center',
        dataIndex: 'invoiceDate',
        width: 150
      },
      {
        title: '金额',
        align: 'center',
        dataIndex: 'invoiceMoney',
        width: 150
      },
      {
        title: '校验码',
        align: 'center',
        dataIndex: 'checkCode',
        width: 150
      }
    ]
    return {
      loading:false,
      deleteLoading:false,
      selectedRowKeys: [],
      selectedRows: [],
      columns, //表内容
      loadData: parameter => {
        const { page, limit, sortField, sortOrder } = parameter
        let pageInfo = { pageNum: page, pageSize: limit, invoiceCheck: '未验真' }
        return listInvoiceLibraryInfo(Object.assign(pageInfo, this.queryParams)).then(res => {
          return res
        })
      },
      //搜索项
      searchParams: [
        {
          type: 'select',
          show: true,
          isShow: true,
          key: 'companyName',
          label: '公司名称',
          placeholder: '请选择公司名称',
          mode: 'multiple',
          apiOption: {
            api: getLoginUserCompany,
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'text',
          key: 'createUserName',
          show: true,
          label: '员工姓名',
          placeholder: '请输入员工姓名'
        },
        {
          type: 'date',
          key: 'InvoiceDate',
          label: '开票日期',
          show: true,
          placeholder: '请选择开票日期',
          format: 'YYYY-MM-DD',
          isDate: true
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
            }
          ]
        },
        {
          type: 'text',
          key: 'invoiceNo',
          label: '发票号码',
          show: true,
          placeholder: '请输入发票号码'
        }
      ],
      queryParams: {}
    }
  },
  created() {},
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys
          this.selectedRows = selectedRows
        }
      }
    }
  },
  methods: {
    handleDelete() {
      let that = this
      this.examine().then(() => {
        this.$confirm({
          title: '系统提示',
          content: '确定删除吗',
          onOk() {
            this.deleteLoading=true
            delInvoice({ invoiceInfoIds: that.selectedRowKeys.join(',') }).then(res => {
              that.$notification['success']({
                message: '系统通知',
                description: '操作成功!'
              })
              this.deleteLoading=false
              that._refreshTable()
            }).catch(err=>{
              this.deleteLoading=false
            })
          },
          onCancel() {}
        })
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
    toviewInvoice() {},
    toMyInvoice() {
      this.examine().then(() => {
        this.loading=true
        updateCheck(this.selectedRowKeys).then(res => {
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功!'
          })
          this.loading=false
          this._refreshTable()
        }).catch(err=>{
          this.loading=false
        })
      })
    },
    searchSubmit(data) {
      let { startInvoiceDate, endInvoiceDate } = data
      this.queryParams = data

      if (startInvoiceDate) this.queryParams.startInvoiceDate = new Date(startInvoiceDate)
      if (endInvoiceDate) this.queryParams.endInvoiceDate = new Date(endInvoiceDate)
      delete this.queryParams.InvoiceDate
      this._refreshTable()
    },
    _refreshTable() {
      this.selectedRowKeys = []
      this.selectedRows = []
      if (this.$refs.table) this.$refs.table.refresh()
    }
  }
}
</script>
<style lang="less" type="text/less" scoped>
@import '~@/assets/style/index';
</style>
