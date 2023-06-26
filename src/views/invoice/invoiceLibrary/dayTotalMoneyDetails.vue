<template>
  <div class="mt20">
    <a-card :bordered="false">
      <div class="mb20">
        <a-button @click="handleReset()">重置查询</a-button>
      </div>
      <s-table
        ref="table"
        :columns="columns"
        :data="loadData"
        :rowKey="(record, index) => record.procinstId + record.schoolId + index"
        :scroll="{ x: true }"
      >
        <span slot="_title" slot-scope="text, record">
          <a href="#" @click="toInfo(record)">
            <a-icon type="fire" theme="filled" style="color: red" v-if="record.urgent === 'A'" />
            {{ record.title || '无' }}
          </a>
        </span>
        <a-icon slot="filterIcon" slot-scope="filtered" type="search" :style="{ color: filtered ? '#1ba97b' : undefined }" />
        <div slot="filterDropdown" slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }" class="column_search_wrap">
          <template v-if="column.dataIndex === 'state'">
            <a-radio-group
              class="mb10"
              :value="selectedKeys[0]"
              @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
            >
              <a-radio
                class="column_search_radio"
                v-for="(option, optioni) in stateOptions"
                :key="optioni"
                :value="option.value"
                :checked="queryParam.state == option.value"
              >
                {{ option.label }}
              </a-radio>
            </a-radio-group>
          </template>
          <template v-else-if="column.dataIndex === 'branchName'">
            <a-select
              style="width: 100%"
              class="mb10"
              :value="selectedKeys[0]"
              :placeholder="`请输入${column.title}`"
              :showSearch="true"
              :allowClear="true"
              :dropdownMatchSelectWidth="false"
              :filterOption="filterOption"
              @change="e => setSelectedKeys(e ? [e] : [])"
            >
              <a-select-option v-for="(option, optioni) in schoolList" :key="optioni" :value="option.schoolId">
                {{ option.schoolName }}
              </a-select-option>
            </a-select>
          </template>
          <template v-else-if="column.dataIndex === 'createTime'">
            <a-range-picker
              style="width: 100%"
              class="mb10"
              format="YYYY-MM-DD"
              valueFormat="YYYY-MM-DD"
              :value="selectedKeys[0]"
              :disabledDate="disabledDate"
              :allowClear="true"
              @change="e => setSelectedKeys(e.length > 0 ? [e] : [])"
            />
          </template>
          <template v-else>
            <a-input
              class="column_search_input mb10"
              :placeholder="`请输入${column.title}`"
              :value="selectedKeys[0]"
              @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
              @pressEnter="() => handleSearch(clearFilters, selectedKeys[0], confirm, column.dataIndex)"
            />
          </template>
          <span class="between">
            <a-button type="primary" size="small" @click="() => handleSearch(clearFilters, selectedKeys[0], confirm, column.dataIndex)">
              搜索
            </a-button>
            <a-button size="small" @click="() => handleReset(clearFilters, column.dataIndex)">
              重置
            </a-button>
          </span>
        </div>
      </s-table>
    </a-card>
  </div>
</template>

