<template>
  <div>
    <template v-for="tag in tagList">
      <a-checkable-tag :key="tag.value" :checked="selectedTags.indexOf(tag) > -1" @change="checked => handleChange(tag, checked)">
        {{ tag.label }}
      </a-checkable-tag>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ChooseTabs',
  data() {
    return {
      selectedTags: []
    }
  },
  props: {
    tagList: {
      type: Array,
      default: () => []
    },
    multiple: {
      type: Boolean,
      default: true
    }
  },

  components: {},

  computed: {},

  created() {},

  methods: {
    handleChange(tag, checked) {
      const { selectedTags } = this
      if (this.multiple) {
        const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag)
        this.selectedTags = nextSelectedTags
      } else {
        this.selectedTags = [tag]
      }
    },
    reset() {
      this.selectedTags = []
    },
    checkSelect() {
      return new Promise((resolve, reject) => {
        if (!this.selectedTags.length) {
          this.$notification['error']({
            message: '系统通知',
            description: '请先选择一条数据'
          })
          reject()
        }
        resolve(this.selectedTags)
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
