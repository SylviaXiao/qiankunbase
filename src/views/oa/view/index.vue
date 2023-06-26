<script>
import render from '@/assets/utils/render.js'
import { trigger } from '@/components/DynamicForm/components/generator/config.js'

import { PROC_INST } from '@/api'
import {
  workflowReStart,
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
  listEmployee,
  beforeAdd,
  afterAdd,
  addUndoNodeUser,
  listNextProcOrgUser,
  listWorkflowRoleDetail,
  orgListWorkflowRoleDetail,
  updateNextProcOrgUser,
  rejectAnyNode,
  getUndoResult
} from '@/api/workFlow/request'
import { getUrlParam } from '@/assets/utils'
import FlowLine from './FlowLine'

import FlowOrgSelect from '../form/FlowLine/FlowOrgSelectNew/index.vue'
import workFlowTable from './workFlowTable/index.vue'
import workFlowData from './workFlowData/index.vue'
import workFlowline from './workFlowline/index.vue'
import paidBankList from './paidBankList/index.vue'
import refuseModel from './refuseModel'

import IModal from '@/components/InnerModal/modal.vue'
import events from '@/components/MultiTab/events.js'
import { intersectionWith, uniqWith } from 'lodash'
import moment from 'moment'

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
    ctx.$forceUpdate()
  }
}

var _isMounted = false // 收集默认值 渲染完成之后防止重复收集默认值

const buildData = (ctx, value, prop) => setData(ctx, value, prop, true)

