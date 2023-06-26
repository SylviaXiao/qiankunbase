<template>
  <div class="refund-detail-print-wrapper">
    <div style="text-align:right;">
      <a-button ref="printBtn" type="primary" @click="print">打印</a-button>
    </div>
    <div ref="printHtml">
      <div class="title mb20">
        {{ title }}
      </div>
      <table class="table">
        <tr>
          <th>学员姓名</th>
          <td colspan="3">{{refundInfo.studentName}}</td>
        </tr>
        <tr>
          <th>办卡日期</th>
          <td>{{$tools.tailor.getDate(refundInfo.cardCreatDate)}}</td>
          <th>办卡金额</th>
          <td>{{refundInfo.cardPrice}}元</td>
        </tr>
        <tr>
          <th>扣费合计</th>
          <td>{{refundInfo.deductTotal}}元</td>
          <th>退费金额</th>
          <td>{{refundInfo.refundPrice}}元</td>
        </tr>
        <tr>
          <th>退费原因</th>
          <td>{{refundInfo.refundReason}}</td>
          <th>备注</th>
          <td>{{refundInfo.refundRemark}}</td>
        </tr>
        <tr>
          <th rowspan="5">转账方式</th>
          <td>收款人户名</td>
          <td colspan="2">{{refundInfo.bankUserName}}</td>
        </tr>
        <tr>
          <td>开户行</td>
          <td colspan="2">{{refundInfo.bank}}</td>
        </tr>
        <tr>
          <td>银行卡号</td>
          <td colspan="2">{{refundInfo.bankNo}}</td>
        </tr>
        <tr>
          <td>与收款人关系</td>
          <td colspan="2">{{refundInfo.userRelate}}</td>
        </tr>
        <tr>
          <td>备注</td>
          <td colspan="2">{{refundInfo.userRelateRemark}}</td>
        </tr>
        <tr>
          <th>退费日期</th>
          <td v-if="code === '004'">{{$tools.tailor.getDate(refundInfo.creatDate)}}</td>
          <td v-if="code === '005'">{{$tools.tailor.getDate(formDatas.createDate)}}</td>
          <th>学员签字</th>
          <td></td>
        </tr>
        <tr>
          <th>签字盖章</th>
          <td colspan="3"></td>
        </tr>
      </table>
    </div>
    <div class="mt20" v-if="code === '005'">
      请选择要打印的卡：
      <a-radio-group :options="refundOptions" v-model="refundIndex" />
    </div>
  </div>
</template>

<script>
  import html2canvas from 'html2canvas'
  import printJs from 'print-js'

  export default {
    props: ['code', 'title', 'formDatas', 'confGlobal', 'createTime'],
    data() {
      return {
        refundIndex: 0
      }
    },
    computed: {
      refundInfo() {
        if (this.code === '004') return this.formDatas || {}
        if (this.code === '005') return this.formDatas.refundInfo && this.formDatas.refundInfo[this.refundIndex] || {}
        return {}
      },
      refundOptions() {
        if (this.code === '005') return this.formDatas.refundInfo && this.formDatas.refundInfo.map((item, index) => ({ label: item.cardNo.name, value: index })) || []
        return []
      }
    },
    methods: {
      print() {
        html2canvas(this.$refs.printHtml, {
          useCORS: true,
          scale: 2,
          dpi: 150
        })
          .then(canvas => {
            const printable = canvas.toDataURL()
            printJs({ printable, type: 'image' })
          })
          .catch(err => console.log(err))
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  .refund-detail-print-wrapper {
    width: 1000px;
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;

    .title {
      text-align: center;
      line-height: 50px;
      font-weight: 700;
      font-size: 18px;
    }

    .table {
      width: 100%;
      table-layout: fixed;
      word-break: break-all;
      border-collapse: collapse;
      border-spacing: 0;
      background: #FFF;
      border: 1px solid #999;

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
        padding: 16px 5px !important;
        word-wrap: break-word;
        word-break: break-all;
        border: 1px solid #999;

        &.gray {
          background: #D9D9D9;
        }
      }

      th {
        font-weight: bold;
        background: #f2f2f2;
        justify-content: center;
        text-align: center;
      }

      td {
      }
    }
  }
</style>
