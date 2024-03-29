<template>
<div class="editor-container">
  <a-layout>
    <a-layout-sider width="300" style="background: #fff">
      <div class="sidebar-container">
        组件列表
        <components-list :list="defaultTextTemplates" @on-item-click="addItem" />
      </div>
    </a-layout-sider>
    <a-layout style="padding: 0 24px 24px">
      <a-layout-content class="preview-container">
        <p>画布区域</p>
        <div class="preview-list" id="canvas-area">
          <EditWrapper 
            v-for="component in components" 
            :key="component.id"
            :id="component.id"
            :active="component.id === (currentElement && currentElement.id)"
            @set-active="setActive"
          >
            <Component
              :is="component.name"
              v-bind="component.props"
            />
          </EditWrapper>
        </div>
      </a-layout-content>
    </a-layout>
    <a-layout-sider width="300" style="background: #fff" class="settings-panel">
      组件属性
      <PropsTable 
        v-if="currentElement && currentElement.id"
        :props="currentElement.props"
        @change="handleChange"
      />
    </a-layout-sider>  
  </a-layout>
</div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store/index'
import LText from '../components/LText.vue'
import ComponentsList from '../components/ComponentsList.vue'
import { defaultTextTemplates } from '../defaultTemplates'
import { CommonComponentProps } from '../defaultProps'
import EditWrapper from '../components/EditWrapper.vue'
import { ComponentData } from '../store/editor' 
import PropsTable from '../components/PropsTable.vue'

export default defineComponent({
  components: {
    LText,
    ComponentsList,
    EditWrapper,
    PropsTable
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const components = computed(() => store.state.editor.components)
    const currentElement = computed<ComponentData | null>(() => store.getters.getCurrentElement)
    const addItem = (props: CommonComponentProps) => {
      store.commit('addComponent', props)
    }
    const setActive = (id: string) => {
      store.commit('setActive', id)
    }
    const handleChange = (e: any) => {
      console.log(e, 'e')
      store.commit('updateComponent', e)
    }
    return {
      components,
      addItem,
      defaultTextTemplates,
      setActive,
      currentElement,
      handleChange
    }
  }
})
</script>

<style>
.editor-container .preview-container {
  padding: 24px;
  margin: 0;
  min-height: 85vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.editor-container .preview-list {
  padding: 0;
  margin: 0;
  min-width: 375px;
  min-height: 200px;
  border: 1px solid #efefef;
  background: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  margin-top: 50px;
  max-height: 80vh;
}
</style>