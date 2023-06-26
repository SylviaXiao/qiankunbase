<template>
  <div>
    <h3 style="text-align: center;">{{ procinst.procdefName }}</h3>
    <h4 v-if="procinst.createUserName" style="text-align: center;">提交人：{{ procinst.createUserName }}</h4>
    <h4 v-if="procinst.branchName" style="text-align: center;">提交分馆：{{ procinst.branchName }}</h4>
    <h4 v-if="procinst.procinstNo" style="text-align: center;">单号：{{ procinst.procinstNo }}</h4>
    <div class="detail-header">
      <div class="title">
        标题：{{formData.title}}
      </div>
    </div>
    <div class="mt10" v-if="handleShowField('createDate')">
      提交日期：{{formData.createDate}}
    </div>
    <div class="mt10" v-if="handleShowField('initiator')">
      提交分馆：{{formData.initiator && formData.initiator.name}}
    </div>
    <div class="mt10" v-if="handleShowField('totalMoney')">
      合计总额：{{formData.totalMoney}}
    </div>
    <div class="upload-wrap mt10 mb20">
      <div>上传附件：</div>
      <div class="upload-list">
        <div v-for="(item, index) in formData.attachmentList" :key="index">
          {{item.name}}
          <a class="ml20" @click="handlePreview(item.uid)">预览</a>
          <a class="ml20" @click="handleDownload(item)">下载</a>
        </div>
      </div>
    </div>
    <div>
      <table class="table" v-for="(record, index) in formData.refundInfo" :key="index">
        <!-- 核心情况 -->
        <tr>
          <th class="col1 bold" :rowspan="4">核心情况</th>
          <th class="col2">姓名/手机号</th>
          <td class="col3">
            <a @click="handleIncomeDetailed(record.phone)">{{record.studentName}}/{{record.phone}}</a>
          </td>
          <td class="col4">
            <a @click="handleExpenseRecord(record.cardNo.id, 2)" v-if="roleName && roleName != '馆长'">历史退费合计</a>
          </td>
        </tr>
        <tr>
          <th class="col2">卡号</th>
          <td class="col3">
            <a @click="handleStudentInfo(record.studentId, 2)">{{record.cardNo.name}}</a>
          </td>
          <td class="col4"><a @click="handleModifyRecord(record.studentId, record.cardNo.id)">详情</a></td>
        </tr>
        <tr>
          <th class="col2">卡种</th>
          <td class="col3">{{record.cardName}}</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2 bold">退费金额</th>
          <td class="col3 bold">{{record.refundPrice}}</td>
          <td class="col4"></td>
        </tr>
        <!-- 其他情况 -->
        <tr>
          <th class="col1 bold" :rowspan="12">其他情况</th>
          <th class="col2">原价/应收/优惠/实收</th>
          <td class="col3">
            <a @click="handleExpenseRecord(record.cardNo.id, 1)">
              {{record.originalPrice}}/{{record.totalPrice}}/{{record.discount}}/{{record.paidPrice}}
            </a>
          </td>
          <td class="col4">
            卡价值：{{record.cardValue}}
            <span v-if="record.changeCard && record.changeCard.id">（结转）</span>
          </td>
        </tr>
        <tr>
          <th class="col2">办卡/开卡时间</th>
          <td class="col3">
            {{$tools.tailor.getDate(record.cardCreatDate)}}/{{$tools.tailor.getDate(record.activeDate)}}
          </td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2 bold">办卡金额</th>
          <td class="col3 bold">{{record.cardPrice}}</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2">上课情况</th>
          <td class="col3"><a @click="handleSignRecord(record.cardNo.id)">{{record.clasSituation}}({{record.activDay || 0}}天)</a></td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2 bold">扣除课耗/计算方式</th>
          <td class="col3 bold">{{record.consumePrice || 0}} ({{record.consumePriceRule}})</td>
          <td class="col4 bold">
            <template v-if="handleShowField('refundInfo.defaultConsumePrice')">
              {{record.defaultConsumePrice || 0}}
            </template>
            <template v-if="handleShowField('refundInfo.defaultConsumeCalculation')">
              ({{record.defaultConsumeCalculation}})
            </template>
          </td>
        </tr>
        <tr>
          <th class="col2 bold">学籍管理费/计算方式</th>
          <td class="col3 bold">{{record.extraPrice || 0}} ({{record.extraPriceRule}})</td>
          <td class="col4 bold">
            <template v-if="handleShowField('refundInfo.defaultExtraPrice')">
              {{record.defaultExtraPrice || 0}}
            </template>
            <template v-if="handleShowField('refundInfo.defaultExtraCalculation')">
              ({{record.defaultExtraCalculation}})
            </template>
          </td>
        </tr>
        <tr>
          <th class="col2 bold">扣费合计</th>
          <td class="col3 bold">{{record.deductTotal}}</td>
          <td class="col4 bold">
            <template v-if="handleShowField('refundInfo.defaultDeductTotal')">
              {{record.defaultDeductTotal}}
            </template>
          </td>
        </tr>
        <tr>
          <th class="col2">退费原因</th>
          <td class="col3">{{record.refundReason}}</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2">备注</th>
          <td class="col3">{{record.refundRemark}}</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2">上课/办卡分馆</th>
          <td class="col3">{{record.deptSituation}}</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2">所属顾问</th>
          <td class="col3">{{record.adviserName}}</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2">大班型/小班型/舞种</th>
          <td class="col3">{{record.eduType}}/{{record.dance}}</td>
          <td class="col4"></td>
        </tr>
        <!-- 特殊情况 -->
        <tr>
          <th class="col1 bold" :rowspan="3">特殊情况</th>
          <th class="col2">是否开票</th>
          <td class="col3"><a @click="handleInvoiceManage(record.phone)">开票详情</a></td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2">是否转卡</th>
          <td class="col3">
            <a
              v-if="record.changeCard && record.changeCard.id && record.changeCard.id != record.studentId"
              @click="handleStudentInfo(record.changeCard.id)"
            >
              {{record.changeCard.name}}
            </a>
            <div v-else>否</div>
          </td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2">是否业绩减半扣除</th>
          <td class="col3">{{record.allowHalfAchievement}}</td>
          <td class="col4">
            <template v-if="handleShowField('refundInfo.defaultHalfAchievement')">
              {{record.defaultHalfAchievement}}
            </template>
          </td>
        </tr>
        <!-- 退费分单情况 -->
        <tr>
          <th class="col1 bold" :rowspan="4">退费分单情况</th>
          <th class="col2">资源来源</th>
          <td class="col3">{{record.source.name}}</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2 bold">顾问业绩</th>
          <td class="col3 bold">
            <template v-if="record.adviserPerList">
              <div v-for="(item, index) in record.adviserPerList" :key="index" v-if="item.adviserDept && item.adviser">
                {{item.adviserDept | nameFilter}}/{{item.adviser | nameFilter}}/{{item.adviserPrice}}<span v-if="item.leaveDate">/<span style="color: red">{{item.leaveDate}}</span></span>
              </div>
            </template>
          </td>
          <td class="col4 bold">
            <template v-if="handleShowField('refundInfo.defaultAdviserPerList') && record.defaultAdviserPerList">
              <div v-for="(item, index) in record.defaultAdviserPerList" :key="index" v-if="item.adviserDept && item.adviser">
                {{item.adviserDept | nameFilter}}/{{item.adviser | nameFilter}}/{{item.adviserPrice}}
              </div>
            </template>
          </td>
        </tr>
        <tr>
          <th class="col2 bold">导师业绩</th>
          <td class="col3 bold">
            <template v-if="record.teacherPerList">
              <div v-for="(item, index) in record.teacherPerList" :key="index" v-if="item.teacherDept && item.teacher && item.ratio">
                {{item.teacherDept | nameFilter}}/{{item.teacher | nameFilter}}/{{item.teacherPrice}}/{{item.ratio}}%
              </div>
            </template>
          </td>
          <td class="col4 bold">
            <template v-if="handleShowField('refundInfo.defaultTeacherPerList') && record.defaultTeacherPerList">
              <div v-for="(item, index) in record.defaultTeacherPerList" :key="index" v-if="item.teacherDept && item.teacher && item.ratio">
                {{item.teacherDept | nameFilter}}/{{item.teacher | nameFilter}}/{{item.teacherPrice}}/{{item.ratio}}%
              </div>
            </template>
          </td>
        </tr>
        <tr>
          <th class="col2 bold">业绩合计</th>
          <td class="col3 bold">{{perSum(record)}}</td>
          <td class="col4 bold">
            <template v-if="handleShowField('refundInfo.defaultPerToatlPrice')">
              {{record.refundPrice}}
            </template>
          </td>
        </tr>
        <!-- 收款人信息 -->
        <tr>
          <th class="col1 bold" :rowspan="5">收款人信息</th>
          <th class="col2">收款人户名</th>
          <td class="col3">{{record.bankUserName}}</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2">开户行</th>
          <td class="col3">{{record.bank}}</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2">银行卡号</th>
          <td class="col3">{{record.bankNo}}</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2">与收款人关系</th>
          <td class="col3">{{record.userRelate}}</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2">备注</th>
          <td class="col3">{{record.userRelateRemark}}</td>
          <td class="col4"></td>
        </tr>
      </table>
      <div class="mt10" v-if="handleShowField('refundPaidDept')">
        付款分馆：{{formData.refundPaidDept && formData.refundPaidDept.name}}
      </div>
      <div class="mt10" v-if="handleShowField('refundPaidPrice')">
        付款金额：{{formData.refundPaidPrice}}
      </div>
      <div class="mt10" v-if="handleShowField('refundPaidBank')">
        打款账户：{{formData.refundPaidBank && formData.refundPaidBank.name}}
      </div>
      <div class="mt10" v-if="handleShowField('paidDate')">
        付款时间：{{formData.paidDate}}
      </div>
    </div>

    <ImagePreview ref="imagePreview" />
    <RefundModifyRecord ref="refundModifyRecord" />
    <ExpenseRecord ref="expenseRecord" />
    <SignRecord ref="signRecord" />
    <InvoiceManage ref="invoiceManage" />
  </div>
