import { approveAxios ,axios} from '@/utils/request'
import apis from './apis'
import QS from 'qs'
// 班型
export function treeEduClassType(params) {
  return axios({
    url: '/education/common/treeEduClassType',
    method: 'get',
    params: params
  })
}
/* 大班型 */
export function listEduType(params) {
  return axios({
    url: '/common/refund/listEduType',
    method: 'get',
    params: params
  })
}
//小班型
export function listEduClassType(params) {
  return axios({
    url: '/common/refund/listEduClassType',
    method: 'get',
    params: params
  })
}
//舞种
export function listEduDance(params) {
  return axios({
    url: '/common/refund/listEduDance',
    method: 'get',
    params: params
  })
}
/* 公共接口 */
export function allCompany() {
  return approveAxios({
    url: apis.allCompany,
    method: 'get',
    params: { pageNum: 0, pageSize: 0 }
  })
}

// 消息通知列表
export function workflowGroupList(params) {
  return approveAxios({
    url: apis.workflowGroupList,
    method: 'post',
    data: params
  })
}
export function workflowGroupPage(params) {
  return approveAxios({
    url: apis.workflowGroupPage,
    method: 'post',
    data: params
  })
}
// 创建审批流
export function addWorkflow(params) {
  return approveAxios({
    url: apis.addWorkflow,
    method: 'post',
    data: params
  })
}
// 修改审批流
export function modifyWorkflow(params) {
  return approveAxios({
    url: apis.modifyWorkflow,
    method: 'post',
    data: params
  })
}

// 审批流列表
export function workflowList(params) {
  return approveAxios({
    url: apis.workflowList,
    method: 'post',
    data: params
  })
}

export function listLogByProcinstId(params) {
  return approveAxios({
    url: apis.listLogByProcinstId,
    method: 'get',
    params
  })
}
export function deptTypeInfo(params) {
  return approveAxios({
    url: apis.deptTypeInfo,
    method: 'get',
    data: params
  })
}
export function workflowListPage(params) {
  return approveAxios({
    url: apis.workflowListPage,
    method: 'get',
    params
  })
}
// 审批流列表删除
export function workflowDel(params) {
  return approveAxios({
    url: apis.workflowDel,
    method: 'post',
    data: params
  })
}
// 审批流列表编辑
export function workflowModify(params) {
  return approveAxios({
    url: apis.workflowModify,
    method: 'post',
    data: params
  })
}
//提交审批
export function workflowStart(params) {
  return approveAxios({
    url: apis.workflowStart,
    method: 'post',
    data: params
  })
}
//提交审批
export function startDrafts(params) {
  return approveAxios({
    url: apis.startDrafts,
    method: 'post',
    data: params
  })
}

//获取审批表单详情
export function workFlowProcdefGet(params) {
  return approveAxios({
    url: apis.workFlowProcdefGet,
    method: 'get',
    params: params
  })
}
export function listProcdefMember(params) {
  return approveAxios({
    url: apis.listProcdefMember,
    method: 'get',
    params
  })
}
export function approveAllUsers(params) {
  return approveAxios({
    url: apis.approveAllUsers,
    method: 'get',
    params
  })
}
//获取审批表单审批步骤
export function workFlowProcdefFlowLine(params) {
  return approveAxios({
    url: apis.workFlowProcdefFlowLine,
    method: 'post',
    data: params
  })
}
//提交审批实例
export function workFlowProcdefStart(params) {
  return approveAxios({
    url: apis.workFlowProcdefStart,
    method: 'post',
    data: params
  })
}

//获取流程实例列表---待处理
export function waitApprovePage(params) {
  return approveAxios({
    url: apis.waitApprovePage,
    method: 'post',
    data: params
  })
}
//录入数据
export function saveReimbursement(params) {
  return approveAxios({
    url: apis.saveReimbursement,
    method: 'post',
    data: params
  })
}

