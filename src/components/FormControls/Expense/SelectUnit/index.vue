<template>
  <div class="fc-select-unit" v-bind="$props" v-on="$listeners">
    <a-select
      :disabled="disabled"
      :value="innerValue"
      placeholder="选择单位"
      style="width: 100%;"
      :default-active-first-option="false"
      :show-arrow="false"
      :filter-option="false"
      :not-found-content="null"
      @change="handleInput"
      :allowClear="true"
      @focus="isFeename"
      :class="required && !value ? 'error' : ''"
    >
      <a-select-option v-for="d in unit" :key="d.id" :value="d.id">
        {{ d.name }}
      </a-select-option>
    </a-select>
  </div>
</template>
<script>
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: [
    'required',
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
  name: 'fc-select-unit',
  components: {},
  data() {
    return {
      unit: [], //所有单位列表
      innerValue: this.value && this.value.id ? this.value.id : ''
    }
  },
  created() {},
  computed: {
    rootFormData() {
      return this.formData || this.getFormData()
    }
  },
  watch: {
    formData: {
      handler: function(val) {
        if (!val) return
        // formData更新可能比较频繁
        let unit = this.getFormVal(this.bindPrice)
        if (unit) {
          this.unit = [{ name: unit.feeUnit, id: unit.feeUnit }]
          if (this.innerValue && unit.feeUnit != this.innerValue) {
            this.innerValue = ''
            this.handleInput('')
          }
          if (unit.feeUnit != this.innerValue) {
            this.innerValue = this.unit[0].id
            this.handleInput(this.unit[0].id)
          }
        } else {
          if (unit != this.value) {
            this.innerValue = ''
            this.unit = []
            this.handleInput('')
          }
        }
      },
      deep: true,
      immediate: true
    },
    value(val) {
      if (val) {
        this.innerValue = val.id
      } else {
        this.innerValue = ''
      }
    }
  },
  methods: {
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
        this.$emit('change', {
          id: val,
          name: val
        })
      } else {
        this.$emit('change', '')
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
/deep/.error .ant-select-selection {
        border-color: #F56C6C;
        box-shadow: 0 0 0 0.02rem rgba(245 ,108 ,108 , 20%);
}
</style>
