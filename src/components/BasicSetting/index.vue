<template>
  <div class="setting-container">
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px" label-position="top">
      <el-form-item label="审批名称" prop="flowName">
        <el-input v-model="formData.flowName" placeholder="请输入审批名称" clearable :style="{ width: '100%' }"> </el-input>
      </el-form-item>
      <el-form-item label="审批编码" prop="code">
        <el-input v-model="formData.code" placeholder="请输入审批编码" clearable :style="{ width: '100%' }"> </el-input>
      </el-form-item>
      <el-form-item label="类型" prop="modeId">
        <el-select v-model="formData.modeId" placeholder="请选择类型" clearable @change="onModeIdChange" :style="{ width: '100%' }">
          <el-option v-for="item in modeIdOptions" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="表单类型" prop="formType">
        <el-select v-model="formData.formType" placeholder="请选择选择表单类型" clearable :style="{ width: '100%' }">
          <el-option v-for="(item, index) in formTypes" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="表单地址" prop="flowForm" v-if="formData.formType === 1">
        <el-input v-model="formData.flowForm" placeholder="请输入表单地址" clearable :style="{ width: '100%' }"> </el-input>
      </el-form-item>
      <el-form-item label="表单大小" prop="flowForm" v-if="formData.formType === 1">
        <el-input v-model="formData.width" placeholder="宽度" clearable :style="{ width: '100%' }"> </el-input>
      </el-form-item>
      <el-form-item label="是否与业务相关联" prop="status">
        <el-select v-model="formData.status" placeholder="请选择" clearable :style="{ width: '100%' }">
          <el-option v-for="(item, index) in statusOptions" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="谁可以发起审批" prop="approver">
        <fc-org-selectnew ref="org-selectnew" v-model="formData.initiator" title="发起人" :accept="'role'" @change="emitInitiator" />
        <span style="font-size: 12px; color: #aaa;">默认所有人</span>
      </el-form-item>
      <el-form-item label="模板图标" prop="icon">
        <img :src="activeIconSrc" style="width: 28px;height: 28px;border-radius:10px;vertical-align: middle;" />
        <el-button plain size="mini" @click="dialogVisible = true" style="margin-left: 10px;">选择图标</el-button>
      </el-form-item>
      <el-form-item label="审批说明" prop="flowRemark">
        <el-input
          v-model="formData.flowRemark"
          type="textarea"
          placeholder="请输入审批说明"
          :maxlength="100"
          show-word-limit
          :autosize="{ minRows: 4, maxRows: 4 }"
          :style="{ width: '100%' }"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-dialog title="选择图标" :visible.sync="dialogVisible" width="612px">
      <img
        v-for="(icon, index) in iconList"
        :key="index"
        :src="icon.src"
        class="icon-item"
        style="border-radius:10px;"
        :class="{ active: selectedIcon === icon.id }"
        @click="selectedIcon = icon.id"
      />
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            dialogVisible = false
            selectedIcon = activeIcon
          "
          size="small"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="
            dialogVisible = false
            activeIcon = selectedIcon
          "
          size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { listMode } from '@/api/workFlow/request.js'
export default {
  components: {},
  props: ['tabName', 'initiator', 'conf'],
  data() {
    const req = require.context('public/approverIcon', false, /\.png$/)
    const iconList = req.keys().map((t, idx) => ({ src: req(t), id: idx }))
    return {
      statusOptions: [{ label: '是', value: 1 }, { label: '否', value: 0 }],
      dialogVisible: false,
      activeIcon: iconList[0].id,
      selectedIcon: iconList[0].id,
      formData: {
        flowName: '',
        flowImg: '',
        code: '',
        modeId: undefined,
        mode: undefined,
        flowRemark: undefined,
        initiator: null,
        formType: 0,
        flowForm: '',
        status: 0,
        width: '600px'
      },
      rules: {
        flowName: [
          {
            required: true,
            message: '请输入审批名称',
            trigger: 'blur'
          }
        ],
        modeId: [
          {
            required: true,
            message: '请选择类型',
            trigger: 'change'
          }
        ],
        code: [
          {
            required: true,
            message: '请输入审批编号',
            trigger: 'blur'
          }
        ]
      },
      iconList,
      modeIdOptions: [],

      formTypes: [
        {
          label: '在线设计',
          value: 0
        },
        {
          label: '定制表单',
          value: 1
        }
      ]
    }
  },
  computed: {
    activeIconSrc() {
      const icon = this.iconList.find(t => t.id === this.activeIcon)
      return icon ? icon.src : this.iconList[0].src
    }
  },
  created() {
    var that = this

    if (typeof this.conf === 'object' && this.conf !== null) {
      Object.assign(this.formData, this.conf)
      this.activeIcon = this.formData.flowImg
      this.selectedIcon = this.formData.flowImg
    }
    this.getModeIdList()
  },
  methods: {
    onModeIdChange(e) {
      this.formData.mode = this.modeIdOptions.filter(element => {
        return element.id == e
      })[0].name
    },
    async getModeIdList() {
      let res = await listMode()
      this.modeIdOptions = res.data
    },
    emitInitiator(value) {
      this.$nextTick(() => {
        this.$emit('initiatorChange', this.formData.initiator, value)
      })
    },
    // 给父级页面提供得获取本页数据得方法
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs['elForm'].validate(valid => {
          if (!valid) {
            reject({ target: this.tabName })
            return
          }
          this.formData.flowImg = this.activeIcon
          resolve({ formData: this.formData, target: this.tabName }) // TODO 提交表单
        })
      })
    },

    // 给父级页面提供得获取本页数据得方法
    getDataNoValidate() {
      return new Promise((resolve, reject) => {
        resolve({ formData: this.formData, target: this.tabName }) // TODO 提交表单
      })
    }
  },
  watch: {
    initiator: {
      handler(val) {
        this.formData.initiator = val
      },
      immediate: true
    }
  }
}
</script>
<style lang="stylus" scoped>
.icon-item{
  width 40px
  height 40px
  margin: 6px;
  position relative
  cursor pointer
  opacity .5

  &.active{
    opacity 1
  }
  &:hover{
    opacity 1
  }
}

.setting-container{
  width: 600px;
  height: 100%;
  margin: auto;
  background: white;
  padding: 16px;
  overflow-y: auto;
  >>>.el-form--label-top .el-form-item__label{
    padding-bottom: 0;
  }
}</style
>>
