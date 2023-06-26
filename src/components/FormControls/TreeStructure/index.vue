<template>
  <div class="popBox">
    <div class="search">
      <a-icon type="search" style="color: #999; font-size: 12px" />
      <a-input placeholder="搜索" v-model.trim="searchVal" @change="changeSearch(searchVal)" />
    </div>
    <div class="list">
      <a-spin size="small" :spinning="spinning" style="padding-top: 0.8rem; width: 100%" />
      <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange" style="font-size: 0.13rem"> 全选 </a-checkbox>
      <a-tree
        v-model="checkId"
        @check="changeData"
        :auto-expand-parent="autoExpandParent"
        @expand="onExpand"
        :expanded-keys="expandedKeys"
        ref="tree"
        checkable
        :tree-data="datalist"
        :replaceFields="option.replaceFields"
      >
        <template slot="custom" slot-scope="item">
          <span v-html="item[option.replaceFields.title]"> </span>
        </template>
      </a-tree>
      <div v-if="!datalist.length && !spinning" class="tips">暂无相关数据</div>
      <!-- @check="checks" -->
    </div>
    <div class="footer">
      <!-- <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange" style="font-size: 0.13rem"> 全选 </a-checkbox>
      <div class="button" @click="submit">确定</div> -->
      <div>已选{{ checkId.length }}项</div>
      <div class="button" @click="clear">清空</div>
    </div>
  </div>
</template>

