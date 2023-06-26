<script>
import render from '@/assets/utils/render.js'
import { trigger } from '@/components/DynamicForm/components/generator/config.js'

import { PROC_INST } from '@/api'
import {
  updateSpending,
  workflowReStart,
  workFlowProcdefStart,
  workflowProcinstRecall,
  workflowUndoAssignor,
  workflowUndoRefuse,
  listByProcinst,
  workflowUndoGet,
  workflowUndoReaded,
  workflowTaskGet,
  workflowProcinstGet,
  workflowUndoAgree,
  getLoginUserByProcinstId,
  workFlowProcdefFlowLine,
  workFlowProcdefGet
} from '@/api/workFlow/request'
import changeFlowline from '../form/changeFlowline/index.vue'
import { getUrlParam } from '@/assets/utils'
import FlowLine from './FlowLine'

import FlowOrgSelect from '../form/FlowLine/FlowOrgSelectNew/index.vue'
import workFlowTable from './workFlowTable/index.vue'
import workFlowData from './workFlowData/index.vue'
import { differenceWith } from 'lodash'
import events from '@/components/MultiTab/events.js'

const req = require.context('@/assets/flow_state', false, /\.png$/)
const iconList = req.keys().map((t, idx) => ({ src: req(t), id: idx }))

/**
 * 校验组织机构组件是否为空
 */
const setFcOrgSelectRule = (conf, ctx) => {
  return {
    validator: (rule, value, callback) => {
      var count = 0
      var val = ctx[ctx.confGlobal.formModel][rule.field]
      conf.tabList.forEach(key => {
        val && Array.isArray(val[key]) && (count += val[key].length)
      })
      callback(count ? undefined : new Error(`${conf.title}不能为空`))
    },
    trigger: trigger[conf.tag],
    type: 'object',
    required: true
  }
}
const setInputVerifyRule = (conf, ctx) => {
  return {
    validator: (rule, value, callback) => {
      let checkValue = ctx.$refs[conf.vModel].checkValue
      if (!checkValue) {
        for (let item of ctx.$refs[conf.vModel].$children) {
          if (item.checkValue) {
            checkValue = item.checkValue
            break
          }
        }
      }
      if (checkValue) {
        checkValue(false)
          .then(res => {
            const { data, msg } = res
            return callback(data ? undefined : new Error(msg || `${conf.label}验证错误`))
          })
          .catch(res => {
            const { msg } = res
            return callback(new Error(msg || `${conf.label}验证错误`))
          })
      } else {
        return callback()
      }
    },
    trigger: trigger[conf.tag],
    type: 'object',
    required: true
  }
}
/**
 * 收集表单必填项并组装成ElementUI表单校验得rules选项
 * 表格除外 表格自带校验
 */
function buildRules(conf, ctx) {
  if (conf.vModel === undefined || !trigger[conf.tag]) return
  const rules = []
  if (conf.required) {
    const type = Array.isArray(conf.defaultValue) ? 'array' : undefined
    let message = Array.isArray(conf.defaultValue) ? `请至少选择一个` : conf.placeholder
    if (message === undefined) message = `${conf.label}不能为空`
    if (conf.tag === 'fc-org-select') rules.push(setFcOrgSelectRule(conf, ctx))
    else if (conf.tag === 'fc-input-verify') rules.push(setInputVerifyRule(conf, ctx))
    else rules.push({ required: true, type, message, trigger: trigger[conf.tag] })
  }
  // 自定义正则匹配
  if (conf.regList && Array.isArray(conf.regList)) {
    conf.regList.forEach(item => {
      if (item.pattern) {
        rules.push({ pattern: eval(item.pattern), message: item.message, trigger: trigger[conf.tag] })
      }
    })
  }
  ctx.rules[conf.vModel] = rules
}

var setData = (ctx, val, prop, init = false) => {
  if (!prop) return
  if (ctx[ctx.confGlobal.formModel][prop] && Array.isArray(val)) {
    if (ctx[ctx.confGlobal.formModel][prop].length != val.length) ctx[ctx.confGlobal.formModel][prop].length = val.length
    val.forEach((item, index) => {
      ctx.$set(ctx[ctx.confGlobal.formModel][prop], index, item)
    })
  } else {
    ctx.$set(ctx[ctx.confGlobal.formModel], prop, val)
  }
  ctx.$forceUpdate()
}

var _isMounted = false // 收集默认值 渲染完成之后防止重复收集默认值

const buildData = (ctx, value, prop) => setData(ctx, value, prop, true)

