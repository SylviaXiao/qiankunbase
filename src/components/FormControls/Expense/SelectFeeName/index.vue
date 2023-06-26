<template>
  <div class="fc-select-feeName" v-bind="$props" v-on="$listeners">
    <treeSelect v-bind="$props" @handleInput="handleInput" :option="option"></treeSelect>
  </div>
</template>
<script>
import { listFeeName } from '@/api/workFlow/request.js'
import treeSelect from '../../treeSelect/index'
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: [
    'required',
    'value',
    'label',
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
  name: 'fc-select-feeName',
  components: { treeSelect },
  data() {
    return {
      option: {
        placeholder: `请选择${this.label}`,
        search: true,
        string: this.label,
        key: 'feeName',
        allowClear: true,
        apiOption: {
          api: listFeeName, // promise类型的接口
          string: 'feeName',
          value: 'id',
          childString: 'feeName',
          childValue: 'id',
          params: { type: 'A' }
        }
      }
    }
  },
  created() {},
  computed: {},
  methods: {
    handleInput(val) {
      if (val) {
        this.$emit('change', {
          id: val.id,
          name: val.feeName,
          feeUnit: val.feeUnit
        })
      } else {
        this.$emit('change', '')
      }
    }
  },
  watch: {}
}
</script>
<style lang="stylus" scoped></style>
