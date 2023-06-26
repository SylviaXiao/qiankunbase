import Amount from './Amount'
import Calculation from './Calculation'
import TimeDuration from './TimeDuration'
import DateDuration from './DateDuration'
import InputTable from './InputTable'
//选择组织结构组件
import OrgSelectNew from './OrgSelectNew'
import OrgTransferNew from './OrgTransferNew'
import TreeStructure from './TreeStructure'
//退费组件
import returnStudent from './returnPremine/student'
//选择学员容器组件
import selectStudentBox from './returnPremine/InputTable'
//选择员工
import selectEmployee from './returnPremine/selectEmployee'
//选择分馆
import selectBranch from './returnPremine/selectBranch'
//选择银行
import selectBank from './returnPremine/SelectBank'
//选择支付方式类型
import selectPayType from './returnPremine/selectPayType'
//上传附件
import uploadFile from './returnPremine/uploadFile'
//条件公式
import condition from './Condition'
//选择学校
import seleceSchool from './Expense/selectSchool'
//费用类型
import SelectFeeType from './Expense/SelectFeeType'
//费用类型
import SelectFinance from './Expense/SelectFinance'
//分摊
import Apportion from './Expense/Apportion'
//费用名称
import SelectFeeName from './Expense/SelectFeeName'
//单位
import SelectUnit from './Expense/SelectUnit'
//成本归类
import SelectCostType from './Expense/SelectCostType'
//银行下拉选择
import filterBank from './returnPremine/filterBank'
//总金额
import TotalMoney from './Expense/TotalMoney'
import selectBankList from './Expense/selectBankList'
//发票数量
import invoiceQuantity from './Expense/invoiceQuantity'
//输入验证
import InputVerify from './returnPremine/InputVerify'
//业绩
import PerList from './Expense/PerList'
//资源来源
import Source from './returnPremine/Source'
//远程下拉选择
import ApiSelect from './returnPremine/ApiSelect'
//投票
import Vote from './Vote/index'
import DateSelect from './DateSelect/index'

const components = [
  DateSelect,
  selectBankList,
  TotalMoney,
  filterBank,
  SelectCostType,
  SelectUnit,
  SelectFeeName,
  Amount,
  Calculation,
  TimeDuration,
  DateDuration,
  InputTable,
  TreeStructure,
  OrgTransferNew,
  OrgSelectNew,
  returnStudent,
  selectEmployee,
  selectBranch,
  condition,
  selectStudentBox,
  selectBank,
  selectPayType,
  uploadFile,
  seleceSchool,
  SelectFeeType,
  SelectFinance,
  Apportion,
  invoiceQuantity,
  InputVerify,
  PerList,
  Source,
  ApiSelect,
  Vote
]

const install = function(Vue) {
  components.map(component => {
    Vue.component(component.name, component)
  })
}

export default {
  install
}
