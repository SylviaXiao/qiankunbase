<template>
  <div class="mt20">
    <div ref="elementSearch" :style="{ padding: '20px 0' }">
      <a-card :bordered="false">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" ref="elementSearch" :searchParams="searchParams"> </search-com-pro>
      </a-card>
    </div>
    <a-card :bordered="false">
      <div class="mt10 mb10 flex" style="justify-content:flex-end;">
        <perm-box perm="fast:invoice:view">
          <a-button type="primary" @click.native="toReal" class="mr20" style="background:#1890ff;">
            发票再次验真
          </a-button>
          <a-button type="primary" @click.native="toReject" class="mr20" style="background:#1890ff;">
            发票管理
          </a-button>
        </perm-box>
        <a-button type="primary" @click.native="downloadStu">
          导出
        </a-button>
      </div>
      <s-table ref="table" :columns="columns" :data="loadData" rowKey="id">
        <span slot="totalMoney" slot-scope="text, record">
          <a href="javascript:;" @click="toDayTotalMoneyDetails(record)">
            {{ text }}
          </a>
        </span>
        <span slot="owingTicketTotal" slot-scope="text, record">
          <a href="javascript:;" @click="toMyInvoice(record)">
            {{ text }}
          </a>
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import Vue from 'vue'
import { STable, PermBox } from '@/components'
import { SearchComPro } from '@/components'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { pageInvoice, getLoginUserCompany, downLoadFile } from '@/api/invoice'
export default {
  name: 'approvalFormList',
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
        title: '抵票报销总额',
        align: 'center',
        dataIndex: 'totalMoney',
        width: 150,
        scopedSlots: { customRender: 'totalMoney' }
      },
      {
        title: '已抵报销总额',
        align: 'center',
        dataIndex: 'offsetTotal',
        width: 150
      },
      {
        title: '欠票总额',
        align: 'center',
        dataIndex: 'owingTicketTotal',
        width: 150,
        scopedSlots: { customRender: 'owingTicketTotal' }
      },
      {
        title: '公司名称',
        align: 'center',
        dataIndex: 'companyName',
        width: 150
      }
    ]
    return {
      columns, //表内容
      loadData: parameter => {
        const { page, limit, sortField, sortOrder } = parameter
        let pageInfo = { pageNum: page, pageSize: limit }
        return pageInvoice(Object.assign(pageInfo, this.queryParams)).then(res => {
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
          type: 'select', // 静态select框
          key: 'zero',
          show: true,
          label: '欠票总额',
          placeholder: '请选择欠票总额',
          staticArr: [
            {
              string: '差额为0',
              value: '0'
            },
            {
              string: '差额不为0',
              value: '1'
            }
          ]
        }
      ],
      queryParams: {}
    }
  },
  created() {},
  computed: {},
  methods: {
    toMyInvoice(record) {
      this.$router.push({
        name: 'myInvoice',
        params: { createUser: record.createUser, createUserName: record.createUserName, companyName: record.companyName },
        query: {}
      })
    },
    toReject() {
      this.$router.push({
        name: 'invoiceReject',
        params: {},
        query: {}
      })
    },
    toReal() {
      this.$router.push({
        name: 'invoiceChecked',
        params: {},
        query: {}
      })
    },
    toDayTotalMoneyDetails(record) {
      const { createUserName, totalMoney, procinstIds } = record
      this.$router.push({
        name: 'dayTotalMoneyDetails',
        params: { createUserName, totalMoney, procinstIds }
      })
    },
    //导出
    downloadStu() {
      const callback = res => {
        if (res.type !== 'application/vnd.ms-excel') {
          this.$message.error('导出失败')
          return false
        }
        const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        const downloadElement = document.createElement('a')
        const href = window.URL.createObjectURL(blob)
        let filename = '发票.xlsx'
        downloadElement.style.display = 'none'
        downloadElement.href = href
        downloadElement.download = filename //下载后文件名
        document.body.appendChild(downloadElement)
        downloadElement.click() //点击下载
        document.body.removeChild(downloadElement) //下载完成移除元素
        window.URL.revokeObjectURL(href) //释放掉blob对象
      }
      const errCallback = err => {}
      downLoadFile(this.queryParams)
        .then(callback)
        .catch(errCallback)
    },
    searchSubmit(data) {
      this.queryParams = data
      if (data.zero) this.queryParams.zero = Number(data.zero)
      this._refreshTable()
    },
    _refreshTable() {
      if (this.$refs.table) this.$refs.table.refresh()
    }
  }
}
</script>

<style lang="less" type="text/less" scoped>
@import '~@/assets/style/index';
</style>
