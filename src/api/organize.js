import { axios, approveAxios } from '@/utils/request'
import QS from 'qs'

const api = {
  removeReceiptBank: '/erp-organize-service/organize/user/removeReceiptBank', //删除银行列表
  saveReceiptBank: '/erp-organize-service/organize/user/saveReceiptBank', //新增银行列表
  listReceiptBank: '/erp-organize-service/organize/user/listReceiptBank', //新增银行列表
  //
  getUsersInDept: '/organize/user/getUsersInDept',
  //
  getALLDeptSchools: '/erp-organize-service/organize/dept/listSchool',
  userById: '/organize/user/pageDeptOrgUser',
  saveOrgUser: '/organize/user/saveOrgUser',
  getSysDictList: '/system/dict/getSysDictList',
  //修改密码
  changePsw: '/organize/account/changePwd',
  verifyUserPhone: '/organize/user/verifyUserPhone', //验证是否为老员工
  verifyContacts: '/student/user/verifyContacts', //验证是否为老员工
  reset: '/organize/menu/reloadPerms',
  saveCurrentUser: '/organize/user/saveCurrentUser' //修改登录用户信息
}
export function removeReceiptBank(params) {
  return approveAxios({
    url: `${api.removeReceiptBank}`,
    method: 'delete',
    params: params
  })
}
export function listReceiptBank(params) {
  return approveAxios({
    url: `${api.listReceiptBank}`,
    method: 'get',
    params: params
  })
}
export function saveReceiptBank(params) {
  return approveAxios({
    url: api.saveReceiptBank,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function getUsersInDept(position, params) {
  return approveAxios({
    url: `${api.getUsersInDept}/${position}`,
    method: 'get',
    params: params
  })
}

export function getALLDeptSchools(params) {
  return approveAxios({
    url: api.getALLDeptSchools,
    method: 'get',
    params: params
  })
}
export function getUserList(params) {
  return axios({
    url: api.userById,
    method: 'get',
    params: params
  })
}

export function getSysDictList(params) {
  return axios({
    url: api.getSysDictList,
    method: 'get',
    params: params
  })
}

export function changePsw(params) {
  return axios({
    url: api.changePsw,
    method: 'post',
    data: QS.stringify(params)
  })
}

//验证手机号
export function verifyUserPhone(params) {
  return axios({
    url: api.verifyUserPhone,
    method: 'post',
    data: QS.stringify(params)
  })
}

//验证手机号
export function verifyContacts(params) {
  return axios({
    url: api.verifyContacts,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function saveCurrentUser(params) {
  return axios({
    url: api.saveCurrentUser,
    method: 'post',
    data: QS.stringify(params)
  })
}
