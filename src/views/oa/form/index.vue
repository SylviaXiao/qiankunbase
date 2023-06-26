<script>
import render from '@/assets/utils/render.js'
import { trigger } from '@/components/DynamicForm/components/generator/config.js'
import {
  workflowReStart,
  startDrafts,
  workflowProcinstGet,
  workflowSave,
  workFlowProcdefGet,
  workFlowProcdefFlowLine,
  workFlowProcdefStart,
  listWorkflowRoleUserDetail
} from '@/api/workFlow/request'
import FlowLine from './FlowLine'
import draftList from './draftList/index.vue'
import changeFlowline from './changeFlowline/index.vue'
import workFlowTable from '../view/workFlowTable/index.vue'
import events from '@/components/MultiTab/events.js'
import { differenceWith } from 'lodash'
import moment from 'moment'
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
          .catch(err => {
            const { msg } = err
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
    if (conf.condition) message = Array.isArray(conf.condition) ? conf.conValue : undefined
    if (message === undefined || !message) message = `${conf.label}不能为空`
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
  localStorage.setItem('FLOWLINEFORMEDIT', JSON.stringify(ctx.confGlobal))
  localStorage.setItem('FLOWLINEFORMEDITId', ctx.procdefId)
  localStorage.setItem('FLOWLINEFORMEDITPRODEFID', ctx.procinstId || '')
}

var _isMounted = false // 收集默认值 渲染完成之后防止重复收集默认值

const buildData = (ctx, value, prop) => setData(ctx, value, prop, true)

const layouts = {
  colFormItem: function(conf, h, ctx, isList = false) {
    let isVote = conf.tag === 'fc-vote'
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
      <el-col span={conf.span || 24}>
        <el-form-item label-width={labelWidth} label={isList || isVote ? '' : conf.label} prop={conf.vModel} id={conf.vModel}>
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
    if (isList || isVote) {
      var tableTitle = (
        <el-col span={24} style="font-size: 14px;padding:6px 0px;margin-bottom: 4px;border-bottom: 0px solid #e5e5e5;">
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
      const param = {
        ...conf,
        config: conf,
        formSize: ctx.confGlobal.size,
        labelWidth: `${conf.labelWidth || ctx.confGlobal.labelWidth}px`
      }
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
  name: 'formNew',
  props: ['modelId'],
  data() {
    // var confGlobal = localStorage.getItem('FLOWLINEFORMEDIT')
    //  this.$route.params.formData || ''
    //Object.freeze(confGlobal)

    /*return {
              procdefId: procdefId,
              tableRefs: {},
              drawerTitle: '',
              drawerText: '',
              drawerVisible: false,
              containerWidth: 90,
              confGlobal,
              [confGlobal.formModel]: {},
              [confGlobal.formRules]: {}
            }*/

    return {
      showEditPaidAccount: false, //审批中是否允许编辑/查看打款账户
      showEditFeeType: false, //审批中是否允许查看/编辑费用类型
      splitMonthSelect: 'A', //分摊可选月份
      showDraftList: true,
      isFlag: false,
      urgent: 'B', //是否加急 A:是 B:否
      // confGlobalHistory: confGlobal,
      procinstId: null, //草稿箱id
      procinstType: null, //数据类型
      loading: false,
      showPreview: false,
      showDraft: false,
      procinst: null,
      procdefId: null,
      procdef: null,
      tableRefs: {},
      config: null,
      drawerTitle: '',
      drawerText: '',
      drawerVisible: false,
      containerWidth: 100,
      confGlobal: null,
      formData: {},
      rules: {},
      flowLine: null,
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
  watch: {
    $route: {
      handler: function(route) {
        if (route.query && route.query.procinstId) {
          this.procinstId = route.query.procinstId
          this.procinstType = route.query.procinstType
          this.init()
          this.$nextTick(() => {
            this.showDraftList = true
          })
        }
      },
      immediate: true,
      deep: true
    }
  },
  components: {
    FlowLine,
    draftList,
    changeFlowline,
    workFlowTable
  },
  computed: {
    code() {
      return this.config && this.config.basicSetting.code
    }
  },
  created() {
    this.init()
  },
  mounted() {
    _isMounted = true
  },
  methods: {
    async init() {
      var that = this

      console.log('created start')

      that.procdefId = this.$route.params.procdefId
      that.procinstId = this.$route.query.procinstId
      if (this.modelId) {
        that.procdefId = this.modelId
      }

      if (that.procdefId) {
        //首次发起流程
        const procdefRes = await workFlowProcdefGet({ id: this.procdefId })
        that.procdef = procdefRes.data
        that.config = JSON.parse(that.procdef.config)
        if (that.config.basicSetting.formType == that.formTypes.Online.value) {
          //在线设计的表单
          var formOperates = JSON.parse(that.procdef.config).processData.properties.formOperates
          var formOperatesMap = {}
          for (var i = 0; i < formOperates.length; i++) {
            formOperatesMap[formOperates[i].formId] = formOperates[i].formOperate
          }
          if (that.procdef) {
            if (that.procinstId) {
              const procinstRes = await workflowProcinstGet(that.procinstId)
              that.procinst = JSON.parse(JSON.stringify(procinstRes.data))
              that.getFormData(JSON.parse(procinstRes.data.flowVal), formOperatesMap)
            } else {
              that.getFormData(JSON.parse(that.procdef.config).formData, formOperatesMap)
            }
          }
        }
      }
      setTimeout(function() {
        that.isFlag = true
      }, 5000)
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
        }
      }, 1000)
      console.log('created end')
    },
    setGlobalData(data) {
      if (this.procdefId === localStorage.getItem('FLOWLINEFORMEDITId') && localStorage.getItem('FLOWLINEFORMEDIT')) {
        if (this.procinstId) {
          if (this.procinstId === localStorage.getItem('FLOWLINEFORMEDITPRODEFID')) {
            return JSON.parse(localStorage.getItem('FLOWLINEFORMEDIT'))
          } else {
            return data
          }
        }
        return JSON.parse(localStorage.getItem('FLOWLINEFORMEDIT'))
      } else {
        return data
      }
    },
    getFormData(formData, formOperatesMap) {
      this.confGlobal = JSON.parse(JSON.stringify(this.setGlobalData(JSON.parse(JSON.stringify(formData)))))
      this.confGlobal.fields = this.formatEdit(JSON.parse(JSON.stringify(this.confGlobal.fields)), formOperatesMap)
      this.formData = this.confGlobal
      this.confGlobal.fields.forEach((item, index) => {
        if (item.defaultValue && item.tag != 'fc-input-table') {
          this.formData[item.vModel] = this.formData[item.vModel] || JSON.parse(JSON.stringify(item.defaultValue))
        }
        if (item.tag === 'el-date-picker' && !item.hidden) {
          let date = moment(new Date()).format('YYYY-MM-DD')
          this.formData[item.vModel] = this.formData[item.vModel] || JSON.parse(JSON.stringify(date))
        }
      })
      //教研离职审批默认值设置
      if(this.code === '008'){
        let {userName,userTel,userEntryTime}=this.$store.getters.userInfo.user
        this.formData['name'] = userName
        this.formData['phone'] =userTel
        this.formData['inductionDate'] = userEntryTime
        listWorkflowRoleUserDetail({ code: this.code }).then(res => {
          if (res.code === 200 && Array.isArray(res.data) && res.data.length > 0) {
            if(Array.isArray(res.data[0].schools)&&res.data[0].schools.length>0){
              this.formData['title'] = userName + userTel+res.data[0].schools[0].schoolName.split(')')[1]+'离职申请'
            }
          }
        })
      }
    },
    getFlowLine() {
      var that = this
      return new Promise((resolve, reject) => {
        let formData_ = JSON.parse(JSON.stringify(this.formData))
        this.formData = JSON.parse(JSON.stringify(this.formData))
        for (let key in formData_) {
          if (Array.isArray(formData_[key]) || formData_[key] instanceof Object) {
            formData_[key] = JSON.stringify(formData_[key])
          } else {
            formData_[key] = String(formData_[key])
          }
        }
        workFlowProcdefFlowLine({
          procdefId: that.procdefId,
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
    formatEdit(fields, formOperatesMap) {
      let that = this
      for (var i = 0; i < fields.length; i++) {
        fields[i].disabled = true
        if (formOperatesMap[fields[i].formId] == that.formOperatesType.HIDE) {
          fields[i].hidden = true
        } else if (formOperatesMap[fields[i].formId] == that.formOperatesType.READ) {
          fields[i].disabled = true
        } else if (formOperatesMap[fields[i].formId] == that.formOperatesType.EDIT) {
          fields[i].disabled = false
          // if (that.procinst.state == 1 && this.undoId) {
          //   fields[i].show = false
          // }
        }
        if (fields[i].children && fields[i].children.length > 0) {
          that.formatEdit(fields[i].children, formOperatesMap)
        }
      }
      return fields
    },
    /**
     * 预览上传文件
     */
    onPreview(file) {
      console.log('file:' + file)
    },
    saveDraft() {
      var that = this
      // var nodeList = JSON.parse(JSON.stringify(that.flowLine))
      // nodeList: JSON.stringify(nodeList)
      // nodeList.shift()
      var parms = {
        procinstId: that.procinstId,
        procdefId: that.procdefId,
        title: '',
        flowVal: JSON.stringify(that.formData)
      }
      workflowSave(parms).then(function(data) {
        if (data.code == '200') {
          that.$notification['success']({
            message: '系统通知',
            description: '保存成功!'
          })
          setTimeout(function() {
            // that.$router.push({ name: 'approvalFormList' })
            that.showDraft = true
            that.procinstType = 'draft'
            that.procinstId = data.data
          }, 1000)
        } else {
          that.$notification['error']({
            message: '系统通知',
            description: data.msg ? data.msg : '保存失败,请稍后重试!'
          })
        }
      })
    },
    submitForm(urgent = 'B') {
      this.urgent = urgent
      if (this.config.basicSetting.formType == this.formTypes.Online.value) {
        this.submitOnlineForm()
      } else {
        this.submitCustomForm()
      }
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
    submitOnlineForm() {
      var that = this
      const isTableValid = this.checkTableData()
      this.$refs[that.confGlobal.formRef].validate(valid => {
        that.moveToView(valid, isTableValid)
        if (!valid) return
        if (!isTableValid) return
        if (this.config.basicSetting.code === '005') {
          if (!this.checkSource()) return
          if (!this.checkPerListData()) return
          this.checkInputVerify().then(flag => {
            if (flag) this.$refs.showFlowline.open()
          })
        } else {
          this.$refs.showFlowline.open()
        }
      })
    },
    submitFormEnd(data) {
      var that = this
      that.flowLine = JSON.parse(JSON.stringify(data))
      var nodeList = JSON.parse(JSON.stringify(data))
      nodeList.shift()
      let title = ''
      // let dataTitleType = that.config.advancedSetting.dataTitleType
      // if (dataTitleType == 1) {
      //   title = `${store.getters.nickname}的${that.config.basicSetting.flowName}`
      // } else if (dataTitleType == 2) {
      //   let dataTitle = that.config.advancedSetting.dataTitle || []
      //   let intersection = intersectionWith(that.config.formData.fields, that.config.advancedSetting.dataTitle, (item1, item2) => {
      //     return item1.vModel == item2
      //   })
      //   title = ``
      // }
      var parms = {
        procdefId: that.procdefId,
        title,
        flowVal: JSON.stringify(that.formData),
        nodeList: JSON.stringify(nodeList),
        urgent: this.urgent
      }
      if (that.loading) return
      that.loading = true
      if (this.procinstId) {
        let api = this.procinstType == 'recall' ? workflowReStart : startDrafts
        parms.procinstId = this.procinstId
        parms.flowVal = JSON.stringify(that.formData)
        api(parms)
          .then(function(data) {
            if (data.code == '200') {
              that.$notification['success']({
                message: '系统通知',
                description: '提交成功!'
              })
              that.resetForm()
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
      } else {
        workFlowProcdefStart(parms)
          .then(function(data) {
            if (data.code == '200') {
              that.$notification['success']({
                message: '系统通知',
                description: '提交成功!'
              })
              that.resetForm()
              let fullPath = that.$route.fullPath
              that.$router.push({
                name: 'myApproval',
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
              that.formData = JSON.parse(parms.flowVal)
              this.$forceUpdate()
            }
          })
          .finally(e => {
            that.loading = false
          })
      }
    },
    submitCustomForm() {
      var that = this

      var iframe = window.document.getElementById('formIframe')

      if (!iframe.contentWindow.validateForm()) return

      var flowVal = iframe.contentWindow.getData()

      var nodeList = JSON.parse(JSON.stringify(that.flowLine))
      nodeList.shift()

      var parms = {
        procdefId: that.procdefId,
        title: '',
        flowVal: JSON.stringify(flowVal),
        nodeList: JSON.stringify(nodeList)
      }
      workFlowProcdefStart(parms).then(function(data) {
        if (data.code == '200') {
          that.$notification['success']({
            message: '系统通知',
            description: '提交成功!'
          })
          that.resetForm()
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
    },

    /*assignor (){

            },*/

    resetForm() {
      // this.$refs[this.confGlobal.formRef].resetFields()
      // this.resetTableData()
      localStorage.setItem('FLOWLINEFORMEDIT', '')
      localStorage.setItem('FLOWLINEFORMEDITId', '')
      localStorage.setItem('FLOWLINEFORMEDITPRODEFID', '')
    },

    cancle() {
      // try {
      //   top.Win.closeAll()
      // } catch (e) {
      //   window.close()
      // }
      this.resetForm()
      this.$router.go(-2) //返回上一层
    },

    selectNextNodeActioner(backFun) {
      backFun([], [])
    },

    resetTableData() {
      Object.keys(this.tableRefs).forEach(vModel => {
        // 由于render.js返回的动态组件 所以动态组件相当于是render的子组件
        const res = this.$refs[vModel]['$children'][0].reset()
      })
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
              if (cardNos.size === cardList.length) {
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
      for (let item of this.formData.refundInfo || []) {
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
    // 验证业绩必填及金额
    checkPerListData() {
      for (let item of this.formData.refundInfo || []) {
        let adviser = item.adviserPerList || []
        let teacher = item.teacherPerList || []

        let flag = adviser.length === 0 || (adviser.findIndex(d => !d.adviser && !d.adviserDept && !d.adviserPrice) >= 0)
        let flag2 = teacher.length === 0 || (teacher.findIndex(d => !d.teacher && !d.teacherDept && !d.teacherPrice) >= 0)
        if (flag && flag2) {
          this.$notification['error']({
            message: '系统通知',
            description: `顾问业绩和导师业绩二选一填!`
          })
          return false
        } else {
          let index = adviser ? adviser.findIndex(d => !d.adviser && !d.adviserDept && !d.adviserPrice) : -1
          let index2 = teacher ? teacher.findIndex(d => !d.teacher && !d.teacherDept && !d.teacherPrice) : -1
          if (index >= 0) item.adviserPerList.splice(index, 1)
          if (index2 >= 0) item.teacherPerList.splice(index2, 1)
          adviser = item.adviserPerList || null
          teacher = item.teacherPerList || null

          if (adviser && adviser.findIndex(d => !d.adviser || !d.adviserDept || !d.adviserPrice) >= 0) {
            this.$notification['error']({
              message: '系统通知',
              description: `请填写顾问业绩!`
            })
            return false
          } else if (teacher && teacher.findIndex(d => !d.teacher || !d.teacherDept || !d.teacherPrice) >= 0) {
            this.$notification['error']({
              message: '系统通知',
              description: `请填写导师业绩!`
            })
            return false
          }
          // let adviserPrice = adviser.map(d.adviserPrice).reduce((a, b) => this.$number(a).plus(b), this.$number(0)).toNumber()
          // let teacherPrice = teacher.map(d.teacherPrice).reduce((a, b) => this.$number(a).plus(b), this.$number(0)).toNumber()
        }
      }

      return true
    },

    showExplain(explainText, title) {
      if (!explainText) return
      this.drawerTitle = title
      this.drawerText = explainText
      this.drawerVisible = true
    },
    handleOk() {
      this.handleCancel()
    },
    handleCancel() {
      this.showDraft = false
    },
    handleShowDraft() {
      this.showDraft = true
    },
    closeDraft(data) {
      if (data) {
        this.showDraftList = false
        this.$router.push({
          //修改原有参数
          query: data
        })
      }
      this.showDraft = false
    },
    handlePreview() {
      this.showPreview = !this.showPreview
    },
    buildDrawerDraft(h) {
      var content = (
        <a-modal title={`草稿列表`} width="700px" destroyOnClose={true} visible={this.showDraft} onok={this.handleOk} oncancel={this.handleCancel}>
          <draftList id={this.procdefId} onhandleCancel={this.closeDraft} />
        </a-modal>
      )
      return content
    },
    buildFlowline(h) {
      var content = <changeFlowline ref="showFlowline" onsubmitFormEnd={this.submitFormEnd} formData={this.formData} procdefId={this.procdefId} />
      return content
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

    buildForm(h) {
      var content = null
      var formObject = {}
      if (this.config.basicSetting.formType == this.formTypes.Online.value) {
        if (this.confGlobal) {
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
        }
      } else {
        var storageCache = localStorage.ND_FASTDP

        var src = this.config.basicSetting.flowForm + '?token=' + JSON.parse(storageCache)['token']

        content = <iframe id="formIframe" src={src} scrolling="no" frameborder="0" style="width: 100%;" />
      }

      var btns = ''

      if (!this.actionerId) {
        btns = (
          <el-col span={24} class="operation-btn">
            <el-form-item>
              <el-button onClick={this.cancle} plain type="primary">
                取消
              </el-button>
              <el-button type="primary" loading={this.loading} onClick={() => this.submitForm('B')}>
                提交
              </el-button>
              {!this.procinstId || this.procinst?.state == 0 || this.procinst?.state == 3 ? (
                <el-button type="primary" loading={this.loading} onClick={() => this.submitForm('A')}>
                  加急提交
                </el-button>
              ) : ''}
              <el-button type="primary" plain onClick={this.saveDraft}>
                保存草稿
              </el-button>
            </el-form-item>
          </el-col>
        )
      } else {
        btns = (
          <el-col span={24} class="operation-btn">
            <el-row>
              <el-col span={8} style="text-align:left;" />
              <el-col span={8} style="text-align:center;">
                <el-form-item>
                  <el-button plain type="primary" onClick={this.cancle}>
                    关闭
                  </el-button>
                </el-form-item>
              </el-col>
              <el-col span={8} style="text-align:right;">
                <el-form-item>
                  <el-button-group>
                    <el-button plain type="primary" onClick={this.refuse} style="background-color:#F5F5F5;">
                      拒绝
                    </el-button>
                    <el-button type="success" onClick={this.agree}>
                      同意
                    </el-button>
                  </el-button-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        )
      }

      // <el-button type="primary" onClick={this.assignor}>委托</el-button>

      const title = ''
      //  <h3 style="text-align: center;">{this.procdef ? this.procdef.name : ''}</h3>
      // 因为使用jsx时  el-form 的 model 一直无法正确填充，故采用createElement直接渲染
      return h('el-form', formObject, [btns, title, content])
    },

    onOrgChange(data) {},

    getSelectActionerTitle() {
      return '选择审批人'
    }
  },
  render(h) {
    var result = ''
    //gutter={this.confGlobal.gutter}
    // v-loading={this.flowLoading}
    if (this.config != null && this.config.basicSetting != null) {
      // if (this.formIsValid && this.flowLine != null) {
      result = (
        <div class="formview">
          <div class="title_draft">
            <span />
            <h3>{this.procdef ? this.procdef.name : ''}</h3>
            <div>
              <el-button plain type="primary" onClick={this.handlePreview}>
                {this.showPreview ? '编辑' : '预览'}
              </el-button>
              <span>
                <el-button plain type="primary" onClick={this.handleShowDraft}>
                  草稿箱
                </el-button>
              </span>
            </div>
          </div>
          {this.showDraftList ? (
            <div>
              <div class="preview-container" style={this.showPreview ? 'display:none;' : ''}>
                <el-row style="padding: 20px 20px 0;">{this.buildForm(h)}</el-row>
              </div>
              <div class="preview-container mt20 " style={this.showPreview ? 'display:none;margin-bottom: 60px;' : 'margin-bottom: 60px;'}>
                {this.buildDrawer(h)}
                {this.buildDrawerDraft(h)}
                {this.buildFlowline(h)}
              </div>
              <div style={this.showPreview ? 'margin:20px 0 20px;' : 'display:none;'}>
                <workFlowTable
                  code={this.config.basicSetting.code}
                  title={this.config.basicSetting.flowName}
                  formDatas={this.formData}
                  confGlobal={this.confGlobal}
                />
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
      )
      // <el-row style="padding: 0rem 20px 20px;">
      //   <el-divider content-position="left">流程</el-divider>
      // </el-row>
      // <el-row style="padding: 0rem 20px ;padding-bottom:60px;">
      //   <flow-line flowLine={this.flowLine} />
      // </el-row>
      // } else {
      //   result = (
      //     <div class="formview">
      //       <div class="title_draft">
      //         <span />
      //         <h3>{this.procdef ? this.procdef.name : ''}</h3>
      //         <div>
      //           <el-button plain type="primary" onClick={this.handlePreview}>
      //             {this.showPreview ? '编辑' : '预览'}
      //           </el-button>
      //           <span>
      //             <el-button plain type="primary" onClick={this.handleShowDraft}>
      //               草稿箱
      //             </el-button>
      //           </span>
      //         </div>
      //       </div>
      //       <div class="preview-container" style={this.showPreview ? 'display:none;' : ''}>
      //         <el-row style="padding: 20px 20px 0;">{this.buildForm(h)}</el-row>
      //       </div>
      //       <div class="preview-container mt20 " style={this.showPreview ? 'display:none;margin-bottom: 60px;' : 'margin-bottom: 60px;'}>
      //         <el-row style="padding: 0rem 20px 20px;">
      //           <el-divider content-position="left">流程</el-divider>
      //         </el-row>
      //         <el-row style="padding: 0rem 20px 0;padding-bottom:60px;">
      //           <el-alert title="流程条件未满足请先填写申请单" type="info" center show-icon />
      //         </el-row>
      //         {this.buildDrawer(h)}
      //         {this.buildDrawerDraft(h)}
      //         {this.buildFlowline(h)}
      //       </div>
      //       <div style={this.showPreview ? 'margin:20px 0 20px;' : 'display:none;'}>
      //         <workFlowTable title={this.config.basicSetting.flowName} formDatas={this.formData} confGlobal={this.confGlobal} />
      //       </div>
      //     </div>
      //   )
      // }
    }
    return result
  }
}
</script>
<!--
 <style lang="stylus" scoped>
-->
<style lang="stylus">
.el-divider__text, .el-link {
    font-size: 16px;
}
  .el-button:focus, .el-button:hover {
    color: #fff;
    border-color: #1ba97b;
    background-color: #1ba97b;
}
.formview{
  position:relative;
.title_draft{
  height:70px;
  text-align:center;
  display:flex;
  justify-content :space-between;
  align-items:center;
    background: #fff;
    width: 100%;
    border-bottom: 1px solid #eee;
    box-shadow: rgba(0,0,0,0.1) 0 2px 0.1rem 0;
    z-index:1000;
  h3{
    color:#000;

  }
  .el-button{
  margin-right:20px;
    // color: #fff;
        // background-color: #19a97b;
    padding:2px 20px;
    border-radius: 4px
    font-size: 14px;
    height:30px;
}
}
}

.view.preview-container{
  position:relative;
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
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 10px 0px;
    width:1000px;
    margin:20px auto;
    position:relative;
    background:#fff;
.el-form-item--small.el-form-item {
    margin-bottom: 25px;
}
    .width-slider
        width  150px
        position absolute
        top 0
        right 20px

.showDivider.form-container {
    margin-bottom: 20px;
}

.operation-btn{
    position: fixed;
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
.el-button--primary.is-plain,.el-button--primary.is-plain:focus, .el-button--primary.is-plain:hover {
    color: rgba(0,0,0,0.65)!important;
    background: #fff;
    border-color: rgb(217,217,217);
}
.el-input.is-active .el-input__inner,
.el-input__inner:focus,
.el-select .el-input__inner:focus,
.el-select .el-input.is-focus .el-input__inner {
  border-color: #1ba97b;
}

.el-date-table td.today span,
.el-date-table td.available:hover,
.el-select-dropdown__item.selected {
  color: #1ba97b;
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
