<template>
  <div class="fc-select-feeType">
    <a-tree-select
      style="width: 100%;"
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
      @focus="handleFocus"
      :class="required && !value ? 'error' : ''"
    />
  </div>
</template>
<script>
import Vue from 'vue'
import QS from 'qs'
export default {
  props: [
    'option',
    'value',
    'disabled',
    'cmpType',
    'tag',
    'tagIcon',
    'precision',
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
    'required',
    'bindTypePrice'
  ],
  name: 'fc-select-feeType',
  components: {},
  data() {
    return {
      timer: null,
      deptTree: [], //所有分馆列表
      innerValue: this.value && this.value.id ? this.value.id : ''
    }
  },
  created() {},
  computed: {},
  methods: {
    handleFocus() {
      this.$emit('handlefocus')
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
      const cacheKey = 'form_controls_' + api.name + '?' + QS.stringify(params ? params : {})
      const cacheValue = Vue.ls.get(cacheKey)
      if (cacheValue) {
        this.deptTree = JSON.parse(cacheValue)
      } else {
        api(params ? params : {}).then(res => {
          let data = typeof formatData === 'function' ? formatData(res) : res.data
          if ((res.code === 200 || res.code === '200') && data) {
            this._handleTreeData(data, string, value, childString, childValue)
            this.deptTree = data
            Vue.ls.set(cacheKey, JSON.stringify(data))
          } else {
            this.deptTree = []
          }
        })
      }
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
        this.$emit('handleInput', extra.triggerNode.dataRef)
      } else {
        this.$emit('handleInput', '')
      }
    }
  },
  watch: {
    option: {
      immediate: true,
      deep: true,
      handler(n) {
        let that = this
        if (this.timer) {
          clearInterval(this.timer)
          this.timer = null
        }
        this.timer = setTimeout(this.initTreeData, 1000)
      }
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
  /deep/.error .ant-select-selection--single{
     border-color: #F56C6C;
     box-shadow: 0 0 0 0.02rem rgba(245 ,108 ,108 , 20%);
  }
</style>
