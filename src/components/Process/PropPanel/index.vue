<template>
  <el-drawer size="600px" class="drawer" :visible.sync="visible" :show-close="false" style="text-align:left;" @close="cancel" v-if="properties">
    <!-- 标题 -->
    <header slot="title" class="header" v-if="value && value.type == 'start' && properties.title">{{ properties.title }}</header>
    <header slot="title" class="header" v-else>
      <span @click="titleInputVisible = true" v-show="!titleInputVisible" style="cursor:pointer;">
        {{ properties.title }}
        <i class="el-icon-edit"></i>
      </span>
      <el-input
        size="mini"
        v-model="properties.title"
        v-show="titleInputVisible"
        v-clickoutside="_ => (titleInputVisible = false)"
        style="z-index:9;max-width: 200px;"
      ></el-input>
      <el-select v-if="isConditionNode()" v-model="properties.priority" size="mini" class="priority-select">
        <el-option v-for="item in priorityLength" :key="item" :value="item - 1" :label="'优先级' + item"></el-option>
      </el-select>
    </header>

    <!-- 条件  -->
    <section class="condition-pane" v-if="value && isConditionNode()">
      <row-wrapper title="发起人" v-if="showingPCons.includes(-1)">
        <fc-org-selectnew ref="condition-org" v-model="initiator" :accept="'role'" />
      </row-wrapper>
      <row-wrapper title="发起人类型" v-if="showingPCons.includes(-3)">
        <el-select v-model="initiatorType" placeholder="请选择" multiple>
          <el-option v-for="item in initiatorTypeList" :key="item.key" :label="item.value" :value="item.key"> </el-option>
        </el-select>
      </row-wrapper>
      <row-wrapper title="发起分馆" v-if="showingPCons.includes(-2)">
        <el-select v-model="initiatorBranch" multiple placeholder="请选择">
          <el-option v-for="item in deptTree" :key="item.key" :label="item.name" :value="item.key"> </el-option>
        </el-select>
      </row-wrapper>
      <template v-for="(item, index) in pconditions">
        <!-- 计数 -->
        <row-wrapper
          :key="index"
          :title="item.label"
          v-if="couldShowIt(item, 'el-input-number', 'fc-date-duration', 'fc-time-duration', 'fc-amount', 'fc-calculate', 'fc-total-money')"
        >
          <num-input :key="index" :title="timeTangeLabel(item)" v-model="item.conditionValue" style="padding-right: 6px;"></num-input>
          <template v-slot:action>
            <i class="el-icon-delete" style="cursor: pointer;" @click="onDelCondition(item)"></i>
          </template>
        </row-wrapper>
        <!-- 单选组 -->
        <row-wrapper :key="index" :title="item.label" v-if="couldShowIt(item, 'el-radio-group')">
          <el-radio-group v-model="item.conditionValue" class="radio-group">
            <el-radio v-for="item in item.options" :label="item.label" :key="item.label">{{ item.label }}</el-radio>
          </el-radio-group>
          <template v-slot:action>
            <i class="el-icon-delete" style="cursor: pointer;" @click="onDelCondition(item)"></i>
          </template>
        </row-wrapper>

        <!-- 下拉 -->
        <row-wrapper :key="index" :title="item.label" v-if="couldShowIt(item, 'el-select')">
          <el-select v-model="item.conditionValue" multiple placeholder="请选择" size="small">
            <el-option v-for="item in item.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <template v-slot:action>
            <i class="el-icon-delete" style="cursor: pointer;" @click="onDelCondition(item)"></i>
          </template>
        </row-wrapper>
        <!-- 组织机构 -->
        <row-wrapper :key="index" :title="item.label" v-if="couldShowIt(item, 'fc-org-selectnew')">
          <fc-org-selectnew v-model="item.conditionValue" :ref="'org' + index" :accept="'employee,position,role'" />
          <template v-slot:action>
            <i class="el-icon-delete" style="cursor: pointer;" @click="onDelCondition(item)"></i>
          </template>
        </row-wrapper>
        <!-- 费用名称 -->
        <row-wrapper :key="index" :title="item.label" v-if="couldShowIt(item, 'fc-select-feeName')">
          <div style="display:flex; align-items: flex-start">
            <el-select class="mr10" v-model="item.conditionValue" multiple placeholder="请选择" size="small" filterable collapse-tags clearable>
              <el-option v-for="option in feeNameList" :key="option.id" :label="option.feeName" :value="option.id"></el-option>
            </el-select>
            <el-button type="primary" size="small" @click="allFeeName(item)">全选</el-button>
          </div>

          <template v-slot:action>
            <i class="el-icon-delete" style="cursor: pointer;" @click="onDelCondition(item)"></i>
          </template>
        </row-wrapper>
      </template>
      <div style="padding-left:10px;margin-top:2em;">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="dialogVisible = true">添加条件</el-button>
        <span style="color:#aaa;margin-left:16px;">还有{{ notUseConNum }}个可用条件</span>
      </div>
    </section>

    <!-- 审批人 -->
    <section class="approver-pane" style="height:100%;" v-if="value && (isApproverNode() || isStartNode())">
      <el-tabs v-model="activeName" class="pane-tab">
        <el-tab-pane :label="'设置' + (value.type === 'approver' ? '审批人' : '发起人')" name="config">
          <!-- 开始节点 -->
          <el-row style="padding: 10px;" v-if="value.type === 'start'">
            <el-col :span="4" style="font-size: 12px;">发起人</el-col>
            <el-col :span="18" style="padding-left: 12px;">
              <fc-org-selectnew ref="start-org" v-model="initiator" :accept="'role'" />
            </el-col>
          </el-row>
          <div v-else-if="value.type === 'approver'">
            <div style="padding: 12px;">
              <el-radio-group v-model="approverForm.assigneeType" style="line-height: 32px;" @change="resetOrgColl">
                <el-radio v-for="item in assigneeTypeOptions" :label="item.value" :key="item.value" class="radio-item">{{ item.label }}</el-radio>
              </el-radio-group>
            </div>
            <div style="border-bottom: 1px solid #e5e5e5;padding-bottom: 1rem;">
              <div v-if="approverForm.assigneeType === 'myself'" class="option-box" style="color: #a5a5a5;">发起人自己将作为审批人处理审批单</div>
              <div v-else-if="approverForm.assigneeType === 'optional'" class="option-box">
                <p>可选多人</p>
                <el-switch v-model="approverForm.optionalMultiUser" active-color="#13ce66"> </el-switch>
                <p>选择范围</p>
                <el-select v-model="approverForm.optionalRange" size="mini">
                  <el-option v-for="(item, index) in rangeOptions" :key="index" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
              </div>
              <div v-else-if="approverForm.assigneeType === 'director'">
                <div style="font-size: 14px;padding-left: 1rem;">
                  发起人的
                  <el-select v-model="directorLevel" size="small">
                    <el-option v-for="item in 5" :key="item" :label="item === 1 ? '直接主管' : `第${item}级主管`" :value="item"></el-option>
                  </el-select>
                  <br />
                  <el-checkbox v-model="useDirectorProxy" style="margin-top: 1rem;">找不到主管时，由上级主管代审批</el-checkbox>
                </div>
              </div>
              <div v-else-if="approverForm.assigneeType === 'branch'">
                <div style="font-size: 14px;padding: 18px; display:flex;">
                  <div style="flex:1;">
                    分馆
                    <el-select v-model="branch.branchIdList" size="small" multiple>
                      <el-option v-for="item in branchOptions" :key="item.key" :label="item.label" :value="item.key"></el-option>
                    </el-select>
                  </div>
                  <div style="flex:1;">
                    <fc-org-selectnew ref="approver-org" buttonType="button" v-model="branch.positionIdList" title="职位" accept="position" />
                  </div>
                </div>
              </div>
              <div v-else class="option-box">
                <fc-org-selectnew
                  @change="onOrgChange"
                  ref="approver-org"
                  buttonType="button"
                  v-model="orgCollection"
                  :title="getAssignTypeLabel()"
                  :accept="approverForm.assigneeType"
                />
              </div>
            </div>
            <!-- v-if="
                (orgCollection[approverForm.assigneeType] && orgCollection[approverForm.assigneeType].length > 1) ||
                  ['optional'].includes(approverForm.assigneeType)
              " -->
            <div class="option-box" style="border-bottom: 1px solid #e5e5e5;">
              <p>多人审批时采用的审批方式</p>
              <!-- <el-checkbox v-model="approverForm.procdefType.isChooseApproveUser" class="radio-item">由审批人选择</el-checkbox> -->
              <br />
              <template>
                <el-radio-group v-model="approverForm.procdefType.isChooseApproveUser" @change="onIsChooseApproveUserChange">
                  <el-radio label="C" class="radio-item">不选择</el-radio>
                  <br />
                  <el-radio label="B" class="radio-item">由指定角色选择</el-radio>
                  <br />
                  <el-radio label="A" class="radio-item">由上一步审批人选择</el-radio>
                </el-radio-group>
              </template>
              <template v-if="approverForm.procdefType.isChooseApproveUser == 'B'">
                <div>
                  <fc-org-selectnew
                    v-model="approverForm.procdefType.isChooseApproveUserInfo"
                    buttonType="button"
                    title="指定角色"
                    @change="onArrpovorChange"
                    ref="isChooseApproveUserInfo"
                    :accept="'role'"
                  />
                </div>
              </template>
            </div>
            <div class="option-box" style="border-bottom: 1px solid #e5e5e5;">
              <p>允许加签情况</p>
              <el-select class="mb10" v-model="approverForm.procdefType.signState" clearable multiple placeholder="请选择">
                <el-option label="前置加签" value="beforeSign"></el-option>
                <el-option label="后置加签" value="afterSign"></el-option>
                <el-option label="会签" value="andSign"></el-option>
              </el-select>
            </div>
            <div class="option-box" style="border-bottom: 1px solid #e5e5e5;">
              <p>多人审批时采用的审批方式</p>
              <template>
                <el-radio v-model="approverForm.procdefType.sign" :label="true" class="radio-item">会签（需所有人均同意/拒绝方可审批完成）</el-radio>
                <br />
                <el-radio v-model="approverForm.procdefType.sign" :label="false" class="radio-item">或签（任意一人同意/拒绝即为完成）</el-radio>
              </template>
            </div>
            <div class="option-box" style="border-bottom: 1px solid #e5e5e5;">
              <p>匹配表单字段</p>
              <el-select class="mb10" v-model="approverForm.procdefType.scope" clearable placeholder="请选择">
                <el-option v-for="item in fotmItemOptions" :key="item.vModel" :label="item.label" :value="item.vModel"> </el-option>
              </el-select>
            </div>
            <div
              class="option-box"
              style="border-bottom: 1px solid #e5e5e5;"
              v-if="approverForm.assigneeType !== 'employee' && approverForm.assigneeType !== 'optional'"
            >
              <p>审批人为空时</p>
              <!--<el-radio v-model="approverForm.procdefType.approverEmpty" label="skip" class="radio-item">自动跳过</el-radio>-->
              <!--<br />-->
              <!--<el-radio v-model="approverForm.procdefType.approverEmpty" label="admin" class="radio-item">交由管理员审核</el-radio>-->
              <el-radio v-model="approverForm.procdefType.approverEmpty" label="skip" class="radio-item">允许提交</el-radio>
              <br />
              <el-radio v-model="approverForm.procdefType.approverEmpty" label="admin" class="radio-item">不允许提交</el-radio>
            </div>
            <div class="option-box" style="border-bottom: 1px solid #e5e5e5;">
              <p>驳回后再次提交审核节点</p>
              <el-radio-group v-model="approverForm.procdefType.commitNodeType">
                <el-radio label="toFirstNode" class="radio-item">提交至初始节点</el-radio>
                <br />
                <el-radio label="toRejectNode" class="radio-item">提交至驳回节点</el-radio>
                <br />
                <el-radio label="toChooseNode" class="radio-item">由审核人选择</el-radio>
              </el-radio-group>
            </div>
            <div class="option-box" style="border-bottom: 1px solid #e5e5e5;">
              <p>驳回时限制修改表单字段</p>
              <el-radio-group v-model="approverForm.procdefType.updateLimitType" @change="commitNodeTypeChange">
                <el-radio label="default" class="radio-item">无限制</el-radio>
                <br />
                <el-radio label="rejectNodeLimit" class="radio-item">提交至驳回节点时允许修改</el-radio>
                <br />
                <el-select class="ml30" v-model="approverForm.procdefType.formItem" multiple placeholder="请选择">
                  <el-option v-for="item in fotmItemOptions" :key="item.formId" :label="item.label" :value="item.formId"> </el-option>
                </el-select>
                <br />
                <el-radio label="chooseLimit" class="radio-item">由审核人选择是否限制</el-radio>
              </el-radio-group>
            </div>
            <div class="option-box" style="border-bottom: 1px solid #e5e5e5;">
              <p>审批中是否允许撤销</p>
              <el-radio v-model="approverForm.procdefType.recall" :label="true" class="radio-item">允许</el-radio>
              <br />
              <el-radio v-model="approverForm.procdefType.recall" :label="false" class="radio-item">不允许</el-radio>
            </div>
            <div class="option-box" style="border-bottom: 1px solid #e5e5e5;">
              <p>是否为出纳</p>
              <el-radio v-model="approverForm.procdefType.mergePay" label="A" class="radio-item">是</el-radio>
              <br />
              <el-radio v-model="approverForm.procdefType.mergePay" label="B" class="radio-item">否</el-radio>
            </div>
            <div class="option-box" style="border-bottom: 1px solid #e5e5e5;">
              <p>审批中是否允许查看/编辑费用归类</p>
              <el-radio v-model="approverForm.procdefType.editFeeType" :label="true" class="radio-item">允许</el-radio>
              <br />
              <el-radio v-model="approverForm.procdefType.editFeeType" :label="false" class="radio-item">不允许</el-radio>
            </div>
            <div class="option-box" style="border-bottom: 1px solid #e5e5e5;">
              <p>审批中是否允许查看/编辑打款账户</p>
              <el-radio v-model="approverForm.procdefType.editPaidAccount" :label="true" class="radio-item">允许</el-radio>
              <br />
              <el-radio v-model="approverForm.procdefType.editPaidAccount" :label="false" class="radio-item">不允许</el-radio>
            </div>
            <div class="option-box" style="border-bottom: 1px solid #e5e5e5;">
              <p>审批中是否允许查看/编辑打款账户</p>
              <el-radio v-model="approverForm.procdefType.splitMonthSelect" label="A" class="radio-item">当月及当月以后</el-radio>
              <br />
              <el-radio v-model="approverForm.procdefType.splitMonthSelect" label="B" class="radio-item">上月+当月及当月以后</el-radio>
              <br />
              <el-radio v-model="approverForm.procdefType.splitMonthSelect" label="C" class="radio-item">全部月份</el-radio>
            </div>

            <div class="option-box" style="border-bottom: 1px solid #e5e5e5;">
              <p>重复审批是否允许自动通过</p>
              <el-radio v-model="approverForm.procdefType.duplicateAutoApproved" :label="true" class="radio-item">允许</el-radio>
              <br />
              <el-radio v-model="approverForm.procdefType.duplicateAutoApproved" :label="false" class="radio-item">不允许</el-radio>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="表单权限" name="formAuth">
          <div class="form-auth-table">
            <header class="auth-table-header">
              <div class="row">
                <div class="label">表单字段</div>
                <el-radio-group v-model="globalFormOperate" class="radio-group" @change="changeAllFormOperate">
                  <el-radio :label="2" style="margin-left: 1rem;">可编辑</el-radio>
                  <el-radio :label="1">只读</el-radio>
                  <el-radio :label="0">隐藏</el-radio>
                </el-radio-group>
              </div>
            </header>
            <div class="auth-table-body" style="">
              <div v-for="item in getFormOperates()" :key="item.formId" class="row">
                <div class="label">
                  <span class="required" v-show="item.required">*</span>
                  {{ item.label }}
                </div>
                <el-radio-group v-model="item.formOperate" class="radio-group">
                  <el-radio :label="2" style="margin-left: 1rem;"><span style="opacity: 0;">可编辑</span></el-radio>
                  <el-radio :label="1"><span style="opacity: 0;">只读</span></el-radio>
                  <el-radio :label="0"><span style="opacity: 0;">隐藏</span></el-radio>
                </el-radio-group>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </section>

    <section v-if="value && isCopyNode()" style="padding-left: 1rem;">
      <p>抄送人</p>
      <fc-org-selectnew ref="copy-org" v-model="properties.menbers" buttonType="button" title="抄送人" :accept="'employee,position,role'" />
      <br />
      <el-checkbox v-model="properties.employeeOptional">允许发起人自选抄送人</el-checkbox>
    </section>

    <el-dialog title="选择条件" :visible.sync="dialogVisible" width="500px" :append-to-body="true" custom-class="condition-dialog">
      <el-checkbox-group v-model="showingPCons">
        <!-- 发起人默认就有 -->
        <el-checkbox :label="-1">发起人</el-checkbox>
        <el-checkbox :label="-3">发起人类型</el-checkbox>
        <!-- <el-checkbox :label="-2">发起分馆</el-checkbox> -->
        <el-checkbox v-for="(item, index) in pconditions" :key="index" :label="item.formId">
          {{ item.label }}
        </el-checkbox>
      </el-checkbox-group>
    </el-dialog>

    <div class="actions">
      <el-button size="small" @click="cancel">取消</el-button>
      <el-button size="small" type="primary" @click="confirm">确定</el-button>
    </div>
  </el-drawer>
