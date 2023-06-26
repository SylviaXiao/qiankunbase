<template>
  <div class="workFlowline">
    <!--<div v-for="item in flowLine" :key="item.id">
      <div class="mr20 workFlowlinexontent">
        <div class="title">
          <div class="avatar">
            <a-icon type="user" />
          </div>
        </div>
        <div class="mt10">
          <div v-for="items in item" :key="items.id">
            <div>
              <span>{{ items.name }}</span>
              <span v-if="items.positionName">（{{ items.positionName }}）</span>
            </div>
          </div>
        </div>
      </div>
    </div>-->
    <div v-for="(item, index) in flowLine" :key="index">
      <div class="workFlowlinexontent mt20 ml10 mr10">
        <div class="title">
          <div class="avatar">
            <a-icon type="user" />
          </div>
        </div>
        <div class="mt10">
          <div v-if="item.roleName">（{{ item.roleName }}）</div>
          <div v-for="(col, colIndex) in item.userName" :key="colIndex">{{ col }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { listProcdefMember, approveAllUsers } from '@/api/workFlow/request'
export default {
  name: 'workFlowline',
  props: ['procinstId', 'schoolId'],
  data() {
    return {
      flowLine: []
    }
  },
  components: {},

  created() {},

  computed: {},
  methods: {
    init() {
      // let that = this
      // listProcdefMember({ procinstId: this.procinstId, schoolId: this.schoolId }).then(function(res) {
      //   if (res.code == 200) {
      //     if (res.data && Array.isArray(res.data)) {
      //       res.data.forEach(items => {
      //         items.forEach(item => {
      //           item.positionName = item.roleNameList && Array.isArray(item.roleNameList) && item.roleNameList.length > 0 ? item.roleNameList[0] : ''
      //         })
      //       })
      //       that.flowLine = res.data
      //     }
      //   }
      // })

      approveAllUsers({ procinstId: this.procinstId }).then(res => {
        if (res.data && res.data.length > 0) {
          res.data.forEach(item => {
            item.userName = item.userName ? item.userName.split(',') : []
          })
          this.flowLine = res.data
        }
      })
    }
  },
  watch: {
    procinstId: {
      handler: function(procinstId) {
        if (procinstId) {
          this.init()
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
<style scoped lang="less" media="print">
.workFlowline {
  display: flex;
  flex-wrap: wrap;
  .workFlowlinexontent {
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    width: 86px;
  }
  .title {
    display: flex;
    justify-content: center;
  }
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #1ba97b;
    font-size: 30px;
    text-align: center;
    line-height: 50px;
    color: #fff;
  }
}
</style>
