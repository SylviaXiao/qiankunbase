<template>
  <div>
    <div ref="printTest" class="block workFlowTable" style="text-align:right; width: 907px;margin: 0 auto;background-color: #fff;">
      <div style="text-align:right;">
        <a-button ref="printBtn2" type="primary" v-print="'#printTest2'"> 打印 </a-button>
      </div>
    </div>
    <div class="block workFlowTable" style=" width: 907px;margin: 0 auto;background-color: #fff;font-weight: 500;" id="printTest2">
      <div style="text-align:center;">
        <span style="border-bottom:double;border-color:#000;">
          <span style="letter-spacing: 0.5em;padding: 0px 10px 0px 20px;font-weight: 500;font-size: 24px;">借支单</span>
        </span>
      </div>
      <div style="text-align:right;padding-bottom: 2px;font-size: 16px;font-weight:500;">
        <span style="padding-right:10px;">{{ createTimeInfo[0] }}</span>
        <span style="padding-right:10px;">年</span>
        <span style="padding-right:10px;">{{ createTimeInfo[1] }}</span>
        <span style="padding-right:10px;">月</span>
        <span style="padding-right:10px;">{{ createTimeInfo[2] }}</span>
        <span>日</span>
      </div>
      <div style="text-align:center;border:double;border-color:#000;line-height: 70px;font-size: 16px;">
        <div style="display:flex;border-bottom:1px solid #000;">
          <div style="flex:1;display:flex;">
            <div style="width:120px;box-sizing:border-box;border-right:1px solid #000;">部门</div>
            <div style="width:calc(100% - 120px);border-right:1px solid #000;">{{ branch }}</div>
          </div>
          <div style="flex:1;display:flex;">
            <div style="width:120px;box-sizing:border-box;border-right:1px solid #000;">借款人</div>
            <div style="width:calc(100% - 120px);line-height: 20px;display: flex;justify-content: center;align-items: center;">
              {{ borrowor }}
            </div>
          </div>
        </div>
        <div style="border-bottom:1px solid #000;">
          <div style="display:flex;">
            <div style="width:120px;box-sizing:border-box;border-right:1px solid #000;">借款事由</div>
            <div style="width:calc(100% - 120px);">借支</div>
          </div>
        </div>
        <div style="display:flex;border-bottom:1px solid #000;">
          <div style="width:121px;border-right:1px solid #000;">借款金额</div>

          <div style="width:calc(100% / 3 - 118px);border-right:1px solid #000;">￥{{ formateNum(priceInfo) }}元</div>
          <div style="width:calc(100% / 3 * 2 );display:flex;text-align:right;padding-right:10px;">
            <span style="flex:3;text-align:right;">（大写）</span>
            <span style="flex:1;font-weight:600;"
              >{{ totalMoneyInteger[6] || ''
              }}<span v-if="totalMoneyInteger.length == 6"><a-icon style="font-weight:700;color:#000;" type="close-circle"/></span></span
            ><span style="flex:1;">佰</span>
            <span style="flex:1;font-weight:600;"
              >{{ totalMoneyInteger[5] || ''
              }}<span v-if="totalMoneyInteger.length == 5"><a-icon style="font-weight:700;color:#000;" type="close-circle"/></span></span
            ><span style="flex:1;">拾</span>
            <span style="flex:1;font-weight:600;"
              >{{ totalMoneyInteger[4] || '' }}
              <span v-if="totalMoneyInteger.length == 4"><a-icon style="font-weight:700;color:#000;" type="close-circle"/></span></span
            ><span style="flex:1;">万</span>
            <span style="flex:1;font-weight:600;"
              >{{ totalMoneyInteger[3] || ''
              }}<span v-if="totalMoneyInteger.length == 3"><a-icon style="font-weight:700;color:#000;" type="close-circle"/></span></span
            ><span style="flex:1;">仟</span>
            <span style="flex:1;font-weight:600;"
              >{{ totalMoneyInteger[2] || ''
              }}<span v-if="totalMoneyInteger.length == 2"><a-icon style="font-weight:700;color:#000;" type="close-circle"/></span></span
            ><span style="flex:1;">佰</span>
            <span style="flex:1;font-weight:600;"
              >{{ totalMoneyInteger[1] || ''
              }}<span v-if="totalMoneyInteger.length == 1"><a-icon style="font-weight:700;color:#000;" type="close-circle"/></span></span
            ><span style="flex:1;">拾</span>
            <span style="flex:1;font-weight:600;"
              >{{ totalMoneyInteger[0] || ''
              }}<span v-if="totalMoneyInteger.length == 0"><a-icon style="font-weight:700;color:#000;" type="close-circle"/></span></span
            ><span style="flex:1;">元</span>
            <span style="flex:1;font-weight:600;">{{ totalMoneyFloat[0] || '零' }}</span>
            <span style="flex:1;">角</span>
            <span style="flex:1;font-weight:600;">{{ totalMoneyFloat[1] || '零' }}</span>
            <span style="flex:1;">分</span>
          </div>
        </div>
        <div style="display:flex;border-bottom:1px solid #000;">
          <div style="width:120px;box-sizing:border-box;border-right:1px solid #000;">备注</div>
          <div style="width:calc(100% - 120px)">{{ remark }}</div>
        </div>
        <div style="display:flex;">
          <div style="flex:1;display:flex;">
            <div style="width:120px;border-right:1px solid #000;">领导审批</div>
            <div style="width:calc(100% - 120px);border-right:1px solid #000;"></div>
          </div>
          <div style="flex:1;display:flex;">
            <div style="width:120px;box-sizing:border-box;border-right:1px solid #000;">会计</div>
            <div style="width:calc(100% - 120px);border-right:1px solid #000;"></div>
          </div>
          <div style="flex:1;display:flex;">
            <div style="width:120px;box-sizing:border-box;border-right:1px solid #000;">财务审核</div>
            <div style="width:calc(100% - 120px)"></div>
          </div>
        </div>
      </div>
      <!-- <div style="display:flex;line-height:65px;font-size: 16px;">
        <span style="flex:2;">领导审批：</span>
        <span style="flex:2;">财务审核：</span>
        <span style="flex:1;">经办人：{{ borrowor }}</span>
      </div> -->
    </div>
    <div class="block workFlowTable" style=" width: 907px;margin: 20px auto;background-color: #fff;">
      <div style="width: calc(100% - 80px );" class="mt20">
        <div>
          <span>选择日期：</span>
          <span>
            <a-date-picker
              @change="onChange"
              valueFormat="YYYY-MM-DD"
              :default-value="moment(new Date(), 'YYYY-MM-DD')"
              format="YYYY-MM-DD"
              v-model="timeNow"
            />
          </span>
        </div>
      </div>

      <perm-box perm="fast:undo:changeBorrowUser">
        <div style="width: calc(100% - 80px );" class="mt20">
          <div>
            <span>部门：</span>
            <span>
              <a-select show-search :filter-option="filterOption" :default-value="branchId" style="width: 300px" @change="handleChange">
                <a-select-option :value="item.schoolId" v-for="item in branchList" :key="item.schoolId">
                  {{ item.schoolName }}
                </a-select-option>
              </a-select>
            </span>
          </div>
        </div>
        <a-input addon-before="借款人" class="mt20" v-model="borrowor" placeholder="请填写报销人" />
      </perm-box>
      <a-input addon-before="备注" class="mt20" v-model="remark" placeholder="请填写备注" />
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import { finUserAllocation } from '@/api/workFlow/request'
export default {
  name: 'workFlowTable',
  props: ['title', 'formDatas', 'confGlobal', 'createTime', 'createUserName', 'curator', 'PaidInformType'],
  data() {
    return {
      moment,
      remark: '',
      timeNow: '',
      branch: '', //部门
      branchId: '', //部门id
      receiptBank: '',
      borrowor: '', //借款人
      useage: '', //用途
      procdefConfig: [],
      formData: {},
      createTimeInfo: [],
      totalMoneyInteger: [],
      totalMoneyFloat: [],
      bankInfo: {},
      defaultPriceInfo: [],
      priceInfo: 0,
      defaultBankInfo: [],
      branchList: []
    }
  },
  components: {},

  created() {
    let timeNow = moment(new Date()).format('YYYY-MM-DD')
    this.createTimeInfo = timeNow.split('-')
    this.getBranchList()
  },

  computed: {},
  methods: {
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    async getBranchList() {
      let res = await finUserAllocation()
      this.branchList = res.data || []
    },
    handleChange(e) {
      let name = this.branchList.filter(item => item.schoolId == e)[0]?.schoolName || ''
      this.branch = name
    },
    onChange(e) {
      this.createTimeInfo = e.split('-')
    },
    formatePriceInfoMoney(val) {
      let d = ''
      for (let char of String(val)) {
        d += d ? ',' + char : char
      }
      d = d.split(',').sort(function() {
        return -1
      })
      return d
    },
    formateNum(num) {
      if (!num) num = 0
      num = Number(num).toFixed(2)
      var c = num.split('.')
      var b = c[0].toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + '.' + c[1]
      return b
    },
    formateMoney(num) {
      if (!num) num = 0
      let cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖') //汉字的数字
      let a = num.toString().split('.')[0]
      let b = num.toString().split('.')[1] || '00'
      let d = ''
      let e = ''
      for (let char of a) {
        d += d ? ',' + cnNums[Number(char)] : cnNums[Number(char)]
      }
      for (let char of b) {
        e += e ? ',' + cnNums[Number(char)] : cnNums[Number(char)]
      }
      d = d.split(',').sort(function() {
        return -1
      })
      this.totalMoneyInteger = d
      this.totalMoneyFloat = e.split(',')
    },
    print() {
      this.$refs.printBtn2.$el.click()
    }
  },
  watch: {
    createUserName: {
      handler: function(val) {
        this.borrowor = this.curator || val
      },
      immediate: true,
      deep: true
    },
    confGlobal: {
      handler: function(confGlobal) {
        var that = this
      },
      immediate: true,
      deep: true
    },
    formDatas: {
      handler: function(formDatas) {
        if (formDatas) {
          this.formData = JSON.parse(JSON.stringify(formDatas))
          this.priceInfo = this.formDatas.total
          this.formateMoney(this.formDatas.total)
          this.branch = formDatas.initiator ? formDatas.initiator.name : ''
          this.branchId = formDatas.initiator ? formDatas.initiator.id : ''
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
<style scoped media="print" lang="less">
.ant-layout,
.ant-layout * {
  box-sizing: content-box;
}
.flex {
  display: flex;
  align-items: flex-start;
}
.fc-uploadFile {
  .img {
    color: #1ba97b;
    cursor: pointer;
  }
}
.workFlowTable {
  padding: 20px;
  /* width: 800px;
  margin: 0 auto;
  background-color: #fff; */
}
.workFlowTable .workFlow {
  margin: 20px;
}
.workFlowTable .workFlow .label {
  font-weight: 600;
  width: 120px;
  box-sizing: border-box;
  text-align: center;
}
.workFlowTable .workFlow .content {
  text-align: center;
  width: calc(100% - 120px);
  min-height: 50px;
  line-height: 70px;
}
.workFlowTable .workFlow .none {
  display: none;
}
.workFlowTable .workFlow /deep/.ant-col {
  min-height: 50px;
  line-height: 70px;
  box-sizing: border-box;
}
.fileList {
  width: calc(100% - 120px);
  justify-content: center;
  text-align: center;
}
</style>
