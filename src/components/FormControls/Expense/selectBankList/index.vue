<template>
  <div class="fc-select-bankList" v-bind="$props" v-on="$listeners">
    <treeSelect v-bind="$props" @handleInput="handleInput" :option="option"></treeSelect>
  </div>
</template>
<script>
import { listReceiptBank } from '@/api/organize'
import treeSelect from '../../treeSelect/index'
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: [
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
  name: 'fc-select-bankList',
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
          api: listReceiptBank, // promise类型的接口
          string: 'name',
          value: 'id',
          childString: 'name',
          childValue: 'id',
          formatData: res => {
            let data = []
            if (res.code == 200) {
              if (Array.isArray(res.data.receiptBank) && res.data.receiptBank.length > 0) {
                res.data.receiptBank.forEach(item => {
                  item.name = (item.receiptType == 'B' ? '个人' : '公司') + '/' + item.receiptName + '/' + item.bank + '/' + item.bankNo
                })
              }
              data = res.data.receiptBank || []
            }
            return data
          }
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
          name: val.name,
          receiptName: val.receiptName,
          bank: val.bank,
          bankNo: val.bankNo
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
