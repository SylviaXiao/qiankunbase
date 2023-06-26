<template>
  <div class="fc-select-feeType">
    <div :class="!valid ? 'error' : ''">
      <div class="belongs-teacher-header" style="height: 25px">
        <a-radio-group v-show="isExpend && showEditFeeType && !editType && !disabled" v-model="innerValue.bindTypePrice" @change="onChange">
          <a-radio value="A">
            财务收支
          </a-radio>
          <a-radio value="B">
            社保工资
          </a-radio>
        </a-radio-group>
        <div></div>
        <div style="text-align:right;">
          <a-button v-show="isExpend && !editType && !disabled" type="dashed" @click="addCounselorHandle"> <a-icon type="plus-circle" />添加 </a-button>
          <span style="color: #1ba97b;padding-left: 10px;cursor:pointer;">
            <span v-show="!isExpend" @click="isExpendVisual(true)">展开</span>
            <span v-show="isExpend" @click="isExpendVisual(false)">收起</span>
          </span>
        </div>
      </div>
      <div v-show="isExpend">
        <a-row style="font-weight: 600;">
          <a-col :span="3">
            金额
          </a-col>
          <a-col :span="4" v-show="showEditFeeType"> <span class="redStar">*</span>费用归类 </a-col>
          <a-col :span="4" v-show="showEditFeeType"> <span class="redStar">*</span>财务归类 </a-col>
          <a-col :span="4" v-show="showEditFeeType"> <span class="redStar">*</span>经营归类 </a-col>
          <a-col :span="4" v-show="showEditFeeType">
            成本归类
          </a-col>
        </a-row>
        <div class="teacher-info" v-for="(item, index) in finSpendingItemSplits" :key="index">
          <a-row>
            <a-col :span="3">
              <a-input-number
                @focus="splitPriceFocus"
                style="width:95%;"
                id="inputNumber"
                placeholder="请输入金额"
                :disabled="disabled || editType"
                v-model="item.splitPrice"
                @change="onMoneyChange(item.splitPrice, index)"
              />
            </a-col>
            <a-col :span="4" v-show="showEditFeeType">
              <CostType
                style="width:95%;"
                :rowIndex="index"
                :disabled="disabled"
                :formData="item"
                :value="item.feeItemName"
                :defaultType="'feeItemName'"
                :label="'费用归类'"
                @change="onCostTypeChange"
                :valid="valid"
                :bindTypePrice="innerValue.bindTypePrice"
              ></CostType>
            </a-col>
            <a-col :span="4" v-show="showEditFeeType">
              <CostType
                style="width:95%;"
                :rowIndex="index"
                :disabled="disabled || innerValue.bindTypePrice == 'A'"
                :formData="item"
                :value="item.financeName"
                :bindPrice="'feeItemName'"
                :defaultType="'financeName'"
                :label="'财务归类'"
                @change="onCostTypeChange"
                :bindTypePrice="innerValue.bindTypePrice"
                :valid="valid"
              ></CostType>
            </a-col>
            <a-col :span="4" v-show="showEditFeeType">
              <CostType
                style="width:95%;"
                :rowIndex="index"
                :disabled="disabled || innerValue.bindTypePrice == 'A'"
                :formData="item"
                :value="item.operateName"
                :bindPrice="'financeName'"
                :defaultType="'operateName'"
                :label="'经营归类'"
                @change="onCostTypeChange"
                :bindTypePrice="innerValue.bindTypePrice"
                :valid="valid"
              ></CostType>
            </a-col>
            <a-col :span="4" v-show="showEditFeeType">
              <CostType
                style="width:95%;"
                :rowIndex="index"
                :disabled="disabled || innerValue.bindTypePrice == 'A'"
                :formData="item"
                :value="item.costName"
                :bindPrice="'operateName'"
                :vModel="'costName'"
                :defaultType="'costName'"
                :label="'成本归类'"
                @change="onCostTypeChange"
                :bindTypePrice="innerValue.bindTypePrice"
                :valid="valid"
              ></CostType>
            </a-col>
            <a-col :span="4">
              <Apportion
                :value="item.spendingSplits"
                :bindPrice="item.splitPrice"
                :rowIndex="index"
                :disabled="disabled"
                @change="onApportionChange"
              ></Apportion>
            </a-col>
            <span style="margin-left:5px;" v-if="finSpendingItemSplits.length > 1 && !editType && !disabled">
              <a href="javascript:;" @click="deleteCounselorHandle(item)">删除</a>
            </span>
          </a-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { pageFeeItem } from '@/api/workFlow/request.js'
