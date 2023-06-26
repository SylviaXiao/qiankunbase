<template>
  <div class="fc-condition">
    <el-input v-model="innerValue" :readonly="readonly" :disabled="disabled"></el-input>
  </div>
</template>
<script>
import { getAmountChinese, mergeNumberOfExps, validExp, toRPNCompare, calcRPNCompare, debounce } from '@/assets/utils'
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
    'readonly',
    'disabled',
    'formData',
    'condition',
    'rowIndex' // 计算公式放在表格中时， 需要获取在表格中的行位置
  ],
  name: 'fc-condition',
  data() {
    return {
      innerValue: this.value,
      RPN_EXP: toRPNCompare(mergeNumberOfExps(this.condition))
    }
  },
  computed: {
    rootFormData() {
      return this.formData || this.getFormData()
    }
  },
  methods: {
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
    /**
     * 计算表达式
     */
    execRPN() {
      const temp = this.RPN_EXP.map(t => (typeof t === 'object' ? this.getFormVal(t.vModel) : t))
      let flag = calcRPNCompare(temp)
      // let vModel = this.RPN_EXP.map(t => (typeof t === 'object' ? t.vModel : t))
      // if(vModel.indexOf('.') > -1)
      let innerValue = typeof flag === 'number' ? flag : flag ? this.innerValue : 0
      if (this.readonly) {
        innerValue = this.innerValue
      }
      this.innerValue = flag ? this.compare(temp) : 0
      this.$emit('change', this.innerValue)
    },
    compare(rpnExps) {
      rpnExps = rpnExps.concat()
      const calc = (x, y, type) => {
        let a1 = Number(x),
          a2 = Number(y)
        switch (type) {
          case '+':
            return a1 + a2
          case '-':
            return a1 - a2
          case '×':
            return a1 * a2
          case '÷':
            return a1 / a2
          case '>':
            return a1 > a2 ? a2 : a1
          case '<':
            return a1 < a2 ? a1 : a2
          case '>=':
            return a1 >= a2 ? a2 : a1
          case '<=':
            return a1 <= a2 ? a1 : a2
          case '==':
            return a1 == a2 ? a1 : ''
        }
      }
      for (let i = 2; i < rpnExps.length; i++) {
        if ('+-×÷>>=<=<>=='.includes(rpnExps[i])) {
          let val = calc(rpnExps[i - 2], rpnExps[i - 1], rpnExps[i])
          rpnExps.splice(i - 2, 3, val)
          i = i - 2
        }
      }
      return rpnExps[0]
    }
  },

  watch: {
    innerValue: {
      handler: function(val) {
        if (!val) return
        this.$emit('change', this.innerValue)
        if (!this.computeExps) {
          // formData更新可能比较频繁
          this.computeExps = debounce(this.execRPN, 500)
        }
        this.computeExps()
      },
      deep: true,
      immediate: true
    },
    formData: {
      handler: function(val) {
        if (!val) return
        if (!this.computeExps) {
          // formData更新可能比较频繁
          this.computeExps = debounce(this.execRPN, 500)
        }
        this.computeExps()
      },
      deep: true,
      immediate: true
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
