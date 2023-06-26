<template>
  <div class="fc-table-box" :class="[config.type]">
    <el-table
      v-if="['table', 'default'].includes(config.type)"
      :data="tableFormData"
      border
      class="fc-table"
      @cell-click="focusInput"
      v-bind="config.tableConf || {}"
      :show-summary="config['show-summary']"
      :summary-method="getTableSummaries"
    >
      <el-table-column width="50" align="center">
        <!-- 序号 -->
        <template slot-scope="scope">
          <div class="row-action">
            <span class="index">
              {{ scope.$index + 1 }}
            </span>
            <el-popconfirm title="确定删除该行数据吗？" @confirm="removeRow(scope.$index)">
              <i slot="reference" class="el-icon-delete delete-btn"></i>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
      <!-- 组件列 -->
      <template>
        <el-table-column
          v-for="(head, cindex) in tableData"
          :key="head.formId"
          :min-width="head['min-width']"
          :width="head['style']['width'] || head['min-width']"
          :prop="head.vModel"
          v-if="!head.hidden"
        >
          <template slot="header">
            <span style="color: #f56c6c;" v-if="head.required">*</span>
            {{ head['label'] }}
          </template>
          <template slot-scope="scope">
            <!-- 单选框组 多选框组 都替换成下拉 并添加options -->
            <template v-if="['el-select', 'el-checkbox-group', 'el-radio-group'].includes(head.tag)">
              <el-select
                :disabled="head.disabled"
                v-model="tableFormData[scope.$index][cindex].value"
                placeholder="请选择"
                :multiple="head.tag === 'el-checkbox-group' || getConfById(head.formId).multiple"
                @change="onFormDataChange(scope.$index, cindex, 'el-select', head)"
              >
                <el-option v-for="(opt, oindex) in head.options" :key="oindex" :label="opt.label" :value="opt.value"> </el-option>
              </el-select>
            </template>
            <!-- 上传 -->
            <template v-else-if="head.tag === 'el-upload'">
              <el-upload
                :disabled="head.disabled"
                v-bind="getConfById(head.formId)"
                :on-success="res => onUploadSuccess(res, tableFormData[scope.$index][cindex])"
                @mouseleave.native="hideUploadList"
                @mouseenter.native="showUploadList"
              >
                <span slot="default">
                  已上传
                  {{ tableFormData[scope.$index][cindex].value.length }}
                </span>
              </el-upload>
            </template>
            <!-- 其他 -->
            <component
              v-else
              :is="head.tag"
              :required="conf.required"
              :valid="conf.valid"
              :disabled="head.disabled"
              :rowIndex="scope.$index"
              v-model="tableFormData[scope.$index][cindex].value"
              v-bind="getConfById(head.formId)"
              :formData="formData"
              @change="onFormDataChange(scope.$index, cindex, head.tag, head)"
            >
            </component>
            <div class="error-tip" v-show="!tableFormData[scope.$index][cindex].valid">
              不能为空
            </div>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <template v-if="config.type === 'list'">
      <div v-for="(row, rindex) in tableFormData" :key="rindex" class="list-row">
        <!-- <el-tooltip content="删除">
          <i class="el-icon-delete delete-btn" @click="removeRow(rindex)"></i>
        </el-tooltip> -->
        <div style="display:flex;justify-content:space-between;align-items: center;color:#1BA97B;">
          <div style="">{{ rindex + 1 }}</div>
          <div @click="removeRow(rindex)" class="cursor">删除</div>
        </div>
        <a-row>
          <a-col
            v-for="(conf, cindex) in config.children"
            :key="cindex"
            class="row-item"
            :style="conf.hidden ? 'margin:0;width:0;height:0;' : 'min-height:52px;'"
            :class="{ error: !tableFormData[rindex][cindex].valid }"
            :id="conf.vModel + rindex"
            :span="conf.span || 24"
          >
            <div v-if="!conf.hidden" :style="{ width: labelWidth }">
              <span style="color: #f56c6c;" v-if="conf.required">
                <span v-if="conf.tag == 'fc-select-feeType' && !showEditFeeType"></span>
                <span v-else>*</span>
              </span>
              {{ conf.label }}
            </div>
            <div :style="{ 'margin-left': labelWidth }">
              <component
                v-if="conf.tagType == 'conponent' || conf.tag == 'fc-calculate' || conf.tag == 'fc-total-money'"
                :ref="conf.vModel"
                :is="conf.tag"
                :disabled="conf.disabled"
                :required="conf.required"
                :valid="tableFormData[rindex][cindex].valid"
                :rowIndex="rindex"
                v-model="tableFormData[rindex][cindex].value"
                v-bind="getConfById(conf.formId)"
                :formData="formData"
                @change="onFormDataChange(rindex, cindex, conf.tag, conf)"
              >
              </component>
              <render
                v-else
                :disabled="conf.disabled"
                :formData="formData"
                :conf="Object.assign({ rowIndex: rindex }, conf)"
                :size="formSize"
                :required="conf.required"
                :valid="tableFormData[rindex][cindex].valid"
                :value="tableFormData[rindex][cindex]"
                :key="conf.renderKey"
                style="max-width: 350px;"
                @input="
                  payload => {
                    $set(tableFormData[rindex][cindex], 'value', payload)
                    onFormDataChange(rindex, cindex, conf.tag, conf)
                  }
                "
              />
            </div>
            <span class="error-tip">
              不能为空
            </span>
            <!-- </div> -->
          </a-col>
        </a-row>
      </div>
    </template>
    <div style="display:flex;justify-content:space-between">
      <div class="actions" @click="addRow">
        <i class="el-icon-plus"></i>
        {{ config.actionText }}
      </div>
      <div class="list-summary" v-if="config.type === 'list' && config['show-summary'] && code !== '005'">
        <div style="padding:6px 12px;float:left;">合计:</div>
        <div style="overflow: hidden;padding-top: 6px;">
          <div v-for="(val, name) in listSummation" :key="name">{{ val.label }}：{{ val.sum }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { isNumber, values } from 'lodash'
import { useableProps } from './config'
import render from './render.js'
const isEmpty = data => data === null || data === undefined || data === ''
// useableProps —— 需要的组件属性 很多属性在表格中没用 需要过滤
export default {
  name: 'fc-input-table',
  props: {
    config: {
      type: Object,
      default: () => {}
    },
    value: {
      type: Array,
      default: () => []
    },
    formData: Object,
    labelWidth: String,
    formSize: String
  },
  data() {
    return {
      bankTimer: null,
      timer1: null,
      timer: null,
      tableFormData: [],
      tableData: [],
      listSummation: {},
      isAddRow: true // list类型下 添加行数据 number类型组件会进行校验 产生不需要的结果 在这里进行添加行数据判断 hack
    }
  },
  computed: {
    code() {
      return this.getFormData('code')
    },
    //审批中是否允许查看/编辑费用归类
    showEditFeeType() {
      return this.getFormData('showEditFeeType')
    },
    showEditPaidAccount() {
      //审批中是否允许查看/编辑打款账户
      return this.getFormData('showEditPaidAccount')
    }
  },
  watch: {
    // formData(val) {
    // },
    // value: {
    //   handler: function(data) {
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  created() {
    let that = this
    setTimeout(function() {
      that.tableData = that.config.type === 'table' ? that.filterProps() : that.config.children
      if (that.value && that.value.length) {
        that.value.forEach(t => that.addRow(t))
      } else {
        that.addRow()
      }
    }, 500)
  },

  methods: {
    getFormData(flag) {
      var root = this.$parent
      while (root) {
        if (flag in root) {
          return root[flag]
        }
        root = root.$parent
      }
    },
    clearAddRowFlag() {
      this.$nextTick(() => {
        this.isAddRow = false
      })
    },
    /**
     * @event cell-click Table 单元格点击事件
     * 点击单元格 聚焦单元格中的input
     */
    focusInput(row, column, cell, event) {
      const child = cell.querySelector('.cell').firstElementChild
      const input = child && child.querySelector('input')
      input && input.focus()
    },
    /**
     * 过滤不需要的组件配置， 表格中的组件需要统一样式
     */
    filterProps() {
      const conf = this.config.children
      if (!conf) return []
      const getUseableProp = item => useableProps.find(t => t.tag === item.tag)
      return conf.map(t => {
        const useable = getUseableProp(t)
        const res = useable ? useable.props.reduce((r, key) => ((r[key] = t[key]), r), {}) : t
        return useable.forceProp ? Object.assign({}, res, useable.forceProp) : res
      })
    },

    onFormDataChange(rowIndex, colIndex, tag, head) {
      if (this.isAddRow) return
      const data = this.tableFormData[rowIndex][colIndex]
      data.required && (data.valid = this.checkData(data, rowIndex))
      this.tableFormData.forEach((items, indexs) => {
        this.$set(this.tableFormData, indexs, JSON.parse(JSON.stringify(items)))
      })
      if (['fc-amount', 'el-input-number', 'fc-condition', 'fc-calculate', 'fc-total-money', 'fc-uploadFile'].includes(tag)) {
        if (this.config.type === 'list') {
          this.getListSummaries()
        }
      }
      if (!['fc-condition', 'fc-calculate'].includes(tag)) {
        // 金额变动 更新数据 触发计算公式更新
        const newVal = this.tableFormData.map(row => row.reduce((p, c) => ((p[c.vModel] = c.value), p), {}))
        this.$emit('input', newVal)
      }
    },
    /**
     * 校验单个表单数据
     * @param {CmpConfig} 组件配置对象
     */
    checkData(col, index) {
      let { tag, value, label } = col
      if (tag == 'fc-total-money') return true
      if ([null, undefined, ''].includes(value)) return false
      if (tag === 'fc-select-feeType') return this.checkOrgData(col, index)
      if (tag === 'fc-select-finance') return this.checkBankData(col)
      if (tag === 'fc-input-verify') return true
      if (Array.isArray(value)) return value.length > 0
      return true
    },
    notifyText(name) {
      this.$notification['error']({
        message: '系统通知',
        description: `${name}不能为空`
      })
    },
    /**
     * 对拆分数据单独校验
     */
    checkOrgData(data, index) {
      let that = this
      let { value, vModel, bindPrice } = data
      let { finSpendingItemSplits } = value
      // if (!this.showEditFeeType) {
      let totalMoney = this.tableFormData[index].filter(item => item.vModel == bindPrice.split('.')[1])[0]
      let flag = true
      if (Array.isArray(finSpendingItemSplits) && finSpendingItemSplits.length > 0) {
        let splitPrice = finSpendingItemSplits.reduce((sum, row) => sum + parseFloat(row.splitPrice), 0)
        if (splitPrice && parseFloat(splitPrice).toFixed(2) !== parseFloat(totalMoney.value).toFixed(2)) {
          this.$notification['error']({
            message: '系统通知',
            description: `拆分金额的和必须等于总金额`
          })
          return false
        }
        finSpendingItemSplits.forEach(item => {
          let total = 0
          if (Array.isArray(item.spendingSplits) && item.spendingSplits.length > 0) {
            total = item.spendingSplits.reduce((sum, row) => sum + parseFloat(row.price), 0)
          }
          if (total && parseFloat(total).toFixed(2) != parseFloat(item.splitPrice).toFixed(2)) {
            flag = false
            return
          }
        })
      }
      if (!flag) {
        this.$notification['error']({
          message: '系统通知',
          description: `分摊金额的和必须等于拆分金额`
        })
        return false
      }
      if (this.showEditFeeType) {
        const isArray = Array.isArray
        if (!finSpendingItemSplits || !isArray(finSpendingItemSplits)) return false
        let count = finSpendingItemSplits.length
        let checkCol = true
        finSpendingItemSplits.forEach(col => {
          if (!col.feeItemName || !col.financeName || !col.operateName) {
            checkCol = false
          }
        })
        //验证单据只能存在一种费用类型
        let splitDAata = []
        let splitPriceData = []
        this.tableFormData.forEach(item => {
          let total = item.filter(row => row.vModel == data.bindPrice.split('.')[1])[0].value
          item.forEach(col => {
            if (col.vModel == vModel) {
              splitDAata.push(col.value.bindTypePrice)
              let splitPrice = col.value.finSpendingItemSplits.reduce((sum, row) => sum + row.splitPrice, 0)
              splitPriceData.push({
                total,
                splitPrice
              })
            }
          })
        })

        let bindTypePrice = splitDAata[0]
        splitDAata.forEach(col => {
          if (col != bindTypePrice) {
            if (this.timer1) clearTimeout(this.timer1)
            this.timer1 = setTimeout(function() {
              that.$notification['error']({
                message: '系统通知',
                description: `单据只能存在一种费用类型`
              })
            }, 200)
            checkCol = false
            return false
          }
        })
        //验证拆分金额必须等于总金额
        // splitPriceData.forEach(col => {
        //   if (col.total != col.splitPrice) {
        //     if (this.timer) clearTimeout(this.timer)
        //     this.timer = setTimeout(function() {
        //       that.$notification['error']({
        //         message: '系统通知',
        //         description: `拆分金额必须等于总金额`
        //       })
        //     }, 200)
        //     checkCol = false
        //     return false
        //   }
        // })
        return count > 0 && checkCol
      } else {
        return true
      }
    },
    /**
     * 对打款账户数据单独校验
     */
    checkBankData(data) {
      let { value, tag, vModel } = data
      let that = this
      const isArray = Array.isArray
      let isCheck = true //非明细是否填了数据
      let isIncheck = true //明细是否填了数据
      //获取明细外面的付款分馆
      let paidBranchListOut = []
      if (this.formData[vModel] && this.formData[vModel].data) paidBranchListOut = this.formData[vModel].data
      //判断银行是否填了
      if (this.showEditPaidAccount) {
        //判断非明细付款分馆是否填了银行
        let schoolId = this.$route.params.schoolId != '0' ? this.$route.params.schoolId : null
        if (schoolId) {
          this.tableFormData.forEach(item => {
            item.forEach(col => {
              if (col.vModel == vModel) {
                paidBranchListOut = [...paidBranchListOut, ...col.value.data]
              }
            })
          })
          paidBranchListOut.forEach(item => {
            if (item.school && item.school.branchId == schoolId) {
              if (!item.bank || !item.bank.id) {
                isCheck = false
                isIncheck = false
                return false
              }
            }
          })
        } else {
          paidBranchListOut.forEach(item => {
            if (!item.bank || !item.bank.id) isCheck = false
          })
          //如果非明细分馆没填银行，则判断明细付款分馆是否填了银行
          if (!isCheck) {
            if (!value.data || !isArray(value.data)) return false
            value.data.forEach(col => {
              if (!col.bank || !col.bank.id) isIncheck = false
            })
            return isIncheck
          }
        }
      } else {
        //判断分馆和金额是否填了
        //非明细
        let totalPriceOut = 0
        let totalPrice = 0
        paidBranchListOut.forEach(item => {
          if (!item.school || !item.school.id) isCheck = false
          totalPriceOut += item.money
        })
        if (isCheck) {
          this.tableFormData.forEach(item => {
            let total = item.filter(row => row.vModel == data.bindPrice.split('.')[1])[0].value
            totalPrice += total
          })
          if (totalPrice == totalPriceOut) {
            isCheck = true
          } else {
            isCheck = false
          }
          if (isCheck) {
            value.data.forEach(col => {
              if (col.school && col.school.id) isCheck = false
            })
          }
          if (!isCheck) {
            this.$notification['error']({
              message: '系统通知',
              description: `明细付款分馆和外部付款分馆二选一填!`
            })
          }
        } else if (!isCheck) {
          if (!value.data || !isArray(value.data)) {
            isCheck = false
            return false
          }
          value.data.forEach(col => {
            if (!col.school || !col.school.id) isIncheck = false
          })
          if (isIncheck) {
            let splitPriceData = []
            this.tableFormData.forEach(item => {
              let total = item.filter(row => row.vModel == data.bindPrice.split('.')[1])[0].value
              item.forEach(col => {
                if (col.vModel == vModel) {
                  let money = col.value.data.reduce((sum, row) => sum + row.money, 0)
                  splitPriceData.push({
                    total,
                    money
                  })
                }
              })
            })
            //验证金额必须等于总金额
            splitPriceData.forEach(col => {
              if (col.total != col.money) {
                isIncheck = false
              }
            })
          }
          if (!isIncheck) {
            if (this.bankTimer) clearTimeout(this.bankTimer)
            this.bankTimer = setTimeout(function() {
              that.$notification['error']({
                message: '系统通知',
                description: `付款金额必须等于总金额`
              })
            }, 200)
          }
          return isIncheck
        }
      }
      return isCheck
    },
    checkInputVerify() {
      let all = []
      let vModel = null
      this.tableFormData.forEach((row, rowIndex) =>
        row.forEach(col => {
          if (col.tag === 'fc-input-verify') vModel = col.vModel
        })
      )
      if (vModel) {
        if (this.config.tag === 'fc-input-table') {
          let inputVerify = this.config.children.find(d => d.vModel === vModel)
          let refs = this.$refs[inputVerify.vModel]
          if (Array.isArray(refs) && refs.length > 0) {
            refs.forEach(ref => {
              if (ref && ref.checkValue) all.push(ref.checkValue(false))
            })
          }
        }
      }
      return Promise.all(all)
    },
    /**
     * 校验表格数据必填项
     */
    submit() {
      let res = true
      let that = this
      // const checkCol = (col, index) => {
      //   !col.hidden && col.required && !this.checkData(col, index) && (res = col.valid = false)
      // }
      this.tableFormData.forEach((row, rowIndex) =>
        row.forEach(col => {
          !col.hidden && col.required && !this.checkData(col, rowIndex) && (res = col.valid = false)
        })
      )
      let flag = res ? this.tableFormData.map(row => row.reduce((p, c) => ((p[c.vModel] = c.value), p), {})) : false
      try {
        this.tableFormData.forEach((item, index) => {
          item.forEach(col => {
            if (!col.valid) {
              this.$notification['error']({
                message: '系统通知',
                description: `请填写${col.label}`
              })
              document.querySelector(`#${col.vModel}${index}`).scrollIntoView(true)
              throw new Error('end') //跳出循环
            }
          })
        })
      } catch (e) {
      }
      // if (!flag) {
      //   this.$notification['error']({
      //     message: '系统通知',
      //     description: `请填写完整的表格信息!`
      //   })
      // }
      return flag
    },
    /**
     * 根据formid获取完整组件配置
     */
    getConfById(formId) {
      let item = this.tableData.find(t => t.formId === formId)
      return Object.assign({ parentModel: this.config.vModel }, item)
    },
    /**
     * 获取默认行数据
     */
    getEmptyRow(val) {
      return this.tableData.map(t => {
        let defaultValue = isEmpty(t.defaultValue) ? '' : t.defaultValue
        let res = {
          label: t.label,
          tag: t.tag,
          formId: t.formId,
          options: t.options || null, // 下拉 单选 多选
          valid: true,
          vModel: t.vModel || null,
          required: t.required || null,
          hidden: t.hidden || null,
          style: t.style || null,
          'min-width': t['min-width'],
          value: val ? (val[t.vModel] === 0 ? 0 : val[t.vModel] || JSON.parse(JSON.stringify(defaultValue))) : JSON.parse(JSON.stringify(defaultValue)),
          uploadFileType: t.uploadFileType || null,
          approverBranchId: t.approverBranchId || null,
          bindInvoice: t.bindInvoice || null,
          bindPrice: t.bindPrice || null
        }
        return res
      })
    },
    setData() {
      this.tableFormData.forEach((items, indexs) => {
        this.$set(this.tableFormData, indexs, items)
      })
      if (this.config.type === 'list') {
        this.getListSummaries()
      }
      // 金额变动 更新数据 触发计算公式更新
      const newVal = this.tableFormData.map(row => row.reduce((p, c) => ((p[c.vModel] = c.value), p), {}))
      this.$emit('input', newVal)
    },
    removeRow(index) {
      this.tableFormData.splice(index, 1)
      this.setData()
    },

    addRow(val) {
      this.isAddRow = true
      if (!Array.isArray(this.tableFormData)) {
        this.tableFormData = []
      }
      this.tableFormData.push(JSON.parse(JSON.stringify(this.getEmptyRow(val))))
      this.clearAddRowFlag()
    },

    getCmpValOfRow(row, key) {
      // 获取数字相关组件的输入值
      const isNumCmp = tag => ['fc-amount', 'el-input-number', 'el-slider', 'fc-total-money'].includes(tag)
      const target = row.find(t => t.vModel === key)
      if (!target) return NaN
      if (isNumCmp(target.tag)) return target.value || 0
      return NaN
    },

    getListSummaries() {
      this.tableData.forEach(row => {
        const isNumCmp = tag => ['fc-amount', 'el-input-number', 'el-slider', 'fc-total-money'].includes(tag)
        if (!isNumCmp(row.tag)) return
        const sum = this.tableFormData.reduce((sum, d) => sum + this.getCmpValOfRow(d, row.vModel), 0)
        this.$set(this.listSummation, row.vModel, {
          label: row.label,
          sum: sum.toFixed(2)
        })
      })
    },
    /**
     * 对表格进行合计 目前只支持数字，金额，滑块
     */
    getTableSummaries(param) {
      const { columns, data } = param
      const sums = []
      if (this.tableData.length + 1 !== columns.length) return [] // 防止多次加载
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const sumVal = data.reduce((sum, d) => sum + this.getCmpValOfRow(d, column.property), 0)
        sums[index] = Number.isNaN(sumVal) ? '' : sumVal
      })
      return sums
    },

    onUploadSuccess(response, target) {
      !Array.isArray(target.value) && (target.value = [])
      target.value.push(response)
    },

    showUploadList(ev) {
      const btn = ev.currentTarget
      const { offsetX, clientX, clientY, offsetY } = ev
      const list = btn.querySelector('.el-upload-list--text')
      list && list.classList.add('show')
      const unit = v => v + 'px'
      list.style.left = unit(clientX - offsetX)
      list.style.top = unit(clientY - offsetY + btn.clientHeight)
    },

    hideUploadList(ev) {
      const btn = ev.currentTarget
      const list = btn.querySelector('.el-upload-list--text')
      list && setTimeout(() => list.classList.remove('show'), 500)
    },

    reset() {
      this.tableData.map(t => {
        let index = this.tableFormData[0].findIndex(c => c.vModel === t.vModel)
        if (index === -1) return
        for (let i = 0; i < this.tableFormData.length; i++) {
          this.tableFormData[i][index].value = JSON.parse(JSON.stringify())
        }
      })
    }
  },

  components: {
    render
  }
}
</script>
<style lang="stylus" scoped>
/deep/.el-radio__input.is-checked .el-radio__inner {
    border-color: #1ba97b;
    background: #1ba97b;
}
/deep/.el-radio__input.is-checked+.el-radio__label {
    color:  #1ba97b;
}
/deep/.el-radio__inner:hover {
    border-color: #1ba97b;
}
/deep/.el-textarea__inner:focus {
    outline: 0;
    border-color: #1ba97b;
}
.cursor{
        cursor pointer
}
.fc-table-box
  margin-bottom 0px
  .row-action
    display flex
    justify-content center
    align-items center
    .el-icon-delete
      display none
      cursor pointer

  .actions
    text-align center
    border-top none
    color:#1BA97B;
    font-weight:500;
    cursor pointer
  .list-summary
    line-height 24px
    overflow hidden
    border-top none
    min-width:100px;



  &.list
    .list-row
      padding 10px
      text-align left
      // border-bottom: 1px solid #e5e5e5
      box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 6px 0px;
      border-radius:4px;
      position relative
      // &:hover .delete-btn
      //   display block
      .delete-btn
        //  display block
        // position absolute
        // right 10px
        // top 20px
        // z-index 999
        cursor pointer
        // display none
        &:hover
          color #000
      .row-item
        margin-bottom 18px
        position relative
        &.error
          .error-tip
            top 90%
            z-index 1
          >>> .el-input__inner
            border-color #F56C6C
        > div
          &:first-child
            text-align right
            vertical-align middle
            float left
            font-size 14px
            color #606266
            line-height 32px
            padding 0 12px 0 0
            box-sizing border-box
    .error-tip
      font-size 12px
      padding-left 6px
      color #f56c6c
      position absolute
      left 100px
      top 0
      z-index -1
      transition bottom .3s
      min-height auto


