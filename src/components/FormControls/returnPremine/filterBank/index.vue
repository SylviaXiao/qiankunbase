<template>
  <div class="fc-filter-bank">
    <!-- <treeSelect v-bind="$props" ref="treeSelect" @handleInput="handleInput" @handlefocus="handlefocus" :option="option"></treeSelect> -->
    <a-tree-select
      style="width: 100%"
      v-model="innerValue"
      :show-search="option.search"
      treeNodeFilterProp="title"
      :placeholder="option.placeholder"
      treeDefaultExpandAll
      :allowClear="option.allowClear"
      :multiple="option.multiple"
      :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
      :treeData="deptTree"
      @change="handleInput"
      :disabled="disabled"
      @focus="handlefocus"
    />
  </div>
</template>
<script>
import { listBankByDeptId, pageListBankByDept } from '@/api/workFlow/request.js'
import treeSelect from '../../treeSelect/index'
import Vue from 'vue'
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: [
    'label',
    'value',
    'cmpType',
    'tag',
    'tagIcon',
    'precision',
    'disabled',
    'labelWidth',
    'step-strictly',
    'controls',
    'controls-position',
    'regList',
    'changeTag',
    'proCondition',
    'formId',
    'renderKey',
    'layout',
    'bindPrice',
    'formData',
    'defaultType',
    'rowIndex'
  ],
  name: 'fc-filter-bank',
  components: { treeSelect },
  data() {
    return {
      deptTree: [], //所有分馆列表
      innerValue: this.value && this.value.id ? this.value.id : '',
      option: {
        disabled: false,
        placeholder: `请选择${this.label}`,
        search: true,
        string: this.label,
        key: 'branch',
        allowClear: true,
        apiOption: {
          api: listBankByDeptId, // promise类型的接口
          string: 'bankNo',
          value: 'id',
          childString: 'bankNo',
          childValue: 'id',
          params: {}
        }
      }
    }
  },
  watch: {
    formData: {
      handler: function(val) {
        if (!val) return
        // formData更新可能比较频繁
        if (this.bindPrice) {
          let unit = this.getFormVal(this.bindPrice)
          if (unit) {
            unit = unit.id
          } else {
            this.deptTree = []
            unit = ''
            this.innerValue = ''
          }
          if (
            (this.option.apiOption.params.schoolId != undefined || this.option.apiOption.params.schoolId != null) &&
            unit != this.option.apiOption.params.schoolId
          ) {
            this.handleInput('')
          }
          this.init(unit)
        }
      },
      deep: true,
      immediate: true
    },
    defaultType(defaultType) {
      this.initBranch()
    },
    value: {
      handler: function(val) {
        if (val) {
          this.innerValue = val.id
        } else {
          this.innerValue = ''
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.initBranch()
    if (!this.bindPrice) {
      this.option.apiOption.params = {
        page: 0,
        limit: 0
      }
      this.initTreeData()
    } else {
      this.init('')
    }
  },
  computed: {
    rootFormData() {
      return this.formData || this.getFormData('vmFormData')
    },
    procinstId() {
      return this.getFormData('procinstId')
    }
  },
  methods: {
    initBranch(data) {
      if (this.defaultType == 'approver') {
        this.option.apiOption.api = data ? listBankByDeptId : pageListBankByDept
        this.option.apiOption.params.page = 0
        this.option.apiOption.params.limit = 0
        this.option.apiOption.params.procinstId = data ? this.procinstId : null
      } else {
        this.option.apiOption.api = listBankByDeptId
      }
    },
    init(data) {
      this.option.apiOption.params.schoolId = data ? data : null
      if (data) {
        this.initBranch(data)
        this.initTreeData()
      }
    },
    handlefocus() {
      if (this.bindPrice) {
        let price = this.getFormVal(this.bindPrice)
        this.price = price
        if (!price) {
          return this.$notification['error']({
            message: '系统通知',
            description: '请先选择转入校区'
          })
        }
      }
    },
    getFormData(flag) {
      var root = this.$parent
      while (root) {
        if (flag in root) {
          return root[flag]
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
          if (typeof this.rowIndex === 'number') {
            return this.rootFormData[tabelVModel][this.rowIndex][cmpVModel] || 0
          } else {
            return this.rootFormData[tabelVModel].reduce((sum, c) => (c[cmpVModel] || 0) + sum, 0)
          }
        }
        return this.rootFormData[vModel] || 0
      } catch (error) {
        console.warn('计算公式出错, 可能包含无效的组件值', error)
        return 0
      }
    },
    onTreeSearch(inputValue, path) {
      let { string, childString } = this.option.apiOption
      if (path.data.props[string]) {
        return path.data.props[string].indexOf(inputValue) > -1
      } else {
        return path.data.props[childString].indexOf(inputValue) > -1
      }
    },
    initTreeData() {
      let { api, params, string, value, childString, childValue, formatData } = this.option.apiOption
      api(Object.assign({}, params)).then(res => {
        let data = typeof formatData === 'function' ? formatData(res) : res.data
        if ((res.code === 200 || res.code === '200') && data) {
          this._handleTreeData(data, string, value, childString, childValue)
          this.deptTree = data
        } else {
          this.deptTree = []
        }
      })
    },
    _handleTreeData(data, type1, type2, type3, type4) {
      data.forEach((item, index) => {
        item.title = item[type1] || ''
        item.value = item[type2]
        item.key = item[type2]
        if (item.children && item.children.length > 0) {
          if (this.option.disabled) {
            item.selectable = false
            item.disabled = true
          }
          this._handleTreeData(item.children, type3, type4, type3, type4)
        }
      })
    },
    handleInput(val, data, extra) {
      if (val) {
        let data = extra.triggerNode.dataRef
        this.$emit('change', {
          id: data.id,
          name: data.bankNo,
          bankName: data.bankName || '',
          bankCardNo: data.bankCardNo || '',
          companyName: data.companyName
        })
      } else {
        this.$emit('change', '')
      }
    }
  }
}
</script>
<style lang="stylus" scoped></style>
