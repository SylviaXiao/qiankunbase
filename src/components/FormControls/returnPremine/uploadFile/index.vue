<template>
  <div class="fc-uploadFile">
<!--    -->
    <UploadSth
      @uploadFilesSubmit="checkForm"
      @changeValue="changeValue"
      btnText="文件上传"
      :accept="uploadFileType === 'invoice' ? 'image/png, image/jpeg, application/pdf' : uploadFileType==='timeSheet'?'.xls,.xlsx':''"
      ref="uploadSth"
      :filePath="uploadFileType === 'invoice' ? 'e-invoice' : 'e-invoice-other'"
      formText="请上传截图"
      :multiple="true"
      :uploadFileType="uploadFileType"
      :value="innerValue"
      style="margin-top: -0.05rem"
      :disabled="disabled"
      :formData="rootFormData"
      :parentModel="parentModel"
      :vModel="vModel"
    ></UploadSth>
  </div>
</template>
<script>
import UploadSth from './UploadSth'
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: [
    'value',
    'cmpType',
    'tag',
    'tagIcon',
    'precision',
    'labelWidth',
    'step-strictly',
    'controls',
    'controls-position',
    'regList',
    'changeTag',
    'proCondition',
    'formId',
    'renderKey',
    'layout',
    'disabled',
    'formData',
    'uploadFileType',
    'rowIndex',
    'bindPrice',
    'vModel',
    'parentModel'
  ],
  name: 'fc-uploadFile',
  data() {
    return {
      innerValue: []
    }
  },
  created() {},
  components: {
    UploadSth
  },
  computed: {
    rootFormData() {
      return this.formData
    }
  },
  methods: {
    checkForm(data) {
      return new Promise((resolve, reject) => {
        this.$refs.uploadSth
          .multipleHandleUpload()
          .then(res => {
            if (res) {
              this.changeValue(res.data)
            } else {
              this.fileIds = null
              this.$emit('change', [])
            }
          })
          .catch(err => {})
      })
    },
    process(arr) {
      // 缓存用于记录
      let cache = []
      for (const t of arr) {
        // 检查缓存中是否已经存在
        if (cache.find(c => t.fpInvoiceCode && t.fpInvoiceNo && c.fpInvoiceNo === t.fpInvoiceNo && c.fpInvoiceCode === t.fpInvoiceCode)) {
          // 已经存在说明以前记录过，现在这个就是多余的，直接忽略
          this.$notification['error']({
            message: '系统通知',
            description: '发票重复'
          })
          continue
        }
        // 不存在就说明以前没遇到过，把它记录下来
        cache.push(t)
      }
      // 记录结果就是过滤后的结果
      return cache
    },
    changeValue(data) {
      if (data&&Array.isArray(data)&&data.length>0) {
        this.fileIds = data
        let arr = data.map(t => {
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
              fpInvoiceCode: t.fpInvoiceCode,
              fpName: t.fpName,
              fpAmount: t.fpAmount,
              fpStatus: t.fpStatus
            })
          }
          return obj
        })

        let arr1 = []
        for (const element of arr) {
          if (!element.uid || (element.uid && element.uid.indexOf('vc-upload') !== -1)) {
            continue
          }
          arr1.push(element)
        }
        this.$emit('change', arr1)
      } else {
        this.fileIds = null
        this.$emit('change', null)
      }
    },
    /**
     * 获取指定组件的值
     */
    getFormVal(vModel) {
      try {
        if (vModel.indexOf('.') > -1) {
          let [tabelVModel, cmpVModel] = vModel.split('.')
          let arr = []
          this.rootFormData[tabelVModel].forEach(element => {
            if (Array.isArray(element[cmpVModel]) && element[cmpVModel].length > 0) arr = arr.length > 0 ? [arr, ...element[cmpVModel]] : element[cmpVModel]
          })
          return arr
        }
        return Array.isArray(this.rootFormData[vModel]) && this.rootFormData[vModel].length > 0 ? this.rootFormData[vModel] : []
      } catch (error) {
        console.warn('计算公式出错, 可能包含无效的组件值', error)
        return []
      }
    }
  },
  watch: {
    formData: {
      handler: function(val) {},
      deep: true,
      immediate: true
    },
    value: {
      handler: function(val) {
        if (val && Array.isArray(val) && val.length > 0) {
          this.innerValue = val
        } else {
          this.innerValue = []
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style lang="stylus" scoped>
.fc-uploadFile{
  min-height:32px;
}
.explain-text {
  font-size: 12px;
  color: #aaa;
  line-height: 20px;
}
</style>
