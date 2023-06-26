<template>
  <div class="">
    <div class="belongs-teacher-header" style="height: 40px" v-show="!hideMoney">
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
        <a-col :span="2" v-show="!hideMoney">
          金额
        </a-col>
        <a-col :span="4" v-show="showEditFeeType">
          费用归类
        </a-col>
        <a-col :span="4" v-show="showEditFeeType">
          财务归类
        </a-col>
        <a-col :span="4" v-show="showEditFeeType">
          经营归类
        </a-col>
        <a-col :span="4" v-show="showEditFeeType">
          成本归类
        </a-col>
        <a-col :span="6" v-show="showEditFeeType">
          分摊
        </a-col>
      </a-row>
      <div class="teacher-info" v-for="(item, index) in finSpendingItemSplits" :key="index">
        <a-row>
          <a-col :span="2" v-show="!hideMoney">
            {{ item.splitPrice }}
          </a-col>
          <a-col :span="4" v-show="showEditFeeType">
            {{ item.feeItemName ? item.feeItemName.name : '' }}
          </a-col>
          <a-col :span="4" v-show="showEditFeeType">
            {{ item.financeName ? item.financeName.name : '' }}
          </a-col>
          <a-col :span="4" v-show="showEditFeeType">
            {{ item.operateName ? item.operateName.name : '' }}
          </a-col>
          <a-col :span="4" v-show="showEditFeeType">
            {{ item.costName ? item.costName.name : '' }}
          </a-col>
          <a-col :span="6">
            <div
              v-for="img in item.spendingSplits"
              :key="img.id"
              :style="item.spendingSplits.length > 1 ? 'line-height: 25px;' : ''"
              class="flex fc-uploadFile"
            >
              {{ img.startDate }}<span v-if="img.startDate !== img.endDate">~{{ img.endDate }}</span
              >/{{ img.parentDeptName || '' }}<span v-if="img.parentDeptName">/</span>{{ img.deptName }}/{{ img.price }}
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['value', 'hideMoney'],
  name: 'split',
  components: {},

  data() {
    return {
      isExpend: true,
      finSpendingItemSplits: this.value || {
        bindTypePrice: 'A',
        finSpendingItemSplits: []
      }
    }
  },
  created() {},
  computed: {
    //审批中是否允许查看/编辑费用归类
    showEditFeeType() {
      return this.getFormData('showEditFeeType')
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
          this.finSpendingItemSplits = val.finSpendingItemSplits
        } else {
          this.innerValue = {
            bindTypePrice: 'A',
            finSpendingItemSplits: []
          }
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style lang="stylus" scoped>
.belongs-teacher-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
</style>