.fc-table-box.table >>>

  // 索引和删除按钮切换
  .el-table__row:hover
    .index
      display none
    .el-icon-delete
      display inline

  // 去除输入框边框
  .el-input__inner, .el-textarea__inner
    width 100%
    border none
    text-align left
    padding-right 10px
    padding-left 10px
  .el-date-editor
    .el-input__prefix
      left -10px
      top 1px
    .el-input__suffix
      top 1px
      right 0
  .el-input-number
    width 100%

  // 下载按钮
  .el-upload--text
    width 100%
    height 100%
    padding-top 6px
    white-space nowrap

  // 组织机构按钮
  .input-box
    border none !important
    min-height 40px !important
    padding-left 0 !important

  .el-table .el-table__body
    td
      padding 0
      background #FFF !important
      .error-tip
        font-size 12px
        padding-left 6px
        color #f56c6c
      .cell
        position relative
        > div
          width 100%
          min-height 40px

    td:not(:first-child)
      vertical-align top
      &::after, &::before
        content ""
        width 10px
        height 10px
        background white
        position absolute
        border 2px solid transparent
        transition border-color .3s

      &::after
        border-top none
        border-right none
        left 0
        bottom 0

      &::before
        border-bottom none
        border-left none
        right 0
        top 0

      &:hover
        &::after, &::before
          border-color red

  .fc-org-select
    position relative

  .el-slider
    padding-left 10px

  .el-upload-list--text
    position fixed
    margin-left -6px
    background white
    box-shadow 2px 2px 8px 2px rgba(0, 0, 0, .1)
    max-width 250px
    transition margin-top .3s
    display none
    z-index 9
    &.show
      display block
</style>
