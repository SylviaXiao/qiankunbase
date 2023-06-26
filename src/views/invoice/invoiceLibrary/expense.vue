<template>
  <div style="font-size:16px;">
      <a-modal title="" :visible="visible" :confirm-loading="confirmLoading" @cancel="handleCancel" :width='1000' >
        <div ref="printTest" class="block workFlowTable" style="text-align:right; width: 907px;margin: 0 auto;background-color: #fff;">
          <a-button ref="printBtn" type="primary" v-print="'#printTest'" :disabled='printDisabled'> 打印 </a-button>
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
        <div style="width: calc(100% - 80px );" class="mb20" v-if='printDisabled'>
          <div>
            <span>选择日期：</span>
            <span>
            <a-date-picker
              @change="onTimeChange"
              valueFormat="YYYY-MM-DD"
              :default-value="moment(new Date(), 'YYYY-MM-DD')"
              format="YYYY-MM-DD"
              v-model="timeNow"
            />
          </span>
          </div>
        </div>
        <div class='tableList' v-if='showEdit'>
          <a-table
            :columns="formColumns"
            :dataSource="form"
            :pagination='false'
            :rowKey="(record, index) => index"
          >
          <span slot="printAbstract" slot-scope="text, record,index">
          <a-input v-if='printDisabled' v-model="record.printAbstract" placeholder='请输入摘要' @change='onChange($event,index,"printAbstract")'  style="width: 100%;" />
            <span v-else>{{text}}</span>
        </span>
            <span slot="price" slot-scope="text, record,index">
            <a-input-number  v-if='printDisabled' v-model="record.price" @change='onChange($event,index,"price")' :min="0" style="width: 100%;" />
            <span v-else>{{text}}</span>
        </span>
            <span slot="action" slot-scope="text, record, index">
            <a  v-if='printDisabled'  @click="handleRemove(index)"><a-icon type="close-circle" /></a>
        </span>
          </a-table>
          <a-button v-if='printDisabled' type="dashed" icon="plus-circle" block class="mt10" @click="handleAddRow">新增一行</a-button>
        </div>
        <div v-if='printDisabled' class="block mb20" style=" width: 907px;background-color: #fff;">
          <a-input addon-before="报销人" class="mt20" v-model="applePeople" placeholder="请填写报销人" />
        </div>
        <template slot="footer">

          <a-button  v-if='printDisabled' key="back" @click="handleCancel">
            取消
          </a-button>
          <a-button  v-if='printDisabled'  key="submit" type="primary" :loading="confirmLoading" @click="handleOk">
            确定
          </a-button>
        </template>
      </a-modal>
  </div>
</template>
<script>
import moment from 'moment'
import { saveInvoicePrint } from '@/api/invoice'
const formColumns = [
  {
    title: '摘要',
    dataIndex: 'printAbstract',
    scopedSlots: { customRender: 'printAbstract' }
  },
  {
    title: '金额',
    dataIndex: 'price',
    scopedSlots: { customRender: 'price' }
  },
  {
    title: '',
    dataIndex: 'action',
    width: 100,
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'workFlowTable',
  props: {
    invoiceIds:{
      type:String,
      default:''
    },
    maxPrice:{
      type:Number,
      default:0
    },
    createUserName:{
      type:String,
      default:''
    }
  },
  data() {
    return {
      printDisabled:true,
      showEdit:true,
      formColumns,
      confirmLoading: false,
      visible: false,
      moment,
      timeNow:'',
      applePeople: '', //报销人
      priceInfo: [],
      form:[],
      createTimeInfo: [],
      printDate:''
    }
  },
  components: { },
  created() {
  },
  computed: {},
  methods: {
    backData(data){
      this.printDisabled=false
      this.showEdit=false
      this.form=data.printDetails
      this.printDate=data.printDate
      this.onTimeChange(this.printDate)
      this.applePeople=data.userName
      this.formatePriceInfo()
    },
    handleAddRow() {
      this.form.push({
        printAbstract:'',
        price: 0
      })
      this.formatePriceInfo()
    },
    open(){
      this.showEdit=true
      this.printDisabled=true
      this.form=[]
      this.printDate=moment(new Date()).format('YYYY-MM-DD')
      this.onTimeChange(this.printDate)
      this.priceInfo=[]
      this.handleAddRow()
      this.visible=true
    },
    handleRemove(index) {
      this.form.splice(index, 1)
    },
    handleCancel() {
      this.confirmLoading = false
      this.visible = false
    },
    handleOk() {
      if(this.printDisabled){
        let form = this.form.filter(item => item.price !== 0)
        if (form.length === 0) {
          return this.$notification['error']({
            message: '系统通知',
            description: '只少要录入一条数据'
          })
        }
        if (form.findIndex(d => !d.printAbstract) >= 0 || form.findIndex(d => !d.price) >= 0) {
          return this.$notification['error']({
            message: '系统通知',
            description: '请输入摘要/金额'
          })
        }
        if(!this.printDate) return this.$notification['error']({
          message: '系统通知',
          description: '请选择日期'
        })
        if(!this.applePeople) return this.$notification['error']({
          message: '系统通知',
          description: '请输入报销人'
        })
        let params = {
          invoiceIds:this.invoiceIds,
          printDate:this.printDate,
          userName:this.applePeople,
          printDetails:form
        }
        this.confirmLoading = true
        saveInvoicePrint(params)
          .then(res => {
            if (res.code === 200) {
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              this.$emit('refreshTable')
              this.printDisabled=false
            }
          })
          .finally(() => {
            this.confirmLoading = false
          })
      }else{
        this.handleCancel()
      }
    },
    onTimeChange(e) {
      this.printDate=e
      if(e){
        this.createTimeInfo = e.split('-')
      }else{
        this.createTimeInfo =['','','']
      }
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
    onChange(val,index,type) {
      if(type==='price'){
        let maxNum = this.form.reduce((sum, c) => (c.price || 0) + sum, 0)
        if (Math.abs(this.maxPrice) < Math.abs(maxNum)) {
          this.form[index].price = Number((this.maxPrice - (maxNum - val)).toFixed(2))
          this.$notification['error']({
            message: '系统通知',
            description: '抵扣金额不得超过发票总金额'
          })
        }
      }
      this.formatePriceInfo()
    },
    formatePriceInfo() {
      let data =JSON.parse(JSON.stringify( this.form))
      if (Array.isArray(data) && data.length > 0) {
        data.forEach(item => {
          let number = this.$number(item.price).times(100)
          item.value = this.formatePriceInfoMoney(parseInt(number.toNumber()))
          item.label = (item.printAbstract) || ''
        })
        let newData = this.fenge(data, 6)
        newData.forEach((item, index) => {
          let total = {
            value: 0,
            label: '合计',
            chineseValue: ''
          }
          item.forEach(items => {
            let number = this.$number(items.price).times(100)
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
    }
  },
  watch: {
    createUserName:{
      deep: true,
      handler(val) {
        this.applePeople=val
      }
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
