<template>
  <div>
    <!-- 退费 -->
    <div class="workFlowTable" v-if="code === '004'">
      <RefundDetail :procinst="procinst" :node="node" :fields="fields" :formData="formData" />
    </div>
    <!-- 二次退费 -->
    <div class="workFlowTable" v-else-if="code === '005'">
      <SecondRefundDetail :procinst="procinst" :node="node" :fields="fields" :formData="formData" />
    </div>
    <div class="block workFlowTable" v-else>
      <h3 style="text-align: center;">{{ procinst.procdefName }}</h3>
      <h4 v-if="procinst.createUserName" style="text-align: center;">提交人：{{ procinst.createUserName }}</h4>
      <h4 v-if="procinst.procinstNo" style="text-align: center;">单号：{{ procinst.procinstNo }}</h4>
      <a-row class="workFlow">
        <a-col
          :span="item.span ? item.span : 24"
          v-for="item in fields"
          :key="item.vModel"
          v-show="item.show && !item.hidden"
          :style="fieldStyle(null, item, null)"
        >
          <div>
<!--            :class="item.children ? '' : 'flex'"-->
            <a-row>
              <a-col :span='labelPosition=="top"||item.children?24:item.span&&item.span!==24?9:3'>
                <div v-if="item.tag != 'fc-input-student'" :class="labelPosition=='top'||item.children?'label_top':'label'" :style="labelPosition=='left' ? 'text-align:left;' : 'padding-right:10px;'">
                  {{ item.label }}{{ item.children ? '' : '：' }}
                </div>
              </a-col>
              <a-col :span='labelPosition=="top"||item.children?24:item.span&&item.span!==24?15:21'>
                <!-- 组件包含children -->
                <!-- :class="item.tag != 'fc-input-student' ? 'content list-row' : 'content'" -->
                <div v-if="item.children" class="content">
                  <!-- 值为数组，且数组不为空 -->
                  <div v-if="Array.isArray(formData[item.vModel]) && formData[item.vModel].length > 0">
                    <a-row v-for="(element, index) in formData[item.vModel]" :key="index" class="content list-row">
                      <a-col
                        :span="head.span ? head.span : 24"
                        v-for="(head, headIdx) in item.children"
                        :key="head.vModel"
                        class='flexWrap flex'
                        :class="head.tag == 'fc-return-student' ? 'none' : ''"
                        v-show="head.show && !head.hidden"
                        :style="fieldStyle(element, item, head)"
                      >
                            <div :class="labelPosition=='top'?'label_top':'label'">{{ head.label }}：</div>
                            <div class="content " :style="labelPosition=='top'?'width:100%':'width:calc(100% - 120px)'">
                              <!-- 附件 -->
                              <div v-if="head.tag == 'fc-uploadFile'">
                                <file-list
                                  :uploadFileType="head.uploadFileType"
                                  :files="formData[item.vModel][index][head.vModel] || []"
                                  @preview="openPreviewModal"
                                  @download="downloadAttach"
                                />
                              </div>
                              <!-- 分摊 -->
                              <div v-else-if="head.tag == 'fc-apportion'">
                                <div
                                  v-for="img in formData[item.vModel][index][head.vModel]"
                                  :key="img.id"
                                  :style="formData[item.vModel][index][head.vModel].length > 1 ? 'line-height: 25px;' : ''"
                                  class="flex fc-uploadFile"
                                >
                                  {{ img.startDate }}<span v-if="img.startDate !== img.endDate">~{{ img.endDate }}</span
                                >/{{ img.parentDeptName || '' }}<span v-if="img.parentDeptName">/</span>{{ img.deptName }}/{{ img.price }}
                                </div>
                              </div>
                              <!-- 拆分 -->
                              <div v-else-if="head.tag == 'fc-select-feeType'">
                                <Split :value="formData[item.vModel][index][head.vModel]"></Split>
                              </div>
                              <!-- 付款分馆 -->
                              <div v-else-if="head.tag == 'fc-select-finance'">
                                <PaidBranch :value="formData[item.vModel][index][head.vModel]"></PaidBranch>
                              </div>
                              <!-- 学员组件 -->
                              <div v-else-if="item.tag == 'fc-input-student' && head.vModel == 'performanceList'">
                                <a-row v-for="(performanceListItem, performanceListIdx) in formData[item.vModel][index][head.vModel]" :key="performanceListIdx" style="">
                                  <a-col span="12" :class="'flex'">
                                    <div class="label" style="width:160px;">缴费业绩员工：</div>
                                    <div class="content ">
                                      <span>{{ performanceListItem.employName }}</span>
                                    </div>
                                  </a-col>
                                  <a-col span="12" :class="'flex'">
                                    <div class="label" style="width:160px;">缴费业绩分馆：</div>
                                    <div class="content ">
                                      <span>{{ performanceListItem.branchName }}</span>
                                    </div>
                                  </a-col>
                                  <a-col span="12" :class="'flex'">
                                    <div class="label" style="width:160px;">缴费业绩金额：</div>
                                    <div class="content ">
                                      <span>{{ performanceListItem.money }}</span>
                                    </div>
                                  </a-col>
                                  <a-col span="12" :class="'flex'">
                                    <div class="label" style="width:160px;">缴费业绩比例：</div>
                                    <div class="content ">
                                      <span> {{ performanceListItem.proportion ? Number(performanceListItem.proportion) * 100 : 0 }}% </span>
                                    </div>
                                  </a-col>
                                </a-row>
                              </div>
                              <!-- 其他 -->
                              <span v-else>
                                {{ formateValue(formData[item.vModel][index][head.vModel], head) }}
                                <div class="explain-text" v-if="head.showChinese && chineseTag.indexOf(head.tag) != -1">
                                  大写：{{ chinese(head.showChinese, formateValue(formData[item.vModel][index][head.vModel])) }}
                                </div>
                              </span>
                            </div>
                      </a-col>
                    </a-row>
                  </div>
                  <!-- 值为数组，且数组为空 -->
                  <div v-else-if="Array.isArray(formData[item.vModel]) && formData[item.vModel].length == 0">
                    <a-row style="border-bottom:1px solid #eee;" class="content list-row">
                      <a-col
                        :span="head.span ? head.span : 24"
                        v-for="(head, headIdx) in item.children"
                        :key="head.vModel"
                        class='flexWrap flex'
                        :class="head.tag == 'fc-return-student' ? 'none' : ''"
                        v-show="head.show && !head.hidden"
                        :style="fieldStyle(null, item, head)"
                      >
                        <div :class="labelPosition=='top'?'label_top':'label'">{{ head.label }}：</div>
                        <div class="content " :style="labelPosition=='top'?'width:100%':'width:calc(100% - 120px)'"></div>
                      </a-col>
                    </a-row>
                  </div>
                  <!-- 其他 -->
                  <div v-else>
                    <a-row class="content list-row">
                      <a-col
                        :span="head.span ? head.span : 24"
                        v-for="(head, headIdx) in item.children"
                        :key="head.vModel"
                        :class="headIdx < item.children.length - 1 ? ' flex' : 'flex'"
                        v-show="head.show && !head.hidden"
                      >
                        <div :class="labelPosition=='top'?'label_top':'label'">{{ head.label }}：</div>
                        <div class="content " :style="labelPosition=='top'?'width:100%':'width:calc(100% - 120px)'">
                          <!-- 附件 -->
                          <div v-if="head.tag == 'fc-uploadFile'">
                            <file-list :uploadFileType="head.uploadFileType" :files="formData[head.vModel] || []" @preview="openPreviewModal" @download="downloadAttach" />
                          </div>
                          <!-- 分摊 -->
                          <div v-else-if="head.tag == 'fc-apportion'">
                            <div
                              v-for="img in formData[head.vModel]"
                              :key="img.id"
                              :style="formData[head.vModel].length > 1 ? 'line-height: 25px;' : ''"
                              class="flex fc-uploadFile"
                            >
                              {{ img.startDate }}<span v-if="img.startDate !== img.endDate">~{{ img.endDate }}</span
                            >/{{ img.parentDeptName || '' }}<span v-if="img.parentDeptName">/</span>{{ img.deptName }}/{{ img.price }}
                            </div>
                          </div>
                          <!-- 拆分 -->
                          <div v-else-if="head.tag == 'fc-select-feeType'">
                            <Split :value="formData[head.vModel]"></Split>
                          </div>
                          <!-- 付款分馆 -->
                          <div v-else-if="head.tag == 'fc-select-finance'">
                            <PaidBranch :value="formData[head.vModel]"></PaidBranch>
                          </div>
                          <!-- 其他 -->
                          <span v-else>{{ formateValue(formData[head.vModel], head) }}</span>
                        </div>
                      </a-col>
                    </a-row>
                  </div>
                </div>
                <!-- 组件不包含children -->
                <div v-else class="content ">
                  <!-- 附件 -->
                  <div v-if="item.tag == 'fc-uploadFile'">
                    <file-list :uploadFileType="item.uploadFileType" :files="formData[item.vModel] || []" @preview="openPreviewModal" @download="downloadAttach" />
                  </div>
                  <!-- 付款分馆 -->
                  <div v-else-if="item.tag == 'fc-select-finance'">
                    <PaidBranch :value="formData[item.vModel]"></PaidBranch>
                  </div>
                  <!-- 投票 -->
                  <div v-else-if="item.tag == 'fc-vote' && formData[item.vModel] && formData[item.vModel].length > 0">
                    <div v-for="(data, dataIdx) in formData[item.vModel]" :key="dataIdx">
                      <span>{{data.name}}</span>
                      <span style="color: #999999">{{data.describe}}</span>
                      <span>{{data.remark}}</span>
                    </div>
                  </div>
                  <!-- 其他 -->
                  <span v-else
                  >{{ formateValue(formData[item.vModel], item) }}
                <div class="explain-text" v-if="item.showChinese && chineseTag.indexOf(item.tag) != -1">
                  大写：{{ chinese(item.showChinese, formateValue(formData[item.vModel], item)) }}
                </div>
              </span>
                </div>
              </a-col>
            </a-row>
          </div>
        </a-col>
      </a-row>
      <f-modal ref="previewModal" :open-loading="true" title="预览照片" @initValue="initPreviewModal" :showFooter="false">
        <div v-if="imgType == 'application/pdf'"><Pdf :url="previewSrc"></Pdf></div>
        <img v-else :src="previewSrc" ref="previewImg" width="752px" />
      </f-modal>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Pdf from '@/components/FormControls/returnPremine/uploadFile/Pdf.vue'
