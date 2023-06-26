<template>
  <div>
    <a-select
      style="width: 100%;"
      v-model="innerValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :allowClear="!required"
      @change="change"
    >
      <a-select-option v-for="option in options" :key="option[optionKey]" :value="option[optionKey]">
        {{ option[optionValue] }}
      </a-select-option>
    </a-select>
  </div>
</template>
<script>
  import Vue from 'vue'
  import QS from 'qs'
  import { axios, approveAxios } from '@/utils/request'
  export default {
    model: {
      prop: 'value',
      event: 'change'
    },
    props: [
      'value',
      'cmpType',
      'tag',
      'tagIcon',
      'precision',
      'required',
      'disabled',
      'label',
      'labelWidth',
      'step-strictly',
      'controls',
      'controls-position',
      'regList',
      'changeTag',
      'proCondition',
      'formId',
      'renderKey',
      'layout',
      'defaultType',
      'placeholder',
      'formData',
      'rowIndex',
      'source',
      'url',
      'method',
      'optionKey',
      'optionValue',
      'bindPrice',
      'bindPriceKey'
    ],
    name: 'fc-api-select',
    data() {
      return {
        innerValue: this.value?.id,
        options: [],
        bindData: null
      }
    },
    computed: {
      rootFormData() {
        if (this.formData) {
          return this.formData
        } else {
          let root = this.$parent
          while (root) {
            if ('vmFormData' in root) {
              return root.vmFormData
            }
            root = root.$parent
          }
          return root
        }
      },
      bindPriceData() {
        if (this.bindPrice) {
          return this.getFormVal(this.bindPrice)
        }
        return null
      }
    },
    watch: {
      value(val) {
        if (val) {
          this.innerValue = val.id
        } else {
          this.innerValue = undefined
        }
      },
      'options.length'() {
        let index = this.options.findIndex(d => d[this.optionKey] === this.innerValue)
        if ((this.options.length > 0 && this.innerValue && index < 0) || this.options.length <= 0) {
          this.handleInput()
        }
      },
      bindPriceData(val) {
        if (this.bindData?.id !== val?.id) this.initData()
        this.bindData = val
      }
    },
    created() {
      this.initData()
    },
    methods: {
      /**
       * 获取指定组件的值
       */
      getFormVal(vModel) {
        try {
          if (vModel.indexOf('.') > -1) {
            let [tabelVModel, cmpVModel] = vModel.split('.')
            if (typeof this.rowIndex === 'number') {
              return this.rootFormData[tabelVModel][this.rowIndex][cmpVModel] || undefined
            } else {
              return this.rootFormData[tabelVModel].reduce((sum, c) => (c[cmpVModel] || 0) + sum, 0)
            }
          }
          return this.rootFormData[vModel] || 0
        } catch (error) {
          console.warn('计算公式出错, 可能包含无效的组件值', error)
          return 0
        }
      },
      initData() {
        let { label, source, url, method, optionKey, optionValue, bindPrice, bindPriceKey } = this
        url = url.replace(/\s+/g, '')
        optionKey = optionKey.replace(/\s+/g, '')
        optionValue = optionValue.replace(/\s+/g, '')

        if (source && url && optionKey && optionValue) {
          let requst = null
          let params = {}
          let data = ''
          if (source === 'erp') {
            requst = axios
          } else if (source === 'approval') {
            requst = approveAxios
          }
          if (bindPrice) {
            let bindData = this.getFormVal(bindPrice)
            if (bindData) {
              if (typeof bindData === 'string' || typeof bindData === 'number') {
                params = {
                  [bindPriceKey]: bindData
                }
              } else if (typeof bindData === 'object' && bindData.id) {
                params = {
                  [bindPriceKey]: bindData.id
                }
              }
              if (method === 'post') data = QS.stringify(params)
            }
          }

          const cacheKey = 'form_controls_' + url + '?' + QS.stringify(params ? params : {})
          const cacheValue = Vue.ls.get(cacheKey)
          if (cacheValue) {
            this.options = JSON.parse(cacheValue) || []
          } else {
            requst && requst({
              url,
              method,
              params,
              data
            })
              .then(res => {
                const { code, data, msg } = res
                if (code == 200) {
                  this.options = data || []
                  Vue.ls.set(cacheKey, JSON.stringify(data || []))
                } else {
                  this.$notification['warning']({
                    message: '系统通知',
                    description: msg || `${label}错误`
                  })
                }
              })
          }
        }
      },
      change() {
        let selected = this.options.find(d => d[this.optionKey] === this.innerValue)
        this.handleInput(selected)
      },
      handleInput(selected) {
        if (selected) {
          this.$emit('change', {
            id: selected[this.optionKey],
            name: selected[this.optionValue]
          })
        } else {
          this.$emit('change', null)
        }
      }
    },
  }
</script>
<style lang="stylus" scoped>
</style>