//获取流程实例列表---已处理
export function alreadyApprovePage(params) {
  return approveAxios({
    url: apis.alreadyApprovePage,
    method: 'post',
    data: params
  })
}
export function listCashierUndo(params) {
  return approveAxios({
    url: apis.listCashierUndo,
    method: 'post',
    data: params
  })
}
export function FinishedPage(params) {
  return approveAxios({
    url: apis.FinishedPage,
    method: 'post',
    data: params
  })
}
export function finishInvoicePage(params) {
  return approveAxios({
    url: apis.finishInvoicePage,
    method: 'post',
    data: params
  })
}
//获取流程实例列表---审批记录不包括草稿箱
export function pageRecord(params) {
  return approveAxios({
    url: apis.pageRecord,
    method: 'post',
    data: params
  })
}
//获取流程实例列表---已发送
export function mySendPage(params) {
  return approveAxios({
    url: apis.mySendPage,
    method: 'post',
    data: params
  })
}
//获取流程实例列详情
export function listByProcinst(id) {
  return approveAxios({
    url: `${apis.listByProcinst}/${id}`,
    method: 'get'
  })
}
export function getLoginUserByProcinstId(id) {
  return approveAxios({
    url: `${apis.getLoginUserByProcinstId}/${id}`,
    method: 'get'
  })
}
export function workflowUndoGet(id) {
  return approveAxios({
    url: `${apis.workflowUndoGet}/${id}`,
    method: 'get'
  })
}
export function workflowUndoReaded(params) {
  return approveAxios({
    url: apis.workflowUndoReaded,
    method: 'post',
    data: params
  })
}
export function workflowTaskGet(id) {
  return approveAxios({
    url: `${apis.workflowTaskGet}/${id}`,
    method: 'get'
  })
}
export function workflowProcinstGet(id) {
  return approveAxios({
    url: `${apis.workflowProcinstGet}/${id}`,
    method: 'get'
  })
}

//流程实例详情操作
export function workflowUndoAgree(params) {
  return approveAxios({
    url: apis.workflowUndoAgree,
    method: 'post',
    data: params
  })
}
export function workflowUndoRefuse(params) {
  return approveAxios({
    url: apis.workflowUndoRefuse,
    method: 'post',
    data: params
  })
}
//查询下一个流程审批人列表
export function listNextProcOrgUser(params) {
  return approveAxios({
    url: apis.listNextProcOrgUser,
    method: 'get',
    params
  })
}
//同意修改下一个流程的审批人
export function updateNextProcOrgUser(params) {
  return approveAxios({
    url: apis.updateNextProcOrgUser,
    method: 'post',
    data: params
  })
}
//批量同意
export function listAgree(params) {
  return approveAxios({
    url: apis.listAgree,
    method: 'post',
    data: params
  })
}
//合并付款
export function megerAgree(params) {
  return approveAxios({
    url: apis.megerAgree,
    method: 'post',
    data: params
  })
}

//批量拒绝
export function listRefuse(params) {
  return approveAxios({
    url: apis.listRefuse,
    method: 'post',
    data: params
  })
}
export function workflowProcinstRecall(params) {
  return approveAxios({
    url: apis.workflowProcinstRecall,
    method: 'post',
    data: params
  })
}
//重新启动
export function workflowReStart(params) {
  return approveAxios({
    url: apis.workflowReStart,
    method: 'post',
    data: params
  })
}
//转交审批
export function workflowUndoAssignor(params) {
  return approveAxios({
    url: apis.workflowUndoAssignor,
    method: 'post',
    data: params
  })
}
//保存草稿
export function workflowSave(params) {
  return approveAxios({
    url: apis.workflowSave,
    method: 'post',
    data: params
  })
}
//查询全部审批类型
export function workflowListAll(params) {
  return approveAxios({
    url: apis.workflowListAll,
    method: 'post',
    data: params
  })
}
//查询全部审批类型
export function workflowProcinstPage(params) {
  return approveAxios({
    url: apis.workflowProcinstPage,
    method: 'post',
    data: params
  })
}
//草稿箱删除
export function workflowProcinstDel(params) {
  return approveAxios({
    url: apis.workflowProcinstDel,
    method: 'post',
    data: params
  })
}

//查询银行列表
export function workFlowBankList(params) {
  return approveAxios({
    url: apis.workFlowBankList,
    method: 'post',
    data: params
  })
}
//查询银行列表
export function getCompany(params) {
  return approveAxios({
    url: `${apis.getCompany}/${params}`,
    method: 'post'
  })
}
// 课程列表
export function listEmployee(params) {
  return approveAxios({
    url: apis.listEmployee,
    method: 'get',
    params: params
  })
}

