<template>
  <div>
    <a-modal v-model="show" :title="title" ok-text="确认" cancel-text="取消" :width="560" @ok="confirm" @cancel="closeTransfer">
      <div class="selectbox">
        <a-form-model style="width:100%;" ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item :label="transferTitle" prop="initiator">
            <a-input v-model="form.initiator.name" read-only @click="openUserModal" />
            <div v-for="item in form.initiator" :key="item.id">{{ item.userName }}</div>
          </a-form-model-item>
          <a-form-model-item label="备注" prop="remark">
            <a-input v-model="form.remark" type="textarea" />
          </a-form-model-item>
        </a-form-model>
      </div>
    </a-modal>
    <i-modal ref="userModal" :isNumber="isNumber" :checkBox="checkBox" userType="all" @getBackData="getBackData" />
  </div>
</template>

<script>
import IModal from '@/components/InnerModal/modal.vue'
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-debugger */
/* eslint-disable no-return-assign */
/* eslint-disable handle-callback-err */

// import { CONFIG_LIST } from './config.js'
import { debounce } from '@/assets/utils/index.js'

export default {
  name: 'FlowOrgSelect',

  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    //是否开启数字顺序
    isNumber: {
      type: Boolean,
      default: false
    },
    //是否开启多选
    checkBox: {
      type: Boolean,
      default: false
    },
    // v-model 已经选择过的数据 用于回显
    value: {
      type: Array,
      default: () => []
    },
    // 字符串数组使用配置文件的预设值
    // 对象数组需要包含 key/conf 两个属性 conf 会覆盖对应key的默认配置
    type: {
      type: String,
      default: () => 'dep'
    },
    title: {
      type: String,
      default: '选择委托人'
    },
    show: {
      type: Boolean,
      reuired: true
    },
    // 是否支持模糊查询
    searchable: {
      type: Boolean,
      default: true
    },
    // 可选择的最大数量
    maxNum: {
      type: Number,
      default: 99
    },

    /**
     * 是否允许编辑
     */
    enableEdit: {
      type: Boolean,
      reuired: false
    },
    filterConfig: {
      type: Object,
      default: {}
    }
  },
  components: {
    IModal
  },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      transferTitle: '请选择转单人',
      form: {
        initiator: this.checkBox ? [] : {},
        remark: ''
      },
      rules: {
        initiator: { required: true, message: this.transferTitle, trigger: 'change' },
        remark: { required: false, message: '请输入备注', trigger: 'change' }
      }
    }
  },
  computed: {},
  mounted() {},
  methods: {
    emitInitiator(value) {},
    openUserModal() {
      if (this.checkBox) {
        this.$refs.userModal.open(this.form.initiator)
      } else {
        this.$refs.userModal.open()
      }
    },
    getBackData(data) {
      this.form.initiator = data
    },
    closeTransfer() {
      this.$emit('update:show', false)
      this.initiator = null
    },
    confirm() {
      let { initiator, remark } = JSON.parse(JSON.stringify(this.form))
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          try {
            this.$emit('onConfirm', [initiator], remark)
          } catch (e) {}

          this.closeTransfer()
        } else {
          return false
        }
      })
    }
  },
  watch: {
    title: {
      handler: function(val) {
        if (val != '选择委托人') {
          this.transferTitle = '请' + val
        }
      },
      immediate: true
    },
    show: {
      handler: function(show) {
        if (show) {
        }
      },
      immediate: true
    }
  }
}
</script>
<style lang="stylus">
.el-button--primary {
    color: #FFF;
    background-color: #19a97b;
    border-color: #19a97b;
}
.el-button--primary:focus, .el-button--primary:hover {
    background: #19a97b;
    border-color:  #19a97b;
    color: #FFF;
}
.selectbox{
  display flex;
  width 100%
  height: 600px;
  height: 460px;
  .label{
    width 120px;
  }
  .content{
      width 100%;
  }
}
</style>
