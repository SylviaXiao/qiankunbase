<template>
  <div>
    <a-card :bordered="false">
      <div class="mb20">
        <a-space :size="15">
          <perm-box perm="fast:workflow:save">
            <a-button type="primary" @click="addApproval()">新增审批流</a-button>
          </perm-box>
        </a-space>
      </div>
      <s-table ref="table" :columns="columns" :data="loadData" :scroll="{ x: true }">
        <span slot="name" slot-scope="text, record">
          <a href="#" @click="toApproval(record)">{{ text }}</a>
        </span>
        <span slot="icon" slot-scope="text">
          <img :src="iconList[text].src" alt="" style="width:45px;border-radius:10px;" />
        </span>
        <span slot="action" slot-scope="text, record">
          <perm-box perm="fast:workflow:update">
            <a href="#" @click="addApproval(record)">修改</a>
          </perm-box>
          <perm-box perm="fast:workflow:del" v-if="record.status != 1">
            <a href="#" @click="handleRemove(record)">删除</a>
          </perm-box>
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import moment from 'moment'
import { workflowListPage, workflowDel } from '@/api/workFlow/request.js'
const req = require.context('public/approverIcon', false, /\.png$/)
const iconList = req.keys().map((t, idx) => ({ src: req(t), id: idx }))
// import { formConf } from '@/components/DynamicForm/components/generator/config.js'
export default {
  name: 'approvalList',
  props: {},
  data() {
    return {
      queryParam: {},
      iconList,
      columns: [
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
        },
        {
          title: '最后更新时间',
          dataIndex: 'modifyTime',
          key: 'modifyTime',
          customRender: text => {
            if (text == 0) {
              return ''
            } else {
              return moment(text).format('YYYY-MM-DD')
            }
          }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: parameter => {
        const {page, limit} = parameter
        const pageInfo = {pageNum: page, pageSize: limit}
        return workflowListPage(Object.assign({}, pageInfo, this.queryParam)).then(res => {
          return res
        })
      },
    }
  },
  computed: {},
  methods: {
    toApproval(record) {
      this.$router.push({ name: 'formNew', params: { procdefId: record.id } })
    },
    addApproval(record) {
      let id = 'new'
      if (record) {
        id = record.id
      }
      localStorage.setItem('FLOWLINEMOCEKADA', '')
      this.$router.push({ path: `approvalNew/${id}` })
    },
    handleRemove(record) {
      this.$confirm({
        title: '系统提示',
        content: '确定删除吗?',
        onOk: () => {
          workflowDel([record.id]).then(res => {
            if (res.code == 200) {
              this.$notification['success']({
                message: '系统通知',
                description: '删除成功'
              })
              this._refreshTable()
            }
          })
        },
        onCancel() {}
      })
    },
    _refreshTable() {
      this.$refs.table.refresh()
    }
  },
  components: { STable }
}
</script>
<style lang="less" type="text/less" scoped>
@import '~@/assets/style/index';
</style>
