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
      <table class="table">
        <!-- 核心情况 -->
        <tr>
          <th class="col1 bold" :rowspan="4">核心情况</th>
          <th class="col2">姓名/手机号</th>
          <td class="col3">
            <a @click="handleIncomeDetailed(formData.phone)">{{formData.studentName}}/{{formData.phone}}</a>
          </td>
          <td class="col4">
            <a @click="handleExpenseRecord(2)" v-if="roleName && roleName != '馆长'">历史退费合计</a>
          </td>
        </tr>
        <tr>
          <th class="col2">卡号</th>
          <td class="col3">
            <a @click="handleStudentInfo(formData.studentId, 2)">{{formData.cardNo}}</a>
          </td>
          <td class="col4"><a @click="handleModifyRecord">详情</a></td>
        </tr>
        <tr>
          <th class="col2">卡种</th>
          <td class="col3">{{formData.cardName}}</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2 bold">退费金额</th>
          <td class="col3 bold">{{formData.refundPrice}}</td>
          <td class="col4"></td>
        </tr>
        <!-- 其他情况 -->
        <tr>
          <th class="col1 bold" :rowspan="12">其他情况</th>
          <th class="col2">原价/应收/优惠/实收</th>
          <td class="col3">
            <a @click="handleExpenseRecord(1)">
              {{formData.originalPrice}}/{{formData.totalPrice}}/{{formData.discount}}/{{formData.paidPrice}}
            </a>
          </td>
          <td class="col4">
            卡价值：{{formData.cardValue}}
            <span v-if="formData.changeCard && formData.changeCard.id">（结转）</span>
          </td>
        </tr>
        <tr>
          <th class="col2">办卡/开卡时间</th>
          <td class="col3">
            {{$tools.tailor.getDate(formData.cardCreatDate)}}/{{$tools.tailor.getDate(formData.activeDate)}}
          </td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2 bold">办卡金额</th>
          <td class="col3 bold">{{formData.cardPrice}}</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2">上课情况</th>
          <td class="col3"><a @click="handleSignRecord">{{formData.clasSituation}}({{formData.activDay || 0}}天)</a></td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2 bold">扣除课耗/计算方式</th>
          <td class="col3 bold">{{formData.consumePrice || 0}} ({{formData.consumePriceRule}})</td>
          <td class="col4 bold">
            <template v-if="handleShowField('defaultConsumePrice')">
              {{formData.defaultConsumePrice || 0}}
            </template>
            <template v-if="handleShowField('defaultConsumeCalculation')">
              ({{formData.defaultConsumeCalculation}})
            </template>
          </td>
        </tr>
        <tr>
          <th class="col2 bold">学籍管理费/计算方式</th>
          <td class="col3 bold">{{formData.extraPrice || 0}} ({{formData.extraPriceRule}})</td>
          <td class="col4 bold">
            <template v-if="handleShowField('defaultExtraPrice')">
              {{formData.defaultExtraPrice || 0}}
            </template>
            <template v-if="handleShowField('defaultExtraCalculation')">
              ({{formData.defaultExtraCalculation}})
            </template>
          </td>
        </tr>
        <tr>
          <th class="col2 bold">扣费合计</th>
          <td class="col3 bold">{{formData.deductTotal}}</td>
          <td class="col4 bold">
            <template v-if="handleShowField('defaultDeductTotal')">
              {{formData.defaultDeductTotal}}
            </template>
          </td>
        </tr>
        <tr>
          <th class="col2">退费原因</th>
          <td class="col3">{{formData.refundReason}}</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2">备注</th>
          <td class="col3">{{formData.refundRemark}}</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2">上课/办卡分馆</th>
          <td class="col3">{{formData.deptSituation}}</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2">所属顾问</th>
          <td class="col3">{{formData.adviserName}}</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2">大班型/小班型/舞种</th>
          <td class="col3">{{formData.eduType}}/{{formData.dance}}</td>
          <td class="col4"></td>
        </tr>
        <!-- 特殊情况 -->
        <tr>
          <th class="col1 bold" :rowspan="3">特殊情况</th>
          <th class="col2">是否开票</th>
          <td class="col3"><a @click="handleInvoiceManage">开票详情</a></td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2">是否转卡</th>
          <td class="col3">
            <a
              v-if="formData.changeCard && formData.changeCard.id && formData.changeCard.id != formData.studentId"
              @click="handleStudentInfo(formData.changeCard.id)"
            >
              {{formData.changeCard.name}}
            </a>
            <div v-else>否</div>
          </td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2">是否业绩减半扣除</th>
          <td class="col3">{{formData.allowHalfAchievement}}</td>
          <td class="col4">
            <template v-if="handleShowField('defaultHalfAchievement')">
              {{formData.defaultHalfAchievement}}
            </template>
          </td>
        </tr>
        <!-- 退费分单情况 -->
        <tr>
          <th class="col1 bold" :rowspan="4">退费分单情况</th>
          <th class="col2">资源来源</th>
          <td class="col3">{{formData.source}}</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2 bold">顾问业绩</th>
          <td class="col3 bold">
            <template v-if="formData.adviserPerList">
              <div v-for="(item, index) in formData.adviserPerList" :key="index" v-if="item.adviserDept && item.adviser">
                {{item.adviserDept | nameFilter}}/{{item.adviser | nameFilter}}/{{item.adviserPrice}}<span v-if="item.leaveDate">/<span style="color: red">{{item.leaveDate}}</span></span>
              </div>
            </template>
          </td>
          <td class="col4 bold">
            <template v-if="handleShowField('defaultAdviserPerList') && formData.defaultAdviserPerList">
              <div v-for="(item, index) in formData.defaultAdviserPerList" :key="index" v-if="item.defaultAdviserDept && item.defaultAdviser">
                {{item.defaultAdviserDept | nameFilter}}/{{item.defaultAdviser | nameFilter}}/{{item.defaultAdviserPrice}}
              </div>
            </template>
          </td>
        </tr>
        <tr>
          <th class="col2 bold">导师业绩</th>
          <td class="col3 bold">
            <template v-if="formData.teacherPerList">
              <div v-for="(item, index) in formData.teacherPerList" :key="index" v-if="item.teacherDept && item.teacher && item.ratio">
                {{item.teacherDept | nameFilter}}/{{item.teacher | nameFilter}}/{{item.teacherPrice}}/{{item.ratio}}%
              </div>
            </template>
          </td>
          <td class="col4 bold">
            <template v-if="handleShowField('defaultTeacherPerList') && formData.defaultTeacherPerList">
              <div v-for="(item, index) in formData.defaultTeacherPerList" :key="index" v-if="item.defaultTeacherDept && item.defaultTeacher && item.defaultRatio">
                {{item.defaultTeacherDept | nameFilter}}/{{item.defaultTeacher | nameFilter}}/{{item.defaultPrice}}/{{item.defaultRatio}}%
              </div>
            </template>
          </td>
        </tr>
        <tr>
          <th class="col2 bold">业绩合计</th>
          <td class="col3 bold">{{formData.perToatlPrice}}</td>
          <td class="col4 bold">
            <template v-if="handleShowField('defaultPerToatlPrice')">
              {{formData.refundPrice}}
            </template>
          </td>
        </tr>
        <!-- 收款人信息 -->
        <tr>
          <th class="col1 bold" :rowspan="5">收款人信息</th>
          <th class="col2">收款人户名</th>
          <td class="col3">{{formData.bankUserName}}</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2">开户行</th>
          <td class="col3">{{formData.bank}}</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2">银行卡号</th>
          <td class="col3">{{formData.bankNo}}</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2">与收款人关系</th>
          <td class="col3">{{formData.userRelate}}</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2">备注</th>
          <td class="col3">{{formData.userRelateRemark}}</td>
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
      },
      perSum() {
        const { adviserPerList, teacherPerList } = this.formData
        let sum = 0
        if (Array.isArray(adviserPerList)) {
          sum = adviserPerList.map(data => data.adviserPrice).reduce((a, b) => this.$number(a).plus(b), this.$number(0))
        }
        if (Array.isArray(teacherPerList) && sum === 0) {
          sum = teacherPerList.map(data => data.teacherPrice).reduce((a, b) => this.$number(a).plus(b), this.$number(0))
        }
        return sum
      }
    },
    methods: {
      handleShowField(fieldName) {
        if (!this.fields) return false
        const field = this.fields.find(d => d.vModel === fieldName)
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
      handleModifyRecord() {
        const { studentId, studentCardId } = this.formData
        this.$refs.refundModifyRecord.open({ studentId, studentCardId })
      },
      handleExpenseRecord(type) {
        const { studentCardId } = this.formData
        this.$refs.expenseRecord.open({ studentCardId, type })
      },
      handleSignRecord() {
        const { studentCardId } = this.formData
        this.$refs.signRecord.open(studentCardId)
      },
      handleInvoiceManage() {
        const { phone } = this.formData
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
