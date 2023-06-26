<template>
  <div ref="modalContainer">
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="选择员工"
      :width="800"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      :userType="userType"
      :getContainer="getContainer"
    >
      <div class="inner-modal-search" @keyup.13="searchTable" tabindex="1">
        <a-form :form="searchForm">
          <div class="searchGroup">
            <a-row v-if="serverGroupSwitch" style="margin-bottom:10px;">
              批量快速选择：
              <a-radio-group v-model="serverGroup" @change="changeGroup">
                <a-radio :value="item.id" v-for="item in serverGroups" :key="item.id">
                  {{ item.name }}
                </a-radio>
              </a-radio-group>
            </a-row>
            <a-row class="form-row" :gutter="16">
              <a-col :lg="8" :md="8" :sm="24" v-if="(userType == 'master' || userType == 'all') && !showBranch">
                <a-form-item label="分馆" v-bind="itemLayout">
                  <a-select :allowClear="true" v-decorator="['deptId', { initialValue: defValue }]" @change="changeDepts">
                    <a-select-option allowClear :value="school.deptId || school.id" v-for="(school, index) in deptList" :key="index">
                      {{ school.deptName }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :lg="4" :md="4" :sm="24" v-if="(userType == 'master' || userType == 'all') && !showBranch">
                <a-form-item>
                  <a-checkbox @change="changeOtherDept">跨分馆</a-checkbox>
                </a-form-item>
              </a-col>
              <a-col :lg="8" :md="8" :sm="24">
                <a-form-item label="姓名" v-bind="itemLayout">
                  <a-input v-decorator="['name']" allowClear></a-input>
                </a-form-item>
              </a-col>
              <a-col :lg="3" :md="3" :sm="24">
                <a-form-item>
                  <a-button @click="searchTable()">查询</a-button>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
        </a-form>
      </div>
      <div v-if="isNumber" class="mb20">
        <div>已选择员工</div>
        <a-table
          :columns="columnsNumber"
          :rowSelection="rowSelection"
          :rowKey="(record, index) => record.id + ',' + record.deptid"
          :data-source="selectedRows"
          :pagination="false"
        >
        </a-table>
      </div>
      <s-table
        ref="table"
        :columns="columns"
        :data="userData"
        :rowSelection="rowSelection"
        :rowKey="(record, index) => record.id + ',' + record.deptid"
        @result="result"
        :defaultPagination="defaultPagination"
      >
        <span slot="positionName" slot-scope="text, record"> {{ text }} <a-tag v-if="record.isLeader">主管</a-tag> </span>
        <!-- <span slot="action" slot-scope="text, record">
          选择 -->
        <!-- <span v-if="!select.length || !select.some(item => item[chooseKey] == record[chooseKey])">
            <a href="#" @click="selectPerson(record)"><span class="buttonStyle">选择</span></a>
          </span>
          <span v-if="select.length && select.some(item => item[chooseKey] == record[chooseKey]) && deleteBtn">
            <span class="top_1">已选择</span>
            <a href="#" @click="cancel(record)"><span class="top_2">取消</span></a>
          </span> -->
        <!-- </span> -->
      </s-table>
    </a-modal>
  </div>
</template>

<script>
import { getALLDeptSchools } from '@/api/organize'
import { getUsersInDept, getCustomerGroups } from '@/api/common'
import Vue from 'vue'
import STable from '@/components/Table'

const itemLayout = {
  labelCol: {
    xs: { span: 4 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 20 },
    sm: { span: 20 }
  }
}
const columns = [
  {
    title: '工号',
    dataIndex: 'userNo'
  },
  {
    title: '姓名',
    dataIndex: 'userName'
  },
  {
    title: '性别',
    dataIndex: 'userSex',
    customRender: text => {
      let showText
      text == 'A' ? (showText = '男') : (showText = '女')
      return showText
    }
  },
  {
    title: '手机号码',
    dataIndex: 'userTel'
  },
  {
    title: '职位',
    dataIndex: 'positionName',
    scopedSlots: { customRender: 'positionName' }
  }
  // {
  //   title: '操作',
  //   dataIndex: 'action',
  //   scopedSlots: { customRender: 'action' }
  // }
]
const columnsNumber = [
  { title: '序号', dataIndex: 'isNumber' },
  {
    title: '工号',
    dataIndex: 'userNo'
  },
  {
    title: '姓名',
    dataIndex: 'userName'
  },
  {
    title: '性别',
    dataIndex: 'userSex',
    customRender: text => {
      let showText
      text == 'A' ? (showText = '男') : (showText = '女')
      return showText
    }
  },
  {
    title: '手机号码',
    dataIndex: 'userTel'
  },
  {
    title: '职位',
    dataIndex: 'positionName',
    scopedSlots: { customRender: 'positionName' }
  }
  // {
  //   title: '操作',
  //   dataIndex: 'action',
  //   scopedSlots: { customRender: 'action' }
  // }
]
export default {
  name: 'modal',
  props: {
    //已经选择的
    // defaultList: {
    //   type: Array,
    //   default: () => []
    // },
    //是否显示
    showBranch: {
      type: Boolean,
      default: false
    },
    //是否开启客服小组选择
    serverGroupSwitch: {
      type: Boolean,
      default: false
    },
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
    multiple: {
      type: Boolean,
      default: false
    },
    userType: {
      type: String,
      default: 'all'
    },
    //资源渠道选择的Id
    ChannelId: {
      type: String,
      default: ''
    },
    defaultPagination: {
      type: Boolean,
      default: false
    },
    showPagination: {
      type: Boolean,
      default: false
    },
    autoClose: {
      type: Boolean,
      default: true
    },
    innerContainer: {
      type: Boolean,
      default: false
    }
  },
  components: {
    STable
  },
  data() {
    return {
      itemLayout,
      columns,
      deptList: JSON.parse(Vue.ls.get('userSchoolId')),
      defValue: Vue.ls.get('userDefaultId'),
      visible: false,
      confirmLoading: false,
      queryParam: {},
      userTypeData: 'all',
      userData: parameter => {
        let request = getUsersInDept
        if (this.userType == 'service') {
          delete this.queryParam.deptId
        }
        if (this.ChannelId) {
          this.queryParam.deptId = this.ChannelId
        }
        if (this.defaultPagination) {
          parameter.limit = 1000
        }
        return request(this.userType, Object.assign(parameter, this.queryParam)).then(res => {
          let that = this
          this.$nextTick(() => {
            that.setNumber()
          })
          return res
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      firstTimeInThisComponents: false,
      serverGroup: '',
      serverGroups: [{ id: 'A', text: '全部客服' }, { id: 'B', text: '元气' }, { id: 'C', text: '追梦' }],
      data: [],
      columnsNumber
      // :false,
    }
  },
  beforeCreate() {
    this.searchForm = this.$form.createForm(this)
  },
  created() {
    // this.deptList = JSON.parse(Vue.ls.get('userSchoolId'))
    // this.defValue = Vue.ls.get('userDefaultId')
    // {
    if (this.userType == 'master' || this.userType == 'all') {
      this.queryParam.deptId = this.defValue
    } else {
      this.queryParam.deptId = null
    }
  },
  mounted() {
    this.firstTimeInThisComponents = true
  },
  watch: {
    // visible: {
    //   deep: true,
    //   handler(val) {
    //     if (val && this.isNumber) {
    //       if (this.defaultList.length > 0) {
    //         this.selectedRows = JSON.parse(JSON.stringify(this.defaultList))
    //         this.selectedRowKeys = JSON.parse(JSON.stringify(this.defaultList.map(item => item.id)))
    //         this.$forceUpdate()
    //       }
    //     }
    //   }
    // },
    data: {
      deep: true,
      handler() {
        // this.serverGroup!=='' && this.changeGroup()
      }
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        type: this.checkBox ? 'checkbox' : 'radio',
        // getCheckboxProps: record => ({
        //   props: {
        //     disabled: this.selectedKeys.includes(record.id)
        //   }
        // })
      }
    }
  },
  methods: {
    setNumber() {
      if (this.isNumber && this.selectedRows.length > 0) {
        this.selectedRows.forEach((item, index) => {
          item.isNumber = index + 1
        })
        this.$forceUpdate()
      }
    },
    getContainer() {
      return this.innerContainer ? this.$refs.modalContainer : document.body
    },
    result(data) {
      this.data = data.data
    },
    changeGroup() {
      this.selectedRowKeys = []
      this.selectedRows = []
      if (this.serverGroup === 'all') {
        this.selectedRows = this.data
        this.selectedRowKeys = this.data.map(item => {
          return item.id + ',' + item.deptid
        })
      } else {
        let RowKeys = []
        let Rows = []
        let arr = this.serverGroups.find(item => item.id === this.serverGroup).customers.map(item => item.userid)
        this.data.forEach(item => {
          if (arr.some(todo => todo === item.id)) {
            RowKeys.push(item.id + ',' + item.deptid)
            Rows.push(item)
          }
        })
        this.selectedRowKeys = RowKeys
        this.selectedRows = Rows
        // customers
      }
    },
    initData() {},
    open(value) {
      this.queryParam.name = ''
      this.visible = true
      this.$nextTick(() => {
        this.selectedRowKeys = []
        this.selectedRows = []
        if (value) {
          if (this.checkBox) {
            this.selectedRowKeys = value.map(item => item.id + (item.deptId ? ',' + item.deptId : ''))
          } else {
            this.selectedRowKeys = value.id + (value.deptId ? ',' + value.deptId : '')
          }
          this.selectedRows = JSON.parse(JSON.stringify(value))
        }
        if (this.firstTimeInThisComponents) {
          this.firstTimeInThisComponents = false
          return
        }
        this.dataRefesh()
      })
      if (this.serverGroupSwitch) {
        getCustomerGroups().then(res => {
          if (res.code === 200) {
            this.serverGroups = res.data
            this.serverGroups.unshift({ name: '全部客服', id: 'all' })
          }
        })
      }
      // if (this.isNumber) {
      //   if (this.defaultList.length > 0) {
      //     this.selectedRows = JSON.parse(JSON.stringify(this.defaultList))
      //     this.selectedRowKeys = JSON.parse(JSON.stringify(this.defaultList.map(item => item.id)))
      //     this.$forceUpdate()
      //   }
      // }
    },
    dataRefesh() {
      if (this.userType == 'master' || this.userType == 'all') {
        this.queryParam.deptId = this.defValue
      } else {
        this.queryParam.deptId = null
      }
      this.$nextTick(() => {
        this.searchForm.setFieldsValue({ ['deptId']: this.defValue })
        this.searchForm.setFieldsValue({ ['name']: '' })
      })
      if (this.$refs.table && !this.isNumber) {
        this.$refs.table.refresh()
      }
    },
    close() {
      this.serverGroup = null
      this.selectedRows = []
      this.selectedRowKeys = []
      this.visible = false
    },
    handleCancel() {
      this.close()
    },
    handleOk() {
      if (this.selectedRows.length == 0) {
        this.$notification['error']({
          message: '系统通知',
          description: '请选择一条数据'
        })
      }
      const backData = {
        id: this.selectedRows[0].id,
        name: this.selectedRows[0].userName
      }
      if (!this.checkBox) {
        this.$emit('getBackData', backData, this.userType)
      } else {
        this.$emit('getBackData', this.selectedRows, this.userType, 'mutiple')
      }
      if (this.autoClose) this.close()
    },
    unique(arr) {
      // 缓存用于记录
      const arr1 = []
      for (const t of arr) {
        // 检查缓存中是否已经存在
        if (arr1.find(c => c.id + ',' + c.deptid === t.id + ',' + t.deptid)) {
          // 已经存在说明以前记录过，现在这个就是多余的，直接忽略
          continue
        }
        // 不存在就说明以前没遇到过，把它记录下来
        arr1.push(t)
      }
      // 记录结果就是过滤后的结果
      return arr1
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      if (this.checkBox && selectedRowKeys.length > 0) {
        let selectedRowsOld = JSON.parse(JSON.stringify(this.selectedRows)).concat(selectedRows)
        selectedRowsOld = this.unique(selectedRowsOld)
        selectedRowsOld.forEach((item, index) => {
          if (!this.selectedRowKeys.includes(item.id + ',' + item.deptid)) {
            selectedRowsOld.splice(index, 1)
          }
        })
        this.selectedRows = selectedRowsOld
      } else {
        this.selectedRows = selectedRows
      }
      this.$nextTick(() => {
        this.setNumber()
      })
    },
    changeOtherDept(check) {
      if (check.target.checked) {
        getALLDeptSchools().then(res => {
          let params = { id: '', deptName: '全部' }
          res.data.unshift(params)
          this.deptList = res.data
        })
      } else {
        this.deptList = JSON.parse(Vue.ls.get('userSchoolId'))
      }
    },
    changeDepts(data) {
      this.queryParam.deptId = data
    },
    searchTable() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.queryParam = values
          if (!this.isNumber) this.selectedRowKeys = []
          this.$refs.table.refresh()
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.inner-modal-search {
  outline: none;
}
#inner-modal {
  width: 100px;
  margin: 0 auto;
}
/**操作按钮的样式*/
.buttonStyle {
  border: 1px solid #38b48d;
  border-radius: 4px;
  padding: 2px 6px;
  color: #38b48d;
}
</style>
