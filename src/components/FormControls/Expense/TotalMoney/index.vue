<template>
  <div class="fc-total-money" v-bind="$props" v-on="$listeners">
    <div>
      <a-input-number
        id="inputNumber"
        :disabled="disabled"
        style="width:calc(50% - 85px);margin-right:5px;"
        :step="1"
        v-model="innerValue"
        @change="handleInput"
      />
    </div>
    <div class="explain-text" v-if="showChinese">大写：{{ chinese }}</div>
  </div>
</template>
<script>
import { isNumber } from 'lodash'
import { getAmountChinese } from '@/assets/utils'
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: [
    'showChinese',
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
    'rowIndex' // 计算公式放在表格中时， 需要获取在表格中的行位置
  ],
  name: 'fc-total-money',
  components: {},
  data() {
    return {
      innerValue: isNumber(this.value) ? this.value : 0
    }
  },
  created() {},
  computed: {
    chinese() {
      return this.showChinese ? getAmountChinese(this.innerValue) : ''
    },
    rootFormData() {
      return this.formData || this.getFormData()
    }
  },
  watch: {
    formData: {
      handler: function(val) {
        if (val && this.bindPrice) {
          let uploadValue = this.getFormVal(this.bindPrice)
          let value = this.$number(0)
          if (uploadValue && Array.isArray(uploadValue) && uploadValue.length > 0) {
            value = uploadValue
              .map(a => {
                let number = a.fpAmount.split('¥')[1] || 0
                return this.$number(number)
              })
              .reduce((a, b) => a.plus(b))
          }
          value = value.toNumber()
          if (value != this.value) {
            this.innerValue = value || 0
            this.handleInput(value)
          }
        }
      },
      deep: true,
      immediate: true
    },
    value(val) {
      if (val) {
        this.innerValue = isNumber(val) ? val : 0
        if (!isNumber(val)) {
          this.handleInput(0)
        }
      } else {
        this.innerValue = 0
        this.handleInput(0)
      }
    }
  },
  methods: {
    onChange(e) {
      return false
    },
    isFeename() {
      if (!(this.unit && this.unit.length > 0)) {
        this.unit = []
        return this.$notification['error']({
          message: '系统通知',
          description: '请先选择费用名称'
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
      let that = this
      try {
        if (vModel.indexOf('.') > -1) {
          let [tabelVModel, cmpVModel] = vModel.split('.')
          if (typeof that.rowIndex === 'number') {
            return (that.formData[tabelVModel] && that.formData[tabelVModel][that.rowIndex] && that.formData[tabelVModel][that.rowIndex][cmpVModel]) || 0
          } else {
            return that.formData[tabelVModel].reduce((sum, c) => (c[cmpVModel] || 0) + sum, 0)
          }
        }
        return that.formData[vModel] || 0
      } catch (error) {
        console.warn('计算公式出错, 可能包含无效的组件值', error)
        return 0
      }
    },
    handleInput(val) {
      if (val) {
        this.$emit('change', val)
      } else {
        this.$emit('change', 0)
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.explain-text {
  font-size: 12px;
  color: #aaa;
  line-height: 20px;
}
/deep/.ant-select-disabled .ant-select-selection {
    background: #F5F7FA;
    color: #C0C4CC;
    border: 0.01rem solid #F5F7FA;
}
/deep/.ant-checkbox + span {
    padding-right: 0;
    padding-left: 0;
}
</style>
