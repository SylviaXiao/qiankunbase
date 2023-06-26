import { axios, approveAxios } from '@/utils/request'
import QS from 'qs'

const api = {
  pageInvoice: '/erp-fastdp-service/workflow/invoice/pageInvoice', //发票库分页列表
  pageInvoiceInfo: '/erp-fastdp-service/workflow/invoice/pageInvoiceInfo', //详情分页列表
  saveInvoice: '/erp-fastdp-service/workflow/invoice/saveInvoice', //上传发票
  getLoginUserCompany: '/erp-fastdp-service/pm/getLoginUserCompany', //发票库公司列表
  listInvoiceLibraryInfo: '/erp-fastdp-service/workflow/invoice/listInvoiceLibraryInfo', //发票再次验证列表
  updateCheck: '/erp-fastdp-service/workflow/invoice/updateCheck',
  rejectInvoice: '/erp-fastdp-service/workflow/invoice/rejectInvoice',
  downLoadFile: '/erp-fastdp-service/workflow/invoice/downLoadFile',
  delInvoice: '/erp-fastdp-service/workflow/invoice/delInvoice', //批量删除未验真发票
  saveInvoicePrint:'/erp-fastdp-service/workflow/invoice/saveInvoicePrint',
  getInvoicePrint:'/erp-fastdp-service/workflow/invoice/getInvoicePrint'
}
export function getInvoicePrint(params) {
  return approveAxios({
    url: `${api.getInvoicePrint}`,
    method: 'get',
    params: params
  })
}

export function saveInvoicePrint(params) {
  return approveAxios({
    headers: { 'Content-Type': 'Application/json' },
    url: api.saveInvoicePrint,
    method: 'post',
    data: params
  })
}
//发票库
export function delInvoice(params) {
  return approveAxios({
    url: api.delInvoice,
    method: 'post',
    responseType: 'blob',
    data: QS.stringify(params)
  })
}
export function downLoadFile(params) {
  return approveAxios({
    url: api.downLoadFile,
    method: 'post',
    responseType: 'blob',
    data: params
  })
}
export function rejectInvoice(params) {
  return approveAxios({
    url: api.rejectInvoice,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function updateCheck(params) {
  return approveAxios({
    url: api.updateCheck,
    method: 'post',
    data: params
  })
}
export function listInvoiceLibraryInfo(params) {
  return approveAxios({
    url: api.listInvoiceLibraryInfo,
    method: 'post',
    data: params
  })
}
export function getLoginUserCompany(params) {
  return approveAxios({
    url: api.getLoginUserCompany,
    method: 'post',
    data: params
  })
}
export function saveInvoice(params) {
  return approveAxios({
    url: api.saveInvoice,
    method: 'post',
    data: params
  })
}
export function pageInvoiceInfo(params) {
  return approveAxios({
    url: api.pageInvoiceInfo,
    method: 'post',
    data: params
  })
}
export function pageInvoice(params) {
  return approveAxios({
    url: api.pageInvoice,
    method: 'post',
    data: params
  })
}
