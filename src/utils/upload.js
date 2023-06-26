// 重构上传测试用
import { preUpload, wx_sign, invoiceInfo } from '@/api/file'
import { axios } from '@/utils/request'
import notification from 'ant-design-vue/es/notification'
export const UPLOAD_URL = 'https://danse-erp-file.oss-cn-hangzhou.aliyuncs.com'

// 1,preUploadFn 2,wx_sign
export function autoUploadErp(file, type) {
  let axiosParams = new FormData()
  let fileId = ''
  let uid = file.uid
  return new Promise((resolve, reject) => {
    return preUploadFn(file, type)
      .then(res => {
        if (res.publicRead) {
          axiosParams.append('x-oss-object-acl', 'public-read')
        }
        axiosParams.append('key', res.fileName)
        fileId = res.fileId
        return res.fileDir
      })
      .then(fileDir => {
        return wx_sign({
          dir: fileDir
        })
      })
      .then(res => {
        axiosParams.append('policy', res.data.policy)
        axiosParams.append('OSSAccessKeyId', res.data.accessid)
        axiosParams.append('signature', res.data.signature)
        axiosParams.append('success_action_status', '200')
        axiosParams.append('file', file)
        return axiosParams
      })
      .then(params => {
        return axios({
          url: UPLOAD_URL,
          headers: { 'Content-Type': 'multipart/form-data' },
          data: params,
          method: 'post',
          timeout: 0
        })
      })
      .then(() => {
        let fileList = {
          fileId: fileId,
          uid: file.uid
        }
        if (type == 'e-invoice') {
          invoiceInfo({ fileId, type: 'A' })
            .then(res => {
              if (res.code == 200) {
                if (res.data && res.data.fpStatus == '已验真') {
                  resolve(Object.assign(fileList, res.data))
                } else {
                  if (res.data && res.data.fpStatus) {
                    notification.error({
                      message: '系统通知',
                      description: res.data.fpStatus
                    })
                  }
                  resolve({
                    uid: uid,
                    fileId: uid
                  })
                }
              }
            })
            .catch(err => {
              new Error(err)
              resolve({
                uid: uid,
                fileId: uid
              })
            })
        } else {
          resolve(fileList)
        }
      })
      .catch(err => {
        new Error(err)
        resolve({
          uid: uid,
          fileId: uid
        })
      })
  })
}

export function preUploadFn(file, type) {
  let params = {
    fileName: file.name,
    img: file.type.indexOf('image/') == -1 ? false : true,
    type: type
  }
  return preUpload(params).then(res => {
    const result = res.data
    const storeAs = result.storeAs
    const publicRead = result['public-read']
    const fileData = {
      fileDir: storeAs.fileDir,
      fileName: `${storeAs.fileDir}/${storeAs.filePathName}`,
      fileId: storeAs.id,
      publicRead: publicRead
    }
    return fileData
  })
}
