// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'
import { truncate } from 'lodash'

/**
 * 基础路由
 * @type { *[] }
 */
export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/home',

    children: [
      //homePage
      {
        path: '/home',
        name: 'home',
        component: RouteView,
        meta: { title: '首页', icon: 'home', hidden: true },
        redirect: '/homepage',
        hideChildrenInMenu: true,
        children: [
          {
            path: '/homepage',
            name: 'homepage',
            component: () => import('@/views/HomePage'),
            meta: { title: '首页', keepAlive: true, hidden: true }
          },
          {
            path: '/user/center',
            name: 'center',
            component: () => import('@/views/user/userCenter'),
            meta: { title: '个人中心', keepAlive: true, hidden: true }
          }
        ]
      },
      {
        path: '/oa',
        name: 'oa',
        component: RouteView,
        meta: { title: '审批', icon: 'book' },
        redirect: '/myApproval',
        children: [
          {
            path: '/workflow',
            name: 'workflow',
            component: RouteView,
            meta: { title: '审批', icon: 'caret-down' },
            children: [
              {
                path: '/vueApp1/approvalList',
                name: 'approvalList',
                component: () => import('@/views/oa/admin/approvalList.vue'),
                meta: { title: '流程配置', keepAlive: true, permission: ['fast:workflow:view', 'fast:mode:view'] }
              },
              {
                path: '/approvalNew/:id',
                name: 'approvalNew',
                component: () => import('@/views/oa/admin/approver.vue'),
                meta: {
                  hidden: true,
                  keepAlive: false,
                  title: '流程设计'
                }
              },
              {
                path: '/approvalFormList',
                name: 'approvalFormList',
                component: () => import('@/views/oa/admin/approvalFormList.vue'),
                meta: { title: '待办审批', keepAlive: true }
              },
              {
                path: '/myApproval',
                name: 'myApproval',
                component: () => import('@/views/oa/admin/myApproval.vue'),
                meta: { title: '发起审批', keepAlive: true }
              },
              {
                path: '/formNew/:procdefId',
                name: 'formNew',
                component: () => import('@/views/oa/form/index.vue'),
                meta: {
                  hidden: true,
                  keepAlive: false,
                  title: '审批表单'
                }
              },
              {
                path: '/formDraft/:procdefId',
                name: 'formDraft',
                component: () => import('@/views/oa/form/form.vue'),
                meta: {
                  hidden: true,
                  keepAlive: false,
                  title: '审批表单'
                }
              },
              {
                path: '/previewNew',
                name: 'previewNew',
                component: () => import('@/views/oa/custom/preview.vue'),
                meta: {
                  hidden: true,
                  keepAlive: true
                }
              },
              {
                path: '/jsxPreviewNew',
                name: 'jsxPreviewNew',
                component: () => import('@/views/oa/custom/jsxPreview.vue'),
                meta: {
                  hidden: true,
                  keepAlive: true,
                  title: '表单预览'
                }
              },
              {
                path: '/flowlineEdit/:id/:type', //id--流程实例id    type--1-复制表单，2-已完成修改表单，其他，3-过期重提
                name: 'flowlineEdit',
                component: () => import('@/views/oa/view/flowlineEdit.vue'),
                meta: {
                  hidden: true,
                  keepAlive: false,
                  title: '编辑'
                }
              },
              {
                path: '/viewNew/:id/:undoId/:schoolId/:isWait',
                name: 'viewNew',
                component: () => import('@/views/oa/view/index.vue'),
                meta: {
                  hidden: true,
                  keepAlive: false,
                  title: '详情'
                }
              }
            ]
          }
        ]
      },
      {
        path: '/invoice',
        name: 'invoice',
        component: RouteView,
        meta: { title: '发票', icon: 'book' },
        redirect: '/invoiceLibrary',
        children: [
          {
            path: '/invoiceManageMent',
            name: 'invoiceManageMent',
            component: RouteView,
            meta: { title: '发票管理', icon: 'caret-down' },
            children: [
              {
                path: '/invoiceLibrary',
                name: 'invoiceLibrary',
                component: () => import('@/views/invoice/invoiceLibrary/invoiceLibrary.vue'),
                meta: { title: '发票库', keepAlive: true }
              },
              {
                path: '/myInvoice/:createUser/:createUserName/:companyName',
                name: 'myInvoice',
                component: () => import('@/views/invoice/invoiceLibrary/myInvoice.vue'),
                meta: { title: '发票明细', keepAlive: true, hidden: true }
              },
              {
                path: '/uploadMyInvoice/:createUser/:createUserName/:companyName',
                name: 'uploadMyInvoice',
                component: () => import('@/views/invoice/invoiceLibrary/uploadMyInvoice.vue'),
                meta: { title: '上传明细', keepAlive: true, hidden: true }
              },
              {
                path: '/invoiceChecked',
                name: 'invoiceChecked',
                component: () => import('@/views/invoice/invoiceLibrary/invoiceChecked.vue'),
                meta: { title: '发票再次验真', keepAlive: true, hidden: true }
              },
              {
                path: '/invoiceReject',
                name: 'invoiceReject',
                component: () => import('@/views/invoice/invoiceLibrary/invoiceReject.vue'),
                meta: { title: '发票管理', keepAlive: true, hidden: true }
              },
              {
                path: '/dayTotalMoneyDetails/:createUserName/:totalMoney/:procinstIds',
                name: 'dayTotalMoneyDetails',
                component: () => import('@/views/invoice/invoiceLibrary/dayTotalMoneyDetails.vue'),
                meta: { title: '抵票报销总额', keepAlive: true, hidden: true }
              }
            ]
          }
        ]
      },
      //system
      {
        path: '/system',
        name: 'system',
        component: RouteView,
        meta: { title: '系统', icon: 'setting', permission: ['system', 'test'] },
        children: [
          {
            path: '/system/systemManage',
            name: 'systemManage',
            meta: { title: '系统管理', icon: 'caret-down', permission: ['system', 'test'] },
            component: { render: h => h('router-view') },
            children: []
          }
        ]
      }
    ]
  },
  {
    path: '/vueApp1/test',
    name: 'qiankunbase1',
    component: () => import('@/views/test/test.vue'),
    meta: { title: '测试', keepAlive: true}
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'forgetPsw',
        name: 'forgetPsw',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/ForgetPsw')
      }
    ]
  },

  {
    path: '/user',
    component: BasicLayout,
    redirect: '/user/center',
    children: [
      {
        path: '/user/info',
        name: 'userInfo',
        component: () => import('@/views/user/userInfo'),
        meta: { title: '用户信息', keepAlive: false }
      }
    ]
  },

  {
    path: '/class',
    component: BasicLayout,
    children: [
      {
        path: '/class/phoock',
        name: 'phoock',
        component: () => import('@/views/test/test.vue'),
        meta: { title: '测试专用', keepAlive: false }
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]

/**
 * 动态路由
 * @type { *[] }
 */

const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView
}

const notFoundRouter = {
  path: '*',
  redirect: '/404',
  hidden: true
}

const basicRouter = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    children: [
      //homepage
      {
        path: '/',
        name: 'homepage',
        component: RouteView,
        meta: { title: '首页', icon: 'dashboard' },
        redirect: '/',
        hideChildrenInMenu: true,
        children: [
          {
            path: '/',
            name: 'home',
            component: () => import('@/views/HomePage'),
            meta: { title: '首页', keepAlive: true, hidden: true }
          },
          {
            path: '/user/center',
            name: 'center',
            component: () => import('@/views/user/userCenter'),
            meta: { title: '个人中心', keepAlive: true, hidden: true }
          }
        ]
      }
    ]
  }
]
export const generatorDynamicRouter = () => {
  return new Promise((resolve, reject) => {
    // getMenu().then(res => {
    //   const result = res.data
    //   const routers = generator(result)
    //   // console.log('generator', routers)
    //   routers.push(notFoundRouter)
    //   routers.forEach(item => {
    //     basicRouter[0].children.push(item)
    //   })
    //   // console.log(basicRouter)
    //   resolve(basicRouter)
    // }).catch(err => {
    //   reject(err)
    // })
    //
    // const routers = rewriteRouter(menu)
    // console.log('generator', routers)
  })
}