<script>
  import moment from 'moment'
  import { STable } from '@/components'
  import { listWorkflowRoleUserDetail, finishInvoicePage } from '@/api/workFlow/request'

  const stateOptions = [
    { value: '-1', label: '驳回' },
    { value: '0', label: '待审批' },
    { value: '1', label: '审批中' },
    { value: '2', label: '通过' },
    { value: '3', label: '撤回' },
    { value: '5', label: '确定' }
  ]
  const columns = [
    {
      title: '标题',
      key: '_title',
      dataIndex: '_title',
      scopedSlots: {
        customRender: '_title',
        filterDropdown: 'filterDropdown',
        filterIcon: 'filterIcon'
      }
    },
    {
      title: '单据模板',
      dataIndex: 'procdefName',
      key: 'procdefName',
      scopedSlots: {
        customRender: 'procdefName',
        filterDropdown: 'filterDropdown',
        filterIcon: 'filterIcon'
      }
    },
    {
      title: '类型',
      dataIndex: 'modeType',
      key: 'modeType',
      scopedSlots: {
        customRender: 'modeType',
        filterDropdown: 'filterDropdown',
        filterIcon: 'filterIcon'
      }
    },
    {
      title: '单号',
      dataIndex: 'procinstNo',
      key: 'procinstNo',
      scopedSlots: {
        customRender: 'procinstNo',
        filterDropdown: 'filterDropdown',
        filterIcon: 'filterIcon'
      }
    },
    {
      title: '提交日期',
      dataIndex: 'createTime',
      key: 'createTime',
      scopedSlots: {
        customRender: 'createTime',
        filterDropdown: 'filterDropdown',
        filterIcon: 'filterIcon'
      },
      customRender: text => {
        return text ? moment(text).format('YYYY-MM-DD') : ''
      }
    },
    {
      title: '合计金额',
      dataIndex: 'totalMoney',
      key: 'totalMoney',
      scopedSlots: {
        customRender: 'totalMoney',
        filterDropdown: 'filterDropdown',
        filterIcon: 'filterIcon'
      }
    },
    {
      title: '提交分馆',
      dataIndex: 'branchName',
      key: 'branchName',
      scopedSlots: {
        customRender: 'branchName',
        filterDropdown: 'filterDropdown',
        filterIcon: 'filterIcon'
      }
    },
    {
      title: '提交人',
      dataIndex: 'createUser',
      key: 'createUser',
      scopedSlots: {
        customRender: 'createUser',
        filterDropdown: 'filterDropdown',
        filterIcon: 'filterIcon'
      },
      sorter: true
    },
    {
      title: '审批状态',
      dataIndex: 'state',
      key: 'state',
      scopedSlots: {
        customRender: 'state',
        filterDropdown: 'filterDropdown',
        filterIcon: 'filterIcon'
      },
      customRender: text => {
        return stateOptions.find(item => item.value == text)?.label || ''
      }
    }
  ]

  export default {
    name: 'dayTotalMoneyDetails',
    components: { STable },
    data() {
      return {
        queryParam: {},
        stateOptions,
        clearFilters: null,
        columns,
        schoolList: [],
        loadData: parameter => {
          const { page, limit, sortField, sortOrder } = parameter
          const { procinstIds } = this.$route.params
          let pageInfo = { pageNum: page, pageSize: limit }
          if (sortField === 'createUser' && sortOrder === 'ascend') {
            pageInfo.orderByColumn = ' CONVERT(TRIM(procinst.create_user_name) USING gbk) asc'
          } else if (sortField === 'createUser' && sortOrder === 'descend') {
            pageInfo.orderByColumn = ' CONVERT(TRIM(procinst.create_user_name) USING gbk) desc'
          } else {
            pageInfo.orderByColumn = ' procinst.create_time desc'
          }
          return finishInvoicePage(Object.assign({ state: 2, procinstIds }, pageInfo, this.queryParam)).then(res => {
            return res
          })
        },
      }
    },
    watch: {
      $route: {
        handler: function(route) {
          if (route.name == 'dayTotalMoneyDetails') {
            this.initTabTitle()
            this._refreshTable()
          }
        },
        immediate: true,
        deep: true
      }
    },
    created() {
      this.initSchoolList()
    },
    methods: {
      disabledDate(current) {
        return current && current > moment().endOf('day')
      },
      initTabTitle() {
        const { createUserName, totalMoney } = this.$route.params
        this.$multiTab.rename(this.$route.fullPath, `${createUserName}(${totalMoney})`)
      },
      initSchoolList() {
        listWorkflowRoleUserDetail().then(res => {
          let data = []
          if (res.code == 200 && Array.isArray(res.data) && res.data.length > 0) {
            res.data.forEach(item => {
              if (Array.isArray(item.schools) && item.schools.length > 0) {
                data = data.concat(item.schools)
              }
            })
          }
          this.schoolList = this.process(data)
        })
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
      filterOption(input, option) {
        return option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase())
      },
      handlePermBox(str) {
        return this.$tools.checkPerm(str)
      },
      _refreshTable() {
        this.queryParam = {}
        this.$refs.table && this.$refs.table.refresh()
      },
      // 搜索
      handleSearch(clearFilters, value, confirm, dataIndex) {
        if (dataIndex === '_title') {
          this.queryParam['title'] = value
        } else if (dataIndex === 'createTime') {
          this.queryParam['startCreateTime'] = value[0]
          this.queryParam['endCreateTime'] = value[1]
        } else {
          this.queryParam[dataIndex] = value
        }
        this.clearFilters = clearFilters
        confirm()
      },
      // 重置
      handleReset(clearFilters, dataIndex) {
        if (clearFilters && dataIndex) {
          if (dataIndex === '_title') {
            this.queryParam['title'] = undefined
          } else if (dataIndex === 'createTime') {
            this.queryParam['startCreateTime'] = undefined
            this.queryParam['endCreateTime'] = undefined
          } else {
            this.queryParam[dataIndex] = undefined
          }
          clearFilters()
        } else {
          this.queryParam = {}
          this.clearFilters ? this.clearFilters() : this._refreshTable()
        }
      },

      // 跳转详情
      toInfo(record) {
        let id = record.procinstId ? record.procinstId : record.undoId
        //结合open打开新的页面
        // window.open(href, '_blank')
        this.$router.push({
          name: 'viewNew',
          params: { id: id, undoId: 0, schoolId: 0, isWait: false }
        })
      }
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  @import '~@/assets/style/index';

  .column_search_wrap {
    width: 220px;
    padding: 10px;

    .column_search_input {
      display: block;
      width: 100%;
    }

    .column_search_radio {
      display: block;
      height: 30px;
      line-height: 30px;
    }
  }
  .checkIcon {
    margin-right: 10px;
    font-size: 14px;
    font-weight: 500;
  }
  .checkIcon.check {
    color: #1ba97b;
    margin-left: 6px;
  }
  .selectBtn {
    border: 1px solid #d9d9d9;
    vertical-align: middle;
    display: inline-block;
    height: 32px;
    line-height: 1.499;
    white-space: nowrap;
    text-align: center;
    // box-shadow: 0 2px 0 rgba(0, 0, 0, 2%);
    cursor: pointer;
    border-radius: 4px;
    overflow: hidden;

    .ant-btn {
      border: 0;
      box-shadow: none;
    }
  }
  .selectBtn.active {
    // background-color: #f5f5f5;
    .ant-btn {
      border: 0;
    }
  }
  .ant-table-thead > tr > th .ant-table-filter-icon {
    right: unset;
  }
</style>