import CostType from './SelectCostType/index.vue'
import Apportion from './Apportion/index.vue'
let defaultValue = { key: 0, splitPrice: 0, feeItemName: null, feeItemId: null, financeName: null, operateName: null, costName: null, spendingSplits: null }
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  name: 'fc-select-feeType',
  props: [
    'required',
    'valid',
    'label',
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
    'rowIndex'
  ],

  components: { CostType, Apportion },

  data() {
    return {
      editType: false,
      timer: null,
      price: 0,
      isExpend: true,
      counselorkey: 0,
      finSpendingItemSplits: [JSON.parse(JSON.stringify(defaultValue))],
      innerValue: {
        bindTypePrice: 'A',
        finSpendingItemSplits: [JSON.parse(JSON.stringify(defaultValue))]
      },
      option: {
        disabled: true,
        placeholder: `请选择${this.label}`,
        search: true,
        string: this.label,
        key: 'feeType',
        allowClear: true,
        apiOption: {
          api: pageFeeItem, // promise类型的接口
          string: 'name',
          value: 'id',
          childString: 'name',
          childValue: 'id',
          params: { feeItemIncType: 'A', feeItemType: 'A' }
        }
      }
    }
  },
  created() {
    // this.editType = this.$route.params.type == 2
  },
  computed: {
    maxPrice() {
      let total = this.finSpendingItemSplits.map(item => item.splitPrice || 0).reduce((a, b) => a + b)
      return Number(total.toFixed(2))
    },
    //审批中是否允许查看/编辑费用归类
    showEditFeeType() {
      // return true
      return this.getFormData('showEditFeeType')
    },
    rootFormData() {
      return this.formData || this.getFormData('vmFormData')
    }
  },
  mounted() {
    this.handleInput(this.innerValue)
  },
  methods: {
    getFormData(flag) {
      var root = this.$parent
      while (root) {
        if (flag in root) {
          return root[flag]
        }
        root = root.$parent
      }
    },
    splitPriceFocus() {
      let price = this.getFormVal(this.bindPrice)
      this.price = price
      if (!price) {
        return this.$notification['error']({
          message: '系统通知',
          description: '请先填写总金额'
        })
      }
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
    isExpendVisual(flag) {
      this.isExpend = flag
    },

    onApportionChange(data) {
      this.finSpendingItemSplits[data.rowIndex]['spendingSplits'] = data.data
      this.innerValue.finSpendingItemSplits = JSON.parse(JSON.stringify(this.finSpendingItemSplits))
      this.handleInput(this.innerValue)
    },
    //删除一行
    deleteCounselorHandle(record) {
      this.finSpendingItemSplits = this.finSpendingItemSplits.filter(item => item.key !== record.key)
      this.innerValue.finSpendingItemSplits = JSON.parse(JSON.stringify(this.finSpendingItemSplits))
      this.handleInput(this.innerValue)
    },
    //新增一行
    addCounselorHandle() {
      let temObj = JSON.parse(JSON.stringify(defaultValue))
      temObj.key = ++this.counselorkey
      this.finSpendingItemSplits.push(temObj)
    },
    onMoneyChange(e, rowIndex) {
      let that = this
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        let price = e || 0
        if (that.price) {
          if (that.maxPrice > that.price) {
            price = Number((that.price - (that.maxPrice - e)).toFixed(2))
            that.$notification['error']({
              message: '系统通知',
              description: '拆分金额不得超过总金额'
            })
          }
        } else {
          price = 0
        }
        that.finSpendingItemSplits[rowIndex]['splitPrice'] = price
        that.innerValue.finSpendingItemSplits = JSON.parse(JSON.stringify(that.finSpendingItemSplits))
        that.handleInput(that.innerValue)
      }, 600)
    },
    onChange(e) {
      this.finSpendingItemSplits.forEach((item, index) => {
        item = Object.assign(item, { feeItemName: null, financeName: null, operateName: null, costName: null, feeItemId: null })
      })
      this.innerValue = { bindTypePrice: e.target.value, finSpendingItemSplits: this.finSpendingItemSplits }
      this.handleInput(this.innerValue)
    },
    onCostTypeChange(e) {
      this.finSpendingItemSplits[e.rowIndex][e.type] = e.data
      if (e.data && e.data.id) {
        this.finSpendingItemSplits[e.rowIndex].feeItemId = e.data.id
      } else {
        if (e.type == 'costName') {
          this.finSpendingItemSplits[e.rowIndex].feeItemId = this.finSpendingItemSplits[e.rowIndex].operateName?.id || null
        } else {
          this.finSpendingItemSplits[e.rowIndex].feeItemId = null
        }
      }
      this.innerValue.finSpendingItemSplits = JSON.parse(JSON.stringify(this.finSpendingItemSplits))
      this.handleInput(this.innerValue)
    },
    handleInput(val) {
      if (val) {
        this.$emit('change', val)
      } else {
        this.$emit('change', '')
      }
    }
  },
  watch: {
    value: {
      handler: function(val) {
        if (val) {
          this.innerValue = val
          this.finSpendingItemSplits = val.finSpendingItemSplits
          this.counselorkey = val.finSpendingItemSplits.length - 1
        } else {
          this.innerValue = {
            bindTypePrice: 'A',
            finSpendingItemSplits: [JSON.parse(JSON.stringify(defaultValue))]
          }
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style lang="less" scoped>
.belongs-teacher-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.redStar {
  color: rgb(245, 108, 108);
  padding-right: 3px;
}
/deep/.error {
  box-shadow: 0 0 0 2px rgba(245, 108, 108, 20%);
  border: 1px solid #f56c6c;
  padding: 5px 5px 0;
}
</style>
