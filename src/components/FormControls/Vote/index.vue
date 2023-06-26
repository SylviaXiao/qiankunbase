<template>
  <div class="fc-vote-wrapper">
    <template v-if="defaultType === 'radio'">
      <a-radio-group v-model="innerValue[0]" :disabled="disabled" @change="handleInput">
        <div v-for="option in options" :key="option.value" class="option-wrapper">
          <a-radio :value="option.value">
            <span class="label">{{option.label}}</span>
          </a-radio>
          <div class="option">
            <div class="describe">{{option.describe}}</div>
            <div class="remark" v-if="innerValue.includes(option.value)">
              <a-input style="width: 100%" :value="remarks[option.value]" @input="e => handleInputChange(e, option.value)" />
            </div>
          </div>
        </div>
      </a-radio-group>
    </template>
    <template v-if="defaultType === 'checkbox'">
      <a-checkbox-group v-model="innerValue" :disabled="disabled" @change="handleInput">
        <div v-for="option in options" :key="option.value" class="option-wrapper">
          <a-checkbox :value="option.value">
            <span class="label">{{option.label}}</span>
          </a-checkbox>
          <div class="option">
            <div class="describe">{{option.describe}}</div>
            <div class="remark" v-if="innerValue.includes(option.value)">
              <a-input style="width: 100%" :value="remarks[option.value]" @input="e => handleInputChange(e, option.value)" />
            </div>
          </div>
        </div>
      </a-checkbox-group>
    </template>
  </div>
</template>
<script>
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
      'options'
    ],
    name: 'fc-vote',
    data() {
      return {
        innerValue: [],
        remarks: {}
      }
    },
    watch: {
      value(val) {
        this.initValue(val)
      },
    },
    created() {
      this.initValue(this.value)
    },
    methods: {
      initValue(val) {
        if (Array.isArray(val)) {
          this.innerValue = val.map(d => d.id)
          this.remarks = {}
          val.forEach(d => {
            if (this.innerValue.includes(d.id)) {
              this.remarks[d.id] = d.remark
            }
          })
        } else {
          this.innerValue = []
          this.remarks = {}
        }
      },
      handleInputChange(e, key) {
        this.remarks[key] = e?.currentTarget?.value
        this.handleInput()
      },
      handleInput() {
        let selected = this.options.map((d, i) => {
          if (this.innerValue.includes(d.value)) {
            return { id: d.value, name: d.label, describe: d.describe, remark: this.remarks[d.value] }
          } else {
            return null
          }
        }).filter(d => d != null)
        this.$emit('change', selected)
      }
    },
  }
</script>
<style lang="less" type="text/less" scoped>
  .fc-vote-wrapper {
    .option-wrapper {
      padding: 5.5px 0;

      .option {
        margin-left: 24px;

        .describe {
          color: #A2A2A2;
        }

        .remark {
          margin-top: 5px;
        }
      }
    }

    .ant-radio-group,
    .ant-checkbox-group {
      width: 100%;
    }
  }
</style>
