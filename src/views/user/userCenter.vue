<template>
  <a-card :bordered="false">
    <a-row :gutter="8">
      <a-col :span="6" style="padding-top: 30px">
        <upload-avator ref="uploadAva" @getFilesId="getFilesId" :userSrc="userSrc" avaType="org-avatar"></upload-avator>
      </a-col>
      <a-col :span="18">
        <a-form :form="userInfoForm">
          <a-list size="large" :dataSource="showUserInfo">
            <a-list-item slot="renderItem" slot-scope="item, index">
              <span class="user-title">{{ item.name }}：</span>
              <span class="user-info" v-if="isEidt && item.edit">
                <a-form-item style="margin: 0; margin-top: 5px">
                  <a-date-picker style="width: 200px" v-decorator="[`${item.key}`]" v-if="item.key == 'userBirthday'" />
                  <a-radio-group
                    v-if="item.key == 'userSex'"
                    :options="[
                      { label: '男', value: 'A' },
                      { label: '女', value: 'B' },
                    ]"
                    v-decorator="[`${item.key}`]"
                  />
                  <a-input
                    style="width: 200px"
                    v-decorator="[
                      `${item.key}`,
                      { rules: [{ validator: item.key == 'userTel' ? verifyUserTel : item.key == 'userIdcard' ? verifyUserIdCard : '' }] },
                    ]"
                    v-if="item.key !== 'userBirthday' && item.key !== 'userSex'"
                  />
                </a-form-item>
              </span>
              <span class="user-info" v-else>{{ item.key == 'userSex' ? (item.value == 'A' ? '男' : '女') : item.value }}</span>
            </a-list-item>
            <div slot="header" style="display: flex; justify-content: space-between">
              <span style="font-size: 16px; font-weight: 700"> 基本资料</span>
              <div class="btn">
                <span v-if="!isEidt"><a-button @click="isEditChange">编辑</a-button></span>
                <span v-else><a-button @click="isEditChange">保存</a-button><a-button style="margin-left: 15px" @click="cancelEditChange">取消</a-button></span>
              </div>
            </div>
            <div slot="footer">
              <span class="password">密码</span>
              <span style="margin-right: 20px">******</span>
              <a href="javascript:;" @click="pswModal = true">修改密码</a>
            </div>
          </a-list>
        </a-form>
        <div class="flex between">
          银行列表
          <a href="javascript:;" class="img mr10" @click="handleAdd()">新增银行</a>
        </div>
        <s-table
          ref="table"
          :columns="bankColumns"
          :data="bankList"
          :rowKey="(record, index) => record.bankNo"
          :pagination="false"
          :loading="bankLoading"
          style="padding-top: 10px"
        >
          <span slot="action" slot-scope="text, record">
            <span>
              <a href="#" style="padding: 0 5px" @click="handleEdit(record)">修改</a>
            </span>
            <span v-if="record.receiptType == 'A'">
              <a href="#" style="padding: 0 5px" @click="handleDelete(record)">删除 </a>
            </span>
          </span>
        </s-table>
      </a-col>
    </a-row>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" v-model="bankModal" :title="bankTitle" okText="保存" cancelText="取消" @ok="savebank()">
      <a-form-model ref="bankForm" :model="bankForm" :rules="bankRules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="类型" prop="receiptType" ref="receiptType">
          <a-radio-group v-model="bankForm.receiptType" :disabled="bankTitle == '修改'">
            <a-radio value="A">公司</a-radio>
            <a-radio value="B">个人</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="收款人户名" ref="receiptName" prop="receiptName">
          <a-input
            placeholder="请输入收款人户名"
            style="width: 90%"
            :disabled="bankForm.receiptType == 'B' && bankTitle == '修改'"
            v-model="bankForm.receiptName"
          />
          <template v-if="bankForm.receiptType == 'B'">
            <a-popover title="">
              <template slot="content">
                <p>添加后收款人户名不可修改</p>
              </template>
              <a-icon style="margin-left: 10px" type="question-circle" />
            </a-popover>
          </template>
        </a-form-model-item>
        <a-form-model-item label="开户行" ref="bank" prop="bank">
          <a-input placeholder="请输入开户行" v-model="bankForm.bank" style="width: 90%" />
        </a-form-model-item>
        <a-form-model-item label="银行卡号" ref="bankNo" prop="bankNo">
          <a-input style="width: 90%" placeholder="请输入银行卡号" :value="bankForm.bankNo" @change="bankInput" />
        </a-form-model-item>
        <a-form-model-item label="备注" ref="remark" prop="remark">
          <a-input style="width: 90%" placeholder="请输入备注" v-model="bankForm.remark" :maxLength="15" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" v-model="pswModal" title="修改密码" okText="保存" cancelText="取消" @ok="savePsw()">
      <a-form :form="form">
        <!-- 旧密码 -->
        <a-form-item label="旧密码" v-bind="formItemLayout">
          <a-input placeholder="请输入旧密码" type="password" v-decorator="['oldPwd', { rules: [{ required: true, message: '请输入旧密码' }] }]" />
        </a-form-item>
        <!-- 新密码 -->
        <a-form-item label="新密码" v-bind="formItemLayout">
          <a-input placeholder="请输入新密码" type="password" v-decorator="['newPwd', { rules: [{ required: true, message: '请输入新密码' }] }]" />
        </a-form-item>
        <!-- 确认密码 -->
        <a-form-item label="确认密码" v-bind="formItemLayout">
          <a-input placeholder="请再次输入密码" type="password" v-decorator="['secondPsw', { rules: [{ required: true, message: '请再次输入密码' }] }]" />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" v-model="avaModal" width="800px" title="更换头像">
      <cropper></cropper>
    </a-modal>
  </a-card>