const layouts = {
  colFormItem: function(conf, h, ctx, isList = false) {
    buildRules(conf, ctx)
    !_isMounted && buildData(ctx, conf.defaultValue, conf.vModel)
    let labelWidth = ''
    if (conf.labelWidth) labelWidth = `${conf.labelWidth}px`
    if (isList) labelWidth = '0px'
    const required = (!trigger[conf.tag] && conf.required) || conf.tag === 'fc-org-select'
    const handleInput = val => {
      setData(ctx, val, conf.vModel)
      if (conf.tag === 'fc-org-select') {
        /**
         * 组织机构组件数据复杂
         * async-validator不一定能准确捕获到数据变化
         * 所以在这里手动校验一次
         */
        ctx.$refs[ctx.confGlobal.formRef].validateField(conf.vModel, () => {})
      }
    }
    let item = (
      // style={conf.show ? 'display:none;' : ''}
      <el-col span={conf.span || 24}>
        <el-form-item label-width={labelWidth} label={isList ? '' : conf.label} prop={conf.vModel}>
          <render
            formData={ctx[ctx.confGlobal.formModel]}
            conf={conf}
            value={ctx[ctx.confGlobal.formModel][conf.vModel]}
            ref={conf.rowType === 'table' || conf.tag === 'fc-input-verify' ? conf.vModel : undefined}
            onInput={handleInput}
          />
        </el-form-item>
      </el-col>
    )
    let src = 'font-size: 14px;padding:6px 0px;margin-bottom: 4px;border-bottom: 0px solid #e5e5e5;'
    if (isList) {
      // style={conf.show ? 'display:none;' + src : src}
      var tableTitle = (
        <el-col span={24} style={src}>
          {conf.label}
        </el-col>
      )
      return conf.hidden ? null : [tableTitle, item]
    }

    return conf.hidden ? null : item
  },

  rowFormItem: function(conf, h, ctx) {
    if (conf.rowType === 'table') {
      ctx.tableRefs[conf.vModel] = conf
      const param = { ...conf, config: conf, formSize: ctx.confGlobal.size, labelWidth: `${conf.labelWidth || ctx.confGlobal.labelWidth}px` }
      return this.colFormItem(param, h, ctx, conf.type === 'list')
    }
    buildRules(conf, ctx)
    const props = {
      type: conf.type === 'default' ? undefined : conf.type,
      justify: conf.type === 'default' ? undefined : conf.justify,
      align: conf.type === 'default' ? undefined : conf.align,
      gutter: typeof conf.gutter === 'number' ? conf.gutter : undefined
    }
    let row = (
      // style={conf.show ? 'display:none;' : ''}
      <el-col span={conf.span || 24}>
        <el-row {...{ props: props }}>{Array.isArray(conf.children) && conf.children.map(el => layouts[el.layout](el, h, ctx))}</el-row>
      </el-col>
    )
    let divider
    if (conf.showDivider) {
      let explain
      if (conf.cmpType === 'custom' && conf.explain) {
        explain = (
          <el-tooltip effect="dark" content="组件说明" placement="top">
            <i class="el-icon-info" onClick={ctx.showExplain.bind(this, conf.explain, conf.label)} style="margin-right: 8px; color: #E6A23C;cursor: pointer;" />
          </el-tooltip>
        )
      }
      divider = (
        // style={conf.show ? 'display:none;' : ''}
        <el-col span={24}>
          <el-divider content-position="left">
            {explain} {conf.label}
          </el-divider>
        </el-col>
      )
      return [divider, row]
    }
    return row
  }
}

