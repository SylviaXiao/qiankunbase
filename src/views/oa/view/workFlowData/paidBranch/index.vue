<template>
  <div class="paidBranch">
    <div class="belongs-teacher-header" style="height: 40px">
      <div></div>
      <div style="text-align:right;">
        <span style="color: #1ba97b;padding-left: 10px;cursor:pointer;">
          <span v-show="!isExpend" @click="isExpendVisual(true)">展开</span>
          <span v-show="isExpend" @click="isExpendVisual(false)">收起</span>
        </span>
      </div>
    </div>
    <div v-show="isExpend">
      <a-row style="font-weight: 600;">
        <a-col :span="9">
          付款分馆
        </a-col>
        <a-col :span="6">
          付款金额
        </a-col>
        <a-col :span="9" v-if="showEditPaidAccount">
          打款账户
        </a-col>
      </a-row>
      <div class="teacher-info" v-for="(item, index) in counselorInfo" :key="index">
        <a-row v-show="!schoolId || item.school.branchId == schoolId">
          <a-col :span="9">
            {{ item.school ? item.school.name : '' }}
          </a-col>
          <a-col :span="6">
            {{ item.money }}
          </a-col>
          <a-col :span="9" v-show="showEditPaidAccount">
            {{ item.bank ? item.bank.name : '' }}
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['value'],
  name: 'paidBranch',
  components: {},

  data() {
    return {
      isExpend: false,
      counselorInfo: this.value ? this.value.data : [],
      schoolId: null
    }
  },
  created() {
    this.schoolId = this.$route.params.schoolId != '0' ? this.$route.params.schoolId : null //按照分馆来展示当前审批人看到的数据，有分馆看当前分馆，没有看全部数据
  },
  computed: {
    //审批中是否允许查看/编辑付款分馆
    showEditPaidAccount() {
      return this.getFormData('showEditPaidAccount')
    }
  },
  mounted() {},
  methods: {
    getFormData(flag) {
      var root = this.$parent
      while (root) {
        if (flag in root) {
          return root[flag]
        }
        root = root.$parent
      }
    },
    isExpendVisual(flag) {
      this.isExpend = flag
    }
  },
  watch: {
    value: {
      handler: function(val) {
        if (val) {
          this.counselorInfo = val.data
        } else {
          this.counselorInfo = []
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style lang="less" scoped>
.belongs-teacher-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.paidBranch {
  width: 755px;
}
</style>
