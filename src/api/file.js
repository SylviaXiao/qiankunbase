import { axios, approveAxios } from '@/utils/request'
import QS from 'qs'

const api = {
  signFile: '/framework/file/sign', //文件鉴权
  loadFile: '/framework/file/preUpload', //文件上传

  sign: '/framework/file/sign', //文件鉴权
  preUpload: '/erp-fastdp-service/pm/preUpload', //文件上传
  wx_sign: '/erp-fastdp-service/pm/wx_sign', //微信小程序文件鉴权
  changeAva: '/organize/user/changeAvatar',
  // changeAva:'/organize/user/changeAvatar',
  // recognizeFace:'/framework/file/recognize',
  recognizeFace: '/student/signinlog/recognize', //面部识别

  previewFile: '/framework/file/view',
  downloadFiles: '/framework/file/down',
  invoiceInfo: '/erp-fastdp-service/workflow/invoiceInfo', //获取发票详情
  removeFile: '/erp-fastdp-service/pm/remove' //录入数据
}
//删除发票
export function removeFile(params) {
  return approveAxios({
    url: api.removeFile,
    method: 'post',
    data: params
  })
}
export function invoiceInfo(params) {
  return approveAxios({
    url: `${api.invoiceInfo}`,
    method: 'get',
    params: params
  })
}
export function loadFile(params) {
  return axios({
    url: `${api.loadFile}`,
    method: 'get',
    params: params
  })
}

export function previewFile(params) {
  return axios({
    url: `${api.previewFile}`,
    method: 'get',
    params: params
  })
}

export function downloadFiles(params) {
  return axios({
    url: `${api.downloadFiles}`,
    method: 'get',
    params: params
  })
}

export function signFile() {
  return axios({
    url: `${api.signFile}`,
    method: 'get'
  })
}

export function preUpload(params) {
  return approveAxios({
    url: `${api.preUpload}`,
    method: 'get',
    params: params
  })
}

export function sign() {
  return axios({
    url: `${api.sign}`,
    method: 'get'
  })
}

export function wx_sign(params) {
  return approveAxios({
    url: `${api.wx_sign}`,
    method: 'get',
    params: params
  })
}

export function changeAva(params) {
  return axios({
    url: `${api.changeAva}`,
    method: 'post',
    data: QS.stringify({ id: params })
  })
}

export function recognizeFace(params) {
  return axios({
    url: api.recognizeFace,
    method: 'post',
    data: QS.stringify(params)
  })
}
