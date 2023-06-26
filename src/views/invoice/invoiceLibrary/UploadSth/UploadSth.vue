<template>
  <div class="upload-warpper">
    <div class="upload">
      <span class="required-class" v-if="required">{{ formText ? formText : btnText ? btnText : '' }}</span>
      <a-upload
        :accept="accept"
        v-if="!disabled"
        :multiple="multiple"
        :fileList="fileList"
        :remove="handleRemove"
        :beforeUpload="beforeUpload"
        :showUploadList="false"
        @change="handleChange"
      >
        <a-tooltip>
          <template slot="title" v-if="accept">
            只支持PNG、JPG、JPEG、PDF格式文件
          </template>
          <a-button :loading="uploading" :disabled="uploading" style="width:100%;">
            {{ btnText }}
          </a-button>
        </a-tooltip>
      </a-upload>
    </div>
  </div>
</template>

<script>
// import { fileDelete } from '@/api/workFlow/request.js'
import { previewFile, downloadFiles, removeFile } from '@/api/file'
import { autoUploadErp } from '@/utils/uploadInvoice'
import FileList from '@/components/FormControls/returnPremine/uploadFile/FileList.vue'
import Pdf from '@/components/FormControls/returnPremine/uploadFile/Pdf.vue'
const columns = [
  {
    title: '开票日期',
    dataIndex: 'fpDate',
    key: 'fpDate'
  },

  {
    title: '发票号码',
    dataIndex: 'fpInvoiceNo',
    key: 'fpInvoiceNo'
  },
  {
    title: '销售方名称',
    dataIndex: 'fpName',
    key: 'fpName'
  },
  {
    title: '含税金额',
    dataIndex: 'fpAmount',
    key: 'fpAmount'
  },
  { title: '状态', dataIndex: 'fpStatus', key: 'fpStatus', scopedSlots: { customRender: 'fpStatus' } },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  components: {
    Pdf,
    FileList
  },
  props: {
    uploadFileType: {
      type: String,
      default: ''
    },
    accept: {
      type: String,
      default: ''
    },
    value: {
      type: Array,
      default: []
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    formText: {
      type: String,
      default: ''
    },
    btnText: {
      type: String,
      default: '上传'
    },
    size: {
      type: Number,
      default: 114
    },
    filePath: {
      type: String,
      default: null
    },
    multiple: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Array,
      default: () => []
    },
    parentModel: {
      type: String,
      default: null
    },
    vModel: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      columns,
      imgType: '',
      fileList: [],
      fileListNew: [],
      uploading: false,
      localSrc: '',
      previewSrc: null,
      changeSrc: null,
      reverse: 0
    }
  },
  methods: {
    reverseImg() {
      this.reverse = this.reverse + 90
    },
    changeImg(type) {
      let arr = ['image/png', 'image/jpeg', 'application/pdf']
      let files = this.fileListNew.filter(item => {
        return arr.includes(item.type)
      })
      if (files.length < 2) {
        return
      }
      let idx = 0
      files.forEach((item, index) => {
        if (item.uid == this.fileId) {
          idx = index
        }
      })
      if (type == 'pre') {
        if (idx == 0) {
          this.$notification['error']({
            message: '系统通知',
            description: '已经是第一张了'
          })
          return
        }
        idx = idx - 1
      }
      if (type == 'next') {
        if (idx == files.length - 1) {
          this.$notification['error']({
            message: '系统通知',
            description: '已经是最后一张了'
          })
          return
        }
        idx = idx + 1
      }
      this.reverse = 0
      this.openPreviewModal(files[idx])
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
    openPreviewModal(record) {
      this.imgType = record.type
      const { uid } = record
      this.fileId = uid
      this.previewSrc = null
      this.$refs.previewModal.open()
    },
    initPreviewModal() {
      const { fileId } = this
      previewFile({ fileId })
        .then(res => {
          this.previewSrc = res.data
        })
        .finally(() => {
          this.$refs.previewModal.spinning = false
        })
    },
    downloadAttach(data) {
      const { uid } = data
      downloadFiles({ fileId: uid }).then(res => {
        this.downloadBySrc(res.data)
      })
    },
    downloadBySrc(src, fileName = 'test') {
      const a = document.createElement('a')
      a.download = `${fileName}`
      a.href = src
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(a.href)
    },
    //发生变化上传数组数量
    handleChange(file) {
      this.uploading = true
      // this.fileListNew = this.formateList(this.fileList)
      this.$emit('uploadFilesSubmit', file.fileList)
    },
    formateList(fileList) {
      let arr = fileList.map(t => {
        let obj = {
          uid: t.uid,
          name: t.name,
          status: t.status,
          type: t.type,
          size: t.size
        }
        if (this.uploadFileType == 'invoice') {
          obj = Object.assign(obj, {
            fpDate: t.fpDate,
            fpInvoiceNo: t.fpInvoiceNo,
            fpName: t.fpName,
            fpInvoiceCode: t.fpInvoiceCode,
            fpAmount: t.fpAmount,
            fpStatus: t.fpStatus
          })
        }
        return obj
      })
      return arr
    },
    handleRemove(file) {
      // this.multiple ? this.fileList.remove(file) : (this.fileList = [])
      let that = this
      this.$confirm({
        title: '系统提示',
        content: '确定删除吗',
        onOk() {
          that.fileListNew.forEach((item, index) => {
            if (item.uid == file.uid) {
              that.fileListNew.splice(index, 1)
            }
          })
          removeFile({ targetId: file.uid })
          that.$emit('changeValue', that.fileListNew)
        },
        onCancel() {}
      })
    },
    beforeUpload(file) {
      this.multiple ? this.fileList.push(file) : (this.fileList = [file])
      return false
    },
    handleUpload() {
      const { fileList } = this
      if (this.required) {
        if (fileList.length) {
          return this._upload()
        } else {
          this.$notification['error']({
            message: '系统通知',
            description: '请上传附件'
          })
          return Promise.reject('请上传附件')
        }
      } else {
        if (fileList.length) {
          return this._upload()
        } else {
          return Promise.resolve('')
        }
      }
    },
    mapList() {},
    /**多条上传 */
    multipleHandleUpload() {
      const { fileList, setUpload } = this
      let that = this
      const list = []
      return new Promise((resolve, reject) => {
        let uploadFileList = fileList.filter(item => !item.status || item.status !== 'done')
        let doneFileList = fileList.filter(item => item.status === 'done')
        let doneFileIds = doneFileList.map(item => item.uid).join(',')
        if (fileList.length) {
          if (uploadFileList.length === 0) {
            resolve(doneFileIds)
            return
          }
          uploadFileList.forEach((item, idx) => {
            setTimeout(async () => {
              let listItem = await autoUploadErp(item, this.filePath)
              list.push(listItem)
              if (list.length === uploadFileList.length) {
                setUpload(list)
                  .then(async arr => {
                    let arrNew = arr.map(item => {
                      return item.fileId
                    })
                    // 当前上传的文件列表
                    let uploadFileList = []
                    this.fileList.forEach((element, index) => {
                      arr.forEach(items => {
                        previewFile({ fileId: items.fileId }).then(res => {
                          let imageUrl = res.data || ''
                          if (element.uid == items.uid) {
                            this.fileList[index] = Object.assign(this.fileList[index], items)
                            this.fileList[index].uid = items.fileId
                            this.fileList[index].imageUrl = imageUrl
                            this.fileList[index].status = 'done'
                            uploadFileList.push(this.fileList[index])
                          }
                        })
                      })
                    })
                    // if (this.uploadFileType == 'invoice') {
                    //   this.process(uploadFileList)
                    // }
                    this.fileListNew = this.fileList
                    this.uploading = false
                    setTimeout(function() {
                      if (doneFileIds) {
                        resolve({
                          data: that.fileList,
                          id: arrNew.join(',') + ',' + doneFileIds
                        })
                      } else {
                        resolve({
                          data: that.fileList,
                          id: arrNew.join(',')
                        })
                      }
                    }, 500)
                  })
                  .catch(err => {})
              }
            }, idx * 500)
          })
        } else {
          if (this.required) {
            this.$notification['error']({
              message: '系统通知',
              description: '请上传附件'
            })
            reject('请上传附件')
          } else {
            resolve(null)
          }
        }
      })
    },
    process(uploadFileList) {
      let allFileList = []
      if (this.formData) {
        if (this.formData && Array.isArray(this.formData) && this.formData.length > 0) {
          this.formData.forEach(data => {
            allFileList.push(data)
          })
        }
        allFileList = allFileList.flat()
      }
      for (let file of uploadFileList) {
        let idx = allFileList.findIndex(
          c => file.fpInvoiceCode && file.fpInvoiceNo && c.fpInvoiceNo === file.fpInvoiceNo && c.fpInvoiceCode === file.fpInvoiceCode
        )
        if (idx != -1) {
          let index = this.fileList.findIndex(
            c => file.fpInvoiceCode && file.fpInvoiceNo && c.fpInvoiceNo === file.fpInvoiceNo && c.fpInvoiceCode === file.fpInvoiceCode
          )
          this.fileList.splice(index, 1)
          this.$notification['error']({
            message: '系统通知',
            description: '发票重复'
          })
        }
      }
    },
    async setUpload(item) {
      return Promise.all([...item])
    },
    _upload() {
      const { fileList } = this
      this.uploading = true
      return autoUploadErp(fileList[0], this.filePath)
        .then(res => {
          return res
        })
        .catch(err => {})
        .finally(() => {
          this.uploading = false
        })
    },
    setFileList(list) {
      this.fileList = list
    },
    reset() {
      this.fileList = []
    }
  },
  watch: {
    value: {
      handler: function(val) {
        if (val) {
          this.fileList = JSON.parse(JSON.stringify(val))
          this.fileListNew = JSON.parse(JSON.stringify(val))
        } else {
          this.fileList = []
          this.fileListNew = []
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style scoped lang="less">
.reverseImg {
  // transition: all 0.5s;
  // max-height: 600px;
  // max-width: 600px;
  width: 100%;
}
.upload-warpper {
  position: relative;

  .upload {
    margin-top: 5px;
  }

  .required-class {
    margin-right: 6px;
    position: absolute;
    left: -50px;
    // top: 5px;

    &:before {
      display: inline-block;
      margin-right: 4px;
      content: '*';
      font-family: SimSun;
      line-height: 1;
      font-size: 14px;
      color: #f5222d;
    }
  }
}
</style>
