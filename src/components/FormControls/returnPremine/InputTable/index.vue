<template>
  <div class="fc-table-box" :class="[config.type]">
    <template v-if="config.type === 'list'">
      <a-card class="mt20 ">
        <div class="tab_title">
          <span>学员信息</span>
        </div>
        <div>
          <div v-for="(row, rindex) in tableFormData" :key="rindex" class="list-row">
            <a-row>
              <a-col
                v-for="(conf, cindex) in config.children"
                :key="cindex"
                class="row-item"
                :class="{ error: !tableFormData[rindex][cindex].valid }"
                :span="conf.span"
                :style="conf.tag == 'fc-return-student' ? 'padding-bottom:18px;' : ''"
                v-show="conf.tagType == 'conponent'"
              >
                <!-- -->
                <!-- <div v-show="conf.tagType == 'conponent'" :style="{ width: labelWidth }">
                  <span style="color: #f56c6c;" v-if="conf.required">*</span>
                  {{ conf.label }}
                </div> -->
                <!-- v-show="studentInfo || conf.tagType == 'conponent'" -->
                <div
                  v-show="conf.tagType == 'conponent'"
                  :style="{ 'margin-left': conf.tag == 'fc-return-student' ? 0 : conf.labelWidth ? conf.labelWidth : '120px' }"
                >
                  <component
                    v-if="conf.tagType == 'conponent'"
                    :is="conf.tag"
                    :rowIndex="rindex"
                    v-model="tableFormData[rindex][cindex].value"
                    v-bind="getConfById(conf.formId)"
                    :formData="formData"
                    @change="onFormDataChange(rindex, cindex, conf, $event)"
                  >
                  </component>
                  <render
                    v-else
                    :formData="formData"
                    :conf="Object.assign({ rowIndex: rindex }, conf)"
                    :size="formSize"
                    :value="tableFormData[rindex][cindex]"
                    :key="conf.renderKey"
                    style="max-width: 350px;"
                    @input="
                      payload => {
                        $set(tableFormData[rindex][cindex], 'value', payload)
                        onFormDataChange(rindex, cindex, conf)
                      }
                    "
                  />
                </div>
                <span class="error-tip">
                  不能为空
                </span>
              </a-col>
            </a-row>
            <a-row>
              <a-col
                v-for="(conf, cindex) in config.children"
                :key="cindex"
                :span="conf.span"
                v-show="studentInfo && conf.tagType != 'conponent' && conf.vModel != 'performanceList'"
                class="student mb10"
              >
                <div style="text-align:right;" :style="{ width: conf.labelWidth ? conf.labelWidth : '120px' }">{{ conf.label }}：</div>
                <div>
                  {{ tableFormData[rindex][cindex].value }}
                </div>
              </a-col>
            </a-row>
          </div>
        </div>
      </a-card>

      <a-card class="mt20 " v-show="performanceList && !hidden">
        <div class="tab_title">
          <span>{{ title }}</span>
        </div>
        <div v-if="performanceList && performanceList.length > 0">
          <div class="mt20" v-for="item in performanceList" :key="item.id">
            <a-card>
              <a-row>
                <a-col class="mb10" :span="12"> 缴费业绩员工：{{ item.employName }}-{{ formatePosition(item.employRole) }} </a-col>
                <a-col class="mb10" :span="12"> 缴费业绩分馆：{{ item.branchName }} </a-col>
                <a-col class="mb10" :span="12"> 缴费业绩金额：{{ item.money }} </a-col>
                <a-col class="mb10" :span="12"> 缴费业绩比例：{{ item.proportion ? Number(item.proportion) * 100 : 0 }}% </a-col>
              </a-row>
            </a-card>
          </div>
        </div>
        <a-empty v-else />
      </a-card>
    </template>
    <!-- <div class="list-summary" v-if="config.type === 'list' && config['show-summary']">
      <div style="padding:6px 12px;float:left;">合计</div>
      <div style="overflow: hidden;padding-top: 6px;;">
        <div v-for="(val, name) in listSummation" :key="name">{{ val.label }}：{{ val.sum }}</div>
      </div>
    </div> -->
    <!-- <div class="actions">
      <el-button @click="addRow" type="text">
        <i class="el-icon-plus"></i>
        {{ config.actionText }}
      </el-button>
    </div> -->
  </div>
