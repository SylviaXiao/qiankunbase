<template>
  <div class="fc-select-costType">
    <a-select
      :disabled="disabled || bindTypePrice == 'A'"
      :value="innerValue"
      :placeholder="`请选择${label}`"
      style="width: 100%;"
      :default-active-first-option="false"
      :show-arrow="false"
      option-filter-prop="children"
      :filter-option="filterOption"
      show-search
      :not-found-content="null"
      @change="handleInput"
      :allowClear="true"
      @focus="isFeename"
      :class="required && !innerValue ? 'error' : ''"
    >
      <a-select-option v-for="d in deptTree" :key="d.value" :value="d.value">
        {{ d.name }}
      </a-select-option>
    </a-select>
  </div>
</template>
<script>
import { listFeeItem } from '@/api/workFlow/request.js'
import treeSelect from '../../treeSelect/index'
let defaultParams = { inctype: 'A', feeItemName: '', financeName: '', operateName: '' }
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: [
    'required',
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
    'formData',
    'bindPrice',
    'bindTypePrice',
    'defaultType',
    'approveType',
    'rowIndex' // 计算公式放在表格中时， 需要获取在表格中的行位置
  ],
  name: 'fc-select-costType',
  components: { treeSelect },
  data() {
    return {
      bindUnit: null,
      selectlabel: '',
      deptTree: [],
      deptTreePre: [],
      unit: null, //所有单位列表
      innerValue: this.value && this.value.id ? this.value.id : '',
      option: {
        placeholder: `请选择${this.label}`,
        search: true,
        string: this.label,
        key: 'costType',
        allowClear: true,
        apiOption: {
          string: 'feeItemName',
          value: 'id',
          params: JSON.parse(JSON.stringify(defaultParams))
        }
      }
    }
  },
  created() {
    this.selectlabel = this.defaultType == 'financeName' ? '费用归类' : this.defaultType == 'operateName' ? '财务归类' : '经营归类'
  },
  computed: {
    rootFormData() {
      return this.formData || this.getFormData()
    }
  },
  methods: {
    unique(arr, a) {
      // 缓存用于记录
      const arr1 = []
      for (const t of arr) {
        // 检查缓存中是否已经存在
        if (arr1.find(c => c[a] === t[a])) {
          // 已经存在说明以前记录过，现在这个就是多余的，直接忽略
          continue
        }
        // 不存在就说明以前没遇到过，把它记录下来
        arr1.push(t)
      }
      // 记录结果就是过滤后的结果
      return arr1
    },
    initTreeData() {
      let unit = this.unit
      if (this.apiType != '财务收支') {
        this.option.apiOption.params.feeItemName = unit.feeItemName
        if (this.defaultType == 'operateName') {
          this.option.apiOption.params.financeName = unit.financeName
        } else if (this.defaultType == 'costName') {
          this.option.apiOption.params.financeName = unit.financeName
          this.option.apiOption.params.operateName = unit.operateName
        }
      } else {
        this.option.apiOption.params = JSON.parse(JSON.stringify(defaultParams))
      }
      let { params, string, value } = JSON.parse(JSON.stringify(this.option.apiOption))
      if (this.apiType == '财务收支' && this.approveType != '报销单') {
        params.operateName = this.approveType
      }
      listFeeItem(params ? params : {}).then(res => {
        let data = res.data
        if ((res.code === 200 || res.code === '200') && data) {
          this._handleTreeData(data, string, value)
          this.deptTreePre = JSON.parse(JSON.stringify(data))
          if (this.defaultType == 'feeItemName') {
            this.deptTree = this.unique(JSON.parse(JSON.stringify(data)), this.defaultType)
          }
          if (this.defaultType != 'feeItemName') {
            if (this.apiType != '财务收支') {
              if (unit && unit.id) {
                this.deptTree = this.unique(JSON.parse(JSON.stringify(data)), this.defaultType)
              }
            } else {
              this.deptTree = data.filter(item => {
                return item.id == unit.id
              })
            }
          }
        } else {
          this.deptTree = []
          this.deptTreePre = []
        }
      })
    },
    _handleTreeData(data, type1, type2) {
      data.forEach((item, index) => {
        item.name = item[type1] || ''
        item.value = item[type2]
        item.key = item[type2]
      })
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    isFeename() {
      if (!this.bindPrice) return
      if (!(this.unit && this.unit.id)) {
        return this.$notification['error']({
          message: '系统通知',
          description: `请先选择${this.selectlabel}`
        })
      }
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
          if (typeof this.rowIndex === 'number') {
            return this.rootFormData[tabelVModel][this.rowIndex][cmpVModel] || ''
          } else {
            return this.rootFormData[tabelVModel].reduce((sum, c) => (c[cmpVModel] || 0) + sum, 0)
          }
        }
        return this.rootFormData[vModel] || 0
      } catch (error) {
        return 0
      }
    },
    handleInput(val) {
      if (val) {
        let { value } = this.option.apiOption
        let arr = this.deptTreePre.filter(item => {
          return item[value] == val
        })[0]
        if (arr) {
          let { name, feeItemName, financeName, operateName, costName, id } = arr
          let params = {
            id: id,
            name,
            feeItemName,
            financeName,
            operateName,
            costName
          }
          this.$emit('change', params)
        }
      } else {
        this.$emit('change', '')
      }
    },
    clear() {
      this.innerValue = ''
      this.handleInput('')
      if (this.defaultType != 'feeItemName') this.deptTree = []
    }
  },
  watch: {
    formData: {
      handler: function(val) {
        if (!val) return
        // formData更新可能比较频繁
        let unit = this.getFormVal(this.bindPrice)
        this.unit = unit
        let bindTypePrice = this.getFormVal(this.bindTypePrice)
        if (this.bindTypePrice && bindTypePrice != this.apiType) {
          if (this.apiType) this.clear()
          this.apiType = bindTypePrice
          this.option.apiOption.params.inctype = bindTypePrice == 'A' ? 'A' : 'B'
          this.option.apiOption.string = this.defaultType
          this.initTreeData()
        }
        if (!this.bindPrice) return
        if (unit && unit.id && this.innerValue != unit.id) {
          if (bindTypePrice == 'A') {
            if (this.defaultType != 'feeItemName') {
              if (this.unit && this.unit.id) {
                this.deptTree = this.deptTreePre.filter(item => {
                  return item.id == this.unit.id
                })
              }
            }

            if (this.innerValue != unit.id) {
              this.innerValue = unit.id
            }
            this.handleInput(unit.id)
          } else {
            if (this.bindUnit && this.bindUnit.name != this.unit.name) {
              this.clear()
            }
            this.initTreeData()
            this.bindUnit = JSON.parse(JSON.stringify(unit))
          }
        } else {
          if (!unit && this.innerValue) {
            this.clear()
          }
        }
      },
      deep: true,
      immediate: true
    },
    value: {
      handler: function(val) {
        if (val) {
          this.innerValue = val.id
        } else {
          this.innerValue = ''
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style lang="stylus" scoped>
/deep/.error .ant-select-selection {
        border-color: #F56C6C;
        box-shadow: 0 0 0 0.02rem rgba(245 ,108 ,108 , 20%);
}
</style>
