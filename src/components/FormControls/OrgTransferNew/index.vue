<template>
  <section v-if="show" class="h-transfernew" :class="'single-tab'">
    <!-- <div class="mask"></div> -->
    <!-- 内容面板 -->
    <div class="transfer__content1">
      <!-- 面板顶部标题 -->
      <div class="transfer__header1">
        <i class="el-icon-close" @click="closeTransfer"></i>
      </div>
      <!-- 穿梭框主要内容 -->
      <div class="transfer__body1">
        <a-tabs style=" width:100%;" :activeKey="tabKey" @change="changeTabs">
          <a-tab-pane :key="item.id" :tab="item.string" v-for="item in tabList" :disabled="item.disabled">
            <!-- <perm-box :perm="item.perm"> -->
            <fc-org-treeSelect
              :ref="item.key"
              v-if="item.key"
              :class="['checkPop', { active: item[item.key] }]"
              :check="item[item.key]"
              :itemKey="item.key"
              @getcheckIds="getcheckIds"
              :option="item"
            />
            <!-- </perm-box> -->
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </section>
</template>

<script>
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-debugger */
/* eslint-disable no-return-assign */
/* eslint-disable handle-callback-err */
// import OrgTransferNew from '../OrgSelectNew'
export default {
  name: 'fc-org-transfernew',
  props: {
    // v-model 已经选择过的数据 用于回显
    value: {
      type: Array,
      default: () => []
    },
    tabList: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '组织机构'
    },
    show: {
      type: Boolean,
      reuired: true
    }
  },
  data() {
    return {
      tabKey: 0,
      selectedData: [] // 用户手动选择的节点(在tree里面已经显示的节点)
    }
  },
  components: {},
  watch: {
    show: {
      handler: function(show) {
        if (show) {
        }
      },
      immediate: true
    },
    type: {
      immediate: true,
      handler(n, o) {
        this.tabList.forEach((item, index) => {
          if (item.key == this.type) {
            this.tabKey = index
          }
        })
      }
    }
  },
  computed: {},
  mounted() {},
  methods: {
    /**点击确定 */
    getcheckIds(arr, selectArr) {
      let key = this.tabList[this.tabKey].key
      this.tabList[this.tabKey].show = false
      this.tabList[this.tabKey][key] = arr
      this.tabList[this.tabKey].select = selectArr
      this.$emit('confirm', this.tabList[this.tabKey])
      // this.closeTransfer()
    },
    changeTabs(e) {
      this.tabKey = e
    },
    closeTransfer() {
      this.$emit('update:show', false)
      this.tabKeys = []
    }
  }
}
</script>
<style lang="stylus">

.h-transfernew{
  text-align: left;
  line-height: 32px;
  position: absolute;
  height :100%;
    top: 0px;
    z-index: 99999;
    background-color: #fff;
   width: 300px;
  > .mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .el-tabs--border-card {
    box-shadow: none;
  }

  .el-tabs__content {
    overflow: visible;
    min-height: 250px;
  }

  .el-tabs__nav {
    width: 100%;
    display: flex;

    > .el-tabs__item {
      flex-grow: 1;
    }
  }

  &.single-tab .el-tabs__item {
    text-align: center;
    background: #f5f7fa !important;
    border-bottom: 1px solid #e4e7ed;
    border-right-width: 0px;
  }

  .el-tree-node__content > label.el-checkbox {
    // position: absolute;
    // right: 0;
  }

  .searchResPane{
    position: absolute;
    overflow-y: auto;
    z-index: 99;
    left: 0;
    top: 100%;
    width: 100%;
    height: 100%;
    background: white;
    border: 1px solid #dcdfe6;
    transition: top .5s;



    &.active{
        top: 0;
    }

    .hidden-tag{
        color:#999;
        font-size:12px;
        text-align:right;
        padding-top:4px;
        padding-right:12px;
        cursor pointer

        &:hover{
            color: #66b1ff;
        }
    }

    .item{
        padding: 4px 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height 1.5
        &:hover{
            background-color: #ecf5ff;
            color: #66b1ff;
            cursor: pointer;
        }

        .search-res-tip{
          font-size:12px;
          color:#999;
          max-width: 280px;
        }
    }
  }

  .enough-mask{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    color: white;
    font-size: 16px;
    z-index: 100;
    height: 100%;
    background: rgba(0,0,0,0.5);
    letter-spacing: 4px;
  }

  .p-center{
      position absolute
      top 50%
      left 50%
      transform translate(-50%, -50%)
  }

  .transfer__content1 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: white;
  overflow: hidden;
      box-shadow: 0 0 0.05rem rgba(221, 221, 221, 0.794);
    border-radius: 10px;
}

.transfer__header1 {
text-align: right;
height: 20px;
padding: 0 10px 0 0;
line-height: 25px;
  color: #535353;
  .el-icon-close{
    cursor:pointer;
    float: right;
    margin-top: 10px;
  }
}


.transfer__body1 {
padding: 0 0 12px;
  width:100%;
  >>>.ant-tabs{
     width:100%;
  }
}

.transfer-pane {
  width: 360px;
}
  .search-input  input{
    border: 1px solid #DCDFE6 !important;
    &:focus{
      border-color:#19a97b !important;
    }
  }

.transfer-pane__tools {
  margin-bottom: 10px;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;



  span:last-child {
    cursor: pointer;
  }
}

.transfer-pane__body {
  position relative
  width: 100%;
  height: 330px;
  overflow hidden
  font-size: 14px;

  >>> .el-scrollbar__view{
    height: 100%;
  }

  .el-tabs__item {
    height: 26px;
    line-height: 26px;
  }
}

.transfer-icons {
  display: flex;
  flex-direction: column;
  justify-content: center;

  i {
    margin-top: 20px;
    margin-bottom: 20px;
    cursor: pointer;
    font-size: 20px;
    color: #696969;

    &:hover {
      transform: scale(1.1);
    }
  }
}

.tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;

  .node-label {
    max-width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
  }

  .node-checkbox {
    position: absolute;
    right: 0;
  }

  i {
    &:hover {
      color: #1485f8;
      cursor: pointer;
    }

    font-size: 10px;
  }
}

.right-pane {
  box-sizing: border-box;
  overflow-x: hidden;
  height: 290px;
  margin-bottom: 10px;

  .selected-item {
    padding: 0px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:hover {
      background-color: #F5F7FA;
    }

    span {
      max-width: 90%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    i {
      &:hover {
        color: #1485f8;
        cursor: pointer;
      }
    }
  }
}

.dot{
  width: 2px;
  height: 2px;
  display: inline-block;
  border-radius: 50%;
  background: #4caf50;
}

  .text-ellipsis{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
