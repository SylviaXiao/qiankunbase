<template>
  <div>
    <div class="block workFlowTable" style="text-align:right; width: 1000px;margin: 0 auto;background-color: #fff;">
      <div style="text-align:right;">
        <a-button ref="printBtn" type="primary" v-print="'#printTest'"> 打印 </a-button>
      </div>
    </div>
    <div ref="printTest" class="block workFlowTable" style=" width: 1000px;margin: 0 auto;background-color: #fff;" id="printTest">
      <div
        style="text-align:center;
    line-height: 50px;
    font-weight: 700;
    font-size: 18px;
"
      >
        {{ title }}
      </div>
      <a-row class="workFlow" style="border-top: 1px solid #000;border-left: 1px solid #000;">
        <a-col :span="item.span ? item.span : 24" v-for="item in fields" :key="item.vModel" v-show="!item.hidden">
          <div
            class="flex"
            :style="
              item.children
                ? 'margin:  -1px;     border-bottom: 1px solid #000;border-right: 1px solid #000;'
                : 'border-bottom: 1px solid #000;border-right: 1px solid #000;margin: 0 -1px 0 0;'
            "
          >
            <div class="label" v-if="item.tag != 'fc-input-student'" style="width: 120px;">
              {{ item.label }}
            </div>
            <!-- 组件包含children -->
            <div
              v-if="item.children"
              class="content "
              :style="item.tag == 'fc-input-student' ? 'width:100%;border-right:1px solid #000;margin:0 -1px 0 0;' : 'border-left:1px solid #000;'"
            >
              <!-- 值为数组，且数组不为空 -->
              <div v-if="Array.isArray(formData[item.vModel])">
                <a-row v-for="(element, index) in formData[item.vModel]" :key="index">
                  <!-- class="border-bottom border-right" -->
                  <a-col
                    v-show="!head.hidden"
                    :span="head.span ? head.span : 24"
                    v-for="(head, headIdx) in item.children"
                    :key="head.vModel"
                    :class="head.tag == 'fc-return-student' ? 'flex none' : 'flex'"
                    style="border-right: 1px solid #000;border-bottom: 1px solid #000;  border-top:1px solid #000;  margin: 0 0px -1px 0;"
                  >
                    <div class="label" :style="head.vModel == 'performanceList' ? 'width: 120px;' : 'width: 120px;border-right: 1px solid #000;'">
                      {{ head.label }}
                    </div>
                    <!-- <div style="width:calc(100% - 120px);min-height:50px;border-top:1px solid #000;"> -->
                    <!-- 附件 -->
                    <div v-if="head.tag == 'fc-uploadFile'" class="fileList">
                      <file-list :uploadFileType="head.uploadFileType" :files="formData[item.vModel][index][head.vModel]" :showButton="false" />
                    </div>
                    <!-- 分摊 -->
                    <div v-else-if="head.tag == 'fc-apportion'">
                      <div v-for="img in formData[item.vModel][index][head.vModel]" :key="img.id" style="line-height: 25px;" class="flex fc-uploadFile">
                        {{ img.startDate }}<span v-if="img.startDate !== img.endDate">~{{ img.endDate }}</span
                        >/{{ img.parentDeptName || '' }}<span v-if="img.parentDeptName">/</span>{{ img.deptName }}/{{ img.price }}
                      </div>
                    </div>
                    <!-- 拆分 -->
                    <div v-else-if="head.tag == 'fc-select-feeType'">
                      <Split :value="formData[item.vModel][index][head.vModel]"></Split>
                    </div>
                    <!-- 学员组件 -->
                    <div v-else-if="item.tag == 'fc-input-student' && head.vModel == 'performanceList'" style="width:calc(100% - 120px);">
                      <a-row v-for="(performanceListItem, performanceListIdx) in formData[item.vModel][index][head.vModel]" :key="performanceListIdx" style="">
                        <a-col span="12" :class="'flex'" style="border-bottom: 1px solid #000;">
                          <div class="label" style="width:120px;border-left: 1px solid #000;">缴费业绩员工：</div>
                          <div class="content ">
                            <span>{{ performanceListItem.employName }}</span>
                          </div>
                        </a-col>
                        <a-col span="12" :class="'flex'" style="border-bottom: 1px solid #000;">
                          <div class="label" style="width:120px;border-left: 1px solid #000;">缴费业绩分馆：</div>
                          <div class="content ">
                            <span>{{ performanceListItem.branchName }}</span>
                          </div>
                        </a-col>
                        <a-col
                          span="12"
                          :class="'flex'"
                          :style="performanceListIdx >= formData[item.vModel][index][head.vModel].length - 1 ? '' : 'border-bottom: 1px solid #000;'"
                        >
                          <div class="label" style="width:120px;border-left: 1px solid #000;">缴费业绩金额：</div>
                          <div class="content ">
                            <span>{{ performanceListItem.money }}</span>
                          </div>
                        </a-col>
                        <a-col
                          span="12"
                          :class="'flex'"
                          :style="performanceListIdx >= formData[item.vModel][index][head.vModel].length - 1 ? '' : 'border-bottom: 1px solid #000;'"
                        >
                          <div class="label" style="width:120px;border-left: 1px solid #000;">缴费业绩比例：</div>
                          <div class="content ">
                            <span> {{ performanceListItem.proportion ? Number(performanceListItem.proportion) * 100 : 0 }}% </span>
                          </div>
                        </a-col>
                      </a-row>
                    </div>
                    <div v-else style="text-align:center;width:calc(100% - 120px);">{{ formateValue(formData[item.vModel][index][head.vModel], head) }}</div>
                    <!-- </div> -->
                  </a-col>
                  <!-- <a-col
                    v-if="item.children.length % 2 == 0 && item.children[item.children.length - 1].span != 24"
                    style="border-right: 1px solid #000;border-bottom: 1px solid #000;"
                  >
                    <div class="label" style="width: 120px;"></div>
                    <div class="content " style="  border-left: 1px solid #000;text-align: center;width: 100%;min-height: 50px;line-height: 50px;">
                      &nbsp;{{ ' ' }}
                    </div>
                  </a-col> -->
                </a-row>
              </div>
              <!-- 值为数组，且数组为空 -->
              <div v-else-if="Array.isArray(formData[item.vModel]) && formData[item.vModel].length == 0">
                <a-row style="border-bottom:1px solid #eee;">
                  <a-col
                    :span="head.span ? head.span : 24"
                    v-for="(head, headIdx) in item.children"
                    :key="head.vModel"
                    :class="head.tag == 'fc-return-student' ? 'flex none' : 'flex'"
                    v-show="!head.hidden"
                  >
                    <div class="label">{{ head.label }}：</div>
                    <div class="content "></div>
                  </a-col>
                </a-row>
              </div>
              <!-- 其他 -->
              <div v-else>
                <a-row>
                  <a-col
                    v-show="!head.hidden"
                    :span="head.span ? head.span : 24"
                    v-for="(head, headIdx) in item.children"
                    :key="head.vModel"
                    :class="headIdx < item.children.length - 1 ? 'border-bottom flex' : 'flex'"
                    :style="headIdx < item.children.length - 1 ? 'border-bottom: 1px solid #000;' : ''"
                  >
                    <div class="label" style="width: 120px;">{{ head.label }}</div>
                    <!-- 附件 -->
                    <div v-if="head.tag == 'fc-uploadFile'" class="fileList">
                      <file-list :uploadFileType="head.uploadFileType" :files="formData[head.vModel]" :showButton="false" />
                    </div>
                    <!-- 分摊 -->
                    <div v-else-if="head.tag == 'fc-apportion'">
                      <div v-for="img in formData[head.vModel]" :key="img.id" style="line-height: 25px;" class="flex fc-uploadFile">
                        {{ img.startDate }}<span v-if="img.startDate !== img.endDate">~{{ img.endDate }}</span
                        >/{{ img.parentDeptName || '' }}<span v-if="img.parentDeptName">/</span>{{ img.deptName }}/{{ img.price }}
                      </div>
                    </div>
                    <!-- 拆分 -->
                    <div v-else-if="head.tag == 'fc-select-feeType'">
                      <Split :value="formData[head.vModel]"></Split>
                    </div>
                    <!-- 其他 -->
                    <div v-else style="text-align:center;">{{ formateValue(formData[head.vModel], head) }}</div>
                  </a-col>
                </a-row>
              </div>
            </div>
            <!-- 组件包不含children -->
            <div v-else class="content " style="border-left: 1px solid #000;text-align: center;width: calc(100% - 120px);min-height: 50px;line-height: 50px;">
              <!-- 附件 -->
              <div v-if="item.tag == 'fc-uploadFile'" style="width: 100%;">
                <file-list :uploadFileType="item.uploadFileType" :files="formData[item.vModel]" :showButton="false" />
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
              <span v-else>{{ formateValue(formData[item.vModel], item) }}</span>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Split from '../workFlowData/split/index.vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import FileList from '@/components/FormControls/returnPremine/uploadFile/FileList.vue'
