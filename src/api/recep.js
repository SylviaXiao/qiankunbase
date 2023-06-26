import { axios } from '@/utils/request'
import QS from 'qs'

const api = {
  verifyUpdateStudent: '/student/info/verifyUpdateStudent',
  listEduDance: '/education/deptcard/listEduDance',
  pageDeptCard: '/education/deptcard/pageDeptCard',
  listEduCardType: '/education/deptcard/listEduClassType',
  listClass: '/education/class/listClass'
}

export function verifyUpdateStudent(params) {
  return axios({
    url: api.verifyUpdateStudent,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function listEduDance(params) {
  return axios({
    url: api.listEduDance,
    method: 'get',
    params: params
  })
}

export function pageDeptCard(params) {
  return axios({
    url: api.pageDeptCard,
    method: 'get',
    params: params
  })
}

export function listEduCardType(params) {
  return axios({
    url: api.listEduCardType,
    method: 'get',
    params: params
  })
}

export function listClass(params) {
  return axios({
    url: api.listClass,
    method: 'get',
    params: params
  })
}
