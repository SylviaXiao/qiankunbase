<template>
  <div style="font-size:16px;">
    <div ref="printTest" class="block workFlowTable" style="text-align:right; width: 907px;margin: 0 auto;background-color: #fff;">
      <a-button ref="printBtn" type="primary" v-print="'#printTest'"> 打印 </a-button>
    </div>
    <div ref="printTest" class="block workFlowTable" style=" width: 907px;margin: 0 auto;background-color: #fff;font-weight: 500;" id="printTest">
      <div v-for="(items, index) in priceInfo" :key="index" style="margin-bottom:20px;">
        <div style="text-align:center;">
          <span style="border-bottom:double;">
            <span style="letter-spacing: 0.5em;padding: 0px 10px 0px 20px;font-weight: 500;font-size: 24px;">费用报销单</span>
          </span>
        </div>
        <div style="display:flex;padding-top:15px;">
          <span style="flex:2;"></span>
          <div style="font-size: 16px;flex:2;">
            <span style="padding-right:10px;font-weight:600;">{{ createTimeInfo[0] }}</span>
            <span style="padding-right:10px;">年</span>
            <span style="padding-right:10px;font-weight:600;">{{ createTimeInfo[1] }}</span>
            <span style="padding-right:10px;">月</span>
            <span style="padding-right:10px;font-weight:600;">{{ createTimeInfo[2] }}</span>
            <span>日填</span>
          </div>
          <span style="flex:1;text-align:right;font-size:16px;">单据及附件共<span style="padding-left:40px;">页</span></span>
        </div>
        <div style="text-align:center;border:double;line-height: 30px;font-size:16px;">
          <div style="display:flex;">
            <div style="flex:2;">
              <div style="display:flex;border-bottom:1px solid #000;line-height: 50px;">
                <div style="flex:2;border-right:1px solid #000;">
                  <div style="">摘要</div>
                </div>
                <div style="flex:1;border-right:1px solid #000;display:flex;flex-direction:column;line-height: 25px;">
                  <div style="border-bottom:1px solid #000;">金额</div>
                  <div style="display:flex;">
                    <span style="flex:1;border-right:1px solid #000;">拾</span>
                    <span style="flex:1;border-right:1px solid #000;">万</span>
                    <span style="flex:1;border-right:1px solid #000;">仟</span>
                    <span style="flex:1;border-right:1px solid #000;">佰</span>
                    <span style="flex:1;border-right:1px solid #000;">拾</span>
                    <span style="flex:1;border-right:1px solid #000;">元</span>
                    <span style="flex:1;border-right:1px solid #000;">角</span>
                    <span style="flex:1;">分</span>
                  </div>
                </div>
              </div>
              <div v-for="(item, indexs) in items" :key="indexs" style="display:flex;border-bottom:1px solid #000;">
                <div style="flex:2;border-right:1px solid #000;">
                  <div>{{ item.label }}</div>
                </div>
                <div style="flex:1;border-right:1px solid #000;display:flex;flex-direction:column;">
                  <div style="display:flex;">
                    <span style="flex:1;border-right:1px solid #000;height:34px;"
                      >{{ item.value[7] || '' }}<span v-if="indexs == 6 && item.value.length == 7">￥</span></span
                    >
                    <span style="flex:1;border-right:1px solid #000;height:34px;"
                      >{{ item.value[6] || '' }}<span v-if="indexs == 6 && item.value.length == 6">￥</span></span
                    >
                    <span style="flex:1;border-right:1px solid #000;height:34px;"
                      >{{ item.value[5] || '' }}<span v-if="indexs == 6 && item.value.length == 5">￥</span></span
                    >
                    <span style="flex:1;border-right:1px solid #000;height:34px;"
                      >{{ item.value[4] || '' }}<span v-if="indexs == 6 && item.value.length == 4">￥</span></span
                    >
                    <span style="flex:1;border-right:1px solid #000;height:34px;"
                      >{{ item.value[3] || '' }}<span v-if="indexs == 6 && item.value.length == 3">￥</span></span
                    >
                    <span style="flex:1;border-right:1px solid #000;height:34px;"
                      >{{ item.value[2] || '' }}<span v-if="indexs == 6 && item.value.length == 2">￥</span></span
                    >
                    <span style="flex:1;border-right:1px solid #000;height:34px;"
                      >{{ item.value[1] || '' }}<span v-if="indexs == 6 && item.value.length == 1">￥</span></span
                    >
                    <span style="flex:1;height:34px;">{{ item.value[0] || '' }}</span>
                  </div>
                </div>
              </div>
              <div style="display:flex;padding-right:10px;border-right:1px solid #000;line-height: 36px;">
                <span style="flex:4;text-align:right;">金额大写：</span>
                <span style="flex:1;font-weight:600;"
                  >{{ items[6].chineseValue[7] || '' }}<span v-if="items[6].chineseValue.length == 7"><a-icon type="close-circle"/></span> </span
                ><span style="flex:1;">拾</span>
                <span style="flex:1;font-weight:600;"
                  >{{ items[6].chineseValue[6] || '' }}<span v-if="items[6].chineseValue.length == 6"><a-icon type="close-circle"/></span></span
                ><span style="flex:1;">万</span>
                <span style="flex:1;font-weight:600;"
                  >{{ items[6].chineseValue[5] || '' }}<span v-if="items[6].chineseValue.length == 5"><a-icon type="close-circle"/></span></span
                ><span style="flex:1;">仟</span>
                <span style="flex:1;font-weight:600;"
                  >{{ items[6].chineseValue[4] || '' }}<span v-if="items[6].chineseValue.length == 4"><a-icon type="close-circle"/></span></span
                ><span style="flex:1;">佰</span>
                <span style="flex:1;font-weight:600;"
                  >{{ items[6].chineseValue[3] || '' }}<span v-if="items[6].chineseValue.length == 3"><a-icon type="close-circle"/></span></span
                ><span style="flex:1;">拾</span>
                <span style="flex:1;font-weight:600;"
                  >{{ items[6].chineseValue[2] || '' }}<span v-if="items[6].chineseValue.length == 2"><a-icon type="close-circle"/></span></span
                ><span style="flex:1;">元</span>
                <span style="flex:1;font-weight:600;"
                  >{{ items[6].chineseValue[1] || '' }}<span v-if="items[6].chineseValue.length == 1"><a-icon type="close-circle"/></span></span
                ><span style="flex:1;">角</span>
                <span style="flex:1;font-weight:600;"
                  >{{ items[6].chineseValue[0] || '' }}<span v-if="items[6].chineseValue.length == 0"><a-icon type="close-circle"/></span></span
                ><span style="flex:1;">分</span>
              </div>
            </div>
            <div style="flex:1;">
              <div style="display:flex;border-bottom:1px solid #000;line-height:260px;">
                <div style="width:120px;border-right:1px solid #000;">备注</div>
                <div style="width:calc(100% - 120px)"></div>
              </div>
              <div style="display:flex;border-bottom:1px solid #000;line-height:35px;">
                <div style="width:120px;border-right:1px solid #000;">原借款</div>
                <div style="width:calc(100% - 120px)"></div>
              </div>
              <div style="display:flex;line-height:36px;">
                <div style="width:120px;border-right:1px solid #000;">应退（补）</div>
                <div style="width:calc(100% - 120px)"></div>
              </div>
            </div>
          </div>
        </div>
        <div style="display:flex;padding:20px 0 0px;font-size:16px;">
          <span style="flex:2;">领导审批：</span>
          <span style="flex:2;">财务审核：</span>
          <span style="flex:1;">报销人：{{ applePeople }}</span>
        </div>
        <div style="text-align:right;">
          <span style="flex:1;">{{ index + 1 }}/{{ priceInfo.length }}</span>
        </div>
      </div>
    </div>
    <perm-box perm="fast:undo:changeUser">
      <div class="block workFlowTable" style=" width: 907px;margin: 20px auto 0;background-color: #fff;">
        <a-input addon-before="报销人" class="mt20" v-model="applePeople" placeholder="请填写报销人" />
      </div>
    </perm-box>
    <div style=" padding:0 20px;width: 907px;margin: 0px auto;background-color: #fff;">
      <div style="width: calc(100% - 80px );padding-bottom:20px;">
        <div><span>选择明细：</span></div>
