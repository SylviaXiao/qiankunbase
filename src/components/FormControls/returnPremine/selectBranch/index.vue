<template>
  <div class="fc-select-branch">
    <treeSelect v-bind="$props" @handleInput="handleInput" :option="option"></treeSelect>
  </div>
</template>
<script>
import { listIsSalaryFinCompany } from '@/api/common'
import { getSchoolList, listWorkflowRoleUserDetail, listUserDept } from '@/api/workFlow/request.js'
import treeSelect from '../../treeSelect/index'
import Vue from 'vue'
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: [
    'label',
    'value',
    'cmpType',
    'tag',
    'tagIcon',
    'precision',
    'disabled',
    'labelWidth',
    'step-strictly',
    'controls',
    'controls-position',
    'regList',
    'changeTag',
    'proCondition',
    'formId',
    'required',
    'renderKey',
    'layout',
    'defaultBranch',
    'defaultType',
    'approverBranchId'
  ],
  name: 'fc-select-branch',
  components: { treeSelect },
  data() {
    return {
      option: {
        disabled: true,
        placeholder: `请选择${this.label}`,
        search: true,
        string: this.label,
        key: 'branch',
        allowClear: true,
        apiOption: {
          api: getSchoolList, // promise类型的接口
          string: 'name',
          value: 'id',
          childString: 'name',
          childValue: 'id',
          params: {}
        }
      }
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.innerValue = val.id
      } else {
        this.innerValue = ''
      }
    },
    defaultType(val) {
      this.initBranch()
    },
    defaultBranch(val) {
      this.initDefaultBranch()
    }
  },
  created() {
    this.initBranch()
    this.initDefaultBranch()
  },
  computed: {},
  methods: {
    async initDefaultBranch() {
      let roots = await this.getFormData()
      if (this.defaultBranch && !this.value) {
        if(roots.code==='008'&&this.defaultType === 'finance'){
          listWorkflowRoleUserDetail({code:roots.code}).then(res=>{
            if(res.data.length>0&&res.data[0].schools){
              this.handleInput(res.data[0].schools[0])
            }
          })
        }else{
          const userSchoolId = JSON.parse(Vue.ls.get('userSchoolId'))
          if (userSchoolId && userSchoolId.length > 0) {
            this.handleInput(userSchoolId[0])
          }
        }

      }
    },
    getFormData() {
      var root = this.$parent
      while (root) {
        if ('procdef' in root) {
          return root.procdef
        }
        root = root.$parent
      }
    },
    process(arr) {
      // 缓存用于记录
      const cache = []
      for (const t of arr) {
        // 检查缓存中是否已经存在
        if (cache.find(c => c.schoolId === t.schoolId)) {
          // 已经存在说明以前记录过，现在这个就是多余的，直接忽略
          continue
        }
        // 不存在就说明以前没遇到过，把它记录下来
        cache.push(t)
      }
      // 记录结果就是过滤后的结果
      return cache
    },
    async initBranch() {
      let roots = await this.getFormData()
      if (this.defaultType === 'finance') {
        this.option.apiOption = {
          api: listWorkflowRoleUserDetail, // promise类型的接口
          string: 'schoolName',
          value: 'schoolId',
          childString: 'schoolName',
          childValue: 'schoolId',
          params: {
            code: (roots && roots.code) || null
          },
          formatData: res => {
            let data = []
            if (res.code == 200 && Array.isArray(res.data) && res.data.length > 0) {
              res.data.forEach(item => {
                if (Array.isArray(item.schools) && item.schools.length > 0) {
                  data = data.concat(item.schools)
                }
              })
            }
            return this.process(data)
          }
        }
        this.option.disabled = false
      } else if (this.defaultType === 'approver') {
        this.option.apiOption = {
          api: listUserDept, // promise类型的接口
          string: 'schoolName',
          value: 'schoolId',
          childString: 'schoolName',
          childValue: 'schoolId',
          params: { procinstId: (roots && roots.procdefId && roots.id) || null, roleId: this.approverBranchId || null }
        }
        this.option.disabled = true
      } else if (this.defaultType === 'paidDept') {
        this.option.apiOption = {
          api: listIsSalaryFinCompany, // promise类型的接口
          string: 'branchName',
          value: 'branchId',
          childString: 'branchName',
          childValue: 'branchId',
          params: {}
        }
        this.option.disabled = true
      } else {
        this.option.apiOption = {
          api: getSchoolList, // promise类型的接口
          string: 'name',
          value: 'id',
          childString: 'name',
          childValue: 'id',
          params: {}
        }
        this.option.disabled = true
      }
    },
    handleInput(val) {
      if (val) {
        this.$emit('change', {
          id: val[this.option.apiOption.value],
          name: val[this.option.apiOption.string],
          companyName: val.companyName
        })
      } else {
        this.$emit('change', '')
      }
    }
  }
}
</script>
<style lang="stylus" scoped></style>