// 费用类型
export function pageFeeItem(params) {
  return approveAxios({
    url: apis.pageFeeItem,
    method: 'get',
    params: params
  })
}
//角色列表
export function roleFindAll(params) {
  return approveAxios({
    url: apis.roleFindAll,
    method: 'get',
    data: params
  })
}
//岗位列表
export function findAllPosition(params) {
  return approveAxios({
    url: apis.findAllPosition,
    method: 'get',
    data: params
  })
}
// 查询所有分馆 列表数据
export function schoolFindList(params) {
  return approveAxios({
    url: apis.schoolFindList,
    method: 'get',
    data: params
  })
}

/**获取支付方式 */

export function getSysDictList(params) {
  return approveAxios({
    url: apis.getSysDictList,
    method: 'post',
    data: params
  })
}
/**根据课程id查询所有订单分馆业绩数据 */
export function listBranchPerformanceByMemberCourseId(params) {
  return approveAxios({
    url: apis.listBranchPerformanceByMemberCourseId,
    method: 'post',
    data: params
  })
}
//查询学员信息
export function memberFindAll(params) {
  return approveAxios({
    url: apis.memberFindAll,
    method: 'post',
    data: params
  })
}
//查询学员信息
export function findMemberCourse(params) {
  return approveAxios({
    url: apis.findMemberCourse,
    method: 'post',
    data: params
  })
}
// 查询结转的列表接口
export function findAllModel(params) {
  return approveAxios({
    url: apis.findAllModel,
    method: 'post',
    data: params
  })
}
//查询资源详情
export function getResourceById(params) {
  return approveAxios({
    url: apis.getResourceById,
    method: 'post',
    data: params
  })
}
/**删除文件 */
export function fileDelete(params) {
  return approveAxios({
    url: apis.fileDelete,
    method: 'post',
    data: params
  })
}
// 查询所有分馆列表 树结构
export function schoolFindAll(params) {
  return approveAxios({
    url: apis.schoolFindAll,
    method: 'post',
    data: params
  })
}
/**批量获取查询条件 */
export function findAllDictDataByTypeIds(params) {
  return approveAxios({
    url: apis.findAllDictDataByTypeIds,
    method: 'post',
    data: params
  })
}
// 查询所有全部资源
export function findAllResource(params) {
  return approveAxios({
    url: apis.findAllResource,
    method: 'post',
    data: params
  })
}
// 查询员工
export function findEmployeeByPosition(params) {
  return approveAxios({
    url: apis.findEmployeeByPosition,
    method: 'post',
    data: params
  })
}
// 查询员工
export function listMode(params) {
  return approveAxios({
    url: apis.listMode,
    method: 'get',
    data: params
  })
}

export function billTypeList() {
  return approveAxios({
    url: apis.billTypeList,
    method: 'get'
  })
}

export function billTypeAdd(params) {
  return approveAxios({
    url: apis.billTypeAdd,
    method: 'post',
    data: params
  })
}

export function billTypeUpdate(params) {
  return approveAxios({
    url: apis.billTypeUpdate,
    method: 'post',
    data: params
  })
}

export function billTypeDelete(params) {
  return approveAxios({
    url: apis.billTypeDelete,
    method: 'post',
    data: params
  })
}

export function pageProcdef(params) {
  return approveAxios({
    url: apis.pageProcdef,
    method: 'get',
    data: params
  })
}

export function listCompany(params) {
  return approveAxios({
    url: apis.listCompany,
    method: 'get',
    params
  })
}

export function saveCompany(params) {
  return approveAxios({
    url: apis.saveCompany,
    method: 'post',
    data: params
  })
}

export function updateCompany(params) {
  return approveAxios({
    url: apis.updateCompany,
    method: 'post',
    data: params
  })
}

export function delCompany(params) {
  return approveAxios({
    url: apis.delCompany,
    method: 'post',
    data: params
  })
}

export function getCompanyInfo(id) {
  return approveAxios({
    url: `${apis.getCompanyInfo}/${id}`,
    method: 'post'
  })
}

export function beforeAdd(params) {
  return approveAxios({
    url: apis.beforeAdd,
    method: 'post',
    data: params
  })
}

export function afterAdd(params) {
  return approveAxios({
    url: apis.afterAdd,
    method: 'post',
    data: params
  })
}

export function addUndoNodeUser(params) {
  return approveAxios({
    url: apis.addUndoNodeUser,
    method: 'post',
    data: params
  })
}

