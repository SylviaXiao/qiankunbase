<template>
  <div>
    <a-card :bordered="false">
      <div class="mb20">
        <a-space :size="15">
          <perm-box perm="fast:mode:save">
            <a-button icon="plus-circle" type="primary" @click="handleSave">新增</a-button>
          </perm-box>
        </a-space>
      </div>
      <s-table ref="table" :columns="columns" :data="loadData" rowKey="id" :showPagination="false">
        <span slot="action" slot-scope="text, record">
          <perm-box perm="fast:mode:update">
            <a href="#" @click="handleSave(record)">修改</a>
          </perm-box>
          <perm-box perm="fast:mode:del">
            <a href="#" @click="handleDelete(record)">删除</a>
          </perm-box>
        </span>
      </s-table>
    </a-card>

    <!-- 新增 -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="600"
      title="新增类型"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-form-model-item v-bind="defaultLayout" label="类型名称" prop="name">
          <a-input v-model="form.name"/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
  import { STable, PermBox } from '@/components'
  import { billTypeList, billTypeAdd, billTypeUpdate, billTypeDelete } from '@/api/workFlow/request'

  const columns = [
    {
      title: '类型名称',
      dataIndex: 'name',
      key: 'name',
      scopedSlots: { customRender: 'name' }
    },
    {
      title: '操作',
      dataIndex: 'action',
      scopedSlots: { customRender: 'action' },
      fixed: 'right'
    }
  ]
  const defaultLayout = {
    labelCol: { md: { span: 6 } },
    wrapperCol: { md: { span: 14 } }
  }

  export default {
    components: {
      STable,
      PermBox,
    },
    data() {
      return {
        columns,
        loadData: parameter => {
          return billTypeList().then(res => {
            return res
          })
        },
        defaultLayout,
        confirmLoading: false,

        /* 新增 */
        visible: false,
        form: {
          id: '',
          name: '',
        },
        rules: {
          name: [{ required: true, message: '请输入类型名称', trigger: 'change' }],
        },
      }
    },
    methods: {
      /* 新增 */
      handleSave({ id, name }) {
        if (id) this.form = { id, name }
        else this.form = {}
        this.visible = true
      },
      handleOk() {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.confirmLoading = true
            let request = this.form.id ? billTypeUpdate : billTypeAdd
            request(this.form)
              .then(res => {
                if (res.code === 200) {
                  this.$notification['success']({
                    message: '系统通知',
                    description: '保存成功'
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
        this.$refs.ruleForm.resetFields()
        this.visible = false
      },

      // 删除
      handleDelete({ id }) {
        this.$confirm({
          title: '系统提示',
          content: '确定要删除选中数据吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            billTypeDelete([id]).then(res => {
              if (res.code === 200) {
                this.$notification['success']({
                  message: '系统通知',
                  description: '删除成功'
                })
                this._refreshTable()
              } else {
                this.$notification['error']({
                  message: '系统通知',
                  description: res.msg
                })
              }
            })
          }
        })
      },

      // 刷新列表
      _refreshTable() {
        this.$refs.table.refresh()
      }
    }
  }
</script>

<style lang="less" scoped type="text/less">
</style>
