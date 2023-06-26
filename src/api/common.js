import { axios, approveAxios } from '@/utils/request'
import QS from 'qs'

const api = {
  pageListBank: '/system/bank/pageListBank', //银行列表
  listClass: '/education/common/listClass',
  getCustomerGroups: '/system/channel/getCustomerGroups',
  //获取验证码
  kaptcha: '/common/kaptcha',
  //短信验证码
  noteCode: '/common/sms-retrieve',
  //短信验证码
  retrievePwd: '/common/retrieve-pwd',
  //驗證老師手機號碼
  verifyTeaPhone: '/salary/common/verifyPhone',
  getUsersInDept: '/erp-organize-service/organize/common/getUsersInDept',
  userById: '/organize/user/pageDeptOrgUser',
  /* 分馆/公司配置 */
  listAllFinCompany: '/erp-fastdp-service/pm/listAllFinCompany', //分页查询公司
  listFinCompany: '/erp-fastdp-service/pm/listFinCompany', //通过分馆查询公司
  listIsSalaryFinCompany: '/erp-fastdp-service/workflow/listIsSalaryFinCompany',
  getSelectStuSourceData: '/erp-fastdp-service/pm/listSysStuSource',

  pageTeachers: '/erp-organize-service/organize/common/pageSal',

  refundApprovalStudentCardLog: '/common/refund/refundApprovalStudentCardLog', //退费学员卡修改记录(修改次数和修改有效期)
  listStuLeave: '/common/refund/listStuLeave', //学员请假列表
  getStudentCardFin: '/common/refund/getStudentCardFin', //退费学员卡和上级缴费记录
  getStudentCardSign: '/common/refund/getStudentCardSign', //退费学员卡签到记录
  pageInvoice: '/common/refund/refundPageInvoice', //开票表格
  pageInvoiceCancel: '/common/refund/refundPageInvoiceCancel', //作废开票列表
}
export function downloadTemplate() {
  return approveAxios({
    url: '/erp-fastdp-service/common/downloadTemplate',
    method: 'get'
  })
}
export function getSelectStuSourceData() {
  return approveAxios({
    url: `${api.getSelectStuSourceData}`,
    method: 'get'
  })
}
export function listIsSalaryFinCompany(params) {
  return approveAxios({
    url: `${api.listIsSalaryFinCompany}`,
    method: 'get',
    params: params
  })
}
export function getUsersInDept(position, params) {
  return approveAxios({
    url: `${api.getUsersInDept}/${position}`,
    method: 'get',
    params: params
  })
}

export function verifyTeaPhone(params) {
  return axios({
    url: api.verifyTeaPhone,
    method: 'get',
    params: params
  })
}

export function listClass(params) {
  return axios({
    url: `${api.listClass}`,
    method: 'get',
    params: params
  })
}

//获取验证码
export function getKaptcha() {
  return axios({
    url: `${api.kaptcha}`,
    method: 'get'
  })
}

//获取验证码
export function getNoteCode(params) {
  return axios({
    url: `${api.noteCode}`,
    method: 'get',
    params: params
  })
}

//修改密码
export function retrievePwd(params) {
  return axios({
    url: `${api.retrievePwd}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function getUserList(params) {
  return axios({
    url: api.userById,
    method: 'get',
    params: params
  })
}

export function listAllFinCompany(params) {
  return approveAxios({
    url: api.listAllFinCompany,
    method: 'get'
  })
}
export function listFinCompany(params) {
  return approveAxios({
    url: api.listFinCompany,
    method: 'get',
    params: params
  })
}
export function pageListBank(params) {
  return axios({
    url: api.pageListBank,
    method: 'post',
    params: params
  })
}

export function getCustomerGroups(params) {
  return approveAxios({
    url: api.getCustomerGroups,
    method: 'get',
    params: params
  })
}
export function pageTeachers(params) {
  return approveAxios({
    url: api.pageTeachers,
    method: 'get',
    params: params
  })
}

export function refundApprovalStudentCardLog(params) {
  return axios({
    url: `${api.refundApprovalStudentCardLog}/${params}`,
    method: 'get'
  })
}
export function listStuLeave(params) {
  return axios({
    url: api.listStuLeave,
    method: 'get',
    params
  })
}
export function getStudentCardFin(params) {
  return axios({
    url: `${api.getStudentCardFin}`,
    method: 'get',
    params
  })
}
export function getStudentCardSign(params) {
  return axios({
    url: `${api.getStudentCardSign}`,
    method: 'get',
    params
  })
}
export function pageInvoice(params) {
  return axios({
    url: api.pageInvoice,
    method: 'get',
    params
  })
}
export function pageInvoiceCancel(params) {
  return axios({
    url: api.pageInvoiceCancel,
    method: 'get',
    params
  })
}

export const getInvoiceList = params => axios.post('/finance/invoice/pageInvoices', null, { params })