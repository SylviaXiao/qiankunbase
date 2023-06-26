<template>
  <div class="fc-select-costType">
    <!-- :disabled="disabled || bindTypePrice == 'A'" -->
    <!-- :class="!valid && !innerValue ? 'error' : ''" -->
    <a-select
      :disabled="disabled"
      :value="innerValue"
      :placeholder="`请选择${label}`"
      style="width: 100%;"
      :default-active-first-option="false"
      :show-arrow="false"
      option-filter-prop="children"
      :filter-option="filterOption"
      show-search
      :not-found-content="null"
      :dropdownMatchSelectWidth="false"
      @change="handleInput"
      :allowClear="true"
      @focus="isFeename"
    >
      <a-select-option v-for="d in deptTree" :key="d.value" :value="d.value">
        {{ d.name }}
      </a-select-option>
    </a-select>
  </div>
</template>
<script>
import Vue from 'vue'
import QS from 'qs'
import { listFeeItem } from '@/api/workFlow/request.js'

let defaultParams = { inctype: 'A', feeItemName: '', financeName: '', operateName: '' }
export default {
  props: ['required', 'valid', 'label', 'value', 'tag', 'disabled', 'bindPrice', 'bindTypePrice', 'defaultType', 'approveType', 'formData', 'rowIndex'],
  name: 'fc-select-costType',
  components: {},
  data() {
    return {
      bindUnit: null,
      selectlabel: '',
      deptTree: [],
      deptTreePre: [],
      unit: null, //所有单位列表
      innerValue: this.value && this.value.id ? this.value.id : undefined,
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
      if (this.apiType != 'A') {
        this.option.apiOption.params.feeItemName = unit?.feeItemName || ''
        if (this.defaultType == 'operateName') {
          this.option.apiOption.params.financeName = unit?.financeName || ''
        } else if (this.defaultType == 'costName') {
          this.option.apiOption.params.financeName = unit?.financeName || ''
          this.option.apiOption.params.operateName = unit?.operateName || ''
        }
      } else {
        this.option.apiOption.params = JSON.parse(JSON.stringify(defaultParams))
      }
      let params = JSON.parse(JSON.stringify(this.option.apiOption.params))
      if (this.apiType == 'A' && this.approveType != '报销单') {
        params.operateName = this.approveType
      }
      const cacheKey = 'form_controls_' + listFeeItem.name + '?' + QS.stringify(params ? params : {})
      const cacheValue = Vue.ls.get(cacheKey)
      if (cacheValue) {
        this.formatData(JSON.parse(cacheValue))
      } else {
        listFeeItem(params ? params : {}).then(res => {
          let data = res.data
          if ((res.code === 200 || res.code === '200') && data) {
            Vue.ls.set(cacheKey, JSON.stringify(data))
            this.formatData(data)
          } else {
            this.deptTree = []
            this.deptTreePre = []
          }
        })
      }
    },
    formatData(data) {
      let unit = this.unit
      let { string, value } = this.option.apiOption
      this._handleTreeData(data, string, value)
      this.deptTreePre = JSON.parse(JSON.stringify(data))
      if (this.defaultType == 'feeItemName') {
        this.deptTree = this.unique(JSON.parse(JSON.stringify(data)), this.defaultType)
      }
      if (this.defaultType != 'feeItemName') {
        if (this.apiType != 'A') {
          if (unit && unit.id) {
            this.deptTree = this.unique(JSON.parse(JSON.stringify(data)), this.defaultType)
          }
        } else {
          if (unit && unit.id) {
            this.deptTree = data.filter(item => {
              return item.id == unit.id
            })
          }
        }
      }
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
          this.$emit('change', {
            data: params,
            type: this.defaultType,
            rowIndex: this.rowIndex
          })
        }
      } else {
        this.$emit('change', {
          data: null,
          type: this.defaultType,
          rowIndex: this.rowIndex
        })
      }
    },
    clear() {
      this.innerValue = undefined
      this.handleInput('')
      if (this.defaultType != 'feeItemName') this.deptTree = []
    }
  },
  watch: {
    formData: {
      handler: function(val) {
        if (!val) return
        // formData更新可能比较频繁
        let unit = this.bindPrice ? val[this.bindPrice] : ''
        this.unit = unit
        let bindTypePrice = this.bindTypePrice
        if (bindTypePrice != this.apiType) {
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
          this.innerValue = undefined
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