</template>

<script>
import store from '@/store'
import { getInfo } from '@/api/login'
import { changePsw, saveCurrentUser, saveReceiptBank, listReceiptBank, removeReceiptBank } from '@/api/organize'
import { Cropper, UploadAvator } from '@/components'
import { changeAva } from '@/api/file'

import moment from 'moment'
import { STable, PermBox } from '@/components'
const showUserInfo = [
  { name: '工号', key: 'userNo', edit: false },
  { name: '姓名', key: 'userName', edit: true },
  { name: '性别', key: 'userSex', edit: true },
  { name: '手机号码', key: 'userTel', edit: true },
  { name: '开户行', key: 'bank', edit: true },
  { name: '银行卡号', key: 'bankNo', edit: true },
  { name: '邮箱', key: 'userMail', edit: true },
  { name: '生日', key: 'userBirthday', edit: true },
  { name: '身份证号码', key: 'userIdcard', edit: true },
  { name: '入职时间', key: 'userEntryTime', edit: false },
  { name: '转正时间', key: 'userOfficialTime', edit: false },
  { name: '部门', key: 'depts', edit: false },
  { name: '职位', key: 'orgPosition', edit: false },
]
let bankColumns = [
  {
    title: '类型',
    key: 'receiptType',
    dataIndex: 'receiptType',
    customRender: (text, record) => {
      return text == 'A' ? '公司' : text == 'B' ? '个人' : ''
    },
  },
  {
    title: '收款人户名',
    key: 'receiptName',
    dataIndex: 'receiptName',
  },

  {
    title: '开户行',
    key: 'bank',
    dataIndex: 'bank',
  },
  {
    title: '银行卡号',
    key: 'bankNo',
    dataIndex: 'bankNo',
  },
  {
    title: '备注',
    key: 'remark',
    dataIndex: 'remark',
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]
const formItemLayout = {
  labelCol: {
    xs: { span: 4 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 18 },
  },
}
export default {
  name: 'userCenter',
  components: {
    Cropper,
    UploadAvator,
    STable,
  },
  data() {
    return {
      bankTitle: '新增',
      bankRecord: null,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      bankRules: {
        receiptType: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        receiptName: [{ required: true, message: '请输入收款人户名', trigger: 'blur' }],
        bank: [{ required: true, message: '请输入开户行', trigger: 'blur' }],
        bankNo: [{ required: true, message: '请输入银行卡号', trigger: 'blur' }],
      },
      bankForm: {
        receiptType: 'A',
        receiptName: '',
        bank: '',
        bankNo: '',
        remark: ''
      },
      bankLoading: false,
      bankModal: false,
      bankList: (parameter) => {
        const pageInfo = { pageNum: 0, pageSize: 0 }
        return listReceiptBank(Object.assign(pageInfo)).then((res) => {
          return {
            data: res.data.receiptBank || [],
          }
        })
      },
      bankColumns,
      moment,
      formItemLayout,
      showUserInfo: [],
      pswModal: false,
      avaModal: false,
      fileList: [],
      uploading: false,
      client: {},
      userSrc: null,
      isEidt: false,
      usedPhone: null,
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
    this.userInfoForm = this.$form.createForm(this)
  },
  created() {
    this.addValue()
  },

  methods: {
    bankInput(e) {
      const { value } = e.target
      if (value) {
        this.bankForm.bankNo = value.replace(/[^0-9]/gi, '')
      } else {
        this.bankForm.bankNo = ''
      }
    },
    _refreshTable() {
      this.$refs.table.refresh()
    },
    handleAdd() {
      this.openBankModal()
      this.bankTitle = '新增'
    },
    openBankModal(record) {
      this.bankForm = {
        receiptBankId: record?.id || null,
        receiptName: record?.receiptName || '',
        receiptType: record?.receiptType || 'A',
        bank: record?.bank || '',
        bankNo: record?.bankNo || '',
        remark: record?.remark || ''
      }
      if (!record) delete this.bankForm.receiptBankId
      this.bankModal = true
    },
    handleEdit(record) {
      this.bankTitle = '修改'
      this.bankRecord = record
      this.openBankModal(record)
    },
    handleDelete(record) {
      this.$confirm({
        title: '系统提示',
        content: '确定删除吗?',
        onOk: () => {
          removeReceiptBank({ receiptBankId: record.id }).then((res) => {
            if (res.code == 200) {
              this.$notification['success']({
                message: '系统通知',
                description: '删除成功',
              })
              this._refreshTable()
            }
          })
        },
        onCancel() {},
      })
    },
    savebank() {
      this.$refs.bankForm.validate((valid) => {
        if (valid) {
          saveReceiptBank({ receiptBanks: JSON.stringify([this.bankForm]) }).then((res) => {
            if (res.code == 200) {
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功',
              })
              this._refreshTable()
              this.bankModal = false
            } else {
              this.$notification['error']({
                message: '系统通知',
                description: res.msg,
              })
            }
          })
        }
      })
    },
    verifyUserTel(rule, value, callback) {
      this.$verify.userPhone(rule, value, callback, this.usedPhone)
    },
    verifyUserIdCard(rule, value, callback) {
      this.$verify.idCard(rule, value, callback)
    },
    addValue() {
      getInfo().then((res) => {
        const result = res.data
        this.userSrc = result.avatar || ''
        this.usedPhone = result.user.userTel || null
        let deptStr = ''
        if (result.depts) {
          result.depts.forEach((dept) => {
            deptStr = deptStr + dept.deptName + ' 、'
          })
        }
        deptStr = deptStr.slice(0, deptStr.length - 1)
        // result.user.userSex == 'A' ? result.user.userSex = '男' : result.user.userSex = '女'
        Object.keys(result.user).forEach((key) => {
          showUserInfo.forEach((item) => {
            if (item.key == key) {
              item.value = result.user[key]
            }
            if (item.key == 'orgPosition' && result.position && result.position.positionName) {
              item.value = result.position.positionName
            }
            if (item.key == 'depts') {
              item.value = deptStr
            }
          })
        })
        this.showUserInfo = showUserInfo
      })
    },
    isEditChange() {
      this.isEidt ? this.saveCurrentUser() : this.editUserInfo()
    },
    cancelEditChange() {
      this.isEidt = false
      this.showUserInfo = [...this.showUserInfo]
    },
    editUserInfo() {
      const {
        userInfoForm: { getFieldsValue, setFieldsValue },
        showUserInfo,
      } = this
      const data = {}
      this.isEidt = true
      this.$nextTick(() => {
        showUserInfo.map((item) => {
          if (item.edit) {
            data[item.key] = item.value
          }
        })
        if (data.userBirthday) {
          data.userBirthday = moment(data.userBirthday, 'YYYY-MM-DD')
        }

        setFieldsValue(data)
      })
    },

    saveCurrentUser() {
      const data = this.userInfoForm.getFieldsValue()
      if (data.userBirthday) {
        data.userBirthday = this.$tools.tailor.getDate(data.userBirthday)
      }
      saveCurrentUser(data).then((res) => {
        this.$notification['success']({
          message: '系统通知',
          description: '操作成功',
        })
        this.isEidt = false
        this.addValue()
      })
    },
    getFilesId(fileId) {
      changeAva(fileId).then((res) => {
        if (res && res.code == 200) {
          this.$notification['success']({
            message: '系统通知',
            description: '上传成功!',
          })
          this.userSrc = res.data
        }
      })
    },
    openModal() {
      this.pswModal = true
    },
    savePsw() {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (values.newPwd == values.secondPsw) {
            delete values.secondPsw
            changePsw(values).then((res) => {
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功',
              })
              this.pswModal = false
            })
          }
        }
      })
    },
  },
}
</script>

<style scoped lang="less">
.cropper-content {
  .cropper {
    width: auto;
    height: 300px;
  }
}

.ant-list-item {
  padding: 0;
  line-height: 50px;
}

.user-title {
  width: 100px;
  display: inline-block;
}

.password {
  width: 100px;
  display: inline-block;
}

.ava-box {
  .changeAva {
    text-align: center;
    margin-top: 15px;
  }

  .ava {
    width: 200px;
    margin: 0 auto;
    margin-top: 30px;

    span {
      display: block;
      margin: 0 auto;
    }
  }
}
</style>