export default {
  name: 'workFlowTable',
  props: ['code', 'title', 'formDatas', 'confGlobal', 'createTime'],
  data() {
    return {
      baseApi: process.env.VUE_APP_URL,
      token: Vue.ls.get(ACCESS_TOKEN),
      fields: [],
      formData: {}
    }
  },
  components: { FileList, Split },

  created() {},

  computed: {},
  methods: {
    formateValue(data, conf) {
      if (data instanceof Object) {
        if (
          conf.tag == 'fc-select-branch' ||
          conf.tag == 'fc-select-payType' ||
          conf.tag == 'fc-select-feeName' ||
          conf.tag == 'fc-select-bankList' ||
          conf.tag == 'fc-filter-bank' ||
          conf.tag == 'fc-select-unit' ||
          conf.tag == 'fc-select-feeType' ||
          conf.tag == 'fc-select-costType' ||
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
    confGlobal: {
      handler: function(confGlobal) {
        var that = this
        that.fields = this.confGlobal.fields
      },
      immediate: true,
      deep: true
    },
    formDatas: {
      handler: function(formDatas) {
        if (formDatas) {
          this.formData = JSON.parse(JSON.stringify(formDatas))
          this.formData = this.formateFormData(this.formData)
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
  border-right: 1px solid rgb(0, 0, 0);
  margin-right: -1px;
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
