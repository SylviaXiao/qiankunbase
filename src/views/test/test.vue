<template>
  <div class="containerBox">
    <div id="container"></div>
  </div>
</template>
<script>
export default {
  name: 'test',
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>
<style lang="less">
.containerBox {
  height: calc(100vh - 220px);
  position: relative;
  #container {
    height: calc(100% - 50px);
  }
}
</style>
