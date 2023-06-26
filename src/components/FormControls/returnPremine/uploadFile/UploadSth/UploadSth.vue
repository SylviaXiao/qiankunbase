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
            <div v-if="uploadFileType === 'invoice'">
              只支持PNG、JPG、JPEG、PDF格式文件
            </div>
            <div v-if="uploadFileType === 'timeSheet'">
              只支持xls、xlsx格式文件
            </div>
          </template>
          <a-button :loading="uploading" :disabled="uploading&&disabled">
            <a-icon type="upload" />
            {{ btnText }}
          </a-button>
        </a-tooltip>
      </a-upload>
      <a-button style='margin-left:10px;'  v-if="uploadFileType==='timeSheet'" @click='downloadAttach(downLoadData)'>
        下载模板
      </a-button>
      <div v-if="!disabled">
        <div v-if="uploadFileType === 'invoice'">
          <div v-show="fileListNew.length > 0">
            <a-table :columns="columns" :data-source="fileListNew" rowKey="uid" :pagination="false">
              <span slot="fpStatus" slot-scope="text">
                <span v-if="text == '已验真'" style="color:#1BA97B;"
                  >{{ text }}
                  <a-icon type="check-circle" />
                </span>
                <span v-else style="color:rgb(245, 108, 108);"
                  >{{ text }}
                  <a-icon v-show="text" type="exclamation-circle" />
                </span>
              </span>
              <span slot="action" slot-scope="text, item">
                <a href="javascript:;" class="img mr10" v-if="isImg(item.type)" @click="openPreviewModal(item)">预览</a>
                <a href="javascript:;" class="action mr10" @click="downloadAttach(item)">下载</a>
                <a-icon type="delete" v-if="!disabled" @click="handleRemove(item)" />
              </span>
            </a-table>
          </div>
        </div>
        <div v-else>
          <div v-for="item in fileList" :key="item.uid">
            <span> {{ item.name }}</span>
            <a href="javascript:;" class="img mr10" v-if="isImg(item.type)" @click="openPreviewModal(item)">预览</a>
            <a href="javascript:;" class="action" @click="downloadAttach(item)">下载</a>
            <a-icon type="delete" v-if="!disabled" @click="handleRemove(item)" />
          </div>
        </div>
      </div>
      <div v-else>
        <file-list :uploadFileType="uploadFileType" :files="fileListNew" @preview="openPreviewModal" @download="downloadAttach" />
      </div>
    </div>
    <f-modal ref="previewModal" :open-loading="true" title="预览照片" @initValue="initPreviewModal" :showFooter="false">
      <div style="position:relative;">
        <div style="text-align:right;" class="mb20">
          <a-button v-if="imgType != 'application/pdf'" class="ml20" type="primary" @click="reverseImg">
            旋转
          </a-button>
        </div>
        <div v-if="imgType == 'application/pdf'"><Pdf :url="previewSrc"></Pdf></div>
        <div v-else style="width:100%;display: flex;justify-content: center;align-items: center;">
          <img :src="previewSrc" class="reverseImg" :style="`transform:rotate(${reverse}deg);`" ref="previewImg" />
        </div>
        <div
          style="display: flex;justify-content: space-between;width: calc(100% + 225px);position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);"
          class="mt20"
        >
          <a-icon type="left" style="font-size: 80px; color: #fff;" @click="changeImg('pre')" />
          <a-icon type="right" style="font-size: 80px;color: #fff;" @click="changeImg('next')" />
        </div>
      </div>
    </f-modal>
  </div>
</template>

<script>
// import { fileDelete } from '@/api/workFlow/request.js'
import { previewFile, downloadFiles, removeFile } from '@/api/file'
import { autoUploadErp } from '@/utils/upload'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import FileList from '@/components/FormControls/returnPremine/uploadFile/FileList.vue'
import Pdf from '../Pdf.vue'
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
      type: Object,
      default: () => ({})
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
      downLoadData:{uid:'ef99a8aa-fc76-41f0-9a38-76172a037dd7'},
      columns,
      imgType: '',
      fileList: [],
      fileListNew: [],
      uploading: false,
      localSrc: '',
      previewSrc: null,
      changeSrc: null,
      reverse: 0,
      timeSheetAccept : ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
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
      let flag = true
      file.fileList.forEach(item => {
        if (item.percent || item.percent == 0) {
          flag = false
        }
      })
      if (flag) {
        // let uploadFileList = []
        // if(this.uploadFileType==='timeSheet'){
        //   uploadFileList=file.fileList.filter(item=>{return this.timeSheetAccept.includes(item.type) })
        //   this.fileList=this.fileList.filter(item=>{return this.timeSheetAccept.includes(item.type) })
        // }
        this.uploading = true
        this.fileListNew = this.formateList(this.fileList)
          this.$emit('uploadFilesSubmit', file.fileList)
      }
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
            if (item.uid === file.uid) {
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
                        if (element.uid == items.uid) {
                          this.fileList[index] = Object.assign(this.fileList[index], items)
                          this.fileList[index].uid = items.fileId
                          this.fileList[index].status = 'done'
                          uploadFileList.push(this.fileList[index])
                        }
                      })
                    })
                    if (this.uploadFileType == 'invoice') {
                      this.process(uploadFileList)
                    }
                    if(this.uploadFileType==='timeSheet'){
                      // this.fileList=this.fileList.filter(item=>{return this.timeSheetAccept.includes(item.type) })
                      this.formateTimeSheet(uploadFileList)
                    }
                    this.uploading = false
                    if (doneFileIds) {
                      resolve({
                        data: this.fileList,
                        id: arrNew.join(',') + ',' + doneFileIds
                      })
                    } else {
                      resolve({
                        data: this.fileList,
                        id: arrNew.join(',')
                      })
                    }
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
    formateTimeSheet(uploadFileList) {
      for (let file of uploadFileList) {
        if(!this.timeSheetAccept.includes(file.type)){
          let index = this.fileList.findIndex(
            c =>file.fileId===c.fileId
          )
          this.fileList.splice(index, 1)
          this.$notification['error']({
            message: '系统通知',
            description: '只支持xls、xlsx格式文件'
          })
        }
      }
    },
    process(uploadFileList) {
      let allFileList = []
      if (this.formData && this.parentModel && this.vModel) {
        if (this.formData[this.parentModel] && Array.isArray(this.formData[this.parentModel]) && this.formData[this.parentModel].length > 0) {
          this.formData[this.parentModel].forEach(data => {
            if (data[this.vModel]) {
              allFileList.push(data[this.vModel])
            }
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
