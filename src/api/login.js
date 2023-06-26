import api from './index'
import { axios, approveAxios } from '@/utils/request'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login(parameter) {
  return approveAxios({
    url: api.Login,
    method: 'post',
    data: parameter
  })
}

export function getSmsCaptcha(parameter) {
  return axios({
    url: api.SendSms,
    method: 'post',
    data: parameter
  })
}

export function getInfo() {
  return approveAxios({
    url: api.UserInfo,
    method: 'get'
  })
}

export function logout() {
  return approveAxios({
    url: api.Logout,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getOrgUser(params) {
  return approveAxios({
    url: `${api.getOrgUser}/${params}`,
    method: 'get'
  })
}