// export const rewriteRouter = (routerMap, parent) => {
//   if (!routerMap || routerMap.length == 0) {
//     return []
//   }
//
//   return routerMap.map((item, idx) => {
//     let components, hideChildrenInMenu = false
//     const currentRouter = {
//       path: item.path,
//       name: idx,
//       meta: { title: item.name, keepAlive: true, icon: item.icon || 'setting', permission: [item.perm] }
//     }
//   })
//
//
// }

export const generator = (routerMap, parent) => {
  // console.log(routerMap)
  if (routerMap == null) {
    return []
  }
  return routerMap.map(item => {
    let components,
      hideChildrenInMenu = false
    const currentRouter = {
      path: item.path,
      name: item.id,
      meta: { title: item.menuName, keepAlive: true, icon: item.icon || 'setting', permission: [item.perm] }
    }
    if (item.menuType == 'A') {
      components = RouteView
    } else if (item.menuType == 'B' && item.children && item.children.length > 0) {
      components = RouteView
      hideChildrenInMenu = true
      currentRouter.path = `${item.path}Management`
      currentRouter.redirect = item.path
    } else if (item.menuType == 'D') {
      currentRouter.meta.hidden = true
      const idx = item.path.indexOf(':')
      let str = item.path
      idx > 0 ? (str = item.path.substring(0, idx - 1)) : ''
      // components = () => import(`@/views${str}`)
      components = resolve => require([`@/views${str}`], resolve)
    } else {
      // components = () => import(`@/views${item.path}`)
      components = resolve => require([`@/views${item.path}`], resolve)
    }
    currentRouter.component = components
    currentRouter.hideChildrenInMenu = hideChildrenInMenu
    if (item.children && item.children.length > 0) {
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}