import FileList from '@/components/FormControls/returnPremine/uploadFile/FileList.vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { previewFile, downloadFiles } from '@/api/file'
import { getAmountChinese } from '@/assets/utils'
import RefundDetail from './RefundDetail/RefundDetail.vue'
import SecondRefundDetail from './RefundDetail/SecondRefundDetail.vue'
import Split from './split/index.vue'
import PaidBranch from './paidBranch/index.vue'
export default {
  name: 'workFlowTable',
  props: ['procinst', 'oldProcinst', 'confGlobal', 'compare', 'node'],
  data() {
    return {
      chineseTag: 'fc-amount,fc-calculate,fc-total-money',
      imgType: '',
      baseApi: process.env.VUE_APP_URL,
      token: Vue.ls.get(ACCESS_TOKEN),
      code: '',
      fields: [],
      formData: {},
      oldFormData: {},
      src: null,
      previewSrc: null,
      showImg: false,
      labelPosition:'right'
    }
  },
  components: { Pdf, FileList, RefundDetail, SecondRefundDetail, Split, PaidBranch },

  created() {},

  computed: {},
  methods: {
    chinese(showChinese, value) {
      return showChinese ? getAmountChinese(value) : ''
    },
    openPreviewModal(record) {
      this.imgType = record.type
      const { uid } = record
      this.fileId = uid
      this.previewSrc = null
      this.$refs.previewModal.open()
    },
    initPreviewModal() {
      const { fileId } = this
      previewFile({ fileId })
        .then(res => {
          this.previewSrc = res.data
        })
        .finally(() => {
          this.$refs.previewModal.spinning = false
        })
    },
    downloadAttach(data) {
      const { uid } = data
      downloadFiles({ fileId: uid }).then(res => {
        this.downloadBySrc(res.data)
      })
    },
    downloadBySrc(src, fileName = 'test') {
      const a = document.createElement('a')
      a.download = `${fileName}`
      a.href = src
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(a.href)
    },
    showBigImg(src) {
      this.src = src
      this.showImg = true
    },
    handleOk() {
      this.src = null
      this.showImg = false
    },
    formateValue(data, conf) {
      if (data instanceof Object) {
        if (
          conf.tag == 'fc-select-branch' ||
          conf.tag == 'fc-filter-bank' ||
          conf.tag == 'fc-select-payType' ||
          conf.tag == 'fc-select-feeType' ||
          conf.tag == 'fc-select-costType' ||
          conf.tag == 'fc-select-bankList' ||
          conf.tag == 'fc-select-feeName' ||
          conf.tag == 'fc-select-unit' ||
          conf.tag == 'fc-select-finance' ||
          conf.tag == 'fc-select-bank' ||
          conf.tag == 'fc-select-employee' ||
          conf.tag == 'fc-api-select'
        ) {
          return data.name
        }
        if (conf.tag == 'fc-uploadFile') {
          return this.formateArray(data, 'name')
        }
        if (conf.tag == 'fc-select-school') {
          return data.name + '/' + data.areaName + '/' + data.companyName
        }
        if (conf.tag == 'fc-apportion') {
        }
      } else {
        return data
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
    formateFormData(record, newRecord) {
      // console.log(9999, record, newRecord)
      let list0 = [] //非明细数据
      let list1 = [] //明细数据
      let infoVmodel = ''
      let infoData = []
      let { fields } = record
      fields.forEach(item => {
        if (item.tag == 'fc-input-table') {
          infoVmodel = item.vModel
          infoData = item.children
        } else {
          if (this.compareValue(record[item.vModel], newRecord[item.vModel], item)) {
            this.formData[item.vModel + '_compare'] = true
          }
        }
      })
      infoData.forEach(item => {
        // if (finishedEditableData.includes(item.formId)) {
        newRecord[infoVmodel].forEach((col, colIndex) => {
          if (this.compareValue(record[infoVmodel][colIndex][item.vModel], col[item.vModel], item)) {
            this.formData[infoVmodel][colIndex][item.vModel + '_compare'] = true
          }
        })
      })
    },
    compareValue(data, newData, conf, isSplit) {
      if (data instanceof Object) {
        if (conf.tag == 'fc-select-feeType') {
          let flag = false
          //费用类型
          if (data.finSpendingItemSplits.length != newData.finSpendingItemSplits.length) {
            return true
          }
          let feeItemId = []
          data.finSpendingItemSplits.forEach((item, index) => {
            feeItemId.push(item.feeItemId)
            if (item.splitPrice != newData.finSpendingItemSplits[index].splitPrice) {
              return true
            }
          })
          newData.finSpendingItemSplits.forEach(item => {
            if (!feeItemId.includes(item.feeItemId)) return true
          })
          //分摊
          let spendingSplits1 = []
          let spendingSplits2 = []
          let splitId = []
          data.finSpendingItemSplits.forEach((item, index) => {
            if (Array.isArray(item.spendingSplits) && item.spendingSplits.length > 0) {
              spendingSplits1.push(item.spendingSplits)
            }
            splitId[index] = []
          })
          newData.finSpendingItemSplits.forEach(item => {
            if (Array.isArray(item.spendingSplits) && item.spendingSplits.length > 0) {
              spendingSplits2.push(item.spendingSplits)
            }
          })
          if (spendingSplits1.length != spendingSplits2.length) {
            return true
          } else {
            spendingSplits1.forEach((item, index) => {
              item.forEach((col, colIndex) => {
                let a = col.startDate + col.endDate + col.deptId + col.price
                splitId[index].push(a)
              })
            })
            spendingSplits2.forEach((item, index) => {
              item.forEach((col, colIndex) => {
                let a = col.startDate + col.endDate + col.deptId + col.price
                if (!splitId[index].includes(a)) {
                  return true
                }
              })
            })
          }
          return flag
        }
        if (conf.tag == 'fc-select-finance') {
          return false
        }
        if (
          conf.tag == 'fc-select-branch' ||
          conf.tag == 'fc-filter-bank' ||
          conf.tag == 'fc-select-payType' ||
          conf.tag == 'fc-select-feeType' ||
          conf.tag == 'fc-select-costType' ||
          conf.tag == 'fc-select-bankList' ||
          conf.tag == 'fc-select-feeName' ||
          conf.tag == 'fc-select-unit' ||
          conf.tag == 'fc-api-select'
        ) {
          return data.id != newData.id
        }
        if (conf.tag == 'fc-uploadFile') {
          let flag = false

          if (data.length != newData.length) {
            return true
          }
          let feeItemId = []
          data.forEach(item => {
            feeItemId.push(item.uid)
          })
          newData.forEach(item => {
            if (!feeItemId.includes(item.uid)) return true
          })
          return flag
        }
        if (conf.tag == 'fc-select-school') {
          return data.branchId != newData.branchId
        }
        if (conf.tag == 'fc-select-bank') {
          return data.name != newData.name
        }
      } else {
        return data != newData
      }
    },
    fieldStyle(element, item, head) {
      const highlight = { background: '#E6FFED' }
      if (this.compare) {
        if (element && head) {
          if (element[head.vModel + '_compare']) {
            return highlight
          }
        } else if (!element && head) {
          if (this.formData[item.vModel].length === 0 && this.oldFormData[item.vModel].length > 0) {
            return highlight
          }
        } else if (!element && !head) {
          if (item.rowType != 'layout' && item.rowType != 'table' && this.formData[item.vModel + '_compare']) {
            return highlight
          }
        }
      }
      return {}
    }
  },
  watch: {
    confGlobal: {
      handler: function(confGlobal) {
        var that = this
        that.fields = this.confGlobal.fields
        this.labelPosition=confGlobal.labelPosition
      },
      immediate: true,
      deep: true
    },

    procinst: {
      handler: function(procinst) {
        var that = this
        that.formData = JSON.parse(that.procinst.flowVal)
        // that.formData = this.formateFormData(that.formData)
        that.code = JSON.parse(that.procinst.procdefConfig).basicSetting.code
      },
      immediate: true,
      deep: true
    },
    oldProcinst: {
      handler: function(procinst) {
        this.oldFormData = procinst?.flowVal ? JSON.parse(procinst.flowVal) : {}
        let flag = false
        for (var key in procinst) {
          flag = true
        }
        if (procinst && flag) {
          this.formateFormData(this.oldFormData, this.formData)
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
<style scoped lang="less" media="print">
.explain-text {
  font-size: 12px;
  color: #aaa;
  line-height: 15px;
  padding-bottom: 5px;
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
  /* border-left: 1px solid #000;
  border-top: 1px solid #000; */
}
.workFlowTable .workFlow .label {
  font-weight: 600;
  width: 120px;
  box-sizing: border-box;
  text-align: right;
}
.workFlowTable .workFlow .label_top {
  font-weight: 600;
  width: 100%;
  box-sizing: border-box;
  text-align: left;
}
.workFlowTable .workFlow .content {
  /* border-left: 1px solid #000; */
  text-align: left;
  // width: 100%;
  min-height: 32px;
  line-height: 32px;
}
.workFlowTable .workFlow .none {
  display: none;
}
.workFlowTable .workFlow .border-left {
  /* border-left: 1px solid #000; */
  box-sizing: border-box;
}
.workFlowTable .workFlow .border-top {
  /* border-top: 1px solid #000; */
  box-sizing: border-box;
}
.workFlowTable .workFlow .border-right {
  /* border-right: 1px solid #000; */
  box-sizing: border-box;
}
.workFlowTable .workFlow .border-bottom {
  /* border-bottom: 1px solid #000; */
  box-sizing: border-box;
}
.workFlowTable .workFlow /deep/.ant-col {
  min-height: 32px;
  line-height: 32px;
  box-sizing: border-box;
}
.workFlowTable .workFlow .list-row {
  padding: 0.1rem;
  text-align: left;
  box-shadow: rgba(0, 0, 0, 0.4) 0 0.02rem 0.06rem 0;
  border-radius: 0.04rem;
  position: relative;
}
.flexWrap{
  flex-wrap: wrap;
}

</style>
