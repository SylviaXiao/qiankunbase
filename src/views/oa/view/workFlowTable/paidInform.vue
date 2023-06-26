<template>
  <div>
    <div ref="printTest" class="block workFlowTable" style="text-align:right; width: 907px;margin: 0 auto;background-color: #fff;">
      <div style="text-align:right;">
        <a-button ref="printBtn" type="primary" v-print="'#printTest1'"> 打印 </a-button>
      </div>
    </div>
    <div class="block workFlowTable" style=" width: 907px;margin: 0 auto;background-color: #fff;font-weight: 500;" id="printTest1">
      <div style="text-align:center;">
        <span style="border-bottom:double;border-color:#000;">
          <span style="letter-spacing: 0.5em;padding: 0px 10px 0px 20px;font-weight: 500;font-size: 24px;">付款通知单</span>
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
      <div style="text-align:center;border:double;border-color:#000;line-height: 50px;font-size: 16px;">
        <div style="border-bottom:1px solid #000;">
          <div style="display:flex;">
            <div style="width:120px;box-sizing:border-box;border-right:1px solid #000;">收款单位</div>
            <div style="width:calc(100% - 120px);">{{ bankInfo ? bankInfo.receiptName : '' }}</div>
          </div>
        </div>
        <div style="display:flex;border-bottom:1px solid #000;">
          <div style="flex:1;display:flex;">
            <div style="width:120px;box-sizing:border-box;border-right:1px solid #000;">账号</div>
            <div style="width:calc(100% - 120px);border-right:1px solid #000;">{{ bankInfo ? bankInfo.bankNo : '' }}</div>
          </div>
          <div style="flex:1;display:flex;">
            <div style="width:120px;box-sizing:border-box;border-right:1px solid #000;">开户行</div>
            <div style="width:calc(100% - 120px);line-height: 20px;display: flex;justify-content: center;align-items: center;">
              {{ bankInfo ? bankInfo.bank : '' }}
            </div>
          </div>
        </div>
        <div style="border-bottom:1px solid #000;height: 90px;">
          <div style="display:flex;">
            <div style="width:120px;box-sizing:border-box;border-right:1px solid #000;line-height: 90px;">用途</div>
            <div style="width:calc(100% - 120px);line-height: 22px;display: flex;justify-content: center;align-items: center;">{{ useage }}</div>
          </div>
        </div>
        <div style="display:flex;border-bottom:1px solid #000;">
          <div style="flex:1;display:flex;">
            <div style="width:120px;border-right:1px solid #000;">品名</div>
            <div style="width:calc(100% - 120px);border-right:1px solid #000;"></div>
          </div>
          <div style="flex:1;display:flex;">
            <div style="width:120px;box-sizing:border-box;border-right:1px solid #000;">数量</div>
            <div style="width:calc(100% - 120px);border-right:1px solid #000;"></div>
          </div>
          <div style="flex:1;display:flex;">
            <div style="width:120px;box-sizing:border-box;border-right:1px solid #000;">单价</div>
            <div style="width:calc(100% - 120px)"></div>
          </div>
        </div>
        <div style="display:flex;border-bottom:1px solid #000;">
          <div style="width:121px;border-right:1px solid #000;">金额</div>

          <div style="width:calc(100% / 3 - 118px);border-right:1px solid #000;">￥{{ formateNum(priceInfo) }}</div>
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
        <div style="display:flex;">
          <div style="width:120px;box-sizing:border-box;border-right:1px solid #000;">备注</div>
          <div style="width:calc(100% - 120px)"></div>
        </div>
      </div>
      <div style="display:flex;line-height:65px;font-size: 16px;">
        <span style="flex:2;">领导审批：</span>
        <span style="flex:2;">财务审核：</span>
        <span style="flex:1;">经办人：{{ applePeople }}</span>
      </div>
    </div>
    <div class="block workFlowTable" style=" width: 907px;margin: 20px auto;background-color: #fff;">
      <a-input addon-before="用途" v-model="useage" placeholder="请填写用途" />
      <perm-box perm="fast:undo:changeUser">
        <a-input addon-before="报销人" class="mt20" v-model="applePeople" placeholder="请填写报销人" />
      </perm-box>
      <div style="width: calc(100% - 80px );" class="mt20" v-if="PaidInformType != '调拨'">
        <div><span>选择账户：</span></div>
        <div class="ml20 mt10">
          <a-radio-group @change="onBankChange" :value="defaultBankInfo">
            <a-row>
              <a-col :span="24" v-for="(item, index) in bankInfoList" :key="index">
                <a-radio :value="index"> {{ item.name }} </a-radio>
              </a-col>
            </a-row>
          </a-radio-group>
        </div>
      </div>
      <div style="width: calc(100% - 80px );" class="mt20" v-if="PaidInformType != '调拨'">
        <div><span>选择明细：</span></div>
        <div class="ml20 mt10">
