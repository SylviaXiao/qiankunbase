<template>
  <div class="mt20">
    <a-card :bordered="false">
      <div class="mt10 mb10 flex" style="justify-content:space-between;">
        <span>上传发票</span>
        <a-button type="primary" @click.native="toSubmit" class="mr20">
          提交
        </a-button>
      </div>
      <div style="width:100%;overflow-x:scroll;">
        <div style="display:flex;color: rgba(0, 0, 0, 0.85);font-weight: 500;height:46px;line-height:46px;background: #fafafa;width:100%;min-width:1350px;">
          <div
            v-for="(item, index) in columns"
            :key="index"
            :style="`width:${item.width}px;flex:${item.dataIndex == 'order' ? 0.5 : item.dataIndex == 'fpIdentificationName' ? 2 : 1};`"
          >
            {{ item.title }}
          </div>
        </div>
        <div>
          <div
            v-for="(item, index) in loadData"
            :key="index"
            style="width:100%;min-width:1350px;display:flex;cursor:pointer; padding: 10px 0;"
            @click="reviewRecord(item, index)"
          >
            <div
              v-for="(col, colIndex) in columns"
              :key="colIndex"
              :style="`width:${item.width}px;flex:${col.dataIndex == 'order' ? 0.5 : col.dataIndex == 'fpIdentificationName' ? 2 : 1};`"
            >
              <div v-if="col.scopedSlots.customRender == 'order'">
                {{ index + 1 }}
              </div>
              <div v-if="col.scopedSlots.customRender == 'invoiceType'">
                {{
                  item[col.dataIndex] == 'A'
                    ? '增值税专用发票'
                    : item[col.dataIndex] == 'B'
                    ? '增值税普通发票'
                    : item[col.dataIndex] == 'C'
                    ? '定额发票'
                    : item[col.dataIndex] == 'D'
                    ? '的士票'
                    : ''
                }}
              </div>
              <div v-if="col.scopedSlots.customRender == 'edit'">
                {{ item[col.dataIndex] }}
              </div>
              <div v-if="col.scopedSlots.customRender == 'action'">
                <a href="#" @click="handleDelete(index)"> 删除</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-card>
    <a-card :bordered="false">
      <div class="mt10 mb10 flex" style="justify-content:space-between;">
        <span>发票明细</span>
        <a-button type="primary" @click.native="clear" class="mr20">
          新增
        </a-button>
      </div>
      <div>
        <div class="mb20">
          <a-radio-group default-value="a" button-style="solid" @change="radioChange" v-model="type">
            <a-radio-button value="a">
              普通发票
            </a-radio-button>
            <a-radio-button value="b">
              其他发票
            </a-radio-button>
          </a-radio-group>
        </div>
        <div>
          <a-form :form="form">
            <a-row>
              <a-col :span="9">
                <a-form-item label="发票类型" v-bind="formItemLayout" v-if="type == 'a'">
                  <a-select v-decorator="['invoiceType', { rules: [{ required: true, message: '请选择发票类型' }] }]" placeholder="请选择发票类型">
                    <a-select-option value="A">
                      增值税专用发票
                    </a-select-option>
                    <a-select-option value="B">
                      增值税普通发票
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="发票类型" v-bind="formItemLayout" v-if="type == 'b'">
                  <a-select v-decorator="['invoiceType', { rules: [{ required: true, message: '请选择发票类型' }] }]" placeholder="请选择发票类型">
                    <a-select-option value="C">
                      定额发票
                    </a-select-option>
                    <a-select-option value="D">
                      的士票
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item v-bind="formItemLayout" label="公司名称">
                  <a-input
                    :disabled="formValue.fpStatus == '已验真' && type == 'a'"
                    v-decorator="[
                      'fpIdentificationName',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入公司名称'
                          }
                        ]
                      }
                    ]"
                  />
                </a-form-item>
                <a-form-item v-bind="formItemLayout" label="发票号码" v-if="type == 'a'">
                  <a-input-number
                    :disabled="formValue.fpStatus == '已验真' && type == 'a'"
                    style="width:100%"
                    v-decorator="[
                      'fpInvoiceNo',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入发票号码'
                          }
                        ]
                      }
                    ]"
                  />
                </a-form-item>
                <a-form-item v-bind="formItemLayout" label="开票代码" v-if="type == 'a'">
                  <a-input
                    :disabled="formValue.fpStatus == '已验真' && type == 'a'"
                    v-decorator="[
                      'fpInvoiceCode',
                      {
                        rules: [
                          {
                            required: true,
                            message: ' '
                          }, { validator: verifyNumberandLetter }
                        ]
                      }
                    ]"
                  />
                </a-form-item>
                <a-form-item v-bind="formItemLayout" label="开票日期" v-if="type == 'a'">
                  <a-date-picker
                    :disabled="formValue.fpStatus == '已验真' && type == 'a'"
                    format="YYYY-MM-DD"
                    valueFormat="YYYY-MM-DD"
                    placeholder="请选择开票日期"
                    style='width:100%;'
                    v-decorator="['fpDate', { rules: [{ required: true, message: '请选择开票日期' }] }]"
                  />
                </a-form-item>
                <a-form-item v-bind="formItemLayout" label="金额">
                  <a-input-number
                    style="width:100%"
                    :disabled="formValue.fpStatus == '已验真' && type == 'a'"
                    v-decorator="[
                      'fpAmount',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入金额'
                          }
                        ]
                      }
                    ]"
                  />
                </a-form-item>
                <a-form-item v-bind="formItemLayout" label="校验码" v-if="type == 'a'">
                  <a-input
                    :disabled="formValue.fpStatus == '已验真' && type == 'a'"
                    v-decorator="[
                      'fpCode',
                      {
                        rules: [
                          {
                            required: true,
                            message: ' '
                          }, { validator: verifyNumberandLetter }
                        ]
                      }
                    ]"
                  />
                </a-form-item>
                <a-form-item v-bind="formItemLayout" label="是否验真" v-if="type == 'a'">
                  <a-input
                    :disabled="true"
                    v-decorator="[
                      'fpStatus',
                      {
                        rules: [
                          {
                            required: false,
                            message: ''
                          }
                        ]
                      }
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="15">
                <a-row>
                  <a-col :span="6">
                    <div style="text-align:right;line-height:40px;padding-right:10px;"><span class="required"></span>发票上传:</div></a-col
                  >
                  <a-col :span="18">
                    <a-form-item v-bind="formItemLayout1" label="">
                      <UploadSth
                        @uploadFilesSubmit="checkForm"
                        @changeValue="changeValue"
                        btnText="请选择本地文件"
                        :accept="'image/png, image/jpeg, application/pdf'"
                        ref="uploadSth"
                        :filePath="type == 'a' ? 'e-invoice' : 'e-invoice-other'"
                        formText="请选择本地文件"
                        :multiple="false"
                        :uploadFileType="type == 'a' ? 'invoice' : 'others'"
                        :value="fileIds"
                        style="margin-top: -0.05rem"
                        :disabled="false"
                      ></UploadSth>
                      <!-- :style="`transform:rotate(${reverse}deg);`" -->
                    </a-form-item>
                  </a-col>
                </a-row>

                <div v-for="(item, index) in fileIds" :key="index" style="padding:0 20px 20px 20px;">
                  <div class="ml20" v-if="item.type == 'application/pdf'">
                    <a v-if="item.imageUrl" href="javascript:;" @click="openPreviewModal(item)">预览Pdf</a>
                  </div>
                  <div v-else style="position:relative;width: 100%;max-width:600px;">
                    <img :src="item.imageUrl" class="reverseImg" style="width: 100%;" ref="previewImg" />
                    <img
                      v-if="formValue.fpStatus == '已验真'"
                      width="17px"
                      src="~@/assets/invoice/checked.png"
                      class="icon"
                      style="padding:0;width:70px;position:absolute;right:-30px;top:-20px;"
                    />
                  </div>
                </div>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="9"> </a-col>
              <a-col :span="15">
                <div class="flex" style="justify-content:flex-end;">
                  <a-button type="primary" @click="submit" style="background:#1890ff;">
                    确定
                  </a-button>
                </div></a-col
              >
            </a-row>
          </a-form>
        </div>
      </div>
    </a-card>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" :width="1000" title="预览PDF" @cancel="handleCancel" :visible="visible" :footer="false">
      <Pdf :url="imgRecord.imageUrl"></Pdf
    ></a-modal>
  </div>
