<template>
  <div class="upload-warpper">
    <a-modal title="发票预览" :visible="visible" :width="1200" @cancel="handleCancel" :footer="false">
      <div style="text-align:right;" class="mb20" v-if="imgType != 'application/pdf'">
        <a-button class="ml20" type="primary" @click="reverseImg">
          旋转
        </a-button>
      </div>
      <!-- <f-modal ref="previewModal" :open-loading="true" title="预览照片" @initValue="initPreviewModal" :showFooter="false"> -->
      <a-row>
        <a-col :span="8" style="margin-top: 25px;">
          <div>
            <a-row class="mb20">
              <a-col :span="5" style="line-height:40px;">发票类型：</a-col>
              <a-col :span="19"
                ><div class="invoiceInfo">
                  {{
                    invoiceInfo.invoiceType == 'A'
                      ? '增值税专用发票'
                      : invoiceInfo.invoiceType == 'B'
                      ? '增值税普通发票'
                      : invoiceInfo.invoiceType == 'C'
                      ? '定额发票'
                      : invoiceInfo.invoiceType == 'D'
                      ? '的士票'
                      : ''
                  }}
                </div></a-col
              >
            </a-row>
            <a-row class="mb20">
              <a-col :span="5" style="line-height:40px;">公司名称：</a-col>
              <a-col :span="19"
                ><div class="invoiceInfo">
                  {{ invoiceInfo.companyName }}
                </div></a-col
              >
            </a-row>
            <a-row class="mb20">
              <a-col :span="5" style="line-height:40px;">发票号码：</a-col>
              <a-col :span="19"
                ><div class="invoiceInfo">
                  {{ invoiceInfo.invoiceNo }}
                </div></a-col
              >
            </a-row>
            <a-row class="mb20">
              <a-col :span="5" style="line-height:40px;">开票代码：</a-col>
              <a-col :span="19"
                ><div class="invoiceInfo">
                  {{ invoiceInfo.invoiceCode }}
                </div></a-col
              >
            </a-row>
            <a-row class="mb20">
              <a-col :span="5" style="line-height:40px;">开票日期：</a-col>
              <a-col :span="19"
                ><div class="invoiceInfo">
                  {{ invoiceInfo.invoiceDate }}
                </div></a-col
              >
            </a-row>
            <a-row class="mb20">
              <a-col :span="5" style="line-height:40px;">金额：</a-col>
              <a-col :span="19"
                ><div class="invoiceInfo">
                  {{ invoiceInfo.invoiceMoney }}
                </div></a-col
              >
            </a-row>
            <a-row class="mb20">
              <a-col :span="5" style="line-height:40px;">校验码：</a-col>
              <a-col :span="19"
                ><div class="invoiceInfo">
                  {{ invoiceInfo.checkCode }}
                </div></a-col
              >
            </a-row>
            <a-row class="mb20">
              <a-col :span="5" style="line-height:40px;">是否验真：</a-col>
              <a-col :span="19"
                ><div class="invoiceInfo">
                  {{ invoiceInfo.invoiceCheck }}
                </div></a-col
              >
            </a-row>
          </div>
        </a-col>
        <a-col :span="16">
          <div style="position:relative;">
            <div v-if="imgType == 'application/pdf'"><Pdf :url="previewSrc"></Pdf></div>
            <div v-else style="width:100%;display: flex;justify-content: center;align-items: center;">
              <div style="position:relative;">
                <img :src="previewSrc" class="reverseImg" :style="`transform:rotate(${reverse}deg);`" ref="previewImg" width="752px" />
                <img
                  v-if="invoiceCheck == '已验真'"
                  width="17px"
                  src="~@/assets/invoice/checked.png"
                  class="icon"
                  style="padding:0;width:70px;position:absolute;right:0px;top:0px;"
                />
              </div>
            </div></div
        ></a-col>
      </a-row>
      <div
        v-if="showPre"
        style="display: flex;justify-content: space-between;width: calc(100% + 225px);position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);"
        class="mt20"
      >
        <a-icon type="left" style="font-size: 80px; color: #1890ff;" @click="changeImg('pre')" />
        <a-icon type="right" style="font-size: 80px;color: #1890ff;" @click="changeImg('next')" />
      </div>
      <!-- </f-modal> -->
    </a-modal>
  </div>
</template>
<script>
import { previewFile } from '@/api/file'
import Pdf from '@/components/FormControls/returnPremine/uploadFile/Pdf.vue'
export default {
  components: { Pdf },
  props: {
    showPre: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: false,
      files: [],
      imgType: '',
      fileId: '',
      previewSrc: '',
      invoiceCheck: '',
      reverse: 0,
      index: 0,
      invoiceInfo: {}
    }
  },
  methods: {
    open(record, index) {
      this.index = index
      let files = record
      if (Array.isArray(record)) {
        this.files = record
        files = record[index]
      }
      this.imgType = files.type

      this.invoiceInfo = files.invoiceLibraryInfo || files
      this.invoiceCheck = this.invoiceInfo.invoiceCheck
      const { uploadFileId } = files
      this.fileId = uploadFileId
      this.previewSrc = null
      // this.invoiceCheck = null
      // this.$refs.previewModal.open()
      this.initPreviewModal()
    },
    reverseImg() {
      this.reverse = this.reverse + 90
    },
    changeImg(type) {
      let arr = ['image/png', 'image/jpeg', 'application/pdf']
      let files = this.files.filter(item => {
        return arr.includes(item.type)
      })
      if (files.length < 2) {
        return
      }
      let idx = this.index
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
      this.open(files[idx], idx)
    },
    handleCancel() {
      this.visible = false
    },
    initPreviewModal() {
      this.visible = true
      const { fileId } = this
      previewFile({ fileId })
        .then(res => {
          this.previewSrc = res.data
        })
        .finally(() => {})
    }
  },
  watch: {}
}
</script>

<style scoped lang="less">
.imgChecked {
}
.invoiceInfo {
  width: 300px;
  padding: 0 5px;
  border: 1px solid #000;
  height: 40px;
  line-height: 40px;
  border-radius: 5px;
}
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
.ant-modal {
  width: 1200px !important;
}
</style>
