<template>
  <div>
    <a-popover title="附件列表" v-if="files&&files.length > 0">
      <template slot="content">
        <div v-if="uploadFileType == 'invoice'">
          <a-table :columns="columns" :data-source="files" rowKey="uid" :pagination="false">
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
              <a href="javascript:;" class="action" @click="downloadAttach(item)">下载</a>
            </span>
          </a-table>
        </div>
        <div v-else>
          <div v-for="(img, index) in files" :key="img.uid" class="flex fc-uploadFile">
            <div class="mr10">{{ img.name }}</div>
            <template v-if="showButton">
              <a href="javascript:;" class="img mr10" v-if="isImg(img.type)" @click="openPreviewModal(img)">预览</a>
              <a href="javascript:;" class="action" @click="downloadAttach(img)">下载</a>
            </template>
          </div>
        </div>
      </template>
      <a href="javascript:;">{{ showButton ? '查看附件' : '附件' }}</a>
    </a-popover>
    <div v-else>无</div>
    <f-modal ref="previewModal" :open-loading="true" title="预览照片" @initValue="initPreviewModal" :showFooter="false">
      <div style="position:relative;">
        <div style="text-align:right;" class="mb20">
          <a-button v-if="imgType != 'application/pdf'" class="ml20" type="primary" @click="reverseImg">
            旋转
          </a-button>
        </div>
        <div v-if="imgType == 'application/pdf'"><Pdf :url="previewSrc"></Pdf></div>
        <div v-else style="width:100%;min-height:600px;display: flex;justify-content: center;align-items: center;">
          <img :src="previewSrc" class="reverseImg" :style="`transform:rotate(${reverse}deg);`" ref="previewImg" width="752px" />
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
import { previewFile, downloadFiles } from '@/api/file'
import Pdf from '@/components/FormControls/returnPremine/uploadFile/Pdf.vue'
export default {
  props: {
    uploadFileType: {
      type: String,
      default: ''
    },
    files: {
      type: Array,
      default: () => []
    },
    showButton: {
      type: Boolean,
      default: true
    }
  },
  components: { Pdf },
  data() {
    return { columns, imgType: '', fileId: '', previewSrc: '', reverse: 0 }
  },
  watch: {
    // files: {
    //   handler: function(val) {
    //     console.log(888,val)
    //     if (val && Array.isArray(val) && val.length > 0) {
    //       // this.innerValue = val
    //     } else {
    //       // this.innerValue = []
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  methods: {
    reverseImg() {
      this.reverse = this.reverse + 90
    },
    isImg(data) {
      let arr = ['image/png', 'image/jpeg', 'application/pdf']
      if (arr.includes(data)) {
        return true
      } else {
        return false
      }
    },
    // openPreviewModal(record) {
    //   this.$emit('preview', record)
    // },
    downloadAttach(record) {
      this.$emit('download', record)
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
    changeImg(type) {
      let arr = ['image/png', 'image/jpeg', 'application/pdf']
      let files = this.files.filter(item => {
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
    }
  }
}
</script>

<style scoped lang="less">
.reverseImg {
  width: 100%;
}
</style>
