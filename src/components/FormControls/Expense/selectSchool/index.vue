<template>
  <div class="fc-select-school" v-bind="$props" v-on="$listeners">
    <a-tree-select
      style="width: 100%"
      v-model="innerValue"
      :allowClear="true"
      :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
      :show-search="true"
      treeDefaultExpandAll
      :filterTreeNode="onTreeSearch"
      @change="handleInput"
      :disabled="disabled"
      placeholder="选择学校"
      :class="required && !value ? 'error' : ''"
    >
      <!-- :treeData="deptTree" -->
      <a-tree-select-node v-for="item in deptTree" :key="item.key" :value="item.title">
        <div slot="title">{{ item.title }}（{{ item.parentName }}）</div>
      </a-tree-select-node>
    </a-tree-select>
    <div class="company"><span>公司名称：</span>{{ companyName }}</div>
    <div class="company"><span>区域：</span>{{ areaName }}</div>
  </div>
</template>
<script>
import { listAllFinCompany, listFinCompany } from '@/api/common'
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: [
    'required',
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
    'renderKey',
    'layout'
  ],
  name: 'fc-select-school',
  components: {},
  data() {
    return {
      companyName: '',
      areaName: '',
      deptTree: [], //所有分馆列表
      innerValue: ''
    }
  },
  created() {
    if (this.value) {
      this.innerValue = this.value.name
      this.companyName = this.value.companyName
      this.areaName = this.value.areaName
    }
    this.initTreeData()
  },
  computed: {},
  methods: {
    onTreeSearch(inputValue, path) {
      return path.data.props.value.indexOf(inputValue) > -1
    },
    initTreeData() {
      listAllFinCompany().then(res => {
        if ((res.code === 200 || res.code === '200') && res.data) {
          this.deptTree = this.handleTreeData(res.data, 'companyName', 'id', 'branchName', 'branchId')
        }
      })
    },
    handleTreeData(data, type1, type2, type3, type4) {
      let datas = []
      if (data && Array.isArray(data) && data.length > 0) {
        data.forEach((item, index) => {
          item.children = item.listFinCompanyInfo || null
          if (item.children && item.children.length > 0) {
            let children = JSON.parse(JSON.stringify(item.children))
            children.forEach(items => {
              items.parentName = item[type1]
              datas.push(items)
            })
          }
        })
      }
      datas = this._handleTreeData(datas, 'branchName', 'branchId', 'parentName')
      return datas
    },
    _handleTreeData(data, type1, type2, type3) {
      data.forEach((item, index) => {
        item.title = item[type1]
        item.value = item[type2]
        item.key = item[type2]
      })
      return data
    },
    handleInput(val, data, extra) {
      if (val) {
        listFinCompany({ branchId: extra.triggerNode.eventKey }).then(res => {
          if ((res.code === 200 || res.code === '200') && res.data) {
            this.companyName = res.data[0].companyName
            this.areaName = res.data[0].areaName
            this.$emit('change', {
              branchId: extra.triggerNode.eventKey,
              name: val,
              companyName: this.companyName,
              areaName: this.areaName
            })
          }
        })
      } else {
        this.$emit('change', '')
        // this.$emit('change', {
        //   branchId: '',
        //   name: '',
        //   companyName: '',
        //   areaName: ''
        // })
      }
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          this.innerValue = val.name
          this.companyName = val.companyName
          this.areaName = val.areaName
        } else {
          this.innerValue = ''
          this.companyName = ''
          this.areaName = ''
        }
      },
      deep: true
    }
  }
}
</script>
<style lang="stylus" scoped>
.explain-text {
  font-size: 12px;
  color: #aaa;
  line-height: 20px;
}
/deep/.ant-select-disabled .ant-select-selection {
    background: #F5F7FA;
    color: #C0C4CC;
    border: 0.01rem solid #F5F7FA;
}
.company{
    position: relative;
    left: -70px;
    display:flex;
    >span{
      width:70px;
      display:block;
      text-align:right;
    }
}
  /deep/.error .ant-select-selection--single{
     border-color: #F56C6C;
     box-shadow: 0 0 0 0.02rem rgba(245 ,108 ,108 , 20%);
  }
</style>
