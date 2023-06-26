<template>
  <div class="mt20">
    <!-- 合并打款 -->
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
        <a-form-model-item v-bind="defaultLayout" label="理由" prop="suggest">
          <a-input v-model="form.suggest" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      visible: false,
      form: {
        suggest: ''
      },
      rules: {},

      showRowkeys: false //合并打款
    }
  },
  created() {},
  computed: {},
  methods: {
    // 弹框字段验证规则
    initModalRules() {
      // this.rules = {
      //   _commitNodeType: [{ required: true, message: '请选择再次提交审核节点', trigger: 'change' }],
      //   _procedureType: [{ required: true, message: '请选择可编辑表单数据', trigger: 'change' }],
      //   listOrgUser: [{ required: true, message: '请选择下一个流程的审批人', trigger: 'change' }]
      // }
      // if (!this.modalType) {
      //   this.rules.suggest = [{ required: true, message: '请输入理由', trigger: 'change' }]
      // }
    },
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let request = ''
          if (this.modalType) {
            let nodeList = JSON.parse(JSON.stringify(this.flowLine))
            nodeList.shift()
            let params = this.curUndoIds.map(undoId => ({
              undoId,
              suggest: this.form.suggest,
              flowVal: this.procinst.flowVal,
              nodeList: JSON.stringify(nodeList)
            }))

            if (this.isSingle) {
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
                procinstId: this.procinst.id
              }
              // params.nodeBOList = listOrgUser
              // this.form.listOrgUser.map(data => ({ userId: data.key, userName: data.label.trim() })),
              request = updateNextProcOrgUser(params)
            } else {
              request = listAgree(params)
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
    }
  }
}
</script>

<style lang="less" type="text/less" scoped></style>
