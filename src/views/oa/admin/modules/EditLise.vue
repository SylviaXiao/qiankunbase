<template>
  <div class="mt20">
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" :width="600" title="修改记录" :visible="visible" @ok="handleCancel" @cancel="handleCancel">
      <template v-if="visible">
        <s-table ref="table" :columns="columns" :data="loadData" :rowKey="(record, index) => record.id" :scroll="{ x: true }">
          <span slot="action" slot-scope="text, record">
            <span>
              <a href="#" style="padding: 0 5px;" @click="getInfo(record)">查看详情</a>
            </span>
          </span>
        </s-table>
      </template>
    </a-modal>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" :width="1400" @cancel="handleOk" title="详情" :visible="infoVisible" :footer="false">
      <a-table ref="table" :columns="InfoColumns" :data-source="infoData" :rowKey="(record, index) => record.index">
        <span slot="dataList" slot-scope="text, record">
          <div v-if="record.tag == 'fc-select-feeType'">
            <div v-if="record.isSplit">
              <div class="teacher-info" v-for="(item, index) in text.finSpendingItemSplits" :key="index">
                <div
                  v-for="img in item.spendingSplits"
                  :key="img.id"
                  :style="item.spendingSplits.length > 1 ? 'line-height: 25px;' : ''"
                  class="flex fc-uploadFile"
                >
                  {{ img.startDate }}<span v-if="img.startDate !== img.endDate">~{{ img.endDate }}</span
                  >/{{ img.parentDeptName || '' }}<span v-if="img.parentDeptName">/</span>{{ img.deptName }}/{{ img.price }}
                </div>
              </div>
            </div>
            <div v-else>
              <a-row style="color: #000;padding-bottom: 5px;">
                <a-col :span="4">
                  金额
                </a-col>
                <a-col :span="5">
                  费用归类
                </a-col>
                <a-col :span="5">
                  财务归类
                </a-col>
                <a-col :span="5">
                  经营归类
                </a-col>
                <a-col :span="5">
                  成本归类
                </a-col>
              </a-row>
              <div class="teacher-info" v-for="(item, index) in text.finSpendingItemSplits" :key="index">
                <a-row>
                  <a-col :span="4">
                    {{ item.splitPrice }}
                  </a-col>
                  <a-col :span="5">
                    {{ item.feeItemName ? item.feeItemName.name : '' }}
                  </a-col>
                  <a-col :span="5">
                    {{ item.financeName ? item.financeName.name : '' }}
                  </a-col>
                  <a-col :span="5">
                    {{ item.operateName ? item.operateName.name : '' }}
                  </a-col>
                  <a-col :span="5">
                    {{ item.costName ? item.costName.name : '' }}
                  </a-col>
                </a-row>
              </div>
            </div>
          </div>
          <!-- 其他 -->
          <div v-else>
            {{ formateValue(text, record) }}
            <!-- <div class="explain-text" v-if="record.showChinese">大写：{{ chinese(record.showChinese, formateValue(text, record)) }}</div> -->
          </div>
        </span>
      </a-table>
    </a-modal>
  </div>
