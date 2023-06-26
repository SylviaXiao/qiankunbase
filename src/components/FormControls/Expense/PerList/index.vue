<template>
  <div class="fc-per-list-wrapper">
    <div v-if="!disabled" style="text-align: right">
      <a-button type="dashed" icon="plus-circle" @click="handleAddRow">
        分单
      </a-button>
    </div>
    <div class="fc-per-list">
      <a-row :gutter="16" style="font-weight: 600;">
        <a-col :span="6">
          业绩所属人
        </a-col>
        <a-col :span="6">
          所属分馆
        </a-col>
        <a-col :span="4">
          业绩金额
        </a-col>
        <a-col :span="4" v-if="defaultType === 'teacher'">
          比例
        </a-col>
      </a-row>
      <div class="fc-per-list-inner mb10" v-for="(item, index) in list" :key="index">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-input
              style="width: 100%;"
              :value="item[defaultType] && item[defaultType].name"
              placeholder="请选择所属人"
              :disabled="true"
            >
              <a-icon slot="addonAfter" type="search" @click="choosePerson(index)"/>
            </a-input>
          </a-col>
          <a-col :span="6">
            <a-tree-select
              style="width: 100%"
              :value="item[`${defaultType}Dept`] && item[`${defaultType}Dept`].name"
              :show-search="true"
              treeNodeFilterProp="title"
              :placeholder="`请选择${label}`"
              treeDefaultExpandAll
              :allowClear="true"
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="deptTree"
              :disabled="disabled"
              @change="(value, data, extra) => handleDeptInput(value, extra, index)"
            />
          </a-col>
          <a-col :span="4">
            <a-input-number
              style="width: 100%"
              :disabled="disabled"
              :min="1"
              v-model="item[`${defaultType}Price`]"
              placeholder="请输入金额"
              @change="handlePriceInput"
            />
          </a-col>
          <a-col :span="4" v-if="defaultType === 'teacher'">
            <a-select style="width: 100%" :disabled="disabled" v-model="item.ratio" placeholder="请选择比例">
              <a-select-option :value="2">2%</a-select-option>
              <a-select-option :value="5">5%</a-select-option>
              <a-select-option :value="7">7%</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="4">
            <a v-if="!disabled" @click="handleRemoveRow(index)">刪除</a>
          </a-col>
        </a-row>
      </div>
    </div>

    <i-modal
      ref="modal"
      userType="all"
      @getBackData="getUserBack"
    ></i-modal>
    <choose-tea
      ref="choosetea"
      :dimission="false"
      teaFields="teacher"
      @getBackData="getTeaBack"
    ></choose-tea>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { getSchoolList } from '@/api/workFlow/request.js'
  import IModal from '@/components/InnerModal'
  import ChooseTea from '@/components/ChooseTea'
  import treeSelect from '../../treeSelect/index'

  const adviserPer = {
    adviser: null,//所属人
    adviserDept: null,//所属分馆
    adviserPrice: null,//业绩金额
    // leaveDate: null//离职日期
  }

  const teacherPer = {
    teacher: null,//导师
    teacherDept: null,//业绩分馆
    teacherPrice: null,//业绩金额
    ratio: 2//比例
  }

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
      'disabled',
      'label',
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
      'defaultType',
      'placeholder'
    ],
    name: 'fc-per-list',
    components: {
      IModal,
      ChooseTea,
      treeSelect
    },
    data() {
      return {
        list: this.initValue(),
        curIndex: undefined,
        deptTree: [],
      }
    },
    created() {
      this.initTreeData()
    },
    methods: {
      initTreeData() {
        const cacheKey = 'form_controls_' + getSchoolList.name
        const cacheValue = Vue.ls.get(cacheKey)
        if (cacheValue) {
          this.deptTree = JSON.parse(cacheValue)
        } else {
          getSchoolList()
            .then(res => {
              let data = res.data
              if (res.code == 200 && data) {
                this._handleTreeData(data, 'name', 'id', 'name', 'id')
                this.deptTree = data
                Vue.ls.set(cacheKey, JSON.stringify(data))
              } else {
                this.deptTree = []
              }
            })
        }
      },
      _handleTreeData(data, type1, type2, type3, type4) {
        data.forEach((item, index) => {
          item.title = item[type1] || ''
          item.value = item[type2]
          item.key = item[type2]
          if (item.children && item.children.length > 0) {
            item.selectable = false
            item.disabled = true
            this._handleTreeData(item.children, type3, type4, type3, type4)
          }
        })
      },
      initValue() {
        let list = this.value || []
        if (list.length === 0) {
          if (this.defaultType === 'adviser') {
            list.push(JSON.parse(JSON.stringify(adviserPer)))
          } else if (this.defaultType === 'teacher') {
            list.push(JSON.parse(JSON.stringify(teacherPer)))
          }
        }
        return list
      },
      handleInput() {
        this.$emit('change', this.list || null)
      },
      handleAddRow() {
        if (this.defaultType === 'adviser') {
          this.list.push(JSON.parse(JSON.stringify(adviserPer)))
        } else if (this.defaultType === 'teacher') {
          this.list.push(JSON.parse(JSON.stringify(teacherPer)))
        }
        this.handleInput()
      },
      handleRemoveRow(index) {
        this.list.splice(index, 1)
        this.handleInput()
      },
      choosePerson(index) {
        const { defaultType, disabled } = this
        if (!disabled) {
          this.curIndex = index
          if (defaultType === 'adviser') {
            this.$refs.modal.open()
          } else if (defaultType === 'teacher') {
            this.$refs.choosetea.open()
          }
        }
      },
      getUserBack(data, type) {
        this.$set(this.list, this.curIndex, Object.assign({}, this.list[this.curIndex], { adviser: data }))
        this.handleInput()
      },
      getTeaBack(data, type) {
        this.$set(this.list, this.curIndex, Object.assign({}, this.list[this.curIndex], { teacher: data }))
        this.handleInput()
      },
      handleDeptInput(value, extra, index) {
        const { defaultType, disabled } = this
        if (!disabled) {
          this.curIndex = index
          let data = {}
          if (value) {
            const { id, name } = extra.triggerNode.dataRef
            data = { id, name }
          } else {
            data = null
          }
          if (defaultType === 'adviser') {
            this.$set(this.list, this.curIndex, Object.assign({}, this.list[this.curIndex], { adviserDept: data }))
          } else if (defaultType === 'teacher') {
            this.$set(this.list, this.curIndex, Object.assign({}, this.list[this.curIndex], { teacherDept: data }))
          }
          this.handleInput()
        }
      },
      handlePriceInput() {
        this.handleInput()
      }
    },
    watch: {
      value(val) {
        if (!val) {
          this.list = val || this.initValue()
        }
      },
      defaultType(val) {
        if (!val) {
          this.list = this.initValue()
        }
      }
    }
  }
</script>
<style lang="less" type="text/less" scoped>
</style>