export default {
  data() {
    return {
      editType: null,
      showEditPaidAccount: false, //审批中是否允许编辑/查看打款账户
      showEditFeeType: false, //审批中是否允许查看/编辑费用类型
      splitMonthSelect: 'A', //分摊可选月份
      procdef: null,
      loading: false,
      isEdit: false,
      isCopy: false,
      tabIndex: 1,
      backFun: null,
      refuseSuggest: '',
      procedureType1: null, //请选择可编辑表单数据
      procedureType: [], //驳回后再次提交审核节点
      commitNodeType1: '', //拒绝时提交节点
      commitNodeType: '', //拒绝时提交节点
      procdefType: [], //拒绝表单
      fotmItemOptions: [],
      confirmLoading: false,
      visible: false,
      config: null,
      procinst: null,
      undo: null,
      task: null,
      assignor: [], //转单人
      isShowFlowOrgSelect: false,
      iconList,
      tableRefs: {},
      drawerTitle: '',
      drawerText: '',
      drawerVisible: false,
      containerWidth: 100,
      confGlobal: null,
      formData: null,
      rules: {},
      flowLine: null,
      workFlowProcdefFlowLine: null,
      orgCollection: {
        dep: [],
        role: [],
        user: [],
        position: []
      },
      flowLoading: false,
      /**
       * 表单操作权限
       */
      formOperatesType: {
        HIDE: 0,
        READ: 1,
        EDIT: 2
      },
      formTypes: {
        Online: {
          label: '在线设计',
          value: 0
        },
        Custom: {
          label: '定制表单',
          value: 1
        }
      }
    }
  },
  components: { changeFlowline, FlowLine, FlowOrgSelect, workFlowTable, workFlowData },
  computed: {
    code() {
      return this.config && this.config.basicSetting.code
    },
    activeIconSrc() {
      if (this.procinst) {
        const icon = this.iconList.find(t => t.id === this.procinst.state)
        return icon ? icon.src : ''
      } else {
        return ''
      }
    }
  },
  watch: {
    $route(nv) {
      if (nv.meta.title === '编辑') {
        this.pageLoad()
      }
    }
  },
  created() {
    this.pageLoad()
  },

  mounted() {
    _isMounted = true
  },
  methods: {
    pageLoad() {
      var that = this
      console.info('created start')
      let id = this.$route.params.id
      this.isCopy = this.$route.params.type == 1
      this.editType = this.$route.params.type
      getLoginUserByProcinstId(id).then(res => {
        var undoId = res.data ? res.data.id : null
        this.undoId = undoId
        if (undoId) {
          workflowUndoGet(undoId).then(function(data) {
            that.undo = data.data
            that.loadProcInst(that.undo.procinstId)

            workflowTaskGet(that.undo.taskId).then(function(taskData) {
              that.task = taskData.data
              if (taskData.data.nodeType == 'copy' && that.undo.result == '0') {
                workflowUndoReaded({
                  undoId: that.undo.id
                }).then(function() {})
              }
            })
          })
        } else {
          that.loadProcInst(id)
        }
      })
      console.info('created end')
    },
    loadProcInst(procinstId) {
      var that = this
      that.procinstId = procinstId
      if (that.procinstId) {
        workflowProcinstGet(that.procinstId).then(function(data) {
          that.procinst = data.data
          that.procdef = data.data
          that.procdefId = that.procinst.procdefId
          if (that.procdefId) {
            workFlowProcdefGet({ id: that.procdefId }).then(procdefRes => {
              that.procdef = procdefRes.data
            })
          }

          that.config = JSON.parse(that.procinst.procdefConfig)
          // resubmitData
          listByProcinst(that.procinst.id).then(function(data) {
            that.flowLine = data.data
            that.flowLine.splice(0, 0, {
              nodeType: 'start',
              createTime: that.procinst.createTime,
              senderName: that.procinst.createUserName,
              senderId: that.procinst.createUser
            })
          })
          let formData_ = JSON.parse(that.procinst.flowVal)
          for (let key in formData_) {
            if (Array.isArray(formData_[key]) || formData_[key] instanceof Object) {
              formData_[key] = JSON.stringify(formData_[key])
            } else {
              formData_[key] = String(formData_[key])
            }
          }
          workFlowProcdefFlowLine({ procdefId: that.procinst.procdefId, var: formData_ }).then(function(data) {
            that.workFlowProcdefFlowLine = data.data
            //流程表单值
            if (that.config.basicSetting.formType == that.formTypes.Online.value) {
              //在线绘制的表单
              that.confGlobal = JSON.parse(that.procinst.procdefConfig).formData
              var fields = that.confGlobal.fields
              for (var i = 0; i < fields.length; i++) {
                fields[i].disabled = true
                fields[i].show = true
              }
              var formOperates = JSON.parse(JSON.stringify(that.config)).processData.properties.formOperates
              if (that.undoId && that.procinst.state != 6) {
                that.workFlowProcdefFlowLine.forEach(item => {
                  if (item.nodeId == that.procinst.nodeId) {
                    formOperates = item.properties.formOperates
                    let procdefType = item.properties.procdefType
                    if (procdefType) {
                      that.showEditFeeType = procdefType.editFeeType
                      that.showEditPaidAccount = procdefType.editPaidAccount
                      that.splitMonthSelect = procdefType.splitMonthSelect
                    }
                  }
                })
              }
              var formOperatesMap = {}
              for (var i = 0; i < formOperates.length; i++) {
                formOperatesMap[formOperates[i].formId] = formOperates[i].formOperate
              }
              fields = that.formatEdit(fields, formOperatesMap)
              that.confGlobal.fields = fields
              // this.fields = fields
              //重新提交时渲染表单
              if (that.procinst.state == -1) {
                let restartFormEditData = JSON.parse(that.procinst.nodeList)[that.procinst.rejectStep]
                // let fieldsEdit = []
                //提交至驳回节点时限制表单编辑
                if (restartFormEditData.properties.procdefType && restartFormEditData.properties.procdefType.updateLimitType == 'rejectNodeLimit') {
                  that.formatEditReStart(fields, restartFormEditData.properties.procdefType.formItem)
                  // fieldsEdit = restartFormEditData.properties.procdefType.formItem
                  console.log('提交至驳回节点时限制表单编辑')
                }
                //由审核人选择是否限制表单编辑
                if (restartFormEditData.properties.procdefType && restartFormEditData.properties.procdefType.updateLimitType == 'chooseLimit') {
                  if (that.procinst.configLimit) {
                    let configLimit = JSON.parse(that.procinst.configLimit)
                    if (Array.isArray(configLimit.updateLimitType) && configLimit.updateLimitType.length > 0) {
                      that.formatEditReStart(fields, configLimit.updateLimitType)
                    }
                    // fieldsEdit = configLimit.updateLimitType
                  }
                  console.log('由审核人选择是否限制表单编辑')
                }
                //重新提交不允许提交字段
                if (
                  that.config.advancedSetting &&
                  that.config.advancedSetting.resubmitData &&
                  Array.isArray(that.config.advancedSetting.resubmitData) &&
                  that.config.advancedSetting.resubmitData.length > 0
                ) {
                  console.log('重新提交不允许提交字段')
                  let resubmitData = that.config.advancedSetting.resubmitData
                  // for (let i = fieldsEdit.length - 1; i >= 0; i--) {
                  //   if (resubmitData.includes(String(fieldsEdit[i])) || resubmitData.includes(fieldsEdit[i])) {
                  //     fieldsEdit.splice(i, 1)
                  //   }
                  // }
                  that.formatEditReStart(fields, resubmitData, false)
                }
              }

              if (that.procinst.state == 2 && that.editType == 2) {
                let finishedEditableData = that.config.advancedSetting.finishedEditableData
                console.log('已完成单据修改表单权限')
                if (Array.isArray(finishedEditableData) && finishedEditableData.length > 0) {
                  for (let i in formOperatesMap) {
                    formOperatesMap[i] = 1
                  }
                  finishedEditableData.forEach(item => {
                    formOperatesMap[item] = 2
                  })
                }
                that.showEditFeeType = true
                that.showEditPaidAccount = true
                that.splitMonthSelect = 'C' //已完成单据可修改全部月份
                that.formatEdit(fields, formOperatesMap)
              }
            }
            that.formData = JSON.parse(that.procinst.flowVal)
          })
        })
      }
    },
    formatEditReStart(fields, formOperatesMap, flag = true) {
      let that = this
      for (var i = 0; i < fields.length; i++) {
        if (flag) {
          fields[i].disabled = true
        }
        if (formOperatesMap.includes(String(fields[i].formId)) || formOperatesMap.includes(fields[i].formId)) {
          if (flag) {
            fields[i].disabled = false
          } else {
            fields[i].disabled = true
          }
        }
        if (fields[i].children && fields[i].children.length > 0) {
          that.formatEditReStart(fields[i].children, formOperatesMap, flag)
        }
      }
      return fields
    },
    formatEdit(fields, formOperatesMap) {
      let that = this
      for (var i = 0; i < fields.length; i++) {
        fields[i].disabled = true
        fields[i].show = true
        fields[i].hidden = false
        if (formOperatesMap[fields[i].formId] == that.formOperatesType.HIDE) {
          fields[i].hidden = true
        } else if (formOperatesMap[fields[i].formId] == that.formOperatesType.READ) {
          fields[i].disabled = true
        } else if (formOperatesMap[fields[i].formId] == that.formOperatesType.EDIT) {
          fields[i].disabled = false
          if (that.procinst.state == 1 && this.undoId) {
            fields[i].show = false
          }
        }
        if (fields[i].children && fields[i].children.length > 0) {
          that.formatEdit(fields[i].children, formOperatesMap)
        }
      }
      return fields
    },
    back() {
      this.$router.push({ name: 'approvalFormList' })
    },
    checkTableData() {
      let valid = true
      Object.keys(this.tableRefs).forEach(vModel => {
        if (this.$refs[vModel]) {
          const res = this.$refs[vModel].$children[0].submit() // 返回false或表单数据
          if (res) {
            if ((this.code === '004' || this.code === '005' || this.code === '006') && Array.isArray(this[this.confGlobal.formModel][vModel]) && Array.isArray(res)) {
              res.forEach((item, index) => {
                Object.keys(item).forEach(key => {
                  if (item[key] !== null && item[key] !== undefined && item[key] !== '') {
                    if (this[this.confGlobal.formModel][vModel][index]) {
                      this[this.confGlobal.formModel][vModel][index][key] = item[key]
                    } else {
                      this[this.confGlobal.formModel][vModel][index] = item
                    }
                  }
                })
              })
            } else {
              this[this.confGlobal.formModel][vModel] = res
            }
          } else {
            valid = false
          }
        }
      })
      return valid
    },
    // 验证卡号
    checkInputVerify() {
      let promiseAll = null
      Object.keys(this.tableRefs).forEach(vModel => {
        if (this.$refs[vModel]) {
          promiseAll = this.$refs[vModel].$children[0].checkInputVerify()
        }
      })

      if (promiseAll && promiseAll instanceof Promise) {
        return promiseAll
          .then(allRes => {
            let cardList = []
            for (let res of allRes) {
              const { code, data, msg } = res
              if (data) {
                cardList.push(data)
              } else {
                this.$notification['error']({
                  message: '系统通知',
                  description: msg || `卡号验证错误`
                })
                return false
              }
            }

            if (cardList.length === allRes.length) {
              let cardNos = new Set(cardList.map(d => d.studentCard.stuCardNo))
              if(cardNos.size === cardList.length) {
                return true
              } else {
                this.$notification['error']({
                  message: '系统通知',
                  description: `卡号重复`
                })
                return false
              }
            }
          })
          .catch(err => {
            const { code, data, msg } = err
            this.$notification['error']({
              message: '系统通知',
              description: msg || `${label}验证错误`
            })
            return false
          })
      }

      return Promise.resolve(false)
    },
    // 验证资源来源
    checkSource() {
      for (let item of this.formData.refundInfo) {
        if (item.source && item.source.name === '客服') {
          this.$notification['error']({
            message: '系统通知',
            description: '资源来源请选择客服'
          })
          return false
        }
      }
      return true
    },
    reSubmit() {
      var that = this
      const isTableValid = this.checkTableData()
      this.$refs[this.confGlobal.formRef].validate(valid => {
        if (!valid) return
        if (!isTableValid) return
        if (this.config.basicSetting.code === '005') {
          if (!this.checkSource()) return
          this.checkInputVerify()
            .then(flag => {
              if (flag) this.$refs.showFlowline.open()
            })
        } else {
          this.$refs.showFlowline.open()
        }
      })
    },
    copySubmit() {
      let that = this
      // const isTableValid = this.checkTableData()
      // this.$refs[that.confGlobal.formRef].validate(valid => {
      // if (!valid) return
      // if (!isTableValid) return
      let parms = {
        procdefId: that.procinst.procdefId,
        title: that.procinst.title,
        flowVal: JSON.stringify(that.formData),
        nodeList: that.procinst.nodeList
      }
      that.loading = true
      workFlowProcdefStart(parms)
        .then(function(data) {
          if (data.code == '200') {
            that.$notification['success']({
              message: '系统通知',
              description: '提交成功!'
            })

            let fullPath = that.$route.fullPath
            that.$router.push({
              name: 'myApproval',
              params: {
                activeIndex: that.procinst.procdefId
              }
            })
            setTimeout(function() {
              // 关闭标签
              events.$emit('close', fullPath)
            }, 1000)
          } else {
            that.$notification['error']({
              message: '系统通知',
              description: data.msg ? data.msg : '提交失败,请稍后重试!'
            })
          }
        })
        .finally(e => {
          that.loading = false
        })
      // })
    },
    isShowRecall() {
      var that = this

      var result = false
      // if (top.SessionUtils && that.procinst.state == 1 && top.SessionUtils.getLoginUser().userId == that.procinst.createUser) {
      //   result = true
      // }
      if (that.procinst.state == 1 && !that.undoId) {
        result = true
      }
      return result
    },

    /**
     *撤回
     */
    recall() {
      var that = this
      this.$confirm({
        title: '系统提示',
        content: '撤销后不可更改, 是否继续?',
        onOk() {
          workflowProcinstRecall({ targetId: that.procinst.id }).then(function(data) {
            var result = data.data
            if (data.code == '200') {
              that.$notification['success']({
                message: '系统通知',
                description: '处理成功!'
              })
              setTimeout(function() {
                that.$router.push({ name: 'approvalFormList' })
              }, 1000)
            } else {
              that.$notification['error']({
                message: '系统通知',
                description: '处理失败,请稍后重试!'
              })
            }
          })
        },
        onCancel() {}
      })
    },

    /**
     * 选择转单人
     */
    selectassignor() {
      this.isShowFlowOrgSelect = true
    },

    /**
     * 转交审批
     */
    assignorBack(users, remark) {
      var that = this
      if (users && users.length > 0) {
        var param = {
          undoId: that.undo.id,
          suggest: remark,
          userId: users[0].id,
          userName: users[0].name
          // deptId: users[0].dept
        }
        workflowUndoAssignor(param).then(function(data) {
          var result = data.data

          if (data.code == '200') {
            that.$notification['success']({
              message: '系统通知',
              description: '处理成功!'
            })
            setTimeout(function() {
              that.$router.push({ name: 'approvalFormList' })
            }, 1000)
          } else {
            that.$notification['error']({
              message: '系统通知',
              description: '处理失败,请稍后重试!'
            })
          }
        })
      }
    },

    /**
     * 拒绝
     */
    refuse() {
      var that = this
      this.fillSuggestRefuse(function(suggest) {
        var param = {
          undoId: that.undo.id,
          ...suggest
        }
        workflowUndoRefuse(param).then(function(data) {
          var result = data.data

          if (data.code == '200') {
            that.$notification['success']({
              message: '系统通知',
              description: '处理成功!'
            })

            let fullPath = that.$route.fullPath
            that.$router.push({ name: 'approvalFormList' })
            setTimeout(function() {
              // 关闭标签
              events.$emit('close', fullPath)
            }, 1000)
          } else {
            that.$notification['error']({
              message: '系统通知',
              description: '处理失败,请稍后重试!'
            })
          }
        })
      })
    },

    /**
     * 同意
     */
    agree() {
      var that = this

      this.fillSuggest(function(suggest) {
        if (that.config.basicSetting.formType == that.formTypes.Custom.value) {
          const iframe = document.getElementById('formIframe')
          if (iframe && iframe.contentWindow.agreeBeforeHandler && !iframe.contentWindow.agreeBeforeHandler()) {
            return
          }
        }
        var param = {
          undoId: that.undo.id,
          suggest: suggest,
          flowVal: JSON.stringify(that.formData)
        }
        workflowUndoAgree(param).then(function(data) {
          var result = data.data
          if (data.code == '200') {
            that.$notification['success']({
              message: '系统通知',
              description: '处理成功!'
            })

            let fullPath = that.$route.fullPath
            that.$router.push({ name: 'approvalFormList' })
            setTimeout(function() {
              // 关闭标签
              events.$emit('close', fullPath)
            }, 1000)
          } else {
            that.$notification['error']({
              message: '系统通知',
              description: '处理失败,请稍后重试!'
            })
          }
        })
      })
    },

    /**
     * 同意填写意见
     */
    fillSuggest(backFun) {
      this.$prompt('', '审批意见', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false,
        center: true
      })
        .then(({ value }) => {
          backFun(value)
        })
        .catch(() => {})
    },
    /**
     * 填写拒绝意见
     */
    fillSuggestRefuse(backFun) {
      var that = this
      let procedure
      this.workFlowProcdefFlowLine.forEach(item => {
        if (item.nodeId.endsWith(that.task.nodeId)) {
          procedure = item
        }
      })
      let { commitNodeType, updateLimitType } = procedure.properties.procdefType
      if (updateLimitType) {
        this.procedureType1 = updateLimitType
      }
      if (commitNodeType) {
        this.commitNodeType1 = commitNodeType
      }
      this.fotmItemOptions = this.initFormOperates()
      this.visible = true
      this.backFun = backFun
    },
    initFormOperates() {
      // 自定义组件不加入权限控制
      const res = []
      const format = (list, parentName = '') =>
        list.forEach(t => {
          const data = {
            formId: t.formId,
            required: t.required,
            label: parentName ? [parentName, t.label].join('.') : t.label,
            tag: t.tag,
            vModel: t.vModel
          }
          res.push(data)
          Array.isArray(t.children) && format(t.children, t.label)
        })
      const formItemList = JSON.parse(JSON.stringify(this.config.formData.fields))
      const formItems = formItemList.filter(t => t.cmpType !== 'custom')
      format(formItems)
      return res
    },
    initFormItemList(datas) {
      let arr = []
      const loop = data => {
        if (!data) return
        data.forEach(t => {
          arr.push(t)
          if (t.children && Array.isArray(t.children)) {
            loop(t.children)
          }
        })
      }
      loop(datas)
      return arr
    },
    handleOk(e) {
      let value = {
        suggest: this.refuseSuggest,
        configLimit: {}
      }
      if (this.commitNodeType1 == 'toChooseNode') {
        if (this.commitNodeType) {
          value.configLimit.commitNodeType = this.commitNodeType
        } else {
          this.$notification['error']({
            message: '系统通知',
            description: '请选择再次提交审核节点'
          })
          return
        }
      }
      if (this.procedureType1 == 'chooseLimit') {
        if (this.procedureType && this.procedureType.length > 0) {
          value.configLimit.updateLimitType = this.procedureType
        } else {
          this.$notification['error']({
            message: '系统通知',
            description: '请选择可编辑表单数据'
          })
          return
        }
      }
      let b = function(obj) {
        for (let key in obj) {
          return false
        }
        return true
      }
      if (b(value.configLimit)) {
        delete value.configLimit
      } else {
        value.configLimit = JSON.stringify(value.configLimit)
      }
      this.confirmLoading = true
      this.backFun(value)
      setTimeout(() => {
        this.visible = false
        this.confirmLoading = false
      }, 500)
    },
    handleCancel(e) {
      this.visible = false
    },
    buildDrawer(h) {
      var content = <pre style="padding-left: 1rem;">{this.drawerText}</pre>
      return h(
        'el-drawer',
        {
          props: {
            title: this.drawerTitle + '说明',
            visible: this.drawerVisible
          },
          on: {
            'update:visible': val => (this.drawerVisible = val)
          }
        },
        [content]
      )
    },
    changeTabIndex(data) {
      this.tabIndex = data
    },
    buildForm(h) {
      var content = null
      var formObject = {}

      if (this.config.basicSetting.formType == this.formTypes.Online.value) {
        let labelPosition = this.confGlobal.labelPosition || 'left'
        content = this.confGlobal.fields.map(c => layouts[c.layout](c, h, this))
        formObject = {
          props: {
            model: this[this.confGlobal.formModel],
            rules: this[this.confGlobal.formRules],
            size: this.confGlobal.size,
            labelWidth: this.confGlobal.labelWidth + 'px',
            labelPosition: this.confGlobal.labelPosition || undefined
          },
          ref: this.confGlobal.formRef
        }
      } else {
        var storageCache = localStorage.ND_FASTDP

        var src = this.config.basicSetting.flowForm + '?token=' + JSON.parse(storageCache)['token']

        content = <iframe id="formIframe" src={src} scrolling="no" frameborder="0" style="width: 100%;" />
      }
      var btns = null
      if (this.procinst.state == 6) {
        btns = (
          <el-col span={24} class="operation-btn">
            <el-form-item>
              <el-button loading={this.loading} style="background-color:#19a97b;color:#fff;" onClick={this.reSubmit}>
                重新提交
              </el-button>
            </el-form-item>
          </el-col>
        )
      } else if (this.undo && this.undo.finished == 0) {
        //待办
        btns = (
          <el-col span={24} class="operation-btn">
            <el-row>
              <el-col span={8} style="text-align:left;">
                <el-form-item>
                  <el-button onClick={this.selectassignor}>转交审批</el-button>
                </el-form-item>
              </el-col>
              <el-col span={8} style="text-align:center;">
                <el-form-item>{this.isShowRecall() ? <el-button onClick={this.recall}>撤回</el-button> : ''}</el-form-item>
              </el-col>
              <el-col span={8} style="text-align:right;">
                <el-form-item>
                  <el-button-group>
                    <el-button onClick={this.refuse} style="background-color:#F5F5F5;">
                      拒绝
                    </el-button>
                    <el-button type="primary" onClick={this.agree} style="color: #fff;background-color:#19a97b;">
                      同意
                    </el-button>
                  </el-button-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        )
      } else {
        btns = (
          <el-col span={24} class="operation-btn">
            <el-form-item>
              {this.procinst.state == -1 || this.procinst.state == 3 ? (
                <el-button loading={this.loading} style="background-color:#19a97b;color:#fff;" onClick={this.reSubmit}>
                  重新提交
                </el-button>
              ) : (
                ''
              )}
              {this.procinst.state == 1 || this.procinst.state == 0 ? (
                <el-button loading={this.loading} style="background-color:#19a97b;color:#fff;" onClick={this.reSubmit}>
                  提交
                </el-button>
              ) : (
                ''
              )}
              {this.procinst.state == 2 && this.isCopy ? (
                <el-button loading={this.loading} style="background-color:#19a97b;color:#fff;" onClick={this.reSubmit}>
                  提交复制
                </el-button>
              ) : (
                ''
              )}
              {this.procinst.state == 2 && this.editType == 2 ? (
                <el-button loading={this.loading} style="background-color:#19a97b;color:#fff;" onClick={this.reEdit}>
                  确定修改
                </el-button>
              ) : (
                ''
              )}
            </el-form-item>
          </el-col>
        )
      }
      //       {this.isShowRecall() ? (
      //   <el-button style="background-color:#19a97b;color:#fff;" round onClick={this.recall}>
      //     撤回
      //   </el-button>
      // ) : (
      //   ''
      // )}
      const title = <h3 style="text-align: center;">{this.procinst ? this.procinst.title : ''}</h3>

      // 因为使用jsx时  el-form 的 model 一直无法正确填充，故采用createElement直接渲染
      return h('el-form', formObject, [btns, title, content])
    },
    buildFlowline(h) {
      // task#497 当驳回至初始节点，走固定流程
      let toFirstNode =
        this.procinst && this.procinst.state == -1 && this.procinst.configLimit ? JSON.parse(this.procinst.configLimit).commitNodeType === 'toFirstNode' : false
      if (this.procinst.state == 6) toFirstNode = true
      var content = (
        <changeFlowline
          ref="showFlowline"
          onsubmitFormEnd={this.submitFormEnd}
          nodeList={!toFirstNode ? JSON.parse(this.procinst.nodeList) : null}
          formData={this.formData}
          procdefId={this.procdefId}
        />
      )
      return content
    },
    reEdit() {
      const isTableValid = this.checkTableData()
      this.$refs[this.confGlobal.formRef].validate(valid => {
        if (!valid) return
        if (!isTableValid) return
        if (this.config.basicSetting.code === '005') {
          if (!this.checkSource()) return
          this.submitFormEnd('')
        } else {
          this.submitFormEnd('')
        }
      })
    },
    submitFormEnd(data) {
      if (this.isCopy) {
        this.copySubmit()
        return
      }
      var that = this
      // that.flowLine = JSON.parse(JSON.stringify(data))
      // var nodeList = JSON.parse(JSON.stringify(data))
      // nodeList.shift()
      var nodeList = JSON.parse(that.procinst.nodeList)
      let perviousNode = nodeList

      let procedure = JSON.parse(this.procinst.nodeList)[this.procinst.rejectStep]
      if (that.procinst.state == -1) {
        // task#497 当驳回至初始节点，走固定流程
        if (that.procinst.configLimit && JSON.parse(that.procinst.configLimit).commitNodeType == 'toFirstNode') {
          nodeList = JSON.parse(JSON.stringify(data))
          if (nodeList[0].type == 'start') nodeList.shift()
        }
        // if (this.procinst.rejectStep != 0) {
        //提交至驳回节点
        if (procedure.properties.procdefType && procedure.properties.procdefType.commitNodeType == 'toRejectNode') {
          console.log('提交至驳回节点')
          nodeList = JSON.parse(this.procinst.nodeList)
          for (let i = 0; i < this.procinst.rejectStep; i++) {
            perviousNode = nodeList.shift()
          }
        }
        //由审核人选择是否提交至驳回节点
        if (procedure.properties.procdefType && procedure.properties.procdefType.commitNodeType == 'toChooseNode') {
          if (that.procinst.configLimit && JSON.parse(that.procinst.configLimit).commitNodeType == 'toRejectNode') {
            nodeList = JSON.parse(this.procinst.nodeList)
            for (let i = 0; i < this.procinst.rejectStep; i++) {
              perviousNode = nodeList.shift()
            }
            console.log('由审核人选择是否提交至驳回节点')
          }
        }
      }
      if (that.procinst.state == 6) {
        nodeList = JSON.parse(JSON.stringify(data))
        if (nodeList[0].type == 'start') nodeList.shift()
      }
      // 需要参与比较的字段
      if (that.procinst.state == -1 || (this.procinst.state == 2 && this.editType == 2)) {
        const fieldsMap = {
          title: '',
          initiator: 'id',
          branch: 'branchId',
          date: '',
          total: '',
          settlementType: '',
          expense: 'id',
          number: '',
          unit: 'id',
          totalMoney: '',
          unitPrice: '',
          reasons: '',
          management: 'id',
          invoiceQuantity: '',
          enclosure: 'uid',
          spendingSplits: ['startDate', 'endDate', 'deptId', 'price'],
          remark: '',
          leaving: ''
        }
        // entity1：改变后的、entity2：改变前的
        const compare = (entity1, key1, entity2, key2) => {
          if (key1 === key2) {
            let entity1Type = Object.prototype.toString.call(entity1[key1]).toLowerCase()
            let entity2Type = Object.prototype.toString.call(entity2[key2]).toLowerCase()
            if (entity1Type === '[object object]' || entity2Type === '[object object]') {
              if (entity1[key1]&&fieldsMap[key1]&&entity1[key1][fieldsMap[key1]] !== entity2[key2][fieldsMap[key2]]) entity1[key1 + '_compare'] = true
            } else if (entity1Type === '[object array]' || entity2Type === '[object array]') {
              if (entity1[key1]?.length !== entity2[key2]?.length) {
                entity1[key1 + '_compare'] = true
              } else {
                let fKey = fieldsMap[key1]
                let fKeyType = Object.prototype.toString.call(fKey).toLowerCase()
                if (fKeyType === '[object array]') {
                  fKey.forEach(item => {
                    let difference = differenceWith(entity1[key1], entity2[key2], (n, o) => n[item] === o[item])
                    if (difference.length > 0) entity1[key1 + '_compare'] = true
                  })
                } else if (fKeyType === '[object string]') {
                  let difference = differenceWith(entity1[key1], entity2[key2], (n, o) => n[fKey] === o[fKey])
                  if (difference.length > 0) entity1[key1 + '_compare'] = true
                }
              }
            } else {
              if (entity1[key1] !== entity2[key2]) entity1[key1 + '_compare'] = true
            }
          }
        }
        let _formData = JSON.parse(that.procinst.flowVal)
        // 去掉标识
        Object.keys(that.formData).forEach(key => {
          if (key != 'fields') {
            if (Object.prototype.toString.call(that.formData[key]).toLowerCase() === '[object array]') {
              that.formData[key].forEach(sub => {
                Object.keys(sub).forEach(subKey => {
                  if (subKey.endsWith('_compare')) delete sub[subKey]
                })
              })
            } else {
              if (key.endsWith('_compare')) delete that.formData[key]
            }
          }
        })
        // 添加标识
        that.formData.fields.forEach(field => {
          if (that.formData[field.vModel] && _formData[field.vModel]) {
            if (field.rowType === 'layout' || field.rowType === 'table') {
              that.formData[field.vModel].forEach((sub1, subIdx1) => {
                if (subIdx1 + 1 > _formData[field.vModel].length) {
                  Object.keys(sub1).forEach(key1 => {
                    sub1[key1 + '_compare'] = true
                  })
                } else {
                  _formData[field.vModel].forEach((sub2, subIdx2) => {
                    if (subIdx1 === subIdx2) {
                      Object.keys(sub1).forEach(key1 => {
                        if (sub2[key1] === undefined) sub2[key1] = undefined
                      })
                      Object.keys(sub1).forEach(key1 => {
                        Object.keys(sub2).forEach(key2 => {
                          compare(sub1, key1, sub2, key2)
                        })
                      })
                    }
                  })
                }
              })
            } else {
              _formData.fields.forEach(field2 => {
                compare(that.formData, field.vModel, _formData, field2.vModel)
              })
            }
          }
        })
      }
      var parms = {
        procdefId: that.procdefId,
        title: this.procinst.title,
        flowVal: JSON.stringify(that.formData),
        nodeList: JSON.stringify(nodeList),
        procinstId: this.procinst.id,
        type: that.procinst.state == 6 ? 'A' : 'B'
      }
      that.loading = true
      let request = workflowReStart
      if (this.procinst.state == 2 && this.editType == 2) {
        request = updateSpending
      }
      request(parms)
        .then(function(data) {
          if (data.code == '200') {
            that.$notification['success']({
              message: '系统通知',
              description: '提交成功!'
            })

            let fullPath = that.$route.fullPath
            that.$router.push({
              name: 'approvalFormList',
              params: {
                activeIndex: that.procdefId
              }
            })
            setTimeout(function() {
              // 关闭标签
              events.$emit('close', fullPath)
            }, 1000)
          } else {
            that.$notification['error']({
              message: '系统通知',
              description: data.msg ? data.msg : '提交失败,请稍后重试!'
            })
          }
        })
        .finally(e => {
          that.loading = false
        })
    }
  },

  render(h) {
    var result = ''
    //gutter={this.confGlobal.gutter}
    // v-loading={this.flowLoading}
    // <el-row style={'padding: 0rem 20px 0;'}>{<workFlowData procinst={this.procinst} confGlobal={this.confGlobal}></workFlowData>}</el-row>
    if (this.formData) {
      if (this.config.basicSetting.formType == this.formTypes.Online.value) {
        result = (
          <a-tabs type="card" class="height:100%;">
            <a-tab-pane key="1" tab="表单">
              <div class={'preview-container'} style="padding-top:20px;">
                <el-row style={'padding: 0rem 20px 0;'}>{this.buildForm(h)}</el-row>
              </div>
              {!this.isCopy ? (
                <div class={'preview-container mt20'} style="margin-bottom: 60px;margin-top: 20px;">
                  <el-row style="padding: 0rem 20px 0px;">
                    <el-divider content-position="left">流程</el-divider>
                  </el-row>
                  <el-row style="padding: 0rem 20px 0;padding-bottom:60px;">
                    <flow-line flowLine={this.flowLine} procinst={this.procinst} confGlobal={this.confGlobal} />
                  </el-row>
                  {this.buildDrawer(h)}
                  {this.buildFlowline(h)}
                  <FlowOrgSelect
                    v-model={this.assignor}
                    {...{ on: { onConfirm: this.assignorBack } }}
                    enableEdit={true}
                    maxNum={1}
                    filterConfig={null}
                    show={this.isShowFlowOrgSelect}
                    {...{ on: { 'update:show': val => (this.isShowFlowOrgSelect = val) } }}
                    type={'flow_user'}
                  />
                  <a-modal title="审批意见" confirm-loading={this.confirmLoading} visible={this.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
                    {this.commitNodeType1 == 'toChooseNode' ? (
                      <div class="mb20">
                        <p>驳回后再次提交审核节点</p>
                        <el-radio-group v-model={this.commitNodeType}>
                          <el-radio label="toFirstNode" class="mr30">
                            提交至初始节点
                          </el-radio>
                          <el-radio label="toRejectNode">提交至驳回节点</el-radio>
                        </el-radio-group>
                      </div>
                    ) : (
                      ''
                    )}
                    {this.procedureType1 == 'chooseLimit' ? (
                      <div class="mb20">
                        <p>请选择可编辑表单数据</p>
                        <el-select v-model={this.procedureType} multiple placeholder="请选择可编辑表单数据">
                          {this.fotmItemOptions.map((item, index) => {
                            return <el-option key={item.formId} label={item.label} value={item.formId} />
                          })}
                        </el-select>
                      </div>
                    ) : (
                      ''
                    )}
                    <el-input v-model={this.refuseSuggest} placeholder="请输入审批意见" />
                  </a-modal>
                </div>
              ) : (
                ''
              )}
              {this.buildFlowline(h)}
            </a-tab-pane>
            <a-tab-pane key="2" tab="打印表单">
              <workFlowTable
                createTime={this.procinst.createTime}
                title={this.config.basicSetting.flowName}
                code={this.config.basicSetting.code}
                formDatas={this.formData}
                createUserName={this.procinst.createUserName}
                curator={this.procinst.curator}
                confGlobal={this.confGlobal}
              />
            </a-tab-pane>
          </a-tabs>
        )
      } else {
        // v-loading={this.flowLoading}
        result = (
          <div>
            <div class="preview-container mt20 " style="margin-bottom: 60px;">
              <el-row style="padding: 20px 20px 0;">{this.buildForm(h)}</el-row>
            </div>
            <div class="preview-container">
              <el-row style="padding: 0rem 20px 0px;">
                <el-divider content-position="left">流程</el-divider>
              </el-row>

              <el-row style="padding: 0rem 20px 0;padding-bottom:60px;">
                <flow-line flowLine={this.flowLine} procinst={this.procinst} confGlobal={this.confGlobal} />
              </el-row>

              {this.buildDrawer(h)}
              {this.buildFlowline(h)}
              <FlowOrgSelect
                v-model={this.assignor}
                {...{ on: { onConfirm: this.assignorBack } }}
                enableEdit={true}
                maxNum={1}
                filterConfig={null}
                show={this.isShowFlowOrgSelect}
                {...{ on: { 'update:show': val => (this.isShowFlowOrgSelect = val) } }}
                type={'flow_user'}
              />
            </div>
          </div>
        )
      }
    }

    return result
  }
}
</script>
<!--
 <style lang="stylus" scoped>