<!--        <a-checkbox-group @change="onChange" :value="defaultPriceInfo" style="width:100%">-->
<!--          <a-row>-->
<!--            <a-col :span="8" v-for="(item, index) in formDatas.priceInfo" :key="index">-->
<!--              <a-checkbox :value="index"> {{ item.expense ? item.expense.name : '' }}/{{ item.totalMoney }} </a-checkbox>-->
<!--            </a-col>-->
<!--          </a-row>-->
<!--        </a-checkbox-group>-->
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
</template>
<script>
import fcOrgSelectnew from '@/components/FormControls/OrgSelectNew/index.vue'
import moment from 'moment'
export default {
  name: 'workFlowTable',
  props: ['title', 'formDatas', 'confGlobal', 'createTime', 'createUserName', 'curator'],
  data() {
    return {
      applePeople: '', //报销人
      selecePeople: null, //选择报销人
      priceInfo: [],
      procdefConfig: [],
      formData: {},
      createTimeInfo: [],
      totalMoneyInteger: [],
      totalMoneyFloat: [],
      defaultPriceInfo: [],
      priceInfoList: []
    }
  },
  components: { fcOrgSelectnew },

  created() {
    this.selecePeople = null
  },

  computed: {},
  methods: {
    emitInitiator(value) {
      let select = this.selecePeople?.data
      this.applePeople = select && Array.isArray(select) && select.length > 0 ? select[select.length - 1].name : this.createUserName || ''
    },
    formateNum(num) {
      if (!num) num = 0
      var c = num.toString().indexOf('.') !== -1 ? num.toLocaleString() : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      return c
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
      return {
        d: d,
        e: e.split(',')
      }
    },
    formateValue(data, conf) {
      if (data) {
        return data[conf]
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
    print() {
      this.$refs.printBtn.$el.click()
    },
    // arr是原数组，N是想分成多少个
    fenge(arr, N) {
      var result = []
      for (var i = 0; i < arr.length; i += N) {
        result.push(arr.slice(i, i + N))
      }
      return result
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
    formatePriceInfo(data) {
      if (Array.isArray(data) && data.length > 0) {
        data.forEach(item => {
          let number = this.$number(item.totalMoney).times(100)
          item.value = this.formatePriceInfoMoney(parseInt(number.toNumber()))
          item.label =item.name|| ''
        })
        let newData = this.fenge(data, 6)
        newData.forEach((item, index) => {
          let total = {
            value: 0,
            label: '合计',
            chineseValue: ''
          }
          item.forEach(items => {
            let number = this.$number(items.totalMoney).times(100)
            total.value += parseInt(number.toNumber()) || 0
          })
          total.chineseValue = this.formateMoney(total.value).d
          total.value = this.formatePriceInfoMoney(total.value)

          if (item.length < 6) {
            for (var i = item.length; i < 6; i++) {
              item.push({ value: '', label: '' })
            }
          }
          item.push(total)
        })
        this.priceInfo = newData
      } else {
        this.priceInfo = []
      }
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
        this.confGlobal.fields.forEach(item => {
          that.procdefConfig[item.vModel] = that.procdefConfig[item.vModel] || {}
          that.procdefConfig[item.vModel]['printLabel'] = item.printLabel || ''
        })
      },
      immediate: true,
      deep: true
    },
    formDatas: {
      handler: function(formDatas) {
        if (formDatas) {
          this.formData = JSON.parse(JSON.stringify(formDatas))
          this.formData = this.formateFormData(this.formData)
          if (formDatas.priceInfo) {
            this.priceInfoList=[]
            this.forMatePriceInfoList(formDatas.priceInfo)
            // this.formatePriceInfo(JSON.parse(JSON.stringify(formDatas.priceInfo)))
            // let defaultPriceInfo = []
            // formDatas.priceInfo.forEach((item, index) => {
            //   defaultPriceInfo.push(index)
            // })
            // this.defaultPriceInfo = defaultPriceInfo
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
  font-weight: 500;
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
