export const trigger = {
  'el-input': 'blur',
  'fc-condition': 'blur',
  'el-input-number': 'blur',
  'el-select': 'change',
  'el-radio-group': 'change',
  'el-checkbox-group': 'change',
  'el-cascader': 'change',
  'el-time-picker': 'change',
  'el-date-picker': 'change',
  'fc-date-select': 'change',
  'el-rate': 'change',
  'fc-amount': 'change',
  'fc-time-duration': 'change',
  'fc-date-duration': 'change',
  'fc-org-select': 'input',
  'fc-return-student': 'change',
  'fc-input-student': 'change',
  'fc-select-branch': 'change',
  'fc-filter-bank': 'change',
  'fc-select-school': 'change',
  'fc-select-payType': 'change',
  'fc-select-feeType': 'change',
  'fc-select-costType': 'change',
  'fc-select-feeName': 'change',
  'fc-select-bankList': 'change',
  'fc-select-unit': 'change',
  'fc-select-finance': 'change',
  'fc-apportion': 'change',
  'fc-select-employee': 'change',
  'fc-select-bank': 'change',
  'fc-uploadFile': 'change',
  'fc-total-money': 'change',
  'fc-input-verify': 'change',
  'fc-per-list': 'change',
  'fc-source': 'change',
  'fc-api-select': 'change',
  'fc-vote': 'change'
}
// forceProp 强制使用的属性 用于覆盖用户或者默认设置
export const useableProps = [
  {
    props: [
      'vModel',
      'defaultValue',
      'formId',
      'type',
      'label',
      'tag',
      'clearable',
      'maxlength',
      'readonly',
      'disabled',
      'required',
      'regList',
      'hidden',
      'style'
    ],
    forceProp: {
      'min-width': 100
    },
    tag: 'el-input'
  },
  {
    props: ['label', 'tag', 'defaultValue', 'max', 'allow-half', 'show-text', 'show-score', 'disabled', 'required', 'hidden', 'style'],
    forceProp: {
      'min-width': 100
    },
    tag: 'el-rate'
  },
  {
    props: ['vModel', 'defaultValue', 'formId', 'label', 'tag', 'step-strictly', 'disabled', 'required', 'regList', 'hidden', 'style'],
    forceProp: {
      controls: false,
      'min-width': 100
    },
    tag: 'el-input-number'
  },
  {
    props: [
      'showChinese',
      'vModel',
      'defaultValue',
      'formId',
      'label',
      'tag',
      'step-strictly',
      'disabled',
      'required',
      'regList',
      'hidden',
      'style',
      'bindPrice',
      'formData',
      'bindInvoice'
    ],
    forceProp: {
      controls: false,
      'min-width': 100
    },
    tag: 'fc-total-money'
  },
  {
    props: ['vModel', 'defaultValue', 'formId', 'label', 'tag', 'disabled', 'required', 'regList', 'hidden', 'style'],
    forceProp: {
      controls: false,
      'min-width': 100
    },
    tag: 'fc-amount'
  },
  {
    props: [
      'approverBranchId',
      'vModel',
      'defaultValue',
      'formId',
      'label',
      'tag',
      'disabled',
      'required',
      'regList',
      'hidden',
      'style',
      'defaultBranch',
      'defaultType'
    ],
    forceProp: {
      controls: false,
      'min-width': 100
    },
    tag: 'fc-select-branch'
  },
  {
    props: [
      'vModel',
      'defaultValue',
      'formId',
      'label',
      'tag',
      'disabled',
      'required',
      'regList',
      'hidden',
      'style',
      'defaultBranch',
      'bindPrice',
      'defaultType'
    ],
    forceProp: {
      controls: false,
      'min-width': 100
    },
    tag: 'fc-filter-bank'
  },
  {
    props: ['vModel', 'defaultValue', 'formId', 'label', 'tag', 'disabled', 'required', 'regList', 'hidden', 'style'],
    forceProp: {
      controls: false,
      'min-width': 100
    },
    tag: 'fc-select-payType'
  },
  {
    props: ['vModel', 'defaultValue', 'formId', 'label', 'tag', 'disabled', 'required', 'regList', 'hidden', 'style', 'bindTypePrice'],
    forceProp: {
      controls: false,
      'min-width': 100
    },
    tag: 'fc-select-feeType'
  },
  {
    props: [
      'vModel',
      'defaultValue',

      'formId',
      'label',
      'tag',
      'disabled',
      'required',
      'regList',
      'hidden',
      'style',
      'bindPrice',
      'bindTypePrice',
      'defaultType',
      'approveType',
      'formData'
    ],
    forceProp: {
      controls: false,
      'min-width': 100
    },
    tag: 'fc-select-costType'
  },
  {
    props: ['vModel', 'defaultValue', 'formId', 'label', 'tag', 'disabled', 'required', 'regList', 'hidden', 'style', 'bindPrice', 'formData'],
    forceProp: {
      controls: false,
      'min-width': 100
    },
    tag: 'fc-select-feeName'
  },
  {
    props: ['vModel', 'defaultValue', 'formId', 'label', 'tag', 'disabled', 'required', 'regList', 'hidden', 'style', 'formData'],
    forceProp: {
      controls: false,
      'min-width': 100
    },
    tag: 'fc-select-bankList'
  },
  {
    props: ['vModel', 'defaultValue', 'formId', 'formData', 'label', 'tag', 'disabled', 'bindPrice', 'required', 'regList', 'hidden', 'style'],
    forceProp: {
      controls: false,
      'min-width': 100
    },
    tag: 'fc-select-unit'
  },
  {
    props: ['vModel', 'defaultValue', 'formId', 'label', 'tag', 'disabled', 'required', 'regList', 'style'],
    forceProp: {
      controls: false,
      'min-width': 100
    },
    tag: 'fc-select-finance'
  },
  {
    props: ['vModel', 'defaultValue', 'formId', 'label', 'tag', 'disabled', 'required', 'regList', 'bindPrice', 'hidden', 'style'],
    forceProp: {
      controls: false,
      'min-width': 100
    },
    tag: 'fc-apportion'
  },
  {
    props: ['vModel', 'defaultValue', 'formId', 'label', 'tag', 'disabled', 'required', 'regList', 'hidden', 'style'],
    forceProp: {
      controls: false,
      'min-width': 100
    },
    tag: 'fc-select-employee'
  },
  {
    props: ['vModel', 'defaultValue', 'formId', 'label', 'tag', 'disabled', 'required', 'regList', 'hidden', 'style', 'defaultType'],
    forceProp: {
      controls: false,
      'min-width': 100
    },
    tag: 'fc-select-bank'
  },
  {
    props: [
      'vModel',
      'defaultValue',
      'formId',
      'formData',
      'label',
      'tag',
      'disabled',
      'required',
      'regList',
      'hidden',
      'style',
      'uploadFileType',
      'bindPrice'
    ],
    forceProp: {
      controls: false,
      'min-width': 100
    },
    tag: 'fc-uploadFile'
  },
  {
    props: [
      'vModel',
      'defaultValue',
      'formId',
      'label',
      'tag',
      'clearable',
      'disabled',
      'required',
      'filterable',
      'multiple',
      'options',
      'regList',
      'hidden',
      'style'
    ],
    forceProp: {
      'min-width': 140
    },
    tag: 'el-select'
  },
  {
    props: [
      'vModel',
      'defaultValue',
      'formId',
      'label',
      'tag',
      'defaultValue',
      'props',
      'show-all-levels',
      'disabled',
      'clearable',
      'filterable',
      'required',
      'options',
      'dataType',
      'separator',
      'regList',
      'hidden',
      'style'
    ],
    forceProp: {
      'min-width': 170
    },
    tag: 'el-cascader'
  },
  {
    props: [
      'vModel',
      'defaultValue',
      'formId',
      'label',
      'tag',
      'optionType',
      'border',
      'size',
      'disabled',
      'required',
      'options',
      'regList',
      'hidden',
      'style'
    ],
    forceProp: {
      'min-width': 140
    },
    tag: 'el-radio-group'
  },
  {
    props: [
      'vModel',
      'defaultValue',
      'formId',
      'label',
      'tag',
      'defaultValue',
      'optionType',
      'border',
      'size',
      'disabled',
      'required',
      'options',
      'regList',
      'hidden',
      'style'
    ],
    forceProp: {
      'min-width': 140
    },
    tag: 'el-checkbox-group'
  },
  {
    props: [
      'vModel',
      'defaultValue',
      'formId',
      'label',
      'tag',
      'defaultValue',
      'disabled',
      'required',
      'min',
      'max',
      'step',
      'show-stops',
      'range',
      'regList',
      'hidden',
      'style'
    ],
    forceProp: {
      'min-width': 100
    },
    tag: 'el-slider'
  },
  {
    props: [
      'vModel',
      'defaultValue',
      'formId',
      'label',
      'tag',
      'defaultValue',
      'tabList',
      'buttonType',
      'title',
      'searchable',
      'maxNum',
      'tagConfig',
      'disabled',
      'required',
      'regList',
      'hidden',
      'style'
    ],
    forceProp: {
      buttonType: 'input',
      'min-width': 100
    },
    tag: 'fc-org-select'
  },
  {
    props: [
      'vModel',
      'defaultValue',
      'formId',
      'label',
      'tag',
      'defaultValue',
      'disabled',
      'clearable',
      'required',
      'picker-options',
      'format',
      'value-format',
      'regList',
      'hidden',
      'style'
    ],
    forceProp: {
      'min-width': 100
    },
    tag: 'el-time-picker'
  },
  {
    props: [
      'vModel',
      'defaultValue',
      'formId',
      'label',
      'tag',
      'defaultValue',
      'disabled',
      'clearable',
      'required',
      'picker-options',
      'format',
      'value-format',
      'regList',
      'hidden',
      'style'
    ],
    forceProp: {
      'min-width': 100
    },
    tag: 'fc-date-select'
  },
  {
    props: [
      'vModel',
      'defaultValue',
      'formId',
      'label',
      'tag',
      'defaultValue',
      'disabled',
      'clearable',
      'required',
      'is-range',
      'range-separator',
      'format',
      'value-format',
      'regList',
      'hidden',
      'style'
    ],
    forceProp: {
      'min-width': 200
    },
    tag: 'fc-time-duration'
  },
  {
    props: [
      'vModel',
      'defaultValue',
      'formId',
      'label',
      'tag',
      'defaultValue',
      'type',
      'disabled',
      'clearable',
      'required',
      'format',
      'value-format',
      'readonly',
      'regList',
      'hidden',
      'style'
    ],
    forceProp: {
      'min-width': 100
    },
    tag: 'el-date-picker'
  },
  {
    props: [
      'vModel',
      'defaultValue',
      'formId',
      'label',
      'tag',
      'defaultValue',
      'type',
      'range-separator',
      'disabled',
      'clearable',
      'required',
      'format',
      'value-format',
      'readonly',
      'regList',
      'hidden',
      'style'
    ],
    forceProp: {
      'min-width': 210
    },
    tag: 'fc-date-duration'
  },
  {
    props: [
      'vModel',
      'defaultValue',
      'formId',
      'label',
      'tag',
      'action',
      'defaultValue',
      'disabled',
      'required',
      'accept',
      'name',
      'auto-upload',
      'showTip',
      'fileSize',
      'sizeUnit',
      'list-type',
      'multiple',
      'regList',
      'hidden',
      'style'
    ],
    forceProp: {
      'list-type': 'text',
      'min-width': 80,
      defaultValue: []
    },
    tag: 'el-upload'
  },
  {
    props: [
      'label',
      'type',
      'tag',
      'showChinese',
      'defaultValue',
      'style',
      'disabled',
      'required',
      'expression',
      'vModel',
      'precision',
      'round',
      'formId',
      'formData',
      'hidden',
      'style'
    ],
    forceProp: {
      'min-width': 100,
      showChinese: false
    },
    tag: 'fc-calculate'
  }
]
