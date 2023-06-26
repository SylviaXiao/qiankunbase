<template>
  <!-- class="paidBankList-model-wrapper" -->
  <div>
    <a-table ref="table" :columns="columns" :data-source="dataList" :pagination="false"> </a-table>
  </div>
</template>

<script>
const columns = [
  {
    title: '付款分馆',
    dataIndex: 'school',
    customRender: text => {
      return text.name
    }
  },
  {
    title: '打款账户',
    dataIndex: 'bank',
    customRender: text => {
      return text.name
    }
  },
  {
    title: '金额',
    dataIndex: 'money'
  }
]
export default {
  name: 'paidBankList',
  components: {},
  props: {
    //所有付款分馆、金额、打款账户列表
    dataList: {
      type: Array,
      default: () => []
    }
  },
  computed: {},
  data() {
    return {
      columns
    }
  },
  created() {
  },
  methods: {}
}
</script>

<style lang="less" type="text/less" scoped></style>
