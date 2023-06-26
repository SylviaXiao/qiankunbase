<template>
  <div>
    <div>
      <div v-if="code == '001' || code == '002'" class="mb10">
        <a-radio-group @change="expenseTypeChange" button-style="solid" defaultValue="1">
          <a-radio-button value="1">
            {{ code == '002' ? title : '费用报销单' }}
          </a-radio-button>
          <a-radio-button value="2">
            付款通知单
          </a-radio-button>
          <a-radio-button value="3" v-if="code == '001'">
            借支单
          </a-radio-button>
        </a-radio-group>
      </div>
      <div v-if="code == '001' || code == '003'">
        <Expense ref="Expense" v-show="expenseType == '1'" v-bind="$props"></Expense>
        <PaidInform v-show="expenseType == '2' && code == '001'" v-bind="$props"></PaidInform>
        <Borrow v-show="expenseType == '3' && code == '001'" v-bind="$props"></Borrow>
      </div>
      <div v-else-if="code == '002'">
        <Transfer ref="Transfer" v-bind="$props" v-show="expenseType == '1'"></Transfer>
        <PaidInform v-show="expenseType == '2'" v-bind="$props" :PaidInformType="'调拨'"></PaidInform>
      </div>
      <div v-else-if="code == '004' || code == '005'">
        <RefundDetailPrint v-bind="$props" />
      </div>
      <DefauleForm ref="DefauleForm" v-else v-bind="$props"></DefauleForm>
      <!-- <DefauleForm ref="printForm" v-bind="$props"></DefauleForm> -->
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import DefauleForm from './default'
import Transfer from './transfer'
import Expense from './expense'
import PaidInform from './paidInform'
import RefundDetailPrint from './RefundDetailPrint'
import Borrow from './Borrow'
export default {
  name: 'workFlowTable',
  props: ['title', 'formDatas', 'confGlobal', 'code', 'createTime', 'createUserName', 'curator'],
  data() {
    return { expenseType: '1' }
  },
  components: { DefauleForm, Transfer, Expense, PaidInform, RefundDetailPrint, Borrow },

  created() {},

  computed: {},
  methods: {
    expenseTypeChange(e) {
      this.expenseType = e.target.value
    },
    print() {
      if (this.code == '001') {
        this.$refs.Expense.$refs.printBtn.$el.click()
      } else if (this.code == '002') {
        this.$refs.Transfer.$refs.printBtn.$el.click()
      } else {
        this.$refs.DefauleForm.$refs.printBtn.$el.click()
      }
    }
  },
  watch: {}
}
</script>
<style scoped media="print" lang="less"></style>