<!--          <a-checkbox-group @change="onChange" :value="defaultPriceInfo" style="width:100%">-->
<!--            <a-row>-->
<!--              <a-col :span="8" v-for="(item, index) in formDatas.priceInfo" :key="index">-->
<!--                <a-checkbox :value="index"> {{ item.expense ? item.expense.name : '' }}/{{ item.totalMoney }} </a-checkbox>-->
<!--              </a-col>-->
<!--            </a-row>-->
<!--          </a-checkbox-group>-->
          <a-tree-select
            v-model="defaultPriceInfo"
            style="width: 100%"
            :tree-data="priceInfoList"
            tree-checkable
            @change="onChange"
            treeDefaultExpandAll
            search-placeholder="请选择"
            :replaceFields="{children:'children', title:'title', key:'value', value: 'value' }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import fcOrgSelectnew from '@/components/FormControls/OrgSelectNew/index.vue'
import moment from 'moment'
export default {
  name: 'workFlowTable',
  props: ['title', 'formDatas', 'confGlobal', 'createTime', 'createUserName', 'curator', 'PaidInformType'],
  data() {
    return {
      receiptBank: '',
      applePeople: '', //报销人
      selecePeople: null, //选择报销人
      useage: '', //用途
      procdefConfig: [],
      formData: {},
      createTimeInfo: [],
      totalMoneyInteger: [],
      totalMoneyFloat: [],
      bankInfoList: [],
      bankInfo: {},
      defaultPriceInfo: [],
      priceInfo: 0,
      defaultBankInfo: [],
      priceInfoList: []
    }
  },
  components: { fcOrgSelectnew },

  created() {},

  computed: {},
  methods: {
    onChange(e) {
      this.defaultPriceInfo = e
      let data = []
      let priceInfoList = JSON.parse(JSON.stringify(this.priceInfoList))
      priceInfoList.forEach(item=>{
        let flag = e.includes(item.value)
        let money = 0
        if(Array.isArray(item.children)&&item.children.length>0){
          let list =item.children.filter((col, index) => e.includes(col.value))
          flag =list.length>0
          money=list.reduce((sum, c) => (c.totalMoney || 0) + sum, 0)
        }else{
          money = item.totalMoney
        }
        if(flag) data.push(Object.assign(item,{
          totalMoney:money
        }))
      })
      this.formatePriceInfo(data)
    },
    onBankChange(e) {
      this.defaultBankInfo = e.target.value
      let data = this.bankInfoList.filter((item, index) => this.defaultBankInfo == index)
      this.bankInfo = data[0]
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
    formatePriceInfo(data) {
      let priceInfo = 0
      if (Array.isArray(data) && data.length > 0) {
        data.forEach((item, index) => {
          let number = this.$number(item.totalMoney).times(1)
          priceInfo += parseFloat(number.toNumber()) || 0
        })
      }
      this.priceInfo = priceInfo.toFixed(2)
      this.formateMoney(this.priceInfo)
    },

    emitInitiator(value) {
      let select = this.selecePeople?.data
      this.applePeople = select && Array.isArray(select) && select.length > 0 ? select[select.length - 1].name : this.createUserName || ''
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
    formateValue(data, conf,outData) {
      if (data) {
        if (conf == 'bankNo') {
          return this.formateNumber(data[conf])
        }
        return data[conf]||(outData?outData[conf]:'')
      } else {
        return ''
      }
    },
    formateArray(data, key) {
      let str = ''
      if (data && data.length > 0) {
        if (str) {
          str += ','
        }
        str += data.map(t => {
          return t[key]
        })
      }
      return str
    },
    formateNumber(num) {
      if (!num) num = ''
      var c = num.replace(/\s/g, '').replace(/(.{4})/g, '$1 ')
      return c
    },
    formateFormData(fields) {
      for (let key in fields) {
        if (key == 'MemberCourseInfo') {
          if (fields.MemberCourseInfo[0].performanceList) {
            fields.MemberCourseInfo[0].performanceList = JSON.parse(fields.MemberCourseInfo[0].performanceList)
          }
        }
      }
      return fields
    },
    getBankList(data) {
      let bankInfoList = []
      if (Array.isArray(data.priceInfo) && data.priceInfo.length > 0) {
        data.priceInfo.forEach(item => {
          if (item.receiptBank && item.receiptBank.name) {
            bankInfoList.push(item.receiptBank)
          }
        })
      }
      if (data.receiptBank && data.receiptBank.name) {
        bankInfoList.push(data.receiptBank)
      }
      this.bankInfoList = this.unique(bankInfoList, 'receiptName', 'bank', 'bankNo', 'receiptType')
      this.bankInfo = bankInfoList[0]
    },
    unique(arr, a, b, e, d) {
      // 缓存用于记录
      const arr1 = []
      for (const t of arr) {
        // 检查缓存中是否已经存在
        if (arr1.find(c => c[a] === t[a] && c[b] === t[b], c => c[e] === t[e] && c[d] === t[d])) {
          // 已经存在说明以前记录过，现在这个就是多余的，直接忽略
          continue
        }
        // 不存在就说明以前没遇到过，把它记录下来
        arr1.push(t)
      }
      // 记录结果就是过滤后的结果
      return arr1
    },

    print() {
      this.$refs.printBtn.$el.click()
    },
    forMatePriceInfoList(data){
      let datas = []
      if(Array.isArray(data)&&data.length>0){
        data.forEach((item,index)=>{
          let name = (item.expense ? item.expense.name : '')
          datas.push({
            title:name+'/'+item.totalMoney,
            value:index,
            totalMoney:item.totalMoney,
            name:name
          })
          if(item.paidBranch&&item.paidBranch.data&&Array.isArray(item.paidBranch.data)&&item.paidBranch.data.length>0){
            datas[index].children=item.paidBranch.data.filter(colItem=>colItem.school&&colItem.school.name).map((col,idx)=>{
              return {
                id:index,
                title:(col.school?(col.school.name||''):'')+(col.bank&&col.bank.name?('-'+col.bank.name):'')+'-'+col.money,
                value:index+'-'+idx,
                totalMoney:col.money,
                name:name
              }
            })
          }
        })
      }
      this.priceInfoList=datas
      this.formatePriceInfo(JSON.parse(JSON.stringify(datas)))
      let defaultPriceInfo = []
      datas.forEach((item, index) => {
        if(Array.isArray(item.children)&&item.children.length>0){
          let value = item.children.map(col=>col.value)
          defaultPriceInfo=defaultPriceInfo.concat(value)
        }else{
          defaultPriceInfo.push(item.value)
        }
      })
      this.defaultPriceInfo = defaultPriceInfo
    },
  },
  watch: {
    createUserName: {
      handler: function(val) {
        this.applePeople = this.curator || val
      },
      immediate: true,
      deep: true
    },
    createTime: {
      handler: function(val) {
        var that = this
        let createTime = this.createTime || new Date()
        this.createTimeInfo = moment(createTime)
          .format('YYYY-MM-DD')
          .split('-')
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
          if (this.PaidInformType == '调拨') {
            this.bankInfo = {
              receiptName: formDatas.department.companyName||formDatas.bank.companyName||'',
              bankNo: formDatas.bank.bankCardNo,
              bank: formDatas.bank.bankName
            }
            this.priceInfo = this.formDatas.totalMoney
            this.formateMoney(this.formDatas.totalMoney)
          } else {
            this.getBankList(formDatas)
            this.defaultBankInfo = 0
            this.forMatePriceInfoList(formDatas.priceInfo)
            // let defaultPriceInfo = []
            // if (Array.isArray(formDatas.priceInfo) && formDatas.priceInfo.length > 0) {
            //   formDatas.priceInfo.forEach((item, index) => {
            //     defaultPriceInfo.push(index)
            //   })
            //   this.onChange(defaultPriceInfo)
            // }
          }
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
  line-height: 50px;
}
.workFlowTable .workFlow .none {
  display: none;
}
.workFlowTable .workFlow /deep/.ant-col {
  min-height: 50px;
  line-height: 50px;
  box-sizing: border-box;
}
.fileList {
  width: calc(100% - 120px);
  justify-content: center;
  text-align: center;
}
</style>
