<template>
  <div class="fc-org-selectnew" @click.stop>
    <div class="tags">
      <el-button v-if="buttonType === 'button'" size="small" type="primary" icon="el-icon-plus" @click="show = true" style="margin-bottom: 6px;">
        添加{{ title }}
      </el-button>
      <div class="input-box" :class="{ 'as-input': buttonType === 'input' }" @click="show = true">
        <el-tag v-bind="tagConfig" class="org-tag" v-for="(item, index) in selectedData" :key="item.id" @close="onClose(item, index)">
          {{ item.name }}
        </el-tag>
      </div>
    </div>
    <div class="selectNew_contentBox" :style="show ? 'height:410px;' : ''">
      <div class="selectNew_content">
        <fc-org-transfernew
          ref="transfer"
          :value="innerValue"
          :title="title"
          :searchable="searchable"
          :maxNum="maxNum"
          :tabList="tabList"
          :type="type"
          :show.sync="show"
          @confirm="onConfirm"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { listEmployee, roleFindAll, findAllPosition } from '@/api/workFlow/request.js'

const tabList = [
  {
    id: 0,
    disabled: false,
    string: '所有员工',
    key: 'employee',
    select: [],
    type: 'TreeStructure',
    replaceFields: {
      children: 'children',
      title: 'userName',
      key: 'id'
    },
    apiOption: {
      api: listEmployee, // promise类型的接口
      string: 'name',
      value: 'title',
      params: { page: 0, limit: 0 }
    }
  },
  {
    id: 1,
    disabled: false,
    string: '职位',
    key: 'position',
    select: [],
    type: 'TreeStructure',
    replaceFields: {
      children: 'children',
      title: 'roleName',
      key: 'roleId'
    },
    apiOption: {
      api: findAllPosition, // promise类型的接口
      string: 'name',
      value: 'title'
    }
  },
  {
    id: 2,
    disabled: false,
    string: '角色',
    key: 'role',
    select: [],
    type: 'TreeStructure',
    replaceFields: {
      children: 'children',
      title: 'roleName',
      key: 'roleId'
    },
    apiOption: {
      api: roleFindAll, // promise类型的接口
      string: 'name',
      value: 'title'
    }
  }
]
export default {
  model: {
    prop: 'value',
    event: 'input'
  },
  name: 'fc-org-selectnew',
  props: {
    value: {
      type: Object | null,
      required: true
    },
    accept: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '组织机构'
    },
    buttonType: {
      type: String,
      default: 'input'
    }, // or input
    searchable: {
      type: Boolean,
      default: true
    },
    maxNum: {
      type: Number,
      default: 99
    },
    tagConfig: {
      type: Object,
      default: () => ({
        type: 'info',
        closable: true,
        'disable-transitions': false,
        hit: false,
        color: undefined,
        size: 'small',
        effect: 'light'
      })
    }
  },
  beforeDestroy() {
    document.removeEventListener('click', this.bodyCloseMenus)
  },
  mounted() {
    document.addEventListener('click', this.bodyCloseMenus)
  },
  data() {
    return {
      type: null,
      tabList: tabList,
      show: false,
      innerValue: [],
      selectedData: []
    }
  },
  watch: {
    value: {
      handler: function(val) {
        if (!val) return
        if (this.value.data && this.value.type) {
          this.reloadCmpData()
        }
      },
      immediate: true,
      deep: true
    },
    show: {
      handler: function(val) {
        if (!this.value) {
          this.tabList = tabList
          this.tabList.forEach(item => {
            item[item.key] = []
            item.select = []
          })
        }
        this.tabList.forEach(item => {
          item.disabled = false
          if (this.accept.indexOf(item.key) == -1) {
            item.disabled = true
          }
        })
        if (this.value && this.value.data && this.value.type) {
          this.reloadCmpData()
        }
        if (!this.type) {
          this.type = this.accept.split(',')[0]
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    selectedLabels() {
      return this.selectedData.map(t => t.name)
    }
  },
  methods: {
    bodyCloseMenus(e) {
      let self = this
      if (self.show == true) {
        self.show = false
      }
    },
    reloadCmpData() {
      // transfer 可能还未加载成功 // }) //   this.innerValue[key] = this.value && this.value[key] ? JSON.parse(JSON.stringify(this.value[key])) : [] // this.tabKeys.forEach(key => {
      this.$nextTick(_ => {
        this.type = this.value.type
        this.initSelectedData(this.value.data, this.value.type)
      })
    },
    initSelectedData(data, key, title) {
      let ids = []
      this.tabList.forEach(item => {
        item.disabled = false
        if (this.accept.indexOf(item.key) == -1) {
          item.disabled = true
        }
      })
      if (data.length > 0) {
        data.forEach(item => {
          ids.push(item.id)
        })
      }
      this.innerValue = ids
      this.selectedData = data
      this.tabList.forEach(item => {
        item[item.key] = []
        item.select = []
        if (item.key == key) {
          item[key] = ids
          item.select = data
        }
      })
    },
    getPropByKey(data, tabKey, key) {
      const transfer = this.$refs['transfer']
      if (transfer) {
        return transfer.getNodeProp(data, key, tabKey)
      } else {
        return ''
      }
    },

    getKey(data, tabKey) {
      return this.getPropByKey(data, tabKey, 'id')
    },

    getLabel(data, tabKey) {
      return this.getPropByKey(data, tabKey, 'name')
    },

    onClose(item, index) {
      if (this.innerValue && this.innerValue.length > 0) {
        this.innerValue.forEach((element, idx) => {
          if (element == item.key) {
            this.innerValue.splice(idx, 1)
          }
        })
      }
      this.selectedData.splice(index, 1)
      this.$emit('change', this.innerValue)
    },

    onConfirm(data) {
      this.innerValue = data[data.key]
      if (data.select && data.select.length > 0) {
        this.selectedData = data.select
      } else {
        this.selectedData = []
      }
      this.$emit('input', {
        type: data.key,
        data: data.select
      })
      this.$emit('change', this.selectedLabels)
    }
  }
}
</script>
<style lang="stylus" scoped>
.fc-org-selectnew{
  position:relative;
.tags {
  .input-box.as-input{
    border: 1px solid #DCDFE6;
    padding-left: 6px;
    font-size: 12px;
    min-height: 32px;
    line-height: 30px;
    border-radius: 4px;
    background: white;
    color #606266
    cursor pointer
  }
  .org-tag{
    margin-right: 6px;
    max-width: 6rem;
    overflow hidden
    text-overflow ellipsis
    position relative
    padding-right 1rem
    vertical-align middle

    >>> .el-tag__close{
      position: absolute;
      right: 2px;
      top: 50%;
      margin-top: -7px;
    }
  }
}
.selectNew_contentBox{
  position:relative;
.selectNew_content{
  position:absolute;
  top:10px;
  left:0;
  width:300px;
  height :410px;
}
}

}
</style>