</template>
<script>
import Clickoutside from 'element-ui/src/utils/clickoutside'
import { NodeUtils } from '../FlowCard/util.js'
import RowWrapper from './RowWrapper'
import NumInput from './NumInput'
import { schoolFindList, deptTypeInfo, listFeeName } from '@/api/workFlow/request.js'
const rangeType = {
  lt: '<',
  lte: '≤',
  gt: '>',
  gte: '≥',
  eq: '='
}
const defaultApproverForm = {
  menbers: [], // 审批人集合
  branch: [], // 分馆集合
  assigneeType: 'employee', // 指定审批人类型
  formOperates: [], // 表单操作权限集合
  counterSign: null, //是否为会签
  // 审批类型为自选 出现 optionalMultiUser optionalRange
  optionalMultiUser: false,
  optionalRange: 'ALL', // USER<最多十个> / ALL / ROLE
  procdefType: {
    scope: '', //匹配的表单字段
    sign: true, //是否为会签
    beforeSign: false, //是否前置加签
    afterSign: false, //是否后置加签
    andSign: true, //是否会签
    signState: [],
    abc: [],
    isChooseApproveUser: 'C', // 由审批人选择
    approverEmpty: 'skip', //审批人为空
    commitNodeType: 'toFirstNode', //驳回后再次提交审核节点
    updateLimitType: 'default', //驳回时限制修改表单字段
    formItem: [],
    recall: true, //审批中是否允许撤销
    mergePay: 'B',
    editFeeType: false, //审批中是否允许查看/编辑费用归类
    editPaidAccount: false, //审批中是否允许查看/编辑打款账户
    duplicateAutoApproved: false, //重复审批是否允许自动通过
    splitMonthSelect: 'A' //分摊可选月份
  }
}
let defaultBranch = {
  branchIdList: [],
  positionIdList: {
    type: 'position',
    data: []
  }
}
export default {
  props: [/*当前节点数据*/ 'value', /*整个节点数据*/ 'processData'],
  data() {
    return {
      initiatorType: [], //发起人类型
      initiatorTypeList: [], //发起人类型列表
      fotmItemOptions: [],
      branchOptions: [],
      branch: defaultBranch,
      fcOrgTabList: ['dep', 'role', 'employee', 'position'],
      visible: false, // 控制面板显隐
      globalFormOperate: null, // 统一设置节点表单权限
      titleInputVisible: false, // 是否显示标题输入框  startNode 不显示
      activeName: 'config', // or formAuth  Tab面板key
      showingPCons: [], // 用户选择了得条件  被选中的才会被展示在面板上编辑
      pconditions: [], // 从vuex中获取的可以作为流程图条件的集合
      dialogVisible: false, // 控制流程条件选项Dialog显隐
      // 当前节点数据
      properties: {},
      // 发起人  start节点和condition节点需要
      initiator: {
        data: [],
        type: 'employee'
      },
      initiatorBranch: [],
      deptTree: [], //所有分馆列表
      priorityLength: 0, // 当为条件节点时  显示节点优先级选项的数据
      orgCollection: { type: JSON.parse(JSON.stringify(defaultApproverForm)).assigneeType, data: [] },
      useDirectorProxy: true, // 找不到主管时 上级主管代理审批
      directorLevel: 1, // 审批主管级别
      startForm: {
        formOperates: []
      },
      approverForm: JSON.parse(JSON.stringify(defaultApproverForm)),

      optionalOptions: [
        {
          label: '自选一个人',
          value: false
        },
        {
          label: '自选多个人',
          value: true
        }
      ],
      rangeOptions: [
        {
          label: '全公司',
          value: 'ALL'
        },
        {
          label: '指定成员',
          value: 'USER'
        },
        {
          label: '角色',
          value: 'ROLE'
        }
      ],

      assigneeTypeOptions: [
        {
          label: '指定员工',
          value: 'employee'
        },
        // {
        //   label: '指定职位',
        //   value: 'position'
        // },
        // {
        //   label: '上级领导',
        //   value: 'director'
        // },
        {
          label: '指定角色',
          value: 'role'
        },
        // {
        //   label: '发起人自己',
        //   value: 'myself'
        // },
        {
          label: '发起人自选',
          value: 'optional'
        }
        // {
        //   label: '提交单中涉及部门或分馆',
        //   value: 'branch'
        // }
      ],

      feeNameList: []
    }
  },
  computed: {
    // 未使用的条件个数
    notUseConNum() {
      // 发起人是默认就有得  所以需要加 1
      return this.pconditions.length - this.showingPCons.length + 2
    },
    usedFormItems() {
      return this.$store.state.formItemList
    }
  },
  directives: {
    Clickoutside
  },
  methods: {
    onIsChooseApproveUserChange(data) {
      this.approverForm.procdefType.chooseRoleId = ''
      this.approverForm.procdefType.chooseRoleName = ''
    },
    onArrpovorChange(data) {
      let info = this.approverForm.procdefType.isChooseApproveUserInfo
      if (info && Array.isArray(info.data) && info.data.length > 0) {
        this.approverForm.procdefType.chooseRoleId = info.data[0].id
        this.approverForm.procdefType.chooseRoleName = info.data[0].name
      } else {
        this.approverForm.procdefType.chooseRoleId = ''
        this.approverForm.procdefType.chooseRoleName = ''
      }
    },
    commitNodeTypeChange(e) {
      if (e != 'rejectNodeLimit') {
        this.approverForm.procdefType.formItem = []
      }
    },
    getFormOperates() {
      let res = []
      this.isApproverNode() && (res = this.approverForm.formOperates)
      this.isStartNode() && (res = this.startForm.formOperates)
      return res
    },
    resetOrgColl() {
      this.orgCollection = {
        type: this.approverForm.assigneeType,
        data: []
      }
    },

    onOrgChange(data) {},
    timeTangeLabel(item) {
      const index = ['fc-time-duration', 'fc-date-duration'].findIndex(t => t === item.tag)
      if (index > -1) {
        return '时长' + ['(小时)', '(天)'][index]
      } else {
        return item.label
      }
    },
    getAssignTypeLabel() {
      const res = this.assigneeTypeOptions.find(t => t.value === this.approverForm.assigneeType)
      return res ? res.label : ''
    },
    changeAllFormOperate(val) {
      const target = this.isStartNode() ? this.startForm : this.approverForm
      target.formOperates.forEach(t => (t.formOperate = val))
    },
    // 是否可以显示当前条件组件
    couldShowIt(item, ...tag) {
      return tag.includes(item.tag) && this.showingPCons.includes(item.formId)
    },

    initFormOperates(target) {
      const formOperates = (target.properties && target.properties.formOperates) || []
      // 自定义组件不加入权限控制
      const res = []
      const defaultType = this.isApproverNode() ? 1 : 2 // 操作权限 0 隐藏 1 只读 2 可编辑
      const getPermissionById = id => {
        const permission = formOperates.find(t => t.formId === id)
        return permission !== undefined ? permission.formOperate : defaultType
      }
      const format = (list, parentName = '') =>
        list.map(t => {
          const data = {
            formId: t.formId,
            required: t.required,
            label: parentName ? [parentName, t.label].join('.') : t.label,
            formOperate: getPermissionById(t.formId),
            type: t.tag,
            vModel: t.vModel
          }
          res.push(data)
          Array.isArray(t.children) && format(t.children, t.label)
        })
      const formItems = this.$store.state.formItemList
      // .filter(t => t.cmpType !== 'custom')
      format(formItems)
      return res
    },
    initBranchOptions(target) {
      const res = []
      const format = (list, parentName = '') =>
        list.map(t => {
          const data = {
            label: parentName ? [parentName, t.label].join('.') : t.label,
            key: t.vModel
          }
          if (t.tag == target) {
            res.push(data)
          }
          Array.isArray(t.children) && format(t.children, t.label)
        })
      const formItems = this.$store.state.formItemList
      format(formItems)
      return res
    },
    initCopyNode() {
      this.properties = this.value.properties
    },

    initStartNodeData() {
      this.initInitiator()
      this.startForm.formOperates = this.initFormOperates(this.value)
    },

    copyNodeConfirm() {
      this.$emit('confirm', this.properties, this.getOrgSelectLabel('copy') || '发起人自选')
      this.visible = false
    },

    /**
     * 条件节点确认保存得回调
     */
    conditionNodeComfirm() {
      let nodeContent = ''
      const conditions = []
      this.showingPCons
        .map(fid => this.pconditions.find(t => t.formId === fid))
        .forEach(t => {
          if (!t) return // 发起人条件时 t 为空 发起人在其他地方获取
          const cValue = t.conditionValue
          if (cValue === undefined || cValue === null) {
            return
          }
          const numberTypeCmp = ['el-input-number', 'fc-date-duration', 'fc-time-duration', 'fc-amount', 'fc-calculate', 'fc-total-money']
          if (numberTypeCmp.includes(t.tag)) {
            if (cValue.type === 'bet') {
              const numVal = cValue.value
              nodeContent += `[${numVal[0]} ${rangeType[numVal[1]]} ${t.label} ${rangeType[numVal[2]]} ${numVal[3]}] ` + '\n'
            } else {
              nodeContent += `[${t.label} ${rangeType[cValue.type]} ${cValue.value}] ` + '\n'
            }
          } else if (t.tag === 'fc-org-selectnew') {
            const index = this.pconditions.findIndex(p => p.formId === t.formId)
            const labels = this.$refs['org' + index][0].selectedLabels
            nodeContent += `[${t.label} = ${labels}] ` + '\n'
          } else {
            nodeContent += `[${t.label} = ${cValue}] ` + '\n'
          }
          const res = { formId: t.formId, conditionValue: cValue }
          conditions.push(res)
        }, [])

      this.properties.conditions = conditions
      // 发起人虽然是条件 但是这里把发起人放到外部单独判断
      if (this.initiatorBranch && this.initiatorBranch.length > 0 && this.showingPCons.includes(-2)) {
        this.properties.initiatorBranch = this.initiatorBranch

        nodeContent = `[发起分馆: ${this.formateBranch()}]` + '\n' + nodeContent
      } else {
        this.properties.initiatorBranch = null
      }
      if (this.initiatorType && this.initiatorType.length > 0 && this.showingPCons.includes(-3)) {
        this.properties.initiatorType = this.initiatorType
        this.initiatorType && (nodeContent = `[发起人类型:` + this.initiatorType + ']' + '\n' + nodeContent)
      } else {
        this.properties.initiatorType = null
      }
      if (this.initiator && this.showingPCons.includes(-1)) {
        this.properties.initiator = this.initiator
        this.initiator.data && (nodeContent = `[发起人: ${this.getOrgSelectLabel('condition')}]` + '\n' + nodeContent)
      } else {
        this.properties.initiator = null
      }
      this.$emit('confirm', this.properties, nodeContent || '请设置条件')
      this.visible = false
    },
    formateBranch() {
      let str = ''
      this.deptTree.forEach(item => {
        if (this.initiatorBranch.includes(item.key)) {
          if (str) {
            str += ','
          }
          str += item.name
        }
      })
      return str
    },
    getOrgSelectLabel(type) {
      return this.$refs[type + '-org']['selectedLabels']
    },

    /**
     * 开始节点确认保存
     */
    startNodeComfirm() {
      this.properties.initiator = this.initiator
      const formOperates = this.startForm.formOperates.map(t => ({ formId: t.formId, formOperate: t.formOperate, vModel: t.vModel }))
      Object.assign(this.properties, { formOperates })
      this.$emit('confirm', this.properties, this.getOrgSelectLabel('start') || '所有人')
      this.visible = false
    },
    getSelectedLabels(data, key, filter) {
      let res = ''
      if (data && data.length > 0) {
        data.forEach(item => {
          if (filter.includes(item.key)) {
            res += (res ? '、' : '') + item[key]
          }
        })
      }
      return res
    },
    /**
     * 审批节点确认保存
     */
    approverNodeComfirm() {
      const assigneeType = this.approverForm.assigneeType
      let content = ''
      if (['optional', 'myself'].includes(assigneeType)) {
        content = this.assigneeTypeOptions.find(t => t.value === assigneeType).label
      } else if ('director' === assigneeType) {
        content = this.directorLevel === 1 ? '直接主管' : `第${this.directorLevel}级主管`
      } else if ('branch' === assigneeType) {
        content = this.getSelectedLabels(this.branchOptions, 'label', this.branch.branchIdList) + '/' + this.branch.positionIdList.data.map(t => t.name)
        if (this.branch.branchIdList.length === 0 || this.branch.positionIdList.data.length === 0) {
          this.approverForm.branch = null
        } else {
          this.approverForm.branch = {
            branchIdList: this.branch.branchIdList,
            positionIdList: this.branch.positionIdList.data
          }
        }
      } else {
        content = this.getOrgSelectLabel('approver')
      }
      if (['optional', 'employee'].includes(assigneeType)) {
        this.approverForm.procdefType.approverEmpty = null
      }
      if ('branch' !== assigneeType) {
        this.approverForm.branch = null
      }
      const formOperates = this.approverForm.formOperates.map(t => ({ formId: t.formId, formOperate: t.formOperate, vModel: t.vModel }))
      this.approverForm.menbers = this.orgCollection.data
      Object.assign(this.properties, this.approverForm, { formOperates })
      this.$emit('confirm', this.properties, content || '请设置审批人')
      this.visible = false
    },
    // 确认修改
    confirm() {
      this.isCopyNode() && this.copyNodeConfirm()
      this.isStartNode() && this.startNodeComfirm()
      this.isApproverNode() && this.approverNodeComfirm()
      this.isConditionNode() && this.conditionNodeComfirm()
    },
    // 关闭抽屉
    cancel() {
      setTimeout(() => {
        this.$emit('cancel')
        this.visible = false
      }, 0)
    },
    /**
     * 删除流程条件
     */
    onDelCondition(condition) {
      const index = this.showingPCons.findIndex(id => id === condition.formId)
      if (index > -1) {
        this.showingPCons.splice(index, 1)
        this.pconditions.find(t => t.formId === condition.formId).conditionValue = undefined
      }
    },
    // 配合getPriorityLength 获取前一个节点条件数组长度 用于设置优先级
    getPrevData() {
      return NodeUtils.getPreviousNode(this.value.prevId, this.processData)
    },
    // 用于获取节点优先级范围
    getPriorityLength() {
      this.priorityLength = this.getPrevData().conditionNodes.length
    },
    // 判断是否是条件节点
    isConditionNode() {
      return this.value ? NodeUtils.isConditionNode(this.value) : false
    },
    /** 判断是否是审批节点*/
    isApproverNode() {
      return this.value ? NodeUtils.isApproverNode(this.value) : false
    },

    isStartNode() {
      return this.value ? NodeUtils.isStartNode(this.value) : false
    },

    isCopyNode() {
      return this.value ? NodeUtils.isCopyNode(this.value) : false
    },

    initInitiator() {
      const initiator = this.value.properties && this.value.properties.initiator
      this.initiator = initiator
        ? initiator
        : {
            data: [],
            type: 'employee'
          }
    },
    /**
     * 初始化审批节点所需数据
     */
    initApproverNodeData() {
      for (const key in this.approverForm) {
        if (this.value.properties.hasOwnProperty(key)) {
          this.approverForm[key] = this.value.properties[key]
        }
      }
      const menbers = this.approverForm.menbers
      const branch = this.approverForm.branch
      if (branch) {
        if (branch.branchIdList && branch.positionIdList) {
          this.branch = {
            branchIdList: branch.branchIdList,
            positionIdList: {
              type: 'position',
              data: branch.positionIdList
            }
          }
        }
      }
      this.branchOptions = this.initBranchOptions('fc-select-branch')

      this.branchOptions.unshift({
        key: 'submitBranch',
        label: '提交分馆'
      })
      this.resetOrgColl()
      if (Array.isArray(this.approverForm.menbers) && menbers.length > 0) {
        this.orgCollection = {
          type: this.approverForm.assigneeType,
          data: menbers
        }
      }
      this.fotmItemOptions = JSON.parse(JSON.stringify(this.initFormOperates(this.value)))
      this.approverForm.formOperates = this.initFormOperates(this.value)
    },
    /**
     * 初始化条件节点数据
     */
    initConditionNodeData() {
      // 初始化条件表单数据
      let nodeConditions = this.value.properties && this.value.properties.conditions
      this.pconditions = JSON.parse(JSON.stringify(this.$store.state.processConditions))
      this.initiator = this.value.properties.initiator
      this.initiatorBranch = this.value.properties.initiatorBranch ? this.value.properties.initiatorBranch : []
      this.initiatorType = this.value.properties.initiatorType
      if (Array.isArray(this.pconditions)) {
        this.showingPCons = [] // 默认不显示
        if (this.value.properties.initiator) {
          this.showingPCons.push(-1)
        }
        if (this.value.properties.initiatorBranch) {
          this.showingPCons.push(-2)
        }
        if (this.value.properties.initiatorType) {
          this.showingPCons.push(-3)
        }
        this.pconditions.forEach(t => {
          let temp = undefined
          if (Array.isArray(nodeConditions)) {
            const con = nodeConditions.find(item => item.formId == t.formId)
            con && con.conditionValue && ((temp = con.conditionValue), this.showingPCons.push(t.formId))
          }
          this.$set(t, 'conditionValue', temp)
        })
      }
      this.initTreeData() //初始化发起分馆/发起人类型
      this.getFeeNameList()
    },
    initTreeData() {
      deptTypeInfo().then(res => {
        if (res.code === 200 && res.data) {
          this.initiatorTypeList = res.data
          this.$forceUpdate()
        }
      })
      // schoolFindList().then(res => {
      //   if (res.code === 200 && res.data) {
      //     this.$tools._handleTreeData(res.data)
      //     this.deptTree = res.data
      //     this.$forceUpdate()
      //   }
      // })
    },
    onTreeSearch(inputValue, path) {
      return path.data.props.deptName.indexOf(inputValue) > -1
    },
    handleInput(val, data) {
      // this.$emit('change', {
      //   branchId: val,
      //   name: data[0]
      // })
    },

    getFeeNameList() {
      listFeeName().then(res => {
        this.feeNameList = res.data || []
      })
    },
    allFeeName(item) {
      item.conditionValue = this.feeNameList.map(option => option.id)
    }
  },
  watch: {
    visible(val) {
      if (!val) {
        this.approverForm = JSON.parse(JSON.stringify(defaultApproverForm)) // 重置数据为默认状态
        return
      }
      this.processData.properties.formOperates = this.initFormOperates(this.processData).map(t => ({
        formId: t.formId,
        formOperate: t.formOperate,
        vModel: t.vModel
      }))
      this.isStartNode() && this.initStartNodeData()
      this.isApproverNode() && this.initApproverNodeData()
      this.isConditionNode() && this.initConditionNodeData()
    },

    value(newVal) {
      if (newVal && newVal.properties) {
        this.visible = true
        this.properties = JSON.parse(JSON.stringify(newVal.properties))
        if (this.properties) {
          NodeUtils.isConditionNode(newVal) && this.getPriorityLength()
        }
      }
    }
  },
  components: {
    'num-input': NumInput,
    'row-wrapper': RowWrapper
  }
}
</script>
<style lang="stylus">
.condition-dialog {
  .el-dialog__header{
    border-bottom : 1px solid #eee;
  }
}
</style>
<style lang="stylus" scoped>
.drawer {
  >>> .el-drawer__header {
    margin-bottom: 0;
    border-bottom: 1px solid #c5c5c5;
    padding-bottom: 8px;
  }

  >>> .el-drawer__body {
    padding-bottom: 44px;
    overflow: hidden;
  }

  .pane-tab{
    // height: 100%;
  }

  .pane-tab >>>  .el-tabs__item.is-top:nth-child(2) {
    padding-left: 20px;
  }

  >>> .el-tabs__item:focus{
    box-shadow: none !important;
  }

  >>> .el-tabs__header {
    margin-bottom: 0;
  }
}

