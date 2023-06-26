<template>
  <div>
    <a-spin :spinning="spinning">
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-row>
          <a-col :span="19">
            <a-form-model-item v-bind="defaultLayout" label="学员姓名" prop="stuName">
              <a-input placeholder="请填写学员姓名" v-model="form.stuName" />
            </a-form-model-item>
          </a-col>
          <a-col :span="5">
            <a-form-model-item>
              <a-radio-group v-model="form.userSex" :options="sexArr" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" class="line-margin">
            <a-form-model-item v-bind="InputLayout" label="手机号" prop="userPhone">
              <a-input placeholder="请填写学员手机号" v-model="form.userPhone" class="wid98" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" class="line-margin">
            <a-form-model-item v-bind="InputLayout" label="微信" prop="userWeChat">
              <a-input placeholder="请填写学员微信号" v-model="form.userWeChat" class="wid98" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" class="line-margin">
            <a-form-model-item v-bind="InputLayout" label="QQ" prop="userQQ">
              <a-input placeholder="请填写学员QQ号" v-model="form.userQQ" class="wid98" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" class="line-margin">
            <a-form-model-item v-bind="InputLayout" label="省市" prop="userArea">
              <a-cascader
                :options="addressOptions"
                notFoundContent="暂无数据"
                :showSearch="{ dataFilter }"
                placeholder="请选择省市区"
                :fieldNames="{ label: 'value', value: 'value', children: 'children' }"
                changeOnSelect
                v-model="form.userArea"
                class="wid98"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="19">
            <a-form-model-item v-bind="defaultLayout" label="资源来源" prop="userSource">
              <a-select v-model="form.userSource" placeholder="请选择资源来源" @change="sourceChange">
                <a-select-option v-for="(i, index) in resourceSourceList" :key="index" :value="i.value" class="wid98">{{ i.label }} </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="5">
            <a-form-model-item>
              <div class="active" @click="recommend" v-if="!referrer">
                {{ form.userSource == '客服' ? '选择客服' : form.userSource == '会员介绍' ? '推荐人' : '' }}
              </div>
              <div class="active" @click="recommend" v-if="referrer">{{ referrer }}</div>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row v-if="this.type === 'serve'">
          <a-col :span="24" class="line-margin">
            <a-form-model-item v-bind="InputLayout" label="分配分馆" prop="schoolId">
              <a-tree-select
                v-model="form.schoolId"
                @change="onTreeChange"
                :filterTreeNode="onTreeSearch"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                multiple
                :treeData="deptTree"
                :treeDefaultExpandAll="true"
                placeholder="请选择分馆"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" class="line-margin">
            <a-form-model-item v-bind="InputLayout" label="意向舞种" prop="danceId">
              <a-select :allowClear="true" style="width: 100%" v-model="form.danceId" placeholder="请选择意向舞种">
                <a-select-option v-for="(i, index) in danceList" :key="index" :value="i.value" class="wid98">{{ i.label }} </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" class="line-margin">
            <a-form-model-item v-bind="InputLayout" label="意向班型" prop="categoryId">
              <a-select :allowClear="true" style="width: 100%" v-model="form.categoryId" placeholder="请选择意向班型">
                <a-select-option v-for="(i, index) in typeList" :key="index" :value="i.value" class="wid98">{{ i.label }} </a-select-option>
              </a-select>
              <!-- <a-cascader
              class="wid98"
              :options="typeList"
              :showSearch="{ dataFilter }"
              notFoundContent="暂无数据"
              placeholder="请选择意向班型"
              :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
              changeOnSelect
              v-model="form.categoryId"
            /> -->
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" class="line-margin">
            <a-form-model-item v-bind="InputLayout" label="备注">
              <a-textarea placeholder="请填写备注" v-model="form.userRemark" style="height: 1rem" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <span class="active mb20" @click="showMore = !showMore">{{ !showMore ? '展开查看更多' : '收起' }}</span>
        <template v-if="showMore">
          <a-row>
            <a-col :span="24" class="line-margin">
              <a-form-model-item v-bind="InputLayout" label="生日">
                <a-date-picker v-model="form.birth" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24" class="line-margin">
              <a-form-model-item v-bind="InputLayout" label="舞蹈等级">
                <a-select :allowClear="true" style="width: 100%" v-model="form.danceLevel" placeholder="请选择舞蹈等级">
                  <a-select-option v-for="(i, index) in danceLevelList" :key="index" :value="i.value" class="wid98">{{ i.label }} </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24" class="line-margin">
              <a-form-model-item v-bind="InputLayout" label="用户标签">
                <a-button @click="chooseUserTab(1)" v-if="!form.tags.length">选择</a-button>
                <template v-else>
                  <a-tag closable @close="deleteTag(item.value, 1)" v-for="item in form.tags" :key="item.value" @click="chooseUserTab(1)">
                    {{ item.label }}
                  </a-tag>
                </template>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24" class="line-margin">
              <a-form-model-item v-bind="InputLayout" label="用户等级">
                <a-button @click="chooseUserTab(2)" v-if="!form.levelId.length">选择</a-button>
                <template v-else>
                  <a-tag closable @close="deleteTag(item.value, 2)" v-for="item in form.levelId" :key="item.value" @click="chooseUserTab(2)">
                    {{ item.label }}
                  </a-tag>
                </template>
              </a-form-model-item>
            </a-col>
          </a-row>
        </template>
      </a-form-model>
      <!-- 推荐人 -->
      <a-modal :maskClosable="$store.state.modalMaskClickEnable" title="选择推荐人" :width="800" v-model="visible" @cancel="handleCancel" @ok="handleOk">
        <choose-persons ref="ChoosePersons" :columns="columns" :loadData="loadData" chooseKey="resourceId" chooseName="userName" :radio="true" v-if="visible" />
      </a-modal>
      <!-- 选择标签 -->
      <a-modal :maskClosable="$store.state.modalMaskClickEnable" :title="tabTitle" :width="800" v-model="tabVisible" @cancel="tabCancel" @ok="tabOk">
        <choose-tabs ref="ChooseTabs" :tagList="tagList" :multiple="multiple" />
      </a-modal>
    </a-spin>
  </div>
