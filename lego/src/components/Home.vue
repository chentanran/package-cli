<template>
  <div>
    <a-layout>
      <a-layout-header>
        <div>乐高</div>
      </a-layout-header>
      <a-layout-content>内容区</a-layout-content>
      <a-layout-footer>Footer</a-layout-footer>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Home',
  props: {
    msg: String,
  },
});
</script>

<style scoped>
#app .ant-layout-header,
#app .ant-layout-footer {
  color: #000;
  background: #fff;
}
#app .ant-layout-footer {
  text-align: center;
}
#app .ant-layout-content {
  min-height: 300px;
}
</style>
