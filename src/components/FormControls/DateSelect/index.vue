<template>
  <div>
    <a-month-picker v-model='innerValue' :disabled='disabled' :placeholder="placeholder" :disabledDate='disabledDate' @change="handleInput" valueFormat='YYYY-MM' format='YYYY-MM'/>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  model:{
    prop: 'value',
    event: 'change'
  },
  props:["value","cmpType", "showDuration","tag", "tagIcon", "defaultValue", "labelWidth", "range-separator", "placeholder","disabledMonth",
    "clearable", "format", "value-format", "regList", "changeTag", "proCondition", "asSummary", "formId", "renderKey", "layout",
    "value","disabled"],
  name: 'fc-date-select',
  data(){
    return {
      innerValue: this.value||''
    }
  },
  methods: {
    disabledDate(current) {
      if (this.$store.getters.userInfo?.account?.id === 'admin') {
        return
      }
      if(this.disabledMonth==='A'){
        return current && current > moment().endOf('day');
      }
      return 
    },
    handleInput(val) {
      if (val) {
        this.$emit('change', val)
      } else {
        this.$emit('change', '')
      }
    }
  },
}
</script>
<style lang="stylus" scoped>
.explain-text {
  font-size: 12px;
  color: #aaa;
  line-height: 20px;
}
</style>