export function updateState(id, state) {
  return approveAxios({
    url: `${apis.updateState}/${id}/${state}`,
    method: 'post'
  })
}

export function updateSpending(params) {
  return approveAxios({
    url: apis.updateSpending,
    method: 'post',
    data: params
  })
}
// 待审批导出
export function downWaitFile(params) {
  return approveAxios({
    url: apis.downWaitFile,
    method: 'post',
    responseType: 'blob',
    data: params
  })
}
// 已审批导出
export function downAlreadyFile(params) {
  return approveAxios({
    url: apis.downAlreadyFile,
    method: 'post',
    responseType: 'blob',
    data: params
  })
}
// 发起审批（付款记录）导出
export function downLoadFile(params) {
  return approveAxios({
    url: apis.downLoadFile,
    method: 'post',
    responseType: 'blob',
    data: params
  })
}

// 导出离职导师
export function downTeacher(params) {
  return approveAxios({
    url: apis.downTeacher,
    method: 'post',
    responseType: 'blob',
    data: params
  })
}
// 导出离职导师
export function downMyAll(params) {
  return approveAxios({
    url: apis.downMyAll,
    method: 'post',
    responseType: 'blob',
    data: params
  })
}
//查询当前用户能看见的审批定义域
export function listUserProcdef(params) {
  return approveAxios({
    url: apis.listUserProcdef,
    method: 'get',
    params
  })
}

// 查看版本
export function getProcinstLogList(params) {
  return approveAxios({
    url: apis.getProcinstLogList,
    method: 'post',
    data: params
  })
}

export function listFeeName(params) {
  return approveAxios({
    url: apis.listFeeName,
    method: 'get',
    params: params
  })
}

export function pageListBankByDept(params) {
  return approveAxios({
    url: apis.pageListBankByDept,
    method: 'get',
    params: params
  })
}
export function listBank(params) {
  return approveAxios({
    url: apis.listBank,
    method: 'get',
    params: params
  })
}
export function listBankByDeptId(params) {
  return approveAxios({
    url: apis.listBankByDeptId,
    method: 'get',
    params: params
  })
}

export function getSchoolList(params) {
  return approveAxios({
    url: apis.getSchoolList,
    method: 'get',
    params: params
  })
}
export function pageListBank(params) {
  return approveAxios({
    url: apis.pageListBank,
    method: 'get',
    params: params
  })
}
export function listFeeItem(params) {
  return approveAxios({
    url: apis.listFeeItem,
    method: 'get',
    params: params
  })
}
export function listOrgDept(params) {
  return approveAxios({
    url: apis.listOrgDept,
    method: 'get',
    params: params
  })
}
export function listFinDept(params) {
  return approveAxios({
    url: apis.listFinDept,
    method: 'get',
    params: params
  })
}
export function listWorkflowRoleUserDetail(params) {
  return approveAxios({
    url: apis.listWorkflowRoleUserDetail,
    method: 'get',
    params: params
  })
}
export function listUserDept(params) {
  return approveAxios({
    url: apis.listUserDept,
    method: 'get',
    params: params
  })
}
export function listWorkflowRoleDetail(params) {
  return approveAxios({
    url: apis.listWorkflowRoleDetail,
    method: 'get',
    params: params
  })
}
export function orgListWorkflowRoleDetail(params) {
  return approveAxios({
    url: apis.orgListWorkflowRoleDetail,
    method: 'get',
    params: params
  })
}
export function workflowListWorkflowRole(params) {
  return approveAxios({
    url: apis.workflowListWorkflowRole,
    method: 'get',
    params: params
  })
}

export function listApprovePeople(params) {
  return approveAxios({
    url: apis.listApprovePeople,
    method: 'get',
    params: params
  })
}

export function rejectAnyNode(params) {
  return approveAxios({
    url: apis.rejectAnyNode,
    method: 'post',
    data: params
  })
}

export function getUndoResult(params) {
  return approveAxios({
    url: apis.getUndoResult,
    method: 'get',
    params
  })
}

export function updateUrgent(params) {
  return approveAxios({
    url: apis.updateUrgent,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function finUserAllocation(params) {
  return approveAxios({
    url: apis.finUserAllocation,
    method: 'post',
    data: QS.stringify(params)
  })
}
