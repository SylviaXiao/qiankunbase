<template>
  <div class="fc-upload-quantity">
    <el-input-number style="width: 100%;" v-model="innerValue" :disabled="disabled" v-bind="$props" v-on="$listeners" @input="handleInput"></el-input-number>
  </div>
</template>
<script>
  export default {
    model: {
      prop: 'value',
      event: 'change'
    },
    props: [
      'value',
      'cmpType',
      'tag',
      'tagIcon',
      'precision',
      'labelWidth',
      'step-strictly',
      'controls',
      'controls-position',
      'regList',
      'disabled',
      'changeTag',
      'proCondition',
      'formId',
      'renderKey',
      'layout',
      'rowIndex',
      'bindPrice',
      'formData',
    ],
    name: 'fc-upload-quantity',
    data() {
      return {
        innerValue: this.value
      }
    },
    methods: {
      handleInput(val) {
        this.$emit('change', val)
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
    },
    watch: {
      formData: {
        immediate: true,
        deep: true,
        handler(val) {
          if (val) {
            let uploadValue = this.getFormVal(this.bindPrice)
            let value = 0
            if (uploadValue && Array.isArray(uploadValue) && uploadValue.length > 0) {
              value = uploadValue.length
            }
            if (value != this.value) {
              this.innerValue = value || 0
              this.handleInput(value)
            }
          }
        }
      },
      value(val) {
        if (val !== this.innerValue) {
          this.innerValue = val
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
</style>
