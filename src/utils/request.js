import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import tools from '@/tools/common'
import { UPLOAD_URL } from '@/utils/upload'

import QS from 'qs'
import { VueAxios } from './axios'
import notification from 'ant-design-vue/es/notification'
import Modal from 'ant-design-vue/es/modal'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { functions } from 'lodash'
import { reject } from 'core-js/fn/promise'

const defaultConfig = {
  retryDelay: 1500
}
// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_URL, // api base_url
  timeout: 120000 // 请求超时时间
})
const approveService = axios.create({
  baseURL: process.env.VUE_APP_APPROVE_URL,
  timeout: 120000 // 请求超时时间
})
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
const toLogout = timeout => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    store.dispatch('Logout').then(() => {
      setTimeout(() => {
        window.location.reload()
      }, timeout)
    })
  }
}
const err = error => {
  // debugger
  if (error) {
    const { config, code, message, status } = error
    if (code === 'ECONNABORTED' || message === 'Network Error') {
      // 请求超时
      notification.error({
        message: '错误提示',
        description: '请求超时！'
      })
    }

    const result = error.data
    if (result) {
      if (result.code == 500 || result.code == '500' || result.code == 401 || result.code == 204 || result.code == 404 || result.code == 400) {
        notification.error({
          message: '错误提示',
          description: error.data.msg
        })
      } else if (result.code == 402) {
        const {
          history: {
            current: { name }
          }
        } = router
        if ((name && name !== 'login') || !name) {
          Modal.confirm({
            title: '警告',
            content: `登陆过期,是否跳转登陆页面?`,
            okText: '前往登陆',
            cancelText: '我再待会',
            onOk() {
              toLogout(500)
            },
            onCancel() {
              console.log('Cancel')
            }
          })
        }
      }
    } else {
      if (message == 'Request failed with status code 402') {
        Modal.confirm({
          title: '警告',
          content: `登陆过期,是否跳转登陆页面?`,
          okText: '前往登陆',
          cancelText: '我再待会',
          onOk() {
            toLogout(500)
          },
          onCancel() {
            console.log('Cancel')
          }
        })
      } else {
        notification.error({
          message: '请求错误',
          description: message
        })
      }
    }
  }
  return Promise.reject(error.data || '')
}
const request = config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers['auth_token'] = token // 让每个请求携带自定义 token
    config.headers['authorization'] = token // 让每个请求携带自定义 token
  }
  //是否使用formData格式
  if (config.data && config.data.unFormData) {
    config.data = tools.$getFormData(config.data)
  }
  return config
}
service.interceptors.request.use(request, err)
approveService.interceptors.request.use(request, err)
const response = res => {
  const {
    config: { url },
    headers
  } = res
  if (headers['set-auth_token'] || headers['Set-auth_token']) {
    Vue.ls.set(ACCESS_TOKEN, headers['set-auth_token'] || headers['Set-auth_token'], 7 * 60 * 60 * 1000)
  }

  let code = res?.data?.code ? res.data.code + '' : ''
  if (code == 200 || res.data.type || url === UPLOAD_URL || code.startsWith('S')) {
    return Promise.resolve(res.data)
  } else if (code == 402) {
    const {
      history: {
        current: { name }
      }
    } = router
    if ((name && name !== 'login') || !name) {
      Modal.confirm({
        title: '警告',
        content: `登陆过期,是否跳转登陆页面?`,
        okText: '前往登陆',
        cancelText: '我再待会',
        onOk() {
          toLogout(500)
        },
        onCancel() {
          console.log('Cancel')
        }
      })
      reject()
    }
  } else {
    return err(res)
  }
}
service.interceptors.response.use(response, err)
approveService.interceptors.response.use(response, err)
const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, service)
  }
}
export { installer as VueAxios, service as axios, approveService as approveAxios }
