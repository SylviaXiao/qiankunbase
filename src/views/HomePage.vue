<template>
  <div class="home-wrapper">
    <a-card :bordered="false">
      <div class="user-header">
        <div v-if="avatar" class="avatar">
          <a-avatar :src="avatar" />
        </div>
        <div class="text">
          <div class="title">{{ timeFix }}，{{ user.userName }}</div>
          <div class="second-title">{{ userInfo.position ? userInfo.position.positionName : '无职位' }} | {{ school.name || school }}</div>
        </div>
      </div>
    </a-card>
    <div class="home-content">
      <div class="small-card-wrapper">
        <a-row :gutter="15">
          <span v-for="(item, index) in quickEntryArr" :key="index">
            <a-col :xs="24" :sm="12" :md="8" :lg="6">
              <homecard :title="item.title" :tips="item.tips" :params="item.params" :routerName="item.routerName" type="link" />
            </a-col>
          </span>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>
import { timeFix } from '@/utils/util'
import Vue from 'vue'
import { PermBox } from '@/components'
import Homecard from '@/components/Homecards/Homecard.vue'
export default {
  name: 'HomePage',
  computed: {
    userInfo() {
      return this.$store.getters.userInfo
    },
    school() {
      const schools = JSON.parse(Vue.ls.get('userSchoolId'))
      const userDefaultId = Vue.ls.get('userDefaultId')
      let school = '无分馆'
      if (!!schools && schools.length > 0) {
        school = schools.find(item => {
          return item.id === userDefaultId
        })
      }
      return school
    }
  },
  components: {
    PermBox,
    Homecard
  },
  data() {
    return {
      timeFix: timeFix(),
      avatar: '',
      user: {},
      quickEntryArr: [
        { title: '待我审批', routerName: 'approvalFormList', params: { tabKey: 1 } },
        {
          title: '已审批',

          routerName: 'approvalFormList',
          params: { tabKey: 2 }
        },
        { title: '付款记录', routerName: 'approvalFormList', params: { tabKey: 3 } },
        {
          title: '被驳回',

          routerName: 'myApproval',
          params: { tabKey: 1 }
        },
        { title: '审批中', routerName: 'myApproval', params: { tabKey: 2 } },
        {
          title: '已付款',

          routerName: 'myApproval',
          params: { tabKey: 3 }
        },
        { title: '草稿箱', routerName: 'myApproval', params: { tabKey: 4 } },
        {
          title: '已撤销',

          routerName: 'myApproval',
          params: { tabKey: 5 }
        }
      ]
    }
  },
  created() {
    this.avatar = this.userInfo.avatar
    this.user = this.userInfo.user
  }
}
</script>

<style scoped lang="less">
.home-wrapper {
  .user-header {
    display: flex;
    flex-flow: row nowrap;

    .avatar {
      flex: 0 1 72px;
      margin: 0 24px 8px 0;

      & > span {
        border-radius: 72px;
        display: block;
        width: 72px;
        height: 72px;
      }
    }

    .title {
      font-size: 20px;
      line-height: 28px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      margin-bottom: 16px;
      -webkit-box-flex: 1;
      -ms-flex: auto;
      flex: auto;
    }

    .second-title {
      color: rgba(0, 0, 0, 0.45);
    }
  }

  .home-content {
    .middle-card-wrapper {
      width: 100%;
      column-count: 1;
      margin-top: 15px;

      .middle-card {
        -moz-page-break-inside: avoid;
        -webkit-column-break-inside: avoid;
        break-inside: avoid;
        margin-bottom: 15px;
      }
    }

    .small-card-wrapper {
      div {
        height: 100%;
      }
    }
  }
}

canvas {
  width: 100% !important;
  /*    margin: 0 -5px;
        overflow: hidden;*/
}
</style>
