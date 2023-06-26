const apis = {
  /* 公共接口 */
  allCompany: '/erp-fastdp-service/common/listCompany', // 获取公司配置
  getCompany: '/erp-fastdp-service/common/getCompany', //获取公司详情

  //获取流程分组列表
  workflowGroupList: '/erp-fastdp-service/workflow/group/list',
  workflowGroupPage: '/erp-fastdp-service/workflow/group/page',
  addWorkflow: '/erp-fastdp-service/workflow/addProcdef', //创建审批流
  modifyWorkflow: '/erp-fastdp-service/workflow/modifyProcdef', //创建审批流
  workflowList: '/erp-fastdp-service/workflow/procdef/list', //审批流列表
  workflowListPage: '/erp-fastdp-service/workflow/pageProcdef', //审批流列表分页
  workflowDel: '/erp-fastdp-service/workflow/delProcdef', //审批流列表删除
  workflowModify: '/erp-fastdp-service/workflow/modifyProcdef', //审批流列表编辑
  //获取审批表单详情
  workFlowProcdefGet: '/erp-fastdp-service/workflow/procinst/getProcdefInfo',
  //获取审批表单审批步骤
  workFlowProcdefFlowLine: '/erp-fastdp-service/workflow/flowLine',
  //提交审批实例
  workFlowProcdefStart: '/erp-fastdp-service/workflow/procinst/start',
  //获取流程实例列表---待处理
  waitApprovePage: '/erp-fastdp-service/workflow/procinst/waitApprovePage',
  //获取流程实例列表---已处理
  alreadyApprovePage: '/erp-fastdp-service/workflow/procinst/alreadyApprovePage',
  //获取流程实例列表---已处理
  listCashierUndo: '/erp-fastdp-service/workflow/procinst/listCashierUndo',
  //获取流程实例列表---已完成
  FinishedPage: '/erp-fastdp-service/workflow/procinst/finishPage',
  //抵票报销总额列表
  finishInvoicePage: '/erp-fastdp-service/workflow/procinst/finishInvoicePage',
  //获取流程实例列表---审批记录不包括草稿箱
  pageRecord: '/erp-fastdp-service/workflow/procinst/record',
  //获取流程实例列表---已发送
  mySendPage: '/erp-fastdp-service/workflow/procinst/mySendPage',
  //获取流程实例列详情
  listByProcinst: '/erp-fastdp-service/workflow/task/listByProcinst',
  workflowProcinstGet: '/erp-fastdp-service/workflow/procinst/get',
  getLoginUserByProcinstId: '/erp-fastdp-service/workflow/undo/getLoginUserByProcinstId',
  workflowUndoGet: '/erp-fastdp-service/workflow/undo/get',
  workflowUndoReaded: '/erp-fastdp-service/workflow/undo/readed',
  workflowTaskGet: '/erp-fastdp-service/workflow/task/get',
  //流程实例详情操作
  workflowUndoAgree: '/erp-fastdp-service/workflow/undo/agree',
  workflowUndoRefuse: '/erp-fastdp-service/workflow/undo/refuse',
  workflowUndoAssignor: '/erp-fastdp-service/workflow/undo/assignor',
  workflowProcinstRecall: '/erp-fastdp-service/workflow/procinst/recall',
  //重新启动
  workflowReStart: '/erp-fastdp-service/workflow/procinst/reStart',
  //保存至草稿箱
  workflowSave: '/erp-fastdp-service/workflow/procinst/saveDrafts',
  //全部审批栏
  workflowListAll: '/erp-fastdp-service/workflow/procdef/listAll',
  //草稿箱、驳回
  workflowProcinstPage: '/erp-fastdp-service/workflow/procinst/page',
  //草稿箱删除
  workflowProcinstDel: '/erp-fastdp-service/workflow/procinst/del',
  //查询银行列表
  workFlowBankList: '/erp-fastdp-service/workflow/procinst/findAll',
  //根据不同的字段去获取不同的员工列表
  listEmployee: '/erp-organize-service/organize/user/pageDeptOrgUser',

  //角色列表
  roleFindAll: '/erp-fastdp-service/pm/listWorkflowRole',
  //岗位列表
  findAllPosition: '/erp-fastdp-service/pm/listWorkflowRole',
  //查询所有分馆 列表数据
  schoolFindList: '/common/list/branch/listBranch',
  //获取支付方式
  getSysDictList: '/setting/finance/payMode/findAllPayMode',
  //根据课程id查询所有订单分馆业绩数据
  listBranchPerformanceByMemberCourseId: '/performance/employ/listBranchPerformanceByMemberCourseId',
  //学员管理查询所有学员列表
  memberFindAll: '/common/member/findAllMember',
  //查询学员信息
  findMemberCourse: '/common/member/findMemberCourse',
  //查询结转的列表接口
  findAllModel: '/common/member/findAllModel',
  //查询资源详情
  getResourceById: '/resource/info/getResourceById',
  // 删除文件
  fileDelete: '/common/file/delete',
  //查询所有分馆 树结构
  schoolFindAll: '/common/branch/findAll',
  //查询标签/等级/方式等(多)
  findAllDictDataByTypeIds: '/common/list/findAllDictDataByTypeIds',
  //全部资源
  findAllResource: '/resource/info/findAllResource',
  findEmployeeByPosition: '/common/employee/findScopeEmployeeByPosition', //查询员工   根据数据范围查询对应的员工
  //获取流程定义的类型
  listMode: '/erp-fastdp-service/mode/listMode',

  /* 审批流-类型配置 */
  billTypeList: '/erp-fastdp-service/mode/listMode', //类型列表
  billTypeAdd: '/erp-fastdp-service/mode/addMode', //新增类型
  billTypeUpdate: '/erp-fastdp-service/mode/updateMode', //修改类型
  billTypeDelete: '/erp-fastdp-service/mode/delMode', //删除类型

  /* 审批流-分馆/公司配置 */
  listCompany: '/erp-fastdp-service/mode/listCompany', //列表
  saveCompany: '/erp-fastdp-service/mode/saveCompany', //新增
  updateCompany: '/erp-fastdp-service/mode/updateCompany', //修改
  delCompany: '/erp-fastdp-service/mode/delCompany', //删除
  getCompanyInfo: '/erp-fastdp-service/mode/getOne', //详情
  deptTypeInfo: '/erp-fastdp-service/workflow/deptTypeInfo', //发起人类型
  pageFeeItem: '/erp-fastdp-service/pm/pageFeeItem', //费用类型

  beforeAdd: '/erp-fastdp-service/workflow/procinst/beforeAdd', //前置加签
  afterAdd: '/erp-fastdp-service/workflow/procinst/afterAdd', //后置加签
  addUndoNodeUser: '/erp-fastdp-service/workflow/undo/addUndoNodeUser', //会签

  updateState: '/erp-fastdp-service/workflow/procinst/updateState', //修改状态
  downWaitFile: '/erp-fastdp-service/workflow/procinst/downWaitFile', //待审批导出
  downAlreadyFile: '/erp-fastdp-service/workflow/procinst/downAlreadyFile', //已审批导出
  downLoadFile: '/erp-fastdp-service/workflow/procinst/downLoadFile', //发起审批（付款记录）导出
  downTeacher: '/erp-fastdp-service/workflow/procinst/downAll', //导出离职导师
  downMyAll:'/erp-fastdp-service/workflow/procinst/downMyAll',//我的审批导出
  listUserProcdef: '/erp-fastdp-service/workflow/procinst/listUserProcdef', //查询当前用户能看见的审批定义域

  getProcinstLogList: '/erp-fastdp-service/workflow/procinst/getProcinstLogList', //查看版本
  startDrafts: '/erp-fastdp-service/workflow/procinst/startDrafts', //草稿箱发起
  listProcdefMember: '/erp-fastdp-service/workflow/listProcdefMember', //查询全部flowline
  approveAllUsers: '/erp-fastdp-service/workflow/undo/approveAllUsers', //查询全部flowline
  listAgree: '/erp-fastdp-service/workflow/undo/listAgree', //批量同意
  megerAgree: '/erp-fastdp-service/workflow/undo/megerAgree', //合并付款
  listRefuse: '/erp-fastdp-service/workflow/undo/listRefuse', //批量拒绝

  listFeeName: '/erp-fastdp-service/pm/listFeeName', //费用名称下拉
  pageListBankByDept: '/erp-fastdp-service/pm/pageListBankByDept', //银行列表
  listBank: '/erp-fastdp-service/pm/listBank', //银行列表下拉
  listBankByDeptId: '/erp-fastdp-service/pm/listBankByDeptId', //账户借还款银行列表下拉
  getSchoolList: '/erp-fastdp-service/pm/listOrgDept', //获得校区卡
  feenameList: '/erp-fastdp-service/pm/pageListBank', //费用名称列表
  listFeeItem: '/erp-fastdp-service/pm/listFeeItem', //经营费用列表下拉
  listOrgDept: '/erp-fastdp-service/pm/listSysOrgDept', //选择校区
  listFinDept: '/erp-fastdp-service/pm/listFinDept', //选择校区
  listWorkflowRoleUserDetail: '/erp-fastdp-service/pm/listWorkflowRoleUserDetail', //查询审批发起人角色分馆
  listUserDept: '/erp-fastdp-service/workflow/listUserDept', //查询审批发起人角色分馆
  listWorkflowRoleDetail: '/erp-fastdp-service/workflow/listWorkflowRoleDetail', //查询当前分馆&职位下的人员
  orgListWorkflowRoleDetail: '/erp-organize-service/organize/common/listWorkflowRoleDetail', //查询当前分馆&职位下的人员

  listNextProcOrgUser: '/erp-fastdp-service/workflow/undo/listNextProcOrgUser', //查询下一个流程审批人列表
  updateNextProcOrgUser: '/erp-fastdp-service/workflow/undo/updateNextProcOrgUser', //同意修改下一个流程的审批人
  saveReimbursement: '/erp-fastdp-service/workflow/undo/saveReimbursement', //录入数据
  workflowListWorkflowRole: '/erp-fastdp-service/workflow/listWorkflowRole',

  updateSpending: '/erp-fastdp-service/workflow/procinst/updateSpending', //修改状态
  listLogByProcinstId: '/erp-fastdp-service/workflow/procinst/listLogByProcinstId',

  listApprovePeople: '/erp-fastdp-service/workflow/undo/listApprovePeople', //获取驳回流程列表
  rejectAnyNode: '/erp-fastdp-service/workflow/undo/reject', //驳回至任意节点
  getUndoResult: '/erp-fastdp-service/workflow/undo/getUndoResult', //判断双开多开的状态

  updateUrgent: '/erp-fastdp-service/workflow/procinst/updateUrgent', //加急/取消加急
  finUserAllocation: '/erp-fastdp-service/pm/finUserAllocation' //财务人员分配分馆
}

export default apis
