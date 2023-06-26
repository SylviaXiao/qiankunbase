<template>
  <div>
    <div class="block workFlowTable" style=" width: 907px;margin: 0 auto;background-color: #fff;font-weight: 500;">
      <div style="text-align:right;">
        <a-button ref="printBtn" type="primary" v-print="'#printTest'"> 打印 </a-button>
      </div>
      <div style="text-align:center;padding-bottom: 30px;font-weight: 500;font-size: 24px;">
        {{ title }}
      </div>
      <div style="text-align:right;padding-bottom: 10px;font-size: 16px;">
        <span style="padding-right:10px;font-weight: 600;">{{ createTimeInfo[0] }}</span>
        <span style="padding-right:10px;">年</span>
        <span style="padding-right:10px;font-weight: 600;">{{ createTimeInfo[1] }}</span>
        <span style="padding-right:10px;">月</span>
        <span style="padding-right:10px;font-weight: 600;">{{ createTimeInfo[2] }}</span>
        <span>日</span>
      </div>
      <div style="text-align:center;border:1px solid #000;line-height: 50px;font-size:16px;">
        <div style="display:flex;border-bottom:1px solid #000;">
          <div style="flex:1;display:flex;">
            <div style="width:120px;border-right:1px solid #000;">{{ procdefConfig.department.printLabel }}</div>
            <div style="width:calc(100% - 120px);border-right:1px solid #000;">{{ formateValue(formData.bank, 'companyName',formData.department) }}</div>
          </div>
          <div style="flex:1;display:flex;">
            <div style="width:120px;border-right:1px solid #000;">{{ procdefConfig.outDepartment.printLabel }}</div>
            <div style="width:calc(100% - 120px)">{{ formateValue(formData.outBank, 'companyName',formData.outDepartment) }}</div>
          </div>
        </div>
        <div style="display:flex;border-bottom:1px solid #000;">
          <div style="flex:1;display:flex;">
            <div style="width:120px;border-right:1px solid #000;">{{ procdefConfig.bank.printLabel }}</div>
            <div style="width:calc(100% - 120px);border-right:1px solid #000;">{{ formateValue(formData.bank, 'bankName') }}</div>
          </div>
          <div style="flex:1;display:flex;">
            <div style="width:120px;border-right:1px solid #000;">{{ procdefConfig.outBank.printLabel }}</div>
            <div style="width:calc(100% - 120px)">{{ formateValue(formData.outBank, 'bankName') }}</div>
          </div>
        </div>
        <div style="display:flex;border-bottom:1px solid #000;">
          <div style="flex:1;display:flex;">
            <div style="width:120px;border-right:1px solid #000;">银行账户</div>
            <div style="width:calc(100% - 120px);border-right:1px solid #000;">{{ formateValue(formData.bank, 'bankCardNo') }}</div>
          </div>
          <div style="flex:1;display:flex;">
            <div style="width:120px;border-right:1px solid #000;">银行账户</div>
            <div style="width:calc(100% - 120px)">{{ formateValue(formData.outBank, 'bankCardNo') }}</div>
          </div>
        </div>
        <div style="display:flex;border-bottom:1px solid #000;">
          <div style="width:120px;border-right:1px solid #000;">{{ procdefConfig.totalMoney.printLabel }}</div>
          <div style="width:calc((100% - 240px) / 4);border-right:1px solid #000;">￥{{ formateNum(formData.totalMoney) }}</div>
          <div style="width:calc((100% - 240px) / 4 * 3 + 120px);display:flex;text-align:right;padding-right:10px;">
            <span style="flex:3;text-align:right;">（大写）</span>
            <span style="flex:1;font-weight: 600;"
              >{{ totalMoneyInteger[6] || '' }}<span v-if="totalMoneyInteger.length == 6"><a-icon type="close-circle"/></span
            ></span>
            <span style="flex:1;">佰</span>
            <span style="flex:1;font-weight: 600;"
              >{{ totalMoneyInteger[5] || '' }}<span v-if="totalMoneyInteger.length == 5"><a-icon type="close-circle"/></span
            ></span>
            <span style="flex:1;">拾</span>
            <span style="flex:1;font-weight: 600;"
              >{{ totalMoneyInteger[4] || '' }}<span v-if="totalMoneyInteger.length == 4"><a-icon type="close-circle"/></span
            ></span>
            <span style="flex:1;">万</span>
            <span style="flex:1;font-weight: 600;"
              >{{ totalMoneyInteger[3] || '' }}<span v-if="totalMoneyInteger.length == 3"><a-icon type="close-circle"/></span
            ></span>
            <span style="flex:1;">仟</span>
            <span style="flex:1;font-weight: 600;"
              >{{ totalMoneyInteger[2] || '' }}<span v-if="totalMoneyInteger.length == 2"><a-icon type="close-circle"/></span
            ></span>
            <span style="flex:1;">佰</span>
            <span style="flex:1;font-weight: 600;"
              >{{ totalMoneyInteger[1] || '' }}<span v-if="totalMoneyInteger.length == 1"><a-icon type="close-circle"/></span
            ></span>
            <span style="flex:1;">拾</span>
            <span style="flex:1;font-weight: 600;"
              >{{ totalMoneyInteger[0] || '' }}<span v-if="totalMoneyInteger.length == 0"><a-icon type="close-circle"/></span
            ></span>
            <span style="flex:1;">元</span>
            <span style="flex:1;font-weight: 600;">{{ totalMoneyFloat[0] || '零' }}</span>
            <span style="flex:1;">角</span>
            <span style="flex:1;font-weight: 600;">{{ totalMoneyFloat[1] || '零' }}</span>
            <span style="flex:1;">分</span>
          </div>
        </div>
        <div style="display:flex;line-height:100px;">
          <div style="width:120px;border-right:1px solid #000;">业务或资金用途</div>
          <div style="width:calc(100% - 120px)">{{ useage }}</div>
        </div>
      </div>
      <div style="display:flex;line-height:65px;font-size: 16px;">
        <span style="flex:2;">领导审批：</span>
        <span style="flex:2;">财务审核：</span>
        <span style="flex:1;">经办人：{{ applePeople }}</span>
      </div>
    </div>
    <div class="block workFlowTable" style=" width: 907px;margin: 20px auto;background-color: #fff;">
      <a-input addon-before="业务或资金用途" v-model="useage" placeholder="请填写业务或资金用途" />
      <a-input addon-before="经办人" class="mt20" v-model="applePeople" placeholder="请填写经办人" />
    </div>
    <div ref="printTest" style="display: none">
      <div class="block workFlowTable" style="width: 907px;margin: 0 auto;background-color: #fff;font-weight: 500;" id="printTest">
        <div style="text-align:center;padding-bottom: 30px;font-weight: 500;font-size: 24px;">
          {{ title }}
        </div>
        <div style="text-align:right;padding-bottom: 10px;font-size: 16px;">
          <span style="padding-right:10px;font-weight: 600;">{{ createTimeInfo[0] }}</span>
          <span style="padding-right:10px;">年</span>
          <span style="padding-right:10px;font-weight: 600;">{{ createTimeInfo[1] }}</span>
          <span style="padding-right:10px;">月</span>
          <span style="padding-right:10px;font-weight: 600;">{{ createTimeInfo[2] }}</span>
          <span>日</span>
        </div>
        <div style="text-align:center;border:1px solid #000;line-height: 50px;font-size:16px;">
          <div style="display:flex;border-bottom:1px solid #000;">
            <div style="flex:1;display:flex;">
              <div style="width:120px;border-right:1px solid #000;">{{ procdefConfig.department.printLabel }}</div>
              <div style="width:calc(100% - 120px);border-right:1px solid #000;">{{ formateValue(formData.bank, 'companyName',formData.department) }}</div>
            </div>
            <div style="flex:1;display:flex;">
              <div style="width:120px;border-right:1px solid #000;">{{ procdefConfig.outDepartment.printLabel }}</div>
              <div style="width:calc(100% - 120px)">{{ formateValue(formData.outBank, 'companyName',formData.outDepartment) }}</div>
            </div>
          </div>
          <div style="display:flex;border-bottom:1px solid #000;">
            <div style="flex:1;display:flex;">
              <div style="width:120px;border-right:1px solid #000;">{{ procdefConfig.bank.printLabel }}</div>
              <div style="width:calc(100% - 120px);border-right:1px solid #000;">{{ formateValue(formData.bank, 'bankName') }}</div>
            </div>
            <div style="flex:1;display:flex;">
              <div style="width:120px;border-right:1px solid #000;">{{ procdefConfig.outBank.printLabel }}</div>
              <div style="width:calc(100% - 120px)">{{ formateValue(formData.outBank, 'bankName') }}</div>
            </div>
          </div>
          <div style="display:flex;border-bottom:1px solid #000;">
            <div style="flex:1;display:flex;">
              <div style="width:120px;border-right:1px solid #000;">银行账户</div>
              <div style="width:calc(100% - 120px);border-right:1px solid #000;">{{ formateValue(formData.bank, 'bankCardNo') }}</div>
            </div>
            <div style="flex:1;display:flex;">
              <div style="width:120px;border-right:1px solid #000;">银行账户</div>
              <div style="width:calc(100% - 120px)">{{ formateValue(formData.outBank, 'bankCardNo') }}</div>
            </div>
          </div>
          <div style="display:flex;border-bottom:1px solid #000;">
            <div style="width:120px;border-right:1px solid #000;">{{ procdefConfig.totalMoney.printLabel }}</div>
            <div style="width:calc((100% - 240px) / 4);border-right:1px solid #000;">￥{{ formateNum(formData.totalMoney) }}</div>
            <div style="width:calc((100% - 240px) / 4 * 3 + 120px);display:flex;text-align:right;padding-right:10px;">
              <span style="flex:3;text-align:right;">（大写）</span>
              <span style="flex:1;font-weight: 600;"
                >{{ totalMoneyInteger[6] || '' }}<span v-if="totalMoneyInteger.length == 6"><a-icon type="close-circle"/></span
              ></span>
              <span style="flex:1;">佰</span>
              <span style="flex:1;font-weight: 600;"
                >{{ totalMoneyInteger[5] || '' }}<span v-if="totalMoneyInteger.length == 5"><a-icon type="close-circle"/></span
              ></span>
              <span style="flex:1;">拾</span>
              <span style="flex:1;font-weight: 600;"
                >{{ totalMoneyInteger[4] || '' }}<span v-if="totalMoneyInteger.length == 4"><a-icon type="close-circle"/></span
              ></span>
              <span style="flex:1;">万</span>
              <span style="flex:1;font-weight: 600;"
                >{{ totalMoneyInteger[3] || '' }}<span v-if="totalMoneyInteger.length == 3"><a-icon type="close-circle"/></span
              ></span>
              <span style="flex:1;">仟</span>
              <span style="flex:1;font-weight: 600;"
                >{{ totalMoneyInteger[2] || '' }}<span v-if="totalMoneyInteger.length == 2"><a-icon type="close-circle"/></span
              ></span>
              <span style="flex:1;">佰</span>
              <span style="flex:1;font-weight: 600;"
                >{{ totalMoneyInteger[1] || '' }}<span v-if="totalMoneyInteger.length == 1"><a-icon type="close-circle"/></span
              ></span>
              <span style="flex:1;">拾</span>
              <span style="flex:1;font-weight: 600;"
                >{{ totalMoneyInteger[0] || '' }}<span v-if="totalMoneyInteger.length == 0"><a-icon type="close-circle"/></span
              ></span>
              <span style="flex:1;">元</span>
              <span style="flex:1;font-weight: 600;">{{ totalMoneyFloat[0] || '零' }}</span>
              <span style="flex:1;">角</span>
              <span style="flex:1;font-weight: 600;">{{ totalMoneyFloat[1] || '零' }}</span>
              <span style="flex:1;">分</span>
            </div>
          </div>
          <div style="display:flex;line-height:100px;">
            <div style="width:120px;border-right:1px solid #000;">业务或资金用途</div>
            <div style="width:calc(100% - 120px)">{{ useage }}</div>
          </div>
        </div>
        <div style="display:flex;line-height:65px;font-size: 16px;">
          <span style="flex:2;">领导审批：</span>
          <span style="flex:2;">财务审核：</span>
          <span style="flex:1;">经办人：{{ applePeople }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import FileList from '@/components/FormControls/returnPremine/uploadFile/FileList.vue'
import moment from 'moment'
export default {
  name: 'workFlowTable',
  props: ['title', 'formDatas', 'confGlobal', 'createTime', 'createUserName'],
  data() {
    return {
      useage: '',
      applePeople: '', //经办人
      baseApi: process.env.VUE_APP_URL,
      token: Vue.ls.get(ACCESS_TOKEN),
      procdefConfig: [],
      formData: {},
      createTimeInfo: [],
      totalMoneyInteger: [],
      totalMoneyFloat: []
    }
  },
  components: { FileList },

  created() {},

  computed: {},
  methods: {
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
        if (conf === 'bankCardNo') {
          return this.formateNumber(data[conf])
        }
        return data[conf]||(outData?outData[conf]:'')
      } else {
        return ''
      }
    },
    formateNumber(num) {
      if (!num) num = ''
      var c = num.replace(/\s/g, '').replace(/(.{4})/g, '$1 ')
      return c
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
    }
  },
  watch: {
    createUserName: {
      handler: function(val) {
        this.applePeople = val
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
          this.formateMoney(this.formDatas.totalMoney)
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
  /* width: 900px;
  margin: 0 auto;
  background-color: #fff; */
}
.workFlowTable .workFlow {
  margin: 20px;
}
.workFlowTable .workFlow .label {
  font-weight: 700;
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
