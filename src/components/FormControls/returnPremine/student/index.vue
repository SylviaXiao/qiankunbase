<template>
  <div class="fc-return-student">
    <a-button type="primary" v-bind="$props" v-on="$listeners" :disabled="disabled" class="ml20" @click="selectStudent"> 选择学员卡 </a-button>
    <!-- <a-card class="mt20 ">
      <a-card class=" ">
        <div class="tab_title">
          <span>学员信息</span>
        </div>
        <a-row v-if="memberDTO">
          <a-col class="mb10" :span="12"> 学员姓名：{{ memberDTO.memberName }} </a-col>
          <a-col class="mb10" :span="12"> 联系方式：{{ memberDTO.memberPhone }} </a-col>
          <a-col class="mb10" :span="12"> 学员卡号：{{ selectedRows.courseName }} </a-col>
          <a-col class="mb10" :span="12"> 卡种名称：{{ selectedRows.memberName }} </a-col>
          <a-col :span="12"> 总缴费金额：{{ selectedRows.price }} </a-col>
          <a-col :span="12"> 使用次数：{{ selectedRows.num }} </a-col>
        </a-row>
        <a-empty v-else />
      </a-card>
      <a-card class="mt20 ">
        <div class="tab_title">
          <span>业绩信息</span>
        </div>
        <div v-if="selectedRows && selectedRows.commissionDTOList && selectedRows.commissionDTOList.length > 0">
          <a-card v-for="item in selectedRows.commissionDTOList" :key="item.id" class="mb10">
            <a-row>
              <a-col class="mb10" :span="12"> 缴费业绩员工：{{ item.employName }} </a-col>
              <a-col class="mb10" :span="12"> 缴费业绩分馆：{{ item.branchName }} </a-col>
              <a-col :span="12"> 缴费业绩金额：{{ item.amount }} </a-col>
              <a-col :span="12"> 缴费业绩比例：{{ item.proportion }} </a-col>
            </a-row>
          </a-card>
        </div>
        <a-empty v-else />
      </a-card>
    </a-card> -->
    <!-- 选择学员卡 -->
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" title="选择学员卡" :width="1200" v-model="visible" @cancel="handleCancel" @ok="handleOk">
      <selectStudent ref="selectStudent" />
    </a-modal>
  </div>
</template>
<script>
import selectStudent from './selectStudent'
import { listBranchPerformanceByMemberCourseId } from '@/api/workFlow/request.js'
export default {
  model: {
    prop: 'value',
    event: 'input'
  },
  name: 'fc-return-student',
  props: ['value', 'disabled'],
  data() {
    return {
      visible: false,
      memberDTO: null,
      selectedRows: null
    }
  },
  watch: {
    value: {
      handler: function(val) {
        console.log(this.disabled)
        if (!val) return
      },
      immediate: true,
      deep: true
    }
  },
  components: { selectStudent },
  computed: {},
  methods: {
    selectStudent() {
      if (!this.disabled) {
        this.visible = true
      }
    },
    handleCancel() {
      this.visible = false
    },
    async handleOk() {
      if (this.$refs.selectStudent.getData) {
        let { memberDTO, selectedRows } = this.$refs.selectStudent.getData
        this.memberDTO = memberDTO
        this.selectedRows = selectedRows
        let performanceList = await listBranchPerformanceByMemberCourseId({
          targetId: selectedRows.memberCourseId
        })
        this.$emit('change', {
          member: this.memberDTO,
          memberCourse: Array.isArray(this.selectedRows) ? this.selectedRows[0] : this.selectedRows,
          performanceList: performanceList.data ? performanceList.data : []
        })
        this.handleCancel()
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/assets/style/index';
.fc-return-student {
  position: relative;
  .content {
    padding: 20px;
  }
  .tab_title {
    border-left: 3px solid #1ba97b;
    padding: 0 0 0 15px;
    margin: -10px 10px 25px 0;
    font-size: 16px;
    font-weight: 700;
    color: #1b1b1b;
    display: flex;
    align-items: center;
    div {
      width: 80%;
      margin-left: 20px;
      height: 1px;
      background-color: #e3e3e3;
    }
  }
  /deep/.ant-card-body {
    padding: 20px !important;
  }
}
</style>