</template>

<script>
import DISTRICTS from '@/tools/citydata'
import ChoosePersons from '@/components/ChoosePersons/ChoosePersons'
import ChooseTabs from '@/components/ChooseTabs/ChooseTabs'
import { findAllDictDataByTypeIds, schoolFindAll, findAllResource } from '@/api/workFlow/request.js'
const addressOptions = DISTRICTS

const defaultLayout = {
  labelCol: { md: { span: 6 } },
  wrapperCol: { md: { span: 16 } }
}
const fullLineLayout = {
  labelCol: { md: { span: 3 } },
  wrapperCol: { md: { span: 20 } }
}
const InputLayout = {
  labelCol: { md: { span: 4 } },
  wrapperCol: { md: { span: 13 } }
}
const sexArr = [{ label: '男', value: 'A' }, { label: '女', value: 'B' }]
/**推荐人 */
const columns = [
  {
    title: '姓名',
    key: 'userName',
    dataIndex: 'userName',
    scopedSlots: { customRender: 'userName' }
  },
  {
    title: '手机号',
    key: 'userPhone',
    dataIndex: 'userPhone'
  },
  {
    title: '微信号',
    key: 'userWechat',
    dataIndex: 'userWechat',
    scopedSlots: { customRender: 'userWechat' }
  },
  {
    title: 'QQ号',
    key: 'userQQ',
    dataIndex: 'userQQ'
  },
  {
    title: '资源来源',
    key: 'userSource',
    dataIndex: 'userSource',
    scopedSlots: { customRender: 'userSource' }
  },
  {
    title: '所属顾问',
    key: 'stuNo',
    dataIndex: 'stuNo'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'AddStudent',
  data() {
    let validatePhone = (rule, value, callback) => {
      if (!!!this.form.userPhone && !!!this.form.userWeChat && !!!this.form.userQQ) {
        callback(new Error('手机号、微信、QQ请至少填写其中一个'))
      }
      if (value) {
        let reg = /^1[3456789]\d{9}$/
        if (!reg.test(value)) {
          callback(new Error('请输入正确的格式手机号'))
        }
      }
      callback()
    }
    let validateWechat = (rule, value, callback) => {
      if (!!!this.form.userPhone && !!!this.form.userWeChat && !!!this.form.userQQ) {
        callback(new Error('手机号、微信、QQ请至少填写其中一个'))
      }
      callback()
    }
    let validateQq = (rule, value, callback) => {
      if (!!!this.form.userPhone && !!!this.form.userWeChat && !!!this.form.userQQ) {
        callback(new Error('手机号、微信、QQ请至少填写其中一个'))
      }
      if (value) {
        let reg = /^[1-9]\d{4,9}$/
        if (!reg.test(value)) {
          callback(new Error('请输入正确的格式qq'))
        }
      }
      callback()
    }
    return {
      columns,
      defaultLayout,
      fullLineLayout,
      InputLayout,
      sexArr,
      addressOptions,
      loadData: parameter => {
        return findAllResource(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      form: {
        stuName: '',
        userSex: 'A',
        userPhone: '',
        userWeChat: '',
        userQQ: '',
        userArea: [],
        userSource: '',
        danceId: '',
        categoryId: [],
        userRemark: '',
        birth: '',
        danceLevel: '',
        tags: [],
        levelId: [],
        schoolId: []
      },
      rules: {
        schoolId: [{ required: true, message: '请选择分馆', trigger: 'change' }],
        stuName: [{ required: true, message: '请填写学员姓名', trigger: 'blur' }],
        userPhone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
        userWeChat: [{ required: true, validator: validateWechat, trigger: 'blur' }],
        userQQ: [{ required: true, validator: validateQq, trigger: 'blur' }],
        resourceId: [{ required: true, message: '请选择省市区', trigger: 'change' }],
        userSource: [{ required: true, message: '请选择资源来源', trigger: 'change' }],
        danceId: [{ required: true, message: '请选择意向舞种', trigger: 'change' }],
        categoryId: [{ required: true, message: '请选择意向班型', trigger: 'change' }]
      },
      showMore: false,

      resourceSourceList: [],
      danceList: [],
      danceLevelList: [], //舞蹈等级列表
      typeList: [],
      tagList: [],
      importanceLevelList: [],

      visible: false,
      referrer: null, //推荐人信息
      referrerId: null, //推荐人信息
      tabTitle: {},
      tabVisible: false,
      deptTree: [],
      spinning: false,
      tags: [],
      multiple: false
    }
  },
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  components: { ChoosePersons, ChooseTabs },
  computed: {},

  created() {
    this.getList()
    this.initTreeData()
  },

  methods: {
    backData(data) {
      this.spinning = true
      Object.keys(this.form).forEach(item => {
        this.form[item] = data[item]
      })
      // this.form = data
      this.form.userSex = this.form.userSex || 'A'
      this.spinning = false
    },
    async getList() {
      this.spinning = true
      let { data } = await findAllDictDataByTypeIds({ typeIds: ['resourceSource', 'categor', 'dance', 'tag', 'userLevel', 'danceLevel'] })
      const { dance, userLevel, tag, resourceSource, categor, danceLevel } = data
      this.danceList = dance
      this.typeList = categor
      this.importanceLevelList = userLevel
      this.danceLevelList = danceLevel
      this.tags = tag
      this.resourceSourceList = resourceSource

      this.spinning = false
    },
    // 分馆树方法
    initTreeData() {
      // return new Promise((resolve, reject) => {
      schoolFindAll().then(res => {
        if (res.code === 200 && res.data) {
          this.$tools._handleTreeData(res.data)
          this.deptTree = res.data
        }
      })
      // })
    },
    onTreeSearch(inputValue, path) {
      return path.data.props.deptName.indexOf(inputValue) > -1
    },
    onTreeChange(value, name, extra) {
      if (value.length > 1) {
        value.shift()
      }
      this.treeValue = value[0]
      this.treeName = name[0]
    },
    chooseUserTab(type) {
      if (type === 1) {
        this.tabTitle = '选择用户标签'
        this.tagList = this.tags
        this.multiple = true
      } else {
        this.tabTitle = '选择用户等级'
        this.tagList = this.importanceLevelList
        this.multiple = false
      }
      this.tabVisible = true
    },
    //选择标签
    deleteTag(id, type) {
      if (type === 1) {
        this.form.tags = this.form.tags.filter(item => item.value !== id)
      } else {
        this.form.levelId = this.form.levelId.filter(item => item.value !== id)
      }
    },
    tabCancel() {
      this.tabVisible = false
      this.$refs.ChooseTabs.reset()
    },
    tabOk() {
      this.$refs.ChooseTabs.checkSelect().then(data => {
        if (this.tabTitle === '选择用户标签') {
          this.form.tags = data
        } else {
          this.form.levelId = data
        }
        this.tabCancel()
      })
    },
    //推荐人弹窗
    handleCancel() {
      this.visible = false
      this.showMore = false
      this.$refs.ChoosePersons.reset()
    },
    handleOk() {
      this.$refs.ChoosePersons.checkSelect().then(data => {
        this.referrer = data[0].userName
        this.referrerId = data[0].resourceId
        this.handleCancel()
      })
    },
    /**资源来源切换 */
    sourceChange(e) {
      if (e == '客服') {
        this.referrer = '选择客服'
        this.referrerId = null
      } else if (e == '会员介绍') {
        this.referrer = '推荐人'
        this.referrerId = null
      } else {
        this.referrer = null
        this.referrerId = null
      }
    },
    recommend() {
      this.visible = true
    },
    checkForm() {
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.form.birth = this.$tools.tailor.getDate(this.form.birth)
            this.form.userArea = this.form.userArea.join(',')
            this.form.levelId = this.form.levelId[0]
            resolve(this.form)
          }
        })
      })
    },
    reset() {
      this.form = {
        stuName: '',
        userSex: 'A',
        userPhone: '',
        userWeChat: '',
        userQQ: '',
        userArea: [],
        userSource: '',
        danceId: '',
        categoryId: [],
        userRemark: '',
        birth: '',
        danceLevel: '',
        tags: [],
        levelId: [],
        schoolId: []
      }
      this.showMore = false
      this.$refs.ruleForm.clearValidate()
    },
    dataFilter(inputValue, path) {
      return path.some(option => option.value.indexOf(inputValue) > -1)
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/assets/style/index';

.wid98 {
  width: 98%;
}
.line-margin {
  margin-left: 17px;
}
.active {
  color: @theme-color;
  cursor: pointer;
}
</style>
