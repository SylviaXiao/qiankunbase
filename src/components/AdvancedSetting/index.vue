<template>
  <div class="setting-container">
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px" label-position="top">
      <el-form-item label="审批人去重" prop="autoRepeat">
        <el-select v-model="formData.autoRepeat" placeholder="请选择去重类型" :style="{ width: '100%' }">
          <el-option v-for="(item, index) in autoRepeatOptions" :key="index" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
        </el-select>
        <el-checkbox v-model="formData.myAuditAutoPass">发起人审批时自动通过</el-checkbox>
      </el-form-item>
      <div class="line"></div>
      <el-form-item label="重新提交不允许提交字段">
        <el-select v-model="formData.resubmitData" multiple placeholder="请选择字段">
          <el-option v-for="item in fotmItemOptions" :key="item.formId" :label="item.label" :value="item.formId"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审批完成可修改字段">
        <el-select v-model="formData.finishedEditableData" multiple placeholder="请选择字段">
          <el-option v-for="item in fotmItemOptions" :key="item.formId" :label="item.label" :value="item.formId"> </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="数据标题">
        <el-radio-group v-model="formData.dataTitleType" @change="onChange">
          <el-radio :label="1">默认（提交人+表单名称）</el-radio>
          <div class="dataTitleType" style="">
            <div>示例:</div>
            <div>陈德言的业绩上报</div>
            <div>陆宜的业绩上报</div>
          </div>
          <el-radio :label="2">自定义</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="" v-show="formData.dataTitleType == 2">
        <el-select v-model="formData.dataTitle" multiple placeholder="请选择字段">
          <el-option v-for="item in fotmItemOptions" :key="item.vModel" :label="item.label" :value="item.vModel"> </el-option>
        </el-select>
      </el-form-item>
      <div class="line"></div> -->
      <el-form-item label="审批意见">
        <el-checkbox v-model="formData.remarkRequired">必填</el-checkbox>
        <el-checkbox v-model="formData.notVisibleForSponsor">对发起人不可见</el-checkbox>
      </el-form-item>
      <el-form-item label="审批意见填写提示" prop="remarkTip">
        <el-input
          v-model="formData.remarkTip"
          type="textarea"
          placeholder="请输入"
          :maxlength="100"
          show-word-limit
          :autosize="{ minRows: 4, maxRows: 4 }"
          :style="{ width: '100%' }"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  components: {},
  props: ['conf'],
  data() {
    return {
      fotmItemOptions: [],
      formData: {
        finishedEditableData: '', //审批完成可修改字段
        resubmitData: '', //重新提交不允许提交字段
        dataTitleType: 1, //是否自定义标题
        dataTitle: '', //自定义标题
        autoRepeat: false, //审批人去重
        myAuditAutoPass: false, //发起人审批时自动通过
        remarkTip: '', //审批意见填写提示
        remarkRequired: false,
        notVisibleForSponsor: false
      },
      rules: {
        autoRepeat: [
          {
            required: true,
            message: '请选择选择分组',
            trigger: 'change'
          }
        ]
      },
      autoRepeatOptions: [
        {
          label: '启用自动去重',
          value: true
        },
        {
          label: '不启用自动去重',
          value: false
        }
      ]
    }
  },
  created() {
    if (typeof this.conf === 'object' && this.conf !== null) {
      Object.assign(this.formData, this.conf)
    }
  },
  methods: {
    init() {
      this.fotmItemOptions = JSON.parse(JSON.stringify(this.initFormOperates()))
    },
    initFormOperates(target) {
      const res = []
      const format = (list, parentName = '', parentVmodel = '') =>
        list.map(t => {
          const data = {
            formId: t.formId,
            required: t.required,
            label: parentName ? [parentName, t.label].join('.') : t.label,
            type: t.tag,
            vModel: parentVmodel ? [parentVmodel, t.vModel].join('.') : t.vModel
          }
          res.push(data)
          Array.isArray(t.children) && format(t.children, t.label, t.vModel)
        })
      const formItems = this.$store.state.formItemList
      // .filter(t => t.cmpType !== 'custom')
      format(formItems)
      return res
    },
    onChange(e) {
      if (e == 1) {
        this.formData.dataTitle = ''
      }
    },
    getData() {
      return this.formData
    }
  }
}
</script>
<style lang="stylus" scoped>
.setting-container{
  width: 600px;
  height: 100%;
  margin: auto;
  background: white;
  overflow-y: auto;
  padding: 16px;

  >>>.el-form--label-top .el-form-item__label{
    padding-bottom: 0;
  }
}
.el-form-item {
    margin-bottom: 10px;
}
.dataTitleType {
  background: #eee;
  padding: 10px;
  border-radius: 8px;
  width: 300px;
  margin: 10px 0;
  > div {
    font-size: 13px;
    line-height:20px;
  }
}
.line{
    border-bottom: 0;
    margin: 20px 0;
}
.el-form-item__label {
    color: rgba(0,0,0,0.7);
    font-weight: 600;
    font-size: 15px;
}
</style>