</template>
<script>
import { STable, PermBox } from '@/components'
import { listLogByProcinstId } from '@/api/workFlow/request'
import { getAmountChinese } from '@/assets/utils'
const columns = [
  {
    title: '修改时间',
    key: 'updateTime',
    dataIndex: 'updateTime'
  },
  {
    title: '操作人',
    key: 'operatorName',
    dataIndex: 'operatorName'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
const InfoColumns = [
  {
    title: '明细',
    key: 'key',
    dataIndex: 'key'
  },
  {
    title: '修改字段',
    key: 'name',
    dataIndex: 'name'
  },
  {
    title: '修改前',
    key: 'oldvalue',
    dataIndex: 'oldvalue',
    scopedSlots: { customRender: 'dataList' }
  },
  {
    title: '修改后',
    key: 'newValue',
    dataIndex: 'newValue',
    scopedSlots: { customRender: 'dataList' }
  }
]
export default {
  components: { STable },
  data() {
    return {
      //详情列表
      infoVisible: false,
      infoData: [],
      InfoColumns,
      //修改列表
      columns,
      visible: false,
      procinst: null,
      loadData: parameter => {
        const { page, limit } = parameter
        const pageInfo = { pageNum: page, pageSize: limit }
        let { procinstId } = this.procinst
        return listLogByProcinstId({ procinstId }).then(res => {
          return res
        })
      }
    }
  },
  created() {},
  computed: {},
  methods: {
    chinese(showChinese, value) {
      return showChinese ? getAmountChinese(value) : ''
    },
    //查看详情
    getInfo(record) {
      let { oldFowVal, newFowVal, finishedEditableData } = record
      this.formateData(JSON.parse(oldFowVal), JSON.parse(newFowVal), finishedEditableData)
    },
    formateData(record, newRecord, finishedEditableData) {
      let list0 = [] //非明细数据
      let list1 = [] //明细数据
      let infoVmodel = ''
      let infoData = []
      let { fields } = record
      fields.forEach(item => {
        if (finishedEditableData.includes(item.formId)) {
          if (item.tag == 'fc-input-table') {
            infoVmodel = item.vModel
            infoData = item.children
          } else {
            if (this.compareValue(record[item.vModel], newRecord[item.vModel], item)) {
              list0.push({
                key: 0,
                name: item.label,
                oldvalue: record[item.vModel],
                newValue: newRecord[item.vModel],
                tag: item.tag,
                showChinese: item.showChinese || null
              })
            }
          }
        }
      })
      infoData.forEach(item => {
        if (finishedEditableData.includes(item.formId)) {
          newRecord[infoVmodel].forEach((col, colIndex) => {
            if (this.compareValue(record[infoVmodel][colIndex][item.vModel], col[item.vModel], item)) {
              list1.push({
                key: colIndex + 1,
                name: item.label,
                oldvalue: record[infoVmodel][colIndex][item.vModel],
                newValue: col[item.vModel],
                tag: item.tag,
                showChinese: item.showChinese || null
              })
            }
            if (item.tag == 'fc-select-feeType') {
              if (this.compareValue(record[infoVmodel][colIndex][item.vModel], col[item.vModel], item, true)) {
                list1.push({
                  key: colIndex + 1,
                  name: '分摊',
                  oldvalue: record[infoVmodel][colIndex][item.vModel],
                  newValue: col[item.vModel],
                  tag: item.tag,
                  showChinese: item.showChinese || null,
                  isSplit: true
                })
              }
            }
          })
        }
      })
      this.infoData = list0.concat(list1)
      this.infoData.forEach((item, index) => {
        item.index = index
      })
      this.infoVisible = true
    },
    compareValue(data, newData, conf, isSplit) {
      if (data instanceof Object) {
        if (conf.tag == 'fc-select-feeType') {
          let flag = false
          if (isSplit) {
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
              flag = true
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
                    flag = true
                  }
                })
              })
            }
          } else {
            let feeItemId = []
            if (data.finSpendingItemSplits.length != newData.finSpendingItemSplits.length) return true
            data.finSpendingItemSplits.forEach(item => {
              feeItemId.push(item.feeItemId)
            })
            newData.finSpendingItemSplits.forEach((item, index) => {
              if (item.splitPrice != data.finSpendingItemSplits[index].splitPrice) flag = true
              if (!feeItemId.includes(item.feeItemId)) flag = true
            })
          }
          return flag
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
          conf.tag == 'fc-select-finance' ||
          conf.tag == 'fc-select-employee' ||
          conf.tag == 'fc-api-select'
        ) {
          return data.id != newData.id
        }

        if (conf.tag == 'fc-select-bank') {
          return data.name != newData.name
        }
        // if (conf.tag == 'fc-uploadFile') {
        //   return this.formateArray(data, 'name')
        // }
        // if (conf.tag == 'fc-select-school') {
        //   return data.name + '/' + data.areaName + '/' + data.companyName
        // }
        // if (conf.tag == 'fc-apportion') {
        // }
      } else {
        return data != newData
      }
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
    // 弹框字段,验证规则
    open(data) {
      this.procinst = data
      this.visible = true
    },
    handleOk() {
      this.infoVisible = false
      this.infoData = []
    },
    handleCancel() {
      this.visible = false
      this.procinst = null
    }
  }
}
</script>

<style lang="less" type="text/less" scoped></style>
