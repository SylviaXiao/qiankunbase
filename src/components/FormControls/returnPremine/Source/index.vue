<template>
  <div style="padding-right: 20px">
    <a-auto-complete
      style="cursor: pointer;"
      :dataSource="stuSource"
      :disabled="disabled"
      :defaultOpen="false"
      :open="isOpen"
      @focus="focus"
      @blur="blur"
      @select="selectSource"
    >
      <span slot="default">
        <a-input
          style="cursor: pointer;"
          :value="innerValue && innerValue.name"
          placeholder="请选择资源来源"
          read-only
          @focus="focus"
          @blur="blur"
        >
          <a slot="suffix" v-if="isShowService" @click.stop="openServiceModal">选择客服</a>
        </a-input>
      </span>
    </a-auto-complete>

    <i-modal ref="imodal" userType="service" @getBackData="getService" />
  </div>
</template>
<script>
  import Vue from 'vue'
  import { getSelectStuSourceData } from '@/api/common'
  import IModal from '@/components/InnerModal/modal.vue'

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
      'placeholder'
    ],
    name: 'fc-source',
    components: {
      IModal
    },
    data() {
      return {
        innerValue: this.value || null,
        isOpen: false,
        stuSource: ['客服']
      }
    },
    computed: {
      isShowService() {
        return this.innerValue && (this.innerValue.name === '客服' || this.innerValue.id)
      }
    },
    created() {
      this.getSourceValue()
    },
    methods: {
      handleInput() {
        this.$emit('change', this.innerValue)
      },
      getSourceValue() {
        const cacheKey = 'form_controls_' + getSelectStuSourceData.name
        const cacheValue = Vue.ls.get(cacheKey)
        if (cacheValue) {
          let stuSource = JSON.parse(cacheValue)
          stuSource.forEach(item => {
            this.stuSource.push(item.sourceName)
          })
        } else {
          getSelectStuSourceData()
            .then(res => {
              return res.data ? JSON.parse(res.data) : {}
            })
            .then(res => {
              if (res.data instanceof Array) {
                Vue.ls.set(cacheKey, JSON.stringify(res.data))
                res.data.forEach(item => {
                  this.stuSource.push(item.sourceName)
                })
              }
            })
        }
      },
      blur() {
        this.isOpen = false
      },
      focus() {
        this.isOpen = true
      },
      selectSource(value, option) {
        this.innerValue = {
          id: null,
          name: value
        }
        this.isOpen = false
        this.handleInput()
      },
      openServiceModal() {
        this.$refs.imodal.open()
      },
      getService(data) {
        this.innerValue = data
        this.handleInput()
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
