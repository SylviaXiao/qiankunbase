<template>
  <div style="padding-right: 20px">
    <a-input
      style="width: 100%;"
      v-model="innerValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="e => handleInput()"
    >
      <a-icon slot="addonAfter" type="check" v-if="defaultType == 'button'" @click="checkValue"/>
    </a-input>
  </div>
</template>
<script>
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
      'url',
      'method',
      'paramsKey'
    ],
    name: 'fc-input-verify',
    components: {
    },
    data() {
      return {
        innerValue: this.value?.name
      }
    },
    computed: {},
    methods: {
      checkValue(showNotice = true) {
        return new Promise((resolve, reject) => {
          let { label, innerValue, defaultType, url, method, paramsKey } = this
          url = url.replace(/\s+/g, '')
          paramsKey = paramsKey.replace(/\s+/g, '')

          let params = {}
          if (paramsKey) params[paramsKey] = innerValue
          if (url) {
            approveAxios({
              url,
              method,
              params
            })
              .then(res => {
                const { code, data, msg } = res
                if (data) {
                  this.handleInput(data.studentCard.id)
                  if (showNotice) {
                    this.$notification['success']({
                      message: '系统通知',
                      description: msg || `${label}验证成功`
                    })
                  }
                } else {
                  if (showNotice) {
                    this.$notification['warning']({
                      message: '系统通知',
                      description: msg || `${label}验证错误`
                    })
                  }
                }
                return resolve(res)
              })
          }
        })
      },
      handleInput(id = null) {
        this.$emit('change', { id, name: this.innerValue })
      }
    },
    watch: {
      value(val) {
        if (!val) {
          this.innerValue = val
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
</style>