const layouts = {
  colFormItem: function(conf, h, ctx, isList = false) {
    buildRules(conf, ctx)
    !_isMounted && buildData(ctx, conf.defaultValue, conf.vModel)
    //buildData(ctx, conf.defaultValue, conf.vModel)
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
      <el-col span={conf.span || 24} style={conf.show ? 'display:none;' : ''}>
        <el-form-item label-width={labelWidth} label={isList ? '' : conf.label} prop={conf.vModel} id={conf.vModel}>
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
      var tableTitle = (
        <el-col span={24} style={conf.show ? 'display:none;' + src : src}>
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
      <el-col span={conf.span || 24} style={conf.show ? 'display:none;' : ''}>
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
        <el-col span={24} style={conf.show ? 'display:none;' : ''}>
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
  name: 'viewNew',
  data() {
    const permissionList = this.$store.getters?.roles?.permissionList || []
    return {
      isAdmin: permissionList[0] == '*',
      singleProcess: true, //是否是单条的流程
      mergePay: '',
      fixedProcess: null, //是否固定流程(0.固定流程 1.非固定流程)
      splitAccountingBefore: false, //当前流程是否在拆单会计或之前
      showEditPaidAccount: false, //审批中是否允许编辑/查看打款账户
      showEditFeeType: false, //审批中是否允许查看/编辑费用类型
      splitMonthSelect: 'A', //分摊可选月份
      isChooseApprove: false,
      isChooseApproveNodeRoles: [],
      isChooseApproveNodeId: null,
      isChooseApproveNextNodeId: null,
      beforeSign: false,
      afterSign: false,
      andSign: false,
      procdef: null, //流程定义
      flowLineAll: [],
      loading: false,
      loadingBack: false,
      loadingRefuse: false,
      loadingChange: false,
      tabKey: '',
      isWait: false, //待办审批
      isEdit: false,
      undoId: null,
      schoolId: null,
      tabIndex: 1,
      backFun: null,
      agreeForm: {
        suggest: '',
        listOrgUser: [],
        cashierUsers: '' //为了判断出纳审批人是否全部填写，没有实际意义
      },
      agreeRules: {
        listOrgUser: [{ required: true, message: '请选择下一个流程的审批人', trigger: 'change' }],
        cashierUsers: [{ required: true, message: '请选择出纳审批人', trigger: 'change' }]
      },
      procOrgUserList: [],
      procOrgUserList2: [],
      refuseSuggest: '',
      procedureType1: null, //请选择可编辑表单数据
      procedureType: [], //驳回后再次提交审核节点
      commitNodeType1: '', //拒绝时提交节点
      commitNodeType: '', //拒绝时提交节点
      procdefType: [], //拒绝表单
      fotmItemOptions: [],
      confirmLoading: false,
      agreeVisible: false,
      visible: false,
      config: null,
      procinst: null,
      undo: null,
      task: null,
      node: null,
      nextNode: null,
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
      },

      /* 加签选择人员弹框 */
      userList: [],
      orgUserBO: null,
      selectUserId: '',
      dialogVisible: false,
      beforeOrAfter: 'before',
      isBeforeOrAfter: false,
      beforeOrAfterInfo: null,
      remark: '', //加签备注
      showPaidDate: false //是否展示付款时间
    }
  },
  components: {
    FlowLine,
    FlowOrgSelect,
    workFlowTable,
    workFlowData,
    workFlowline,
    IModal
  },
  computed: {
    activeIconSrc() {
      if (this.procinst) {
        let icon = this.iconList.find(t => t.id === this.procinst.state)
        if (this.procinst.state == -1) {
          icon = this.iconList[0]
        }
        return icon ? icon.src : ''
      } else {
        return ''
      }
    },
    code() {
      return this.config && this.config.basicSetting.code
    }
  },
  watch: {
    $route(nv) {
      if (nv.meta.title === '详情') {
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
    getUndoResult() {
      return new Promise(resolve => {
        if (this.$tools.isSuper()) {
          resolve()
        } else {
          const curUserId = this.$store.getters?.userInfo?.user?.id
          getUndoResult({ undoId: this.undoId }).then(res => {
            const { result, userId } = res.data
            if (result == 0 && userId == curUserId) {
              resolve()
            } else {
              this.$notification['error']({
                message: '系统通知',
                description: '当前单据已处理，请勿重复操作'
              })
              this.closeBack()
            }
          })
        }
      })
    },
    pageLoad() {
      var that = this
      console.info('created start')
      let id = this.$route.params.id
      this.schoolId = this.$route.params.schoolId != '0' ? this.$route.params.schoolId : null
      this.undoId = this.$route.params.undoId != '0' ? this.$route.params.undoId : null
      this.tabKey = this.$route.query.tabKey
      this.isWait = this.$route.params.isWait == 'true' ? true : false
      getLoginUserByProcinstId(id).then(res => {
        this.fixedProcess = res.data ? res.data.type : null
        var undoId = res.data ? res.data.id : null
        this.undoId = this.undoId || undoId
        if (this.undoId) {
          workflowUndoGet(this.undoId).then(function(data) {
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

      var isInited = false
      setInterval(function() {
        /**
         * iframe-宽高自适应显示
         */
        const iframe = document.getElementById('formIframe')
        if (iframe) {
          var userAgent = navigator.userAgent
          var subdoc = iframe.contentDocument || iframe.contentWindow.document
          var subbody = subdoc.body
          var realHeight
          //谷歌浏览器特殊处理
          if (userAgent.indexOf('Chrome') > -1) {
            realHeight = subdoc.documentElement.scrollHeight
          } else {
            realHeight = subbody.scrollHeight
          }

          iframe.height = realHeight

          if (!isInited && that.flowLine != null && that.procinst != null) {
            isInited = true

            setTimeout(function() {
              //iframe.contentWindow.disabled();
              iframe.contentWindow.initForm({ formData: that.formData, task: that.task, undo: that.undo, procinst: that.procinst, flowLine: that.flowLine })
            }, 500)
          }
        }
      }, 200)
      console.info('created end')
    },
    loadProcInst(procinstId) {
      var that = this
      that.procinstId = procinstId

      if (that.procinstId) {
        workflowProcinstGet(that.procinstId).then(function(data) {
          that.procinst = data.data
          that.procdef = data.data
          that.config = JSON.parse(that.procinst.procdefConfig)
          that.initOrgUserList(procinstId)
          listByProcinst(that.procinst.id).then(function(data) {
            that.flowLine = data.data
            that.flowLine.splice(0, 0, {
              nodeType: 'start',
              createTime: that.procinst.createTime,
              senderName: that.procinst.createUserName,
              senderId: that.procinst.createUser
            })
          })
          var formData_ = JSON.parse(that.procinst.flowVal)
          for (let key in formData_) {
            if (Array.isArray(formData_[key]) || formData_[key] instanceof Object) {
              formData_[key] = JSON.stringify(formData_[key])
            } else {
              formData_[key] = String(formData_[key])
            }
          }
          workFlowProcdefFlowLine({ procdefId: that.procinst.procdefId, var: formData_, procinstId: that.procinst.id }).then(function(data) {
            that.workFlowProcdefFlowLine = data.data
            //流程表单值
            if (that.config.basicSetting.formType == that.formTypes.Online.value) {
              //在线绘制的表单
              that.confGlobal = JSON.parse(that.procinst.procdefConfig).formData
              var fields = that.confGlobal.fields
              var formOperates = JSON.parse(JSON.stringify(that.config)).processData.properties.formOperates
              // let nodeId = !that.undoId
              //   ? that.procinst.nodeId
              //   : that.task && (that.task.state == 1 || that.task.state == 2)
              //   ? that.procinst.nodeId
              //   : that.procinst.lastNodeId
              let nodeId = !that.undoId ? that.procinst.nodeId : that.task.nodeId
              if (that.undoId) {
                let workFlowProcdefFlowLineList = JSON.parse(that.procinst.nodeList)
                let isChooseBList = workFlowProcdefFlowLineList.filter(
                  item => (item.properties.procdefType ? item.properties.procdefType.isChooseApproveUser : '') === 'B'
                )
                let splitAccountingIndex = workFlowProcdefFlowLineList.findIndex(item => item.content && item.content.includes('拆单会计'))
                workFlowProcdefFlowLineList.forEach((item, index) => {
                  if (item.nodeId == nodeId) {
                    that.node = item
                    that.nextNode = workFlowProcdefFlowLineList[index + 1] || null
                    that.splitAccountingBefore = splitAccountingIndex !== undefined && splitAccountingIndex >= index
                    formOperates = item.properties.formOperates
                    let procdefType = item.properties.procdefType
                    if (procdefType) {
                      that.showEditFeeType = procdefType.editFeeType
                      that.showEditPaidAccount = procdefType.editPaidAccount
                      that.splitMonthSelect = procdefType.splitMonthSelect
                      that.mergePay = procdefType.mergePay
                      const signState = procdefType.signState || []
                      that.beforeSign = signState.includes('beforeSign')
                      that.afterSign = signState.includes('afterSign')
                      that.andSign = signState.includes('andSign')
                    }
                    // 多人审批时采用的审批方式为【由上一步审批人选择】或【由指定角色选择】时
                    let nextProcdefType = workFlowProcdefFlowLineList[index + 1] ? workFlowProcdefFlowLineList[index + 1].properties.procdefType : {}
                    let intersection = intersectionWith(
                      item.properties.roles,
                      isChooseBList,
                      (item1, item2) => item1.id === item2.properties.procdefType.chooseRoleId
                    )
                    // if (nextProcdefType.isChooseApproveUser === 'A' || intersection.length > 0) {
                    //   that.isChooseApprove = true
                    //   that.isChooseApproveNode = item
                    // }
                    if (nextProcdefType.isChooseApproveUser === 'A') {
                      that.isChooseApprove = true
                      that.isChooseApproveNodeRoles = workFlowProcdefFlowLineList[index + 1].properties.roles
                      that.isChooseApproveNodeId = item.nodeId
                      that.isChooseApproveNextNodeId = workFlowProcdefFlowLineList[index + 1].nodeId
                    }
                    if (intersection.length > 0) {
                      let _intersection = intersectionWith(
                        isChooseBList,
                        item.properties.roles,
                        (item2, item1) => item1.id === item2.properties.procdefType.chooseRoleId
                      )
                      that.isChooseApprove = true
                      that.isChooseApproveNodeRoles = _intersection[0].properties.roles
                      that.isChooseApproveNodeId = item.nodeId
                      that.isChooseApproveNextNodeId = _intersection[0].nodeId
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
              // if (that.procinst.state == -1) {
              //   let restartFormEditData = JSON.parse(JSON.stringify(that.config.processData))
              //   for (let i = 0; i <= that.procinst.rejectStep; i++) {
              //     restartFormEditData = restartFormEditData.childNode
              //   }
              //   //提交至驳回节点时限制表单编辑
              //   if (restartFormEditData.properties.procdefType && restartFormEditData.properties.procdefType.updateLimitType == 'rejectNodeLimit') {
              //     that.formatEditReStart(fields, restartFormEditData.properties.procdefType.formItem)
              //     console.log('提交至驳回节点时限制表单编辑')
              //   }
              //   //由审核人选择是否限制表单编辑
              //   if (restartFormEditData.properties.procdefType && restartFormEditData.properties.procdefType.updateLimitType == 'chooseLimit') {
              //     if (that.procinst.configLimit) {
              //       let configLimit = JSON.parse(that.procinst.configLimit)
              //       that.formatEditReStart(fields, configLimit.updateLimitType)
              //     }
              //     console.log('由审核人选择是否限制表单编辑')
              //   }
              // }
            }
            that.formData = JSON.parse(that.procinst.flowVal)
            that.getFormData()
            const role = that.node && that.node.content ? JSON.parse(that.node.content)[0] : ''
            // 退费单区域会计需要自动带入付款金额=退费金额
            if ((that.code === '004' || that.code === '005') && role === '区域会计') {
              let price = that.code === '004' ? that.formData.refundPrice : that.code === '005' ? -Number(that.formData.totalMoney) : 0
              that.formData.refundPaidPrice = price.toFixed(2)
              let formData = JSON.parse(JSON.stringify(that.formData))
              formData.refundPaidPrice = price.toFixed(2)
              that.procinst.flowVal = JSON.stringify(formData)
            }

            // 判断是否是单条的流程
            let list = []
            let vModelList = that.getModelNameByTag('fc-select-finance')
            vModelList.forEach(item => {
              list.push(...that.getSelectFinanceValue(item))
            })
            let uniqList = uniqWith(list, (arrVal, othVal) => arrVal.school.branchId === othVal.school.branchId)
            that.singleProcess = that.splitAccountingBefore || uniqList.length <= 1
          })
        })
      }
    },
    getFormData() {
      this.confGlobal.fields.forEach((item, index) => {
        if (item.tag === 'el-date-picker' && !item.hidden && !item.disabled && !this.formData[item.vModel]) {
          let date = moment(new Date()).format('YYYY-MM-DD')
          this.formData[item.vModel] = JSON.parse(JSON.stringify(date))
        }
      })
    },
    formatEditReStart(fields, formOperatesMap) {
      let that = this
      for (var i = 0; i < fields.length; i++) {
        fields[i].disabled = true
        if (formOperatesMap.includes(fields[i].formId)) {
          fields[i].disabled = false
        }
        if (fields[i].children && fields[i].children.length > 0) {
          this.formatEditReStart(fields[i].children, formOperatesMap)
        }
      }
      return fields
    },
    formatEdit(fields, formOperatesMap) {
      let that = this
      for (var i = 0; i < fields.length; i++) {
        fields[i].disabled = true
        fields[i].show = true
        if (formOperatesMap[fields[i].formId] == that.formOperatesType.HIDE) {
          fields[i].hidden = true
          fields[i].formOperatesType = that.formOperatesType.HIDE
        } else if (formOperatesMap[fields[i].formId] == that.formOperatesType.READ) {
          fields[i].disabled = true
          fields[i].formOperatesType = that.formOperatesType.READ
        } else if (formOperatesMap[fields[i].formId] == that.formOperatesType.EDIT) {
          fields[i].disabled = false
          fields[i].formOperatesType = that.formOperatesType.EDIT
          if (that.procinst.state == 1 && this.undoId) {
            fields[i].show = false
          }
        }
        if (that.undo && that.undo.finished && that.undo.finished != 0) {
          fields[i].show = true
          fields[i].disabled = true
        }
        if (fields[i].children && fields[i].children.length > 0) {
          that.formatEdit(fields[i].children, formOperatesMap)
        }
        if (fields[i].vModel === 'paidDate' && !fields[i].hidden) {
          this.showPaidDate = true
        } else {
          this.showPaidDate = false
        }
      }
      return fields
    },
    initOrgUserList(procinstId) {
      if (this.code === '001' && !this.schoolId) return
      if (this.code === '004' || this.code === '005') return
      listNextProcOrgUser({ procinstId: procinstId, schoolId: this.schoolId }).then(res => {
        // if (this.task && this.task.counterSign && this.task.unCompleteNum > 1) {
        //   this.procOrgUserList = []
        // } else {
        res.data.forEach((item, index) => {
          if (item.orgUserBOList && Array.isArray(item.orgUserBOList) && item.orgUserBOList.length > 0) {
            item.orgUserBOList.forEach(items => {
              items.key = items.userId
              items.label = items.userName
            })
          }
          this.agreeRules['listOrgUser' + index] = [{ required: true, message: '请选择' + item.title + '的审批人', trigger: 'change' }]
        })
        this.procOrgUserList = res.data
        // }
        // ?.map(data => ({ key: data.userId, label: data.userName })) || []
        // this.agreeForm.listOrgUser = this.procOrgUserList
      })
    },
    initOrgUserList2() {
      if (this.code === '004' || this.code === '005') {
        if (this.isChooseApprove) {
          const {
            refundPaidDept: { id: schoolId, name: schoolName },
            refundPaidPrice: money
          } = this.formData
          const title = this.nextNode.content ? JSON.parse(this.nextNode.content)[0] : ''
          orgListWorkflowRoleDetail({ roleId: this.isChooseApproveNodeRoles[0].id }).then(res => {
            if (res.data && res.data.length > 0) {
              let data = uniqWith(res.data, (arrVal, othVal) => arrVal.userId === othVal.userId)
              this.procOrgUserList2 = [
                {
                  title,
                  schoolId,
                  schoolName,
                  money,
                  orgUserBOList: data.map(d => Object.assign({ key: d.userId, label: d.userName }, d))
                }
              ]
              if (this.procOrgUserList2.length > 0) {
                this.procOrgUserList2.forEach((item, index) => {
                  let userId = res.data.find(d => d.schoolId === item.schoolId)?.userId
                  this.agreeForm['listOrgUser' + index] = userId
                })
                this.cashierUsersChange()
              }
            }
          })
        }
        return
      }
      if (!this.schoolId && this.isChooseApprove) {
        let selectFinanceList = []
        let vModelList = this.getModelNameByTag('fc-select-finance')
        if (vModelList.length === 0) return

        // 合并相同分馆的出纳审批人
        vModelList.forEach(item => {
          let value = JSON.parse(JSON.stringify(this.getSelectFinanceValue(item)))
          value.forEach(item => {
            let index = selectFinanceList.findIndex(d => d.school.branchId === item.school.branchId)
            if (index === -1) {
              selectFinanceList.push(item)
            } else {
              let money = this.$number(selectFinanceList[index].money).plus(item.money)
              selectFinanceList[index].money = money.toNumber()
            }
          })
        })
        let schoolIds = selectFinanceList.map(d => d.school.branchId)
        if (schoolIds.length === 0) {
          this.procOrgUserList2 = []
          return
        }

        const { id, name } = this.isChooseApproveNodeRoles[0]
        listWorkflowRoleDetail({ roleId: id, schoolId: schoolIds.join(',') }).then(res => {
          if (res.data && res.data.length > 0) {
            let data = uniqWith(res.data, (arrVal, othVal) => arrVal.userId === othVal.userId && arrVal.schoolId === othVal.schoolId)
            this.procOrgUserList2 = selectFinanceList.map(item => ({
              title: name,
              schoolId: item.school.branchId,
              schoolName: item.school.name,
              money: item.money,
              orgUserBOList: data.filter(d => item.school.branchId === d.schoolId).map(d => Object.assign({ key: d.userId, label: d.userName }, d))
            }))
            if (this.procOrgUserList2.length > 0) {
              this.procOrgUserList2.forEach((item, index) => {
                if (item.orgUserBOList.length === 1) {
                  this.agreeForm['listOrgUser' + index] = item.orgUserBOList[0].key
                }
              })
              this.cashierUsersChange()
            }
          }
        })
      }
    },
    getModelNameByTag(tag, fields = this.formData.fields) {
      let vModelList = []
      fields.forEach(field => {
        if (tag === 'fc-input-table') {
          if (field.tag === tag) {
            vModelList.push(field.vModel)
          }
        } else {
          if (field.tag === 'fc-input-table') {
            let pModel = field.vModel
            let vModel = this.getModelNameByTag(tag, field.children)
            vModel = vModel.map(item => pModel + '.' + item)
            vModelList.push(...vModel)
          } else if (field.tag === tag) {
            vModelList.push(field.vModel)
          }
        }
      })
      return vModelList
    },
    getSelectFinanceValue(vModel) {
      let getValues = data => {
        let valueList = []
        if (data && data.data) {
          data.data.forEach(item => {
            if (item.school && item.school.branchId) {
              valueList.push(item)
            }
          })
        }
        return valueList
      }
      let value = []
      if (vModel.indexOf('.') > -1) {
        let [tabelVModel, cmpVModel] = vModel.split('.')
        let array = this.formData[tabelVModel].map(item => item[cmpVModel])
        array.forEach(data => {
          value.push(...getValues(data))
        })
      } else {
        value.push(...getValues(this.formData[vModel]))
      }
      return value
    },
    cashierUsersChange() {
      const length = this.procOrgUserList2.length
      if (length > 0) {
        this.agreeForm.cashierUsers = '1'
        for (let i = 0; i < length; i++) {
          if (!this.agreeForm['listOrgUser' + i]) {
            this.agreeForm.cashierUsers = ''
          }
        }
      }
      this.$forceUpdate()
    },
    back() {
      this.$router.push({ name: 'approvalFormList' })
    },
    closeBack() {
      let fullPath = this.$route.fullPath
      events.$emit('close', fullPath)
      this.$router.push({ name: 'approvalFormList' })
      // setTimeout(function() {
      //   // 关闭标签
      //   events.$emit('close', fullPath)
      // }, 1000)
    },
    checkTableData() {
      let valid = true
      Object.keys(this.tableRefs).forEach(vModel => {
        if (this.$refs[vModel]) {
          const res = this.$refs[vModel].$children[0].submit() // 返回false或表单数据
          if (res) {
            if (
              (this.code === '004' || this.code === '005' || this.code === '006') &&
              Array.isArray(this[this.confGlobal.formModel][vModel]) && Array.isArray(res)
            ) {
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
              if(this.code==='001'&&vModel==='priceInfo'&&res.length<=0){
                valid = false
              }
              this[this.confGlobal.formModel][vModel] = res
            }
          } else {
            valid = false
          }
        }
      })
      return valid
    },
    getFlowLine() {
      var that = this
      return new Promise((resolve, reject) => {
        let formData_ = JSON.parse(JSON.stringify(this.formData))
        for (let key in formData_) {
          if (Array.isArray(formData_[key]) || formData_[key] instanceof Object) {
            formData_[key] = JSON.stringify(formData_[key])
          } else {
            formData_[key] = String(formData_[key])
          }
        }

        workFlowProcdefFlowLine({
          procdefId: that.procinst.procdefId,
          procinstId: this.procinst.id,
          var: formData_
        })
          .then(function(result) {
            resolve(result.data)
          })
          .catch(() => {
            reject()
          })
      })
    },
    reSubmit() {
      var that = this
      // const isTableValid = this.checkTableData()
      // if(this.isEdit)
      this.$refs[this.confGlobal.formRef].validate(valid => {
        if (!valid) return
        // if (!isTableValid) return
        // that.formIsValid()
        // console.log(this.flowLine)
        // return
        var nodeList = JSON.parse(JSON.stringify(that.workFlowProcdefFlowLine))
        let perviousNode = nodeList.shift()
        let procedure = JSON.parse(this.procinst.nodeList)[this.procinst.rejectStep]
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
        // }
        var parms = {
          procdefId: that.procinst.procdefId,
          title: this.procinst.title,
          flowVal: JSON.stringify(that.formData),
          nodeList: JSON.stringify(nodeList),
          procinstId: this.procinst.id
        }
        workflowReStart(parms).then(function(data) {
          if (data.code == '200') {
            that.$notification['success']({
              message: '系统通知',
              description: '提交成功!'
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
              description: data.msg ? data.msg : '提交失败,请稍后重试!'
            })
          }
        })
      })
    },
    isShowRecall() {
      var that = this

      var result = false
      // if (top.SessionUtils && that.procinst.state == 1 && top.SessionUtils.getLoginUser().userId == that.procinst.createUser) {
      //   result = true
      // }
      if (that.procinst.state == 1 && !that.undoId) {
        result = true

        let procedure = {}
        let nodeList = JSON.parse(this.procinst.nodeList)
        nodeList.forEach(item => {
          if (item.nodeId.endsWith(this.procinst.nodeId)) {
            procedure = item
          }
        })
        let procdefType = procedure.properties.procdefType
        if (procdefType) return procdefType.recall
        return result
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
        onOk: () => {
          let recallFunc = () => {
            that.loadingBack = true
            workflowProcinstRecall([that.procinst.id])
              .then(function(data) {
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
                    description: data.msg ? data.msg : '处理失败,请稍后重试!'
                  })
                }
              })
              .finally(e => {
                that.loadingBack = false
              })
          }
          if (this.undoId) {
            this.getUndoResult().then(recallFunc)
          } else {
            recallFunc()
          }
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
      this.getUndoResult().then(() => {
        var that = this
        if (users && users.length > 0) {
          let undos = that.flowLine[that.flowLine.length - 1].undos
          let undoId = this.undoId || undos[undos.length - 1].id
          var param = {
            undoId: undoId,
            suggest: remark,
            userId: users[0].id,
            userName: users[0].name
            // deptId: users[0].dept
          }
          that.loadingChange = true
          workflowUndoAssignor(param)
            .then(function(data) {
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
            .finally(e => {
              that.loadingChange = false
            })
        }
      })
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
        that.loadingRefuse = true
        workflowUndoRefuse([param])
          .then(function(data) {
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
          .finally(e => {
            that.loadingRefuse = false
          })
      })
    },
    refuse2() {
      let procedure
      let nodeList = JSON.parse(this.procinst.nodeList)
      nodeList.forEach(item => {
        if (item.nodeId.endsWith(this.task.nodeId)) {
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
      this.$refs.refuseModel.open()
    },
    refuseModelConfirm(data) {
      this.getUndoResult().then(() => {
        const { refuseSuggest, refuseFlow, procedureType, commitNodeType, undoIds } = data
        let param = {
          undoId: this.undo.id,
          nodeUndoIds: undoIds,
          nodeId: refuseFlow,
          commitNodeStatus: commitNodeType,
          suggest: refuseSuggest,
          configLimit: {}
        }
        if (this.commitNodeType1 == 'toChooseNode') {
          param.configLimit.commitNodeType = commitNodeType
        }
        if (this.procedureType1 == 'chooseLimit') {
          param.configLimit.updateLimitType = procedureType
          param.limit = data.procedure ? JSON.stringify(data.procedure) : null
        }
        param.configLimit = JSON.stringify(param.configLimit)

        this.$refs.refuseModel.loading()
        rejectAnyNode(param)
          .then(res => {
            if (res.code == '200') {
              this.$notification['success']({
                message: '系统通知',
                description: '处理成功!'
              })

              let fullPath = this.$route.fullPath
              this.$router.push({ name: 'approvalFormList' })
              setTimeout(function() {
                // 关闭标签
                events.$emit('close', fullPath)
              }, 1000)
            } else {
              this.$notification['error']({
                message: '系统通知',
                description: '处理失败,请稍后重试!'
              })
            }
          })
          .finally(e => {
            this.$refs.refuseModel.close()
          })
      })
    },
    moveToView(a, b) {
      let feilds = this.formData.fields
      try {
        feilds.forEach(item => {
          if (item.rowType != 'table' && item.required) {
            if (!this.formData[item.vModel]) {
              document.querySelector(`#${item.vModel}`).scrollIntoView(true)
              throw new Error('end') //跳出循环
            }
          }
        })
      } catch (e) {}
    },
    /**
     * 同意
     */
    agree(type) {
      const isTableValid = this.checkTableData()
      this.$refs[this.confGlobal.formRef].validate(valid => {
        this.moveToView(valid, isTableValid)
        if (!valid) return
        if (!isTableValid) return
        this.initOrgUserList2()
        if (type != 'after') {
          this.orgUserBO = null
          this.agreeForm.listOrgUser = []
        }
        this.agreeVisible = true
      })
    },

    /**
     * 填写拒绝意见
     */
    fillSuggestRefuse(backFun) {
      var that = this
      let procedure
      let nodeList = JSON.parse(this.procinst.nodeList)
      nodeList.forEach(item => {
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
    handleAgreeOk(e) {
      if (this.config.basicSetting.formType == this.formTypes.Custom.value) {
        const iframe = document.getElementById('formIframe')
        if (iframe && iframe.contentWindow.agreeBeforeHandler && !iframe.contentWindow.agreeBeforeHandler()) {
          return
        }
      }
      this.getFlowLine().then(data => {
        let nodeList = data
        nodeList.shift()
        this.$refs.agreeFormModel.validate(valid => {
          if (valid) {
            let params = {
              paramList: [
                {
                  undoId: this.undoId,
                  suggest: this.agreeForm.suggest,
                  flowVal: JSON.stringify(this.formData),
                  nodeList: JSON.stringify(nodeList)
                }
              ],
              procinstId: this.procinst.id
            }
            // if (this.orgUserBO) {
            //   params.nodeBOList = this.agreeForm.listOrgUser.map(data => ({ userId: data.key, userName: data.label.trim() }))
            // } else {
            // }
            let list = []
            let listOrgUser = JSON.parse(JSON.stringify(this.procOrgUserList))
            if (this.procOrgUserList.length > 0) {
              list = this.procOrgUserList
              listOrgUser = JSON.parse(JSON.stringify(this.procOrgUserList))
            } else if (this.procOrgUserList2.length > 0) {
              list = this.procOrgUserList2
              listOrgUser = JSON.parse(JSON.stringify(this.procOrgUserList2))
            }
            list.forEach((item, index) => {
              if (item.orgUserBOList && Array.isArray(item.orgUserBOList) && item.orgUserBOList.length > 0) {
                item.orgUserBOList.forEach(items => {
                  if (items.key == this.agreeForm['listOrgUser' + index]) {
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
            params.nodeBOList = listOrgUser
            this.getUndoResult().then(() => {
              if (this.orgUserBO) {
                this.handleUserModalSaveThen().then(() => {
                  this.handleAgreeOkThen(params)
                })
              } else {
                this.handleAgreeOkThen(params)
              }
            })
          }
        })
      })
    },
    handleAgreeOkThen(params) {
      if (this.schoolId) {
        params.schoolId = this.schoolId
        // } else {
        //   // 替换nodeList中的menbers
        //   if (this.isChooseApprove && params.nodeBOList[0]) {
        //     let nodeList = JSON.parse(params.paramList[0].nodeList)
        //     let node = nodeList.find(item => item.nodeId === this.isChooseApproveNextNodeId)
        //     node.properties.menbers = []
        //     if (this.procOrgUserList.length > 0) {
        //       let selectUser = params.nodeBOList[0].orgUserBOList[0]
        //       let list = []
        //       let vModelList = this.getModelNameByTag('fc-select-finance')
        //       vModelList.forEach(item => {
        //         list.push(...this.getSelectFinanceValue(item))
        //       })
        //       list.forEach(item => {
        //         node.properties.menbers.push({
        //           id: selectUser.userId,
        //           name: selectUser.userName,
        //           schoolId: item.school.branchId,
        //           schoolName: item.school.name,
        //           schoolAmount: item.money
        //         })
        //       })
        //     } else if (this.procOrgUserList2.length > 0) {
        //       params.nodeBOList.forEach(item => {
        //         node.properties.menbers.push({
        //           id: item.orgUserBOList[0].userId,
        //           name: item.orgUserBOList[0].userName,
        //           schoolId: item.schoolId,
        //           schoolName: item.schoolName,
        //           schoolAmount: item.money
        //         })
        //       })
        //     }
        //     params.paramList[0].nodeList = JSON.stringify(nodeList)
        //   }
      }
      this.confirmLoading = true
      updateNextProcOrgUser(params)
        .then(res => {
          if (res.code == '200') {
            this.$notification['success']({
              message: '系统通知',
              description: '处理成功!'
            })

            this.handleAgreeCancel()
            this.closeBack()
          } else {
            this.$notification['error']({
              message: '系统通知',
              description: res.msg
            })
          }
        })
        .finally(() => (this.confirmLoading = false))
    },
    handleAgreeCancel(e) {
      this.orgUserBO = null
      this.agreeForm = {
        suggest: '',
        listOrgUser: []
      }
      this.agreeVisible = false
      this.$refs.agreeFormModel.resetFields()
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
      if (!this.refuseSuggest) {
        this.$notification['error']({
          message: '系统通知',
          description: '请填写拒绝理由!!!'
        })
        return
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
      if ((this.undo && this.undo.finished == 0) || this.isWait) {
        //待办
        // <el-col span={3} offset={1} style="text-align:left;">
        //   <el-form-item>
        //     <el-button onClick={this.back} style="">
        //       返回
        //     </el-button>
        //     // icon="el-icon-arrow-left"
        //   </el-form-item>
        // </el-col>
        btns = (
          <el-col span={24} class="operation-btn">
            <el-row>
              <el-col span={12} style="text-align:left;">
                <el-form-item>
                  <div style="display:flex;">
                    {this.code !== '007'?(
                      <el-button onClick={this.selectassignor} loading={this.loadingChange}>
                        转交审批
                      </el-button>
                    ):('')
                    }
                    {this.singleProcess && this.fixedProcess == 0 ? (
                      <el-button-group class="ml10" style="display:block;">
                        {this.beforeSign ? <el-button onClick={this.handleUserModalOpenBefore}>前置加签</el-button> : ''}
                        {this.afterSign ? <el-button onClick={this.handleUserModalOpenAfter}>后置加签</el-button> : ''}
                      </el-button-group>
                    ) : (
                      ''
                    )}
                    {this.andSign ? (
                      <div class="ml10">
                        <el-button onClick={this.handleAndSignModal}>会签</el-button>
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                </el-form-item>
              </el-col>
              <el-col span={6} style="text-align:center;">
                <el-form-item>
                  {this.isShowRecall() ? (
                    <el-button loading={this.loadingBack} onClick={this.recall}>
                      撤回
                    </el-button>
                  ) : (
                    ''
                  )}
                </el-form-item>
              </el-col>
              <el-col span={6} style="text-align:right;">
                <el-form-item>
                  {this.mergePay === 'A' && (this.code !== '004' && this.code !== '005') ? (
                    <el-button-group>
                      {this.isAdmin ? (
                        <el-button onClick={this.refuse2} loading={this.loadingRefuse} style="background-color:#F5F5F5;">
                          拒绝
                        </el-button>
                      ) : (
                        ''
                      )}
                      <el-button onClick={this.agree} loading={this.loading} type="primary" style="color: #fff;background-color:#19a97b;">
                        付款
                      </el-button>
                    </el-button-group>
                  ) : (
                    <el-button-group>
                      <el-button onClick={this.refuse2} loading={this.loadingRefuse} style="background-color:#F5F5F5;">
                        拒绝
                      </el-button>
                      <el-button onClick={this.agree} loading={this.loading} type="primary" style="color: #fff;background-color:#19a97b;">
                        同意
                      </el-button>
                    </el-button-group>
                  )}
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        )
      } else {
        //  <el-button   onClick={this.back}>返回</el-button>
        btns = (
          <el-col span={24} class="operation-btn">
            <el-form-item>
              {this.isShowRecall() ? (
                <el-button loading={this.loading} onClick={this.recall}>
                  撤回
                </el-button>
              ) : (
                ''
              )}
            </el-form-item>
          </el-col>
        )
      }
      // {this.procinst.state == -1 ? (
      //   <el-button style="background-color:#19a97b;color:#fff;" round onClick={this.reSubmit}>
      //     重新提交
      //   </el-button>
      // ) : (
      //   ''
      // )}
      // <el-button type="primary" onClick={this.assignor}>转交审批</el-button>
      const title = ''
      // <h3 style="text-align: center;">{this.procinst ? this.procinst.title : ''}</h3>

      // 因为使用jsx时  el-form 的 model 一直无法正确填充，故采用createElement直接渲染
      return h('el-form', formObject, [btns, title, content])
    },

    /* 前置加签/后置加签 打开弹框 */
    handleUserModalOpenBefore() {
      this.handleUserModalOpen('before')
    },
    handleUserModalOpenAfter() {
      this.handleUserModalOpen('after')
    },
    handleUserModalOpen(type) {
      this.beforeOrAfter = type
      if (type == 'after') {
        this.$refs.userModal.open()
      } else {
        this.isBeforeOrAfter = true
      }
    },
    reverse1(array) {
      var newArr = []
      for (var i = array.length - 1; i >= 0; i--) {
        newArr[newArr.length] = array[i]
      }
      return newArr
    },
    handleUserModalSave(users, remark) {
      let data = users
      if (this.beforeOrAfter === 'before') {
        data = this.reverse1(users[0])
      } else {
        data = this.reverse1(users)
      }
      if (!data.length) {
        return this.$notification['error']({
          message: '系统通知',
          description: '请先选择人员'
        })
      }
      this.orgUserBO = data.map(item => {
        return { userId: item.id, userName: item.userName }
      })
      this.agreeForm.listOrgUser = data.map(item => {
        return { key: item.id, label: item.userName }
      })
      if (this.beforeOrAfter === 'before') {
        this.getUndoResult().then(() => {
          this.handleUserModalSaveThen(remark).then(res => {
            if (res.code == 200) {
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功',
                duration: 0
              })
              this.handleUserModalCancel()
              this.closeBack()
            }
          })
        })
      } else {
        // const isTableValid = this.checkTableData()
        // this.$refs[this.confGlobal.formRef].validate(valid => {
        //   if (!valid) return
        //   if (!isTableValid) return
        //   // this.remark = remark
        //   this.agreeVisible = true
        // })
        this.agree('after')
      }
    },
    handleUserModalSaveThen(suggest) {
      let request = this.beforeOrAfter === 'before' ? beforeAdd : afterAdd
      let params = {
        orgUserBOList: this.orgUserBO,
        procinstId: this.procinst.id,
        undoId: this.undoId
      }
      if (this.beforeOrAfter === 'before') {
        params.suggest = suggest
        //判断是否为出纳
        if (this.mergePay == 'A') params.schoolId = this.schoolId
      }
      return request(params)
    },
    handleUserModalCancel() {
      this.$refs.userModal.close()
      // this.dialogVisible = false
    },
    /* 会签 打开弹框 */
    handleAndSignModal() {
      this.$refs.andSignModal.open()
    },
    handleAndSignModalSave(data) {
      this.getUndoResult().then(() => {
        const users = data.map(d => ({ userId: d.id, userName: d.userName }))
        const params = {
          undoId: this.undoId,
          undoAddNodeUserParams: users
        }
        addUndoNodeUser(params).then(res => {
          if (res.code == '200') {
            this.$notification['success']({
              message: '系统通知',
              description: '处理成功!'
            })

            this.handleAndSignModalCancel()
            this.closeBack()
          } else {
            this.$notification['error']({
              message: '系统通知',
              description: res.msg
            })
          }
        })
      })
    },
    handleAndSignModalCancel() {
      this.$refs.andSignModal.close()
    }
  },

  render(h) {
    var result = ''
    //gutter={this.confGlobal.gutter}
    // v-loading={this.flowLoading}
    if (this.formData) {
      if (this.config.basicSetting.formType == this.formTypes.Online.value) {
        let tips = ''
        let paidDate = ''
        //付款时间
        let paidBranchList = []
        if (this.formData && this.formData.paidDate && this.showPaidDate) {
          paidDate = <div style="padding: 0 0 10px;">付款时间：{this.formData.paidDate}</div>
        }
        //判断是否为出纳
        if (this.mergePay == 'A') {
          //判断是否为报销单
          if (this.code == '001') {
            let vModelList = this.getModelNameByTag('fc-select-finance')
            if (vModelList.length > 0) {
              let money = this.$number(0)
              let calculateFields = []
              vModelList.forEach(item => {
                calculateFields.push(...this.getSelectFinanceValue(item))
              })
              calculateFields.forEach(item => {
                if (item.school && item.school.branchId == this.schoolId) {
                  money = money.plus(item.money)
                }
              })
              paidBranchList = calculateFields.filter(item => item.school && item.school.branchId == this.schoolId)
              tips = <a-form-model-item label="合计总额">{money.toNumber().toFixed(2)}</a-form-model-item>
            }
          } else if (this.code == '002') {
            tips = <a-form-model-item label="合计总额">{this.formData.totalMoney}</a-form-model-item>
          }
        }
        result = (
          <a-tabs type="card" class="height:100%;">
            <a-tab-pane key="1" tab="详情">
              <div class={'preview-container  mt20'} style="margin-bottom: 60px;margin-top: 20px;">
                <el-row style="padding: 0rem 20px 20px;">
                  <workFlowline procinstId={this.procinst.id} schoolId={this.schoolId} />
                </el-row>
                <el-row style="padding: 0rem 20px 0px;">
                  <el-divider content-position="left">流程</el-divider>
                </el-row>
                <el-row style="padding: 0rem 20px 0;">
                  <flow-line flowLine={this.flowLine} procinst={this.procinst} confGlobal={this.confGlobal} />
                </el-row>
                {this.buildDrawer(h)}
                <i-modal
                  ref="userModal"
                  isNumber={true}
                  checkBox={true}
                  userType="all"
                  autoClose={false}
                  innerContainer={true}
                  onGetBackData={this.handleUserModalSave}
                />
                <i-modal
                  ref="andSignModal"
                  isNumber={true}
                  checkBox={true}
                  userType="all"
                  autoClose={false}
                  innerContainer={true}
                  onGetBackData={this.handleAndSignModalSave}
                />
                <FlowOrgSelect
                  v-model={this.beforeOrAfterInfo}
                  {...{ on: { onConfirm: this.handleUserModalSave } }}
                  enableEdit={true}
                  isNumber={true}
                  checkBox={true}
                  maxNum={1}
                  title="选择加签人"
                  filterConfig={null}
                  show={this.isBeforeOrAfter}
                  {...{ on: { 'update:show': val => (this.isBeforeOrAfter = val) } }}
                  type={'flow_user'}
                  isNumber={true}
                  checkBox={true}
                />
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
                <a-modal
                  title="审批意见"
                  confirm-loading={this.confirmLoading}
                  visible={this.agreeVisible}
                  onOk={this.handleAgreeOk}
                  maskClosable={false}
                  onCancel={this.handleAgreeCancel}
                >
                  <a-form-model ref="agreeFormModel" props={{ model: this.agreeForm }} rules={this.agreeRules}>
                    {paidDate}
                    {this.code == '001' && this.mergePay == 'A' ? <paidBankList dataList={paidBranchList} /> : ''}
                    {tips}
                    {this.orgUserBO ? (
                      <a-form-model-item label="审批人" prop="listOrgUser">
                        {this.orgUserBO.map(item => {
                          return <div>{item.userName}</div>
                        })}
                      </a-form-model-item>
                    ) : (
                      ''
                    )}
                    {this.procOrgUserList.length > 0
                      ? this.procOrgUserList.map((item, index) => {
                          return (
                            <a-form-model-item label={item.title + '的审批人'} prop={'listOrgUser' + index}>
                              <a-select
                                placeholder={'请选择' + item.title + '的审批人'}
                                options={item.orgUserBOList}
                                v-model={this.agreeForm['listOrgUser' + index]}
                              />
                            </a-form-model-item>
                          )
                        })
                      : ''}
                    {this.procOrgUserList2.length > 0 ? (
                      <a-form-model-item label={'请选择' + this.procOrgUserList2[0].title + '的审批人'} prop="cashierUsers">
                        <a-input type="hidden" v-model={this.agreeForm.cashierUsers} />
                        <a-row>
                          <a-col span={8}>付款分馆</a-col>
                          <a-col span={6}>付款金额</a-col>
                          <a-col span={10}>{this.procOrgUserList2[0].title}</a-col>
                        </a-row>
                        {this.procOrgUserList2.map((item, index) => (
                          <a-row>
                            <a-col span={8}>{item.schoolName}</a-col>
                            <a-col span={6}>{item.money}</a-col>
                            <a-col span={10}>
                              <a-select
                                placeholder={'请选择' + item.title + '的审批人'}
                                options={item.orgUserBOList}
                                v-model={this.agreeForm['listOrgUser' + index]}
                                onChange={this.cashierUsersChange}
                              />
                            </a-col>
                          </a-row>
                        ))}
                      </a-form-model-item>
                    ) : (
                      ''
                    )}
                    <a-form-model-item label="理由" prop="suggest">
                      <a-input placeholder="请输入同意理由" v-model={this.agreeForm.suggest} />
                    </a-form-model-item>
                  </a-form-model>
                </a-modal>
                <refuseModel
                  ref="refuseModel"
                  procedureTypeOptions={this.procedureType1 == 'chooseLimit' ? this.fotmItemOptions : []}
                  commitNodeType={this.commitNodeType1}
                  schoolId={this.schoolId}
                  procinstId={this.procinst.id}
                  onConfirm={this.refuseModelConfirm}
                />
              </div>
              <div class={'preview-container'}>
                <el-image src={this.activeIconSrc} style="position: absolute;right: 5%;top: 3%; z-index: 999;" />
                <el-row style={'padding: 0rem 20px 0;'}>{<workFlowData procinst={this.procinst} confGlobal={this.confGlobal} node={this.node} />}</el-row>
                <el-row style={'padding: 0rem 20px 0;'}>{this.buildForm(h)}</el-row>
              </div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="打印表单">
              <workFlowTable
                createTime={this.procinst.createTime}
                createUserName={this.procinst.createUserName}
                curator={this.procinst.curator}
                code={this.code}
                title={this.config.basicSetting.flowName}
                formDatas={this.formData}
                confGlobal={this.confGlobal}
              />
            </a-tab-pane>
          </a-tabs>
        )
      } else {
        // v-loading={this.flowLoading}
        result = (
          <div>
            <div class="preview-container">
              <el-row style="padding: 20px 20px 0;">{this.buildForm(h)}</el-row>
            </div>
            <div class="preview-container">
              <el-row style="padding: 0rem 20px 20px;">
                <workFlowline procinstId={this.procinst.id} schoolId={this.schoolId} />
              </el-row>
              <el-row style="padding: 0rem 20px 0px;">
                <el-divider content-position="left">流程</el-divider>
              </el-row>

              <el-row style="padding: 0rem 20px 0;padding-bottom:60px;">
                <flow-line flowLine={this.flowLine} procinst={this.procinst} confGlobal={this.confGlobal} />
              </el-row>

              {this.buildDrawer(h)}
              <i-modal
                ref="userModal"
                isNumber={true}
                checkBox={true}
                userType="all"
                autoClose={false}
                innerContainer={true}
                onGetBackData={this.handleUserModalSave}
              />
              <i-modal ref="andSignModal" checkBox={true} userType="all" autoClose={false} innerContainer={true} onGetBackData={this.handleAndSignModalSave} />

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
    width:1000px;
    margin:0 auto;
    position:relative;
    background:#fff;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 10px 0px;

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

.el-input-number{
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
.el-button:focus, .el-button:hover ,.el-button:active{
    color: rgba(0,0,0,0.65);
    background: #fff;
    border-color: rgb(217,217,217);
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
.el-radio__inner:hover {
    border-color: #1ba97b;
}
.el-textarea__inner:focus {
    outline: 0;
    border-color: #1ba97b;
}
</style>