-->
<style lang="stylus" scoped>
.view.preview-container{
 overflow :scroll!important;
 margin:30px 0 0 0;
 padding:30px 0 0 0;
}
  .preview-container::-webkit-scrollbar {
            width: 6px;
            height: 6px;
            background-color: rgb(240, 242, 245);
  }

  .preview-container::-webkit-scrollbar-track {
            box-shadow: inset 0 0 0px rgb(240, 242, 245);
            border-radius: 10px;
            background-color: rgb(240, 242, 245);
  }

  .preview-container::-webkit-scrollbar-thumb {
            box-shadow: inset 0 0 0px rgb(240, 242, 245);
            background-color:rgb(240, 242, 245);
  }

.preview-container
    border-radius 6px
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 10px 0px;
    width:1000px;
    margin:0 auto;
    position:relative;
    background:#fff;

    .width-slider
        width  150px
        position absolute
        top 0
        right 20px

.showDivider.form-container {
    margin-bottom: 20px;
}
.operation-btn{
    z-index: 890;
    min-height: 65px;
    line-height: 65px;
    height: 65px;
    padding:10px;
    border-top: 1px solid #eee;
    background-color: #FFF;
    position: fixed;
    bottom: 0px;
    width: calc(100vw - 265px);
    right: 0px;
    text-align center;
}

.operation-btn {
    .el-form-item {
        margin-top: 6.5px !important;
    }

    .el-form-item__content {
        margin-left: 0px !important;
    }
    button{
      padding: 0.02rem 0.2rem;
      border-radius: 0.04rem;
      font-size: 0.14rem;
      height: 0.3rem;
    }
}

/deep/.el-input-number{
    .el-input__inner{
        text-align left!important;
    }

    .el-input-number--medium{
        width: 100%!important;
    }
}
.none{
  display:none;
}
/deep/.ant-tabs-nav-scroll {
    overflow: hidden;
    white-space: nowrap;
    text-align: right;
}
/deep/.ant-tabs {
    height: 100%;
}
.el-date-table td.current:not(.disabled) span {
  background-color: #1ba97b;
}
.el-radio__input.is-checked .el-radio__inner {
    border-color: #1ba97b;
    background: #1ba97b;
}
.el-radio__input.is-checked+.el-radio__label {
    color:  #1ba97b;
}
.el-radio__inner:hover {
    border-color: #1ba97b;
}
</style>
