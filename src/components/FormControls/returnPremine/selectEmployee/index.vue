<template>
  <div class="fc-select-employee">
    <div>
      <a-input
        style="width: 100%;"
        v-model="innerValue"
        :placeholder="placeholder"
        :disabled="true"
      >
        <a-icon slot="addonAfter" type="search" v-if="defaultType !== 'student'" @click="choosePerson"/>
      </a-input>
    </div>
    <i-modal
      ref="modal"
      userType="all"
      @getBackData="getUserBack"
    ></i-modal>
    <choose-tea
      ref="choosetea"
      :dimission="false"
      teaFields="teacher"
      @getBackData="getTeaBack"
    ></choose-tea>
  </div>
</template>
<script>
  import IModal from '@/components/InnerModal'
  import ChooseTea from '@/components/ChooseTea'

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
    name: 'fc-select-employee',
    components: {
      IModal,
      ChooseTea
    },
    data() {
      return {
        innerId: this.value?.id,
        innerValue: this.value?.name
      }
    },
    computed: {},
    methods: {
      choosePerson() {
        if (!this.disabled) {
          if (this.defaultType === 'default') {
            this.$refs.modal.open()
          } else if (this.defaultType === 'teacher') {
            this.$refs.choosetea.open()
          } else if (this.defaultType === 'student') {}
        }
      },
      getUserBack(data, type) {
        this.$nextTick(() => {
          this.innerValue = data.name
          this.$emit('change', {
            id: data.id,
            name: data.name
          })
        })
      },
      getTeaBack(data, type) {
        this.$nextTick(() => {
          this.innerValue = data.name
          this.$emit('change', {
            id: data.id,
            name: data.name
          })
        })
      },
      handleInput(val) {
        this.$emit('change', val)
      }
    },
    watch: {
      value(val) {
        if (!val) {
          this.innerId = val.id
          this.innerValue = val.name
        }
      },
      innerValue(val) {
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .explain-text {
    font-size: 12px;
    color: #aaa;
    line-height: 20px;
  }
</style>
