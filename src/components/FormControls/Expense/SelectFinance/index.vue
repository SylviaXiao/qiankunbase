<template>
  <div class="fc-select-finance">
    <div class="belongs-teacher-header" style="height: 25px">
      <div style="color:red;">明细付款分馆和外部付款分馆二选一填</div>
      <div style="text-align:right;">
        <a-button v-show="isExpend && !showEditPaidAccount && (rowIndex || rowIndex == 0) && !disabled" type="dashed" @click="addCounselorHandle">
          <a-icon type="plus-circle" />添加
        </a-button>
        <span style="color: #1ba97b;padding-left: 10px;cursor:pointer;">
          <span v-show="!isExpend" @click="isExpendVisual(true)">展开</span>
          <span v-show="isExpend" @click="isExpendVisual(false)">收起</span>
        </span>
      </div>
    </div>
    <div v-show="isExpend">
      <a-row style="font-weight: 600;">
        <a-col :span="9">
          付款分馆
        </a-col>
        <a-col :span="6">
          付款金额
        </a-col>
        <a-col :span="9" v-if="showEditPaidAccount">
          打款账户
        </a-col>
      </a-row>
      <div class="teacher-info" v-for="(item, index) in counselorInfo" :key="index">
        <a-row v-show="!schoolId || item.school.branchId == schoolId">
          <a-col :span="9">
            <a-select
              style="width:95%;"
              show-search
              :filter-option="filterOption"
              :disabled="disabled || showEditPaidAccount"
              placeholder="请选择分馆"
              v-model="item.school.id"
              :allowClear="true"
              @change="params => handleDeptChange(params, index)"
            >
              <a-select-option v-for="items in deptList" :key="items.id" :value="items.id">
                {{ items.branchName }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="6">
            <a-input-number
              @focus="moneyFocus"
              style="width:95%;"
              id="inputNumber"
              :disabled="disabled || showEditPaidAccount"
              placeholder="请输入金额"
              v-model="item.money"
              @change="onMoneyChange(item.money, index)"
            />
          </a-col>
          <a-col :span="9" v-if="showEditPaidAccount">
            <a-select
              style="width:95%;"
              :disabled="disabled"
              :allowClear="true"
              placeholder="请选择打款账户"
              v-model="item.bank.id"
              @change="params => handleBankChange(params, index)"
            >
              <template v-for="items in bankList[index] || []">
                <a-select-option :value="items.id">
                  {{ items.bankNo }}
                </a-select-option>
              </template>
            </a-select>
          </a-col>
          <span style="margin-left:5px;" v-if="counselorInfo.length > 1">
            <a href="javascript:;" @click="deleteCounselorHandle(item)">删除</a>
          </span>
        </a-row>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import QS from 'qs'
import { listIsSalaryFinCompany } from '@/api/common'
import { pageListBankByDept, listBankByDeptId } from '@/api/workFlow/request.js'
import { sortBy } from 'lodash'
let defaultValue = {
  key: 1,
  money: 0,
  bank: {},
  school: {}
}
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
    'layout',
    'formData',
    'bindPrice',
    'rowIndex' // 计算公式放在表格中时， 需要获取在表格中的行位置
  ],
  name: 'fc-select-finance',

  components: { treeSelect },

  data() {
    return {
      optionSchool: {
        placeholder: `请选择分馆`,
        search: true,
        string: '付款分馆',
        key: 'feeName',
        allowClear: true,
        apiOption: {
          api: listIsSalaryFinCompany, // promise类型的接口
          string: 'branchName',
          value: 'id',
          childString: 'branchName',
          childValue: 'id'
        }
      },
      deptList: [],
      bankList: [],
      timer: null,
      price: 0,
      isExpend: true,
      counselorkey: 1,
      counselorInfo: [JSON.parse(JSON.stringify(defaultValue))],
      schoolId: null
    }
  },
  created() {
    this.initDeptList2()
    this.schoolId = this.$route.params.schoolId != '0' ? this.$route.params.schoolId : null
  },
  computed: {
    maxPrice() {
      let total = this.counselorInfo.map(item => item.money).reduce((a, b) => a + b)
      return Number(total.toFixed(2))
    },
    rootFormData() {
      return this.formData || this.getFormData('vmFormData')
    },
    showEditPaidAccount() {
      //审批中是否允许查看/编辑付款分馆
      return this.getFormData('showEditPaidAccount')
    },
    procinstId() {
      return this.getFormData('procinstId')
    }
  },
  mounted() {
    this.handleInput()
  },
  methods: {
    async initDeptList() {
      let res = await listIsSalaryFinCompany()
      this.deptList = res.data || []
      if (this.showEditPaidAccount) {
        let res1 = await pageListBankByDept({
          page: 0,
          limit: 0,
          procinstId: this.procinstId
        })
        this.bankList = res1.data || []
        let [{ id, bankNo }] = sortBy(this.bankList, o => o.bankOrder)
        if (id) {
          this.counselorInfo.forEach(item => {
            if (item?.school?.id && !item?.bank?.id) item.bank = { id, name: bankNo }
          })
          this.handleInput()
        }
      }
    },
    async initDeptList2() {
      const cacheKey1 = 'form_controls_' + listIsSalaryFinCompany.name
      const cacheValue1 = Vue.ls.get(cacheKey1)
      if (cacheValue1) {
        this.deptList = JSON.parse(cacheValue1)
      } else {
        let res = await listIsSalaryFinCompany()
        this.deptList = res.data || []
        Vue.ls.set(cacheKey1, JSON.stringify(this.deptList))
      }

      if (this.showEditPaidAccount) {
        this.counselorInfo.forEach(async (item, index) => {
          if (!this.schoolId || item.school.branchId == this.schoolId) {
            let params = {
              schoolId: item.school.branchId,
              procinstId: this.procinstId
            }
            const cacheKey2 = 'form_controls_' + listBankByDeptId.name + '?' + QS.stringify(params ? params : {})
            const cacheValue2 = Vue.ls.get(cacheKey2)
            if (cacheValue2) {
              this.bankList[index] = JSON.parse(cacheValue2)
            } else {
              let res1 = await listBankByDeptId(params)
              this.bankList[index] = res1.data || []
              Vue.ls.set(cacheKey2, JSON.stringify(this.bankList[index]))
            }
            this.$forceUpdate()
            let [{ id, bankNo }] = sortBy(this.bankList[index], o => o.bankOrder)
            if (id && item?.school?.id && !item?.bank?.id) {
              item.bank = { id, name: bankNo }
              this.handleInput()
            }
          }
        })
      }
    },
    initCounselorInfo() {
      let data = JSON.parse(JSON.stringify(defaultValue))
      // data.option.apiOption.api = pageListBankByDept
      // data.optionSchool.apiOption.api = listIsSalaryFinCompany
      return data
    },
    handleBankChange(val, index) {
      let data = this.bankList[index].filter(item => item.id == val)[0]
      if (data) {
        this.counselorInfo[index].bank = {
          id: data.id,
          name: data.bankNo
        }
        this.handleInput()
      } else {
        this.counselorInfo[index].bank = {}
        this.handleInput()
      }
    },
    handleDeptChange(val, index) {
      let data = this.deptList.filter(item => item.id == val)[0]
      if (data) {
        this.counselorInfo[index].school = {
          branchId: data.branchId,
          id: data.id,
          name: data.branchName
        }
        this.counselorInfo[index].bank = {}
        this.handleInput()
      } else {
        this.counselorInfo[index].school = {}
        this.counselorInfo[index].bank = {}
        this.handleInput()
      }
    },
    getFormData(flag) {
      var root = this.$parent
      while (root) {
        if (flag in root) {
          return root[flag]
        }
        root = root.$parent
      }
    },
    moneyFocus() {
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
    //是否展开
    isExpendVisual(flag) {
      this.isExpend = flag
    },
    //删除一行
    deleteCounselorHandle(record) {
      this.counselorInfo = this.counselorInfo.filter(item => item.key !== record.key)
      this.handleInput()
    },
    //新增一行
    addCounselorHandle() {
      let temObj = this.initCounselorInfo()
      temObj.key = ++this.counselorkey
      this.counselorInfo.push(temObj)
      this.handleInput()
    },
    onMoneyChange(e, rowIndex) {
      let that = this
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        let price = e
        if (that.price) {
          if (that.maxPrice > that.price) {
            price = Number((that.price - (that.maxPrice - e)).toFixed(2))
            that.$notification['error']({
              message: '系统通知',
              description: '付款金额不得超过总金额'
            })
          }
        } else {
          price = 0
        }
        that.counselorInfo[rowIndex]['money'] = price
        that.handleInput()
      }, 600)
    },
    handleInput() {
      let val = JSON.parse(JSON.stringify(this.counselorInfo))
      if (val) {
        let data = val.map(item => {
          return {
            money: item.money,
            bank: item.bank,
            school: item.school
          }
        })
        this.$emit('change', {
          data: data
        })
      } else {
        this.$emit('change', '')
      }
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase())
    },
  },
  watch: {
    value: {
      handler: function(data) {
        if (data && data.isTrusted && this.counselorInfo.length > 0) {
          return
        }
        let val = data ? JSON.parse(JSON.stringify(data)) : ''
        if (val) {
          val.data.forEach((item, index) => {
            item.key = index + 1
          })
          this.counselorInfo = val.data
          this.counselorkey = this.counselorInfo.length
        } else {
          this.counselorInfo = [this.initCounselorInfo()]
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style lang="stylus" scoped>
.belongs-teacher-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
</style>
