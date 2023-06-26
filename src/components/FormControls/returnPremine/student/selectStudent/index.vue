<template>
  <div class="content">
    <a-card class="mt20">
      <div class="title mb20">学员信息</div>
      <div class="studentInfo">
        <template>
          <a-select
            :open="isOpen"
            v-model.trim="queryParam.keywords"
            :autoClearSearchValue="false"
            mode="multiple"
            label-in-value
            :placeholder="searchPlaceHolder"
            style="width: 300px"
            :filter-option="false"
            :not-found-content="fetching ? undefined : null"
            @search="handleSearchInput"
            @change="handleChange"
          >
            <!-- 请输入学员手机号、姓名、微信号 -->
            <!-- @search="handleSearch($event, 'member')" -->
            <a-spin :spinning="fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="d in stuList" :key="d.memberId">
              {{ d.memberMsg }}
            </a-select-option>
          </a-select>
          <span style="cursor:pointer;" @click="handleSearch($event, 'member')">搜索</span>
          <!-- <a-button type="primary" class="ml20" @click="addStudent"> 新增学员 </a-button> -->
        </template>
      </div>

      <div class="StuInformation mt20 pd20">
        <a-spin :spinning="stuCardTableLoading" />
        <template v-if="memberDTO.memberName">
          <div :class="showMore ? 'overflow wrap' : 'wrap'">
            <div class="flex">
              姓名
              <div class="importText ml20">{{ memberDTO.memberName }}</div>
            </div>
            <div class="flex">
              手机号
              <div class="importText ml20">{{ memberDTO.memberPhone }}</div>
            </div>
            <div class="flex">
              顾问
              <div class="importText ml20 mr10">{{ memberDTO.adviserName || '无' }}</div>
            </div>
            <div class="flex">
              资源来源
              <div class="importText ml20 mr10">{{ memberDTO.memberSource || '无' }}</div>
            </div>
            <div class="flex">
              分馆
              <div class="importText ml20 mr10">{{ memberDTO.branchName || '无' }}</div>
            </div>
            <div v-show="showMore" class="flex">
              微信号
              <div class="importText ml20 mr10">{{ memberDTO.memberWeChat || '无' }}</div>
            </div>
            <div v-show="showMore" class="flex">
              QQ号
              <div class="importText ml20 mr10">{{ memberDTO.memberQQ || '无' }}</div>
            </div>
            <div v-show="showMore" class="flex">
              性别
              <div class="importText ml20 mr10">{{ memberDTO.memberSex === 'A' ? '男' : '女' || '无' }}</div>
            </div>
            <div v-show="showMore" class="flex">
              身份证号码
              <div class="importText ml20 mr10">{{ memberDTO.stuIdcard || '无' }}</div>
            </div>
            <div v-show="showMore" class="flex">
              出生年月
              <div class="importText ml20 mr10">{{ memberDTO.birth || '无' }}</div>
            </div>
            <div v-show="showMore" class="flex">
              省市
              <div class="importText ml20 mr10">{{ memberDTO.memberArea || '无' }}</div>
            </div>
            <div v-show="showMore" class="flex">
              紧急联系人/电话
              <div class="importText ml20 mr10">{{ memberDTO.stuEmergency || '无' }}</div>
            </div>
            <div v-show="showMore" class="flex">
              备注
              <div class="importText ml20 mr10">{{ memberDTO.memberRemark || '无' }}</div>
            </div>
          </div>
          <!-- <div class="aButton" @click="showMore = !showMore">{{ showMore ? '收起' : '查看更多' }}</div> -->
        </template>
        <template v-if="!stuCardTableLoading && !memberDTO.memberName">
          <a-row>
            <a-col :span="24" class="importText">
              <div class="flex">暂无信息</div>
            </a-col>
          </a-row>
        </template>
      </div>
    </a-card>
    <a-card class="mt20 template_table">
      <div class="title mb20">请选择需退费的卡种</div>
      <a-table
        :columns="returnCardColumns"
        :dataSource="memberReplenishes"
        :rowKey="(record, index) => record.memberCourseId"
        :pagination="false"
        :loading="stuCardTableLoading"
        style="padding-bottom: 10px"
        :rowSelection="rowSelection"
      ></a-table>
    </a-card>
    <!-- 新增编辑 -->
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" title="新增学员" :width="600" v-model="visible" @cancel="handleCancel" @ok="handleOk">
      <add-student ref="AddStudent" />
    </a-modal>
  </div>