<script>
/**树结构下拉列表 */
export default {
  name: 'fc-org-treeSelect',
  data() {
    return {
      checkIdsData: [], //搜索时缓存
      searchVal: '', //搜索内容
      checkId: [], //选中的id
      checkIds: [],
      checkName: [], //选中内容的名称
      datalist: [], //展示得列表
      expandedKeys: [], //展开的节点
      list: [], //原始数据
      indeterminate: false, //全选按钮的样式控制
      checkAll: false,
      autoExpandParent: false,
      spinning: false,
      showAll: false,
      keyedit: {} //树结构key映射
    }
  },
  props: {
    option: {
      type: Object,
      default: () => ({})
    },
    check: {
      type: [Array, String],
      default: () => []
    },
    itemKey: {
      type: String,
      default: ''
    }
  },
  watch: {
    itemKey: {
      immediate: true,
      deep: true,
      handler(n) {
        this.checkIdsData = []
        this.getData()
      }
    },
    check: {
      deep: true,
      immediate: true,
      handler(n) {
        this.checkId = n
      }
    }
  },
  created() {},
  methods: {
    //搜索高亮
    searchActive(val) {
      // 这个就是我需要替换的文本，this.project就是你input搜索框搜索的值，比如搜索安全
      var patt1 = new RegExp(val)
      // patt1打印出来的值/安全/
      this.examineContent.map(examineItem => {
        /** 这儿把整个数据循环一下，然后让他每一项的name用replace的方法给转换一下
`<span style='color: red'>${this.project}</span>`用的es6模板字符串，转换以后然后再把每一项的转换好的值赋值给他的每一项，html用v-html写，要不然会把标签也显示出来。*/
        // patt1就是你即将要替换的文本，第二个参数就是你需要替换的文本
        examineItem.name = examineItem.name.replace(patt1, `<span style='color: red'>${val}</span>`)
      })
    },
    getData() {
      let { api, params, string, value } = this.option.apiOption
      this.datalist = this.list = []
      this.spinning = true
      api(params ? params : {})
        .then(res => {
          if (res.code === 200) {
            this.getTree(res.data)
            this.datalist = this.list = res.data
            if (this.check.length) {
              this.checkId = this.check
              if (this.check.length && this.check.length === this.flatten(this.datalist).length) {
                this.checkAll = true
              } else if (this.check.length && this.check.length !== this.flatten(this.datalist).length) {
                this.indeterminate = true
              }
            }
          }
        })
        .finally(() => (this.spinning = false))
    },
    getTree(arr) {
      let { children } = this.option.replaceFields
      arr.forEach((item, index) => {
        item.scopedSlots = { title: 'custom' }
        if (item[children] && item[children].length > 0) {
          this.getTree(item[children])
        }
      })
    },
    //数组扁平化
    flatten(arr) {
      return arr.reduce((result, item) => {
        return result.concat(
          Array.isArray(item[this.option.replaceFields.children]) ? [item].concat(this.flatten(item[this.option.replaceFields.children])) : item
        )
      }, [])
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    clear() {
      this.checkId = []
      this.checkIds = []
      this.checkIdsData = []
      this.checkAll = false
      this.indeterminate = false
      this.submit()
    },
    //全选
    onCheckAllChange(e) {
      if (this.checkId.length === this.flatten(this.datalist).length) {
        this.checkId = []
        this.checkIds = []
        this.checkIdsData = []
        this.checkAll = false
        this.indeterminate = false
      } else {
        this.checkId = this.flatten(this.datalist).map(item => item[this.option.replaceFields.key])
        this.checkIds = this.formateIds(this.flatten(this.datalist))
        this.checkAll = true
        this.indeterminate = false
      }
      this.submit()
    },
    /**选中树节点触发回调 */
    // checks(checkedKeys, e) {
    //   for (let i of e.checkedNodes) {
    //     this.checkName.push(i.data.props.name)
    //   }
    // },
    submit() {
      let checkId = this.checkId
      let checkIds = JSON.parse(JSON.stringify(this.checkIds))
      if (checkIds && checkIds.length > 0) {
        checkIds.map(t => {
          if (t.name.indexOf('</span>') != -1) {
            t.name = t.name.replace(`<span style='color:#19A97B;'>`, '')
            t.name = t.name.replace(`</span>`, '')
          }
          return { id: t.id, name: t.name }
        })
      }
      this.$emit('getcheckIds', checkId, checkIds)
    },
    reset() {
      this.checkId = []
      this.checkName = []
      this.indeterminate = false
      this.checkAll = false
    },
    dep(arr, e) {
      let newArr = []
      let { children, title } = this.option.replaceFields
      arr.forEach(item => {
        if (item[title].indexOf(e) > -1) {
          //搜索高亮
          var patt1 = new RegExp(e)
          item[title] = item[title].replace(patt1, `<span style='color:#19A97B;'>${e}</span>`)
          newArr.push(item)
        } else {
          if (item[children] && item[children].length) {
            let depChildren = this.dep(item[children], e)
            let obj = {
              ...item
            }
            this.$set(obj, children, depChildren)
            if (depChildren && depChildren.length) {
              newArr.push(obj)
            }
          }
        }
      })
      return newArr
    },
    formateIds(data) {
      let title = this.option.replaceFields.title
      let key = this.option.replaceFields.key
      let datas = []
      data.forEach(item => {
        datas.push({ name: item[title], id: item[key] })
        if (this.checkIdsData && this.checkIdsData.length > 0) {
          this.checkIdsData.forEach((element, index) => {
            if (element.id == item[key]) {
              this.checkIdsData.splice(index, 1)
            }
          })
        }
      })
      if (this.checkIdsData && this.checkIdsData.length > 0) {
        this.checkIdsData.forEach((element, index) => {
          if (this.searchVal && element.name.indexOf(this.searchVal) != -1) {
            this.checkIdsData.splice(index, 1)
          }
        })
      }
      datas = this.checkIdsData.concat(datas)
      return datas
    },
    //搜索自动展开节点
    getExpand(arr) {
      let { children, key } = this.option.replaceFields
      arr.forEach(item => {
        if (item[children] && item[children].length) {
          this.expandedKeys.push(item[key])
          this.getExpand(item[children])
        }
      })
    },
    //选中后判断是否全选
    changeData(e, data) {
      let checkedNodes = []
      data.checkedNodes.forEach(item => {
        checkedNodes.push(item.data.props.dataRef)
      })
      let checkIds = this.formateIds(checkedNodes)
      // checkIds.push(item.data.props.dataRef[title],item.data.props.dataRef[key])
      this.checkIds = checkIds
      if (this.flatten(this.datalist).length === e.length) {
        this.checkAll = true
        this.indeterminate = false
      } else if (e.length && this.flatten(this.datalist).length !== e.length) {
        this.indeterminate = true
        this.checkAll = false
      } else {
        this.indeterminate = false
      }
      this.submit()
    },
    /**按条件搜索 */
    changeSearch(e) {
      this.checkIdsData = JSON.parse(JSON.stringify(this.checkIds))
      this.datalist = JSON.parse(JSON.stringify(this.list))
      if (e) {
        this.datalist = this.dep(this.datalist, e)
        // this.datalist = this.datalist.filter(item => {
        //   return this.filterObj(item, e)
        // })
        this.getExpand(this.datalist)
      } else {
        this.expandedKeys = []
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/assets/style/index';

.popBox {
  min-width: 180px;
  // box-shadow: 0 0 5px rgba(221, 221, 221, 0.794);
  border-radius: 10px;
  // margin: 10px;
  .search {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ddd;
    padding: 0 10px;
    input {
      padding-left: 5px !important;
      border: none !important;
      &:focus {
        background: #ffffff;
        border: none !important;
        /* 解决input按钮自动填充后 浏览器渲染的默认背景问题 */
        box-shadow: inset 0 0 0 1000px #ffffff !important;
      }
      &::placeholder {
        font-size: 13px;
      }
    }
  }
  .list {
    padding: 10px 20px 10px 10px;
    height: 250px;
    overflow: hidden;
    overflow-y: auto;
    .tips {
      color: #999;
      text-align: center;
      font-size: 13px;
    }
  }
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 10px;
    border-top: 1px solid #ddd;
    font-size: 13px;
    .button {
      color: #fff;
      background-color: @theme-colorNew;
      width: 40px;
      text-align: center;
      line-height: 20px;
      border-radius: 3px;
      cursor: pointer;
    }
  }
}
</style>
