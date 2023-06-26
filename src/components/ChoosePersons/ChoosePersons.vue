<template>
  <div>
    <s-table ref="table" :columns="columns" :data="loadData" :rowKey="record => record[chooseKey]">
      <span slot="action" slot-scope="text, record">
        <span v-if="!select.length || !select.some(item => item[chooseKey] == record[chooseKey])">
          <a href="#" @click="selectPerson(record)"><span class="buttonStyle">选择</span></a>
        </span>
        <span v-if="select.length && select.some(item => item[chooseKey] == record[chooseKey]) && deleteBtn">
          <span class="top_1">已选择</span>
          <a href="#" @click="cancel(record)"><span class="top_2">取消</span></a>
        </span>
      </span>
    </s-table>
  </div>
</template>

<script>
import STable from '@/components/Table'
export default {
  name: 'ChoosePersons',
  data() {
    return {
      select: [],
      position: false
    }
  },
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    //单选
    radio: {
      type: Boolean,
      default: false
    },
    //是否有取消
    deleteBtn: {
      type: Boolean,
      default: true
    },
    loadData: Function,
    //选择得key
    chooseKey: String,
    //选择得name
    chooseName: String
  },
  components: {
    STable
  },

  computed: {},

  created() {
    this.columns.forEach((item, index) => {
      if (item.key == 'action') {
        item.width = '100px'
      }
    })
  },
  watch: {
    select(n, o) {
      this.$emit('pick', n)
    }
  },
  methods: {
    reset() {
      this.select = []
    },
    checkSelect() {
      return new Promise((resolve, reject) => {
        if ((this.select instanceof Array && !this.select.length) || this.select === '') {
          this.$notification['error']({
            message: '系统通知',
            description: '请先选择一条数据'
          })
          reject()
        }
        resolve(this.select)
      })
    },
    /**取消选择 */
    cancel(record) {
      this.select = this.select.filter(item => item[this.chooseKey] !== record[this.chooseKey])
    },
    selectPerson(record) {
      if (this.select.findIndex(item => item[this.chooseKey] === record[this.chooseKey] > 0)) {
        if (this.radio) {
          this.select = [record]
        } else {
          this.select.push(record)
        }
      }
      this.$emit('selectList', this.select)
    },
    refresh(arr = []) {
      this.select = arr
      this.$refs.table.refresh()
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/assets/style/index';
.top_1 {
  border: 1px solid #38b48d;
  border-radius: 4px;
  padding: 2px 6px;
  color: #38b48d;
  margin-right: 8px;
}
.top_2 {
  color: #333333;
}
/**操作按钮的样式*/
.buttonStyle {
  border: 1px solid #38b48d;
  border-radius: 4px;
  padding: 2px 6px;
  color: #38b48d;
}
// /deep/.ant-pagination-total-text {
//   position: static;
// }
</style>