</template>

<script>
let returnCardColumns = [
  {
    title: '卡号',
    key: 'cardNo',
    dataIndex: 'cardNo'
  },
  {
    title: '卡种名称',
    key: 'courseName',
    dataIndex: 'courseName',
    ellipsis: true
  },
  {
    title: '卡规格',
    key: 'spec',
    width: 150,
    dataIndex: 'spec',
    ellipsis: true
  },
  {
    title: '办卡时间',
    key: 'paymentTime',
    dataIndex: 'paymentTime',
    scopedSlots: { customRender: 'paymentTime' }
  },

  {
    title: '交费金额',
    key: 'price',
    dataIndex: 'price',
    scopedSlots: { customRender: 'price' }
  },

  {
    title: '办卡次数',
    dataIndex: 'num',
    key: 'num'
  },
  {
    title: '已使用次数',
    dataIndex: 'used',
    key: 'used'
  }
]
import { STable, AddStudent } from '@/components'
import { memberFindAll, findMemberCourse, findAllModel, getResourceById } from '@/api/workFlow/request.js'
import moment from 'moment'

export default {
  data() {
    return {
      searchPlaceHolder: '请输入学员手机号、姓名、微信号',
      isOpen: false, //是否展开搜索学员下拉框
      searchPramas: '',
      returnCardColumns,
      showMore: false,
      visible: false,
      queryParam: {
        keywords: []
      },
      selectedRows: [],
      selectedRowKeys: [],

      stuCardData: [],

      stuCardTableLoading: false,
      memberDTO: {},
      memberReplenishes: [],
      fetching: false,
      stuList: [],
      cardIndex: null
    }
  },

  components: {
    STable,
    AddStudent
  },

  computed: {
    getData() {
      if (!this.memberDTO.memberName) {
        return this.$notification['error']({
          message: '系统通知',
          description: '请选择学员'
        })
      } else if (this.selectedRows.length <= 0) {
        return this.$notification['error']({
          message: '系统通知',
          description: '请选择学员卡'
        })
      } else {
        return {
          memberDTO: this.memberDTO,
          selectedRows: this.selectedRows
        }
      }
    },
    rowSelection() {
      return {
        type: 'radio',
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys
          this.selectedRows = selectedRows
          this.memberReplenishes.forEach(item => {
            if (this.selectedRowKeys[0] == item.memberCourseId) {
              item.isSelect = true
              this.selectedRows = item
            } else {
              item.isSelect = false
            }
          })
        }
      }
    }
  },
  watch: {},
  created() {
    if (this.$route.query.id) {
      this.queryParam.keywords = [{ key: this.$route.query.id, label: this.$route.query.name }]
      this.handleChange(this.queryParam.keywords)
    }
  },

  methods: {
    handleSearchInput(value) {
      this.searchPramas = value
      this.searchPlaceHolder = value
    },
    handleSearch() {
      // value, type = 'all'
      let value = this.searchPramas
      //去除两头空格
      value = value.replace(/^\s*|\s*$/g, '')
      if (value) {
        if (this.fetching) return
        this.fetching = true
        memberFindAll({ keywords: value })
          .then(res => {
            if (res.code === 200) {
              // let filter = type === 'all' ? res.data : res.data.filter(item => item.type === type)
              this.stuList = res.data.map(item =>
                Object.assign(item, {
                  memberMsg:
                    item.memberName +
                    (item.memberPhone ? '/' + item.memberPhone : '') +
                    (item.memberQQ ? '/' + item.memberQQ : '') +
                    (item.memberWeChat ? '/' + item.memberWeChat : '') +
                    '(' +
                    (item.type === 'member' ? '学员' : '资源') +
                    ')'
                })
              )
              this.isOpen = true
            }
          })
          .finally(() => (this.fetching = false))
      }
    },
    async handleChange(value) {
      if (value.length > 1) {
        this.queryParam.keywords = [value[value.length - 1]]
      }
      if (this.queryParam.keywords.length) {
        this.stuCardTableLoading = true
        let type = this.stuList.length ? this.stuList.find(item => item.memberId === this.queryParam.keywords[0].key).type : 'member'
        let request =
          type == 'member' ? findMemberCourse({ memberId: this.queryParam.keywords[0].key }) : getResourceById({ targetId: this.queryParam.keywords[0].key })
        let DTORes = await request
        if (DTORes.code === 200) {
          let data =
            type === 'member'
              ? DTORes.data.memberDTO
              : {
                  memberName: DTORes.data.userName,
                  memberPhone: DTORes.data.userPhone,
                  memberWeChat: DTORes.data.userWechat,
                  memberQQ: DTORes.data.userQQ,
                  memberSex: DTORes.data.userSex,
                  birth: DTORes.data.birth,
                  memberArea: DTORes.data.userArea,
                  memberRemark: DTORes.data.userRemark
                }
          this.memberDTO = data
          if (this.$route.query.id) {
            this.handleSearch(value[0].label)
          }
        }
        let res = await findAllModel({ targetId: this.queryParam.keywords[0].key })
        if (res.code === 200) {
          this.memberReplenishes = res.data || null
          if (this.memberReplenishes.length > 0) {
            this.memberReplenishes.forEach(item => {
              item.isSelect = true
            })
          }
        }
        this.stuCardTableLoading = false
      } else {
        this.memberDTO = {}
        this.memberReplenishes = []
      }
      this.isOpen = false
      this.searchPlaceHolder = '请输入学员手机号、姓名、微信号'
    },
    handleOk() {
      this.$refs.AddStudent.checkForm().then(data => {
        this.confirmLoading = true
        saveResource({ ...data, resourceId: this.resourceId }).then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            this.handleCancel()
          }
        })
        this.confirmLoading = false
      })
    },
    handleCancel() {
      this.visible = false
      this.$refs.AddStudent.reset()
    },
    addStudent() {
      this.visible = true
    },
    // 限制选择时间范围,不能选之后的天 :disabledDate="afterDisabledDate"
    afterDisabledDate(current) {
      return current && current > moment().endOf('day')
    },
    _refreshTable() {
      // this.$refs.table.refresh()
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/assets/style/index';
.content {
  // height: 100%;
  padding-bottom: 20px;

  .StuInformation {
    background-color: @theme-bottom-color;
    display: flex;
    justify-content: space-between;

    .importText {
      font-weight: bold;
    }
  }
  .title {
    font-size: 16px;
    font-weight: bold;
    background-color: #fff;
  }
  .title_card {
    padding: 20px 10px 0px 18px;
  }

  .account {
    position: fixed;
    bottom: 0;
    right: 0;
    background: #e5e5e5;
    width: 100%;
    box-sizing: border-box;
    padding: 0px 40px;
    // box-shadow: 0px -1px 6px #ddd;
    color: #434343;
    z-index: 9;

    /deep/ button {
      color: #fff !important;
      background-color: #b0b0b0 !important;
      border-color: #b0b0b0 !important;
      border-radius: 0;
      height: 40px;
      width: 85px;
    }
    button.active {
      background-color: #1ba97b !important;
      border-color: #1ba97b !important;
    }
  }

  .msg {
    background-color: @theme-bottom-color;
    padding: 10px 20px;
    margin-top: 20px;
  }

  .text {
    color: @theme-text;
  }
}
/deep/.ant-card-body {
  padding: 20px 18px 20px 23px !important;
}
.template_table {
  /deep/.ant-table-tbody > tr > td {
    background: #eee;
    color: #b0b0b0;
  }
  /deep/.ant-table-tbody > tr.ant-table-row-selected td {
    color: inherit;
    background: #fafafa;
    color: #646566;
  }
  .grey {
    color: #b0b0b0 !important;
    pointer-events: none;
    cursor: default;
  }
}
.Warning {
  text-align: center;
  color: red;
}
.wrap {
  width: calc(100% - 120px);
  flex-wrap: wrap;
  display: flex;
  height: 30px;
  overflow: hidden;
  > div {
    padding: 0 25px 10px 0;
  }
}
.overflow {
  height: auto;
}
.studentInfo {
  /deep/.ant-select-selection {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }
  > span {
    cursor: pointer;
    display: inline-block;
    background: #19a97b;
    padding: 6px 10px 5px;
    color: #fff;
    border-bottom-right-radius: 4px;
    border-top-right-radius: 4px;
  }
}
</style>