</template>

<script>
  import { ImagePreview } from '@/components'
  import { downloadFiles } from '@/api/file'
  import RefundModifyRecord from './RefundModifyRecord'
  import ExpenseRecord from './ExpenseRecord'
  import SignRecord from './SignRecord'
  import InvoiceManage from './InvoiceManage'

  export default {
    props: {
      procinst: {
        type: Object,
        default: () => {}
      },
      node: {
        type: Object,
        default: () => {}
      },
      fields: {
        type: Array,
        default: () => []
      },
      formData: {
        type: Object,
        default: () => {}
      }
    },
    components: {
      ImagePreview,
      RefundModifyRecord,
      ExpenseRecord,
      SignRecord,
      InvoiceManage
    },
    data() {
      return {
        roleVisible: false
      }
    },
    filters: {
      nameFilter(item) {
        return item ? item.name : ''
      }
    },
    computed: {
      roleName() {
        return this.node?.content ? JSON.parse(this.node.content)[0] : ''
      }
    },
    methods: {
      // 业绩合计
      perSum(record) {
        const { adviserPerList, teacherPerList } = record
        let sum = 0
        if (Array.isArray(adviserPerList)) {
          sum = adviserPerList.map(data => data.adviserPrice).reduce((a, b) => this.$number(a).plus(b), this.$number(0))
        }
        if (Array.isArray(teacherPerList) && sum === 0) {
          sum = teacherPerList.map(data => data.teacherPrice).reduce((a, b) => this.$number(a).plus(b), this.$number(0))
        }
        return sum
      },
      handleShowField(fieldName) {
        if (!this.fields) return false
        const [vModel, childModel] = fieldName.split('.')
        const field = childModel
          ? this.fields.find(d => d.vModel === vModel).children.find(d => d.vModel === childModel)
          : this.fields.find(d => d.vModel === vModel)
        return field ? field.show && !field.hidden : true
      },
      handlePreview(id) {
        this.$refs.imagePreview.open(id)
      },
      handleDownload({ uid, name }) {
        downloadFiles({ fileId: uid }).then(res => {
          const a = document.createElement('a')
          a.download = name
          a.href = res.data
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          window.URL.revokeObjectURL(a.href)
        })
      },
      handleStudentInfo(studentId, tabKey = 1) {
        const href = `${process.env.VUE_APP_WEB_URL}/reception/studentInfo/${studentId}/${tabKey}`
        window.open(href, '_blank')
      },
      handleIncomeDetailed(phone) {
        const href = `${process.env.VUE_APP_WEB_URL}/finance/detailed/${phone}`
        window.open(href, '_blank')
      },
      handleModifyRecord(studentId, studentCardId) {
        this.$refs.refundModifyRecord.open({ studentId, studentCardId })
      },
      handleExpenseRecord(studentCardId, type) {
        this.$refs.expenseRecord.open({ studentCardId, type })
      },
      handleSignRecord(studentCardId) {
        this.$refs.signRecord.open(studentCardId)
      },
      handleInvoiceManage(phone) {
        this.$refs.invoiceManage.open(phone)
      }
    }
  }
</script>
<style lang="less" type="text/less" scoped>
  .detail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
  }

  .upload-wrap {
    display: flex;

    .upload-list {
      display: flex;
      flex-direction: column;
    }
  }

  .table {
    width: 100%;
    table-layout: fixed;
    word-break: break-all;
    border-collapse: collapse;
    border-spacing: 0;
    background: #FFF;
    border: 1px solid #999;
    margin-bottom: 20px;

    tr {
      text-align: center;

      &.row-hover {
        transition: background 0.3s;

        &:hover {
          background: #c4f7dd;
        }
      }
    }

    th,
    td {
      color: rgba(0, 0, 0, 0.85);
      font-weight: 400;
      padding: 0.12rem 0.05rem !important;
      border: 1px solid #999;

      &.gray {
        background: #D9D9D9;
      }
    }

    .bold {
      font-weight: bold;
    }

    .col1, .col2 {
      width: 15%;
    }

    .col3, .col4 {
      width: 35%;
    }
  }
</style>
