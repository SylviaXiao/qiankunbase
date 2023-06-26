<template>
  <div class="mt20">
    <div ref="elementSearch" :style="{ padding: '20px 0' }">
      <a-card :bordered="false">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" ref="elementSearch" :searchParams="searchParams"> </search-com-pro>
      </a-card>
    </div>
    <a-card :bordered="false">
      <div class="mt10 mb10 flex" style="justify-content:flex-end;" v-if="showUpload">
        <a-button type="primary" @click.native="toMyInvoice" class="mr20" style="background:#1890ff;">
          上传发票
        </a-button>
      </div>
      <s-table
        ref="table"
        :columns="columns"
        :data="loadData"
        :rowKey="
          (record, index) => {
            return index
          }
        "
      >
        <span slot="infoLogDTOList" slot-scope="text, record">
          <div v-for="(item, index) in text" :key="index">
            <a href="javascript:;" @click="toviewInvoice(text, index)" :style="item.useType == 'C' ? 'color:red;' : ''">
              {{ item.invoiceLibraryInfo.invoiceNo || item.invoiceLibraryInfo.fileName }}
            </a>
          </div>
        </span>
        <span slot="use" slot-scope="text, record">
          <div v-for="(item, index) in record.infoLogDTOList" :key="index" :style="item.useType == 'C' ? 'color:red;height:21px;' : 'height:21px;'">
            {{ item.useType == 'A' ? '是' : item.useType == 'B' ? '否' : item.useType == 'C' ? '驳回' : '' }}
          </div>
        </span>
        <span slot="remark" slot-scope="text, record">
          <div v-for="(item, index) in record.infoLogDTOList" :key="index" :style="item.useType == 'C' ? 'color:red;height:21px;' : 'height:21px;'">
            {{ item.reason }}
          </div>
        </span>
      </s-table>
    </a-card>
    <Preview ref="Preview"></Preview>
  </div>
</template>
<script>
import Vue from 'vue'
import { STable, PermBox } from '@/components'
import { SearchComPro } from '@/components'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { pageInvoiceInfo, getLoginUserCompany } from '@/api/invoice'
import Preview from './UploadSth/preview.vue'
export default {
  name: 'approvalFormList',
  components: { STable, PermBox, SearchComPro, Preview },
  data() {
    const columns = [
      {
        title: '提单人',
        align: 'center',
        dataIndex: 'createUserName',
        width: 150
      },
      {
        title: '时间',
        align: 'center',
        dataIndex: 'createTime',
        width: 150
      },
      {
        title: '报销总金额',
        align: 'center',
        dataIndex: 'dayTotalMoney',
        width: 150
      },
      {
        title: '发票总额',
        align: 'center',
        dataIndex: 'invoceMoney',
        width: 150
      },
      {
        title: '差额',
        align: 'center',
        dataIndex: 'surplus',
        width: 150
      },
      {
        title: '发票号',
        align: 'center',
        dataIndex: 'infoLogDTOList',
        width: 150,
        scopedSlots: { customRender: 'infoLogDTOList' }
      },
      {
        title: '公司名称',
        align: 'center',
        dataIndex: 'companyName',
        width: 150
      },
      {
        title: '是否使用',
        align: 'center',
        dataIndex: 'use',
        width: 150,
        scopedSlots: { customRender: 'use' }
      },
      {
        title: '备注',
        align: 'center',
        dataIndex: 'remark',
        width: 150,
        scopedSlots: { customRender: 'remark' }
      }
    ]
    return {
      showUpload: false,
      columns, //表内容
      loadData: parameter => {
        let { createUser, companyName } = this.$route.params
        const { page, limit, sortField, sortOrder } = parameter
        let pageInfo = { pageNum: page, pageSize: limit, createUser: createUser, companyName: companyName }
        return pageInvoiceInfo(Object.assign(pageInfo, this.queryParams)).then(res => {
          return res
        })
      },
      //搜索项
      searchParams: [
        {
          type: 'text',
          key: 'invoiceNo',
          show: true,
          label: '发票号',
          placeholder: '请输入发票号'
        },
        // {
        //   type: 'select', // 静态select框
        //   key: 'beforeUserType',
        //   show: true,
        //   label: '是否使用',
        //   placeholder: '请选择是否使用',
        //   staticArr: [
        //     {
        //       string: '是',
        //       value: 'Y'
        //     },
        //     {
        //       string: '否',
        //       value: 'N'
        //     }
        //   ]
        // },
        {
          type: 'select',
          show: true,
          isShow: true,
          search: true,
          key: 'companyName',
          label: '公司名称',
          placeholder: '请选择公司名称',
          apiOption: {
            api: getLoginUserCompany,
            string: 'name',
            value: 'id'
          }
        }
      ],
      queryParams: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        if (route.name == 'myInvoice') {
          this._refreshTable()
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    let id = this.$store.getters.userInfo?.user?.id
    this.showUpload = id == this.$route.params.createUser ? true : false
  },
  computed: {},
  methods: {
    toviewInvoice(previewFiles, index) {
      this.$refs.Preview.open(previewFiles, index)
    },
    toMyInvoice() {
      let { createUser, createUserName, companyName } = this.$route.params
      if (this.queryParams?.companyName) companyName = this.queryParams.companyName
      this.$router.push({
        name: 'uploadMyInvoice',
        params: { createUser: createUser, createUserName: createUserName, companyName: companyName },
        query: {}
      })
    },
    searchSubmit(data) {
      this.queryParams = data

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
