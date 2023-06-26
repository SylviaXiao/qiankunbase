<template>
  <div class="mt20">
    <a-card>
      <div class="cardContent">
        <s-table ref="table" :columns="columns" style="width:100%;" :data="loadData" :scroll="{ x: true }">
          <span slot="action" slot-scope="text, record">
            <a href="#" @click="onDelete(record)">删除</a>
            <a href="#" class="ml10" @click="onEdit(record)">继续编辑</a>
          </span>
          <!-- <span slot="titleToinfo" slot-scope="text, record">
            <a href="#" @click="toInfo(record)">{{ text }}</a>
          </span> -->
          <span slot="startTime" slot-scope="text"> {{ formateTime(text) }}</span>
          <span slot="endTime" slot-scope="text"> {{ formateTime(text) }}</span>
          <!-- <span slot="state" slot-scope="text"> {{ text == 3 ? '撤回' : text == 2 ? '通过' : text == -1 ? '驳回' : text == 1 ? '审批中' : '' }}</span> -->
        </s-table>
      </div>
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import moment from 'moment'
import { workflowProcinstPage, workflowProcinstDel } from '@/api/workFlow/request.js'
const req = require.context('public/approverIcon', false, /\.png$/)
const iconList = req.keys().map((t, idx) => ({ src: req(t), id: idx }))

export default {
  name: 'approvalList',
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tabKey: 1,
      queryParam: {
        state: 0
      },
      columns: [
        {
          title: '标题',
          key: 'title',
          dataIndex: 'title',
          scopedSlots: { customRender: 'titleToinfo' },
          customRender: text => {
            return text || '无'
          }
        },
        {
          title: '单据模板',
          dataIndex: 'procdefName',
          key: 'procdefName',
          scopedSlots: { customRender: 'procdefName' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: parameter => {
        const { page, limit } = parameter
        const pageInfo = { pageNum: page, pageSize: limit }
        this.queryParam.procdefId = this.id
        return workflowProcinstPage(Object.assign({}, pageInfo, this.queryParam)).then(res => {
          if (res.data.data && res.data.data.length > 0) {
            res.data.data.forEach(item => {
              item.config = JSON.parse(item.procdefConfig)
              item.approvelName = item.config.basicSetting.flowName
            })
          }
          return res
        })
      }
    }
  },
  mounted() {},
  computed: {},
  methods: {
    formateTime(text) {
      if (text) {
        return moment(text).format('YYYY-MM-DD hh:mm:ss')
      } else {
        return ''
      }
    },
    _refreshTable() {
      this.$refs.table.refresh()
    },
    onDelete(record) {
      let that = this
      const modal = this.$confirm({
        title: '系统提示',
        content: '确定删除吗？',
        onOk() {
          workflowProcinstDel([record.procinstId]).then(res => {
            if (res.code == 200) {
              that.$notification['success']({
                message: '系统通知',
                description: '删除成功'
              })
              that._refreshTable()
            } else {
              this.$notification['error']({
                message: '系统通知',
                description: '删除失败'
              })
            }
            modal.destroy()
          })
        },
        onCancel(err) {
          modal.destroy()
        }
      })
    },
    onEdit(record) {
      let id = record.procinstId ? record.procinstId : record.id
      this.$emit('handleCancel', { procinstId: id })
      // this.$router.push({ name: 'formDraft', params: { procdefId: record.procdefId }, query: { procinstId: id } })
      // this.$router.push({ name: 'formDraft', params: { procdefId: record.procdefId }, query: { procinstId: id } })
    }
  },
  components: { STable }
}
</script>
<style lang="less" type="text/less" scoped>
@import '~@/assets/style/index';
.searchTop {
  margin-bottom: 20px;
}
.cardContent {
  display: flex;
  > div:nth-child(1) {
    border-right: 1px solid #e8e8e8;
    /deep/.ant-tabs .ant-tabs-left-bar {
      border-right: 0rem solid #e8e8e8;
    }
  }
  > div:nth-child(2) {
    width: 100%;
    padding: 0 20px 20px 20px;
  }
}
.tabListP {
  /deep/.ant-tabs-nav .ant-tabs-tab-active {
    color: #19a97b;

    background-color: rgba(220, 223, 230, 0.29);
    // border-left: 3px solid #1ba97b;
    .tabActive {
      border-left: 2px solid rgb(27, 169, 123);
    }
  }
  /deep/.ant-tabs-nav .ant-tabs-tab {
    width: 208px;
    line-height: 50px;
    border-width: 0px;
    border-style: none;
    border-color: unset;
    border-radius: 4px;
    font-size: 14px;
    padding: 0px;
    text-align: left;
    font-weight: normal;
    font-style: normal;
  }
}
</style>
