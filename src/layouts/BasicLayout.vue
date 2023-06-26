<template>
  <div>
    <template v-if="!poweredByQiankun">
      <a-layout :class="['layout', device]" style="height: 100vh;">
        <!-- SideMenu -->
        <a-drawer
          v-if="isMobile()"
          placement="left"
          :wrapClassName="`drawer-sider ${navTheme}`"
          :closable="false"
          @toggle="toggleFalse"
          :visible="collapsed"
          @close="drawerClose"
        >
          <side-menu mode="inline" :show="show" :menus="menus" :theme="navTheme" :collapsed="false" :collapsible="true" @menuSelect="menuSelect"></side-menu>
        </a-drawer>
        <!-- isSideMenu() -->
        <side-menu
          v-else-if="!isMobile()"
          mode="inline"
          :menus="menus"
          :show="show"
          :theme="navTheme"
          @toggle="toggleFalse"
          :collapsed="collapsed"
          :collapsible="true"
        ></side-menu>
        <!-- :collapsed="isMobile() ? collapsed : false" -->
        <a-layout :class="[layoutMode, `content-width-${contentWidth}`]" :style="{ paddingLeft: contentPaddingLeft, minHeight: '100vh' }">
          <!-- layout header -->
          <global-header :mode="layoutMode" :menus="menus" :theme="navTheme" :collapsed="collapsed" :device="device" @toggle="toggle" />

          <!-- layout content -->
          <a-layout-content :style="{ height: '100%', padding: '24px 20px', paddingTop: fixedHeader ? '64px' : '0', overflow: 'auto', position: 'relative ' }">
            <!-- <multi-tab v-if="multiTab" ref="multiTab"></multi-tab> -->
            <div>
              <transition name="page-transition">
                <!--         <a-spin :spinning="true">-->
                <route-view class="view"></route-view>
                <!--         </a-spin>-->
              </transition>
            </div>
          </a-layout-content>

          <!-- layout footer -->
          <a-layout-footer>
            <global-footer />
          </a-layout-footer>

          <!-- Setting Drawer (show in development mode) -->
          <!--      <setting-drawer v-if="!production"></setting-drawer>-->
        </a-layout>
      </a-layout>
    </template>
    <template v-else>
      <div :style="{ height: '100%', position: 'relative' }">
        <transition name="page-transition">
          <!--         <a-spin :spinning="true">-->
          <route-view class="view"></route-view>
          <!--         </a-spin>-->
        </transition>
      </div>
    </template>
  </div>

</template>

<script>
import moment from 'moment'
import { triggerWindowResizeEvent } from '@/utils/util'
import { mapState, mapActions } from 'vuex'
import { mixin, mixinDevice } from '@/utils/mixin'

import RouteView from './RouteView'
// import MultiTab from '@/components/MultiTab'
import SideMenu from '@/components/Menu/SideMenu'
import GlobalHeader from '@/components/GlobalHeader'
import GlobalFooter from '@/components/GlobalFooter'
import SettingDrawer from '@/components/SettingDrawer'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import Stomp from 'stompjs'
import webSocketConfig from '@/config/webSocketConfig'
const baesUrl = process.env.VUE_APP_URL
const poweredByQiankun = window.__POWERED_BY_QIANKUN__
export default {
  name: 'BasicLayout',
  mixins: [mixin, mixinDevice],
  components: {
    RouteView,
    // MultiTab,
    SideMenu,
    GlobalHeader,
    GlobalFooter,
    SettingDrawer
  },
  data() {
    return {
      collapsed: false,
      menus: [],
      show: true,
      // navTheme: 'light',
      websock: null,
      timeoutObj: null,
      timeout: 60000,
      webSorcketInited: false,
      client: null,
      poweredByQiankun
    }
  },
  computed: {
    navStyle() {
      return this._globalVar.defaultRouter.includes(this.selectKey)
    },
    ...mapState({
      // 动态主路由
      mainMenu: state => state.permission.addRouters
    }),
    contentPaddingLeft() {
      if (!this.fixSidebar || this.isMobile()) {
        return '0'
      }
      if (this.sidebarOpened) {
        return '256px'
      }
      return '100px'
    }
  },
  watch: {
    sidebarOpened(val) {
      this.collapsed = !val
    }
    // mainMenu: {
    //   deep: true,
    //   immediate: true,
    //   handler(n) {
    //     console.log(n)
    //   }
    // }
  },
  created() {
    this.menus = this.mainMenu.find(item => item.path === '/').children
    this.collapsed = !this.sidebarOpened
    // this.$route.meta.keepAlive = true
  },
  mounted() {
    const userAgent = navigator.userAgent
    if (userAgent.indexOf('Edge') > -1) {
      this.$nextTick(() => {
        this.collapsed = !this.collapsed
        setTimeout(() => {
          this.collapsed = !this.collapsed
        }, 16)
      })
    }
  },
  methods: {
    toggleFalse(data) {
      this.show = data
    },
    ...mapActions(['setSidebar']),
    toggle() {
      this.collapsed = !this.collapsed
      this.setSidebar(!this.collapsed)
      triggerWindowResizeEvent()
    },
    menuSelect(obj) {
      if (!this.isDesktop()) {
        this.collapsed = false
      }
    },
    drawerClose() {
      this.collapsed = false
    }
  }
}
</script>

<style lang="less">
@import url('../components/global.less');

/*
   * The following styles are auto-applied to elements with
   * transition="page-transition" when their visibility is toggled
   * by Vue.js.
   *
   * You can easily play with the page transition by editing
   * these styles.
   */

.page-transition-enter {
  opacity: 0;
}

.page-transition-leave-active {
  opacity: 0;
}

.page-transition-enter .page-transition-container,
.page-transition-leave-active .page-transition-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.view {
  width: 100%;
  /*height: 100%;*/
  overflow: hidden;
}
.messageList {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 99999;
  .messageTips {
    width: 229px;
    min-height: 106px;
    background-color: rgba(247, 247, 247);
    font-size: 14px;
    padding: 6px 5px;
    margin: 0 0 10px 0;
    .title {
      display: flex;
      justify-content: space-between;
      padding: 0 0 2px;
    }
    .content {
      .service {
        // display: flex;
        padding: 10px 0 5px 0;
        font-size: 12px;
        // > :nth-child(1) {
        //   font-weight: 700;
        //   color: rgb(16, 16, 16);
        // }
        // > :nth-child(2) {
        //   color: rgb(16, 16, 16);
        // }
        // > :nth-child(3) {
        //   > span {
        //     color: rgb(25, 169, 123);
        //   }
        // }
      }
      .newResource {
        font-size: 12px;
        color: rgb(16, 16, 16);
      }
      .time {
        font-size: 12px;
        color: rgba(8, 7, 7, 0.38);
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