</template>
<script>
import { useableProps } from './config'
import render from './render.js'
// useableProps —— 需要的组件属性 很多属性在表格中没用 需要过滤
export default {
  name: 'fc-input-student',
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
      hidden: false,
      studentInfo: null,
      performanceList: [],
      tableFormData: [],
      tableData: [],
      listSummation: {},
      title: '',
      isAddRow: true // list类型下 添加行数据 number类型组件会进行校验 产生不需要的结果 在这里进行添加行数据判断 hack
    }
  },

  created() {
    this.tableData = this.config.type === 'table' ? this.filterProps() : this.config.children
    this.tableData.forEach(item => {
      if (item.vModel == 'performanceList') {
        this.hidden = item.hidden
        this.title = item.label
      }
    })
    if (this.value && this.value.length) {
      this.studentInfo = true
      this.value.forEach(t => this.addRow(t))
      if (this.value[0].performanceList) this.performanceList = this.sortArr(this.value[0].performanceList)
    } else {
      this.addRow()
    }
  },
  watch: {
    config: {
      handler: function(val) {
        if (!val) return
        if (this.config.children && this.config.children.length > 0) {
          this.config.children.forEach(item => {
            if (item.tag != 'fc-return-student') {
              item.readonly = true
              item.disabled = true
            }
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    sortArr(arr) {
      if (Array.isArray(arr) && arr.length > 0) {
        let arrList = arr.sort((a, b) => {
          return a.employRole - b.employRole
        })
        return arrList
      } else {
        return []
      }
    },
    formatePosition(employRole) {
      let name = employRole === 'A' ? '客服' : employRole === 'C' ? '导师' : employRole === 'B' ? '顾问' : '其他员工'
      return name
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

    onFormDataChange(rowIndex, colIndex, conf, e) {
      if (conf.tag == 'fc-return-student') {
        this.config.children.forEach((item, index) => {
          if (item.tag == 'fc-return-student') {
            let value = { memberId: e.member.memberId, memberCourseId: e.memberCourse.memberCourseId, employPerformanceDTOS: e.performanceList }
            item.value = value
            this.tableFormData[0][index].value = Array.isArray(value) ? JSON.stringify(value) : value
          } else {
            let keys = item.vModel?.split('_')
            let value = e
            for (let key of keys) {
              if (value) {
                value = value[key]
              }
            }
            item.value = Array.isArray(value) ? JSON.stringify(value) : value
            this.tableFormData[0][index].value = Array.isArray(value) ? JSON.stringify(value) : value
            if (item.vModel == 'performanceList') {
            }
          }

          this.tableFormData[0][index].valid = true
        })
        this.performanceList = this.sortArr(e.performanceList)
        this.studentInfo = e
      }
      const newVal = this.tableFormData.map(row => row.reduce((p, c) => ((p[c.vModel] = c.value), p), {}))
      this.$emit('input', newVal)
    },
    getFormData() {
      var root = this.$parent
      while (root) {
        if ('vmFormData' in root) {
          return root.vmFormData
        }
        root = root.$parent
      }
    },
    /**
     * 获取指定组件的值
     */
    getFormVal(vModel) {
      try {
        if (vModel.indexOf('.') > -1) {
          let [tabelVModel, cmpVModel] = vModel.split('.')
          return this.rootFormData[tabelVModel].reduce((sum, c) => (c[cmpVModel] || 0) + sum, 0)
        }
        return this.rootFormData[vModel] || 0
      } catch (error) {
        console.warn('计算公式出错, 可能包含无效的组件值', error)
        return 0
      }
    },
    /**
     * 校验单个表单数据
     * @param {CmpConfig} 组件配置对象
     */
    checkData({ tag, value }) {
      if ([null, undefined, ''].includes(value)) return false
      if (tag === 'fc-org-select') return this.checkOrgData(value)
      if (Array.isArray(value)) return value.length > 0
      return true
    },
    /**
     * 对组织机构部门控数据单独校验
     */
    checkOrgData(data) {
      const isArray = Array.isArray
      if (typeof data !== 'object' || isArray(data)) return false
      let count = 0
      for (let key in data) {
        count += isArray(data[key]) ? data[key].length : 0
      }
      return count > 0
    },
    /**
     * 校验表格数据必填项
     */
    submit() {
      let res = true
      const checkCol = col => col.required && !this.checkData(col) && (res = col.valid = false)
      this.tableFormData.forEach(row => row.forEach(checkCol))
      return res ? this.tableFormData.map(row => row.reduce((p, c) => ((p[c.vModel] = c.value), p), {})) : false
    },
    /**
     * 根据formid获取完整组件配置
     */
    getConfById(formId) {
      return this.tableData.find(t => t.formId === formId)
    },
    /**
     * 获取默认行数据
     */
    getEmptyRow(val) {
      return this.tableData.map(t => {
        let res = {
          tag: t.tag,
          formId: t.formId,
          value: val ? val[t.vModel] : t.defaultValue,
          options: t.options, // 下拉 单选 多选
          valid: true,
          vModel: t.vModel,
          required: t.required
        }
        if (t.tag === 'el-upload') this.$set(res, 'value', t.defaultValue)
        return res
      })
    },

    removeRow(index) {
      this.tableFormData.splice(index, 1)
    },

    addRow(val) {
      this.isAddRow = true
      if (!Array.isArray(this.tableFormData)) {
        this.tableFormData = []
      }
      this.tableFormData.push(this.getEmptyRow(val))
      this.clearAddRowFlag()
    },

    getCmpValOfRow(row, key) {
      // 获取数字相关组件的输入值
      const isNumCmp = tag => ['fc-amount', 'el-input-number', 'el-slider'].includes(tag)
      const target = row.find(t => t.vModel === key)
      if (!target) return NaN
      if (isNumCmp(target.tag)) return target.value || 0
      return NaN
    },

    getListSummaries() {
      this.tableData.forEach(row => {
        const isNumCmp = tag => ['fc-amount', 'el-input-number', 'el-slider'].includes(tag)
        if (!isNumCmp(row.tag)) return
        const sum = this.tableFormData.reduce((sum, d) => sum + this.getCmpValOfRow(d, row.vModel), 0)
        this.$set(this.listSummation, row.vModel, {
          label: row.label,
          sum
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
          this.tableFormData[i][index].value = t.defaultValue
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
    border 1px solid #EBEEF5
    border-top none
  .list-summary
    line-height 24px
    overflow hidden
    border 1px solid #e5e5e5
    border-top none



  &.list
    .list-row
      padding 18px 0 10px
      text-align left
      // border-bottom: 1px solid #e5e5e5
      position relative
      &:hover .delete-btn
        display block
      .delete-btn
        position absolute
        right 10px
        top 20px
        z-index 999
        cursor pointer
        display none
        &:hover
          color #000
      .student
          display:flex
      .row-item
        padding-bottom 18px
        position relative
        &.error
          .error-tip
            top 74%
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
      .el-input-number .el-input__inner {
    text-align: left;
}
.el-input.is-disabled .el-input__inner {
    background-color: #ffffff;
    border-color: #ffffff;
    color: #000;
    cursor: not-allowed;
}
</style>
