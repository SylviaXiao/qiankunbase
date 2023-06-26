<template>
  <div>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="600"
      title="新增报销"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @cancel="close"
    >
      <s-table ref="table" :columns="columns" :data="loadData" rowKey="id" :showPagination="false">
        <span slot="name" slot-scope="text, record">
          <a href="#" @click="toApproval(record)">{{ text }}</a>
        </span>
        <span slot="icon" slot-scope="text">
          <img :src="iconList[text].src" alt="" style="width:25px;border-radius:5px;" />
        </span>
      </s-table>
      <template slot="footer">
        <a-button key="back" @click="close">
          关闭
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment'
import { STable } from '@/components'
import { listUserProcdef } from '@/api/workFlow/request'

const req = require.context('public/approverIcon', false, /\.png$/)
const iconList = req.keys().map((t, idx) => ({ src: req(t), id: idx }))
const columns = [
  {
    title: '审批图标',
    key: 'icon',
    dataIndex: 'icon',
    scopedSlots: { customRender: 'icon' }
  },
  {
    title: '审批流名称',
    dataIndex: 'name',
    key: 'name',
    scopedSlots: { customRender: 'name' }
  }
]

export default {
  components: { STable },
  data() {
    return {
      /* 新增报销 */
      visible: false,
      confirmLoading: false,
      queryParam: {},
      columns,
      iconList,
      loadData: parameter => {
        // const {page, limit} = parameter
        const pageInfo = { pageNum: 0, pageSize: 0 }
        return listUserProcdef(Object.assign({}, pageInfo, this.queryParam)).then(res => {
          return res
        })
      }
    }
  },
  methods: {
    _refreshTable() {
      this.$refs.table && this.$refs.table.refresh()
    },

    /* 新增报销 */
    open() {
      this.visible = true
    },
    close() {
      this.visible = false
    },
    toApproval(record) {
      localStorage.setItem('FLOWLINEFORMEDIT', '')
      localStorage.setItem('FLOWLINEFORMEDITId', '')
      localStorage.setItem('FLOWLINEFORMEDITPRODEFID', '')
      this.$router.push({ name: 'formNew', params: { procdefId: record.id } })
      this.close()
    }
  }
}
</script>

<style lang="less" type="text/less" scoped></style>