</template>
<script>
import UploadSth from './UploadSth'
import { saveInvoice } from '@/api/invoice'
import Pdf from '@/components/FormControls/returnPremine/uploadFile/Pdf.vue'
export default {
  name: 'uploadMyInvoice',
  components: { UploadSth, Pdf },
  data() {
    const columns = [
      {
        title: '序号',
        align: 'center',
        dataIndex: 'order',
        width: 50,
        scopedSlots: { customRender: 'order' }
      },
      {
        title: '发票类型',
        align: 'center',
        dataIndex: 'invoiceType',
        width: 150,
        scopedSlots: { customRender: 'invoiceType' }
      },
      {
        title: '发票号码',
        align: 'center',
        dataIndex: 'fpInvoiceNo',
        width: 150,
        scopedSlots: { customRender: 'edit' }
      },
      {
        title: '开票代码',
        align: 'center',
        dataIndex: 'fpInvoiceCode',
        width: 150,
        scopedSlots: { customRender: 'edit' }
      },
      {
        title: '是否验真',
        align: 'center',
        dataIndex: 'fpStatus',
        width: 150,
        scopedSlots: { customRender: 'edit' }
      },
      {
        title: '开票日期',
        align: 'center',
        dataIndex: 'fpDate',
        width: 150,
        scopedSlots: { customRender: 'edit' }
      },
      {
        title: '金额',
        align: 'center',
        dataIndex: 'fpAmount',
        width: 150,
        scopedSlots: { customRender: 'edit' }
      },
      {
        title: '校验码',
        align: 'center',
        dataIndex: 'fpCode',
        width: 150,
        scopedSlots: { customRender: 'edit' }
      },
      {
        title: '开票名称',
        align: 'center',
        dataIndex: 'fpIdentificationName',
        width: 250,
        scopedSlots: { customRender: 'edit' }
      },
      {
        title: '操作',
        align: 'center',
        dataIndex: 'action',
        width: 50,
        scopedSlots: { customRender: 'action' }
      }
    ]
    return {
      index: 0,
      title: 'add',
      type: 'a',
      formValue: {},
      imgRecord: {},
      fileIds: [],
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      },
      formItemLayout1: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 }
        }
      },
      columns, //表内容
      loadData: [],
      visible: false
    }
  },
  created() {
    this.form = this.$form.createForm(this)
    // type
  },
  computed: {},
  methods: {
    verifyNumberandLetter(rule, value, callback) {
      let reg =  new RegExp(/^[a-zA-Z0-9]{1,20}$/);
      if(reg.test(value)){
        callback()
      }else{
        callback('请输入数字或者字母')
      }
    },
    verifyNumber(rule, value, callback) {
      let reg =  new RegExp(/^[0-9]{1,20}$/);
      if(reg.test(value)){
        callback()
      }else{
        callback('请输入数字或者字母')
      }
    },
    handleDelete(index) {
      this.loadData.splice(index, 1)
    },
    reviewRecord(record, index) {
      this.title = 'edit'
      this.index = index
      if (record.invoiceType == 'A' || record.invoiceType == 'B') {
        this.type = 'a'
      } else {
        this.type = 'b'
      }
      this.fileIds = [record]
      this.formValue = record
      let that = this
      setTimeout(() => {
        that.setFormValue(record)
      }, 500)
    },
    clear() {
      this.title = 'add'
      this.form.resetFields()
      this.fileIds = []
      this.formValue = {}
    },
    radioChange(e) {
      this.type = e.target.value
      this.clear()
    },
    handleCancel() {
      this.visible = false
    },
    openPreviewModal(record) {
      this.imgRecord = record
      this.visible = true
    },
    isImg(data) {
      this.type = data
      let arr = ['image/png', 'image/jpeg', 'application/pdf']
      if (arr.includes(data)) {
        return true
      } else {
        return false
      }
    },
    checkForm(data) {
      return new Promise((resolve, reject) => {
        this.$refs.uploadSth
          .multipleHandleUpload()
          .then(res => {
            if (res) {
              this.changeValue(res.data)
            } else {
              this.fileIds = []
              this.$emit('change', [])
            }
          })
          .catch(err => {})
      })
    },
    changeValue(data) {
      if (data) {
        let invoiceType = this.form.getFieldValue('invoiceType')
        let fpIdentificationName = this.form.getFieldValue('fpIdentificationName')
        let fpAmount = this.form.getFieldValue('fpAmount')
        let arr = data.map(t => {
          let obj = {
            uid: t.uid,
            name: t.name,
            status: t.status,
            type: t.type,
            size: t.size,
            fileId: t.fileId,
            fpStatus: t.fpStatus ? (t.fpStatus == '已验真' ? t.fpStatus : '未验真') : '',
            imageUrl: t.imageUrl || '',
            invoiceType: invoiceType || '',
            fpDate: t.fpDate?.replace('年','-').replace('月','-').replace('日','') || '',
            fpInvoiceNo: t.fpInvoiceNo || '',
            fpInvoiceCode: t.fpInvoiceCode || '',
            fpName: t.fpName || '',
            fpAmount: t.fpAmount?.split('¥')[1] || fpAmount || '',
            fpIdentificationName: t.fpIdentificationName || fpIdentificationName || '',
            fpCode: t.fpCode || '',
            fpIdentificationNumber: t.fpIdentificationNumber || '',
            fpType: t.fpType || ''
          }
          return obj
        })
        let arr1 = []
        for (const element of arr) {
          if (!element.uid || (element.uid && element.uid.indexOf('vc-upload') !== -1)) {
            continue
          }
          arr1.push(element)
        }
        if (arr1.length > 0) {
          this.fileIds = arr1
          this.formValue = arr1[0]
          this.setFormValue(this.formValue)
        }
      } else {
        // this.fileIds = []
        // this.formValue = {}
      }
    },
    setFormValue(t) {
      let formValue = {
        fpDate: t.fpDate || '',
        fpInvoiceNo: t.fpInvoiceNo || '',
        fpInvoiceCode: t.fpInvoiceCode || '',
        fpAmount: t.fpAmount || '',
        fpStatus: t.fpStatus || '',
        fpIdentificationName: t.fpIdentificationName || '',
        fpCode: t.fpCode || '',
        invoiceType: t.invoiceType || ''
      }
      this.form.setFieldsValue(formValue)
    },
    submit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          let { companyName } = this.$route.params
          if (values.fpIdentificationName !== companyName) {
            this.$notification['error']({
              message: '系统通知',
              description: `公司名称必须是：${companyName}`
            })
            return
          }
          if (!this.formValue.fileId) {
            this.$notification['error']({
              message: '系统通知',
              description: '请上传发票!'
            })
            return
          }
          if (this.title == 'add') {
            let idx = this.loadData.findIndex(
              c =>
                this.formValue.fpInvoiceCode &&
                this.formValue.fpInvoiceNo &&
                c.fpInvoiceNo === this.formValue.fpInvoiceNo &&
                c.fpInvoiceCode === this.formValue.fpInvoiceCode
            )
            if (idx != -1) {
              this.$notification['error']({
                message: '系统通知',
                description: '发票重复'
              })
              return
            }
            this.loadData.push(Object.assign(this.formValue, values))
          } else {
            this.loadData[this.index] = Object.assign(this.formValue, values)
            this.$forceUpdate()
          }

          this.clear()
        }
      })
    },
    toUploadInvoice() {},
    toSubmit() {
      let { createUser, createUserName } = this.$route.params
      if (this.loadData.length > 0) {
        let arr = this.loadData.map(t => {
          let obj = {
            createUser: createUser,
            createUserName: createUserName,
            invoiceType: t.invoiceType,
            companyName: t.fpIdentificationName || '',
            invoiceNo: t.fpInvoiceNo || '',
            invoiceCode: t.fpInvoiceCode || '',
            checkCode: t.fpCode || '',
            invoiceDate: t.fpDate || '',
            invoiceMoney: t.fpAmount || '',
            invoiceCheck: t.fpStatus || '',
            uploadFileId: t.fileId,
            type: t.type,
            fileName: t.name
          }
          return obj
        })
        let params = arr
        saveInvoice(params).then(res => {
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功!'
          })
          this.clear()
          this.loadData = []
        })
      } else {
        this.$notification['error']({
          message: '系统通知',
          description: '请上传发票!'
        })
      }
    }
  }
}
</script>

<style lang="less" type="text/less" scoped>
@import '~@/assets/style/index';
/deep/.ant-radio-group-solid .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
  color: #fff;
  background: #1890ff;
  border-color: #1890ff;
}
/deep/.ant-radio-button-wrapper:hover {
  position: relative;
  color: #1890ff;
}
.required::before {
  display: inline-block;
  margin-right: 0.04rem;
  color: #f5222d;
  font-size: 0.14rem;
  font-family: SimSun, sans-serif;
  line-height: 1;
  content: '*';
}
</style>
