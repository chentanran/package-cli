<template>
<div class="content-container">
  <Upload action="test.url" />
  <template-list :list="testData"></template-list>
</div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
// import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store/index'
import TemplateList from '../components/TemplateList.vue'
import Upload from '../components/Upload.vue'
export default defineComponent({
  components: {
    TemplateList,
    Upload
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const testData = computed(() => store.state.templates.data)
    return {
      testData
    }
  }
})
</script>

<style>
.page-title {
  color: #fff;
}
.content-container {
  background: #fff;
  padding: 0 24px 24px 30px;
  min-height: 85vh;
  max-width: 1200px;
  margin: 50px auto;
  width: 100%;
}
</style>