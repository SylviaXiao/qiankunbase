<template>
  <div>
    <a-tabs>
      <a-tab-pane :tab="item.text" v-for="item in tabList" :key="item.id" v-if="handlePermBox(item.perm)">
        <component :is="item.component" :ref="item.component" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
  import PermBox from '@/components/PermBox'
  import approvalListConfig from './modules/approvalListConfig'
  import billTypeConfig from './modules/billTypeConfig'

  export default {
    data() {
      return {
        tabList: [
          { id: 1, text: '审批流配置', component: 'approvalListConfig', perm: 'fast:workflow:view' },
          { id: 2, text: '类型配置', component: 'billTypeConfig', perm: 'fast:mode:view' },
        ]
      }
    },
    components: {
      PermBox,
      approvalListConfig,
      billTypeConfig
    },
    created() {
    },
    methods: {
      handlePermBox(str) {
        return this.$tools.checkPerm(str)
      },
    }
  }
</script>

<style lang="less" scoped type="text/less">
  @import '~@/assets/style/index';
</style>
