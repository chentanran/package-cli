<template>
  <div>
    <a-layout>
      <a-layout-header>
        <div>乐高</div>
      </a-layout-header>
      <a-layout-content>
				<div class="content">
					<a-layout>
							<a-layout-sider>Sider</a-layout-sider>
							<a-layout-content>
								<div :style="{ background: '#fff', padding: '24px', minHeight: '450px' }">Content</div>
							</a-layout-content>
							<a-layout-sider>Sider</a-layout-sider>
					</a-layout>
				</div>
			</a-layout-content>
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
  min-height: 500px;
}
.content .ant-layout-content {
	padding: 16px;
}
#app .ant-layout-sider {
  color: #fff;
  background: #3ba0e9;
}
</style>
