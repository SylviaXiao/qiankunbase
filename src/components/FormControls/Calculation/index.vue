<template>
  <div class="fc-calculate">
    <el-input v-model="innerValue" readonly></el-input>
    <div class="explain-text" v-if="showChinese">大写：{{ chinese }}</div>
  </div>
</template>
<script>
import { getAmountChinese, mergeNumberOfExps, validExp, toRPN, calcRPN, debounce } from '@/assets/utils'
import { number } from 'echarts/lib/export'
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: [
    'value',
    'tag',
    'showChinese',
    'formId',
    'formData',
    'expression',
    'rowIndex' // 计算公式放在表格中时， 需要获取在表格中的行位置
  ],
  name: 'fc-calculate',
  data() {
    return {
      innerValue: this.value,
      RPN_EXP: toRPN(mergeNumberOfExps(this.expression))
    }
  },

  watch: {
    formData: {
      handler: function(val) {
        if (!val) return
        this.computeExps()
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    chinese() {
      return this.showChinese ? getAmountChinese(this.innerValue) : ''
    },
    rootFormData() {
      return this.formData || this.getFormData()
    }
  },
  methods: {
    computeExps() {
      debounce(this.execRPN, 1000)()
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
        let value = null
        if (vModel.indexOf('.') > -1) {
          let [tabelVModel, cmpVModel] = vModel.split('.')
          if (typeof this.rowIndex === 'number') {
            value = this.rootFormData[tabelVModel][this.rowIndex][cmpVModel]
          } else {
            let num = this.rootFormData[tabelVModel]
              .map(item => (item[cmpVModel] ? this.$number(item[cmpVModel]) : this.$number(0)))
              .reduce((a, b) => a.plus(b), this.$number(0))
            value = num.toNumber()
          }
        } else {
          value = this.rootFormData[vModel]
        }
        return Number(value) || 0
      } catch (error) {
        console.warn('计算公式出错, 可能包含无效的组件值', error)
        return 0
      }
    },
    /**
     * 计算表达式
     */
    execRPN() {
      const temp = this.RPN_EXP.map(t => (typeof t === 'object' ? this.getFormVal(t.vModel) : t))
      this.innerValue = calcRPN(temp).toFixed(2)
      this.$emit('change', this.innerValue)
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
</style>
