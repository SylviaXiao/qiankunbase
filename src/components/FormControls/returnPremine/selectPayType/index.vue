<template>
  <div class="fc-select-payType" v-bind="$props" v-on="$listeners">
    <!-- <a-tree-select
      class="ml20"
      style="width: 100%"
      v-model="innerValue"
      :allowClear="true"
      :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
      :treeData="deptTree"
      treeDefaultExpandAll
      :filterTreeNode="onTreeSearch"
      @change="handleInput"
      :disabled="disabled"
      placeholder="选择支付方式类型"
    /> -->
    <a-select v-model="innerValue" @change="handleInput" :disabled="disabled" placeholder="选择支付方式类型">
      <a-select-option v-for="item in deptTree" :key="item.payModeId" :value="item.payModeId">
        {{ item.payModeName }}
      </a-select-option>
    </a-select>
  </div>
</template>
<script>
import { getSysDictList } from '@/api/workFlow/request.js'
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
    'layout'
  ],
  name: 'fc-select-payType',
  components: {},
  data() {
    return {
      deptTree: [], //所有分馆列表
      innerValue: this.value && this.value.id ? this.value.id : ''
    }
  },
  created() {
    this.initTreeData()
  },
  computed: {},
  methods: {
    onTreeSearch(inputValue, path) {
      return path.data.props.deptName.indexOf(inputValue) > -1
    },
    initTreeData() {
      getSysDictList().then(res => {
        if (res.code === 200 && res.data) {
          this.$tools._handleTreeData(res.data)
          this.deptTree = res.data
        }
      })
    },
    handleInput(val) {
      let data = this.deptTree.filter(item => {
        return item.payModeId == val
      })
      this.$emit('change', {
        id: val,
        name: data[0].payModeName
      })
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.innerValue = val.id
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
</style>