.header {
  line-height: 28px;

  height: initial !important;
  padding: initial !important;
  background: initial !important;
  box-shadow: initial !important;
  position: initial !important;
}

.actions {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 6px 12px;
  width: 100%;
  box-sizing: border-box;
  text-align: right;
}

.radio-item {
  width: 110px;
  padding: 6px;
}

.priority-select {
  width: 118px;
  position: absolute;
  right: 26px;
}

.form-auth-table{
  font-size: 14px;
  .auth-table-header{
    background: #fafafa
    line-height: 40px;
  }
  .row{
    display: flex;
    align-items: center;
    line-height: 32px;
    padding: 8px 12px;
    border-bottom: 1px solid #efefef;
    &:hover{
      background: #f5f7fa;
    }
    .label{
      flex:1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      .required{
        color: #f2725e;
      }
    }
    .radio-group{
      flex: 2;
      display: flex;
      justify-content: space-between;
    }
  }
}

.approver-pane{
  overflow-y: scroll;
  overflow-x: hidden;
  .option-box {
    font-size 14px
    padding-left 20px
  }
}

.condition-pane{
  height 100%
  overflow scroll
}

.pane-tab.el-tabs.el-tabs--top{
height:100%;
}
/deep/.ant-notification.ant-notification-topRight {
  z-index: 3000 !important;
}
/deep/.el-tabs__item.is-active {
    color: #19a97b;
}
/deep/.el-radio__input.is-checked+.el-radio__label {
    color: #606266;
}
/deep/.el-button--primary {
    color: #FFF;
    background-color:#19a97b;
    border-color:#19a97b;
}
/deep/.el-radio__input.is-checked .el-radio__inner {
    border-color: #19a97b;
    background: #19a97b;
}
/deep/.el-tabs__active-bar {
    background-color:#19a97b;
}
/deep/.el-radio__inner:hover {
    border-color:  #19a97b;
}
/deep/.el-tabs__item:hover {
    color:  #19a97b;
    cursor: pointer;
}
/deep/.el-select .el-input.is-focus .el-input__inner,/deep/.el-select .el-input__inner:focus  {
    border-color:  #19a97b;
}
.el-select-dropdown__item.selected {
    color:#19a97b;
    font-weight: 700;
}
/deep/.el-checkbox__input.is-checked+.el-checkbox__label {
    color: #19a97b;
}
/deep/.el-checkbox__input.is-checked .el-checkbox__inner, /deep/.el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color:#19a97b;
    border-color: #19a97b;
}
/deep/.el-checkbox__inner:hover {
    border-color: #19a97b;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected {
    color: #19a97b;
    background-color: #FFF;
}
// .el-tabs__content{
//   overflow:initial;
// }
</style>
